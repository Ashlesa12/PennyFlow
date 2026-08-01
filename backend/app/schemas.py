from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from decimal import Decimal
from typing import Literal, Optional

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


class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None


Currency = Literal["NPR", "USD", "EUR", "GBP", "INR"]
DateFormat = Literal["YYYY-MM-DD", "DD-MM-YYYY", "MM/DD/YYYY", "DD/MM/YYYY"]
Theme = Literal["Light", "Dark", "System"]


class UserPreferences(BaseModel):
    currency: Currency
    date_format: DateFormat
    theme: Theme


class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str


class UserProfileResponse(UserResponse):
    avatar_url: Optional[str] = None
    currency: str = "NPR"
    date_format: str = "YYYY-MM-DD"
    theme: str = "Light"


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

class CategoryResponse(BaseModel):
    id: int
    name: str
    icon: str | None = None

    class Config:
        from_attributes = True


class IncomeCreate(BaseModel):
    title: str
    amount: Decimal
    income_date: date


class IncomeUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    income_date: Optional[date] = None


class IncomeResponse(BaseModel):
    id: int
    title: str
    amount: Decimal
    income_date: date
    user_id: int

    class Config:
        from_attributes = True


class IncomeSummary(BaseModel):
    total_incomes: int
    total_amount: float
    average_income: float
    highest_income: float
    lowest_income: float


class BudgetCreate(BaseModel):
    amount: Decimal
    month: Optional[str] = None


class BudgetUpdate(BaseModel):
    amount: Decimal


class BudgetResponse(BaseModel):
    id: int
    month: str
    amount: Decimal
    spent: float
    remaining: float
    percentage: float

    class Config:
        from_attributes = True


RecurringFrequency = Literal["Daily", "Weekly", "Monthly", "Yearly"]


class RecurringExpenseCreate(BaseModel):
    title: str
    amount: Decimal = Field(gt=0)
    category_id: int
    frequency: RecurringFrequency
    start_date: date
    next_due_date: Optional[date] = None


class RecurringExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = Field(default=None, gt=0)
    category_id: Optional[int] = None
    frequency: Optional[RecurringFrequency] = None
    start_date: Optional[date] = None
    next_due_date: Optional[date] = None


class RecurringExpenseResponse(BaseModel):
    id: int
    title: str
    amount: Decimal
    category_id: int
    frequency: str
    start_date: date
    next_due_date: date
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True