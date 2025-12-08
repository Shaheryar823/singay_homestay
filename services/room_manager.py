from models.booking import Booking
from models.rooms import Room
from config.database import db
from sqlalchemy import and_
from datetime import date

class RoomManager:
    def __init__(self):
        pass

    # -------------------------
    # Fetch all rooms
    # -------------------------
    def all(self):
        return Room.query.all()

    # -------------------------
    # Normal rooms (exclude villa & family unit)
    # -------------------------
    def normal_rooms(self):
        excluded = ["Family Unit", "Full Villa"]
        return Room.query.filter(
            Room.is_available == True,
            Room.name.notin_(excluded)
        ).all()

    # -------------------------
    # Rooms by type
    # -------------------------
    def by_type(self, room_type):
        return Room.query.filter_by(
            room_type=room_type,
            is_available=True
        ).all()

    # -------------------------
    # Filter by frontend selection
    # -------------------------
    def filter_by_user_selection(self, selection):
        """
        selection: "room", "villa", "family unit"
        """
        if selection == "room":
            return self.normal_rooms()
        elif selection in ["villa", "family unit"]:
            return self.by_type(selection)
        else:
            # fallback: all rooms
            return self.all()

    # -------------------------
    # Check availability between dates
    # -------------------------
    def available_between(self, check_in, check_out, selection=None):
        # Get overlapping bookings
        overlapping = Booking.query.filter(
            and_(Booking.check_in < check_out,
                Booking.check_out > check_in)
        ).all()

        booked_ids = {b.room_id for b in overlapping}
        booked_rooms = Room.query.filter(Room.id.in_(booked_ids)).all()
        booked_names = {r.name for r in booked_rooms}

        # Groups
        ROOMS = {"Couple Room", "Double Room", "Twin Room", "Double Twin Room", "Family Room"}
        FAMILY_UNIT = "Family Unit"
        VILLA = "Full Villa"

        query = Room.query

        # ------------------------------------------------------------------
        # 1️⃣ USER SELECTS FAMILY UNIT
        # ------------------------------------------------------------------
        if selection == "family-unit":

            # Hide these if booked
            hide_if_booked = {VILLA, "Couple Room", "Double Room"}

            # If any of these are booked → hide them
            if booked_names & hide_if_booked:
                query = query.filter(Room.name.notin_(hide_if_booked))

            # Show Family Unit + allowed rooms
            allowed = {FAMILY_UNIT, "Twin Room", "Double Twin Room", "Family Room"}
            query = query.filter(Room.name.in_(allowed))

            # Also remove booked items
            if booked_ids:
                query = query.filter(Room.id.notin_(booked_ids))

            return query.all()

        # ------------------------------------------------------------------
        # 2️⃣ USER SELECTS FULL VILLA
        # ------------------------------------------------------------------
        if selection == "villa":
            # If ANY family unit OR ANY room booked → hide villa
            if booked_names & ({FAMILY_UNIT} | ROOMS):
                return []

            # Otherwise only show villa
            return Room.query.filter(Room.name == VILLA).all()

        # ------------------------------------------------------------------
        # 3️⃣ USER SELECTS ROOM
        # ------------------------------------------------------------------
        if selection == "room":

    # If full villa is booked → hide EVERYTHING
            if VILLA in booked_names:
                return []

            # Start with all normal rooms
            allowed_rooms = set(ROOMS)

            # If family unit is booked → remove Couple + Double Room
            if FAMILY_UNIT in booked_names:
                allowed_rooms -= {"Couple Room", "Double Room"}

            # Apply allowed rooms
            query = query.filter(Room.name.in_(allowed_rooms))


        # ------------------------------------------------------------------
        # DEFAULT: fallback
        # ------------------------------------------------------------------
        if booked_ids:
            query = query.filter(Room.id.notin_(booked_ids))

        return query.all()



    # -------------------------
    # Update Room.is_available automatically
    # -------------------------
    def update_availability_status(self, check_in: date, check_out: date):
        overlapping = Booking.query.filter(
            and_(
                Booking.check_in < check_out,
                Booking.check_out > check_in
            )
        ).all()
        booked_ids = {b.room_id for b in overlapping}

        rooms = Room.query.all()
        for room in rooms:
            room.is_available = room.id not in booked_ids

        db.session.commit()
