import React, { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {

  ArrowLeft,

  ArrowRight,

  Heart,

  Music2,

  Sparkles,

  Feather,
  Image as ImageIcon,
} from "lucide-react";

import "./Page5.css";

const LETTERS = [

  {

    id: 1,

    type: "letter",

    label: "Letter",

    title: "My Love, Mub ♡",

    lines: [

      "On your special day, I just want you to know how truly special you are to me.",

      "You bring so much warmth, happiness and meaning into my life.",

      "Every moment with you feels like a beautiful chapter in a story I never want to end.",

      "Your smile makes ordinary moments feel a little more beautiful.",

    ],

    ending: "Happy Birthday, my love. ♡",

  },

  {

    id: 2,

    type: "shayari",

    label: "Shayari",

    title: "For Your Smile ♡",

    lines: [

      "Tumhari muskurahat mein kuch toh baat hai,",

      "jo har udaasi ko khamoshi se mita deti hai.",

      "Tum paas raho ya thodi door,",

      "dil ko bas tumhari hi zarurat si lagti hai.",

      "Aur agar khushi ka koi naam ho...",

      "toh shayad woh naam tum ho. ♡",

    ],

    ending: "For the smile I could never stop loving.",

  },

  {

    id: 3,

    type: "letter",

    label: "Letter",

    title: "Things I Never Say",

    lines: [

      "There are so many little things I feel but don't always know how to say.",

      "Sometimes I simply look at you and feel that im so much lucky that you are part of my life, sorry not a part you are my whole life.",

      "You may not realize it, but your presence has a way of making difficult days feel lighter.",

      "I hope you always know that you matter more than you sometimes realize.",

    ],

    ending: "Some feelings are better written than spoken. ♡",

  },

  {

    id: 4,

    type: "shayari",

    label: "Shayari",

    title: "A Little Piece of Us",

    lines: [

      "Kuch pal yaadon mein reh jaate hain,",

      "kuch log dil mein bas jaate hain.",

      "Waqt badalta rahe chahe jitna,",

      "kuch rishte phir bhi khaas reh jaate hain.",

      "Aur tum...",

      "unhi khoobsurat rishton mein se ek ho. ♡",

    ],

    ending: "A little piece of us, kept forever.",

  },

  {

    id: 5,

    type: "letter",

    label: "Final Letter",

    title: "One Last Thing... ♡",

    lines: [

      "I don't know what the future will bring, but I know what I wish for you.",

      "I hope you find happiness in the smallest things and courage when life gets difficult.",

      "InshaAllah one day we will be Happy together in our small world, and I will always be there to support you.",

      "And whenever you look back at this birthday, I hope you remember that someone wanted to make your day a little more beautiful.",

    ],

    ending: "You are deeply loved. Always remember that. ♡",

  },

];


/* Same wooden navigation used on Page6. */
const MENU_ITEMS = [
  { label: "Love Letter", icon: Heart, target: "Page5", active: true },
  { label: "Our Memories", icon: ImageIcon, target: "Page6" },
];

function Page5({ onNavigate }) {

  const [currentIndex, setCurrentIndex] = useState(0);

  const [direction, setDirection] = useState(1);

  const [isMusicOn, setIsMusicOn] = useState(false);

  const currentLetter = LETTERS[currentIndex];

  const isLastLetter = currentIndex === LETTERS.length - 1;

  const goBack = () => {

    onNavigate?.("Page4");

  };

  const goNext = () => {

    if (isLastLetter) {

      onNavigate?.("Page6");

      return;

    }

    setDirection(1);

    setCurrentIndex((prev) => prev + 1);

  };

  const goPrevious = () => {

    if (currentIndex === 0) return;

    setDirection(-1);

    setCurrentIndex((prev) => prev - 1);

  };

  const goToLetter = (index) => {

    if (index === currentIndex) return;

    setDirection(index > currentIndex ? 1 : -1);

    setCurrentIndex(index);

  };

  /*

   * Mobile swipe navigation

   */

  useEffect(() => {

    let startX = 0;

    let startY = 0;

    const handleTouchStart = (event) => {

      const touch = event.touches[0];

      startX = touch.clientX;

      startY = touch.clientY;

    };

    const handleTouchEnd = (event) => {

      const touch = event.changedTouches[0];

      const deltaX = touch.clientX - startX;

      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {

        return;

      }

      if (Math.abs(deltaX) < 55) {

        return;

      }

      if (deltaX < 0) {

        goNext();

      } else {

        goPrevious();

      }

    };

    window.addEventListener("touchstart", handleTouchStart, {

      passive: true,

    });

    window.addEventListener("touchend", handleTouchEnd, {

      passive: true,

    });

    return () => {

      window.removeEventListener("touchstart", handleTouchStart);

      window.removeEventListener("touchend", handleTouchEnd);

    };

  }, [currentIndex, isLastLetter]);

  return (

    <main className="page5">

      {/* Cinematic background */}

      <div className="page5-background" aria-hidden="true" />

      {/* Dark readability overlay */}

      <div className="page5-overlay" aria-hidden="true" />

      {/* =====================================================

          TOP BAR

          ===================================================== */}

      <header className="page5-topbar">

        <motion.button

          className="page5-back"

          onClick={goBack}

          whileTap={{ scale: 0.94 }}

        >

          <ArrowLeft size={16} />

          <span>Back to Gifts</span>

        </motion.button>

        <motion.button

          className={`page5-music ${

            isMusicOn ? "page5-music-active" : ""

          }`}

          onClick={() => setIsMusicOn((prev) => !prev)}

          whileTap={{ scale: 0.94 }}

        >

          <Music2 size={15} />

          <span>{isMusicOn ? "Music On" : "Music"}</span>

        </motion.button>

      </header>

      {/* Wooden side navigation — matches Page6 */}
      <nav className="page5-menu" aria-label="Birthday pages">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              type="button"
              key={item.label}
              className={`page5-menu-item ${item.active ? "page5-menu-active" : ""}`}
              onClick={() => !item.active && onNavigate?.(item.target)}
              whileTap={{ scale: 0.96 }}
              aria-current={item.active ? "page" : undefined}
              disabled={item.active}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Hanging wooden sign — same motif as Page6 */}
      <div className="page5-sign" aria-hidden="true">
        <p>
          Different<br />
          Moments<br />
          Same<br />
          Happiness<br />
          Always Us
        </p>
        <Heart size={11} fill="currentColor" />
      </div>

      {/* =====================================================

          MAIN CONTENT

          ===================================================== */}

      <section className="page5-content">

        {/* Heading */}

        <motion.div

          className="page5-heading"

          initial={{ opacity: 0, y: -18 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.8 }}

        >

          <div className="page5-heading-small">

            <Heart size={12} fill="currentColor" />

            <span>FROM MY HEART</span>

            <Heart size={12} fill="currentColor" />

          </div>

          <h1>

            Words From

            <br />

            <em>My Heart</em>

            <span className="page5-heading-heart">♡</span>

          </h1>

          <p>

            Some feelings are easier to write than say...

            <br />

            So here are a few little pieces, just for you.

          </p>

        </motion.div>

        {/* Letter count */}

        <motion.div

          className="page5-letter-count"

          key={`count-${currentLetter.id}`}

          initial={{ opacity: 0 }}

          animate={{ opacity: 1 }}

        >

          <span>{currentLetter.label}</span>

          <i />

          <span>

            {currentIndex + 1} of {LETTERS.length}

          </span>

        </motion.div>

        {/* =================================================

            LETTER

            ================================================= */}

        <div className="page5-letter-wrapper">

          <AnimatePresence mode="wait" custom={direction}>

            <motion.article

              key={currentLetter.id}

              className={`page5-paper ${

                currentLetter.type === "shayari"

                  ? "page5-paper-shayari"

                  : ""

              }`}

              custom={direction}

              initial={{

                opacity: 0,

                x: direction * 70,

                rotate: direction * 2,

              }}

              animate={{

                opacity: 1,

                x: 0,

                rotate: currentLetter.type === "shayari" ? -0.5 : 0.5,

              }}

              exit={{

                opacity: 0,

                x: direction * -70,

                rotate: direction * -2,

              }}

              transition={{

                duration: 0.45,

                ease: [0.22, 1, 0.36, 1],

              }}

            >

              {/* Papers behind the main sheet */}

              <div className="page5-paper-back page5-paper-back-one" />

              <div className="page5-paper-back page5-paper-back-two" />

              {/* Main paper */}

              <div className="page5-paper-inner">

                <div className="paper-flower paper-flower-top">

                  ✿

                </div>

                <div className="paper-flower paper-flower-bottom">

                  ❀

                </div>

                <div className="paper-small-heart paper-heart-one">

                  ♡

                </div>

                <div className="paper-small-heart paper-heart-two">

                  ♥

                </div>

                <div className="page5-paper-heading">

                  <span>

                    {currentLetter.type === "shayari"

                      ? "A little shayari..."

                      : "A little letter..."}

                  </span>

                  <div>

                    <Heart size={13} fill="currentColor" />

                  </div>

                </div>

                <h2>{currentLetter.title}</h2>

                <div className="paper-divider">

                  <span />

                  <Heart size={12} fill="currentColor" />

                  <span />

                </div>

                <div className="page5-handwriting">

                  {currentLetter.lines.map((line, index) => (

                    <motion.p

                      key={`${currentLetter.id}-${index}`}

                      initial={{

                        opacity: 0,

                        y: 5,

                      }}

                      animate={{

                        opacity: 1,

                        y: 0,

                      }}

                      transition={{

                        delay: 0.12 + index * 0.07,

                        duration: 0.35,

                      }}

                    >

                      {line}

                    </motion.p>

                  ))}

                </div>

                <div className="page5-paper-ending">

                  <span>{currentLetter.ending}</span>

                  <Heart size={17} fill="currentColor" />

                </div>

                <div className="page5-feather">

                  <Feather size={23} />

                </div>

              </div>

            </motion.article>

          </AnimatePresence>

        </div>

        {/* =================================================

            LETTER NAVIGATION

            ================================================= */}

        <div className="page5-navigation">

          <motion.button

            className={`page5-nav-arrow ${

              currentIndex === 0 ? "page5-nav-disabled" : ""

            }`}

            onClick={goPrevious}

            disabled={currentIndex === 0}

            whileTap={

              currentIndex !== 0

                ? { scale: 0.88 }

                : {}

            }

            aria-label="Previous letter"

          >

            <ArrowLeft size={18} />

          </motion.button>

          <div className="page5-dots">

            {LETTERS.map((letter, index) => (

              <button

                key={letter.id}

                className={`page5-dot ${

                  index === currentIndex

                    ? "page5-dot-active"

                    : ""

                }`}

                onClick={() => goToLetter(index)}

                aria-label={`Open ${letter.label} ${index + 1}`}

              >

                {index === currentIndex ? (

                  <Heart size={13} fill="currentColor" />

                ) : (

                  <span />

                )}

              </button>

            ))}

          </div>

          <motion.button

            className="page5-nav-arrow"

            onClick={goNext}

            whileTap={{ scale: 0.88 }}

            aria-label={

              isLastLetter

                ? "Continue to memories"

                : "Next letter"

            }

          >

            <ArrowRight size={18} />

          </motion.button>

        </div>

        {/* =================================================

            NEXT

            ================================================= */}

        <motion.button

          className={`page5-next-button ${

            isLastLetter ? "page5-next-final" : ""

          }`}

          onClick={goNext}

          whileTap={{ scale: 0.97 }}

        >

          {isLastLetter ? (

            <>

              <Sparkles size={16} />

              <span>Continue to Our Memories</span>

              <ArrowRight size={17} />

            </>

          ) : (

            <>

              <Feather size={16} />

              <span>Read Another Letter</span>

              <ArrowRight size={17} />

            </>

          )}

        </motion.button>

      </section>

      <div className="page5-bottom-heart">

        <Heart size={12} fill="currentColor" />

      </div>

    </main>

  );

}

export default Page5;
