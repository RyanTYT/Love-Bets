from random import sample
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from models import User, Friend  # Import User and Friend models

# Replace this with your actual database URL
DATABASE_URL = "sqlite:///instance/database.db"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

def generate_random_friendships_by_email():
    # Query all users
    users = session.query(User).all()
    user_emails = [user.email for user in users]
    
    if len(user_emails) < 3:
        print("Not enough users to create friendships.")
        return
    
    friendships = set()  # Use a set to avoid duplicates

    for user_email in user_emails:
        # Get the user object
        user = session.query(User).filter_by(email=user_email).first()
        if not user:
            continue

        # Get the list of potential friends (excluding the current user)
        potential_friends = [email for email in user_emails if email != user_email]
        # Ensure at least 3 friends per user
        user_friends = sample(potential_friends, min(3, len(potential_friends)))
        
        for friend_email in user_friends:
            # Get friend object
            friend = session.query(User).filter_by(email=friend_email).first()
            if not friend:
                continue

            # Create friendships in both directions (undirected graph)
            friendship = tuple(sorted([user_email, friend_email]))
            friendships.add(friendship)
    
    # Add friendships to the database
    for friendship in friendships:
        email_1, email_2 = friendship

        # Get user IDs based on emails
        user_1 = session.query(User).filter_by(email=email_1).first()
        user_2 = session.query(User).filter_by(email=email_2).first()

        if user_1 and user_2:
            # Check if the friendship already exists
            if not session.query(Friend).filter_by(user_id_1=user_1.email, user_id_2=user_2.email).first():
                session.add(Friend(user_id_1=user_1.email, user_id_2=user_2.email))
    
    session.commit()
    print("Friendships generated successfully!")

if __name__ == "__main__":
    generate_random_friendships_by_email()
