"use client";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaWallet } from "react-icons/fa";
import { host } from "@/app/host";

function App() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [userLocation, setUserLocation] = useState("");
  const [phone, setPhone] = useState(0);
  const [dob, setDOB] = useState("");

  const [locPref, setLocPref] = useState("");
  const [lowerAgePref, setLowerAgePref] = useState();
  const [upperAgePref, setUpperAgePref] = useState();
  const [genderPref, setGenderPref] = useState([]);

  const [hobbies, setHobbies] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [relationship_status, setRelationshipStatus] = useState("");
  const [money, setMoney] = useState(0); // State for wallet amount

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const goHome = async () => {
    const details = {
      username: username,
      gender: gender,
      age: age,
      location: userLocation,
      phone: phone,
      DOB: dob,
      location_pref: locPref,
      lower_age_pref: lowerAgePref,
      upper_age_pref: upperAgePref,
      genderPref: genderPref,
      hobbies: hobbies,
      bio: bio,
      profile_picture: selectedFile,
      relationship_status: relationship_status,
    };
    try {
      const response = await fetch(
        `http://${host}:5000/user/update-details`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update details");
      }
      toast.success("Details Updated! Welcome to the Dungeon!");
      router.push("/home");
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };

  const getDetails = async (email) => {
    try {
      const response = await fetch(`http://${host}:5000/users/get/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      const data = await response.json();
      console.log(data);

      // Update state with fetched details
      setUsername(data.username || "");
      setGender(data.gender || "");
      setAge(data.age || "");
      setUserLocation(data.location || "");
      setPhone(data.phone || "");
      setDOB(data.DOB || "");
      setLocPref(data.location_pref || "");
      setLowerAgePref(data.lower_age_pref || "");
      setUpperAgePref(data.upper_age_pref || "");
      setGenderPref(data.genderPref || []);
      setHobbies(data.hobbies || "");
      setBio(data.bio || "");
      setRelationshipStatus(data.relationship_status || "");
      setMoney(data.money_amount || 0); // Update wallet amount
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    getDetails(email); // Fetch details when the component loads
  }, []);

  const details_page1 = (
    <div className={styles.loginContainer}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="logo">Profile</div>
          <div className="subtitle">Update Profile Details</div>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <FaWallet />
          {money}
        </div>
      </div>

      <div id="login-form">
        <div className={styles.formGroup}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your Full Name"
            className={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            placeholder="Enter your Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={gender} // Assuming you have a state variable 'gender'
            onChange={(e) => setGender(e.target.value)} // Assuming 'setGender' is your state setter
            className={styles.inputField}
            required
          >
            <option value="" disabled>
              Select your gender
            </option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="Location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter your Location"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="DOB">Date of Birth</label>
          <input
            type="date"
            id="DOB"
            placeholder="Enter your Date of Birth"
            value={dob}
            onChange={(e) => setDOB(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="number"
            id="location"
            placeholder="Enter your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="locPref">Location</label>
          <input
            type="text"
            id="locationPref"
            placeholder="Where do you want to find your peeps at"
            className={styles.inputField}
            value={locPref}
            onChange={(e) => setLocPref(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.ageLabel}>Age Range</label>
          <div className={styles.rangeContainer}>
            <div className={styles.rangeGroup}>
              <label htmlFor="lower-bound">Lower Bound</label>
              <input
                type="number"
                id="lower-bound"
                placeholder="Enter lower bound"
                value={lowerAgePref}
                onChange={(e) => setLowerAgePref(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.rangeGroup}>
              <label htmlFor="upper-bound">Upper Bound</label>
              <input
                type="number"
                id="upper-bound"
                placeholder="Enter upper bound"
                value={upperAgePref}
                onChange={(e) => setUpperAgePref(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="genderPref">Gender</label>
          <select
            id="genderPref"
            value={genderPref} // Assuming you have a state variable 'gender'
            onChange={(e) => setGenderPref(e.target.value)} // Assuming 'setGender' is your state setter
            className={styles.inputField}
            multiple
            required
          >
            <option value="" disabled>
              Select which gender you would like to be matched with
            </option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="locPref">Hobbies</label>
          <input
            type="text"
            id="locationPref"
            placeholder="Where do you want to find your peeps at"
            className={styles.inputField}
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="locPref">Bio</label>
          <input
            type="text"
            id="locationPref"
            placeholder="I like girls, guys, anybody under the sun..."
            className={styles.inputField}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="pic">Profile Picture</label>
          <input
            type="file"
            id="pic"
            onChange={handleFileChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="relationship_status">Profile Picture</label>
          <select
            id="relationship_status"
            value={relationship_status} // Assuming you have a state variable 'gender'
            onChange={(e) => setRelationshipStatus(e.target.value)} // Assuming 'setGender' is your state setter
            className={styles.inputField}
            required
          >
            <option value="" disabled>
              Select your Relationship Status
            </option>
            <option value="single">Single</option>
            <option value="relationship">In a Relationship (cute Emoji)</option>
            <option value="complicated">It's complicated (Emoji)</option>
          </select>
        </div>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={goHome}
        >
          Update Profile Details
        </button>
      </div>
    </div>
  );
  return <div className={styles.full}>{details_page1}</div>;
}

export default App;
