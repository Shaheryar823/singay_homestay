from config.database import db

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    room_type = db.Column(db.String(50))  # single, twin, family, villa
    capacity = db.Column(db.Integer)
    price = db.Column(db.Integer)
    bathroom_type = db.Column(db.String(20))  # private/shared
    is_available = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(255))  # NEW: image path
