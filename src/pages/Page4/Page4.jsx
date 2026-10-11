import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Camera,
  MoonStar,
  BookOpen,
  ArrowRight,
  Home,
} from "lucide-react";

import "./Page4.css";

const gifts = [
  {
    id: "heart",
    icon: BookOpen,
    number: "01",
    title: "Words From My Heart",
    subtitle: "Beautiful thoughts, feelings and little letters just for you...",
    color: "rose",
    page: "Page5",
    button: "Open Letter",
  },
  {
    id: "memories",
    icon: Camera,
    number: "02",
    title: "Our Memories",
    subtitle: "A beautiful journey through the moments we share...",
    color: "gold",
    page: "Page6",
    button: "View Album",
  },
  {
    id: "universe",
    icon: MoonStar,
    number: "03",
    title: "Our Little Universe",
    subtitle: "Little secrets are waiting among the stars...",
    color: "violet",
    page: "Page7",
    button: "Explore",
  },
];

function Page4({ onNavigate }) {
  const handleGiftClick = (gift) => {
    if (onNavigate) {
      onNavigate(gift.page);
    }
  };

  return (
    <main className="page4">
      {/* Cinematic background */}
      <div className="page4-background" aria-hidden="true" />
      <div className="page4-overlay" aria-hidden="true" />

      {/* Main content */}
      <section className="page4-content">
        
        {/* Home button */}
        <motion.button
          className="page4-home"
          onClick={() => onNavigate("Page9")}
          whileTap={{ scale: 0.93 }}
          aria-label="Return to birthday home"
        >
          <Home size={14} />
          <span></span>
        </motion.button>

        <motion.header
          className="page4-header"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="page4-mini-line">
            <span />
            <Heart size={12} fill="currentColor" />
            <span />
          </div>

          <p className="page4-eyebrow">JUST FOR YOU</p>

          <h1>
            I Have
            <br />
            <em>Something Special</em>
            <br />
            For You...
            <span className="page4-heading-heart">♡</span>
          </h1>

          <p className="page4-intro">
            Three little surprises, filled with all my love...
            <span>♡</span>
          </p>
        </motion.header>

        {/* Gift cards */}
        <div className="page4-gifts">
          {gifts.map((gift, index) => {
            const Icon = gift.icon;

            return (
              <motion.button
                key={gift.id}
                className={`gift-card gift-card-${gift.color}`}
                onClick={() => handleGiftClick(gift)}
                initial={{
                  opacity: 0,
                  y: 35,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.3 + index * 0.13,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="gift-card-glow" />
                <span className="gift-number">{gift.number}</span>

                <span className="gift-icon-wrap">
                  <Icon
                    size={21}
                    strokeWidth={1.5}
                    className="gift-icon"
                  />
                </span>

                <span className="gift-copy">
                  <span className="gift-title">{gift.title}</span>
                  <span className="gift-subtitle">{gift.subtitle}</span>
                  <span className="gift-open">
                    {gift.button}
                    <ArrowRight size={14} />
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom message */}
        <motion.div
          className="page4-bottom"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.7 }}
        >
          <Heart size={11} fill="currentColor" />
          <span>Made with love, only for you</span>
          <Heart size={11} fill="currentColor" />
        </motion.div>
      </section>
    </main>
  );
}

export default Page4;
