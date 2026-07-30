from fastapi import FastAPI
# Add this import line right here 👇
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes.auth import router as auth_router
from .routes.categories import router as categories_router
from .routes.expenses import router as expense_router

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
app.include_router(categories_router)
app.include_router(expense_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to PennyFlow 🚀"
    }