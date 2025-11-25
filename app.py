from flask import Flask

# Initialize Flask app
app = Flask(__name__)

# Import routes (future use)
from routes.main import main_bp
app.register_blueprint(main_bp)

if __name__ == "__main__":
    app.run(debug=True)
