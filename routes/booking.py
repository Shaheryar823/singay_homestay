from flask import Blueprint, request, render_template
from datetime import datetime
from services.room_manager import RoomManager
import json

booking_bp = Blueprint("booking", __name__)
manager = RoomManager()

@booking_bp.route("/check-availability", methods=["POST"])
def check_availability():
    room_type = request.form.get("room_type")
    checkin = request.form.get("check_in")
    checkout = request.form.get("check_out")

    # Convert dates
    try:
        d1 = datetime.strptime(checkin, "%Y-%m-%d").date()
        d2 = datetime.strptime(checkout, "%Y-%m-%d").date()
        nights = max((d2 - d1).days, 1)
    except:
        return "Invalid date", 400

    # Get available rooms
    available_rooms = manager.available_between(
        check_in=d1,
        check_out=d2,
        selection=room_type
    )

    print("Availability Check:", room_type, checkin, checkout, nights, [r.name for r in available_rooms])

    return render_template(
        "availability.html",
        rooms=available_rooms,
        checkin=checkin,
        checkout=checkout,
        nights=nights,
        room_type=room_type
    )

@booking_bp.route("/booking",  methods=["POST"])
def booking():
    # Use request.form for POST
    room_id = [int(i) for i in json.loads(request.form.get("room_id"))]
    print(room_id)
    checkin = request.form.get("check_in")
    checkout = request.form.get("check_out")
    nights = request.form.get("nights")
    
    rooms = [manager.by_id(r) for r in room_id]
    total = sum(r.price for r in rooms)

    if not all([room_id, checkin, checkout, nights]):
        return "Missing parameters", 400
    


    return render_template("booking.html",total= total*int(nights), rooms= rooms, check_in = checkin, check_out = checkout, nights = nights)

