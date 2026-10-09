import { motion } from "framer-motion";

function BirthdayMessage() {
  return (
    <motion.div
      className="birthday-message"
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 3.3,
        duration: 1.2,
        ease: "easeOut",
      }}
    >
      <p>
        Today isn't just another day...
      </p>

      <p>
        It's the day my favorite person
        <br />
        came into this world.
      </p>

      <motion.div
        className="message-heart"
        animate={{
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ♥
      </motion.div>
    </motion.div>
  );
}

export default BirthdayMessage;