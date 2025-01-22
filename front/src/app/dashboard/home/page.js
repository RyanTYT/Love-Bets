"use client";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TinderCard from "react-tinder-card";
import { host } from "@/app/host";

// if match is match made colour background red
function App() {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        // Fetch user data on page load
        async function fetchMatches() {
            const email = localStorage.getItem("email");
            try {
                const response = await fetch(`http://${host}:5000/users/load`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Error fetching matches");
                }

                const data = await response.json();
                setMatches(data); // Store the matches data
            } catch (error) {
                console.error("Error fetching matches:", error);
                toast.error("Failed to fetch matches");
            }
        }

        fetchMatches();
        // setMatches(sample_matches);
    }, []);

    const onSwipe = (direction) => {
        console.log("You swiped: " + direction);
    };

    const onCardLeftScreen = (myIdentifier) => {
        console.log(myIdentifier + " left the screen");
    };

    return (
        <div className={styles.cardContainer}>
            {matches.map((user) => {
                return (
                    <TinderCard
                        key={user.email} // Unique key for each card
                        onSwipe={onSwipe}
                        onCardLeftScreen={() => onCardLeftScreen(user.id)}
                        swipeRequirementType="distance"
                        swipeThreshold={10}
                        className={styles.card}
                    >
                        <div>
                            <img
                                src={user.profile_pic || "../images/quackers.jpg"} // Profile picture
                                alt={`${user.name}'s profile`}
                                className={styles.profilePic}
                            />
                            <div className={styles.cardInfo}>
                                <h2>{user.name}</h2> {/* User's Name */}
                                <p>{user.location}</p> {/* Location */}
                                <p>{user.biography}</p> {/* Bio */}
                                <p>
                                    <strong>Hobbies:</strong> {user.hobbies}
                                </p>{" "}
                                {/* Hobbies */}
                            </div>
                        </div>
                    </TinderCard>
                );
            })}
        </div>
    );
}

export default App;
