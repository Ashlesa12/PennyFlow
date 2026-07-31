import calendar
from datetime import date, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Category, Expense, RecurringExpense, User
from app.schemas import (
    RecurringExpenseCreate,
    RecurringExpenseResponse,
    RecurringExpenseUpdate,
)
from app.security import get_current_user

router = APIRouter(
    prefix="/recurring",
    tags=["Recurring Expenses"],
)


def add_months(value: date, months: int) -> date:
    month_index = value.month - 1 + months
    year = value.year + month_index // 12
    month = month_index % 12 + 1
    day = min(value.day, calendar.monthrange(year, month)[1])
    return date(year, month, day)


def advance_next_due_date(current: date, frequency: str) -> date:
    if frequency == "Daily":
        return current + timedelta(days=1)
    if frequency == "Weekly":
        return current + timedelta(days=7)
    if frequency == "Monthly":
        return add_months(current, 1)
    if frequency == "Yearly":
        try:
            return current.replace(year=current.year + 1)
        except ValueError:
            return date(current.year + 1, 2, 28)
    raise HTTPException(
        status_code=422,
        detail="Frequency must be Daily, Weekly, Monthly or Yearly",
    )


def get_recurring_or_404(
    db: Session,
    current_user: User,
    recurring_id: int,
) -> RecurringExpense:
    recurring = (
        db.query(RecurringExpense)
        .filter(
            RecurringExpense.id == recurring_id,
            RecurringExpense.user_id == current_user.id,
        )
        .first()
    )
    if not recurring:
        raise HTTPException(
            status_code=404,
            detail="Recurring expense not found",
        )
    return recurring


def validate_category(db: Session, category_id: int) -> None:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=422,
            detail="Category not found",
        )


@router.get("/", response_model=list[RecurringExpenseResponse])
def list_recurring_expenses(
    search: Optional[str] = None,
    frequency: Optional[str] = None,
    is_active: Optional[bool] = None,
    sort: Optional[str] = "due",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(RecurringExpense).filter(
        RecurringExpense.user_id == current_user.id
    )

    if search:
        query = query.filter(RecurringExpense.title.ilike(f"%{search}%"))

    if frequency:
        if frequency not in {"Daily", "Weekly", "Monthly", "Yearly"}:
            raise HTTPException(
                status_code=422,
                detail="Frequency must be Daily, Weekly, Monthly or Yearly",
            )
        query = query.filter(RecurringExpense.frequency == frequency)

    if is_active is not None:
        query = query.filter(RecurringExpense.is_active == int(is_active))

    sort_map = {
        "due": RecurringExpense.next_due_date.asc(),
        "due_desc": RecurringExpense.next_due_date.desc(),
        "amount_desc": RecurringExpense.amount.desc(),
        "amount_asc": RecurringExpense.amount.asc(),
        "title": RecurringExpense.title.asc(),
    }
    order_by = sort_map.get(sort or "due", RecurringExpense.next_due_date.asc())
    query = query.order_by(order_by, RecurringExpense.created_at.desc())

    return query.all()


@router.get("/{recurring_id}", response_model=RecurringExpenseResponse)
def get_recurring_expense(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_recurring_or_404(db, current_user, recurring_id)


@router.post(
    "/",
    response_model=RecurringExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_recurring_expense(
    recurring_data: RecurringExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_category(db, recurring_data.category_id)

    next_due_date = recurring_data.next_due_date or recurring_data.start_date

    recurring = RecurringExpense(
        user_id=current_user.id,
        title=recurring_data.title.strip(),
        amount=recurring_data.amount,
        category_id=recurring_data.category_id,
        frequency=recurring_data.frequency,
        start_date=recurring_data.start_date,
        next_due_date=next_due_date,
        is_active=1,
    )

    db.add(recurring)
    db.commit()
    db.refresh(recurring)

    return recurring


@router.put("/{recurring_id}", response_model=RecurringExpenseResponse)
def update_recurring_expense(
    recurring_id: int,
    recurring_data: RecurringExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring = get_recurring_or_404(db, current_user, recurring_id)

    if recurring_data.title is not None:
        recurring.title = recurring_data.title.strip()
    if recurring_data.amount is not None:
        recurring.amount = recurring_data.amount
    if recurring_data.category_id is not None:
        validate_category(db, recurring_data.category_id)
        recurring.category_id = recurring_data.category_id
    if recurring_data.start_date is not None:
        recurring.start_date = recurring_data.start_date

    if recurring_data.next_due_date is not None:
        recurring.next_due_date = recurring_data.next_due_date
    elif recurring_data.frequency is not None and recurring_data.frequency != recurring.frequency:
        recurring.frequency = recurring_data.frequency
        recurring.next_due_date = advance_next_due_date(
            recurring.next_due_date,
            recurring.frequency,
        )
    elif recurring_data.frequency is not None:
        recurring.frequency = recurring_data.frequency

    db.commit()
    db.refresh(recurring)

    return recurring


@router.post("/{recurring_id}/complete", response_model=RecurringExpenseResponse)
def complete_recurring_expense(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring = get_recurring_or_404(db, current_user, recurring_id)

    if not recurring.is_active:
        raise HTTPException(
            status_code=409,
            detail="Paused recurring expense cannot be completed",
        )

    if recurring.next_due_date > date.today():
        raise HTTPException(
            status_code=409,
            detail="This occurrence has already been completed for today",
        )

    expense = Expense(
        title=recurring.title,
        amount=recurring.amount,
        expense_date=date.today(),
        category_id=recurring.category_id,
        user_id=current_user.id,
    )

    recurring.next_due_date = advance_next_due_date(
        recurring.next_due_date,
        recurring.frequency,
    )

    db.add(expense)
    db.commit()
    db.refresh(recurring)

    return recurring


@router.patch("/{recurring_id}/toggle", response_model=RecurringExpenseResponse)
def toggle_recurring_expense(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring = get_recurring_or_404(db, current_user, recurring_id)

    recurring.is_active = 0 if recurring.is_active else 1

    db.commit()
    db.refresh(recurring)

    return recurring


@router.delete("/{recurring_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recurring_expense(
    recurring_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recurring = get_recurring_or_404(db, current_user, recurring_id)

    db.delete(recurring)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
