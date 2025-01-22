from flask import Blueprint, jsonify, request
from extensions import db
from models import Swipe, Match

swipe_bp = Blueprint('swipes', __name__)

# Record a swipe action
@swipe_bp.route('/create', methods=['POST'])
def create_swipe():
    data = request.json
    user_id = data['user_id']
    target_user_id = data['target_user_id']
    is_liked = data['is_liked']
    swiped_at = data['swiped_at']

    # Validate inputs
    if not user_id or not target_user_id or is_liked is None:
        return jsonify({'error': 'Invalid data. Missing required fields.'}), 400

    # Check if this swipe already exists
    existing_swipe = Swipe.query.filter_by(user_id=user_id, target_user_id=target_user_id).first()
    if existing_swipe:
        return jsonify({'message': 'Swipe already recorded.'}), 200

    # Create a new swipe record
    new_swipe = Swipe(
        user_id=user_id,
        target_user_id=target_user_id,
        is_liked=is_liked,
        swiped_at=swiped_at
    )
    db.session.add(new_swipe)

    # If "No" swipe, commit and exit (no match possible)
    if not is_liked:
        db.session.commit()
        return jsonify({'message': 'Dislike recorded successfully.'}), 201

    # Check for mutual swipe (target user liked this user back)
    mutual_swipe = Swipe.query.filter_by(
        user_id=target_user_id,
        target_user_id=user_id,
        is_liked=True
    ).first()

    if mutual_swipe:
        # Create a new match
        new_match = Match(
            user1_id=user_id,
            user2_id=target_user_id,
            matched_time=swiped_at,  # Use current swipe's timestamp
            is_active=True
        )
        db.session.add(new_match)

    db.session.commit()
    return jsonify({'message': 'Swipe recorded successfully.'}), 201


# Get all swipes for a user
@swipe_bp.route('/get_swipes/<int:user_id>', methods=['GET'])
def get_swipes(user_id):
    swipes = Swipe.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': swipe.id,
        'user_id': swipe.user_id,
        'target_user_id': swipe.target_user_id,
        'is_liked': swipe.is_liked,
        'swiped_at': swipe.swiped_at
    } for swipe in swipes])


# Get potential matches for a user (users not yet swiped)
@swipe_bp.route('/potential_matches/<int:user_id>', methods=['GET'])
def get_potential_matches(user_id):
    from models import User  # Assuming a User model exists

    # Fetch IDs of users already swiped on
    swiped_ids = db.session.query(Swipe.target_user_id).filter_by(user_id=user_id).all()
    swiped_ids = [sid[0] for sid in swiped_ids]

    # Find users not yet swiped on by the current user
    potential_matches = User.query.filter(
        User.id.not_in(swiped_ids),
        User.id != user_id  # Exclude the current user
    ).all()

    return jsonify([{
        'id': user.id,
        'name': user.name,
        'age': user.age,
        'gender': user.gender,
        'location': user.location,
        'profile_pic': user.profile_pic
    } for user in potential_matches])


# Get all matches for a user
@swipe_bp.route('/all_matches/<int:user_id>', methods=['GET'])
def get_matches(user_id):
    matches = Match.query.filter(
        (Match.user1_id == user_id) | (Match.user2_id == user_id)
    ).all()

    return jsonify([{
        # 'id': match.id,
        'user1_id': match.user1_id,
        'user2_id': match.user2_id,
        'matched_time': match.matched_time,
        'is_active': match.is_active
    } for match in matches])


# Update a swipe
@swipe_bp.route('/update/<int:swipe_id>', methods=['PUT'])
def update_swipe(swipe_id):
    swipe = Swipe.query.get(swipe_id)
    if not swipe:
        return jsonify({'error': 'Swipe not found'}), 404

    data = request.json
    swipe.is_liked = data.get('is_liked', swipe.is_liked)
    db.session.commit()
    return jsonify({'message': 'Swipe updated successfully.'})


# Delete a swipe
@swipe_bp.route('/delete/<int:swipe_id>', methods=['DELETE'])
def delete_swipe(swipe_id):
    swipe = Swipe.query.get(swipe_id)
    if not swipe:
        return jsonify({'error': 'Swipe not found'}), 404

    db.session.delete(swipe)
    db.session.commit()
    return jsonify({'message': 'Swipe deleted successfully.'})

