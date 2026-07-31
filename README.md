# PennyFlow 💰

PennyFlow is a full-stack personal expense tracker that helps users manage their daily expenses, categorize spending, and gain insights into their financial habits.

---

## 🚀 Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- Passlib (bcrypt)
- JWT Authentication
- Python-dotenv

### Frontend
- React
- TypeScript
- Tailwind CSS
- Recharts (Charts & Analytics)
- Indian Rupee (Rs.) currency formatting

---

## ✨ Features

### ✅ Completed
- PostgreSQL Database Setup
- SQLAlchemy ORM Integration
- User Registration (Signup)
- Secure Password Hashing (bcrypt)
- User Login
- JWT Authentication
- Protected Routes
- Get Current Logged-in User (`/auth/me`)
- Environment Variable Configuration (.env)
- Interactive API Documentation (Swagger UI)
- Expense CRUD APIs
- Expense Filtering
- Expense Sorting

### ✅ Completed
- Expense Summary API
- Dashboard Page with Charts
- Frontend Setup (React + TypeScript + Tailwind)
- Indian Rupee (Rs.) currency display
- Budget Goals (monthly budget, CRUD, progress, warning state)

### 🚧 In Progress
- Category Management

---

## 📂 Project Structure

```text
PennyFlow/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── expenses.py
│   │   ├── services/
│   │   │   └── auth_service.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   ├── utils.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Ashlesa12/PennyFlow.git
```

### Navigate to the backend

```bash
cd PennyFlow/backend
```

### Create a virtual environment

```bash
python -m venv venv
```

### Activate the virtual environment

#### Windows

```bash
venv\Scripts\activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the `backend` folder.

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/pennyflow_db

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Run the server

```bash
uvicorn app.main:app --reload
```

Open Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

## 🔐 Authentication

PennyFlow uses **JWT (JSON Web Token)** authentication.

Current authentication flow:

- User Signup
- User Login
- Password Hashing with bcrypt
- JWT Access Token Generation
- Protected Routes using OAuth2
- Current User Endpoint (`/auth/me`)

---

## 📅 Development Progress

### ✅ Day 1
- PostgreSQL setup
- SQLAlchemy configuration
- Database models
- User Signup API
- Password hashing
- Database integration

### ✅ Day 2
- User Login API
- JWT Authentication
- Access Token Generation
- Protected Routes
- `/auth/me` endpoint
- OAuth2 Password Flow
- Swagger Authentication
- Security module
- Environment configuration
- Git & GitHub cleanup (.env and .gitignore)

---

## 🛣️ Roadmap

- [x] PostgreSQL Setup
- [x] FastAPI Setup
- [x] User Registration
- [x] User Login
- [x] JWT Authentication
- [x] Protected Routes
- [x] Expense CRUD
- [ ] Categories
- [x] Dashboard APIs
- [x] React Frontend
- [x] Charts & Analytics
- [x] Budget Goals
- [ ] Deployment

---

## 👩‍💻 Author

**Ashlesa Amatya**

BSc CSIT Student | Python & Full Stack Developer

Building **PennyFlow** as a portfolio project to learn modern backend development with FastAPI, PostgreSQL, JWT Authentication, and React.