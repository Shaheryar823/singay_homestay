from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

db = SQLAlchemy()
migrate = Migrate()

def init_db(app):
    db_url = os.getenv("DATABASE_URL")

    # Check if running on Railway
    on_railway = os.getenv("RAILWAY_ENVIRONMENT") is not None  # Railway sets this env var

    # Local fallback (for local development)
    if not db_url:
        db_url = "postgresql://postgres:singay123@localhost:5432/singay_db"  # replace with your local DB

    # Railway uses "postgres://" — SQLAlchemy needs "postgresql://"
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    # Only auto-create tables on Railway (first-time deployment)
    if on_railway:
        with app.app_context():
            db.create_all()
