import { motion } from "framer-motion";
import "./CodeDisplay.css";

function CodeDisplay({ code }) {
  return (
    <div className="code-display">
      {[0, 1, 2, 3].map((index) => {
        const filled = index < code.length;

        return (
          <motion.span
            key={index}
            className={`code-heart ${filled ? "filled" : ""}`}
            animate={{
              scale: filled ? [0.8, 1.15, 1] : 0.9,
              opacity: filled ? 1 : 0.35,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            {filled ? "♥" : "♡"}
          </motion.span>
        );
      })}
    </div>
  );
}

export default CodeDisplay;