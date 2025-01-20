from flask import Blueprint, jsonify, request
from extensions import db
from models import Bet, User, Match
from datetime import datetime

bet_bp = Blueprint('bets', __name__)

# Create a new bet
@bet_bp.route('/create', methods=['POST'])
def create_bet():
    data = request.json

    # Validate user and balance
    user = User.query.get(data['user_id'])
    if not user or user.balance < data['bet_amount']:
        return jsonify({'error': 'Insufficient balance or invalid user'}), 400

    # Deduct bet amount from user balance
    user.balance -= data['bet_amount']

    # Create the new bet
    new_bet = Bet(
        user_id=data['user_id'],
        match_id=data['match_id'],
        bet_amount=data['bet_amount'],
        bet_direction=data['bet_direction'],  # 'long' or 'short'
        bet_time=datetime.utcnow(),
        bet_end_time=datetime.fromisoformat(data['bet_end_time']),
        bet_description=data.get('bet_description', '')
    )
    db.session.add(new_bet)
    db.session.commit()

    return jsonify({'message': 'Bet created successfully'}), 201

# Get all bets
@bet_bp.route('/get_all', methods=['GET'])
def get_all_bets():
    bets = Bet.query.all()
    return jsonify([{
        'id': bet.id,
        'user_id': bet.user_id,
        'match_id': bet.match_id,
        'bet_amount': bet.bet_amount,
        'bet_direction': bet.bet_direction,
        'bet_time': bet.bet_time,
        'bet_end_time': bet.bet_end_time,
        'bet_description': bet.bet_description
    } for bet in bets])

# Get all bets for a match
@bet_bp.route('/match_bets/<int:match_id>', methods=['GET'])
def get_match_bets(match_id):
    bets = Bet.query.filter_by(match_id=match_id).all()
    if not bets:
        return jsonify({'message': 'No bets found for this match'}), 404

    # Calculate live odds
    total_bets = sum(bet.bet_amount for bet in bets)
    long_bets = sum(bet.bet_amount for bet in bets if bet.bet_direction == 'long')
    short_bets = sum(bet.bet_amount for bet in bets if bet.bet_direction == 'short')

    live_odds = {
        'long': (long_bets / total_bets) if total_bets else 0,
        'short': (short_bets / total_bets) if total_bets else 0
    }

    return jsonify({
        'bets': [{
            'id': bet.id,
            'user_id': bet.user_id,
            'bet_amount': bet.bet_amount,
            'bet_direction': bet.bet_direction,
            'bet_time': bet.bet_time,
            'bet_end_time': bet.bet_end_time
        } for bet in bets],
        'live_odds': live_odds
    })

# Resolve bets
@bet_bp.route('/resolve', methods=['POST'])
def resolve_bets():
    data = request.json
    match_id = data['match_id']
    winning_condition = data['winning_condition']  # 'long' or 'short'

    # Fetch bets for the match
    match_bets = Bet.query.filter_by(match_id=match_id).all()
    if not match_bets:
        return jsonify({'error': 'No bets found for this match'}), 404

    # Calculate the total pot and total winning bet amounts
    total_pot = sum(bet.bet_amount for bet in match_bets)
    winners = [bet for bet in match_bets if bet.bet_direction == winning_condition]
    total_winning_bets = sum(bet.bet_amount for bet in winners)

    if not winners:
        return jsonify({'message': 'No winners. Pot is retained.'})

    # Distribute rewards
    for winner in winners:
        user = User.query.get(winner.user_id)
        if user:
            reward = (winner.bet_amount / total_winning_bets) * total_pot
            user.balance += reward

    db.session.commit()
    return jsonify({'message': 'Bets resolved successfully', 'total_pot': total_pot, 'winners': len(winners)})

# Update a bet
@bet_bp.route('/update/<int:bet_id>', methods=['PUT'])
def update_bet(bet_id):
    bet = Bet.query.get(bet_id)
    if not bet:
        return jsonify({'error': 'Bet not found'}), 404

    data = request.json
    print(len(data["cumulative_for"]))
    print(len(data["cumulative_against"]))

    # Validate user and balance
    user = User.query.get(data['better'])

    # Create the new bet
    print(data)
    new_bet = Bet(
        better=data['better'],
        user_id_1=data['user1_id'],
        user_id_2=data['user2_id'],
        bet_amount=data['bet_amount'],
        bet_direction=data['bet_direction'],  # 'long' or 'short'
        bet_time=datetime.now(),
        bet_end_time=datetime.fromisoformat('2025-07-18T02:50:02.638670'),
        bet_description=data.get('bet_description', '')
    )
    db.session.add(new_bet)
    bet.cumulative_for = data.get('cumulative_for', bet.cumulative_for)
    bet.cumulative_against = data.get('cumulative_against', bet.cumulative_against)
    db.session.commit()

    return jsonify({'message': 'Bet updated successfully'})


# Delete a bet
@bet_bp.route('/delete/<int:bet_id>', methods=['DELETE'])
def delete_bet(bet_id):
    bet = Bet.query.get(bet_id)
    if not bet:
        return jsonify({'error': 'Bet not found'}), 404

    user = User.query.get(bet.user_id)
    if user:
        # Refund bet amount
        user.balance += bet.bet_amount

    db.session.delete(bet)
    db.session.commit()
    return jsonify({'message': 'Bet deleted successfully'})

@bet_bp.route('/friends_bets', methods=['POST'])
def get_friends_bets():
    data = request.json
    friends_emails = data.get('friends_emails', [])  # List of friends' emails

    if not friends_emails:
        return jsonify({'error': 'No friends specified'}), 400

    # Fetch bets where the user or the match involves a friend
    bets = Bet.query.filter(
        (Bet.user_id_1.in_(friends_emails)) | (Bet.user_id_2.in_(friends_emails))
    ).all()

    if not bets:
        return jsonify({'message': 'No bets found for friends'}), 404

    # Fetch user details for user1 and user2 in each bet
    user_emails = set([bet.user_id_1 for bet in bets] + [bet.user_id_2 for bet in bets])
    users = User.query.filter(User.email.in_(user_emails)).all()
    user_dict = {user.email: {'name': user.name, 'profile_pic': user.profile_pic} for user in users}

    # Serialize the bets
    bets_data = []
    for bet in bets:
        user1_info = user_dict.get(bet.user_id_1, {'name': 'Unknown', 'profile_pic': '../images/default_profile.png'})
        user2_info = user_dict.get(bet.user_id_2, {'name': 'Unknown', 'profile_pic': '../images/default_profile.png'})

        bets_data.append({
            'id': bet.id,
            'user_1': {'email': bet.user_id_1, **user1_info},
            'user_2': {'email': bet.user_id_2, **user2_info},
            'bet_amount': bet.bet_amount,
            'bet_direction': bet.bet_direction,
            'bet_time': bet.bet_time,
            'bet_end_time': bet.bet_end_time,
            'bet_description': bet.bet_description,
            "cumulative_for": bet.cumulative_for,
            "cumulative_against": bet.cumulative_against
        })

    return jsonify({'bets': bets_data}), 200

#get single bet
@bet_bp.route('/get/<int:bet_id>', methods=['GET'])
def get_bet(bet_id):
    bet = Bet.query.get(bet_id)

    users = User.query.filter(User.email.in_([bet.user_id_1, bet.user_id_2])).all()
    user_dict = {user.email: {'name': user.name, 'profile_pic': user.profile_pic} for user in users}
    user1_info = user_dict.get(bet.user_id_1, {'name': 'Unknown', 'profile_pic': '../images/default_profile.png'})
    user2_info = user_dict.get(bet.user_id_2, {'name': 'Unknown', 'profile_pic': '../images/default_profile.png'})
    if not bet:
        return jsonify({'error': 'Bet not found'}), 404

    return jsonify({
        'id': bet.id,
        'user_id_1': {'email': bet.user_id_1, **user1_info},
        'user_id_2': {'email': bet.user_id_2, **user2_info},
        'bet_amount': bet.bet_amount,
        'bet_direction': bet.bet_direction,
        'bet_time': bet.bet_time,
        'bet_end_time': bet.bet_end_time,
        'bet_description': bet.bet_description,
        "cumulative_for": bet.cumulative_for,
        "cumulative_against": bet.cumulative_against
    })
