import { motion } from "framer-motion";
import { Wind } from "lucide-react";

function BlowButton({ onClick }) {
  return (
    <motion.button
      className="blow-button"
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 2,
        duration: 0.8,
      }}
      whileTap={{
        scale: 0.94,
      }}
      onClick={onClick}
    >
      <Wind size={17} />

      <span>
        Blow out all candles
      </span>
    </motion.button>
  );
}

export default BlowButton;