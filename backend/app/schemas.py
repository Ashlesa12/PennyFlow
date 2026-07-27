from pydantic import BaseModel, EmailStr
from datetime import date
from decimal import Decimal
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class ExpenseCreate(BaseModel):
    title: str
    amount: Decimal
    expense_date: date
    category_id: int


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    expense_date: Optional[date] = None
    category_id: Optional[int] = None


class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: Decimal
    expense_date: date
    user_id: int
    category_id: int

    class Config:
        from_attributes = True

class ExpenseSummary(BaseModel):
    total_expenses: int
    total_amount: float
    average_expense: float
    highest_expense: float
    lowest_expense: float

class CategorySummary(BaseModel):
    category: str
    total: float

class MonthlySummary(BaseModel):
    month: str
    total: float