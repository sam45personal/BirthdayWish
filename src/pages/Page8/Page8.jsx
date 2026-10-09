import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Mail, Send, Sparkles, Stars } from "lucide-react";
import "./Page8.css";

// TEMPORARY DIRECT-TO-RESEND SETUP FOR A ONE-DAY DEMO.
// IMPORTANT: a key in frontend code is public to anyone who opens DevTools.
// Replace these placeholders before running. Use a restricted/test key if available.
const RESEND_API_KEY = "PASTE_YOUR_RESEND_API_KEY_HERE";
const RESEND_FROM_EMAIL = "Your Name <onboarding@resend.dev>";
const RESEND_RECIPIENT_EMAIL = "YOUR_RECIPIENT_EMAIL@example.com";
const RESEND_API_URL = "https://api.resend.com/emails";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));

const initialQuestionText = {
  first: "Miss Universe… do you love me?",
  second: "Really? 🥹 You mean it?",
};

export default function Page8({ onNavigate }) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState("welcome");
  const [noCount, setNoCount] = useState(0);
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [mood, setMood] = useState("Loved");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");
  const [showNoNote, setShowNoNote] = useState(false);

  useEffect(() => {
    if (stage !== "welcome") return undefined;
    const timer = window.setTimeout(() => setStage("welcome-ready"), reduceMotion ? 0 : 1800);
    return () => window.clearTimeout(timer);
  }, [stage, reduceMotion]);

  const handleNo = () => {
    setNoCount((count) => count + 1);
    setShowNoNote(true);
  };

  const handleYes = () => {
    setShowNoNote(false);
    if (stage === "question-one") {
      setStage("question-two");
    } else {
      setStage("letter");
    }
  };

  const sendLetter = async (event) => {
    event.preventDefault();
    setSendStatus("");

    if (!message.trim()) {
      setSendStatus("Write a little something from your heart first. ♥");
      return;
    }

    if (
      RESEND_API_KEY === "PASTE_YOUR_RESEND_API_KEY_HERE" ||
      RESEND_RECIPIENT_EMAIL === "YOUR_RECIPIENT_EMAIL@example.com"
    ) {
      setSendStatus("Add your Resend API key and recipient email at the top of Page8.jsx first.");
      return;
    }

    setSending(true);
    try {
      const name = senderName.trim() || "Your Miss Universe";
      const sentAt = new Date();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const safeName = escapeHtml(name);
      const safeMood = escapeHtml(mood);
      const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");
      const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM_EMAIL,
          to: [RESEND_RECIPIENT_EMAIL],
          subject: `A letter from ${name} 💌`,
          text: `A Letter From Your Heart\n\nFrom: ${name}\nMood: ${mood}\nSent: ${sentAt.toLocaleString()} (${timezone})\n\n${message.trim()}`,
          html: `<div style="font-family:Georgia,serif;max-width:640px;margin:auto;padding:28px;color:#52233d;background:#fff7fb;border:1px solid #f4c6dc;border-radius:16px"><p style="color:#c04482;letter-spacing:2px">A LETTER FROM YOUR HEART ♥</p><h2 style="font-weight:normal">A little message from ${safeName}</h2><p><b>Mood:</b> ${safeMood}</p><div style="white-space:normal;line-height:1.8;font-size:17px">${safeMessage}</div><hr style="border:0;border-top:1px solid #f0c6db;margin:24px 0"><small>Sent ${escapeHtml(sentAt.toLocaleString())} (${escapeHtml(timezone)})</small></div>`,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.message || result?.error?.message || "Resend rejected the request.");
      }

      // Only show the success animation after Resend confirms the email was accepted.
      setStage("sent");
    } catch (error) {
      console.error("Resend email error:", error);
      setSendStatus(
        "The letter couldn't be sent. Check your Resend sender/domain setup and browser console; direct browser requests may also be blocked by CORS."
      );
    } finally {
      setSending(false);
    }
  };

  const goBackToQuestion = () => {
    setStage("question-one");
    setNoCount(0);
    setShowNoNote(false);
  };

  return (
    <main className={`page8 page8--${stage}`} aria-live="polite">
      <div className="page8__ambient" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <motion.span
            key={index}
            className="page8__sparkle"
            style={{
              left: `${(index * 37 + 7) % 100}%`,
              top: `${(index * 53 + 9) % 100}%`,
              "--sparkle-delay": `${(index % 8) * 0.35}s`,
            }}
            animate={reduceMotion ? {} : { opacity: [0.15, 0.9, 0.2], scale: [0.7, 1.25, 0.7] }}
            transition={{ duration: 2.7 + (index % 4) * 0.45, repeat: Infinity, delay: (index % 8) * 0.2 }}
          />
        ))}
      </div>

      <div className="page8__topbar">
        <button className="page8__pill" type="button" onClick={() => onNavigate?.("Page7")}>
          <span aria-hidden="true">←</span> Back to Our Universe
        </button>
        <span className="page8__chapter"><Stars size={14} /> A LITTLE PIECE OF MY HEART</span>
      </div>

      <AnimatePresence mode="wait">
        {(stage === "welcome" || stage === "welcome-ready") && (
          <motion.section
            key="welcome"
            className="page8__scene page8__scene--welcome"
            initial={{ opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
          >
            <div className="page8__glass page8__welcome-card">
              <motion.div
                className="page8__eyebrow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: stage === "welcome-ready" ? 1 : 0.65, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Sparkles size={15} /> JUST FOR YOU
              </motion.div>
              <motion.h1
                className="page8__script page8__welcome-title"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 1, delay: 0.2 }}
              >
                <span>Now, Miss Universe…</span>
                <span>It’s Your Turn <Heart className="page8__inline-heart" fill="currentColor" /></span>
              </motion.h1>
              <motion.p
                className="page8__welcome-copy"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: stage === "welcome-ready" ? 1 : 0, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                I've made these little surprises for you. Now I want to hear what's in your heart.
                Take your time—every word you write matters to me.
              </motion.p>
              <div className="page8__ornament" aria-hidden="true"><span />♡<span /></div>
              <motion.button
                className="page8__primary"
                type="button"
                disabled={stage !== "welcome-ready"}
                onClick={() => { setShowNoNote(false); setStage("question-one"); }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: stage === "welcome-ready" ? 1 : 0, y: 0 }}
                transition={{ duration: 0.65 }}
              >
                Continue <ArrowRight size={18} />
              </motion.button>
            </div>
          </motion.section>
        )}

        {(stage === "question-one" || stage === "question-two") && (
          <motion.section
            key={stage}
            className="page8__scene page8__scene--question"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.55 }}
          >
            <div className="page8__question-card page8__glass">
              <motion.div
                className="page8__big-heart"
                animate={reduceMotion ? {} : { scale: [1, 1.07, 1], filter: ["drop-shadow(0 0 12px #ff4f9d)", "drop-shadow(0 0 26px #ff8bc4)", "drop-shadow(0 0 12px #ff4f9d)"] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart fill="currentColor" strokeWidth={1.2} />
              </motion.div>
              <p className="page8__eyebrow">ONE LITTLE QUESTION</p>
              <h2 className="page8__script page8__question-title">
                {stage === "question-one" ? initialQuestionText.first : initialQuestionText.second}
              </h2>
              <p className="page8__question-subtitle">
                {stage === "question-one" ? "Tell me honestly, my love…" : "My heart wants to hear it one more time. ♥"}
              </p>
              <div className="page8__choices">
                <button type="button" className="page8__primary page8__choice-yes" onClick={handleYes}>
                  <Heart size={17} fill="currentColor" /> Yes
                </button>
                <button type="button" className="page8__secondary page8__choice-no" onClick={handleNo}>
                  No <span aria-hidden="true">🙈</span>
                </button>
              </div>
              <AnimatePresence>
                {showNoNote && (
                  <motion.p
                    className="page8__no-note"
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {noCount === 1 ? "Awww, please say yes 🥺♥" : noCount === 2 ? "I'll be right here whenever you're ready 💗" : "No rush, my love. Choose whenever you feel ready. ♥"}
                  </motion.p>
                )}
              </AnimatePresence>
              <button className="page8__text-back" type="button" onClick={() => setStage("welcome-ready")}>Back to my note</button>
            </div>
          </motion.section>
        )}

        {stage === "letter" && (
          <motion.section
            key="letter"
            className="page8__scene page8__scene--letter"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
          >
            <form className="page8__letter-layout" onSubmit={sendLetter}>
              <div className="page8__letter-intro">
                <p className="page8__eyebrow"><Mail size={14} /> A LETTER FROM YOUR HEART</p>
                <h2 className="page8__script">Now tell me what’s in your heart…</h2>
                <p>You can share anything—your feelings, your favourite moment, what made you smile, or simply your thoughts. I’ll treasure every word.</p>
              </div>

              <div className="page8__paper">
                <div className="page8__paper-top"><span>To someone who adores you</span><Heart size={17} fill="currentColor" /></div>
                <label className="page8__field-label" htmlFor="page8-name">Your name (optional)</label>
                <input
                  id="page8-name"
                  className="page8__name-input"
                  type="text"
                  maxLength={80}
                  placeholder="What should I call you?"
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                />
                <label className="page8__field-label" htmlFor="page8-mood">How are you feeling?</label>
                <select id="page8-mood" className="page8__mood-select" value={mood} onChange={(event) => setMood(event.target.value)}>
                  <option>Happy</option>
                  <option>Loved</option>
                  <option>Shy</option>
                  <option>Emotional</option>
                  <option>Speechless</option>
                  <option>All of the above</option>
                </select>
                <label className="page8__field-label" htmlFor="page8-message">Your letter</label>
                <textarea
                  id="page8-message"
                  className="page8__message-input"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="My favourite part was…&#10;What I felt when…&#10;Something I want you to know…"
                  minLength={2}
                  maxLength={5000}
                  required
                />
                <div className="page8__paper-footer">
                  <span>{message.length}/5000 characters</span>
                  <span>Written with love <Heart size={13} fill="currentColor" /></span>
                </div>
              </div>

              {sendStatus && <p className="page8__status" role="status">{sendStatus}</p>}
              <div className="page8__letter-actions">
                <button type="button" className="page8__secondary" onClick={goBackToQuestion}>Back</button>
                <button type="submit" className="page8__primary page8__send" disabled={sending}>
                  {sending ? "Sending your heart…" : "Send My Heart"} <Send size={17} />
                </button>
              </div>
              <p className="page8__privacy-note">Your message is sent only after you press Send My Heart.</p>
            </form>
          </motion.section>
        )}

        {stage === "sent" && (
          <motion.section
            key="sent"
            className="page8__scene page8__scene--sent"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, type: "spring", damping: 16 }}
          >
            <div className="page8__glass page8__sent-card">
              <div className="page8__envelope-scene" aria-hidden="true">
                {!reduceMotion && [0, 1, 2, 3, 4, 5].map((heart) => (
                  <motion.span
                    key={heart}
                    className={`page8__floating-heart page8__floating-heart--${heart + 1}`}
                    initial={{ opacity: 0, y: 24, scale: 0.5 }}
                    animate={{ opacity: [0, 0.95, 0], y: -100 - (heart % 3) * 22, x: (heart % 2 ? 1 : -1) * (12 + heart * 3), scale: [0.5, 1, 0.7] }}
                    transition={{ duration: 2.8 + (heart % 3) * 0.3, delay: heart * 0.18, repeat: Infinity, repeatDelay: 0.3 }}
                  >♥</motion.span>
                ))}
                <motion.div
                  className="page8__envelope"
                  initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.86, rotate: -5 }}
                  animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring", damping: 13 }}
                >
                  <motion.div
                    className="page8__envelope-flap"
                    initial={reduceMotion ? false : { rotateX: 0 }}
                    animate={reduceMotion ? {} : { rotateX: -180 }}
                    transition={{ delay: 0.45, duration: 0.8, ease: "easeInOut" }}
                  />
                  <div className="page8__envelope-letter"><Heart fill="currentColor" /></div>
                  <div className="page8__envelope-front"><Heart fill="currentColor" /></div>
                </motion.div>
              </div>
              <h2 className="page8__script">Your words are on their way…</h2>
              <p>Your words are on their way to someone who will treasure every one of them. ♥</p>
              <button type="button" className="page8__primary" onClick={() => onNavigate?.("Page7")}>Back to Our Universe <ArrowRight size={17} /></button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
