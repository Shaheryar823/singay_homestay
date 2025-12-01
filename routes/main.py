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
        return render_template("family_unit.html")

@main_bp.route('/rooms')
def rooms():
    return render_template("rooms.html")

@main_bp.route('/gallery')
def gallery():
    return render_template("gallery.html")

@main_bp.route('/contact')
def contact():
    return render_template("contact.html")

@main_bp.route('/about')
def about():
    return render_template("about.html")

@main_bp.route('/privacy')
def privacy():
    return render_template("privacy.html")

@main_bp.route('/policies')
def policies():
    return render_template("policies.html")