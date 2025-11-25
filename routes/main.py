from flask import Blueprint, render_template

# Create blueprint
main_bp = Blueprint('main', __name__)

# Define routes (currently empty, ready for future)
@main_bp.route('/')
def home():
    return render_template('index.html')
