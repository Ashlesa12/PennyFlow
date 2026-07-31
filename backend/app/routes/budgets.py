import re
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Budget, Expense, User
from app.schemas import BudgetCreate, BudgetResponse, BudgetUpdate
from app.security import get_current_user

router = APIRouter(
    prefix="/budgets",
    tags=["Budgets"]
)

MONTH_PATTERN = re.compile(r"^\d{4}-\d{2}$")


def current_month() -> str:
    return date.today().strftime("%Y-%m")


def validate_month(month: str) -> str:
    if not MONTH_PATTERN.match(month):
        raise HTTPException(
            status_code=422,
            detail="Month must be in YYYY-MM format"
        )
    return month


def calculate_progress(budget: Budget, db: Session, user: User) -> BudgetResponse:
    spent_total = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.user_id == user.id,
            func.to_char(Expense.expense_date, "YYYY-MM") == budget.month
        )
        .scalar()
    )

    spent = float(spent_total)
    amount = float(budget.amount)

    if amount > 0:
        percentage = round((spent / amount) * 100, 2)
    else:
        percentage = 100.0 if spent > 0 else 0.0

    return BudgetResponse(
        id=budget.id,
        month=budget.month,
        amount=budget.amount,
        spent=round(spent, 2),
        remaining=round(amount - spent, 2),
        percentage=percentage,
    )


@router.get("/", response_model=BudgetResponse)
def get_budget(
    month: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_month = validate_month(month) if month else current_month()

    budget = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.month == target_month
        )
        .first()
    )

    if not budget:
        raise HTTPException(
            status_code=404,
            detail="No budget set for this month"
        )

    return calculate_progress(budget, db, current_user)


@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    budget_data: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_month = validate_month(budget_data.month) if budget_data.month else current_month()

    if budget_data.amount <= 0:
        raise HTTPException(
            status_code=422,
            detail="Budget amount must be greater than zero"
        )

    existing = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.month == target_month
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="A budget already exists for this month"
        )

    budget = Budget(
        user_id=current_user.id,
        month=target_month,
        amount=budget_data.amount,
    )

    db.add(budget)
    db.commit()
    db.refresh(budget)

    return calculate_progress(budget, db, current_user)


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    budget_data: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if budget_data.amount <= 0:
        raise HTTPException(
            status_code=422,
            detail="Budget amount must be greater than zero"
        )

    budget = (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == current_user.id
        )
        .first()
    )

    if not budget:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    budget.amount = budget_data.amount
    db.commit()
    db.refresh(budget)

    return calculate_progress(budget, db, current_user)


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    budget = (
        db.query(Budget)
        .filter(
            Budget.id == budget_id,
            Budget.user_id == current_user.id
        )
        .first()
    )

    if not budget:
        raise HTTPException(
            status_code=404,
            detail="Budget not found"
        )

    db.delete(budget)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
