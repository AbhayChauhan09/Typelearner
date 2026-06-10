import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson4.2.png";

const paragraph = `
to ot tt oo to to toot oto a fast lad falls to the safe lake side area as jared asks for a free salad file for julie. eli said it is fine if all kids use real skill rules to reduce layout errors regularly. a skilled leader guides users to look at lines as julie records a full test session on a safe disk field. jared feels glad to see a red leaf fall after a regular drill session near the sea side area. all kids said yes to easier lessons as a fair leader raises skill levels to real results. a free user reads a rule file data as jared leads a repeated track sequence. focus is vital to utilize true finger rules across home rows regularly. a skilled lad said he shall lead all kids to a small skill session after dark. julie raised her skill level after repeated drills on a lake side field. real success requires safe finger use and intense focus as eli assists jared and julie to feel sure. all users feel ready for faster lessons after regular skill drills are used daily.
`.trim();

export default function Lesson4_3() {
  const navigate = useNavigate();

  // State Management
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [wrongKeyLog, setWrongKeyLog] = useState("");

  const [letterStates, setLetterStates] = useState(new Array(paragraph.length).fill("untyped"));

  const mainDivRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const activeLetterRef = useRef(null);

  useEffect(() => {
    if (mainDivRef.current) {
      mainDivRef.current.focus();
    }
  }, []);

  /* FIXED OPTIMIZED AUTO-SCROLL ENGINE */
  useEffect(() => {
    if (activeLetterRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const el = activeLetterRef.current;

      const elTop = el.offsetTop;
      const elHeight = el.offsetHeight;
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      if (elTop + elHeight > containerTop + containerHeight - 40 || elTop < containerTop + 20) {
        container.scrollTo({
          top: elTop - containerHeight / 2 + elHeight / 2,
          behavior: "smooth"
        });
      }
    }
  }, [typed]);

  /* TIMER LOGIC */
  useEffect(() => {
    if (!startTime || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setShowPopup(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, gameOver]);

  /* WPM CALCULATION */
  useEffect(() => {
    if (startTime && !gameOver) {
      const timeElapsedMinutes = (120 - timeLeft) / 60;
      if (timeElapsedMinutes > 0) {
        setWpm(Math.round(correctCount / 5 / timeElapsedMinutes));
      }
    }
  }, [startTime, timeLeft, correctCount, gameOver]);

  const handleKeyDown = (e) => {
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        navigate("/lessons");
      }
      return;
    }

    if (gameOver) return;

    const key = e.key;
    const currentIndex = typed.length;

    if (!startTime && (key.length === 1 || key === " ")) {
      setStartTime(Date.now());
    }

    /* BACKSPACE HANDLER */
    if (key === "Backspace") {
      e.preventDefault();
      if (currentIndex > 0) {
        const deletedIndex = currentIndex - 1;
        
        if (letterStates[deletedIndex] === "correct") {
          setCorrectCount((prev) => Math.max(0, prev - 1));
        } else if (letterStates[deletedIndex] === "wrong") {
          setWrongCount((prev) => Math.max(0, prev - 1));
        }

        setLetterStates((prev) => {
          const updated = [...prev];
          updated[deletedIndex] = "untyped";
          return updated;
        });

        setWrongKeyLog("");
        setTyped((prev) => prev.slice(0, -1));
      }
      return;
    }

    /* INPUT DISPATCHER */
    if (key.length === 1 || key === " ") {
      e.preventDefault();

      if (currentIndex >= paragraph.length) return;

      const expectedChar = paragraph[currentIndex];
      const typedChar = key; 

      const isCorrect = typedChar === expectedChar;
      
      setLetterStates((prev) => {
        const updated = [...prev];
        updated[currentIndex] = isCorrect ? "correct" : "wrong";
        return updated;
      });

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
        setWrongKeyLog("");
      } else {
        setWrongCount((prev) => prev + 1);
        
        let displayInstruction = typedChar === " " ? "SPACE" : typedChar;

        if (
          typedChar !== " " && 
          expectedChar !== " " && 
          typedChar === typedChar.toUpperCase() && 
          expectedChar === expectedChar.toLowerCase()
        ) {
          displayInstruction = "YOU TYPED IN CAPITAL LETTERS";
        }
        setWrongKeyLog(displayInstruction);
      }

      const updatedTyped = typed + typedChar;
      setTyped(updatedTyped);

      if (updatedTyped.length === paragraph.length) {
        setGameOver(true);
        setShowPopup(true);
      }
    }
  };

  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((correctCount / totalAttempts) * 100);

  const nextTargetChar = paragraph[typed.length]?.toUpperCase();
  const topKeys = ["A", "S", "D", "F", "J", "K", "L", ";", "E", "R", "T", "U", "I", "O"];

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={mainDivRef}
      className="min-h-screen w-full text-white flex flex-col outline-none px-8 pb-8 select-none relative overflow-x-hidden font-sans app-cyber-container"
    >
      {/* GLOBAL BACKGROUND INJECTION RULES */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Forced Base Canvas Background Override */
        .app-cyber-container {
          background-color: #050614 !important;
          position: relative;
        }

        /* Pure CSS Grid Overlay Bypassing Tailwind Configuration */
        .app-cyber-container::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(30, 41, 59, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 41, 59, 0.2) 1px, transparent 1px);
          background-size: 4rem 4rem;
          mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%);
          pointer-events: none;
          z-index: 1;
        }

        /* Ambient Cosmic Auras */
        .cyber-orb-left {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 50vw;
          height: 50vh;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }

        .cyber-orb-right {
          position: absolute;
          bottom: -10%;
          right: -10%;
          width: 50vw;
          height: 50vh;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }

        /* Scrollbar Core overrides */
        .forced-purple-scroll::-webkit-scrollbar {
          width: 6px !important;
        }
        .forced-purple-scroll::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .forced-purple-scroll::-webkit-scrollbar-thumb {
          background-color: #a855f7 !important;
          border-radius: 20px !important;
          box-shadow: 0 0 10px #a855f7;
        }
        .forced-purple-scroll {
          scrollbar-width: thin !important;
          scrollbar-color: #a855f7 transparent !important;
        }
        
        /* Fallback for components in environments with outdated backdrop-blur specs */
        .glass-panel-fallback {
          background-color: rgba(13, 14, 38, 0.75) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
      `}} />

      {/* Render Dynamic Background Components */}
      <div className="cyber-orb-left" />
      <div className="cyber-orb-right" />

      {/* Header Bar */}
      <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center mb-6 mt-6 relative z-10">
        <button
          onClick={() => navigate("/lessons")}
          className="px-5 py-2.5 glass-panel-fallback rounded-xl text-sm hover:bg-[#16173a]/90 transition-all duration-300 flex items-center gap-2 font-medium text-gray-300 tracking-wide shadow-lg"
        >
          <span className="text-purple-400">←</span> Back to Lessons
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-wider text-center w-full max-w-[1400px] mx-auto mb-12 relative z-10 text-white drop-shadow-md">
        Lesson 4.3 Practice
      </h1>

      {/* Grid Layout Matrix */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-[200px_1fr_260px] gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: STATS */}
        <div className="flex flex-col gap-5">
          {[
            { label: "Time Left", value: `${timeLeft}s`, color: "text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
            { label: "Accuracy", value: `${accuracy}%`, color: "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" },
            { label: "WPM", value: wpm, color: "text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" }
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel-fallback rounded-2xl p-6 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-white/20">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-gray-400 text-xs mb-2 font-semibold tracking-widest uppercase text-center">{stat.label}</p>
              <h2 className={`text-4xl font-black text-center tracking-tight transition-all duration-300 ${stat.color}`}>{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* CENTER COLUMN: INTERACTIVE VIEWPORTS */}
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-[1fr_minmax(380px,420px)] gap-6 items-center glass-panel-fallback rounded-[28px] p-6 shadow-2xl">
            
            {/* Live Interactive Deck Grid */}
            <div className="bg-[#040516]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-4 shadow-inner">
              <div className="flex flex-wrap gap-2 justify-center max-w-[420px] mx-auto">
                {topKeys.map((key) => (
                  <div
                    key={key}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200 border
                      ${nextTargetChar === key
                        ? "bg-purple-600/40 border-purple-500 text-purple-200 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        : "bg-[#0d0e2b]/60 border-white/5 text-gray-500"
                      }
                    `}
                  >
                    {key}
                  </div>
                ))}
              </div>
              <div className={`w-28 h-7 mx-auto rounded-lg shadow-inner flex items-center justify-center text-[10px] font-bold tracking-widest border transition-all duration-200
                ${nextTargetChar === " " 
                  ? "bg-purple-600/40 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.5)]" 
                  : "bg-[#0d0e2b]/60 border-white/5 text-gray-600"
                }`}
              >
                SPACE
              </div>
            </div>

            {/* Visual Guide Container */}
            <div className="bg-[#040516]/90 p-3 rounded-xl border border-white/5 flex flex-col items-center relative overflow-hidden shadow-inner group">
              <img src={lessonKeyboard} alt="keyboard guide" className="w-full h-auto max-h-[140px] object-contain rounded-lg brightness-90 contrast-105 transition-all duration-300 group-hover:brightness-100" />
              <div className="w-full flex justify-between items-center mt-2 px-1">
                <span className="text-[10px] text-gray-500 font-mono tracking-wider">lesson4.2.png</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

          {/* MAIN TYPING CANVAS BOX */}
          <div className="bg-[#040516]/90 border border-white/5 rounded-[28px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden h-[340px]" style={{ padding: "26px" }}>
            <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#040516] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#040516] to-transparent pointer-events-none z-10" />
            <div 
              ref={scrollContainerRef}
              className="forced-purple-scroll w-full h-full overflow-y-auto text-xl text-left font-medium select-none font-mono pr-2 relative"
              style={{ lineHeight: "3.6rem", letterSpacing: "1px" }}
            >
              {paragraph.split("").map((char, index) => {
                let colorClass = "text-[#3a3f63]"; 
                let isCurrent = index === typed.length;
                
                if (letterStates[index] === "correct") {
                  colorClass = "text-emerald-400 font-medium drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]"; 
                } else if (letterStates[index] === "wrong") {
                  colorClass = "text-rose-500 bg-rose-500/20 underline decoration-rose-500 decoration-2 font-bold rounded px-[2px]"; 
                }

                if (isCurrent) {
                  colorClass = "text-white bg-purple-500/30 px-[4px] rounded font-bold border-l-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)] animate-pulse";
                }

                return (
                  <span 
                    key={index} 
                    ref={isCurrent ? activeLetterRef : null} 
                    className={`${colorClass} transition-all duration-100 inline-block`}
                    style={{ minWidth: char === " " ? "12px" : "auto" }}
                  >
                    {char === " " && letterStates[index] === "wrong" ? "␣" : char}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TARGET TERMINALS */}
        <div className="flex flex-col gap-4 w-full">
          <div className="glass-panel-fallback rounded-2xl p-5 shadow-2xl flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            <p className="text-gray-400 text-[10px] font-bold self-start w-full text-left mb-2 uppercase tracking-widest">Target Key</p>
            <h2 className="text-6xl font-black text-emerald-400 tracking-normal font-mono leading-none drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              {paragraph[typed.length] === " " ? "␣" : paragraph[typed.length] || "—"}
            </h2>
          </div>

          <div className="glass-panel-fallback rounded-xl p-3.5 shadow-lg flex justify-between items-center px-4 transition-all hover:border-white/20">
            <p className="text-gray-400 text-xs font-semibold tracking-wide uppercase text-[10px]">Typed</p>
            <h3 className="text-lg font-bold text-white font-mono">{typed.length}</h3>
          </div>

          <div className="glass-panel-fallback rounded-xl p-3.5 shadow-lg flex justify-between items-center px-4 transition-all hover:border-white/20">
            <p className="text-gray-400 text-xs font-semibold tracking-wide uppercase text-[10px]">Remaining</p>
            <h3 className="text-lg font-bold text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{paragraph.length - typed.length}</h3>
          </div>

          {/* Diagnostic Key Log Terminal */}
          <div className="bg-[#040516]/90 border border-white/5 rounded-2xl p-4 shadow-2xl flex flex-col min-h-[145px] justify-between mt-1 relative overflow-hidden">
            <div className="flex items-center gap-2 w-full justify-center border-b border-white/5 pb-2.5">
              <span className="text-sm text-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]">⚠️</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Error Core Log</p>
            </div>
            
            {!wrongKeyLog ? (
              <p className="text-gray-600 text-xs my-auto italic text-center tracking-wide">No active system exceptions</p>
            ) : (
              <div className="flex gap-3 justify-center items-center w-full mt-auto pt-4 pb-1 animate-fadeIn">
                <span
                  className={`font-mono font-black rounded-xl shadow-2xl transition-all text-center leading-tight
                    ${wrongKeyLog === "YOU TYPED IN CAPITAL LETTERS" 
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] px-3 py-2 font-sans font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/30 px-5 py-2 text-2xl shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    }
                  `}
                >
                  {wrongKeyLog}
                </span>
              </div>
            )}
          </div>

          {/* END PRACTICE ACTION TERMINAL */}
          <button
            onClick={() => navigate("/lessons")}
            className="w-full mt-2 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 border border-rose-900/40 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-lg hover:shadow-rose-950/20 text-center"
          >
            End Practice
          </button>
        </div>

      </div>

      {/* POPUP COMPLETION MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0c0d2b] border border-white/10 rounded-[32px] p-12 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.9)] max-w-md w-full mx-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            <h2 className="text-3xl font-black text-purple-400 mb-8 tracking-wider text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">PRACTICE COMPLETE</h2>
            
            <div className="grid grid-cols-2 gap-8 w-full mb-10">
              <div className="bg-[#14163d]/50 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-gray-400 text-[10px] font-bold mb-1 uppercase tracking-widest">Final WPM</p>
                <p className="text-white text-3xl font-black font-mono">{wpm}</p>
              </div>
              <div className="bg-[#14163d]/50 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-gray-400 text-[10px] font-bold mb-1 uppercase tracking-widest">Accuracy</p>
                <p className="text-emerald-400 text-3xl font-black font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{accuracy}%</p>
              </div>
            </div>
            
            <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3.5 rounded-xl text-center text-sm font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/30 cursor-pointer hover:brightness-110 transition-all duration-200 animate-pulse">
              Press [SPACE] to continue
            </div>
          </div>
        </div>
      )}
    </div>
  );
}