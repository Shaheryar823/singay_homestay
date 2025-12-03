from flask import Blueprint, request, render_template
from models.rooms import Room
from config.database import db
from services.room_manager import RoomManager

booking_bp = Blueprint("booking", __name__)

@booking_bp.route("/check-availability", methods=["POST"])
def check_availability():
    room_type = request.form.get("room_type")
    #print("Selected:", room_type)

    manager = RoomManager()

    # Debug print
    #for r in manager.all():
    #    print(f"room name : {r.name}, type: {r.room_type}, available: {r.is_available}")

    # Use OOP logic
    available_rooms = manager.filter_by_user_selection(room_type)

    return render_template("availability.html", rooms=available_rooms)