import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Heart,
  Image as ImageIcon, Mail, Star, X, Sparkles, Music2,
} from "lucide-react";
import "./Page7.css";

/* ---------- Heart geometry (true heart curve, drawn in a 100 x 90 box) ---------- */
const TAU = Math.PI * 2;

const heartPoint = (t) => {
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [50 + x * 2.4, 10 + (12 - y) * 2.4];
};

const heartPath = (from, to, steps = 28) => {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const [x, y] = heartPoint(from + ((to - from) * i) / steps);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d;
};

// Position of each star along the heart (clockwise, starting at the left lobe)
const STAR_META = [
  { t: TAU - 0.8, side: "top" },
  { t: TAU, side: "top" },
  { t: TAU + 0.8, side: "top" },
  { t: TAU + 1.6, side: "bottom", shift: 8 },
  { t: TAU + 2.4, side: "bottom", shift: 10 },
  { t: TAU + Math.PI, side: "bottom" },
  { t: TAU + TAU - 2.4, side: "bottom", shift: -10 },
  { t: TAU + TAU - 1.6, side: "bottom", shift: -8 },
];

const STAR_CONTENT = [
  { id: 1, title: "Your Smile", message: "Your smile has a way of making ordinary moments feel special. If I could keep one little light with me everywhere, it would be the happiness in your smile." },
  { id: 2, title: "Our Beginning", message: "Every beautiful story has a beginning. Ours became one of my favourite parts of life, and I hope we keep writing it with patience, laughter, honesty, and love." },
  { id: 3, title: "Little Things", message: "It's the little things that stay with me: the unexpected laughs, the quiet moments, and the details that might seem ordinary to the world but mean so much to me." },
  { id: 4, title: "My Favourite Person", message: "Out of all the people I could meet in this enormous world, you became someone wonderfully special to me. You are my favourite kind of unexpected." },
  { id: 5, title: "My Promise", message: "I can't promise that every day will be perfect. I can promise to keep learning, to communicate honestly, to respect your heart, and to make room for the little things that matter." },
  { id: 6, title: "Our Memories", message: "Some moments become memories before we even realise how precious they are. I want us to collect many more: silly ones, peaceful ones, and stories we'll smile about later." },
  { id: 7, title: "My Comfort", message: "With you, even a quiet moment can feel meaningful. I hope I can be a place of comfort for you too—a person who listens, understands, and chooses you with care." },
  { id: 8, title: "My Wish", message: "On your birthday, I wish you a life filled with peace, courage, laughter, and the kind of happiness that stays even after the candles go out. You deserve beautiful things, my Miss Universe." },
];

const HEART_STARS = STAR_CONTENT.map((star, i) => {
  const [x, y] = heartPoint(STAR_META[i].t);
  return { ...star, ...STAR_META[i], left: `${x}%`, top: `${(y / 90) * 100}%` };
});

const HEART_FULL_PATH = heartPath(0, TAU, 140) + "Z";

const HEART_EDGES = HEART_STARS.map((star, i) => {
  const isLast = i === HEART_STARS.length - 1;
  const next = HEART_STARS[(i + 1) % HEART_STARS.length];
  const to = isLast ? HEART_STARS[0].t + TAU : next.t;
  return { key: `${star.id}-${next.id}`, a: star.id, b: next.id, d: heartPath(star.t, to) };
});

const MENU = [
  { label: "Love Letter", icon: Heart, target: "Page5" },
  { label: "Our Memories", icon: ImageIcon, target: "Page6" },
  { label: "Our Universe", icon: Star, target: "Page7", active: true },
  { label: "Send Message", icon: Mail, target: "Page8" },
];

/* ---------- Intro animation data ---------- */
const INTRO_WORDS = [
  { lines: ["Love"] },
  { lines: ["You"] },
  { lines: ["My"] },
  { lines: ["Miss", "Universe"], big: true, heart: true },
];

const SPARKLE_COLORS = ["#ffffff", "#ffc2e5", "#d9c8ff", "#ffd9b8"];
const SPARKLE_PATH = "M12 0C12.9 7.3 16.7 11.1 24 12C16.7 12.9 12.9 16.7 12 24C11.1 16.7 7.3 12.9 0 12C7.3 11.1 11.1 7.3 12 0Z";

// Sparkles that ring each word
const INTRO_SPARKLES = INTRO_WORDS.map((word, s) =>
  Array.from({ length: word.big ? 18 : 11 }, (_, i) => {
    const angle = (((i * 137.5 + s * 53) % 360) * Math.PI) / 180;
    const rx = 52 + ((i * 23 + s * 11) % 38);
    const ry = 75 + ((i * 31 + s * 7) % 65);
    return {
      id: i,
      x: 50 + Math.cos(angle) * rx,
      y: 50 + Math.sin(angle) * ry,
      size: 9 + ((i * 5) % 15),
      delay: 0.25 + i * 0.07,
      twinkle: 1.1 + (i % 4) * 0.3,
      color: SPARKLE_COLORS[i % 4],
    };
  })
);

// Full-screen blinking stars, revealed in 4 waves (one per word)
const INTRO_STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  left: `${(i * 43.71 + 3.7) % 100}%`,
  top: `${(i * 67.13 + 4.9) % 100}%`,
  size: 1 + ((i * 17) % 3) + (i % 11 === 0 ? 1.5 : 0),
  delay: `${((i * 13) % 60) / 10}s`,
  duration: `${1.6 + ((i * 23) % 30) / 10}s`,
  wave: 1 + (i % 4),
  tint: i % 5 === 0 ? "pink" : i % 7 === 0 ? "lav" : "white",
}));

// Bigger 4-point sparkle stars
const INTRO_SPARKLE_STARS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${((i * 37.3 + 8) % 92) + 3}%`,
  top: `${((i * 53.9 + 6) % 88) + 4}%`,
  size: 12 + ((i * 7) % 16),
  wave: 1 + (i % 4),
  delay: `${(i * 0.37) % 3}s`,
  color: SPARKLE_COLORS[i % 4],
}));

const INTRO_SHOOTING = [
  { left: "82%", top: "10%", delay: "0.4s" },
  { left: "96%", top: "30%", delay: "2.6s" },
  { left: "70%", top: "6%", delay: "4.4s" },
];

function Sparkle4({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d={SPARKLE_PATH} />
    </svg>
  );
}

function IntroLine({ text, delay = 0, className = "", children }) {
  return (
    <span className={`intro-line ${className}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="intro-letter"
          initial={{ opacity: 0, y: 26, scale: 0.8, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
      {children}
    </span>
  );
}

function IntroWord({ index }) {
  const word = INTRO_WORDS[index];
  const sparkles = INTRO_SPARKLES[index];
  return (
    <>
      <div className="universe-intro-flash" />
      <div className={`intro-bloom ${word.big ? "intro-bloom--xl" : ""}`} />
      <span className="intro-ring" />
      <span className="intro-ring intro-ring--2" />
      {word.big && <span className="intro-ring intro-ring--3" />}

      <div className={`intro-word ${word.big ? "intro-word--xl" : "intro-word--md"}`} role="img" aria-label={word.lines.join(" ")}>
        {word.lines.map((line, li) => (
          <IntroLine
            key={line}
            text={line}
            delay={li * 0.55}
            className={word.big ? (li === 0 ? "intro-line--sub" : "intro-line--main") : ""}
          >
            {word.heart && li === word.lines.length - 1 && (
              <motion.span
                className="intro-heart"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: [0, 1.6, 1] }}
                transition={{ delay: 1.55, duration: 0.7 }}
              >
                <i>♥</i>
              </motion.span>
            )}
          </IntroLine>
        ))}

        {sparkles.map((sp) => (
          <motion.span
            key={sp.id}
            className="intro-sparkle"
            style={{
              left: `${sp.x}%`, top: `${sp.y}%`,
              width: sp.size, height: sp.size,
              marginLeft: -sp.size / 2, marginTop: -sp.size / 2,
              color: sp.color,
            }}
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: sp.delay, duration: 0.6, ease: "backOut" }}
          >
            <Sparkle4
              className="intro-sparkle__svg"
              style={{ animationDuration: `${sp.twinkle}s`, animationDelay: `${sp.delay}s` }}
            />
          </motion.span>
        ))}

        {word.big && (
          <motion.span
            className="intro-flourish"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.9, ease: "easeOut" }}
          />
        )}
      </div>
    </>
  );
}

/* ---------- Page scenery data ---------- */
function createStars(count, seedOffset = 0) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 43.71 + 3.7 + seedOffset) % 100}%`,
    top: `${(i * 67.13 + 4.9 + seedOffset * 2) % 100}%`,
    size: 1 + ((i * 17) % 3),
    delay: `${((i * 13) % 60) / 10}s`,
    duration: `${2 + ((i * 23) % 45) / 10}s`,
  }));
}

const SHOOTING = [
  { left: "78%", top: "8%", delay: "2s" },
  { left: "95%", top: "22%", delay: "9s" },
  { left: "60%", top: "4%", delay: "15s" },
];

const FLOATERS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 37) % 86)}%`,
  size: `${10 + ((i * 7) % 10)}px`,
  delay: `${(i * 2.3) % 14}s`,
  duration: `${14 + ((i * 5) % 9)}s`,
  drift: `${((i % 2 ? 1 : -1) * (14 + i * 4))}px`,
}));

const BURST = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * TAU;
  const r = 78 + (i % 3) * 20;
  return { id: i, x: Math.cos(angle) * r, y: Math.sin(angle) * r, glyph: i % 3 === 0 ? "♥" : "✦" };
});

/* ---------------------------------- Page ---------------------------------- */
export default function Page7({ onNavigate = () => {} }) {
  const reduceMotion = useReducedMotion();
  const backgroundStars = useMemo(() => createStars(130), []);
  const [introStep, setIntroStep] = useState(0);
  const [skyFilled, setSkyFilled] = useState(false);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [discovered, setDiscovered] = useState([]);
  const [selectedStar, setSelectedStar] = useState(null);
  const [finaleOpen, setFinaleOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  const total = HEART_STARS.length;
  const allDiscovered = discovered.length === total;

  /* Intro sequence */
  useEffect(() => {
    if (reduceMotion) {
      setIntroStep(5);
      setSkyFilled(true);
      setBackgroundReady(true);
      return undefined;
    }
    // load the script font early so words don't swap fonts mid-animation
    if (document.fonts) document.fonts.load('80px "Great Vibes"');
    const timers = [
      window.setTimeout(() => setIntroStep(1), 700),
      window.setTimeout(() => setIntroStep(2), 2150),
      window.setTimeout(() => setIntroStep(3), 3600),
      window.setTimeout(() => setIntroStep(4), 5050),
      window.setTimeout(() => setIntroStep(5), 8300), // warp exit
      window.setTimeout(() => setSkyFilled(true), 8500),
      window.setTimeout(() => setBackgroundReady(true), 10000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  /* Music (put your file at public/music/universe.mp3, or change the path) */
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/music/universe.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
    const audio = audioRef.current;
    if (musicOn) audio.play().catch(() => setMusicOn(false));
    else audio.pause();
  }, [musicOn]);
  useEffect(() => () => audioRef.current && audioRef.current.pause(), []);

  /* Escape closes dialogs */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelectedStar(null);
        setFinaleOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const discover = (star) => {
    setDiscovered((cur) => (cur.includes(star.id) ? cur : [...cur, star.id]));
    setSelectedStar(star);
  };

  const stepStar = (dir) => {
    const idx = HEART_STARS.findIndex((s) => s.id === selectedStar.id);
    discover(HEART_STARS[(idx + dir + total) % total]);
  };

  const handleCta = () => {
    if (allDiscovered) {
      setFinaleOpen(true);
      return;
    }
    const next = HEART_STARS.find((s) => !discovered.includes(s.id));
    if (next) discover(next);
  };

  const dur = (n) => (reduceMotion ? 0 : n);

  return (
    <main className={`universe-page ${backgroundReady ? "background-ready" : ""}`}>
      {!backgroundReady && <div className="universe-pure-black" aria-hidden="true" />}

      {/* ===== Intro: blinking stars + words ===== */}
      <div className={`universe-prelude-stars ${skyFilled ? "is-filled" : ""}`} aria-hidden="true">
        {INTRO_STARS.map((s) => (
          <span
            key={s.id}
            className={`universe-prelude-star tint-${s.tint} ${introStep >= s.wave ? "is-lit" : ""}`}
            style={{ "--left": s.left, "--top": s.top, "--size": `${s.size}px`, "--delay": s.delay, "--duration": s.duration }}
          />
        ))}
        {INTRO_SPARKLE_STARS.map((s) => (
          <Sparkle4
            key={s.id}
            className={`universe-prelude-sparkle ${introStep >= s.wave ? "is-lit" : ""}`}
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, color: s.color, animationDelay: s.delay }}
          />
        ))}
      </div>

      {introStep >= 2 && !backgroundReady && INTRO_SHOOTING.map((s, i) => (
        <span key={i} className="universe-intro-shoot" style={{ "--left": s.left, "--top": s.top, "--delay": s.delay }} aria-hidden="true" />
      ))}

      {introStep === 5 && !backgroundReady && <div className="universe-intro-flash is-big" aria-hidden="true" />}

      <AnimatePresence mode="wait">
        {introStep >= 1 && introStep <= 4 && (
          <motion.div
            className="universe-word-reveal"
            key={introStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={
              introStep === 4
                ? { opacity: 0, scale: 1.55, filter: "blur(14px)", transition: { duration: 0.9, ease: "easeIn" } }
                : { opacity: 0, scale: 1.08, filter: "blur(8px)", transition: { duration: 0.45 } }
            }
            transition={{ duration: 0.35 }}
          >
            <IntroWord index={introStep - 1} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenery */}
      <div className="universe-background" aria-hidden="true" />
      <div className="universe-aurora" aria-hidden="true" />
      <div className={`universe-background-starfield ${backgroundReady ? "is-on" : ""}`} aria-hidden="true">
        {backgroundStars.map((s) => (
          <span key={s.id} className="universe-background-star"
            style={{ "--left": s.left, "--top": s.top, "--size": `${s.size}px`, "--delay": s.delay, "--duration": s.duration }} />
        ))}
        {SHOOTING.map((s, i) => (
          <span key={i} className="universe-shooting" style={{ "--left": s.left, "--top": s.top, "--delay": s.delay }} />
        ))}
      </div>
      {backgroundReady && (
        <div className="universe-floaters" aria-hidden="true">
          {FLOATERS.map((f) => (
            <span key={f.id} className="universe-floater"
              style={{ "--left": f.left, "--size": f.size, "--delay": f.delay, "--duration": f.duration, "--drift": f.drift }}>♥</span>
          ))}
        </div>
      )}

      {/* Main UI */}
      <AnimatePresence>
        {backgroundReady && (
          <motion.div className="universe-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: dur(1.5) }}>
            <div className="universe-topbar">
              <button type="button" className="universe-pill" onClick={() => onNavigate("Page4")}>
                <ArrowLeft size={16} /> Back to Gifts
              </button>
              <button type="button" className={`universe-pill ${musicOn ? "is-on" : ""}`} onClick={() => setMusicOn((v) => !v)} aria-pressed={musicOn}>
                <Music2 size={16} /> Music {musicOn ? "On" : "Off"}
              </button>
            </div>

            <nav className="universe-dock" aria-label="Page navigation">
              {MENU.map(({ label, icon: Icon, target, active }) => (
                <button key={label} type="button" aria-label={label} title={label}
                  className={`universe-dock__item ${active ? "is-active" : ""}`}
                  onClick={() => target !== "Page7" && onNavigate(target)}
                  aria-current={active ? "page" : undefined}>
                  <Icon size={19} strokeWidth={1.7} />
                  <span className="universe-dock__tip">{label}</span>
                </button>
              ))}
            </nav>

            <header className="universe-heading">
              <p className="universe-heading-kicker"><Sparkles size={13} /> written in the stars</p>
              <h1>Our Little<br className="heading-break" /> Universe <span>♡</span></h1>
              <p className="universe-heading-sub">Every star here holds a little piece of you, of me, and of our journey…</p>
              <div className="universe-progress" aria-live="polite">
                <span>{discovered.length} / {total} stars found</span>
                <span className="universe-progress__track">
                  <i style={{ width: `${(discovered.length / total) * 100}%` }} />
                </span>
              </div>
            </header>

            <section className={`universe-heart-sky ${allDiscovered ? "heart-complete" : ""}`} aria-label="Discover the stars of our heart">
              <svg className="heart-svg" viewBox="0 0 100 90" aria-hidden="true">
                <defs>
                  <radialGradient id="uHeartFill" cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="#ff7fbe" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#ff4f9d" stopOpacity="0.04" />
                  </radialGradient>
                  <linearGradient id="uHeartLine" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffe3c8" />
                    <stop offset="100%" stopColor="#ff9fd0" />
                  </linearGradient>
                </defs>
                <path className="heart-ghost" d={HEART_FULL_PATH} />
                <motion.path
                  d={HEART_FULL_PATH} fill="url(#uHeartFill)" stroke="none"
                  initial={{ opacity: 0 }} animate={{ opacity: allDiscovered ? 1 : 0 }}
                  transition={{ duration: dur(1.6), delay: allDiscovered ? dur(1.1) : 0 }}
                />
                {HEART_EDGES.map((edge, i) => {
                  const lit = allDiscovered || (discovered.includes(edge.a) && discovered.includes(edge.b));
                  return (
                    <motion.path
                      key={edge.key} d={edge.d} className="heart-edge" stroke="url(#uHeartLine)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
                      transition={{ duration: dur(allDiscovered ? 0.8 : 0.6), delay: dur(allDiscovered ? i * 0.12 : 0), ease: "easeInOut" }}
                    />
                  );
                })}
              </svg>

              {HEART_STARS.map((star) => {
                const found = discovered.includes(star.id);
                return (
                  <div key={star.id} className="heart-star-wrap" style={{ left: star.left, top: star.top }}>
                    <motion.button
                      type="button"
                      className={`heart-star label-${star.side} ${found ? "is-found" : ""}`}
                      style={{ "--lx": `${star.shift || 0}px` }}
                      onClick={() => discover(star)}
                      aria-label={`Discover ${star.title}`}
                      whileHover={reduceMotion ? {} : { scale: 1.16 }}
                      whileTap={reduceMotion ? {} : { scale: 0.9 }}
                    >
                      <span className="heart-star__halo" />
                      {!found && <span className="heart-star__ping" />}
                      <Star className="heart-star__icon" size={26} strokeWidth={1.6} fill={found ? "currentColor" : "none"} />
                      <span className="heart-star__label">{star.title}</span>
                    </motion.button>
                  </div>
                );
              })}

              {/* Centre of the heart */}
              <div className="heart-anchor">
                <AnimatePresence>
                  {discovered.length === 0 && (
                    <motion.p className="heart-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur(0.6) }}>
                      <Sparkles size={14} /> tap a glowing star
                    </motion.p>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {allDiscovered && (
                    <motion.div
                      className="heart-finale"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: dur(1.1), type: "spring", stiffness: 90, damping: 13, delay: dur(0.7) }}
                    >
                      <motion.div className="heart-finale__aura"
                        animate={reduceMotion ? {} : { scale: [0.92, 1.12, 0.92], opacity: [0.5, 0.95, 0.5] }}
                        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
                      <div className="heart-finale__text">
                        <span>You</span> <em>&amp;</em> <span>Me</span>
                      </div>
                      <motion.div className="heart-finale__heart"
                        animate={reduceMotion ? {} : { scale: [1, 1.25, 1], y: [0, -2, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
                        <Heart size={22} fill="currentColor" />
                      </motion.div>
                      {!reduceMotion && BURST.map((p, i) => (
                        <motion.span key={p.id} className="heart-burst"
                          initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                          animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: [0.3, 1.1, 0.4] }}
                          transition={{ duration: 1.9, delay: 0.9 + i * 0.03, ease: "easeOut" }}>
                          {p.glyph}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <p className="universe-poem">
              <span>“In this endless universe,</span>
              <span>my favourite place</span>
              <span>will always be</span>
              <span>beside you.” <Heart size={12} fill="currentColor" /></span>
            </p>

            <div className="universe-cta-dock">
              <button type="button" className={`universe-cta ${allDiscovered ? "is-final" : ""}`} onClick={handleCta}>
                <Star size={18} />
                <span>{allDiscovered ? "There's One More Thing, My Love" : "Discover the Next Star"}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Star message */}
      <AnimatePresence>
        {selectedStar && backgroundReady && (
          <motion.div className="universe-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStar(null)}>
            <motion.article
              key={selectedStar.id}
              className="universe-card" role="dialog" aria-modal="true" aria-labelledby="universe-card-title"
              initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: dur(0.3) }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="universe-card__close" type="button" aria-label="Close message" onClick={() => setSelectedStar(null)}><X size={18} /></button>
              <div className="universe-card__icon"><Star size={26} fill="currentColor" /></div>
              <p className="universe-card__kicker">a little piece of my heart</p>
              <h2 id="universe-card-title">{selectedStar.title}</h2>
              <p className="universe-card__copy">{selectedStar.message}</p>
              <div className="universe-card__nav">
                <button type="button" aria-label="Previous star" onClick={() => stepStar(-1)}><ChevronLeft size={20} /></button>
                <span>{selectedStar.id} / {total}</span>
                <button type="button" aria-label="Next star" onClick={() => stepStar(1)}><ChevronRight size={20} /></button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final surprise */}
      <AnimatePresence>
        {finaleOpen && backgroundReady && (
          <motion.div className="universe-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFinaleOpen(false)}>
            <motion.article
              className="universe-card is-finale" role="dialog" aria-modal="true" aria-labelledby="universe-finale-title"
              initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: dur(0.4) }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="universe-card__close" type="button" aria-label="Close" onClick={() => setFinaleOpen(false)}><X size={18} /></button>
              <div className="universe-card__icon"><Heart size={26} fill="currentColor" /></div>
              <p className="universe-card__kicker">one more thing</p>
              <h2 id="universe-finale-title">Happy Birthday, My Miss Universe</h2>
              <p className="universe-card__copy">
                Out of every star in every sky, you are the one I would choose to find again and again.
                Thank you for being my favourite person. This little universe is yours, always.
              </p>
              <div className="universe-card__actions">
                <button type="button" className="ghost" onClick={() => setFinaleOpen(false)}>Look at the stars again</button>
                <button type="button" className="solid" onClick={() => onNavigate("Page8")}>Send me a message <ArrowRight size={16} /></button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}