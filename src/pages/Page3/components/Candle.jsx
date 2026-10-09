import { motion } from "framer-motion";

function Candle({ id, blown, onClick }) {
  return (
    <motion.button
      className={`candle ${blown ? "candle-blown" : ""}`}
      onClick={() => onClick(id)}
      whileTap={{
        scale: 0.88,
      }}
      aria-label={`Candle ${id + 1}`}
    >

      <span className="candle-stick">
        <span className="candle-stripe" />
      </span>

      {!blown && (
        <motion.span
          className="candle-flame"
          animate={{
            scale: [1, 1.08, 0.94, 1],
            rotate: [-2, 2, -1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="flame-inner" />
        </motion.span>
      )}

      {blown && (
        <motion.span
            className="smoke"
            initial={{
            opacity: 0,
            y: 0,
            scale: 0.5,
            }}
            animate={{
            opacity: [0, 0.65, 0],
            y: -28,
            x: [0, 4, -3],
            scale: [0.5, 1.1, 1.6],
            }}
            transition={{
            duration: 1.5,
            ease: "easeOut",
            }}
        />
        )}

    </motion.button>
  );
}

export default Candle;