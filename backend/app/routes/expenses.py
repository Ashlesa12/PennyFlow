from typing import List, Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, or_
from app.schemas import (
    ExpenseCreate,
    ExpenseResponse,
    ExpenseUpdate,
    ExpenseSummary,
    CategorySummary,
    MonthlySummary,
)

from app.database import get_db
from app.models import Expense, User, Category
from app.security import get_current_user

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_expense = Expense(
        title=expense.title,
        amount=expense.amount,
        expense_date=expense.expense_date,
        category_id=expense.category_id,
        user_id=current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense


@router.get("/", response_model=List[ExpenseResponse])
def get_expenses(
    category_id: Optional[int] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = None,
    order: str = "desc",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Expense).filter(
        Expense.user_id == current_user.id
    )

    # Search filter (title + category name)
    if search:
        query = query.join(Category).filter(
            or_(
                Expense.title.ilike(f"%{search}%"),
                Category.name.ilike(f"%{search}%"),
            )
        )

    # Category filter
    if category_id is not None:
        query = query.filter(
            Expense.category_id == category_id
        )

    # Minimum amount
    if min_amount is not None:
        query = query.filter(
            Expense.amount >= min_amount
        )

    # Maximum amount
    if max_amount is not None:
        query = query.filter(
            Expense.amount <= max_amount
        )

    # Start date
    if start_date is not None:
        query = query.filter(
            Expense.expense_date >= start_date
        )

    # End date
    if end_date is not None:
        query = query.filter(
            Expense.expense_date <= end_date
        )

    # Sorting
    sortable_columns = {
        "amount": Expense.amount,
        "date": Expense.expense_date,
        "created_at": Expense.created_at,
        "title": Expense.title
    }

    if sort_by:

        if sort_by not in sortable_columns:
            raise HTTPException(
                status_code=400,
                detail="Invalid sort field"
            )

        column = sortable_columns[sort_by]

        if order.lower() == "desc":
            query = query.order_by(desc(column))
        else:
            query = query.order_by(column)

    else:
        # Default sorting (Newest first)
        query = query.order_by(desc(Expense.expense_date))

    return query.all()

@router.get("/summary", response_model=ExpenseSummary)
def get_expense_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    summary = (
        db.query(
            func.count(Expense.id),
            func.coalesce(func.sum(Expense.amount), 0),
            func.coalesce(func.avg(Expense.amount), 0),
            func.coalesce(func.max(Expense.amount), 0),
            func.coalesce(func.min(Expense.amount), 0),
        )
        .filter(Expense.user_id == current_user.id)
        .first()
    )

    return ExpenseSummary(
        total_expenses=summary[0],
        total_amount=float(summary[1]),
        average_expense=float(summary[2]),
        highest_expense=float(summary[3]),
        lowest_expense=float(summary[4]),
    )


@router.get("/category-summary", response_model=List[CategorySummary])
def get_category_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    category_totals = (
        db.query(
            Category.name.label("category"),
            func.sum(Expense.amount).label("total")
        )
        .join(Category, Expense.category_id == Category.id)
        .filter(Expense.user_id == current_user.id)
        .group_by(Category.name)
        .order_by(func.sum(Expense.amount).desc())
        .all()
    )

    return [
        CategorySummary(
            category=row.category,
            total=float(row.total)
        )
        for row in category_totals
    ]

@router.get("/monthly-summary", response_model=List[MonthlySummary])
def get_monthly_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    month = func.to_char(Expense.expense_date, "YYYY-MM").label("month")

    monthly_totals = (
        db.query(
            month,
            func.sum(Expense.amount).label("total")
        )
        .filter(
            Expense.user_id == current_user.id
        )
        .group_by(month)
        .order_by(month)
        .all()
    )

    return [
        MonthlySummary(
            month=row.month,
            total=float(row.total)
        )
        for row in monthly_totals
    ]

@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        )
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        )
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    update_data = expense_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)

    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    expense = (
        db.query(Expense)
        .filter(
            Expense.id == expense_id,
            Expense.user_id == current_user.id
        )
        .first()
    )

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(expense)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

