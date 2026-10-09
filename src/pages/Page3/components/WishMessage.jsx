import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function WishMessage({ onNext }) {
  return (
    <motion.div
      className="wish-message"
      initial={{
        opacity: 0,
        scale: 0.85,
        y: 25,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.9,
        ease: "easeOut",
      }}
    >

      <motion.div
        className="wish-heart"
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        ♥
      </motion.div>

      <h2>
        Wish made.
      </h2>

      <p>
        I hope this year brings you
        <br />
        everything your heart wishes for.
      </p>

      <motion.button
        className="wish-next"
        onClick={onNext}
        whileTap={{
          scale: 0.95,
        }}
      >
        <span>
          Open your gifts
        </span>

        <ArrowRight size={17} />
      </motion.button>

    </motion.div>
  );
}

export default WishMessage;