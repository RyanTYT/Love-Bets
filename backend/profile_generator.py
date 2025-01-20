from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

def generate_profiles(count=15):
    profiles = []
    for _ in range(count):
        name = fake.name()
        age = random.randint(18, 65)
        gender = random.choice(["Male", "Female", "Non-Binary"])
        gender_preference = random.choice(["Male", "Female", "Any", None])
        location = fake.city()
        phone_number = fake.phone_number()
        email = fake.email()
        date_of_birth = fake.date_of_birth(minimum_age=18, maximum_age=65)
        biography = fake.text(max_nb_chars=150)
        profile_pic = fake.image_url()
        location_preference = random.choice([fake.city(), None])
        age_preference_lower = random.randint(18, max(age - 5, 18))  # Ensure valid lower age range
        age_preference_upper = random.randint(age + 1, 65) if age < 65 else 65  # Ensure valid upper age range
        hobbies = ", ".join(fake.words(nb=3))
        money_amount = round(random.uniform(0, 1000), 2)
        relationship_status = random.choice(
            ["Single", "In a Relationship", "It's Complicated", None]
        )
        password = fake.password()

        profiles.append({
            "name": name,
            "age": age,
            "gender": gender,
            "gender_preference": gender_preference,
            "location": location,
            "phone_number": phone_number,
            "email": email,
            "date_of_birth": date_of_birth,
            "biography": biography,
            "profile_pic": profile_pic,
            "location_preference": location_preference,
            "age_preference_lower": age_preference_lower,
            "age_preference_upper": age_preference_upper,
            "hobbies": hobbies,
            "money_amount": money_amount,
            "relationship_status": relationship_status,
            "password": password,
        })
    return profiles

