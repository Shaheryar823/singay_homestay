from models.rooms import Room

class RoomManager:
    def __init__(self):
        pass

    # -------------------------
    # Fetch all rooms
    # -------------------------
    def all(self):
        return Room.query.all()

    # -------------------------
    # Rooms except villa & family unit
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
    # Business rules for special logic
    # -------------------------
    def filter_by_user_selection(self, selection):
        """
        Handles advanced logic:
        - 'rooms' → exclude family-unit & villa
        - future: villa booking, family unit logic, etc.
        """

        # "rooms" menu option selected
        if selection == "room":
            return self.normal_rooms()

        # fallback → basic filtering
        return self.by_type(selection)
