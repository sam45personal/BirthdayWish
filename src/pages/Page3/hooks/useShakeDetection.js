import { useEffect, useRef } from "react";

function useShakeDetection({
  onShake,
  enabled,
}) {
  const lastAcceleration = useRef({
    x: 0,
    y: 0,
    z: 0,
  });

  const lastShakeTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleMotion = (event) => {
      const acceleration =
        event.accelerationIncludingGravity;

      if (!acceleration) return;

      const { x = 0, y = 0, z = 0 } = acceleration;

      const previous =
        lastAcceleration.current;

      const delta = Math.sqrt(
        Math.pow(x - previous.x, 2) +
        Math.pow(y - previous.y, 2) +
        Math.pow(z - previous.z, 2)
      );

      lastAcceleration.current = {
        x,
        y,
        z,
      };

      const now = Date.now();

      if (
        delta > 15 &&
        now - lastShakeTime.current > 900
      ) {
        lastShakeTime.current = now;

        onShake();
      }
    };

    window.addEventListener(
      "devicemotion",
      handleMotion
    );

    return () => {
      window.removeEventListener(
        "devicemotion",
        handleMotion
      );
    };
  }, [enabled, onShake]);
}

export default useShakeDetection;