import { motion } from "framer-motion";

import BirthdayTitle from "./components/BirthdayTitle";
import BirthdayMessage from "./components/BirthdayMessage";
import RevealButton from "./components/RevealButton";
import FloatingPetals from "./components/FloatingPetals";

import page2Background from "../../assets/backgrounds/page2-mobile-bg.webp";

import "./Page2.css";

function Page2({ onNext }) {
  return (
    <main
      className="page2"
      style={{
        backgroundImage: `url(${page2Background})`,
      }}
    >
      {/* Cinematic dark overlay */}
      <div className="page2-overlay" />

      {/* Ambient glow */}
      <div className="page2-glow page2-glow-one" />
      <div className="page2-glow page2-glow-two" />

      {/* Floating petals */}
      <FloatingPetals />

      {/* Main birthday content */}
      <div className="page2-content">

        <BirthdayTitle />

        <BirthdayMessage />

        <RevealButton onClick={onNext} />

      </div>

      {/* Bottom atmospheric glow */}
      <motion.div
        className="page2-bottom-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 3,
          duration: 2,
        }}
      />

    </main>
  );
}

export default Page2;