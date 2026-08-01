from typing import List, Optional
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.schemas import (
    IncomeCreate,
    IncomeResponse,
    IncomeSummary,
    IncomeUpdate,
)

from app.database import get_db
from app.models import Income, User
from app.security import get_current_user

router = APIRouter(
    prefix="/income",
    tags=["Income"]
)


@router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    income: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_income = Income(
        title=income.title,
        amount=income.amount,
        income_date=income.income_date,
        user_id=current_user.id
    )

    db.add(new_income)
    db.commit()
    db.refresh(new_income)

    return new_income


@router.get("/", response_model=List[IncomeResponse])
def get_incomes(
    month: Optional[int] = None,
    year: Optional[int] = None,
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

    query = db.query(Income).filter(
        Income.user_id == current_user.id
    )

    if search:
        query = query.filter(Income.title.ilike(f"%{search}%"))

    if min_amount is not None:
        query = query.filter(Income.amount >= min_amount)

    if max_amount is not None:
        query = query.filter(Income.amount <= max_amount)

    if start_date is not None:
        query = query.filter(Income.income_date >= start_date)

    if end_date is not None:
        query = query.filter(Income.income_date <= end_date)

    if month is not None:
        query = query.filter(func.extract("month", Income.income_date) == month)

    if year is not None:
        query = query.filter(func.extract("year", Income.income_date) == year)

    sortable_columns = {
        "amount": Income.amount,
        "date": Income.income_date,
        "created_at": Income.created_at,
        "title": Income.title
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
        query = query.order_by(desc(Income.income_date))

    return query.all()


@router.get("/summary", response_model=IncomeSummary)
def get_income_summary(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    summary_query = (
        db.query(
            func.count(Income.id),
            func.coalesce(func.sum(Income.amount), 0),
            func.coalesce(func.avg(Income.amount), 0),
            func.coalesce(func.max(Income.amount), 0),
            func.coalesce(func.min(Income.amount), 0),
        )
        .filter(Income.user_id == current_user.id)
    )

    if month is not None:
        summary_query = summary_query.filter(
            func.extract("month", Income.income_date) == month
        )

    if year is not None:
        summary_query = summary_query.filter(
            func.extract("year", Income.income_date) == year
        )

    summary = summary_query.first()

    return IncomeSummary(
        total_incomes=summary[0],
        total_amount=float(summary[1]),
        average_income=float(summary[2]),
        highest_income=float(summary[3]),
        lowest_income=float(summary[4]),
    )


@router.get("/{income_id}", response_model=IncomeResponse)
def get_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    income = (
        db.query(Income)
        .filter(
            Income.id == income_id,
            Income.user_id == current_user.id
        )
        .first()
    )

    if not income:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    return income


@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    income_data: IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    income = (
        db.query(Income)
        .filter(
            Income.id == income_id,
            Income.user_id == current_user.id
        )
        .first()
    )

    if not income:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    update_data = income_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(income, key, value)

    db.commit()
    db.refresh(income)

    return income


@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    income = (
        db.query(Income)
        .filter(
            Income.id == income_id,
            Income.user_id == current_user.id
        )
        .first()
    )

    if not income:
        raise HTTPException(
            status_code=404,
            detail="Income not found"
        )

    db.delete(income)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
