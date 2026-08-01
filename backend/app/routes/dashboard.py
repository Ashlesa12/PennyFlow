from typing import Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract, func

from app.database import get_db
from app.models import Expense, Income, User
from app.security import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def validate_period(month: Optional[int], year: Optional[int]) -> None:
    if month is not None and not 1 <= month <= 12:
        raise HTTPException(
            status_code=422,
            detail="Month must be between 1 and 12"
        )
    if year is not None and year < 1970:
        raise HTTPException(
            status_code=422,
            detail="Year must be 1970 or later"
        )


@router.get("/stats")
def get_dashboard_stats(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    validate_period(month, year)

    expense_query = db.query(
        func.count(Expense.id),
        func.coalesce(func.sum(Expense.amount), 0),
    ).filter(Expense.user_id == current_user.id)

    income_query = db.query(
        func.count(Income.id),
        func.coalesce(func.sum(Income.amount), 0),
    ).filter(Income.user_id == current_user.id)

    if month is not None:
        expense_query = expense_query.filter(
            extract("month", Expense.expense_date) == month
        )
        income_query = income_query.filter(
            extract("month", Income.income_date) == month
        )

    if year is not None:
        expense_query = expense_query.filter(
            extract("year", Expense.expense_date) == year
        )
        income_query = income_query.filter(
            extract("year", Income.income_date) == year
        )

    expense_totals = expense_query.one()
    income_totals = income_query.one()

    total_expenses = float(expense_totals[1])
    total_income = float(income_totals[1])

    return {
        "month": month,
        "year": year,
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "balance": round(total_income - total_expenses, 2),
        "income_count": income_totals[0],
        "expense_count": expense_totals[0],
    }
