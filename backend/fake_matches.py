from random import sample, randint, choice, uniform
from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import json
from models import User, Match, Bet  # Import your updated models

# Replace this with your actual database URL
DATABASE_URL = "sqlite:///instance/database.db"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()


def generate_cumulative_array(num_points=9, min_value=10, max_value=1000):
    """
    Generate a non-decreasing array of cumulative values.
    """
    cumulative_data = []
    current_value = 0
    for _ in range(num_points):
        increment = uniform(min_value, max_value)
        current_value += increment
        cumulative_data.append(round(current_value, 2))
    return cumulative_data


def generate_matches_and_bets():
    # Query all users
    users = session.query(User).all()
    user_ids = [user.email for user in users]

    if len(user_ids) < 2:
        print("Not enough users to create matches.")
        return

    matches = []
    bets = []

    # Generate 10 random matches
    for _ in range(10):
        # Select two unique users
        user1_id, user2_id = sample(user_ids, 2)

        # Create a random matched time within the last month
        matched_time = datetime.now() - timedelta(days=randint(1, 30))

        # Create the match
        match = Match(
            user1_id=user1_id,
            user2_id=user2_id,
            matched_time=matched_time,
            is_active=choice([True, False]),
            went_out=choice([False])
        )
        session.add(match)
        session.flush()  # Flush to get the match ID

        # Generate 3-5 random bets for this match
        for _ in range(randint(3, 5)):
            bet_user_id = choice(user_ids)
            bet_amount = round(uniform(10, 100), 2)
            bet_direction = choice([True, False])  # Positive (True) or Negative (False) outcome
            bet_time = datetime.now() - timedelta(days=randint(1, 30), hours=randint(0, 23))
            bet_end_time = bet_time + timedelta(days=randint(1, 7))  # Bet end within a week
            bet_category = choice(["Compatibility", "Longevity", "First Date"])
            bet_description = (
                f"Betting on {user1_id} and {user2_id}'s outcome. "
                f"Category: {bet_category}."
            )

            # Generate cumulative data for "for" and "against" bets
            cumulative_for = generate_cumulative_array()
            cumulative_against = generate_cumulative_array()

            # Create the bet
            bet = Bet(
                better=bet_user_id,
                user_id_1=user1_id,
                user_id_2=user2_id,
                bet_amount=bet_amount,
                bet_direction=bet_direction,
                bet_time=bet_time,
                bet_description=bet_description,
                bet_end_time=bet_end_time,
                bet_outcome=None,  # Not determined yet
                bet_category=bet_category,
                cumulative_for=json.dumps(cumulative_for),  # Save as JSON
                cumulative_against=json.dumps(cumulative_against)  # Save as JSON
            )
            bets.append(bet)
            session.add(bet)

    session.commit()
    print(f"Generated {len(matches)} matches and {len(bets)} bets successfully!")


if __name__ == "__main__":
    generate_matches_and_bets()
