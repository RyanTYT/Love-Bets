from flask import Blueprint, jsonify, request
from extensions import db
from models import Bet, User, Match
from datetime import datetime
from sqlalchemy.orm import aliased
from sqlalchemy import func, asc
from .betting_functions import get_cum_data_for_bet

bet_bp = Blueprint('bets', __name__)

# Create a new bet
@bet_bp.route('/create', methods=['POST'])
def create_bet():
    data = request.json

    # # Validate user and balance
    # user = User.query.get(data['user_id'])
    # if not user or user.balance < data['bet_amount']:
    #     return jsonify({'error': 'Insufficient balance or invalid user'}), 400
    #
    # # Deduct bet amount from user balance
    # user.balance -= data['bet_amount']

    # Create the new bet
    new_bet = Bet(
        better=data['better'],
        user_id_1=data['user_id_1'],
        user_id_2=data['user_id_2'],
        bet_amount=data['bet_amount'],
        bet_direction=data['bet_direction'],  # 'long' or 'short'
        bet_time=datetime.now(),
        bet_description=data['bet_description'],
        bet_end_time=datetime.fromisoformat(data['bet_end_time']),
        bet_outcome=data['bet_outcome'],
        popular=data['popular']
    )
    db.session.add(new_bet)
    db.session.commit()

    return jsonify({'message': 'Bet created successfully'}), 201

# @bet_bp.route('/place', methods=['POST'])
# def place_bet():
#     data = request.json
#
#     bet_exists = Bet.query.filter(
#             Bet.better == data['better'] & 
#             (
#                 (Bet.user_id_1 == data['user_id_1'] & Bet.user_id_2 == data['user_id_2']) | 
#                 (Bet.user_id_2 == data['user_id_1'] & Bet.user_id_1 == data['user_id_2'])
#             )
#         ).first()
#     if bet_exists:
#         bet_exists.
#
#     # Create the new bet
#     new_bet = Bet(
#         better=data['better'],
#         user_id_1=data['user_id_1'],
#         user_id_2=data['user_id_2'],
#         bet_amount=data['bet_amount'],
#         bet_direction=data['bet_direction'],  # 'long' or 'short'
#         bet_time=datetime.now(),
#         bet_description=data['bet_description'],
#         bet_end_time=datetime.fromisoformat(data['bet_end_time']),
#         popular=data['popular']
#     )
#     db.session.add(new_bet)
#     db.session.commit()
#
#     return jsonify({'message': 'Bet created successfully'}), 201


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
            'better': bet.better,
            'user_1': {'email': bet.user_id_1, **user1_info},
            'user_2': {'email': bet.user_id_2, **user2_info},
            'bet_amount': bet.bet_amount,
            'bet_direction': bet.bet_direction,
            'bet_time': bet.bet_time,
            'bet_end_time': bet.bet_end_time,
            'bet_description': bet.bet_description,
            'popular': bet.popular
        })

    return jsonify({'bets': bets_data}), 200

# get single bet
@bet_bp.route('/get', methods=['GET'])
def get_bet():
    user_id_1 = request.args.get("user_id_1")
    user_id_2 = request.args.get("user_id_2")

    User1 = aliased(User)
    User2 = aliased(User)
    bet_data = (Bet.query
           .filter((Bet.user_id_1 == user_id_1) & (Bet.user_id_2 == user_id_2) & (Bet.bet_outcome == 0))
           .join(User1, Bet.user_id_1 == User1.email)
           .join(User2, Bet.user_id_2 == User2.email)
           .add_columns(
                Bet.better,
                Bet.user_id_1,
                Bet.user_id_2,
                Bet.bet_amount,
                Bet.bet_direction,
                Bet.bet_time,
                Bet.bet_end_time,
                Bet.bet_description,
                Bet.popular,
                User1.name.label('user1_name'),
                User1.profile_pic.label('user1_profile_pic'),
                User2.name.label('user2_name'),
                User2.profile_pic.label('user2_profile_pic')
            )
            .order_by(asc(Bet.bet_time))
            .all()
           )

    if not bet_data:
        return jsonify({'error': 'Bet not found'}), 404

    print(bet_data[0])
    res = get_cum_data_for_bet(bet_data, user_id_1, user_id_2)

    return jsonify(res), 200

@bet_bp.route('/get-for-users', methods=['GET'])
def get_bets_for_users():
    # Extract the list of user emails from the query parameters
    user_emails = request.args.getlist('user_emails', type=str)
    print(user_emails)

    if not user_emails:
        return jsonify({'error': 'Missing or invalid parameter: user_emails[]'}), 400

    # Aliases for the User table
    User1 = aliased(User)
    User2 = aliased(User)

    # Query to get bets for the given user emails
    user_bets = (
        Bet.query
        .filter((User1.email.in_(user_emails)) | (User2.email.in_(user_emails)))
        .filter(Bet.bet_outcome == 0)
        .join(User1, Bet.user_id_1 == User1.email)
        .join(User2, Bet.user_id_2 == User2.email)
        .add_columns(
            Bet.better,
            Bet.user_id_1,
            Bet.user_id_2,
            Bet.bet_amount,
            Bet.bet_direction,
            Bet.bet_time,
            Bet.bet_end_time,
            Bet.bet_description,
            Bet.popular,
            User1.name.label('user1_name'),
            User1.profile_pic.label('user1_profile_pic'),
            User2.name.label('user2_name'),
            User2.profile_pic.label('user2_profile_pic')
        )
        .order_by(asc(Bet.user_id_1), asc(Bet.user_id_2), asc(Bet.bet_time))  # Order by user_id_1, user_id_2, and bet_time
        .all()
    )

    if not user_bets:
        return jsonify({'error': 'No bets found for the provided users'}), 404

    # Group by user_id_1 + user_id_2
    users_bets = {}
    for user in user_bets:
        key = (user.user_id_1, user.user_id_2)
        if key not in users_bets:
            users_bets[key] = []
        users_bets[key].append(user)

    result = [get_cum_data_for_bet(bet_group, key[0], key[1]) for key, bet_group in users_bets.items()]

    return jsonify(result)

# Get all bets
@bet_bp.route('/get-all', methods=['GET'])
def get_all_bets_grouped():
    # Extract the list of user emails from the query parameters
    user_emails = request.args.getlist('user_emails', type=str)
    print(user_emails)

    if not user_emails:
        return jsonify({'error': 'Missing or invalid parameter: user_emails[]'}), 400

    # Aliases for the User table
    User1 = aliased(User)
    User2 = aliased(User)

    # Query to get bets for the given user emails
    user_bets = (
        Bet.query
        .filter(Bet.bet_outcome == 0)
        .join(User1, Bet.user_id_1 == User1.email)
        .join(User2, Bet.user_id_2 == User2.email)
        .add_columns(
            Bet.better,
            Bet.user_id_1,
            Bet.user_id_2,
            Bet.bet_amount,
            Bet.bet_direction,
            Bet.bet_time,
            Bet.bet_end_time,
            Bet.bet_description,
            Bet.popular,
            User1.name.label('user1_name'),
            User1.profile_pic.label('user1_profile_pic'),
            User2.name.label('user2_name'),
            User2.profile_pic.label('user2_profile_pic')
        )
        .order_by(asc(Bet.user_id_1), asc(Bet.user_id_2), asc(Bet.bet_time))  # Order by user_id_1, user_id_2, and bet_time
        .all()
    )

    if not user_bets:
        return jsonify({'error': 'No bets found for the provided users'}), 404

    # Group by user_id_1 + user_id_2
    users_bets = {}
    for user in user_bets:
        key = (user.user_id_1, user.user_id_2)
        if key not in users_bets:
            users_bets[key] = []
        users_bets[key].append(user)

    result = [get_cum_data_for_bet(bet_group, key[0], key[1]) for key, bet_group in users_bets.items()]

    return jsonify(result)
# Get all bets
@bet_bp.route('/get-all-popular', methods=['GET'])
def get_all_bets_popular():
    # Extract the list of user emails from the query parameters
    user_emails = request.args.getlist('user_emails', type=str)
    print(user_emails)

    if not user_emails:
        return jsonify({'error': 'Missing or invalid parameter: user_emails[]'}), 400

    # Aliases for the User table
    User1 = aliased(User)
    User2 = aliased(User)

    # Query to get bets for the given user emails
    user_bets = (
        Bet.query
        .filter(Bet.popular == True)
        .filter(Bet.bet_outcome == 0)
        .join(User1, Bet.user_id_1 == User1.email)
        .join(User2, Bet.user_id_2 == User2.email)
        .add_columns(
            Bet.better,
            Bet.user_id_1,
            Bet.user_id_2,
            Bet.bet_amount,
            Bet.bet_direction,
            Bet.bet_time,
            Bet.bet_end_time,
            Bet.bet_description,
            Bet.popular,
            User1.name.label('user1_name'),
            User1.profile_pic.label('user1_profile_pic'),
            User2.name.label('user2_name'),
            User2.profile_pic.label('user2_profile_pic')
        )
        .order_by(asc(Bet.user_id_1), asc(Bet.user_id_2), asc(Bet.bet_time))  # Order by user_id_1, user_id_2, and bet_time
        .all()
    )

    if not user_bets:
        return jsonify({'error': 'No bets found for the provided users'}), 404

    # Group by user_id_1 + user_id_2
    users_bets = {}
    for user in user_bets:
        key = (user.user_id_1, user.user_id_2)
        if key not in users_bets:
            users_bets[key] = []
        users_bets[key].append(user)

    result = [get_cum_data_for_bet(bet_group, key[0], key[1]) for key, bet_group in users_bets.items()]

    return jsonify(result)
