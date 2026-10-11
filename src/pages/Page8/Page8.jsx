import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Mail, Send, Sparkles, Stars } from "lucide-react";
import "./Page8.css";

/* ============================ CONFIG ============================ */
// Which page opens after the paper plane flies away.
const NEXT_PAGE = "Page9";

// true = play the flight animation WITHOUT sending an email (for previewing).
const PREVIEW_FLIGHT_WITHOUT_EMAIL = false;

// Frontend-only email sending via Web3Forms (free, works straight from the browser).
// 1) Go to https://web3forms.com and enter the email that should receive the letters.
// 2) They email you an access key — paste it below (or set VITE_WEB3FORMS_KEY in .env).
// Unlike a Resend secret key, a Web3Forms access key is designed to live in frontend code.
const WEB3FORMS_ACCESS_KEY =
  import.meta.env?.VITE_WEB3FORMS_KEY || "06100bca-b7b4-4245-979a-0458c8488a48";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

/* ============================ DATA ============================== */
const TAU = Math.PI * 2;
const SPARK_COLORS = ["#ffffff", "#ffc2e5", "#d9c8ff", "#ffd9b8"];
const SPARK_PATH = "M12 0C12.9 7.3 16.7 11.1 24 12C16.7 12.9 12.9 16.7 12 24C11.1 16.7 7.3 12.9 0 12C7.3 11.1 11.1 7.3 12 0Z";

/* ---- heart curve (constellation on the question page) ---- */
const heartPoint = (t) => {
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [50 + x * 2.4, 10 + (12 - y) * 2.4];
};
const heartPath = (from, to, steps = 140) => {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const [x, y] = heartPoint(from + ((to - from) * i) / steps);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d;
};
const Q_HEART_PATH = heartPath(0, TAU) + "Z";
const Q_HEART_NODES = Array.from({ length: 10 }, (_, i) => heartPoint((i / 10) * TAU));

/* ---- intro ---- */
const INTRO_FLAT = [
  { word: "Now…", row: "a" },
  { word: "it's…", row: "a" },
  { word: "your…", row: "a" },
  { word: "turn…", row: "a" },
  { word: "my…", row: "b" },
  { word: "Miss Universe", row: "c", final: true },
];
const INTRO_TIMES = [900, 2100, 3300, 4500, 5700, 6900];
const INTRO_END = 10000;

const INTRO_STARS = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  left: `${(i * 47.13 + 5.3) % 100}%`,
  top: `${(i * 61.7 + 3.1) % 100}%`,
  size: 1 + ((i * 13) % 3) + (i % 17 === 0 ? 1.5 : 0),
  delay: `${((i * 11) % 50) / 10}s`,
  duration: `${1.8 + ((i * 19) % 35) / 10}s`,
  tint: i % 6 === 0 ? "pink" : i % 9 === 0 ? "lav" : "white",
}));
const INTRO_HEARTS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${6 + ((i * 29) % 88)}%`,
  size: `${10 + ((i * 7) % 14)}px`,
  delay: `${(i * 1.1) % 9}s`,
  duration: `${9 + ((i * 5) % 7)}s`,
  drift: `${(i % 2 ? 1 : -1) * (10 + i * 4)}px`,
}));
const INTRO_SHOOTS = [
  { left: "88%", top: "12%", delay: "1.2s" },
  { left: "100%", top: "26%", delay: "3.4s" },
  { left: "72%", top: "8%", delay: "5.6s" },
  { left: "96%", top: "36%", delay: "7.8s" },
];

/* ---- ambient (all scenes) ---- */
const AMBIENT_STARS = Array.from({ length: 46 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 7) % 100}%`,
  top: `${(i * 53 + 9) % 100}%`,
  size: `${2 + (i % 3)}px`,
  delay: `${(i % 8) * 0.3}s`,
  duration: `${2.4 + (i % 5) * 0.5}s`,
}));
const AMBIENT_HEARTS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${8 + ((i * 41) % 86)}%`,
  size: `${10 + ((i * 5) % 9)}px`,
  delay: `${(i * 2.1) % 12}s`,
  duration: `${14 + ((i * 3) % 8)}s`,
  drift: `${(i % 2 ? 1 : -1) * (12 + i * 5)}px`,
}));

/* ---- question page extras ---- */
const RAIN = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${4 + ((i * 53) % 92)}%`,
  size: `${12 + ((i * 11) % 20)}px`,
  delay: `${(i * 0.9) % 9}s`,
  duration: `${8 + ((i * 7) % 7)}s`,
  sway: `${(i % 2 ? 1 : -1) * (14 + ((i * 5) % 28))}px`,
}));
const GLINTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${((i * 37) + 6) % 92}%`,
  top: `${66 + ((i * 13) % 22)}%`,
  width: `${18 + ((i * 9) % 34)}px`,
  delay: `${(i * 0.37) % 3.4}s`,
}));
const ORBIT = Array.from({ length: 6 }, (_, i) => {
  const angle = (i / 6) * TAU;
  const r = i % 2 ? 58 : 44;
  return { id: i, x: Math.cos(angle) * r, y: Math.sin(angle) * r, size: i % 2 ? 11 : 14 };
});

const WARP_LINES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  top: `${(i * 4.6 + 3) % 100}%`,
  delay: `${(i * 0.07) % 0.9}s`,
  width: `${120 + ((i * 53) % 220)}px`,
}));

/* ---- letter page ---- */
const MOODS = [
  { label: "Loved", emoji: "💗" },
  { label: "Happy", emoji: "😊" },
  { label: "Shy", emoji: "🙈" },
  { label: "Emotional", emoji: "🥹" },
  { label: "Speechless", emoji: "✨" },
];
const LETTER_LINES = [
  "Every word you write becomes a little star for me…",
  "I'll keep it forever, tucked safely in my heart.",
  "Write like no one is reading — I'm only listening.",
];

const questionText = {
  first: "Miss Universe… do you love me?",
  second: "Really? 🥹 You mean it?",
};

/* ---- paper → paper-plane morph ---- */
const CLIP_RECT = "polygon(0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)";
const CLIP_PLANE = "polygon(0% 0%, 48% 27%, 100% 50%, 52% 56%, 0% 100%, 20% 60%, 24% 50%, 20% 40%)";

const makeFlightVariants = (vw, vh) => ({
  wrap: {
    idle: { x: 0, y: 0, rotate: 0, scale: 1, scaleX: 1 },
    fold: { scale: 0.46, rotate: -12, y: -24, transition: { duration: 1.1, ease: "easeInOut", delay: 0.1 } },
    launch: {
      x: [null, vw * 0.08, vw * 0.42, vw * 1.25],
      y: [null, -vh * 0.06, -vh * 0.26, -vh * 1.05],
      rotate: [null, -22, -34, -40],
      scale: [0.46, 0.44, 0.4, 0.34],
      scaleX: [1, 1.05, 1.7, 2.6],
      transition: { duration: 1.9, ease: "easeIn", times: [0, 0.25, 0.6, 1] },
    },
  },
  paper: {
    idle: { clipPath: CLIP_RECT },
    fold: { clipPath: CLIP_PLANE, transition: { duration: 0.95, delay: 0.35, ease: "easeInOut" } },
    launch: { clipPath: CLIP_PLANE },
  },
  sheet: {
    idle: { opacity: 0 },
    fold: { opacity: 1, transition: { duration: 0.5, delay: 0.25 } },
    launch: { opacity: 1 },
  },
  content: {
    idle: { opacity: 1 },
    fold: { opacity: 0, transition: { duration: 0.28 } },
    launch: { opacity: 0 },
  },
  trail: {
    idle: { opacity: 0, scaleX: 0 },
    fold: { opacity: 0, scaleX: 0 },
    launch: { opacity: [0, 1, 1], scaleX: [0, 1, 1.5], transition: { duration: 1.9, delay: 0.05, ease: "easeOut" } },
  },
});

/* ============================ SMALL PARTS ======================= */
function Sparkle({ style, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={style} className={className}>
      <path d={SPARK_PATH} />
    </svg>
  );
}

function IntroWordText({ text, big, heart }) {
  return (
    <span className={`p8i-word ${big ? "p8i-word--big" : ""}`}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="p8i-letter"
          initial={{ opacity: 0, y: 30, scale: 0.7, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
      {heart && (
        <motion.span
          className="p8i-heart"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [0, 1.7, 1] }}
          transition={{ delay: text.length * 0.06 + 0.25, duration: 0.7 }}
        >
          <i>♥</i>
        </motion.span>
      )}
    </span>
  );
}

function WordBurst({ burstKey, final }) {
  const items = useMemo(() => {
    const n = final ? 24 : 10;
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * TAU + burstKey * 0.7;
      const r = (final ? 150 : 95) + ((i * 37) % 70);
      return { id: i, x: Math.cos(angle) * r, y: Math.sin(angle) * r * 0.7, size: 8 + ((i * 5) % 13), color: SPARK_COLORS[i % 4] };
    });
  }, [burstKey, final]);

  return (
    <div className="p8i-burst" aria-hidden="true">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="p8i-burst__item"
          style={{ width: p.size, height: p.size, color: p.color }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.1, 0.3], x: p.x, y: p.y }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Sparkle style={{ width: "100%", height: "100%" }} />
        </motion.span>
      ))}
    </div>
  );
}

function YesBurst({ k }) {
  const items = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * TAU;
        const r = 60 + ((i * 29) % 70);
        return { id: i, x: Math.cos(a) * r, y: Math.sin(a) * r - 30, size: 12 + ((i * 7) % 14) };
      }),
    [k]
  );
  return (
    <span className="p8q-burst" aria-hidden="true">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="p8q-burstheart"
          style={{ fontSize: p.size }}
          initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.2, 1.2, 0.6], x: p.x, y: p.y }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          ♥
        </motion.span>
      ))}
    </span>
  );
}

/* little animated envelope: flap opens, letter peeks out, hearts float up */
function MiniEnvelope() {
  return (
    <div className="p8l-env" aria-hidden="true">
      <span className="p8l-env__back" />
      <span className="p8l-env__letter"><Heart size={10} fill="currentColor" /></span>
      <span className="p8l-env__front" />
      <span className="p8l-env__flap" />
      <span className="p8l-env__heart" style={{ "--hx": "-10px" }}>♥</span>
      <span className="p8l-env__heart p8l-env__heart--2" style={{ "--hx": "12px" }}>♥</span>
    </div>
  );
}

/* ============================ PAGE ============================== */
export default function Page8({ onNavigate }) {
  const reduceMotion = useReducedMotion();

  const [stage, setStage] = useState("intro");
  const [introWordIndex, setIntroWordIndex] = useState(-1);
  const [noCount, setNoCount] = useState(0);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [mood, setMood] = useState("Loved");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");
  const [showNoNote, setShowNoNote] = useState(false);
  const [flight, setFlight] = useState("idle"); // idle | fold | launch
  const [flash, setFlash] = useState(false);
  const [burst, setBurst] = useState(0);
  const [yesLock, setYesLock] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  const timersRef = useRef([]);
  const later = (ms, fn) => timersRef.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  const flightVariants = useMemo(
    () =>
      makeFlightVariants(
        typeof window !== "undefined" ? window.innerWidth : 400,
        typeof window !== "undefined" ? window.innerHeight : 800
      ),
    []
  );

  /* ---- Intro sequence ---- */
  useEffect(() => {
    if (stage !== "intro") return undefined;
    if (reduceMotion) {
      setIntroWordIndex(INTRO_FLAT.length - 1);
      setStage("welcome-ready");
      return undefined;
    }
    if (document.fonts) document.fonts.load('80px "Great Vibes"');
    const timers = INTRO_TIMES.map((ms, i) => window.setTimeout(() => setIntroWordIndex(i), ms));
    timers.push(window.setTimeout(() => setStage("welcome-ready"), INTRO_END));
    return () => timers.forEach(window.clearTimeout);
  }, [stage, reduceMotion]);

  /* ---- Rotating romantic lines on the letter page ---- */
  useEffect(() => {
    if (stage !== "letter" || reduceMotion) return undefined;
    const t = window.setInterval(() => setLineIdx((i) => (i + 1) % LETTER_LINES.length), 3800);
    return () => window.clearInterval(t);
  }, [stage, reduceMotion]);

  /* ---- Question ---- */
  const handleNo = () => {
    setNoCount((c) => c + 1);
    setShowNoNote(true);
  };
  const handleYes = () => {
    if (yesLock) return;
    setShowNoNote(false);
    const next = stage === "question-one" ? "question-two" : "letter";
    if (reduceMotion) {
      setStage(next);
      return;
    }
    setYesLock(true);
    setBurst((b) => b + 1);
    later(700, () => {
      setStage(next);
      setBurst(0);
      setYesLock(false);
    });
  };
  const goBackToQuestion = () => {
    setStage("question-one");
    setNoCount(0);
    setShowNoNote(false);
  };

  /* ---- Delivery: straight from the browser through Web3Forms ---- */
  const deliver = async ({ name, mood: moodValue, message: letterText }) => {
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.startsWith("PASTE_")) {
      throw new Error("Add your Web3Forms access key at the top of Page8.jsx first (free at web3forms.com).");
    }
    const sentAt = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    let response;
    try {
      response = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `A letter from ${name} 💌`,
          from_name: name,
          name,
          mood: moodValue,
          sent_at: `${sentAt.toLocaleString()} (${timezone})`,
          message: letterText,
        }),
      });
    } catch (networkError) {
      console.error("Network error while sending the letter:", networkError);
      throw new Error("Couldn't reach the email service. Check your internet connection and try again.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.success) {
      console.error("Web3Forms response:", data);
      throw new Error(data?.message || "The email service didn't accept the letter. Please try again.");
    }
    return data;
  };

  /* ---- The flight ---- */
  const finishFlight = () => {
    if (onNavigate) onNavigate(NEXT_PAGE);
    else setStage("sent");
  };
  const startFlight = () => {
    if (reduceMotion) {
      later(500, finishFlight);
      return;
    }
    setFlight("fold");
    later(1400, () => setFlight("launch"));
    later(3000, () => setFlash(true));
    later(3800, finishFlight);
  };

  const sendLetter = async (event) => {
    event.preventDefault();
    if (sending || flight !== "idle") return;
    setSendStatus("");

    const text = message.trim();
    if (!text) {
      setSendStatus("Write a little something from your heart first. ♥");
      return;
    }
    const name = senderName.trim() || "Your Miss Universe";

    if (PREVIEW_FLIGHT_WITHOUT_EMAIL) {
      console.warn("Preview mode: nothing was emailed.");
      startFlight();
      return;
    }

    setSending(true);
    try {
      await deliver({ name, mood, message: text });
      startFlight();
    } catch (error) {
      console.error("Letter delivery error:", error);
      setSendStatus(error?.message || "The letter could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const dur = (n) => (reduceMotion ? 0 : n);
  const flying = flight !== "idle";
  const isQuestion = stage === "question-one" || stage === "question-two";
  const visibleWords = INTRO_FLAT.map((w, i) => ({ ...w, i })).filter((w) => w.i <= introWordIndex);
  const rowWords = (row) => visibleWords.filter((w) => w.row === row);

  return (
    <main
      className={`page8 page8--${stage} ${flying ? `page8--flight page8--flight-${flight}` : ""}`}
      aria-live="polite"
    >
      {/* ---------- Ambient sky ---------- */}
      {stage !== "intro" && (
        <div className="page8__ambient" aria-hidden="true">
          {AMBIENT_STARS.map((s) => (
            <span key={s.id} className="p8a-star"
              style={{ "--l": s.left, "--t": s.top, "--s": s.size, "--dl": s.delay, "--d": s.duration }} />
          ))}
          {AMBIENT_HEARTS.map((h) => (
            <span key={h.id} className="p8a-heart"
              style={{ "--l": h.left, "--s": h.size, "--dl": h.delay, "--d": h.duration, "--drift": h.drift }}>♥</span>
          ))}
          <span className="p8a-shoot" style={{ "--l": "85%", "--t": "10%", "--dl": "3s" }} />
          <span className="p8a-shoot" style={{ "--l": "98%", "--t": "30%", "--dl": "11s" }} />
        </div>
      )}

      {/* ---------- Question page: heart rain + water glints ---------- */}
      {isQuestion && (
        <div className="p8q-rain" aria-hidden="true">
          {RAIN.map((h) => (
            <span key={h.id} className="p8q-rainheart"
              style={{ "--l": h.left, "--s": h.size, "--dl": h.delay, "--d": h.duration, "--sway": h.sway }}>♥</span>
          ))}
          {GLINTS.map((g) => (
            <i key={g.id} className="p8q-glint"
              style={{ "--l": g.left, "--t": g.top, "--w": g.width, "--dl": g.delay }} />
          ))}
        </div>
      )}

      {/* ---------- Top bar ---------- */}
      {stage !== "intro" && (
        <div className={`page8__topbar ${flying ? "is-hidden" : ""}`}>
          <button className="page8__pill" type="button" onClick={() => onNavigate?.("Page7")}>
            <span aria-hidden="true">←</span> Back to Our Universe
          </button>
          <span className="page8__chapter"><Stars size={14} /> A LITTLE PIECE OF MY HEART</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* =============================== INTRO =============================== */}
        {stage === "intro" && (
          <motion.section
            key="intro"
            className="p8i"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.55, filter: "blur(16px)" }}
            transition={{ duration: dur(0.9), ease: "easeIn" }}
            aria-label="A little message for you"
          >
            <div className="p8i-nebula" aria-hidden="true" />

            <div className="p8i-stars" aria-hidden="true">
              {INTRO_STARS.map((s) => (
                <span key={s.id} className={`p8i-star tint-${s.tint}`}
                  style={{ "--l": s.left, "--t": s.top, "--s": `${s.size}px`, "--dl": s.delay, "--d": s.duration }} />
              ))}
            </div>

            {INTRO_SHOOTS.map((s, i) => (
              <span key={i} className="p8i-shoot" aria-hidden="true"
                style={{ "--l": s.left, "--t": s.top, "--dl": s.delay }} />
            ))}

            <div className="p8i-hearts" aria-hidden="true">
              {INTRO_HEARTS.map((h) => (
                <span key={h.id} className="p8i-floatheart"
                  style={{ "--l": h.left, "--s": h.size, "--dl": h.delay, "--d": h.duration, "--drift": h.drift }}>♥</span>
              ))}
            </div>

            {introWordIndex >= 0 && (
              <div className="p8i-bloom-pos" aria-hidden="true">
                <motion.div
                  key={`bloom-${introWordIndex}`}
                  className={`p8i-bloom ${INTRO_FLAT[introWordIndex].final ? "p8i-bloom--xl" : ""}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0.75], scale: [0.5, 1, 1.08] }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              </div>
            )}

            <h1 className="p8i-phrase" aria-label="Now it's your turn, my Miss Universe">
              {["a", "b", "c"].map((row) => {
                const words = rowWords(row);
                if (!words.length) return null;
                return (
                  <span key={row} className={`p8i-row p8i-row--${row}`} aria-hidden="true">
                    {words.map((w) => (
                      <IntroWordText key={w.i} text={w.word} big={w.final} heart={w.final} />
                    ))}
                  </span>
                );
              })}
            </h1>

            {introWordIndex >= 0 && (
              <WordBurst
                key={`burst-${introWordIndex}`}
                burstKey={introWordIndex}
                final={Boolean(INTRO_FLAT[introWordIndex].final)}
              />
            )}

            <button type="button" className="p8i-skip" onClick={() => setStage("welcome-ready")}>Skip</button>
          </motion.section>
        )}

        {/* =============================== WELCOME ============================= */}
        {stage === "welcome-ready" && (
          <motion.section
            key="welcome"
            className="page8__scene page8__scene--welcome"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
            transition={{ duration: dur(0.8) }}
          >
            <div className="p8w">
              <div className="p8w-top">
                <motion.p className="page8__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                  <Sparkles size={15} /> JUST FOR YOU
                </motion.p>

                <h1 className="page8__script p8w-title">
                  <motion.span
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: dur(1), delay: 0.35 }}
                  >
                    Now, it’s your turn…
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: dur(1), delay: 0.75 }}
                  >
                    My Miss Universe <Heart className="page8__inline-heart" fill="currentColor" />
                  </motion.span>
                </h1>

                <motion.p className="p8w-copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.2 }}>
                  I’ve made these little surprises for you. Now I want to hear what’s in your heart.
                  Take your time — every word matters to me.
                </motion.p>
              </div>

              <div className="p8w-bottom">
                <span className="p8w-orn" aria-hidden="true">♡</span>
                <motion.button
                  className="page8__primary"
                  type="button"
                  onClick={() => { setShowNoNote(false); setStage("question-one"); }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.5 }}
                >
                  Continue <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}

        {/* =============================== QUESTION ============================ */}
        {isQuestion && (
          <motion.section
            key={stage}
            className={`page8__scene page8__scene--question ${stage === "question-two" ? "is-fast" : ""}`}
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
            transition={{ duration: dur(0.55) }}
          >
            {/* Heart constellation drawn in the sky */}
            <div className="p8q-sky" aria-hidden="true">
              <svg className="p8q-heartsvg" viewBox="0 0 100 90">
                <defs>
                  <linearGradient id="p8qLine" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffe3c8" />
                    <stop offset="100%" stopColor="#ff8cc8" />
                  </linearGradient>
                  <radialGradient id="p8qFill" cx="50%" cy="48%" r="55%">
                    <stop offset="0%" stopColor="#ff7fbe" stopOpacity="0.36" />
                    <stop offset="100%" stopColor="#ff4f9d" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <motion.path
                  d={Q_HEART_PATH} fill="url(#p8qFill)" stroke="none"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: dur(1.6), duration: dur(1.4) }}
                />
                <path d={Q_HEART_PATH} className="p8q-heartghost" />
                <motion.path
                  d={Q_HEART_PATH} className="p8q-heartline" fill="none" stroke="url(#p8qLine)"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: dur(2.6), ease: "easeInOut" }}
                />
                {Q_HEART_NODES.map(([x, y], i) => (
                  <g key={i}>
                    <circle className="p8q-node-halo" cx={x} cy={y} r="2.3" style={{ animationDelay: `${1.2 + i * 0.3}s` }} />
                    <circle className="p8q-node" cx={x} cy={y} r="0.95" style={{ animationDelay: `${1.2 + i * 0.3}s` }} />
                  </g>
                ))}
              </svg>

              <div className="p8q-orbit">
                {ORBIT.map((o) => (
                  <span key={o.id} style={{ "--x": `${o.x}px`, "--y": `${o.y}px`, "--s": `${o.size}px` }}>♥</span>
                ))}
              </div>

              <div className="p8q-core">
                <span className="p8q-ring" />
                <span className="p8q-ring p8q-ring--2" />
                <motion.div
                  className="p8q-heart"
                  animate={reduceMotion ? {} : { scale: stage === "question-two" ? [1, 1.24, 1] : [1, 1.12, 1] }}
                  transition={{ duration: stage === "question-two" ? 0.9 : 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart fill="currentColor" strokeWidth={1.2} />
                </motion.div>
              </div>
            </div>

            <div className="p8q-card">
              <p className="page8__eyebrow">ONE LITTLE QUESTION</p>

              <h2 className="page8__script p8q-title">
                {stage === "question-one" ? questionText.first : questionText.second}
              </h2>

              <p className="p8q-sub">
                {stage === "question-one" ? "Tell me honestly, my love…" : "My heart wants to hear it one more time. ♥"}
              </p>

              <div className="p8q-choices">
                <span className="p8q-yeswrap">
                  <button
                    type="button"
                    className="page8__primary p8q-yes"
                    style={{ transform: `scale(${Math.min(1.45, 1 + noCount * 0.1)})` }}
                    onClick={handleYes}
                  >
                    <Heart size={17} fill="currentColor" /> Yes
                  </button>
                  {burst > 0 && <YesBurst key={burst} k={burst} />}
                </span>
                <button
                  type="button"
                  className="page8__secondary p8q-no"
                  style={{ transform: `scale(${Math.max(0.72, 1 - noCount * 0.08)})` }}
                  onClick={handleNo}
                >
                  No <span aria-hidden="true">🙈</span>
                </button>
              </div>

              <AnimatePresence>
                {showNoNote && (
                  <motion.p className="p8q-note" initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }}>
                    {noCount === 1
                      ? "Awww, please say yes 🥺♥"
                      : noCount === 2
                        ? "I'll be right here whenever you're ready 💗"
                        : "No rush, my love. Choose whenever you feel ready. ♥"}
                  </motion.p>
                )}
              </AnimatePresence>

              <button className="p8q-back" type="button" onClick={() => setStage("welcome-ready")}>
                Back to my note
              </button>
            </div>
          </motion.section>
        )}

        {/* =============================== LETTER ============================== */}
        {stage === "letter" && (
          <motion.section
            key="letter"
            className="page8__scene page8__scene--letter"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
            transition={{ duration: dur(0.6) }}
          >
            <form id="page8-letter-form" className={`p8l ${flying ? "is-flying" : ""}`} onSubmit={sendLetter}>
              <div className="p8l-head">
                <p className="page8__eyebrow"><Mail size={14} /> A LETTER FROM YOUR HEART</p>
                <h2 className="page8__script">Write to me…</h2>
              </div>

              {/* animated envelope + rotating romantic lines */}
              <div className="p8l-hint">
                <MiniEnvelope />
                <div className="p8l-hint__text">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={lineIdx}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: dur(0.6) }}
                    >
                      {LETTER_LINES[lineIdx]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <motion.div className="p8l-planewrap" variants={flightVariants.wrap} initial="idle" animate={flight}>
                <motion.div className="p8l-trail" variants={flightVariants.trail} initial="idle" animate={flight} aria-hidden="true" />

                <motion.div className="p8l-paper" variants={flightVariants.paper} initial="idle" animate={flight}>
                  <span className="p8l-shine" aria-hidden="true" />
                  <span className="p8l-watermark" aria-hidden="true">♥</span>
                  <motion.div className="p8l-sheet" variants={flightVariants.sheet} initial="idle" animate={flight} aria-hidden="true" />

                  <motion.div className="p8l-paper__content" variants={flightVariants.content} initial="idle" animate={flight}>
                    <div className="p8l-paper__top">
                      <span>To someone who adores you</span>
                      <span className="p8l-seal" aria-hidden="true"><Heart size={15} fill="currentColor" /></span>
                    </div>

                    <div className="p8l-from">
                      <label htmlFor="page8-name">From</label>
                      <input
                        id="page8-name"
                        className="p8l-input"
                        type="text"
                        maxLength={80}
                        placeholder="Your name (optional)"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                      />
                    </div>

                    <div className="p8l-moods" role="group" aria-label="How are you feeling?">
                      {MOODS.map((m) => (
                        <button
                          key={m.label}
                          type="button"
                          className={`p8l-chip ${mood === m.label ? "is-on" : ""}`}
                          aria-pressed={mood === m.label}
                          aria-label={m.label}
                          onClick={() => setMood(m.label)}
                        >
                          <span aria-hidden="true">{m.emoji}</span>
                          <span className="p8l-chip__lbl">{m.label}</span>
                        </button>
                      ))}
                    </div>

                    <p className="p8l-salute" aria-hidden="true">My love,</p>

                    <textarea
                      id="page8-message"
                      className="p8l-textarea"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me what's in your heart…"
                      aria-label="Your letter"
                      maxLength={5000}
                      required
                    />

                    <p className="p8l-sign" aria-hidden="true">
                      — {senderName.trim() || "Yours"} <span>♥</span>
                    </p>

                    <div className="p8l-paper__foot">
                      <span>Private until you press send</span>
                      <span>
                        {message.length > 4000 ? `${message.length}/5000` : <>With love <Heart size={11} fill="currentColor" /></>}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </form>
          </motion.section>
        )}

        {/* =============================== SENT (fallback) ===================== */}
        {stage === "sent" && (
          <motion.section
            key="sent"
            className="page8__scene page8__scene--sent"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: dur(0.8), type: "spring", damping: 16 }}
          >
            <div className="p8s-card">
              <Heart className="p8s-heart" fill="currentColor" />
              <h2 className="page8__script">Your words are on their way…</h2>
              <p>They’ll be treasured, every single one. ♥</p>
              <button type="button" className="page8__primary" onClick={() => onNavigate?.("Page7")}>
                Back to Our Universe <ArrowRight size={17} />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ---------- Letter page: Send bar fixed at the bottom ---------- */}
      {stage === "letter" && (
        <div className={`p8l-dock ${flying ? "is-hidden" : ""}`}>
          {sendStatus && <p className="p8l-status" role="status">{sendStatus}</p>}
          <div className="p8l-actions">
            <button type="button" className="page8__secondary" onClick={goBackToQuestion} disabled={flying}>
              Back
            </button>
            <button
              type="submit"
              form="page8-letter-form"
              className={`page8__primary p8l-send ${message.trim() ? "is-ready" : ""}`}
              disabled={sending || flying}
            >
              {sending ? "Sending your heart…" : "Send My Heart"} <Send size={17} />
            </button>
          </div>
        </div>
      )}

      {/* ---------- Flight effects ---------- */}
      {flight === "launch" && (
        <div className="p8-warp" aria-hidden="true">
          {WARP_LINES.map((l) => (
            <i key={l.id} style={{ "--t": l.top, "--dl": l.delay, "--w": l.width }} />
          ))}
        </div>
      )}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="p8-flash"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}