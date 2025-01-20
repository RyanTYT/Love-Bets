'use client';
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./bottom_menu.module.css";
import { FaHome, FaUsers, FaHeart, FaMoneyBillWave, FaUserCircle } from "react-icons/fa";

const BottomMenu = () => {
    const router = useRouter();
    const pathname = usePathname(); // Get the current path

    const navigateToPage = (page) => {
        router.push(`/dashboard/${page}`);
    };

    const isActive = (page) => pathname === `/dashboard/${page}`;

    return (
        <div className={styles.menuContainer}>
            <div
                className={`${styles.menuItem} ${isActive("home") ? styles.active : ""}`}
                onClick={() => navigateToPage("home")}
            >
                <FaHome className={`${styles.icon} ${isActive("home") ? styles.activeIcon : ""}`} />
            </div>
            <div
                className={`${styles.menuItem} ${isActive("friends") ? styles.active : ""}`}
                onClick={() => navigateToPage("friends")}
            >
                <FaUsers className={`${styles.icon} ${isActive("friends") ? styles.activeIcon : ""}`} />
            </div>
            <div
                className={`${styles.menuItem} ${isActive("matches") ? styles.active : ""}`}
                onClick={() => navigateToPage("matches")}
            >
                <FaHeart className={`${styles.icon} ${isActive("matches") ? styles.activeIcon : ""}`} />
            </div>
            <div
                className={`${styles.menuItem} ${isActive("bets") ? styles.active : ""}`}
                onClick={() => navigateToPage("bets")}
            >
                <FaMoneyBillWave className={`${styles.icon} ${isActive("bets") ? styles.activeIcon : ""}`} />
            </div>
            <div
                className={`${styles.menuItem} ${isActive("settings") ? styles.active : ""}`}
                onClick={() => navigateToPage("settings")}
            >
                <FaUserCircle className={`${styles.icon} ${isActive("settings") ? styles.activeIcon : ""}`} />
            </div>
        </div>
    );
};

export default BottomMenu;

