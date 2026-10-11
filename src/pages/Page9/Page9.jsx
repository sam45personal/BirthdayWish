import { useEffect, useMemo, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import {

  ArrowRight, Heart, Image as ImageIcon, MessageCircle, RotateCw, Star,

} from "lucide-react";

import "./Page9.css";



/* ============================ CONFIG ============================ */


const RESTART_PAGE = "Page2";     // "Experience It Again"




// Wooden menu (matches the previous pages)

const MENU = [

  { label: "Love Letter", icon: Heart, target: "Page5" },

  { label: "Our Memories", icon: ImageIcon, target: "Page6" },

  { label: "Our Universe", icon: Star, target: "Page7" },

  { label: "Send Message", icon: MessageCircle, target: "Page8" },

];







// Reveal timeline (ms). Step n turns on at STEP_TIMES[n - 1].

// 1 top controls · 2 menu · 3 heading · 4 message · 5 divider and notes · 6 final button

const STEP_TIMES = [200, 600, 1100, 1900, 2500, 3200];

const LAST_STEP = STEP_TIMES.length;

const ARRIVAL_END = 3800;



/* ============================ FX DATA =========================== */

const HEARTS = Array.from({ length: 9 }, (_, i) => ({

  id: i,

  left: `${6 + ((i * 37) % 88)}%`,

  size: `${10 + ((i * 7) % 14)}px`,

  delay: `${(i * 1.9) % 12}s`,

  duration: `${15 + ((i * 3) % 9)}s`,

  sway: `${(i % 2 ? 1 : -1) * (16 + ((i * 9) % 30))}px`,

}));

const PETALS = Array.from({ length: 8 }, (_, i) => ({

  id: i,

  left: `${4 + ((i * 47) % 92)}%`,

  width: `${9 + ((i * 5) % 7)}px`,

  delay: `${(i * 2.3) % 14}s`,

  duration: `${13 + ((i * 5) % 8)}s`,

  sway: `${(i % 2 ? 1 : -1) * (30 + ((i * 11) % 50))}px`,

}));

const SPARKS = Array.from({ length: 14 }, (_, i) => ({

  id: i,

  left: `${((i * 41 + 7) % 92) + 2}%`,

  top: `${((i * 29 + 11) % 84) + 4}%`,

  size: `${7 + ((i * 5) % 9)}px`,

  delay: `${(i * 0.53) % 4}s`,

  duration: `${2.6 + (i % 4) * 0.6}s`,

}));

const LANTERNS = Array.from({ length: 5 }, (_, i) => ({

  id: i,

  left: `${12 + ((i * 41) % 76)}%`,

  top: `${38 + ((i * 11) % 22)}%`,

  size: `${12 + ((i * 3) % 7)}px`,

  delay: `${i * 3.2}s`,

  duration: `${16 + (i % 3) * 3}s`,

}));

const SPARK_PATH = "M12 0C12.9 7.3 16.7 11.1 24 12C16.7 12.9 12.9 16.7 12 24C11.1 16.7 7.3 12.9 0 12C7.3 11.1 11.1 7.3 12 0Z";



/* ============================ SMALL PARTS ======================= */

function Sparkle({ className, style }) {

  return (

    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} style={style}>

      <path d={SPARK_PATH} />

    </svg>

  );

}



function Blossom({ className = "" }) {

  return (

    <svg viewBox="0 0 40 40" className={`page9-blossom ${className}`} aria-hidden="true">

      {[0, 72, 144, 216, 288].map((a) => (

        <ellipse key={a} cx="20" cy="9.5" rx="7.2" ry="9" transform={`rotate(${a} 20 20)`}

          fill="url(#page9-petal)" stroke="rgba(190,70,115,.45)" strokeWidth=".8" />

      ))}

      <circle cx="20" cy="20" r="4.6" fill="#ffd36e" stroke="#e09a2f" strokeWidth=".8" />

    </svg>

  );

}



/* ============================ PAGE ============================== */

export default function Page9({ onNavigate = () => {} }) {

  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);

  const [arrived, setArrived] = useState(false);

/* Reveal sequence (tap anywhere to skip) */

  useEffect(() => {

    window.scrollTo(0, 0);

    if (reduceMotion) {

      setStep(LAST_STEP);

      setArrived(true);

      return undefined;

    }

    const timers = STEP_TIMES.map((ms, i) => window.setTimeout(() => setStep((s) => Math.max(s, i + 1)), ms));

    timers.push(window.setTimeout(() => setArrived(true), ARRIVAL_END));

    return () => timers.forEach(window.clearTimeout);

  }, [reduceMotion]);



  const skip = () => setStep(LAST_STEP);

  const at = (n) => (step >= n ? "show" : "hidden");



  /* Particles drifting in from the top-right, where Page 8's plane flew off */

  const arrival = useMemo(() => {

    const vw = typeof window !== "undefined" ? window.innerWidth : 400;

    const vh = typeof window !== "undefined" ? window.innerHeight : 800;

    return Array.from({ length: 16 }, (_, i) => ({

      id: i,

      left: `${((i * 53 + 8) % 80) + 8}%`,

      top: `${((i * 37 + 10) % 56) + 10}%`,

      size: 10 + ((i * 7) % 14),

      glyph: i % 3 === 0 ? "♥" : "✦",

      delay: i * 0.09,

      fromX: vw * (0.35 + ((i * 17) % 30) / 100),

      fromY: -vh * (0.25 + ((i * 13) % 25) / 100),

    }));

  }, []);



  const v = useMemo(() => {

    const d = (n) => (reduceMotion ? 0 : n);

    const ease = [0.22, 1, 0.36, 1];

    return {

      fade: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: d(0.7) } } },

      rise: {

        hidden: { opacity: 0, y: 18, filter: "blur(5px)" },

        show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: d(0.9), ease } },

      },

      neon: {

        hidden: { opacity: 0 },

        show: {

          opacity: reduceMotion ? 1 : [0, 1, 0.35, 1, 0.75, 1],

          transition: { duration: d(1.5), times: [0, 0.2, 0.35, 0.55, 0.7, 1] },

        },

      },

      list: { hidden: {}, show: { transition: { staggerChildren: d(0.1) } } },

      item: { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: d(0.55), ease } } },

      drop: {

        hidden: { opacity: 0, y: -36 },

        show: { opacity: 1, y: 0, transition: { duration: d(0.9), ease: [0.34, 1.4, 0.64, 1] } },

      },

    };

  }, [reduceMotion]);



  return (

    <main className="page9" onPointerDown={skip}>

      {/* shared gradient for the little blossoms */}

      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">

        <defs>

          <radialGradient id="page9-petal" cx="50%" cy="25%" r="80%">

            <stop offset="0" stopColor="#fff0f5" /><stop offset=".6" stopColor="#ffb3cd" /><stop offset="1" stopColor="#f07aa5" />

          </radialGradient>

        </defs>

      </svg>



      {/* background artwork (+ blurred fill for wide screens) */}

      <div className="page9-fill" aria-hidden="true" />

      <div className="page9-art" aria-hidden="true">

        <span className="page9-gifttag">

          <span>Thank you</span><span>for being</span><span>You <Heart size={9} /></span>

        </span>

        <span className="page9-teddytext">Happy<br />Birthday<br />MUB</span>

      </div>



      {/* lightweight ambience */}

      <div className="page9-fx" aria-hidden="true">

        {LANTERNS.map((l) => (

          <span key={l.id} className="page9-lantern"

            style={{ "--l": l.left, "--t": l.top, "--s": l.size, "--dl": l.delay, "--d": l.duration }} />

        ))}

        {HEARTS.map((h) => (

          <span key={h.id} className="page9-heart"

            style={{ "--l": h.left, "--s": h.size, "--dl": h.delay, "--d": h.duration, "--sw": h.sway }}>♥</span>

        ))}

        {PETALS.map((p) => (

          <span key={p.id} className="page9-petal"

            style={{ "--l": p.left, "--w": p.width, "--dl": p.delay, "--d": p.duration, "--sw": p.sway }} />

        ))}

        {SPARKS.map((s) => (

          <Sparkle key={s.id} className="page9-spark"

            style={{ "--l": s.left, "--t": s.top, "--s": s.size, "--dl": s.delay, "--d": s.duration }} />

        ))}

      </div>



      {/* arrival from Page 8's flight */}

      {!arrived && !reduceMotion && (

        <>

          <div className="page9-arrival" aria-hidden="true">

            {arrival.map((p) => (

              <motion.span

                key={p.id}

                className="page9-arrival__p"

                style={{ left: p.left, top: p.top, fontSize: p.size }}

                initial={{ x: p.fromX, y: p.fromY, opacity: 0, scale: 0.4 }}

                animate={{

                  x: [p.fromX, p.fromX * 0.35, 0],

                  y: [p.fromY, p.fromY * 0.35, 0],

                  opacity: [0, 1, 0],

                  scale: [0.4, 1.1, 0.7],

                }}

                transition={{ duration: 2.8, delay: p.delay, ease: "easeOut", times: [0, 0.55, 1] }}

              >

                {p.glyph}

              </motion.span>

            ))}

          </div>

          <motion.div

            className="page9-flash"

            aria-hidden="true"

            initial={{ opacity: 1 }}

            animate={{ opacity: 0 }}

            transition={{ duration: 1.8, delay: 0.15, ease: "easeOut" }}

          />

        </>

      )}



      {/* ====================== UI layer ====================== */}

      <div className="page9-ui">

        {/* compact wooden navigation menu */}

        <div className="page9-left">

          <nav aria-label="Pages">

            <motion.ul className="page9-menu" variants={v.list} initial="hidden" animate={at(2)}>

              {MENU.map(({ label, icon: Icon, target }) => (

                <motion.li key={label} variants={v.item}>

                  <motion.button

                    type="button"

                    className="page9-plank"

                    onClick={() => onNavigate(target)}

                    whileHover={reduceMotion ? undefined : { x: 4 }}

                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}

                  >

                    <Icon aria-hidden="true" />

                    <span>{label}</span>

                  </motion.button>

                </motion.li>

              ))}

            </motion.ul>

          </nav>

        </div>



        {/* heading, message, divider */}

        <div className="page9-center">

          <motion.h1

            className="page9-title"

            aria-label="Once Again, Happy Birthday My Love Mubb"

            variants={v.neon}

            initial="hidden"

            animate={at(3)}

          >

            <span className="page9-title__once" aria-hidden="true">Once Again</span>
            <span className="page9-title__hb" aria-hidden="true">Happy Birthday</span>

            <span className="page9-title__ml" aria-hidden="true">My Love</span>

            <svg className="page9-neonheart" viewBox="0 0 64 60" aria-hidden="true">

              <path d="M32 54 C10 38 4 24 8 15 C12 6 24 5 32 16 C40 5 52 6 56 15 C60 24 54 38 32 54Z" />

              <path d="M54 44 L54 54 M49 49 L59 49" />

            </svg>

            <span className="page9-title__mub" aria-hidden="true">Mubb</span>

            <Heart className="page9-title__hfill" fill="currentColor" aria-hidden="true" />

          </motion.h1>



          <motion.div className="page9-copy" variants={v.rise} initial="hidden" animate={at(4)}>

            <p>Today is a reminder of how special, amazing and beautiful you are…</p>

            <p>Thank you for being the most wonderful part of my life. <Heart size={14} /></p>

          </motion.div>



          <motion.div className="page9-div" aria-hidden="true" variants={v.fade} initial="hidden" animate={at(5)}>

            <i />

            <span className="page9-div__ring"><Heart size={13} /></span>

            <i />

          </motion.div>

        </div>



        {/* handwritten notes on the right */}

        <motion.div className="page9-note page9-note--1" variants={v.rise} initial="hidden" animate={at(5)} aria-hidden="true">

          <span>You</span><span>Make My</span><span>World</span><span>Brighter <Heart size={13} /></span>

        </motion.div>

        <motion.div className="page9-note page9-note--2" variants={v.rise} initial="hidden" animate={at(5)} aria-hidden="true">

          <span>Always You</span><span>Always Us</span><span>Always <Heart size={13} /></span>

        </motion.div>



        {/* button + footer */}

        <div className="page9-ctawrap">

          <motion.button

            type="button"

            className="page9-cta"

            onClick={() => onNavigate(RESTART_PAGE)}

            variants={v.rise}

            initial="hidden"

            animate={at(6)}

            whileHover={reduceMotion ? undefined : { scale: 1.03 }}

            whileTap={reduceMotion ? undefined : { scale: 0.97 }}

          >

            <span className="page9-cta__flowers page9-cta__flowers--l" aria-hidden="true">

              <Blossom /><Blossom /><Blossom />

            </span>

            <span className="page9-cta__flowers page9-cta__flowers--r" aria-hidden="true">

              <Blossom /><Blossom /><Blossom />

            </span>

            <RotateCw className="page9-cta__icon" aria-hidden="true" />

            <span className="page9-cta__label">Experience It Again</span>

            <ArrowRight className="page9-cta__arrow" aria-hidden="true" />

          </motion.button>

        </div>



        <motion.div className="page9-foot" variants={v.fade} initial="hidden" animate={at(6)}>

          <div className="page9-div page9-div--foot" aria-hidden="true">

            <i />

            <span className="page9-div__ring"><Heart size={12} /></span>

            <i />

          </div>

          <p>Because one celebration is never enough… <Heart size={14} /></p>

        </motion.div>

      </div>

    </main>

  );

}