import { useEffect, useState } from "react";

function useBirthdayReveal() {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    isRevealed,
  };
}

export default useBirthdayReveal;