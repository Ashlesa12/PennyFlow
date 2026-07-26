from fastapi import FastAPI

from .database import Base, engine
from .routes.auth import router as auth_router
from .routes.expenses import router as expense_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PennyFlow API",
    swagger_ui_parameters={"persistAuthorization": True}  # <-- Add this
)

app.include_router(auth_router)
app.include_router(expense_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to PennyFlow 🚀"
    }