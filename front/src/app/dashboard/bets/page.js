"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import { host } from "@/app/host";
import BettingPage from "@/app/dashboard/bets/BettingPage";

const sampleMatches = [
    // {
    //     id: 1,
    //     user1: {
    //         name: "Kim Kardashian",
    //         profile_pic: "../images/celeb/kim_kardashian.jpg",
    //     },
    //     user2: {
    //         name: "Pete Davidson",
    //         profile_pic: "../images/celeb/pete_davidson.jpg",
    //     },
    //     odds: { breakUp: 55, getTogether: 45 },
    //     bettingVolume: { breakUp: 3200, getTogether: 2600 },
    //     oddsHistory: [
    //         { time: "10h ago", breakUp: 45, getTogether: 55 },
    //         { time: "9h ago", breakUp: 50, getTogether: 50 },
    //         { time: "8h ago", breakUp: 60, getTogether: 40 },
    //         { time: "7h ago", breakUp: 55, getTogether: 45 },
    //         { time: "6h ago", breakUp: 58, getTogether: 42 },
    //         { time: "5h ago", breakUp: 62, getTogether: 38 },
    //         { time: "4h ago", breakUp: 55, getTogether: 45 },
    //         { time: "3h ago", breakUp: 53, getTogether: 47 },
    //         { time: "2h ago", breakUp: 55, getTogether: 45 },
    //         { time: "1h ago", breakUp: 55, getTogether: 45 },
    //     ],
    //     description:
    //         "Will Kim Kardashian and Pete Davidson stay together, or is it over? Place your bets!",
    //     comments: [
    //         { username: "fan123", text: "Break Up odds are looking good!" },
    //         { username: "trendWatcher", text: "Kim K is unpredictable!" },
    //     ],
    // },
    // {
    //     id: 2,
    //     user1: { name: "Jay-Z", profile_pic: "../images/celeb/jayz.jpg" },
    //     user2: { name: "Beyoncé", profile_pic: "../images/celeb/beyonce.jpg" },
    //     odds: { breakUp: 10, getTogether: 90 },
    //     bettingVolume: { breakUp: 1500, getTogether: 7000 },
    //     oddsHistory: [
    //         { time: "10h ago", breakUp: 8, getTogether: 92 },
    //         { time: "9h ago", breakUp: 10, getTogether: 90 },
    //         { time: "8h ago", breakUp: 12, getTogether: 88 },
    //         { time: "7h ago", breakUp: 15, getTogether: 85 },
    //         { time: "6h ago", breakUp: 10, getTogether: 90 },
    //         { time: "5h ago", breakUp: 11, getTogether: 89 },
    //         { time: "4h ago", breakUp: 9, getTogether: 91 },
    //         { time: "3h ago", breakUp: 10, getTogether: 90 },
    //         { time: "2h ago", breakUp: 8, getTogether: 92 },
    //         { time: "1h ago", breakUp: 10, getTogether: 90 },
    //     ],
    //     description:
    //         "Jay-Z and Beyoncé: Break Up or eternal power couple? Bet now!",
    //     comments: [
    //         { username: "musicFan", text: "They’re untouchable!" },
    //         {
    //             username: "trendWatcher",
    //             text: "Break Up odds are too low to ignore.",
    //         },
    //     ],
    // },
    // {
    //     id: 3,
    //     user1: {
    //         name: "Blake Lively",
    //         profile_pic: "../images/celeb/blake_lively.jpg",
    //     },
    //     user2: {
    //         name: "Ryan Reynolds",
    //         profile_pic: "../images/celeb/ryan_reynolds.jpg",
    //     },
    //     odds: { breakUp: 15, getTogether: 85 },
    //     bettingVolume: { breakUp: 2200, getTogether: 5400 },
    //     oddsHistory: [
    //         { time: "10h ago", breakUp: 12, getTogether: 88 },
    //         { time: "9h ago", breakUp: 15, getTogether: 85 },
    //         { time: "8h ago", breakUp: 18, getTogether: 82 },
    //         { time: "7h ago", breakUp: 20, getTogether: 80 },
    //         { time: "6h ago", breakUp: 14, getTogether: 86 },
    //         { time: "5h ago", breakUp: 17, getTogether: 83 },
    //         { time: "4h ago", breakUp: 15, getTogether: 85 },
    //         { time: "3h ago", breakUp: 18, getTogether: 82 },
    //         { time: "2h ago", breakUp: 14, getTogether: 86 },
    //         { time: "1h ago", breakUp: 15, getTogether: 85 },
    //     ],
    //     description:
    //         "Blake Lively and Ryan Reynolds: Can they continue their perfect relationship? Bet now!",
    //     comments: [
    //         { username: "fan4life", text: "Get Together is the safest bet!" },
    //         { username: "betMaster", text: "Break Up odds are still risky!" },
    //     ],
    // },
    // {
    //     id: 4,
    //     user1: { name: "Joe Jonas", profile_pic: "../images/celeb/joe_jonas.jpg" },
    //     user2: {
    //         name: "Sophie Turner",
    //         profile_pic: "../images/celeb/sophie_turner.jpg",
    //     },
    //     odds: { breakUp: 75, getTogether: 25 },
    //     bettingVolume: { breakUp: 4500, getTogether: 1500 },
    //     oddsHistory: [
    //         { time: "10h ago", breakUp: 65, getTogether: 35 },
    //         { time: "9h ago", breakUp: 68, getTogether: 32 },
    //         { time: "8h ago", breakUp: 70, getTogether: 30 },
    //         { time: "7h ago", breakUp: 72, getTogether: 28 },
    //         { time: "6h ago", breakUp: 75, getTogether: 25 },
    //         { time: "5h ago", breakUp: 78, getTogether: 22 },
    //         { time: "4h ago", breakUp: 74, getTogether: 26 },
    //         { time: "3h ago", breakUp: 75, getTogether: 25 },
    //         { time: "2h ago", breakUp: 80, getTogether: 20 },
    //         { time: "1h ago", breakUp: 75, getTogether: 25 },
    //     ],
    //     description:
    //         "Joe Jonas and Sophie Turner: Is this the end of their story? Place your bets!",
    //     comments: [
    //         { username: "breakingNews", text: "The odds are clearly against them!" },
    //         { username: "userConcerned", text: "Break Up feels inevitable." },
    //     ],
    // },
];

const leaderboard = [
    { username: "bigBettor99", winnings: "$500" },
    { username: "luckyStrike", winnings: "$400" },
    { username: "analystPro", winnings: "$300" },
];

const tickerData = [
    { match: "John & Jane", breakUp: 40, getTogether: 60 },
    { match: "Chris & Anna", breakUp: 50, getTogether: 50 },
    { match: "Peter & Sarah", breakUp: 75, getTogether: 25 },
    { match: "Deon & Isabelle", breakUp: 63, getTogether: 37 },
];

export default function AllBets() {
    const [email, setEmail] = useState("");
    const [userMoney, setUserMoney] = useState(0); // Initialize with 0 or any default value
    useEffect(() => {
        setEmail(localStorage.getItem("email"));
        const fetchUserMoney = async () => {
            await fetch(
                `http://${host}:5000/users/get/${localStorage.getItem("email")}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            )
                .then(async (data) =>
                    setUserMoney((await data.json()).money_amount.toFixed(2)),
                )
                .catch((err) => toast.error(`Error fetching user details: ${err}`));
        };
        fetchUserMoney();
    }, []);
    const comments = [
        { username: "user123", text: "I'm betting on Break Up!" },
        { username: "betMaster", text: "Odds are shifting fast!" },
        {
            username: "analystPro",
            text: "Get Together seems like a safe bet.",
        },
        { username: "trendWatcher", text: "This is a tough call." },
    ]; // Placeholder for comments

    const [activeTab, setActiveTab] = useState("top"); // Initialize state for activeTab
    const [popularBets, setPopularBets] = useState(sampleMatches);
    const [friendsBets, setFriendsBets] = useState([]);
    const [selectedBet, setSelectedBetRaw] = useState(null);
    const [selectedBetIndex, setSelectedBetIndex] = useState(null); // To update popularBets / friendsBets
    const setSelectedBet = (selectedBet, index, activeTab) => {
        if (selectedBet === null) {
            setSelectedBetRaw(null);
            setSelectedBetIndex(null);
            return;
        }
        setSelectedBetRaw(selectedBet);
        setSelectedBetIndex(index);
        if (activeTab === "top") popularBets[index] = selectedBet;
        else friendsBets[index] = selectedBet;
    };

    /* Handling of opening of Specific Bet */
    const fetchFriendsBets = async () => {
        await fetch(`http://${host}:5000/friends/list?email=${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (friends_list_resp) => {
                const friends_list = await friends_list_resp.json();

                if (friends_list.length === 0) {
                    console.log("No problem here, just no friends!");
                    return;
                }
                friends_list.push({ email: email });
                await fetch(
                    `http://${host}:5000/bets/get-for-users?${friends_list.map((friend) => `user_emails=${friend["email"]}`).join("&")}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                )
                    .then(async (bets_data) =>
                        (await bets_data.json()).map((bet) => {
                            return {
                                ...bet,
                                comments: comments,
                            };
                        }),
                    )
                    .then((bets_data) => setFriendsBets(bets_data))
                    .catch((err) =>
                        toast.error(`Error fetching betting data for friends: ${err}`),
                    );
            })
            .catch((err) => toast.error(`Failed to fetch list of friends: ${err}`));
    };

    // Add useEffect to trigger fetch when the "Friends" tab is active
    useEffect(() => {
        if (activeTab === "friends") {
            fetchFriendsBets();
        }
    }, [activeTab]);

    const renderCards = (bets) => {
        return bets.map((bet, index) => {
            return (
                <div
                    key={`${bet.user_id_1.email}-${bet.user_id_2.email}`}
                    className={styles.matchCard}
                >
                    <div className={styles.userContainer}>
                        <img
                            src={bet.user_id_1.profile_pic}
                            alt={bet.user_id_1.name}
                            className={styles.userAvatar}
                        />
                        <p>{bet.user_id_1.name}</p>
                    </div>
                    <p className={styles.vs}>and</p>
                    <div className={styles.userContainer}>
                        <img
                            src={bet.user_id_2.profile_pic}
                            alt={bet.user_id_2.name}
                            className={styles.userAvatar}
                        />
                        <p>{bet.user_id_2.name}</p>
                    </div>
                    <div className={styles.odds}>
                        <p>
                            Break Up:{" "}
                            <strong>{(bet.live_odds.short * 100).toFixed(0)}%</strong>
                        </p>
                        <p>
                            Get Together:{" "}
                            <strong>{(bet.live_odds.long * 100).toFixed(0)}%</strong>
                        </p>
                    </div>
                    <button
                        className={styles.betButton}
                        onClick={() => setSelectedBet(bet, index, activeTab)}
                    >
                        Place Bet
                    </button>
                </div>
            );
        });
    };

    const page1 = (
        <div
            className={`${styles.bettingPage} login-container ${styles.loginContainer} ${selectedBet === null ? styles.midPos : styles.leftPos
                }`}
        >
            <div className={styles.bettingHeader}>
                <h1>Place Your Bets 💸💸</h1>
            </div>
            {/* Ticker Bar */}
            <div className={styles.tickerBar}>
                {tickerData.map((data, index) => (
                    <span key={index} className={styles.tickerItem}>
                        {data.match}: Break Up {data.breakUp}% | Get Together{" "}
                        {data.getTogether}%{" "}
                    </span>
                ))}
            </div>
            {/* Tabs */}
            <div className={styles.tabsContainer}>
                <button
                    className={`${styles.tab} ${activeTab === "top" ? styles.tab_active : ""
                        }`}
                    onClick={() => setActiveTab("top")}
                >
                    Popular Bets
                </button>
                <button
                    className={`${styles.tab} ${activeTab === "friends" ? styles.tab_active : ""
                        }`}
                    onClick={() => setActiveTab("friends")}
                >
                    Bet on Friends
                </button>
            </div>
            {/* Matches List (Scrollable Section) */}
            <div className={styles.scrollable}>
                {activeTab === "top"
                    ? renderCards(popularBets)
                    : renderCards(friendsBets)}
            </div>
        </div>
    );

    return (
        <div className={styles.full}>
            {page1}
            <BettingPage
                email={email}
                userMoney={userMoney}
                selectedBet={selectedBet}
                setSelectedBet={(selectedBet) =>
                    setSelectedBet(selectedBet, selectedBetIndex, activeTab)
                }
            />
        </div>
    );
}
