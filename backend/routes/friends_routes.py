from flask import Blueprint, jsonify, request
from extensions import db
from models import User, Friend
from .betting_functions import get_cum_data_for_bet

friend_bp = Blueprint('friends', __name__)

# Add a friend
@friend_bp.route('/add', methods=['POST'])
def add_friend():
    data = request.json
    user_id_1 = data.get('user_id_1')
    user_id_2 = data.get('user_id_2')

    # Validate user IDs
    user1 = User.query.get(user_id_1)
    user2 = User.query.get(user_id_2)
    if not user1 or not user2:
        return jsonify({'error': 'One or both users not found'}), 404

    # Check if friendship already exists
    existing_friendship = Friend.query.filter(
        ((Friend.user_id_1 == user_id_1) & (Friend.user_id_2 == user_id_2)) |
        ((Friend.user_id_1 == user_id_2) & (Friend.user_id_2 == user_id_1))
    ).first()

    if existing_friendship:
        return jsonify({'message': 'Users are already friends'}), 400

    # Create the friendship
    new_friendship = Friend(user_id_1=user_id_1, user_id_2=user_id_2)
    db.session.add(new_friendship)
    db.session.commit()
    return jsonify({'message': 'Friend added successfully'}), 201

# Remove a friend
@friend_bp.route('/remove', methods=['POST'])
def remove_friend():
    data = request.json
    user_id_1 = data.get('user_id_1')
    user_id_2 = data.get('user_id_2')

    # Validate user IDs
    friendship = Friend.query.filter(
        ((Friend.user_id_1 == user_id_1) & (Friend.user_id_2 == user_id_2)) |
        ((Friend.user_id_1 == user_id_2) & (Friend.user_id_2 == user_id_1))
    ).first()

    if not friendship:
        return jsonify({'error': 'Friendship not found'}), 404

    # Delete the friendship
    db.session.delete(friendship)
    db.session.commit()
    return jsonify({'message': 'Friend removed successfully'})

# List all friends for a user
@friend_bp.route('/list', methods=['GET'])
def list_friends():
    user_email = request.args.get("email")
    if not user_email:
        return jsonify({'error': 'Missing required parameter: user_id'}), 400

    # Query to retrieve all friends for the given user_id
    friends = (
        User.query
        .join(Friend, (Friend.user_id_1 == user_email) & (Friend.user_id_2 == User.email) |
                      (Friend.user_id_2 == user_email) & (Friend.user_id_1 == User.email))
        .add_columns(User.name, User.email, User.profile_pic)
        .all()
    )

    # Format the result
    result = [
        {
            'name': friend.name,
            'email': friend.email,
            'profile_pic': friend.profile_pic
        }
        for friend in friends
    ]

    return jsonify(result), 200
