from flask import Blueprint, request, render_template
from models.rooms import Room
from config.database import db
from services.room_manager import RoomManager
from datetime import datetime

booking_bp = Blueprint("booking", __name__)

@booking_bp.route("/check-availability", methods=["POST"])
def check_availability():
    room_type = request.form.get("room_type")
    checkin = request.form.get("check_in")
    checkout = request.form.get("check_out")

    # Convert to Python dates
    try:
        d1 = datetime.strptime(checkin, "%Y-%m-%d")
        d2 = datetime.strptime(checkout, "%Y-%m-%d")
        nights = (d2 - d1).days
        if nights < 1:
            nights = 1
    except:
        nights = 1

    # Filter rooms
    manager = RoomManager()
    available_rooms = manager.filter_by_user_selection(room_type)
    print(room_type,checkin,checkout,nights)

    # Pass everything to template
    return render_template(
        "availability.html",
        rooms=available_rooms,
        checkin=checkin,
        checkout=checkout,
        nights=nights,
        room_type = room_type
    )
