import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Camera,
  Sparkles,
  Image as ImageIcon,
  Star,
  MessageCircle,
  Home,
  X,
  Maximize2,
  Volume2,
  VolumeX,
} from "lucide-react";

import "./Page6.css";
import "./Page6.album.css"; // NEW: page-turn + realistic album layer (keep AFTER Page6.css)
import "./Page6.realistic.css";

/* =========================================================
   MEMORY DATA
========================================================= */

const memorySlides = [
  {
    id: 1,
    label: "First Day",
    theme: "The Beginning",
    pages: [
      {
        image: "src/assets/memories/memory-01.jpg",
        caption: "That day... everything felt so right.",
      },
      {
        image: "src/assets/memories/memory-02.jpg",
        caption: "With you... even the stars feel closer.",
      },
    ],
  },
  {
    id: 2,
    label: "Adventures",
    theme: "Our Adventures",
    pages: [
      {
        image: "src/assets/memories/memory-03.jpg",
        caption: "Every little adventure became special...",
      },
      {
        image: "src/assets/memories/memory-04.jpg",
        caption: "Because I was experiencing it with you.",
      },
    ],
  },
  {
    id: 3,
    label: "Little Things",
    theme: "Little Things",
    pages: [
      {
        image: "src/assets/memories/memory-05.jpg",
        caption: "It was never about the big moments...",
      },
      {
        image: "src/assets/memories/memory-06.jpg",
        caption: "It was these tiny moments I remember most.",
      },
    ],
  },
  {
    id: 4,
    label: "Forever",
    theme: "Forever",
    pages: [
      {
        image: "src/assets/memories/memory-07.jpg",
        caption: "Some memories become part of who we are.",
      },
      {
        image: "src/assets/memories/memory-08.jpg",
        caption: "I hope we keep creating many more.",
      },
    ],
  },
];

const FLIP_SECONDS = 1.1;

/* =========================================================
   SIDE MENU
========================================================= */

const MENU_ITEMS = [
  {
    label: "Love Letter",
    icon: Heart,
    target: "Page5",
  },
  {
    label: "Our Memories",
    icon: ImageIcon,
    active: true,
  },
  {
    label: "Our Universe",
    icon: Star,
    target: "Page7",
  },
  {
    label: "Send Message",
    icon: MessageCircle,
    target: "Page8",
  },
  {
    label: "Home",
    icon: Home,
    target: "Page1",
  },
];

/* =========================================================
   BUTTERFLY
========================================================= */

function Butterfly({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 40"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="butterflyGradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#ffe3ef" />
          <stop offset="45%" stopColor="#ff9ec7" />
          <stop offset="100%" stopColor="#d93678" />
        </linearGradient>
      </defs>

      <g className="butterfly-wings">
        <path
          d="M24 20C18 4 4 2 3 12c-1 9 9 12 21 8z"
          fill="url(#butterflyGradient)"
          stroke="#c43c7c"
          strokeWidth="0.8"
        />

        <path
          d="M24 20C30 4 44 2 45 12c1 9-9 12-21 8z"
          fill="url(#butterflyGradient)"
          stroke="#c43c7c"
          strokeWidth="0.8"
        />

        <path
          d="M24 21C16 24 8 30 12 36c4 4 10-2 12-15z"
          fill="#f48bb8"
          stroke="#c43c7c"
          strokeWidth="0.8"
        />

        <path
          d="M24 21C32 24 40 30 36 36c-4 4-10-2-12-15z"
          fill="#f48bb8"
          stroke="#c43c7c"
          strokeWidth="0.8"
        />
      </g>

      <path
        d="M24 12v20"
        stroke="#6b2a45"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   PHOTO FRAME
========================================================= */

function PhotoFrame({ page, onOpen, interactive }) {
  const [imageError, setImageError] = useState(false);

  return (
    <figure className="memory-photo-area">
      <button
        type="button"
        className="memory-photo-button"
        onClick={() => onOpen?.(page)}
        disabled={!interactive}
        aria-label="Open memory photo"
      >
        <div className="memory-photo-wrap">
          {!imageError ? (
            <img
              src={page.image}
              alt={page.caption}
              className="memory-photo"
              draggable="false"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="memory-photo-placeholder">
              <Camera size={26} />
              <span>Your memory</span>
            </div>
          )}

          <div className="photo-shine" />

          <div className="photo-open-hint">
            <Maximize2 size={12} />
          </div>
        </div>
      </button>

      <figcaption className="memory-caption">
        {page.caption}
        <span className="memory-caption-heart">♡</span>
      </figcaption>

      <div className="photo-tape photo-tape-left" />
      <div className="photo-tape photo-tape-right" />
    </figure>
  );
}

/* =========================================================
   MEMORY PAGE  (one page = one photo)
========================================================= */

function MemoryPage({
  page,
  side,
  pageNumber,
  onOpen,
  interactive = true,
}) {
  return (
    <div className={`memory-page memory-page-${side}`}>
      <span className="page-grain" aria-hidden="true" />

      <div className="memory-page-inner">
        <div className="memory-page-flower">
          {side === "left" ? "✿" : "❀"}
        </div>

        <div className="memory-page-heart">
          {side === "left" ? "♡" : "♥"}
        </div>

        <PhotoFrame
          page={page}
          onOpen={onOpen}
          interactive={interactive}
        />

        <Butterfly
          className={`memory-butterfly memory-butterfly-${side}`}
        />

        <div className="memory-page-line">
          <span />
          <Heart size={9} fill="currentColor" />
          <span />
        </div>

        <span className="page-number">{pageNumber}</span>
      </div>

      <span className="page-curl" aria-hidden="true" />
    </div>
  );
}

/* =========================================================
   THUMBNAIL
========================================================= */

function Thumb({
  slide,
  index,
  active,
  onClick,
}) {
  const [error, setError] = useState(false);

  return (
    <button
      type="button"
      className={`memory-thumb ${
        active ? "memory-thumb-active" : ""
      }`}
      onClick={onClick}
      aria-label={`Open memory ${index + 1}: ${slide.label}`}
      aria-current={active ? "true" : undefined}
    >
      <span className="memory-thumb-img">
        {!error ? (
          <img
            src={slide.pages[0].image}
            alt=""
            onError={() => setError(true)}
          />
        ) : (
          <Camera size={16} />
        )}
      </span>

      <span className="memory-thumb-number">
        0{index + 1}
      </span>

      <span className="memory-thumb-label">
        {slide.label}
      </span>
    </button>
  );
}

/* =========================================================
   LIGHTBOX
========================================================= */

function MemoryLightbox({
  page,
  onClose,
  onPrevious,
  onNext,
}) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious?.();
      if (event.key === "ArrowRight") onNext?.();
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrevious, onNext]);

  if (!page) return null;

  return (
    <motion.div
      className="memory-lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lightbox-glow"
        aria-hidden="true"
      />

      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close photo"
      >
        <X size={21} />
      </button>

      <button
        type="button"
        className="lightbox-arrow lightbox-arrow-left"
        onClick={(event) => {
          event.stopPropagation();
          onPrevious?.();
        }}
        aria-label="Previous photo"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div
        key={page.image}
        className="lightbox-photo-card"
        initial={{
          scale: 0.82,
          rotate: -3,
          y: 30,
        }}
        animate={{
          scale: 1,
          rotate: 0,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="lightbox-tape" />

        <div className="lightbox-image-wrap">
          <img
            src={page.image}
            alt={page.caption}
            className="lightbox-image"
          />

          <div className="lightbox-image-shine" />
        </div>

        <div className="lightbox-caption">
          <span>{page.caption}</span>
          <Heart size={14} fill="currentColor" />
        </div>
      </motion.div>

      <button
        type="button"
        className="lightbox-arrow lightbox-arrow-right"
        onClick={(event) => {
          event.stopPropagation();
          onNext?.();
        }}
        aria-label="Next photo"
      >
        <ArrowRight size={20} />
      </button>

      <div className="lightbox-hint">
        <Sparkles size={12} />
        <span>Every picture holds a little piece of us</span>
        <Sparkles size={12} />
      </div>
    </motion.div>
  );
}

/* =========================================================
   PAGE 6
========================================================= */

function Page6({ onNavigate }) {
  const reduceMotion = useReducedMotion();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [flip, setFlip] = useState(null); // { dir, from, to }
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [openedPhoto, setOpenedPhoto] = useState(null);

  const audioRef = useRef(null);

  const slide = memorySlides[currentSlide];

  const isFirst = currentSlide === 0;
  const isLast =
    currentSlide === memorySlides.length - 1;

  // slide shown in heading / theme / thumbnails (the one we are turning TO)
  const shownIndex = flip ? flip.to : currentSlide;
  const shownSlide = memorySlides[shownIndex];

  /* -------------------------------------------------------
     MUSIC
  ------------------------------------------------------- */

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsMusicOn(true);
      } else {
        audio.pause();
        setIsMusicOn(false);
      }
    } catch {
      setIsMusicOn(false);
    }
  };

  /* -------------------------------------------------------
     NAVIGATION  (page turn)
  ------------------------------------------------------- */

  const startFlip = (target) => {
    if (flip) return;
    if (target === currentSlide) return;
    if (target < 0 || target >= memorySlides.length) return;

    setFlip({
      dir: target > currentSlide ? "next" : "prev",
      from: currentSlide,
      to: target,
    });
  };

  const finishFlip = () => {
    if (!flip) return;

    setCurrentSlide(flip.to);
    setFlip(null);
  };

  const goNext = () => {
    if (flip) return;

    if (isLast) {
      onNavigate?.("Page7");
      return;
    }

    startFlip(currentSlide + 1);
  };

  const goPrevious = () => {
    if (flip) return;

    if (isFirst) {
      onNavigate?.("Page4");
      return;
    }

    startFlip(currentSlide - 1);
  };

  const goToSlide = (index) => {
    startFlip(index);
  };

  /* -------------------------------------------------------
     LIGHTBOX NAVIGATION
     (changes slide instantly - the lightbox covers the book)
  ------------------------------------------------------- */

  const currentPhotoIndex = openedPhoto
    ? slide.pages.findIndex(
        (page) => page.image === openedPhoto.image
      )
    : -1;

  const openPhoto = (page) => {
    if (flip) return;
    setOpenedPhoto(page);
  };

  const closePhoto = () => {
    setOpenedPhoto(null);
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < 0) return;

    if (currentPhotoIndex < slide.pages.length - 1) {
      setOpenedPhoto(
        slide.pages[currentPhotoIndex + 1]
      );
      return;
    }

    if (!isLast) {
      const nextSlideIndex = currentSlide + 1;

      setCurrentSlide(nextSlideIndex);
      setOpenedPhoto(
        memorySlides[nextSlideIndex].pages[0]
      );
    }
  };

  const previousPhoto = () => {
    if (currentPhotoIndex < 0) return;

    if (currentPhotoIndex > 0) {
      setOpenedPhoto(
        slide.pages[currentPhotoIndex - 1]
      );
      return;
    }

    if (!isFirst) {
      const previousSlideIndex = currentSlide - 1;
      const pages =
        memorySlides[previousSlideIndex].pages;

      setCurrentSlide(previousSlideIndex);
      setOpenedPhoto(pages[pages.length - 1]);
    }
  };

  /* -------------------------------------------------------
     SWIPE + KEYBOARD
  ------------------------------------------------------- */

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let ignore = false;

    const handleTouchStart = (event) => {
      const touch = event.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;

      ignore = !!event.target.closest?.(
        ".memory-strip, .memory-lightbox"
      );
    };

    const handleTouchEnd = (event) => {
      if (ignore || openedPhoto) return;

      const touch = event.changedTouches[0];

      const deltaX =
        touch.clientX - startX;

      const deltaY =
        touch.clientY - startY;

      if (
        Math.abs(deltaY) >
        Math.abs(deltaX)
      ) {
        return;
      }

      if (Math.abs(deltaX) < 55) return;

      if (deltaX < 0) {
        goNext();
      } else {
        goPrevious();
      }
    };

    const handleKey = (event) => {
      if (openedPhoto) return;

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
      }
    };

    window.addEventListener(
      "touchstart",
      handleTouchStart,
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      handleTouchEnd,
      { passive: true }
    );

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      window.removeEventListener(
        "touchstart",
        handleTouchStart
      );

      window.removeEventListener(
        "touchend",
        handleTouchEnd
      );

      window.removeEventListener(
        "keydown",
        handleKey
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentSlide,
    openedPhoto,
    flip,
  ]);

  /* -------------------------------------------------------
     WHICH PAGES ARE LYING FLAT RIGHT NOW
  ------------------------------------------------------- */

  let leftSlideIndex = currentSlide;
  let rightSlideIndex = currentSlide;

  if (flip) {
    if (flip.dir === "next") {
      leftSlideIndex = flip.from;
      rightSlideIndex = flip.to;
    } else {
      leftSlideIndex = flip.to;
      rightSlideIndex = flip.from;
    }
  }

  const renderPage = (
    slideIndex,
    side,
    interactive = false
  ) => {
    const pageIndex = side === "left" ? 0 : 1;

    return (
      <MemoryPage
        page={memorySlides[slideIndex].pages[pageIndex]}
        side={side}
        pageNumber={slideIndex * 2 + pageIndex + 1}
        onOpen={openPhoto}
        interactive={interactive}
      />
    );
  };

  return (
    <main className="page6">
      {/* ---------------------------------------------------
          AUDIO
      --------------------------------------------------- */}

      <audio
        ref={audioRef}
        src="/music/memories.mp3"
        loop
        preload="none"
      />

      {/* ---------------------------------------------------
          CINEMATIC BACKGROUND
      --------------------------------------------------- */}

      <div
        className="page6-background"
        aria-hidden="true"
      />

      <div
        className="page6-overlay"
        aria-hidden="true"
      />

      <div
        className="page6-fireflies"
        aria-hidden="true"
      >
        {Array.from({ length: 18 }).map(
          (_, index) => (
            <span
              key={index}
              className="firefly"
              style={{
                "--i": index,
              }}
            />
          )
        )}
      </div>

      {/* ---------------------------------------------------
          TOP CONTROLS
      --------------------------------------------------- */}

      <motion.button
        type="button"
        className="page6-back"
        onClick={() =>
          onNavigate?.("Page4")
        }
        whileTap={{ scale: 0.92 }}
      >
        <ArrowLeft size={16} />
        <span>Back to Gifts</span>
      </motion.button>

      <motion.button
        type="button"
        className={`page6-music ${
          isMusicOn
            ? "page6-music-active"
            : ""
        }`}
        onClick={toggleMusic}
        whileTap={{ scale: 0.92 }}
      >
        {isMusicOn ? (
          <Volume2 size={15} />
        ) : (
          <VolumeX size={15} />
        )}

        <span>
          {isMusicOn
            ? "Music On"
            : "Music"}
        </span>

        {isMusicOn && (
          <span className="music-bars">
            <i />
            <i />
            <i />
          </span>
        )}
      </motion.button>

      {/* ---------------------------------------------------
          WOODEN MENU
      --------------------------------------------------- */}

      <nav
        className="page6-menu"
        aria-label="Memory pages"
      >
        {MENU_ITEMS.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.button
              type="button"
              key={item.label}
              className={`page6-menu-item ${
                item.active
                  ? "page6-menu-active"
                  : ""
              }`}
              onClick={() =>
                !item.active &&
                onNavigate?.(item.target)
              }
              initial={{
                opacity: 0,
                x: -35,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay:
                  0.15 + index * 0.07,
              }}
              whileTap={
                !item.active
                  ? { scale: 0.96 }
                  : undefined
              }
              aria-current={
                item.active
                  ? "page"
                  : undefined
              }
            >
              <Icon size={15} />

              <span>{item.label}</span>

              {item.active && (
                <span className="menu-active-dot" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* ---------------------------------------------------
          HANGING SIGN
      --------------------------------------------------- */}

      <div
        className="page6-sign"
        aria-hidden="true"
      >
        <div className="sign-nail" />

        <p>
          Different
          <br />
          Moments
          <br />
          Same
          <br />
          Happiness
          <br />
          Always Us
        </p>

        <Heart
          size={11}
          fill="currentColor"
        />
      </div>

      {/* ---------------------------------------------------
          MAIN CONTENT
      --------------------------------------------------- */}

      <section className="page6-content">

        {/* HEADER */}

        <motion.header
          className="page6-header"
          initial={{
            opacity: 0,
            y: -22,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="page6-eyebrow">
            <span />
            MEMORY ALBUM
            <span />
          </div>

          <h1>
            Our Memories
            <span>♡</span>
          </h1>

          <p>
            little pieces of us...
          </p>

          <div className="page6-mini-line">
            <span />
            <Heart
              size={12}
              fill="currentColor"
            />
            <span />
          </div>
        </motion.header>

        {/* MEMORY LABEL */}

        <AnimatePresence mode="wait">
          <motion.div
            key={shownSlide.id}
            className="memory-heading"
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
          >
            <span>
              MEMORY 0{shownSlide.id}
            </span>

            <strong>
              {shownSlide.label}
            </strong>
          </motion.div>
        </AnimatePresence>

        {/* BOOK */}

        <div className="memory-book-area">
          <motion.div
            className="memory-book"
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="book-shadow" />

            <div className="book-aura" />

            {/* real-album details: stitched leather, brass corners, ribbon */}
            <span className="book-stitch" aria-hidden="true" />
            <span className="book-corner book-corner-tl" aria-hidden="true" />
            <span className="book-corner book-corner-tr" aria-hidden="true" />
            <span className="book-corner book-corner-bl" aria-hidden="true" />
            <span className="book-corner book-corner-br" aria-hidden="true" />
            <span className="book-ribbon" aria-hidden="true" />

            {/* pages lying flat */}
            <div className="album-slot">
              {renderPage(leftSlideIndex, "left", !flip)}
            </div>

            <div className="album-slot">
              {renderPage(rightSlideIndex, "right", !flip)}
            </div>

            {/* the page that is turning */}
            {flip && (
              <>
                <span
                  className={`flip-cast flip-cast-${flip.dir}`}
                  aria-hidden="true"
                />

                <motion.div
                  key={`${flip.from}-${flip.to}`}
                  className={`page-leaf page-leaf-${flip.dir}`}
                  initial={{ rotateY: 0 }}
                  animate={{
                    rotateY:
                      flip.dir === "next" ? -180 : 180,
                  }}
                  transition={{
                    duration: reduceMotion
                      ? 0.01
                      : FLIP_SECONDS,
                    ease: [0.6, 0.05, 0.25, 1],
                  }}
                  onAnimationComplete={finishFlip}
                >
                  <div className="leaf-face leaf-front">
                    {flip.dir === "next"
                      ? renderPage(flip.from, "right")
                      : renderPage(flip.from, "left")}
                    <span className="leaf-shade" />
                  </div>

                  <div className="leaf-face leaf-back">
                    {flip.dir === "next"
                      ? renderPage(flip.to, "left")
                      : renderPage(flip.to, "right")}
                    <span className="leaf-shade" />
                  </div>
                </motion.div>
              </>
            )}

            <div
              className="book-binding"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div
              className="book-corner-decoration"
              aria-hidden="true"
            >
              ♡
            </div>
          </motion.div>

          {/* BOOK ARROWS */}

          <motion.button
            type="button"
            className="memory-arrow memory-arrow-left"
            onClick={goPrevious}
            whileTap={{ scale: 0.86 }}
            aria-label="Previous memories"
          >
            <ArrowLeft size={18} />
          </motion.button>

          <motion.button
            type="button"
            className="memory-arrow memory-arrow-right"
            onClick={goNext}
            whileTap={{ scale: 0.86 }}
            aria-label="Next memories"
          >
            <ArrowRight size={18} />
          </motion.button>
        </div>

        {/* THEME */}

        <motion.div
          className="memory-theme"
          key={shownSlide.theme}
          initial={{
            opacity: 0,
            y: 7,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <Sparkles size={11} />

          <span>{shownSlide.theme}</span>

          <Sparkles size={11} />
        </motion.div>

        {/* THUMBNAILS */}

        <div
          className="memory-strip"
          role="tablist"
          aria-label="Memories"
        >
          {memorySlides.map(
            (item, index) => (
              <Thumb
                key={item.id}
                slide={item}
                index={index}
                active={
                  index === shownIndex
                }
                onClick={() =>
                  goToSlide(index)
                }
              />
            )
          )}
        </div>

        {/* NAVIGATION */}

        <div className="memory-navigation">

          <motion.button
            type="button"
            className="memory-nav-arrow"
            onClick={goPrevious}
            whileTap={{ scale: 0.86 }}
            aria-label="Previous memory"
          >
            <ArrowLeft size={17} />
          </motion.button>

          <div className="memory-counter">
            <span>
              {String(
                shownIndex + 1
              ).padStart(2, "0")}
            </span>

            <i>/</i>

            <span>
              {String(
                memorySlides.length
              ).padStart(2, "0")}
            </span>
          </div>

          <motion.button
            type="button"
            className="memory-nav-arrow"
            onClick={goNext}
            whileTap={{ scale: 0.86 }}
            aria-label="Next memory"
          >
            <ArrowRight size={17} />
          </motion.button>

        </div>

        {/* CONTINUE */}

        <motion.button
          type="button"
          className="memory-next-button"
          onClick={() =>
            onNavigate?.("Page7")
          }
          whileTap={{
            scale: 0.97,
          }}
        >
          <Heart
            size={16}
            fill="currentColor"
          />

          <span>
            There are still more memories...
          </span>

          <ArrowRight size={16} />
        </motion.button>

        <div className="page6-footer-whisper">
          <span>made with</span>
          <Heart
            size={9}
            fill="currentColor"
          />
          <span>for you</span>
        </div>
      </section>

      {/* ---------------------------------------------------
          LIGHTBOX
      --------------------------------------------------- */}

      <AnimatePresence>
        {openedPhoto && (
          <MemoryLightbox
            page={openedPhoto}
            onClose={closePhoto}
            onPrevious={previousPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default Page6;