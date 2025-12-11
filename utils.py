from datetime import date, timedelta

def get_default_dates():
    """Returns default check-in and check-out dates in ISO format."""
    today = date.today()
    tomorrow = today + timedelta(days=1)
    return {
        'today': today.isoformat(),
        'tomorrow': tomorrow.isoformat()
    }
