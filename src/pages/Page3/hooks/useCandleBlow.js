import { useEffect, useRef } from "react";

const SHAKE_THRESHOLD = 18;
const SHAKE_COOLDOWN = 1200;

function useCandleBlow({
  onBlow,
  enabled = true,
}) {
  const lastShakeTime = useRef(0);
  const lastMagnitude = useRef(0);
  const onBlowRef = useRef(onBlow);

  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let mounted = true;

    const handleMotion = (event) => {
      if (!mounted) return;

      const acceleration =
        event.accelerationIncludingGravity;

      if (!acceleration) return;

      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      /*
       * Calculate total movement magnitude.
       */
      const magnitude = Math.sqrt(
        x * x +
        y * y +
        z * z
      );

      /*
       * Calculate how much the movement changed.
       */
      const delta = Math.abs(
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
       * Ignore tiny movements.
       */
      if (delta < SHAKE_THRESHOLD) {
        return;
      }

      lastShakeTime.current = now;

      /*
       * Blow all candles.
       */
      onBlowRef.current?.();
    };

    /*
     * iOS permission is requested only when needed.
     */
    const requestMotionPermission = async () => {
      try {
        if (
          typeof DeviceMotionEvent !== "undefined" &&
          typeof DeviceMotionEvent.requestPermission ===
            "function"
        ) {
          const permission =
            await DeviceMotionEvent.requestPermission();

          if (permission !== "granted") {
            return false;
          }
        }

        return true;
      } catch (error) {
        console.warn(
          "Motion permission error:",
          error
        );

        return false;
      }
    };

    /*
     * Android doesn't normally need explicit permission.
     * iOS requires permission after a user gesture.
     */
    const enableMotion = async () => {
      const allowed =
        await requestMotionPermission();

      if (!allowed) {
        return;
      }

      window.addEventListener(
        "devicemotion",
        handleMotion,
        {
          passive: true,
        }
      );
    };

    /*
     * First attempt.
     *
     * Android browsers normally work immediately.
     */
    if (
      typeof DeviceMotionEvent !== "undefined"
    ) {
      if (
        typeof DeviceMotionEvent.requestPermission !==
        "function"
      ) {
        window.addEventListener(
          "devicemotion",
          handleMotion,
          {
            passive: true,
          }
        );
      }
    }

    /*
     * iOS permission button support.
     *
     * Dispatch a custom event that the page can use
     * from a user interaction.
     */
    const handleEnableMotion = () => {
      enableMotion();
    };

    window.addEventListener(
      "enable-candle-motion",
      handleEnableMotion
    );

    return () => {
      mounted = false;

      window.removeEventListener(
        "devicemotion",
        handleMotion
      );

      window.removeEventListener(
        "enable-candle-motion",
        handleEnableMotion
      );
    };
  }, [enabled]);
}

export default useCandleBlow;