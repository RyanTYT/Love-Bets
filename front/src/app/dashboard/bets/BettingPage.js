"use client";
import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa";
import { host } from "@/app/host";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export default function BettingPage({
    email,
    selectedBet,
    setSelectedBet,
    userMoney,
}) {
    const comments = [
        { username: "user123", text: "I'm betting on Break Up!" },
        { username: "betMaster", text: "Odds are shifting fast!" },
        {
            username: "analystPro",
            text: "Get Together seems like a safe bet.",
        },
        { username: "trendWatcher", text: "This is a tough call." },
    ]; // Placeholder for comments

    const [betAmount, setBetAmount] = useState(0);

    // Handle placing/updating the bet
    const handlePlaceBet = async (option) => {
        // Update the bet on the backend
        await fetch(`http://${host}:5000/bets/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                better: email,
                user_id_1: selectedBet.user_id_1.email,
                user_id_2: selectedBet.user_id_2.email,
                bet_amount: betAmount,
                bet_direction: option === "Get Together" ? 1 : 0,
                bet_description: "",
                bet_end_time: "2025-09-01T00:00:00",
                bet_outcome: 0,
                popular: selectedBet.popular,
            }),
        })
            .then(async () => {
                // Update Odds
                await fetch(
                    `http://${host}:5000/bets/get?user_id_1=${selectedBet.user_id_1.email}&user_id_2=${selectedBet.user_id_2.email}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                )
                    .then(async (bet_data) => {
                        const selectedBet = await bet_data.json();
                        setSelectedBet({
                            ...selectedBet,
                            comments: comments,
                        });
                    })
                    .catch((err) => toast.error(`Error updating odds: ${err}`));
            })
            .then(() => {
                toast.success(
                    `You placed a bet of $${betAmount} on "${option}" for ${selectedBet.user_id_1.name} & ${selectedBet.user_id_2.name}!`,
                );
            })
            .catch((err) => toast.error(`Error placing bet: ${err}`));
    };

    const getChartData = (dates, cumulative_for, cumulative_against) => ({
        labels: dates?.map((full_date) => full_date.substr(0, 12)) || [], // Fallback to an empty array if history is undefined
        datasets: [
            {
                label: "Break Up",
                data: cumulative_against || [], // Fallback to an empty array
                borderColor: "#ff6666",
                backgroundColor: "rgba(255, 102, 102, 0.2)",
                fill: true,
            },
            {
                label: "Get Together",
                data: cumulative_for || [], // Fallback to an empty array
                borderColor: "#0073b1",
                backgroundColor: "rgba(0, 115, 177, 0.2)",
                fill: true,
            },
        ],
    });

    const getBarChartData = (long, short) => ({
        labels: ["Break Up", "Get Together"],
        datasets: [
            {
                label: "Betting Volume",
                data: [short, long],
                backgroundColor: ["#ff6666", "#0073b1"],
            },
        ],
    });

    // if (!selectedBet) return <></>;
    // if (selectedBet === undefined) return <></>;

    return (
        <div
            className={`${styles.popupOverlay} login-container ${selectedBet === null ? styles.rightPos : styles.midPos
                }`}
        >
            <div className={styles.popupContent}>
                {/* Heart Animation */}
                <div className={styles.heartAnimation}>
                    <img
                        src={
                            selectedBet === null
                                ? null
                                : selectedBet.user_id_1.profile_pic || "/images/quackers.jpg"
                        }
                        alt={selectedBet === null ? "" : selectedBet.user_id_1.name}
                        className={styles.userAvatarHeart}
                    />
                    <div className={styles.heart}></div>
                    <img
                        src={
                            selectedBet === null
                                ? null
                                : selectedBet.user_id_2.profile_pic || "/images/quackers.jpg"
                        }
                        alt={selectedBet === null ? "" : selectedBet.user_id_2.name}
                        className={styles.userAvatarHeart}
                    />
                </div>

                {/* Back and Title */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <FaChevronLeft
                        style={{
                            marginBottom: "20px",
                            color: "#ff6666",
                            cursor: "pointer",
                        }}
                        onClick={() => setSelectedBet(null)}
                    />
                    <div className={`${styles.logo} logo`}>
                        Place your BETS for{" "}
                        {selectedBet === null ? "" : selectedBet.user_id_1.name} &{" "}
                        {selectedBet === null ? "" : selectedBet.user_id_2.name}
                    </div>
                </div>

                {/* Match Description */}
                <p className={styles.description}>
                    {selectedBet === null ? "" : selectedBet.description}
                </p>

                {/* Charts Section */}
                <div className={styles.charts}>
                    <h3>Odds Over Time</h3>
                    <Line
                        data={getChartData(
                            selectedBet?.dates,
                            selectedBet?.cumulative_for,
                            selectedBet?.cumulative_against,
                        )}
                    />
                    <h3>Betting Volume</h3>
                    <Bar
                        data={getBarChartData(
                            selectedBet?.cumulative_for[selectedBet.cumulative_for.length - 1],
                            selectedBet?.cumulative_against[
                            selectedBet?.cumulative_against.length - 1
                            ],
                        )}
                    />
                </div>

                {/* Bet Input */}
                <div className={styles.betInputField}>
                    <input
                        type="number"
                        placeholder="Enter bet amount ($)"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className={styles.betInputField}
                    />
                </div>
                {/* Box for Showing User's Money */}
                <div className={styles.moneyBox}>
                    <p>Your Money: ${userMoney}</p>
                </div>

                {/* Bet Options */}
                <div className={styles.betOptions}>
                    <button
                        className={styles.betBreakButton}
                        onClick={() => handlePlaceBet("Break Up")}
                    >
                        Break Up
                    </button>
                    <button
                        className={styles.betNoBreakButton}
                        onClick={() => handlePlaceBet("Get Together")}
                    >
                        Get Together
                    </button>
                </div>

                {/* Comments Section */}
                <div className={styles.commentsSection}>
                    <h3>What the markets are saying</h3>
                    <div className={styles.comments}>
                        {selectedBet === null
                            ? ""
                            : selectedBet.comments.map((comment, index) => (
                                <div key={index} className={styles.comment}>
                                    <strong>{comment.username}:</strong> {comment.text}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
