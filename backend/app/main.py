from fastapi import FastAPI
# Add this import line right here 👇
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes.auth import router as auth_router
from .routes.budgets import router as budgets_router
from .routes.categories import router as categories_router
from .routes.dashboard import router as dashboard_router
from .routes.expenses import router as expense_router
from .routes.income import router as income_router
from .routes.recurring import router as recurring_router
from .routes.export import router as export_router
from .routes.users import router as users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PennyFlow API",
    swagger_ui_parameters={"persistAuthorization": True}
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # Crucial for Authorization Bearer token!
)

app.include_router(auth_router)
app.include_router(budgets_router)
app.include_router(categories_router)
app.include_router(dashboard_router)
app.include_router(expense_router)
app.include_router(income_router)
app.include_router(recurring_router)
app.include_router(export_router)
app.include_router(users_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to PennyFlow 🚀"
    }