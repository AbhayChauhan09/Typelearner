import React, { useEffect, useState, useRef, useCallback } from "react";
import s1 from "/start1.mp3";
import s2 from "/start2.mp3";
import c1 from "/crash1.mp3";
import c2 from "/crash2.mp3";
import finish from "/win.mp3";
import running from "/carsound.mp3";

// ─── Paragraphs pool – one chosen randomly each restart ──────────────────────
const PARAGRAPHS = [
  "Adrenaline pumped through his veins as he heard the engine roar behind him.",
  "She sprinted across the rooftop, her heart hammering with every desperate step.",
  "The narrow alley blurred past as he pushed his legs to their absolute limit.",
  "Rain lashed the cobblestones as she dashed through the labyrinth of dark streets.",
  "Every second mattered now; the siren grew louder and his lungs began to burn.",
  "He leapt over the fence and kept running, refusing to let exhaustion win tonight.",
  "The crowd parted and she burst through, gasping, not daring to look back at all.",
];

// ─── Web Audio Engine ─────────────────────────────────────────────────────────
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.loopSource = null;
    this.loopGain = null;
  }
  unlock() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === "suspended") this.ctx.resume();
  }
  async load(key, url) {
    const res = await fetch(url);
    const ab = await res.arrayBuffer();
    this.buffers[key] = await this.ctx.decodeAudioData(ab);
  }
  play(key, volume = 1.0) {
    const buf = this.buffers[key];
    if (!buf || !this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain).connect(this.ctx.destination);
    src.start(0);
  }
  startLoop(key, volume = 0.7) {
    this.stopLoop();
    const buf = this.buffers[key];
    if (!buf || !this.ctx) return;
    this.loopSource = this.ctx.createBufferSource();
    this.loopSource.buffer = buf;
    this.loopSource.loop = true;
    this.loopGain = this.ctx.createGain();
    this.loopGain.gain.value = volume;
    this.loopSource.connect(this.loopGain).connect(this.ctx.destination);
    this.loopSource.start(0);
  }
  stopLoop() {
    if (this.loopSource && this.ctx) {
      this.loopGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.loopSource.stop(this.ctx.currentTime + 0.15);
      this.loopSource = null;
      this.loopGain = null;
    }
  }
}

const engine = new AudioEngine();

// ─── Confetti particle ────────────────────────────────────────────────────────
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => i);
  const colors = ["#ff595e","#ffca3a","#6a4c93","#1982c4","#8ac926","#ff924c","#ffffff"];
  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((i) => {
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 2 + Math.random() * 2;
        const size = 8 + Math.random() * 10;
        const rotate = Math.random() * 720;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "-20px",
              width: size,
              height: size * 0.55,
              background: color,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
              animation: `fall ${duration}s ${delay}s ease-in forwards`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-container {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999; overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// ─── Win celebration overlay ──────────────────────────────────────────────────
function WinOverlay({ wpm, accuracy, onRestart }) {
  return (
    <>
      <Confetti />
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(4,5,11,0.88)",
          backdropFilter: "blur(6px)",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
          @keyframes bounce { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-18px) scale(1.08);} }
          @keyframes shimmer {
            0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
          }
        `}</style>
        <div style={{ fontSize: "6rem", animation: "bounce 1s infinite" }}>🏆</div>
        <div style={{
          fontSize: "3.2rem", fontWeight: 900, letterSpacing: "0.05em",
          background: "linear-gradient(90deg,#ffd700,#ff8c00,#ffd700)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "shimmer 2s linear infinite",
          marginTop: "0.5rem",
        }}>
          WELL DONE, CHAMPION!
        </div>
        <div style={{ color: "#aaa", fontSize: "1.2rem", marginTop: "0.5rem", letterSpacing: "0.15em" }}>
          YOU ESCAPED THE PURSUIT
        </div>
        <div style={{
          display: "flex", gap: "2.5rem", marginTop: "2rem",
          background: "#121324", borderRadius: "1.2rem",
          padding: "1rem 2.5rem", border: "1px solid #2a2a4a",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#a78bfa", fontSize: "0.85rem", letterSpacing: "0.12em" }}>WPM</div>
            <div style={{ color: "#fff", fontSize: "2.2rem", fontWeight: 800 }}>{wpm}</div>
          </div>
          <div style={{ width: 1, background: "#2a2a4a" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#a78bfa", fontSize: "0.85rem", letterSpacing: "0.12em" }}>ACCURACY</div>
            <div style={{ color: "#fff", fontSize: "2.2rem", fontWeight: 800 }}>{accuracy}%</div>
          </div>
        </div>
        <button
          onClick={onRestart}
          style={{
            marginTop: "2rem", padding: "1rem 3rem",
            borderRadius: "9999px", border: "none",
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            color: "#fff", fontSize: "1.4rem", fontWeight: 800,
            cursor: "pointer", letterSpacing: "0.08em",
            boxShadow: "0 0 30px rgba(168,85,247,0.4)",
            transition: "transform 0.15s",
          }}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        >
          PLAY AGAIN
      
        </button>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function EscapeGame() {
  const [typedText, setTypedText]   = useState("");
  const [status, setStatus]         = useState("idle");
  const [difficulty, setDifficulty] = useState("easy");
  const [carPos, setCarPos]         = useState(0);
  const [runnerPos, setRunnerPos]   = useState(8);
  const [wpm, setWpm]               = useState(0);
  const [accuracy, setAccuracy]     = useState(100);
  const [audioReady, setAudioReady] = useState(false);
  const [paragraph, setParagraph]   = useState(PARAGRAPHS[0]);

  const startTimeRef = useRef(null);

  const loadAudio = useCallback(async () => {
    await Promise.all([
      engine.load("start1",  s1),
      engine.load("start2",  s2),
      engine.load("crash1",  c1),
      engine.load("crash2",  c2),
      engine.load("finish",  finish),
      engine.load("running", running),
    ]);
    setAudioReady(true);
  }, []);

  const getSpeed = () => {
    if (difficulty === "easy")   return 0.10;
    if (difficulty === "medium") return 0.28;
    return 0.52;
  };

  // Car loop — only triggers crash if car actually catches runner
  useEffect(() => {
    let timer;
    if (status === "playing") {
      timer = setInterval(() => {
        setCarPos((prev) => {
          const newPos = prev + getSpeed();
          if (newPos >= runnerPos) {
            engine.stopLoop();
            engine.play("crash1");
            engine.play("crash2");
            setStatus("lost");
            return runnerPos;
          }
          return newPos;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [status, runnerPos, difficulty]);

  // Runner only advances on CORRECT characters typed
  useEffect(() => {
    if (status !== "playing") return;

    const target = paragraph;

    // Count correct prefix length
    let correctCount = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === target[i]) correctCount++;
      else break; // stop at first error — only correct sequential chars move runner
    }

    // Runner moves based on correct prefix
    const progress = (correctCount / target.length) * 78;
    setRunnerPos(8 + progress);

    // Stats
    const errors = typedText.split("").filter((c, i) => c !== target[i]).length;
    setAccuracy(
      typedText.length > 0
        ? Math.round(((typedText.length - errors) / typedText.length) * 100)
        : 100
    );
    const timeElapsed = (Date.now() - startTimeRef.current) / 60000;
    setWpm(timeElapsed > 0 ? Math.round(typedText.length / 5 / timeElapsed) : 0);

    if (typedText === target) {
      setStatus("won");
      engine.stopLoop();
      engine.play("finish");
    }
  }, [typedText, status, paragraph]);

  const pickParagraph = () => {
    const choices = PARAGRAPHS.filter(p => p !== paragraph);
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const handleStart = async () => {
    engine.unlock();
    if (!audioReady) await loadAudio();

    const newPara = pickParagraph();
    setParagraph(newPara);

    engine.play("start1");
    engine.play("start2");

    setTypedText("");
    setCarPos(0);
    setRunnerPos(8);
    setStatus("playing");
    setWpm(0);
    setAccuracy(100);
    startTimeRef.current = Date.now();

    engine.startLoop("running");
    setTimeout(() => document.getElementById("hiddenInput")?.focus(), 50);
  };

  const handleRestart = () => {
    engine.stopLoop();
    setStatus("idle");
    setTypedText("");
    setCarPos(0);
    setRunnerPos(8);
    setWpm(0);
    setAccuracy(100);
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "linear-gradient(160deg,#04050b 0%,#0b0d1f 60%,#04050b 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "'Segoe UI', sans-serif",
      color: "#fff", position: "relative",
    }}>

      {/* Win overlay */}
      {status === "won" && (
        <WinOverlay wpm={wpm} accuracy={accuracy} onRestart={handleStart} />
      )}

      {/* Top bar: Restart (left) + Title (center) + Difficulty (right) */}
      <div style={{
        width: "100%", maxWidth: 1000,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: "1.5rem",
      }}>
        {/* Restart button */}
        <button
          onClick={handleRestart}
          disabled={status === "idle"}
          style={{
            padding: "0.6rem 1.6rem", borderRadius: "9999px",
            border: "1.5px solid #374151",
            background: status === "idle" ? "#1a1a2e" : "#1e1b4b",
            color: status === "idle" ? "#555" : "#a78bfa",
            fontSize: "1rem", fontWeight: 700, cursor: status === "idle" ? "default" : "pointer",
            letterSpacing: "0.08em", transition: "all 0.2s",
          }}
          onMouseOver={e => status !== "idle" && (e.currentTarget.style.background = "#2d2870")}
          onMouseOut={e => e.currentTarget.style.background = status === "idle" ? "#1a1a2e" : "#1e1b4b"}
        >
          ↺ RESTART
        </button>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: "1.9rem", fontWeight: 900, letterSpacing: "0.25em",
            background: "linear-gradient(90deg,#a78bfa,#7c3aed,#a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>TYPE ESCAPE</div>
          <div style={{ color: "#4b5563", fontSize: "0.78rem", letterSpacing: "0.2em" }}>OUTRUN THE PURSUIT</div>
        </div>

        {/* Difficulty */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["easy", "medium", "hard"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficulty(lvl)}
              style={{
                padding: "0.5rem 1.1rem", borderRadius: "9999px",
                border: difficulty === lvl ? "1.5px solid #7c3aed" : "1.5px solid #2d2d2d",
                background: difficulty === lvl ? "#4c1d95" : "#111",
                color: difficulty === lvl ? "#e9d5ff" : "#6b7280",
                fontSize: "0.78rem", fontWeight: 700, cursor: "pointer",
                letterSpacing: "0.1em", transition: "all 0.2s",
              }}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex", gap: "3rem",
        background: "#0d0e22", border: "1px solid #1e1e3f",
        borderRadius: "1rem", padding: "0.9rem 3rem",
        marginBottom: "1.5rem",
      }}>
        {[["WPM", wpm], ["ACCURACY", `${accuracy}%`]].map(([label, val]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ color: "#a78bfa", fontSize: "0.75rem", letterSpacing: "0.15em" }}>{label}</div>
            <div style={{ color: "#fff", fontSize: "1.9rem", fontWeight: 800 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Race track */}
      <div style={{
        width: "100%", maxWidth: 1000, height: 110,
        background: "#0d0e22", borderRadius: "1.2rem",
        border: "1px solid #1e1e3f", position: "relative",
        marginBottom: "1.5rem", overflow: "hidden",
      }}>
        {/* Road lines */}
        {[20, 40, 60, 80].map(p => (
          <div key={p} style={{
            position: "absolute", left: `${p}%`, top: "48%",
            width: 32, height: 5, background: "#1e2040", borderRadius: 3,
          }} />
        ))}
        {/* Finish line */}
        <div style={{
          position: "absolute", right: "8%", top: 0,
          height: "100%", width: 5,
          background: "repeating-linear-gradient(to bottom,#f59e0b 0px,#f59e0b 10px,#1a1a1a 10px,#1a1a1a 20px)",
        }} />
        <div style={{
          position: "absolute", right: "8%", bottom: 6,
          transform: "translateX(50%)",
          fontSize: "0.65rem", color: "#f59e0b", fontWeight: 700, letterSpacing: "0.1em",
        }}>FINISH</div>

        {/* Police car */}
        <div style={{
          position: "absolute", top: "50%",
          transform: "translateY(-50%)",
          left: `${carPos}%`,
          fontSize: "3rem", transition: "left 50ms linear",
          filter: "drop-shadow(0 0 8px rgba(96,165,250,0.5))",
        }}>🚓</div>

        {/* Runner — scaleX(-1) flips emoji to face RIGHT toward finish */}
        <div style={{
          position: "absolute", top: "50%",
          transform: "translateY(-50%) scaleX(-1)",
          left: `${runnerPos}%`,
          fontSize: "3rem", transition: "left 80ms ease-out",
        }}>
          {status === "lost" ? "💥" : "🏃"}
        </div>
      </div>

      {/* Typing area */}
      <div
        style={{
          width: "100%", maxWidth: 1000,
          background: "#080914", padding: "2.5rem 3rem",
          borderRadius: "1.5rem", border: "1px solid #1a1a3a",
          position: "relative", cursor: "text",
          boxShadow: "0 8px 60px rgba(0,0,0,0.5)",
        }}
        onClick={() => document.getElementById("hiddenInput")?.focus()}
      >
        <p style={{ fontSize: "1.55rem", lineHeight: 1.8, margin: 0, letterSpacing: "0.02em" }}>
          {paragraph.split("").map((char, i) => {
            let color = "#374151";
            if (i < typedText.length) {
              color = typedText[i] === char ? "#4ade80" : "#f87171";
            }
            // Cursor blinking at current position
            const isCursor = i === typedText.length && status === "playing";
            return (
              <span key={i} style={{
                color,
                borderLeft: isCursor ? "2px solid #a78bfa" : "none",
                animation: isCursor ? "blink 1s step-end infinite" : "none",
                transition: "color 0.08s",
              }}>
                {char}
              </span>
            );
          })}
        </p>
        <input
          id="hiddenInput"
          type="text"
          value={typedText}
          onChange={(e) => status === "playing" && setTypedText(e.target.value)}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          autoFocus
        />

        {/* Idle / Lost overlay */}
        {status !== "playing" && status !== "won" && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(4,5,11,0.85)",
            borderRadius: "1.5rem",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            zIndex: 20, gap: "1rem",
            backdropFilter: "blur(3px)",
          }}>
            {status === "lost" && (
              <>
                <div style={{ fontSize: "3.5rem" }}>💥</div>
                <div style={{ color: "#f87171", fontSize: "2rem", fontWeight: 900, letterSpacing: "0.1em" }}>
                  CAUGHT!
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>Better luck next time</div>
              </>
            )}
            <button
              onClick={handleStart}
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                padding: "1.1rem 3.5rem", borderRadius: "9999px",
                border: "none", color: "#fff",
                fontSize: "1.4rem", fontWeight: 800,
                cursor: "pointer", letterSpacing: "0.1em",
                boxShadow: "0 0 40px rgba(168,85,247,0.35)",
                transition: "transform 0.15s",
              }}
              onMouseOver={e => e.currentTarget.style.transform = "scale(1.06)"}
              onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {status === "idle" ? "⚡ INITIALIZE RUN" : "⚡ TRY AGAIN"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}

export default EscapeGame;
