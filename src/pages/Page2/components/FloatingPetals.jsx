import { useMemo } from "react";

function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 24 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${7 + Math.random() * 8}px`,
      drift: `${-40 + Math.random() * 80}px`,
    }));
  }, []);

  return (
    <div className="page2-petals">

      {petals.map((petal) => (
        <span
          key={petal.id}
          className="page2-petal"
          style={{
            left: petal.left,
            width: petal.size,
            height: petal.size,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            "--petal-drift": petal.drift,
          }}
        />
      ))}

    </div>
  );
}

export default FloatingPetals;