from flask import Flask, render_template
from config.database import init_db, db
from routes.main import main_bp
from routes.booking import booking_bp
# Import models so Flask-Migrate sees them
from models.rooms import Room
from models.booking import Booking
from models.user import User

app = Flask(__name__)

# initialize DB
init_db(app)

# Automatically create tables if they don't exist
with app.app_context():
    db.create_all()

# register blueprints
app.register_blueprint(main_bp)
app.register_blueprint(booking_bp)

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

if __name__ == "__main__":
    app.run(debug=True)
