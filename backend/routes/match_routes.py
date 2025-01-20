from datetime import datetime
from flask import Blueprint, jsonify, request
from extensions import db
from models import Match, Swipe, Bet, User

match_bp = Blueprint('matches', __name__)

# Create or check a match
@match_bp.route('/create', methods=['POST'])
def create_match():
    data = request.json
    user1_id = data['user1_id']
    user2_id = data['user2_id']

    # Ensure both user IDs are provided
    if not user1_id or not user2_id:
        return jsonify({'error': 'User IDs are required.'}), 400

    # Check for mutual swipe
    swipe_from_user1 = Swipe.query.filter_by(user_id=user1_id, target_user_id=user2_id, is_liked=True).first()
    swipe_from_user2 = Swipe.query.filter_by(user_id=user2_id, target_user_id=user1_id, is_liked=True).first()

    if not (swipe_from_user1 and swipe_from_user2):
        return jsonify({'error': 'No mutual swipe found between the users.'}), 400

    # Check if match already exists
    existing_match = Match.query.filter(
        ((Match.user1_id == user1_id) & (Match.user2_id == user2_id)) |
        ((Match.user1_id == user2_id) & (Match.user2_id == user1_id))
    ).first()

    if existing_match:
        return jsonify({'message': 'Match already exists.', 'match_id': existing_match.id}), 200

    # Create a new match
    new_match = Match(
        user1_id=user1_id,
        user2_id=user2_id,
        matched_time=data.get('matched_time'),  # Use provided timestamp or generate
        is_active=True,
        went_out=False
    )
    db.session.add(new_match)
    db.session.commit()

    # Optionally notify users (e.g., via socket, email, etc.)
    notify_users_of_match(user1_id, user2_id)

    return jsonify({'message': 'Match created successfully', 'match_id': new_match.id}), 201

# Create or check a match
@match_bp.route('/matchmake', methods=['POST'])
def matchmake():
    data = request.json
    user1_id = data['user1_id']
    user2_id = data['user2_id']

    # Ensure both user IDs are provided
    if not user1_id or not user2_id:
        return jsonify({'error': 'User IDs are required.'}), 400

    # Check if match already exists
    existing_match = Match.query.filter(
        ((Match.user1_id == user1_id) & (Match.user2_id == user2_id)) |
        ((Match.user1_id == user2_id) & (Match.user2_id == user1_id))
    ).first()

    if existing_match:
        existing_match.match_made = True
        return jsonify({'message': 'Match already exists.', 'match_id': existing_match.id}), 200

    # Create a new match
    new_match = Match(
        user1_id=user1_id,
        user2_id=user2_id,
        matched_time=data.get('matched_time', datetime.now()),  # Use provided timestamp or generate
        is_active=True,
        went_out=False,
        match_made=True
    )
    db.session.add(new_match)
    db.session.commit()

    # Optionally notify users (e.g., via socket, email, etc.)
    notify_users_of_match(user1_id, user2_id)

    return jsonify({'message': 'Match created successfully', 'match_id': new_match.id}), 201

# Get all matches for a user
@match_bp.route('/get_all/<string:email>', methods=['GET'])
def get_matches(email):
    matches = Match.query.filter((Match.user1_id == email) | (Match.user2_id == email)).all()
    if not matches:
        return jsonify({'message': 'No matches found.'}), 404

    match_list = []
    for match in matches:
        # Determine the other user's ID
        other_user_id = match.user2_id if match.user1_id == email else match.user1_id
        
        # Fetch details of the other user
        other_user = User.query.get(other_user_id)
        if not other_user:
            continue  # Skip if the user doesn't exist
        if match.went_out:
            continue

        match_list.append({
            'id': match.id,
            'other_user': {
                'name': other_user.name,
                'email': other_user.email,
                'profile_pic': other_user.profile_pic,
                'location': other_user.location,
                'biography': other_user.biography,
                # Add any additional fields needed
            },
            'matched_time': match.matched_time,
            'is_active': match.is_active,
            'went_out': match.went_out,
            'match_made': match.match_made
        })

    return jsonify(match_list)


# Update a match
@match_bp.route('/update/<int:match_id>', methods=['PUT'])
def update_match(match_id):
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'error': 'Match not found'}), 404

    data = request.json
    match.is_active = data.get('is_active', match.is_active)
    match.went_out = data.get('went_out', match.went_out)
    db.session.commit()

    return jsonify({'message': 'Match updated successfully'})


# Delete a match
@match_bp.route('/delete/<int:match_id>', methods=['DELETE'])
def delete_match(match_id):
    match = Match.query.get(match_id)
    if not match:
        return jsonify({'error': 'Match not found'}), 404

    Bet.query.filter(match.user1_id == Bet.user_id_1 and match.user2_id == Bet.user_id_2)
    db.session.delete(match)
    db.session.commit()

    return jsonify({'message': 'Match deleted successfully'})


# Check if two users have a match
@match_bp.route('/check', methods=['POST'])
def check_match():
    data = request.json
    user1_id = data['user1_id']
    user2_id = data['user2_id']

    if not user1_id or not user2_id:
        return jsonify({'error': 'User IDs are required.'}), 400

    match = Match.query.filter(
        ((Match.user1_id == user1_id) & (Match.user2_id == user2_id)) |
        ((Match.user1_id == user2_id) & (Match.user2_id == user1_id))
    ).first()

    if match:
        return jsonify({
            'id': match.id,
            'user1_id': match.user1_id,
            'user2_id': match.user2_id,
            'matched_time': match.matched_time,
            'is_active': match.is_active,
            'went_out': match.went_out
        })
    else:
        return jsonify({'message': 'No match found between the users.'}), 404


# Notify users of a match (Placeholder)
def notify_users_of_match(user1_id, user2_id):
    # Implement notification logic (e.g., email, push notification, WebSocket)
    print(f'Notifying User {user1_id} and User {user2_id} of a match.')

# Check if two users have a match
@match_bp.route('/went-out', methods=['PATCH'])
def wentOut():
    data = request.json
    user1_id = data['user1_id']
    user2_id = data['user2_id']

    if not user1_id or not user2_id:
        return jsonify({'error': 'User IDs are required.'}), 400

    match = Match.query.filter(
        ((Match.user1_id == user1_id) & (Match.user2_id == user2_id)) |
        ((Match.user1_id == user2_id) & (Match.user2_id == user1_id))
    ).first()

    if match:
        match.went_out = True

        # Find all bets with this match
        print(user1_id)
        print(user2_id)
        bets = Bet.query.filter(
            ((Bet.user_id_1 == user1_id) & (Bet.user_id_2 == user2_id)) |
            ((Bet.user_id_2 == user2_id) & (Bet.user_id_1 == user1_id))
        ).all()
        losers_pot = sum([i.bet_amount for i in bets if i.bet_direction == 0])
        num_winners = len([i for i in bets if i.bet_direction == 1])
        print(bets)
        for bet in bets:
            print(bet.better)
            print(bet.bet_direction)
            print(losers_pot / num_winners)
            user = User.query.get(bet.better)
            if bet.bet_direction == 1:
                user.money_amount += losers_pot / num_winners
            else:
                user.money_amount -= bet.bet_amount

        db.session.commit()
        return jsonify({'message': 'Updated! Bets Sent out!'}), 200
    else:
        return jsonify({'message': 'No match found between the users.'}), 404
