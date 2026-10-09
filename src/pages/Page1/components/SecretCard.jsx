import { LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";

import CodeDisplay from "./CodeDisplay";
import SecretKeypad from "./SecretKeypad";

function SecretCard({
  code,
  isError,
  isSuccess,
  onDigit,
  onDelete,
  onSubmit,
}) {
  return (
    <motion.section
      className={`secret-card ${isError ? "error" : ""} ${
        isSuccess ? "success" : ""
      }`}
      animate={
        isError
          ? {
              x: [-8, 8, -6, 6, -3, 3, 0],
            }
          : {
              x: 0,
            }
      }
      transition={{
        duration: 0.5,
      }}
    >
      <div className="card-heart">
        ♥
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Hii Dear... ♡
      </motion.h1>

      <motion.p
        className="card-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        I made something
        <br />
        special for you ♡
      </motion.p>

      <div className="code-label">
        <LockKeyhole size={19} strokeWidth={1.7} />

        <span>Enter Secret Code</span>
      </div>

      <CodeDisplay code={code} />

      <SecretKeypad
        onDigit={onDigit}
        onDelete={onDelete}
        onSubmit={onSubmit}
      />

      <p className="secret-hint">
        A little hint... ♡
        <br />
        It's something only we know...
      </p>

      {isError && (
        <motion.p
          className="error-message"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Almost... try again ❤️
        </motion.p>
      )}
    </motion.section>
  );
}

export default SecretCard;