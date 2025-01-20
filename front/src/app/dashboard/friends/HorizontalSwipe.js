import React, { useState } from "react";
import styles from "./horizontalSwipe.module.css";

// BUG: Component should stay revealed on click remove
// Latency issue with clicking of buttons
function HorizontalSwipe({
  children,
  onSwipeLeft1,
  onSwipeLeft1Name,
  onSwipeLeft2,
  onSwipeLeft2Name,
  onSwipeRight,
  onSwipeRightName,
}) {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipedLeft, setSwipedLeft] = useState(false);
  const [swipedRight, setSwipedRight] = useState(false);

  const threshold = 20;
  const maxSwipe = threshold;
  const dragResistance = 0.15;

  const handleStart = (clientX) => {
    setStartX(clientX);
    setIsSwiping(true);
  };

  const handleMove = (clientX) => {
    if (!isSwiping) return;

    let deltaX = (clientX - startX) * dragResistance;

    setTranslateX(deltaX);
  };

  const handleEnd = () => {
    if (!isSwiping) return;

    if (translateX > threshold) {
      setTranslateX(maxSwipe);
      setSwipedRight(true);
    } else if (translateX < -threshold) {
      setTranslateX(-maxSwipe);
      setSwipedLeft(true);
    } else {
      setSwipedLeft(false);
      setSwipedRight(false);
      setTranslateX(0);
    }

    setIsSwiping(false);
  };

  const [removeFriend, setRemoveFriend] = useState("Remove Friend");

  const handleRightPress = () => {
    if (removeFriend !== "Remove Friend") onSwipeRight;
    else setRemoveFriend("Are you sure?");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        transform: `translateX(${swipedLeft ? `-${threshold}px` : swipedRight ? `${threshold}px` : "0px"})`,
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
      {/* Left swipe buttons */}
      <div
        className={`${styles.swipeButtons} ${styles.swipeButtonsLeft} ${swipedLeft || translateX < 0 ? styles.swipeButtonsLeftRevealed : ""}`}
      >
        {onSwipeLeft1 === null ? (
          <></>
        ) : (
          <button
            onClick={onSwipeLeft1}
            onTouchEnd={onSwipeLeft1}
            className={`${styles.swipeButton} ${styles.matchmakeButton}`}
          >
            {onSwipeLeft1Name || "Matchmake"}
          </button>
        )}
        {onSwipeLeft2 === null ? (
          <></>
        ) : (
          <button
            onClick={onSwipeLeft2}
            onTouchEnd={onSwipeLeft2}
            className={`${styles.swipeButton} ${styles.messageButton}`}
          >
            {onSwipeLeft2Name || "Message Friend"}
          </button>
        )}
      </div>

      {/* Right swipe button */}
      <div
        className={`${styles.swipeButtons} ${styles.swipeButtonsRight} ${swipedRight || translateX > 0 ? styles.swipeButtonsRightRevealed : ""}`}
      >
        <button
          onClick={handleRightPress}
          onTouchEnd={handleRightPress}
          className={`${styles.swipeButton} ${styles.removeButton}`}
        >
          {onSwipeRightName || removeFriend}
        </button>
      </div>

      {/* Content being swiped */}
      <div
        style={{
          width: "100%",
          transform: `translateX(${translateX}%)`,
          transition: isSwiping ? "none" : "transform 0.3s ease",
          touchAction: "none",
          borderRadius: "0",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default HorizontalSwipe;
