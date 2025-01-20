import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User  # Assuming User is defined in your models.py
from faker import Faker
import random

fake = Faker()

# Path to your SQLite database
DATABASE_PATH = os.path.join(os.getcwd(), "instance/database.db")
ENGINE = create_engine(f"sqlite:///{DATABASE_PATH}")
Session = sessionmaker(bind=ENGINE)

# Generate profiles with unique male and female profile pictures
def generate_profiles():
    profiles = []

    # Load male and female photo paths
    male_photos = [f"/images/male/{file}" for file in os.listdir("../images/male") if file.endswith(".jpg")]
    female_photos = [f"/images/female/{file}" for file in os.listdir("../images/female") if file.endswith(".jpg")]

    # Ensure there are at least 10 photos for each gender
    if len(male_photos) < 10 or len(female_photos) < 10:
        raise ValueError("Not enough male or female photos available. Ensure there are at least 10 for each.")

    # Shuffle to ensure randomness
    random.shuffle(male_photos)
    random.shuffle(female_photos)

    # Generate male profiles
    for i in range(10):
        male_profile = {
            "name": fake.name_male(),
            "age": random.randint(18, 65),
            "gender": "Male",
            "gender_preference": random.choice(["Female", "Any"]),
            "location": fake.city(),
            "phone_number": fake.phone_number(),
            "email": fake.email(),
            "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=65),
            "biography": fake.text(max_nb_chars=150),
            "profile_pic": male_photos[i],
            "location_preference": random.choice([fake.city(), None]),
            "age_preference_lower": random.randint(18, 25),
            "age_preference_upper": random.randint(26, 65),
            "hobbies": ", ".join(fake.words(nb=3)),
            "money_amount": round(random.uniform(0, 1000), 2),
            "relationship_status": random.choice(["Single", "In a Relationship", "It's Complicated", None]),
            "password": fake.password(),
        }
        profiles.append(male_profile)

    # Generate female profiles
    for i in range(10):
        female_profile = {
            "name": fake.name_female(),
            "age": random.randint(18, 65),
            "gender": "Female",
            "gender_preference": random.choice(["Male", "Any"]),
            "location": fake.city(),
            "phone_number": fake.phone_number(),
            "email": fake.email(),
            "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=65),
            "biography": fake.text(max_nb_chars=150),
            "profile_pic": female_photos[i],
            "location_preference": random.choice([fake.city(), None]),
            "age_preference_lower": random.randint(18, 25),
            "age_preference_upper": random.randint(26, 65),
            "hobbies": ", ".join(fake.words(nb=3)),
            "money_amount": round(random.uniform(0, 1000), 2),
            "relationship_status": random.choice(["Single", "In a Relationship", "It's Complicated", None]),
            "password": fake.password(),
        }
        profiles.append(female_profile)

    return profiles
BATCH_SIZE = 1  # Number of records per batch


def populate_fake_profiles_once():
    profiles = generate_profiles()  # Generate 20 profiles
    session = Session()

    try:
        # Split profiles into batches
        for i in range(0, len(profiles), BATCH_SIZE):
            batch = profiles[i:i + BATCH_SIZE]
            for profile in batch:
                user = User(
                    name=profile['name'],
                    age=profile['age'],
                    gender=profile['gender'],
                    gender_preference=profile['gender_preference'],
                    location=profile['location'],
                    phone_number=profile['phone_number'],
                    email=profile['email'],
                    date_of_birth=profile['date_of_birth'],
                    biography=profile['biography'],
                    profile_pic=profile['profile_pic'],
                    location_preference=profile['location_preference'],
                    age_preference_lower=profile['age_preference_lower'],
                    age_preference_upper=profile['age_preference_upper'],
                    hobbies=profile['hobbies'],
                    money_amount=profile['money_amount'],
                    relationship_status=profile['relationship_status'],
                    password=profile['password']
                )
                session.add(user)
            # Commit after each batch
            session.commit()

        print("Fake profiles generated and added to the database!")
    except Exception as e:
        session.rollback()
        print(f"Error populating database: {e}")
    finally:
        session.close()


if __name__ == "__main__":
    populate_fake_profiles_once()