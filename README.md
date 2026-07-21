# PennyFlow 💰

PennyFlow is a full-stack personal expense tracker that helps users manage their daily expenses and categorize their spending.

## 🚀 Tech Stack

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Pydantic
- Passlib (bcrypt)
- JWT Authentication (Coming Soon)

### Frontend
- React
- TypeScript
- Tailwind CSS *(Coming Soon)*

---

## ✨ Features

### Completed
- PostgreSQL Database Setup
- User Signup API
- Password Hashing
- SQLAlchemy Integration
- FastAPI Backend

### In Progress
- User Login
- JWT Authentication
- Expense CRUD APIs
- Dashboard

---

## 📂 Project Structure

```text
PennyFlow/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── utils.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/Ashlesa12/PennyFlow.git
```

Go into the project:

```bash
cd PennyFlow/backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it:

Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the server:

```bash
uvicorn app.main:app --reload
```

Open Swagger:

```
http://127.0.0.1:8000/docs
```

---

## 📅 Roadmap

- [x] PostgreSQL Setup
- [x] FastAPI Setup
- [x] User Registration
- [ ] User Login
- [ ] JWT Authentication
- [ ] Expense CRUD
- [ ] Categories
- [ ] Dashboard
- [ ] React Frontend

---  

## 👩‍💻 Author

**Ashlesa Amatya** 

