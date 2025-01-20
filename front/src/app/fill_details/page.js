"use client";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function App() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState();
    const [userLocation, setUserLocation] = useState("");
    const [phone, setPhone] = useState();
    const [dob, setDOB] = useState("");
    const [detailPageNo, setDetailPageNo] = useState(1);

    const [locPref, setLocPref] = useState("");
    const [lowerAgePref, setLowerAgePref] = useState();
    const [upperAgePref, setUpperAgePref] = useState();
    const [genderPref, setGenderPref] = useState("");

    const [hobbies, setHobbies] = useState("");

    const [bio, setBio] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [relationship_status, setRelationshipStatus] = useState("");

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const goHome = async () => {
        const details = {
            name: username,
            gender: gender,
            age: age,
            location: userLocation,
            phone_number: phone,
            date_of_birth: dob,

            location_preference: locPref,
            age_preference_lower: lowerAgePref,
            age_preference_upper: upperAgePref,
            gender_preference: genderPref,

            hobbies: hobbies,
            biography: bio,
            profile_pic: "",
            relationship_status: relationship_status,
        };
        // Create a FormData object
        const formData = new FormData();

        // Append all the form fields
        for (const key in details) {
            formData.append(key, details[key]);
        }

        // Append the file if it exists
        console.log("ok")
            //console.log(selectedFile)
       /* if (selectedFile) {
            formData.append("profile_pic", selectedFile);
        }*/

            try {
                const email = localStorage.getItem("email");
                console.log(details);
                const response = await fetch(
                    `http://127.0.0.1:5000/users/edit/${email}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(details), // No need to set `Content-Type` manually
                    }
                );
        
                if (!response.ok) {
                    console.log(response);
                    // throw new Error("Failed to update user details");
                }
                toast.success("Details Updated! Welcome to the Dungeon!");
                router.push("/dashboard/home");
            } catch (error) {
                console.error("Error checking user existence:", error);
                return false;
            }
        };

    const [detail_page_1_pos, setDetailPage1Pos] = useState("mid-pos");
    const [detail_page_2_pos, setDetailPage2Pos] = useState("right-pos");
    const [detail_page_3_pos, setDetailPage3Pos] = useState("right-pos");
    const [detail_page_4_pos, setDetailPage4Pos] = useState("right-pos");

    const goBack = () => {
        setDetailPageNo(Math.max(1, detailPageNo - 1));
        if (detailPageNo === 2) {
            setDetailPage1Pos("mid-pos");
            setDetailPage2Pos("right-pos");
        }
        if (detailPageNo === 3) {
            setDetailPage2Pos("mid-pos");
            setDetailPage3Pos("right-pos");
        }
        if (detailPageNo === 4) {
            setDetailPage3Pos("mid-pos");
            setDetailPage4Pos("right-pos");
        }
    };
    const goNext = () => {
        setDetailPageNo(Math.min(4, detailPageNo + 1));
        if (detailPageNo === 1) {
            setDetailPage1Pos("left-pos");
            setDetailPage2Pos("mid-pos");
        }
        if (detailPageNo === 2) {
            setDetailPage2Pos("left-pos");
            setDetailPage3Pos("mid-pos");
        }
        if (detailPageNo === 3) {
            setDetailPage3Pos("left-pos");
            setDetailPage4Pos("mid-pos");
        }
    };

    const details_page1 = (
        <div className={`login-container ${detail_page_1_pos}`}>
            <div className="logo">Fill in your details below</div>
            <div className="subtitle">Find love recommended by your friends</div>

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
                <div className={styles.buttons}>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goBack}
                    >
                        Back
                    </button>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

    const details_page2 = (
        <div className={`login-container ${detail_page_2_pos}`}>
            <div className="logo">Set your preferences</div>
            <div className="subtitle">Find love recommended by your friends</div>

            <div id="login-form">
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

                <div className={styles.buttons}>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goBack}
                    >
                        Back
                    </button>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

    const details_page3 = (
        <div className={`login-container ${detail_page_3_pos}`}>
            <div className="logo">Add your hobbies</div>

            <div id="login-form">
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
                <div className={styles.buttons}>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goBack}
                    >
                        Back
                    </button>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goNext}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

    const details_page4 = (
        <div className={`login-container ${detail_page_4_pos}`}>
            <div className="logo">Introduce Yourself!</div>

            <div id="login-form">
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
                    <label htmlFor="relationship_status">Relationship Status</label>
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
                <div className={styles.buttons}>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goBack}
                    >
                        Back
                    </button>
                    <button
                        className={`${styles.button} ${styles.primary}`}
                        onClick={goHome}
                    >
                        Enter the Dungeon! :)
                    </button>
                </div>
            </div>
        </div>
    );
    return (
        <div className={styles.full}>
            {details_page1}
            {details_page2}
            {details_page3}
            {details_page4}
        </div>
    );
}

export default App;
