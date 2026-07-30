from app.database import engine


def migrate():
    with engine.connect() as conn:
        conn.execute(
            "ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon VARCHAR"
        )
        conn.commit()
        print("✅ Added 'icon' column to categories table.")


if __name__ == "__main__":
    migrate()
