from flask import Flask
from flask_cors import CORS
from extensions import db
from routes.bet_routes import bet_bp
from routes.match_routes import match_bp
from routes.swipe_routes import swipe_bp
from routes.user_routes import user_bp
from routes.friends_routes import friend_bp

app = Flask(__name__)

# Enable CORS
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)

# Register routes
app.register_blueprint(user_bp, url_prefix='/users')
app.register_blueprint(bet_bp, url_prefix='/bets')
app.register_blueprint(match_bp, url_prefix='/matches')
app.register_blueprint(swipe_bp, url_prefix='/swipes')
app.register_blueprint(friend_bp, url_prefix='/friends')

# Initialize database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0')
