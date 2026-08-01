from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Budget, Expense, Income, RecurringExpense, User
from app.schemas import (
    ChangePassword,
    UserPreferences,
    UserProfileResponse,
    UserUpdate,
)
from app.security import get_current_user
from app.utils import hash_password, verify_password


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


def serialize_user(user: User) -> dict:
    """Build a profile payload, applying defaults for legacy rows
    whose preference columns are still NULL."""
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "currency": user.currency or "NPR",
        "date_format": user.date_format or "YYYY-MM-DD",
        "theme": user.theme or "Light",
    }


@router.get("/me", response_model=UserProfileResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.put("/me", response_model=UserProfileResponse)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.name is not None:
        name = payload.name.strip()
        if not name:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        current_user.name = name

    if payload.avatar_url is not None:
        avatar_url = payload.avatar_url.strip()
        current_user.avatar_url = avatar_url or None

    db.commit()
    db.refresh(current_user)
    return serialize_user(current_user)


@router.put("/me/preferences", response_model=UserProfileResponse)
def update_preferences(
    payload: UserPreferences,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.currency = payload.currency
    current_user.date_format = payload.date_format
    current_user.theme = payload.theme

    db.commit()
    db.refresh(current_user)
    return serialize_user(current_user)


@router.put("/me/change-password")
def change_password(
    payload: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, current_user.password):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect",
        )

    if payload.new_password != payload.confirm_new_password:
        raise HTTPException(
            status_code=400,
            detail="New passwords do not match",
        )

    if len(payload.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 6 characters",
        )

    if verify_password(payload.new_password, current_user.password):
        raise HTTPException(
            status_code=400,
            detail="New password must be different from the current password",
        )

    current_user.password = hash_password(payload.new_password)
    db.commit()

    return {"message": "Password updated successfully"}


@router.delete("/me", status_code=204)
def delete_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(Expense).filter(Expense.user_id == current_user.id).delete()
    db.query(Income).filter(Income.user_id == current_user.id).delete()
    db.query(Budget).filter(Budget.user_id == current_user.id).delete()
    db.query(RecurringExpense).filter(
        RecurringExpense.user_id == current_user.id
    ).delete()
    db.delete(current_user)
    db.commit()
