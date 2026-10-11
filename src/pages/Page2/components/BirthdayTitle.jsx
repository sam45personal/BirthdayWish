import { motion } from "framer-motion";

function BirthdayTitle() {
  return (
    <div className="birthday-title">

      <motion.div
        className="birthday-small-line"
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.4,
          duration: 1,
        }}
      >
        ✨ A little celebration for someone special ✨
      </motion.div>

      <motion.h1
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.92,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          delay: 1.8,
          duration: 1.2,
          ease: "easeOut",
        }}
      >
        Happy Birthday
      </motion.h1>

      <motion.h2
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          delay: 2.5,
          duration: 1.2,
          ease: "easeOut",
        }}
      >
        Meri Jaan,
        Mubbs
        <span> ♥ </span>
      </motion.h2>

    </div>
  );
}

export default BirthdayTitle;