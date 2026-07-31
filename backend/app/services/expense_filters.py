from datetime import date
from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Query

from app.models import Category, Expense


def apply_expense_filters(
    query: Query,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> Query:

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

    return query
