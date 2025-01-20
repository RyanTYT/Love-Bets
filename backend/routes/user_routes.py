from flask import Blueprint, jsonify, request
from extensions import db
from models import User
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

user_bp = Blueprint('users', __name__)

# Helper function to serialize user data
def serialize_user(user):
    return {
        'email': user.email,  # changed 'id' to 'email'
        'name': user.name,
        'age': user.age,
        'gender': user.gender,
        'gender_preference': user.gender_preference,
        'location': user.location,
        'phone_number': user.phone_number,
        'email': user.email,
        'date_of_birth': user.date_of_birth,
        'biography': user.biography,
        'profile_pic': user.profile_pic,
        'location_preference': user.location_preference,
        'age_preference_lower': user.age_preference_lower,
        'age_preference_upper': user.age_preference_upper,
        'hobbies': user.hobbies,
        'money_amount': user.money_amount,
        'relationship_status': user.relationship_status,
    }

# Create a new user
@user_bp.route('/create', methods=['POST'])
def create_user():
    data = request.json

    # Validate required fields
    required_fields = ['email', 'password']
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(
        name=data.get('name'),
        age=data.get('age'),
        gender=data.get('gender'),
        gender_preference=data.get('gender_preference'),
        location=data.get('location'),
        phone_number=data.get('phone_number'),
        email=data['email'],
        date_of_birth=data.get('date_of_birth'),
        biography=data.get('biography'),
        profile_pic=data.get('profile_pic'),
        location_preference=data.get('location_preference'),
        age_preference_lower=data.get('age_preference_lower'),
        age_preference_upper=data.get('age_preference_upper'),
        hobbies=data.get('hobbies'),
        money_amount=data.get('money_amount', 0.0),
        relationship_status=data.get('relationship_status'),
        password=hashed_password,
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'user': serialize_user(new_user)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Read all users
@user_bp.route('/load', methods=['GET'])
def get_all_users():
    users = User.query.all()
    if not users:
        return jsonify({'error': 'No users found'}), 404
    return jsonify([serialize_user(user) for user in users]), 200

# Read a specific user by email
@user_bp.route('/get/<string:email>', methods=['GET'])
def get_user(email):
    user = User.query.get(email)  # changed user_id to email
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(serialize_user(user)), 200

# Edit any specific field of a user by email
@user_bp.route('/edit/<string:email>', methods=['PATCH'])
def edit_user_field(email):
    user = User.query.filter_by(email=email).first()  # Updated to use email
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.json  # Expect JSON payload

    # Fields that should be converted to integer or float
    integer_fields = ['age', 'money_amount', 'age_preference_lower', 'age_preference_upper']
    float_fields = ['money_amount']
    datetime_fields = ['date_of_birth']

    # Process JSON fields
    for key, value in data.items():
        if hasattr(user, key):
            if key in integer_fields and value:
                try:
                    value = int(value)
                except ValueError:
                    return jsonify({'error': f'Invalid value for {key}. It must be an integer.'}), 400
            elif key in float_fields and value:
                try:
                    value = float(value)
                except ValueError:
                    return jsonify({'error': f'Invalid value for {key}. It must be a float.'}), 400
            elif key in datetime_fields and value:
                try:
                    value = datetime.strptime(value, '%Y-%m-%d')
                except ValueError:
                    return jsonify({'error': f'Invalid value for {key}. It must be a valid date in YYYY-MM-DD format.'}), 400
            setattr(user, key, value)

    try:
        db.session.commit()
        return jsonify({'message': 'User field(s) updated successfully', 'user': serialize_user(user)}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'error': str(e)}), 500




# View user balance by email
@user_bp.route('/balance/<string:email>', methods=['GET'])
def view_balance(email):
    user = User.query.get(email)  # changed user_id to email
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'money_amount': user.money_amount}), 200

# Update profile picture by email
@user_bp.route('/update-profile-pic/<string:email>', methods=['PUT'])
def update_profile_pic(email):
    user = User.query.get(email)  # changed user_id to email
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.json
    user.profile_pic = data.get('profile_pic')

    try:
        db.session.commit()
        return jsonify({'message': 'Profile picture updated successfully', 'profile_pic': user.profile_pic}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Add money to balance by email
@user_bp.route('/add-money/<string:email>', methods=['PUT'])
def add_money(email):
    user = User.query.get(email)  # changed user_id to email
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.json
    amount = data.get('amount', 0)
    if amount <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400

    user.money_amount += amount

    try:
        db.session.commit()
        return jsonify({'message': f'{amount} added to balance', 'new_balance': user.money_amount}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# List potential matches by email
@user_bp.route('/matches/<string:email>', methods=['GET'])
def potential_matches(email):
    user = User.query.get(email)  # changed user_id to email
    if not user:
        return jsonify({'error': 'User not found'}), 404

    potential_matches = User.query.filter(
        User.email != email,
        User.gender == user.gender_preference,
        User.gender_preference == user.gender
    ).all()

    if not potential_matches:
        return jsonify({'error': 'No potential matches found'}), 404

    return jsonify([serialize_user(match) for match in potential_matches]), 200

# Delete a user by email
@user_bp.route('/delete/<string:email>', methods=['DELETE'])
def delete_user(email):
    user = User.query.get(email)  # changed user_id to email
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Check if the name field is null for a user by email
@user_bp.route('/check-name-null/<string:email>', methods=['GET'])
def check_name_null(email):
    user = User.query.get(email)  # changed user_id to email
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not user.name:
        return jsonify({'message': 'User name is null or empty'}), 200
    else:
        return jsonify({'message': 'User name is present'}), 200


# User login (authentication) by email
@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if both email and password are provided
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    # Query user by email
    user = User.query.filter_by(email=email).first()
    
    # Check if user exists and if password matches
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Return user data (exclude password for security reasons)
    return jsonify({
        'message': 'Login successful',
        'user': serialize_user(user)  # This will return user data without password
    }), 200

