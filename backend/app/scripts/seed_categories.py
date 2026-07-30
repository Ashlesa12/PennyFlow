from app.database import SessionLocal
from app.models import Category

db = SessionLocal()

categories = [
    ("Food", "🍔"),
    ("Transport", "🚌"),
    ("Shopping", "🛍️"),
    ("Bills", "💡"),
    ("Entertainment", "🎮"),
    ("Health", "💊"),
    ("Education", "📚"),
    ("Other", "📦"),
]

for name, icon in categories:
    exists = db.query(Category).filter(Category.name == name).first()

    if not exists:
        db.add(Category(name=name, icon=icon))

db.commit()
db.close()

print("✅ Categories seeded successfully!")