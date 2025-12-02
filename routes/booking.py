from flask import Blueprint, request, render_template
from models.rooms import Room
from config.database import db

booking_bp = Blueprint("booking", __name__)

@booking_bp.route("/check-availability", methods=["POST"])
def check_availability():
    room_type = request.form.get("room_type")
    
    # First, get all rooms
    rooms = Room.query.all()
    print(r for r in rooms)

    # Filter available rooms excluding unavailable types
    available_rooms = rooms
    if not available_rooms:
        return "No rooms available for the selected type or dates."

    return render_template("availability.html", rooms=available_rooms)
