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


def generate_matches_and_bets():
    # Query all users
    users = session.query(User).all()
    user_ids = [user.email for user in users]

    if len(user_ids) < 2:
        print("Not enough users to create matches.")
        return

    matches = []
    bets = []

    # Track existing bets to prevent duplicates
    existing_bets = set()

    # Generate 10 random matches
    for index, email in enumerate(user_ids):
        if email == 'quackers@nus.com' or index > 11:
            continue
        print(email)

        # Select two unique users
        # user1_id, user2_id = sample(user_ids, 2)
        user1_id = 'quackers@nus.com'
        user2_id = email

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
        matches.append(match)
        session.add(match)
        session.flush()  # Flush to get the match ID

        # Generate 3-5 random bets for this match
        for _ in range(randint(4, 9)):
            # Select a random user to place the bet excluding the matched users
            better = choice([user_id for user_id in user_ids if user_id not in [user1_id, user2_id]])
            user_id_1 = user1_id
            user_id_2 = user2_id
            bet_amount = round(uniform(10, 100), 0)
            bet_direction = choice([True, False])  # Positive (True) or Negative (False) outcome
            bet_time = datetime.now() - timedelta(days=randint(1, 30), hours=randint(0, 23))
            bet_outcome = 0 # Not determined yet
            bet_end_time = bet_time + timedelta(days=randint(1, 7))  # Bet ends within a week
            bet_category = choice(["Compatibility", "Longevity", "First Date"])
            bet_description = (
                f"Betting on {user1_id} and {user2_id}'s outcome. "
                f"Category: {bet_category}."
            )
            popular = choice([True, False])

            # Check if the combination (better, user_id_1, user_id_2) already exists
            bet_key = (better, user_id_1, user_id_2)
            if bet_key in existing_bets:
                print(f"Duplicate bet detected: {bet_key}. Skipping.")
                continue

            # Add bet to the set and create the bet
            existing_bets.add(bet_key)
            bet = Bet(
                better=better,
                user_id_1=user_id_1,
                user_id_2=user_id_2,
                bet_amount=bet_amount,
                bet_direction=bet_direction,
                bet_time=bet_time,
                bet_description=bet_description,
                bet_end_time=bet_end_time,
                bet_outcome=bet_outcome,
                bet_category=bet_category,
                popular=popular
            )
            bets.append(bet)
            session.add(bet)

    session.commit()
    print(f"Generated {len(matches)} matches and {len(bets)} bets successfully!")

if __name__ == "__main__":
    generate_matches_and_bets()
