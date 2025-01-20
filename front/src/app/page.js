"use client";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { host } from "@/app/host";

async function checkUserDetailsFilled(email) {
  try {
    const response = await fetch(
      `http://${host}:5000/users/check-name-null/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to check user existence");
    }

    const data = await response.json();
    return data.exists; // NEED TO MAKE SURE BOOLEAN
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
}

// Enter function problematic
function App() {
  const router = useRouter();
  const login = () => {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsLogin(!isLogin);
  };
  const setErrorMessage = (msg) => toast.error(msg);

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://${host}:5000/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      localStorage.setItem("email", email);

      checkUserDetailsFilled(email).then((isFilled) => {
        if (isFilled) router.push("/home");
        else router.push("/fill_details");
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
    }
    try {
        console.log(email)
        console.log(password)
      const response = await fetch(`http://${host}:5000/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      toast.success("Registration successful!");
      toggleForm();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="logo">
      Love Bets
        </div>
        <div className="subtitle">Find love recommended by your friends</div>

        {isLogin ? (
          <div id="login-form">
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                className={styles.inputField}
                required
              />
            </div>
            <button
              className={`${styles.button} ${styles.primary}`}
              onClick={handleLogin}
            >
              Login
            </button>
            <div className={styles.switch}>
              Don't have an account?{" "}
              <a href="#" onClick={toggleForm} className={styles.link}>
                Register
              </a>
            </div>
          </div>
        ) : (
          <div id="register-form">
            <div className={styles.formGroup}>
              <label htmlFor="reg-email">Email</label>
              <input
                type="email"
                id="reg-email"
                placeholder="Enter your email"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRegister();
                  }
                }}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="reg-password">Password</label>
              <input
                type="password"
                id="reg-password"
                placeholder="Create a password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRegister();
                  }
                }}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                className={styles.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRegister();
                  }
                }}
                required
              />
            </div>
            <button
              className={`${styles.button} ${styles.primary}`}
              onClick={handleRegister}
            >
              Register
            </button>
            <div className={styles.switch}>
              Already have an account?{" "}
              <a href="#" onClick={toggleForm} className={styles.link}>
                Login
              </a>
            </div>
          </div>
        )}

        <div className={styles.terms}>
          By continuing, you agree to our{" "}
          <a href="#" className={styles.link}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className={styles.link}>
            Privacy Policy
          </a>
          .
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
