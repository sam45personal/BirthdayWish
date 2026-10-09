import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import WishHeader from "./components/WishHeader";
import BirthdayCake from "./components/BirthdayCake";
import WishMessage from "./components/WishMessage";
import BlowButton from "./components/BlowButton";

import "./Page3.css";

function Page3({ onNext }) {
  const [candles, setCandles] = useState(
    Array.from({ length: 5 }, (_, index) => ({
      id: index,
      blown: false,
    }))
  );

  const [motionEnabled, setMotionEnabled] = useState(false);

  const lastMagnitude = useRef(0);
  const lastShakeTime = useRef(0);

  const allBlown = candles.every(
    (candle) => candle.blown
  );

  /* =====================================================
     BLOW ONE CANDLE
  ===================================================== */

  const blowCandle = (id) => {
    setCandles((current) =>
      current.map((candle) =>
        candle.id === id
          ? {
              ...candle,
              blown: true,
            }
          : candle
      )
    );
  };

  /* =====================================================
     BLOW ALL CANDLES
  ===================================================== */

  const blowAllCandles = () => {
    setCandles((current) =>
      current.map((candle) => ({
        ...candle,
        blown: true,
      }))
    );
  };

  /* =====================================================
     REQUEST MOTION PERMISSION
     Required mainly for iOS Safari.
  ===================================================== */

  const enableMotion = async () => {
    try {
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission ===
          "function"
      ) {
        const permission =
          await DeviceMotionEvent.requestPermission();

        if (permission === "granted") {
          setMotionEnabled(true);
        }

        return;
      }

      /*
       * Android Chrome normally doesn't require
       * explicit permission.
       */
      setMotionEnabled(true);
    } catch (error) {
      console.warn(
        "Unable to enable device motion:",
        error
      );
    }
  };

  /* =====================================================
     SHAKE DETECTION
  ===================================================== */

  useEffect(() => {
    if (!motionEnabled || allBlown) {
      return;
    }

    const SHAKE_THRESHOLD = 15;
    const SHAKE_COOLDOWN = 1200;

    const handleDeviceMotion = (event) => {
      const acceleration =
        event.accelerationIncludingGravity;

      if (!acceleration) {
        return;
      }

      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      const magnitude = Math.sqrt(
        x * x +
        y * y +
        z * z
      );

      const movement = Math.abs(
        magnitude - lastMagnitude.current
      );

      lastMagnitude.current = magnitude;

      const now = Date.now();

      /*
       * Prevent multiple triggers from one shake.
       */
      if (
        now - lastShakeTime.current <
        SHAKE_COOLDOWN
      ) {
        return;
      }

      /*
       * Strong enough movement = shake.
       */
      if (movement >= SHAKE_THRESHOLD) {
        lastShakeTime.current = now;

        blowAllCandles();
      }
    };

    window.addEventListener(
      "devicemotion",
      handleDeviceMotion,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "devicemotion",
        handleDeviceMotion
      );
    };
  }, [motionEnabled, allBlown]);

  /* =====================================================
     AUTOMATIC ANDROID MOTION ENABLE
  ===================================================== */

  useEffect(() => {
    /*
     * Android browsers don't need permission.
     *
     * We still try to enable it automatically.
     * iOS will wait for the user interaction below.
     */

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission !==
        "function"
    ) {
      setMotionEnabled(true);
    }
  }, []);

  /* =====================================================
     RESET MAGNITUDE WHEN PAGE IS FINISHED
  ===================================================== */

  useEffect(() => {
    if (allBlown) {
      lastMagnitude.current = 0;
    }
  }, [allBlown]);

  return (
    <main className="page3">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div
        className="page3-stars"
        aria-hidden="true"
      />

      <div
        className="page3-stars-secondary"
        aria-hidden="true"
      />

      <div
        className="page3-glow"
        aria-hidden="true"
      />

      <div
        className="page3-moon-glow"
        aria-hidden="true"
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="page3-content">

        {/* Header */}
        <WishHeader />

        {/* =================================================
            CAKE
        ================================================= */}

        <section
          className={`page3-cake-section ${
            allBlown
              ? "candles-finished"
              : ""
          }`}
        >
          <div
            className="cake-top-light"
            aria-hidden="true"
          />

          <motion.div
            className="cake-wrapper"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <BirthdayCake
              candles={candles}
              onCandleClick={blowCandle}
            />
          </motion.div>
        </section>

        {/* =================================================
            INSTRUCTION
        ================================================= */}

        <AnimatePresence mode="wait">

          {!allBlown && (
            <motion.div
              key="instruction"
              className="page3-instruction"
              onClick={enableMotion}
              onPointerDown={enableMotion}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <div className="instruction-icon">
                🕯️
              </div>

              <div className="instruction-content">
                <strong>
                  Make a wish, my love
                </strong>

                <span>
                  Tap the candles or shake your phone
                  to blow them out
                </span>
              </div>
            </motion.div>
          )}

          {allBlown && (
            <motion.div
              key="wish-intro"
              className="wish-intro"
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <span className="wish-line" />

              <span className="wish-intro-text">
                Your wish has been made...
              </span>

              <span className="wish-line" />
            </motion.div>
          )}

        </AnimatePresence>

        {/* =================================================
            WISH MESSAGE
        ================================================= */}

        <AnimatePresence>
          {allBlown && (
            <motion.div
              className="page3-wish-container"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.75,
                delay: 0.25,
                ease: "easeOut",
              }}
            >
              <WishMessage
                onNext={onNext}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="page3-bottom-space" />

      </div>

      {/* =================================================
          BLOW ALL BUTTON
      ================================================= */}

      <AnimatePresence>
        {!allBlown && (
          <motion.div
            className="page3-blow-button-wrapper"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 15,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <BlowButton
              onClick={blowAllCandles}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

export default Page3;