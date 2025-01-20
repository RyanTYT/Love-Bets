from flask import Blueprint, jsonify, request
from extensions import db
from models import User, Friend

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
@friend_bp.route('/list/<string:user_id>', methods=['GET'])
def list_friends(user_id):
    friendships = Friend.query.filter(
        (Friend.user_id_1 == user_id) | (Friend.user_id_2 == user_id)
    ).all()

    friends = []
    for friendship in friendships:
        friend_id = friendship.user_id_2 if friendship.user_id_1 == user_id else friendship.user_id_1
        friend = User.query.get(friend_id)
        if friend:
            friends.append({
                'name': friend.name,
                'email': friend.email,
                'profile_pic': friend.profile_pic
            })
    print(friendships)

    return jsonify(friends)

# List all friends for a user
@friend_bp.route('/list_bets/<string:user_id>', methods=['GET'])
def get_friends_bet(user_id):
    print(user_id)
    # Fetch rows where the user is in either user_id_1 or user_id_2
    friends_query = db.session.query(Friend).filter(
        (Friend.user_id_1 == user_id) | (Friend.user_id_2 == user_id)
    ).all()
    if not friends_query:
        return jsonify({'error': 'No friends found'}), 404

    # Extract the friend's email for each pair
    friends_list = []
    for friend in friends_query:
        # Add the opposite user in the pair
        if friend.user_id_1 == user_id:
            friends_list.append(friend.user_id_2)
        else:
            friends_list.append(friend.user_id_1)

    return jsonify({'friends': friends_list}), 200
