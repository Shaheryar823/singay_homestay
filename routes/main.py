from flask import Blueprint, render_template

# Create blueprint
main_bp = Blueprint('main', __name__)

# Define routes (currently empty, ready for future)
@main_bp.route('/')
def home():
    return render_template('index.html')

@main_bp.route('/villa')
def villa():
    return render_template("villa.html")

@main_bp.route('/family-unit')
def family_unit():
        return "COmming Soon"

@main_bp.route('/rooms')
def rooms():
    return "COmming Soon"

@main_bp.route('/gallery')
def gallery():
    return "COmming Soon"