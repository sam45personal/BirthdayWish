import { motion } from "framer-motion";
import { Delete, Heart } from "lucide-react";

function SecretKeypad({
  onDigit,
  onDelete,
  onSubmit,
}) {
  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "delete", "0", "enter",
  ];

  const handleClick = (key) => {
    if (key === "delete") {
      onDelete();
      return;
    }

    if (key === "enter") {
      onSubmit();
      return;
    }

    onDigit(key);
  };

  return (
    <div className="secret-keypad">
      {keys.map((key) => (
        <motion.button
          key={key}
          type="button"
          className="keypad-button"
          whileHover={{
            scale: 1.06,
          }}
          whileTap={{
            scale: 0.88,
          }}
          onClick={() => handleClick(key)}
          aria-label={
            key === "delete"
              ? "Delete"
              : key === "enter"
                ? "Submit secret code"
                : key
          }
        >
          {key === "delete" && <Delete size={22} strokeWidth={1.8} />}

          {key === "enter" && (
            <Heart
              size={22}
              fill="currentColor"
              strokeWidth={1.5}
            />
          )}

          {key !== "delete" && key !== "enter" && key}
        </motion.button>
      ))}
    </div>
  );
}

export default SecretKeypad;