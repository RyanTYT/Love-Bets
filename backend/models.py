from extensions import db
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'users'

    email = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    gender_preference = Column(String, nullable=True)
    location = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    biography = Column(Text,nullable=True)
    profile_pic = Column(String, nullable=True)
    location_preference = Column(String, nullable=True)
    age_preference_lower = Column(Integer, nullable=True)
    age_preference_upper = Column(Integer, nullable=True)
    hobbies = Column(Text, nullable=True)
    money_amount = Column(Float, default=1000)
    relationship_status = Column(String, nullable=True)
    password = Column(String, nullable=False)

    # Relationships
    friendships = relationship(
        'Friend', 
        foreign_keys='Friend.user_id_1', 
        back_populates='user', 
        overlaps='friends'
    )
    swipes = relationship(
        'Swipe', 
        foreign_keys='Swipe.user_id', 
        back_populates='user', 
        overlaps='swipe_actions'
    )
    matches = relationship(
        'Match',
        foreign_keys='Match.user1_id',
        back_populates='user1',
        overlaps='initiated_matches'
    )
    bets = relationship(
        'Bet',
        foreign_keys='Bet.user_id_1',
        back_populates='user1',
        overlaps='initiated_bets'
    )

class Friend(db.Model):
    __tablename__ = 'friends'

    id = Column(Integer, primary_key=True)
    user_id_1 = Column(String, ForeignKey('users.email'))
    user_id_2 = Column(String, ForeignKey('users.email'))

    user = relationship('User', foreign_keys=[user_id_1], back_populates='friendships')

class Match(db.Model):
    __tablename__ = 'matches'

    id = Column(Integer, primary_key=True)
    user1_id = Column(String, ForeignKey('users.email'))
    user2_id = Column(String, ForeignKey('users.email'))
    matched_time = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    went_out = Column(Boolean, default=False)

    match_made = Column(Boolean, default=False)

    user1 = relationship('User', foreign_keys=[user1_id], back_populates='matches')
    user2 = relationship('User', foreign_keys=[user2_id])

class Swipe(db.Model):
    __tablename__ = 'swipes'

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.email'))
    target_user_id = Column(String, ForeignKey('users.email'))
    is_liked = Column(Boolean, default=False)
    swiped_at = Column(DateTime, nullable=False)

    user = relationship('User', foreign_keys=[user_id], back_populates='swipes')

class Bet(db.Model):
    __tablename__ = 'bets'

    id = Column(Integer, primary_key=True)
    better = Column(String, ForeignKey('users.email'))
    user_id_1 = Column(String, ForeignKey('users.email'))
    user_id_2 = Column(String, ForeignKey('users.email'))
    bet_amount = Column(Float, nullable=False)
    bet_direction = Column(Boolean, nullable=False)  # True = Positive outcome, False = Negative
    bet_time = Column(DateTime, nullable=False)
    bet_description = Column(Text)
    bet_end_time = Column(DateTime, nullable=False)
    bet_outcome = Column(String)
    bet_category = Column(String)
    user1 = relationship('User', foreign_keys=[user_id_1], back_populates='bets')
    user2 = relationship('User', foreign_keys=[user_id_2])
    # Fields to store cumulative data
    cumulative_for = Column(Text)  # JSON array for cumulative "for" bets
    cumulative_against = Column(Text)  # JSON array for cumulative "against" bets
    
