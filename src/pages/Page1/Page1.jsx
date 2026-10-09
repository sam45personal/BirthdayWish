import { useMemo } from "react";
import { motion } from "framer-motion";

import SecretCard from "./components/SecretCard";
import useSecretCode from "./hooks/useSecretCode";

import page1Background from "../../assets/backgrounds/page1-mobile-bg.webp";

import "./Page1.css";

function Page1({ onUnlock }) {
  const {
    code,
    isError,
    isSuccess,
    addDigit,
    removeDigit,
    submitCode,
  } = useSecretCode(onUnlock);

  // Generate the petals only once.
  const petals = useMemo(() => {
    return Array.from({ length: 18 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 7}s`,
      duration: `${5 + Math.random() * 5}s`,
      size: `${8 + Math.random() * 7}px`,
    }));
  }, []);

  return (
    <main
      className="page1"
      style={{
        backgroundImage: `url(${page1Background})`,
      }}
    >
      {/* Dark atmospheric overlay */}
      <div className="page1-overlay" />

      {/* Falling petals */}
      <div className="page1-petals">
        {petals.map((petal) => (
          <span
            key={petal.id}
            className="page1-petal"
            style={{
              left: petal.left,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              width: petal.size,
              height: petal.size,
            }}
          />
        ))}
      </div>

      {/* Main glass card */}
      <motion.div
        className="page1-content"
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        <SecretCard
          code={code}
          isError={isError}
          isSuccess={isSuccess}
          onDigit={addDigit}
          onDelete={removeDigit}
          onSubmit={submitCode}
        />
      </motion.div>

      {/* Successful code animation */}
      {isSuccess && (
        <motion.div
          className="unlock-overlay"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.25,
          }}
        >
          <motion.div
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: [0.5, 1.25, 1.1],
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            ♥
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}

export default Page1;