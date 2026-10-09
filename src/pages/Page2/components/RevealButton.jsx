import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function RevealButton({ onClick }) {
  return (
    <motion.button
      className="birthday-next-button"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 4.4,
        duration: 0.9,
      }}
      whileTap={{
        scale: 0.96,
      }}
      whileHover={{
        scale: 1.03,
      }}
      onClick={onClick}
    >
      <span>There's more waiting for you</span>

      <ArrowRight
        size={18}
        strokeWidth={1.8}
      />
    </motion.button>
  );
}

export default RevealButton;