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
import { toast } from "react-toastify";
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

const sampleMatches = [
  {
    id: 1,
    user1: {
      name: "Kim Kardashian",
      profile_pic: "../images/celeb/kim_kardashian.jpg",
    },
    user2: {
      name: "Pete Davidson",
      profile_pic: "../images/celeb/pete_davidson.jpg",
    },
    odds: { breakUp: 55, getTogether: 45 },
    bettingVolume: { breakUp: 3200, getTogether: 2600 },
    oddsHistory: [
      { time: "10h ago", breakUp: 45, getTogether: 55 },
      { time: "9h ago", breakUp: 50, getTogether: 50 },
      { time: "8h ago", breakUp: 60, getTogether: 40 },
      { time: "7h ago", breakUp: 55, getTogether: 45 },
      { time: "6h ago", breakUp: 58, getTogether: 42 },
      { time: "5h ago", breakUp: 62, getTogether: 38 },
      { time: "4h ago", breakUp: 55, getTogether: 45 },
      { time: "3h ago", breakUp: 53, getTogether: 47 },
      { time: "2h ago", breakUp: 55, getTogether: 45 },
      { time: "1h ago", breakUp: 55, getTogether: 45 },
    ],
    description:
      "Will Kim Kardashian and Pete Davidson stay together, or is it over? Place your bets!",
    comments: [
      { username: "fan123", text: "Break Up odds are looking good!" },
      { username: "trendWatcher", text: "Kim K is unpredictable!" },
    ],
  },
  {
    id: 2,
    user1: { name: "Jay-Z", profile_pic: "../images/celeb/jayz.jpg" },
    user2: { name: "Beyoncé", profile_pic: "../images/celeb/beyonce.jpg" },
    odds: { breakUp: 10, getTogether: 90 },
    bettingVolume: { breakUp: 1500, getTogether: 7000 },
    oddsHistory: [
      { time: "10h ago", breakUp: 8, getTogether: 92 },
      { time: "9h ago", breakUp: 10, getTogether: 90 },
      { time: "8h ago", breakUp: 12, getTogether: 88 },
      { time: "7h ago", breakUp: 15, getTogether: 85 },
      { time: "6h ago", breakUp: 10, getTogether: 90 },
      { time: "5h ago", breakUp: 11, getTogether: 89 },
      { time: "4h ago", breakUp: 9, getTogether: 91 },
      { time: "3h ago", breakUp: 10, getTogether: 90 },
      { time: "2h ago", breakUp: 8, getTogether: 92 },
      { time: "1h ago", breakUp: 10, getTogether: 90 },
    ],
    description:
      "Jay-Z and Beyoncé: Break Up or eternal power couple? Bet now!",
    comments: [
      { username: "musicFan", text: "They’re untouchable!" },
      {
        username: "trendWatcher",
        text: "Break Up odds are too low to ignore.",
      },
    ],
  },
  {
    id: 3,
    user1: {
      name: "Blake Lively",
      profile_pic: "../images/celeb/blake_lively.jpg",
    },
    user2: {
      name: "Ryan Reynolds",
      profile_pic: "../images/celeb/ryan_reynolds.jpg",
    },
    odds: { breakUp: 15, getTogether: 85 },
    bettingVolume: { breakUp: 2200, getTogether: 5400 },
    oddsHistory: [
      { time: "10h ago", breakUp: 12, getTogether: 88 },
      { time: "9h ago", breakUp: 15, getTogether: 85 },
      { time: "8h ago", breakUp: 18, getTogether: 82 },
      { time: "7h ago", breakUp: 20, getTogether: 80 },
      { time: "6h ago", breakUp: 14, getTogether: 86 },
      { time: "5h ago", breakUp: 17, getTogether: 83 },
      { time: "4h ago", breakUp: 15, getTogether: 85 },
      { time: "3h ago", breakUp: 18, getTogether: 82 },
      { time: "2h ago", breakUp: 14, getTogether: 86 },
      { time: "1h ago", breakUp: 15, getTogether: 85 },
    ],
    description:
      "Blake Lively and Ryan Reynolds: Can they continue their perfect relationship? Bet now!",
    comments: [
      { username: "fan4life", text: "Get Together is the safest bet!" },
      { username: "betMaster", text: "Break Up odds are still risky!" },
    ],
  },
  {
    id: 4,
    user1: { name: "Joe Jonas", profile_pic: "../images/celeb/joe_jonas.jpg" },
    user2: {
      name: "Sophie Turner",
      profile_pic: "../images/celeb/sophie_turner.jpg",
    },
    odds: { breakUp: 75, getTogether: 25 },
    bettingVolume: { breakUp: 4500, getTogether: 1500 },
    oddsHistory: [
      { time: "10h ago", breakUp: 65, getTogether: 35 },
      { time: "9h ago", breakUp: 68, getTogether: 32 },
      { time: "8h ago", breakUp: 70, getTogether: 30 },
      { time: "7h ago", breakUp: 72, getTogether: 28 },
      { time: "6h ago", breakUp: 75, getTogether: 25 },
      { time: "5h ago", breakUp: 78, getTogether: 22 },
      { time: "4h ago", breakUp: 74, getTogether: 26 },
      { time: "3h ago", breakUp: 75, getTogether: 25 },
      { time: "2h ago", breakUp: 80, getTogether: 20 },
      { time: "1h ago", breakUp: 75, getTogether: 25 },
    ],
    description:
      "Joe Jonas and Sophie Turner: Is this the end of their story? Place your bets!",
    comments: [
      { username: "breakingNews", text: "The odds are clearly against them!" },
      { username: "userConcerned", text: "Break Up feels inevitable." },
    ],
  },
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

const BettingPage = () => {
  const [matches, setMatches] = useState(sampleMatches);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("top"); // Initialize state for activeTab
  const [userMoney, setUserMoney] = useState(0); // Initialize with 0 or any default value
  const userEmail = "quackers@nus.com"; // Replace with the actual user's email or fetch from localStorage/session

  // Fetch the user's money from the backend
  const fetchUserMoney = async () => {
    try {
      const response = await fetch(
        `http://${host}:5000/users/get/${userEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user's money");
      }

      const data = await response.json();
      setUserMoney(data.money_amount); // Assuming the API returns `money_amount`
    } catch (error) {
      console.error("Error fetching user's money:", error);
    }
  };
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [betAmount, setBetAmount] = useState(0);

  const handleBetPopup = async (match) => {
    try {
      setShowPopup(true); // Open the popup

      // Optional: Fetch the current state of the bet from the backend if needed
      const response = await fetch(
        `http://${host}:5000/bets/get/${match.id}`,
        {
          method: "GET", // Change to the appropriate endpoint if needed
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error fetching the bet details");
      }

      const betData = await response.json();
      const new_match = { ...match };
      new_match["user1"]["name"] = betData["user_id_1"]["name"];
      new_match["user2"]["name"] = betData["user_id_2"]["name"];
      new_match["user1"]["email"] = betData["user_id_1"]["email"];
      new_match["user2"]["email"] = betData["user_id_2"]["email"];
      console.log(new_match);
      setSelectedMatch({
        ...new_match,
      });
      console.log("Fetched Bet Details:", betData);
    } catch (error) {
      console.error("Failed to fetch bet details:", error);
    }
  };

  // Handle placing/updating the bet
  const handlePlaceBet = async (option) => {
    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
      toast.error("Please enter a valid bet amount!");
      return;
    }

    try {
      // Fetch existing cumulative arrays
      const fetchResponse = await fetch(
        `http://${host}:5000/bets/get/${selectedMatch.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!fetchResponse.ok) {
        throw new Error("Error fetching the bet details");
      }

      const betData = await fetchResponse.json();
      const cumulativeFor = JSON.parse(betData.cumulative_for); // Convert string to array
      const cumulativeAgainst = JSON.parse(betData.cumulative_against); // Convert string to array

      const updatedCumulativeFor = [...cumulativeFor];
      const updatedCumulativeAgainst = [...cumulativeAgainst];

      // Update the correct array
      if (option === "Get Together") {
        const lastValue =
          updatedCumulativeFor[updatedCumulativeFor.length - 1] || 0;
        const newValue = lastValue + parseFloat(betAmount);
        updatedCumulativeFor.push(newValue);
      } else if (option === "Break Up") {
        const lastValue =
          updatedCumulativeAgainst[updatedCumulativeAgainst.length - 1] || 0;
        const newValue = lastValue + parseFloat(betAmount);
        updatedCumulativeAgainst.push(newValue);
      }

      // Compute updated odds
      const cumulativeAgainstLast =
        updatedCumulativeAgainst[updatedCumulativeAgainst.length - 1];
      const cumulativeForLast =
        updatedCumulativeFor[updatedCumulativeFor.length - 1];
      const total = cumulativeAgainstLast + cumulativeForLast;

      const breakUpOdds = Math.round((cumulativeAgainstLast / total) * 100);
      const getTogetherOdds = 100 - breakUpOdds;

      // Update oddsHistory
      const newOddsHistory = [
        ...selectedMatch.oddsHistory,
        {
          time: `Interval ${updatedCumulativeFor.length}`, // Dynamic interval
          breakUp: breakUpOdds,
          getTogether: getTogetherOdds,
        },
      ];

      const email = localStorage.getItem("email");
      console.log(email);
      console.log(selectedMatch.user1);
      console.log(selectedMatch.user2.email);
      // Update the bet on the backend
      const updateResponse = await fetch(
        `http://${host}:5000/bets/update/${selectedMatch.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            better: email,
            user1_id: selectedMatch.user1.email,
            user2_id: selectedMatch.user2.email,
            bet_amount: betAmount,
            bet_direction: option === "Get Together" ? true : false,
            cumulative_for: JSON.stringify(updatedCumulativeFor), // Convert array back to string
            cumulative_against: JSON.stringify(updatedCumulativeAgainst), // Convert array back to string
          }),
        },
      );

      if (!updateResponse.ok) {
        throw new Error("Error updating the bet");
      }

      const updatedBet = await updateResponse.json();

      // Update the selected match with the new oddsHistory and re-render the chart
      setSelectedMatch((prevMatch) => ({
        ...prevMatch,
        oddsHistory: newOddsHistory,
        bettingVolume: {
          breakUp: cumulativeAgainstLast,
          getTogether: cumulativeForLast,
        },
      }));

      toast.success(
        `You placed a bet of $${betAmount} on "${option}" for ${selectedMatch.user1.name} & ${selectedMatch.user2.name}!`,
      );

      console.log("Bet updated successfully:", updatedBet);
      setShowPopup(false); // Close the popup after updating
    } catch (error) {
      console.error("Failed to update the bet:", error);
      toast.error("Failed to place the bet.");
    }
  };

  // Fetch money when the component mounts
  useEffect(() => {
    fetchUserMoney();
  }, []);

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedMatch(null);
    setBetAmount("");
  };
  const [friendMatches, setFriendMatches] = useState([]);

  const fetchFriendMatches = async () => {
    try {
      const userId = "quackers@nus.com"; // Replace with the actual user's email
      const friendsResponse = await fetch(
        `http://${host}:5000/friends/list_bets/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!friendsResponse.ok) {
        console.error(
          "Failed to fetch friends list:",
          await friendsResponse.json(),
        );
        return;
      }

      const friendsData = await friendsResponse.json();
      const friendsEmails = friendsData.friends;

      if (!friendsEmails || friendsEmails.length === 0) {
        console.warn("No friends found for the user.");
        setFriendMatches([]);
        return;
      }

      const email = localStorage.getItem("email");
      friendsEmails.push(email);
      const betsResponse = await fetch(
        `http://${host}:5000/bets/friends_bets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friends_emails: friendsEmails }),
        },
      );

      if (!betsResponse.ok) {
        console.error(
          "Failed to fetch friend matches:",
          await betsResponse.json(),
        );
        return;
      }

      const betsData = await betsResponse.json();

      console.log(betsData);
      const transformedMatches = betsData.bets.map((bet) => {
        const cumulativeAgainst = JSON.parse(bet.cumulative_against); // Convert string to array
        const cumulativeFor = JSON.parse(bet.cumulative_for); // Convert string to array
        if (cumulativeAgainst === null) console.log(1);

        // Compute odds history dynamically
        console.log(cumulativeAgainst)

        const oddsHistory = cumulativeAgainst?.map((against, index) => {
          const total = against + cumulativeFor[index];
          const breakUp = Math.round((against / total) * 100);
          const getTogether = 100 - breakUp;

          return {
            time: `Interval ${index + 1}`, // Replace with real time intervals if available
            breakUp,
            getTogether,
          };
        });

        let cumulativeAgainstLast = 1;
        let cumulativeForLast = 1;
        if (cumulativeAgainst !== null) {
          cumulativeAgainstLast =
            cumulativeAgainst[cumulativeAgainst.length - 1];
        }
        if (cumulativeFor !== null) {
          cumulativeForLast = cumulativeFor[cumulativeFor.length - 1];
        }

        const breakUp = Math.round(
          (cumulativeAgainstLast /
            (cumulativeAgainstLast + cumulativeForLast)) *
            100,
        );
        const getTogether = 100 - breakUp;

        return {
          id: bet.id,
          user1: { name: bet.user_1.name, profile_pic: bet.user_1.profile_pic },
          user2: { name: bet.user_2.name, profile_pic: bet.user_2.profile_pic },
          odds: { breakUp, getTogether },
          oddsHistory, // Include computed oddsHistory
          bettingVolume: {
            breakUp: cumulativeAgainstLast,
            getTogether: cumulativeForLast,
          },
          description: `Bet whether ${bet.user_1.name || "Unknown"} & ${bet.user_2.name || "Unknown"} will get together or not!`,

          comments: [
            { username: "user123", text: "I'm betting on Break Up!" },
            { username: "betMaster", text: "Odds are shifting fast!" },
            {
              username: "analystPro",
              text: "Get Together seems like a safe bet.",
            },
            { username: "trendWatcher", text: "This is a tough call." },
          ], // Placeholder for comments
        };
      });

      setFriendMatches(transformedMatches);
    } catch (error) {
      console.error("Error fetching friend matches:", error);
    }
  };

  // Add useEffect to trigger fetch when the "Friends" tab is active
  useEffect(() => {
    if (activeTab === "friends") {
      fetchFriendMatches();
    }
  }, [activeTab]);

  const getChartData = (history) => ({
    labels: history === "" ? "" : history?.map((entry) => entry.time) || [], // Fallback to an empty array if history is undefined
    datasets: [
      {
        label: "Break Up",
        data:
          history === "" ? "" : history?.map((entry) => entry.breakUp) || [], // Fallback to an empty array
        borderColor: "#ff6666",
        backgroundColor: "rgba(255, 102, 102, 0.2)",
        fill: true,
      },
      {
        label: "Get Together",
        data:
          history === ""
            ? ""
            : history?.map((entry) => entry.getTogether) || [], // Fallback to an empty array
        borderColor: "#0073b1",
        backgroundColor: "rgba(0, 115, 177, 0.2)",
        fill: true,
      },
    ],
  });

  const getBarChartData = (volume) => ({
    labels: ["Break Up", "Get Together"],
    datasets: [
      {
        label: "Betting Volume",
        data: [volume.breakUp, volume.getTogether],
        backgroundColor: ["#ff6666", "#0073b1"],
      },
    ],
  });
  const renderCards = () => {
    if (activeTab === "top") {
      return matches.map((match) => (
        <div key={match.id} className={styles.matchCard}>
          <div className={styles.userContainer}>
            <img
              src={match.user1.profile_pic}
              alt={match.user1.name}
              className={styles.userAvatar}
            />
            <p>{match.user1.name}</p>
          </div>
          <p className={styles.vs}>and</p>
          <div className={styles.userContainer}>
            <img
              src={match.user2.profile_pic}
              alt={match.user2.name}
              className={styles.userAvatar}
            />
            <p>{match.user2.name}</p>
          </div>
          <div className={styles.odds}>
            <p>
              Break Up: <strong>{match.odds.breakUp}%</strong>
            </p>
            <p>
              Get Together: <strong>{match.odds.getTogether}%</strong>
            </p>
          </div>
          <button
            className={styles.betButton}
            onClick={() => handleBetPopup(match)}
          >
            Place Bet
          </button>
        </div>
      ));
    } else if (activeTab === "friends") {
      return friendMatches.map((match) => (
        <div key={match.id} className={styles.matchCard}>
          <div className={styles.userContainer}>
            <img
              src={match.user1.profile_pic || "/images/quackers.jpg"}
              alt={match.user1.name || "User"}
              className={styles.userAvatar}
            />

            <p>{match.user1.name}</p>
          </div>
          <p className={styles.vs}>and</p>
          <div className={styles.userContainer}>
            <img
              src={match.user2.profile_pic || "/images/quackers.jpg"}
              alt={match.user2.name || "User"}
              className={styles.userAvatar}
            />
            <p>{match.user2.name}</p>
          </div>
          <div className={styles.odds}>
            <p>
              Break Up: <strong>{match.odds.breakUp}%</strong>
            </p>
            <p>
              Get Together: <strong>{match.odds.getTogether}%</strong>
            </p>
          </div>
          <button
            className={styles.betButton}
            onClick={() => handleBetPopup(match)}
          >
            Place Bet
          </button>
        </div>
      ));
    }
    return null;
  };

  const page1 = (
    <div
      className={`${styles.bettingPage} login-container ${styles.loginContainer} ${
        showPopup ? styles.leftPos : styles.midPos
      }`}
    >
      <div className={styles.bettingHeader}>
        <h1>Place Your Bets</h1>
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
          className={`${styles.tab} ${
            activeTab === "top" ? styles.tab_active : ""
          }`}
          onClick={() => setActiveTab("top")}
        >
          Popular Bets
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "friends" ? styles.tab_active : ""
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Bet on Friends
        </button>
      </div>
      {/* Matches List (Scrollable Section) */}
      <div className={styles.scrollable}>
        {activeTab === "top"
          ? renderCards(sampleMatches)
          : renderCards(friendMatches)}
      </div>
    </div>
  );

  const page2 = (
    <div
      className={`${styles.popupOverlay} login-container ${
        showPopup ? styles.midPos : styles.rightPos
      }`}
    >
      <div className={styles.popupContent}>
        {/* Heart Animation */}
        <div className={styles.heartAnimation}>
          <img
            src={
              selectedMatch === null
                ? ""
                : selectedMatch.user1.profile_pic || "/images/quackers.jpg"
            }
            alt={selectedMatch === null ? "" : selectedMatch.user1.name}
            className={styles.userAvatarHeart}
          />
          <div className={styles.heart}></div>
          <img
            src={
              selectedMatch === null
                ? ""
                : selectedMatch.user2.profile_pic || "/images/quackers.jpg"
            }
            alt={selectedMatch === null ? "" : selectedMatch.user2.name}
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
            onClick={() => setShowPopup(false)}
          />
          <div className={`${styles.logo} logo`}>
            Place your BETS for{" "}
            {selectedMatch === null ? "" : selectedMatch.user1.name} &{" "}
            {selectedMatch === null ? "" : selectedMatch.user2.name}
          </div>
        </div>

        {/* Match Description */}
        <p className={styles.description}>
          {selectedMatch === null ? "" : selectedMatch.description}
        </p>

        {/* Charts Section */}
        <div className={styles.charts}>
          <h3>Odds Over Time</h3>
          <Line
            data={getChartData(
              selectedMatch === null ? "" : selectedMatch.oddsHistory,
            )}
          />
          <h3>Betting Volume</h3>
          <Bar
            data={getBarChartData(
              selectedMatch === null ? "" : selectedMatch.bettingVolume,
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
            {selectedMatch === null
              ? ""
              : selectedMatch.comments.map((comment, index) => (
                  <div key={index} className={styles.comment}>
                    <strong>{comment.username}:</strong> {comment.text}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.full}>
      {page1}
      {page2}
    </div>
  );
};

export default BettingPage;
