import { motion } from "framer-motion";

function WishHeader() {
  return (
    <motion.header
      className="wish-header"
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
    >
      <span className="wish-eyebrow">
        A little moment for you
      </span>

      <h1>
        Make a Wish
      </h1>

      <p>
        Close your eyes...
        <br />
        and make it count. ♥
      </p>
    </motion.header>
  );
}

export default WishHeader;