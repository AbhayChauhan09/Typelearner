import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson5.2.png";

// The full sequence of characters requested
const targetPool = ["A", "S", "D", "F", "J", "K", "L", ":", "E", "R", "T", "U", "I", "O"];

// Core mapping sets for cross-coordination rules
const leftHandKeys = ["A", "S", "D", "F", "E", "R", "T"];
const rightHandKeys = ["J", "K", "L", ":", "U", "I", "O"];

// Generates a randomized practice string using your exact keys
const generatePracticeText = () => {
  let result = [];
  for (let i = 0; i < 12; i++) {
    const randomChar = targetPool[Math.floor(Math.random() * targetPool.length)];
    result.push(randomChar);
  }
  return result;
};

export default function Lesson5_3() {
  const navigate = useNavigate();

  // Core Typing State Machine
  const [practiceKeys, setPracticeKeys] = useState(() => generatePracticeText());
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wrongKeyLog, setWrongKeyLog] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false);

  const mainDivRef = useRef(null);

  // Auto-focus window to register keystrokes instantly
  useEffect(() => {
    if (mainDivRef.current) {
      mainDivRef.current.focus();
    }
  }, []);

  /* COUNTDOWN TIMER LOGIC */
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

  const handleKeyDown = (e) => {
    /* MODAL OVERLAY NAVIGATION */
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        navigate("/lesson5/5.4");
      }
      return;
    }

    if (gameOver) return;

    const key = e.key;
    const currentIndex = typed.length;

    // Monitor active physical shift holds live
    if (key === "Shift") {
      setIsShiftActive(true);
      return;
    }

    /* TRIGGER TIMER UPON INITIATION */
    if (!startTime && key !== "Shift" && (key.length === 1 || key === " ")) {
      setStartTime(Date.now());
    }

    /* BACKSPACE ACTIONS */
    if (key === "Backspace") {
      e.preventDefault();
      setTyped((prev) => prev.slice(0, -1));
      setWrongKeyLog("");
      return;
    }

    /* TEXT VERIFICATION INPUT PIPELINE */
    if (key.length === 1 || key === " ") {
      e.preventDefault();

      if (currentIndex >= practiceKeys.length) return;

      const expectedChar = practiceKeys[currentIndex];
      const typedChar = key; 

      const isCorrect = typedChar === expectedChar;

      if (isCorrect) {
        const updatedTyped = typed + typedChar;
        setTyped(updatedTyped);
        setCorrectCount((prev) => prev + 1);
        setWrongKeyLog("");

        /* ASSESS COMPLETION STATE */
        if (updatedTyped.length === practiceKeys.length) {
          setGameOver(true);
          setShowPopup(true);
        }
      } else {
        setWrongCount((prev) => prev + 1);
        let displayInstruction = typedChar === " " ? "SPACE" : typedChar;

        // Custom shift reminder alert logic
        if (
          typedChar !== " " && 
          expectedChar !== " " && 
          expectedChar === expectedChar.toUpperCase() && 
          typedChar === typedChar.toLowerCase()
        ) {
          displayInstruction = "HOLD SHIFT KEY FOR CAPITAL LETTERS";
        }

        setWrongKeyLog(displayInstruction);
      }
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Shift") {
      setIsShiftActive(false);
    }
  };

  const restartLesson = () => {
    setPracticeKeys(generatePracticeText());
    setTyped("");
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(30);
    setGameOver(false);
    setStartTime(null);
    setWrongKeyLog("");
    setShowPopup(false);
    setIsShiftActive(false);
    if (mainDivRef.current) mainDivRef.current.focus();
  };

  /* METRICS CALCULATORS */
  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((correctCount / totalAttempts) * 100);
  
  const timeElapsedSeconds = 30 - timeLeft;
  const minutes = timeElapsedSeconds > 0 ? timeElapsedSeconds / 60 : 0.01;
  const wpm = Math.round((correctCount / 5) / minutes) || 0;

  const nextTargetChar = practiceKeys[typed.length] || "—";

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={mainDivRef}
      className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col items-center px-10 pb-16 font-sans outline-none select-none"
    >
      
      {/* Top Header Navigation Link bars */}
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center mb-10 mt-8">
        <button
          onClick={() => navigate("/lessons")}
          className="px-6 py-2.5 bg-[#111A31] border border-[#232F4D] rounded-xl text-sm font-medium hover:bg-[#1C2744] transition flex items-center gap-2 shadow-sm text-gray-300"
        >
          <span>←</span> Back to Lessons
        </button>
        <button
          onClick={restartLesson}
          className="px-5 py-2.5 bg-[#1F2A44] border border-[#2b3245] rounded-xl text-sm font-semibold hover:bg-[#2A395C] transition flex items-center gap-2 shadow-sm text-purple-400"
        >
          🔄 Restart Exercise
        </button>
      </div>

      {/* Main Page Title Header */}
      <h1 className="text-4xl font-extrabold tracking-wide text-center w-full max-w-[1440px] mx-auto mb-12">
        Lesson 5.3 — Capitalized Reach Practice Mode
      </h1>

      {/* Grid structure matching the spacious layout styles cleanly */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr_420px] gap-10 items-start">
        
        {/* LEFT COLUMN: LIVE STATS RUNTIME CARDS */}
        <div className="flex flex-col gap-6 w-full">
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Time</p>
            <h2 className="text-4xl font-black text-[#00E676] font-mono">{timeLeft}s</h2>
          </div>
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Accuracy</p>
            <h2 className="text-4xl font-black text-[#00E676] font-mono">{accuracy}%</h2>
          </div>
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">WPM</p>
            <h2 className="text-4xl font-black text-[#00E676] font-mono">{wpm}</h2>
          </div>
        </div>

        {/* CENTER COLUMN: INTERACTIVE ACTIVE TYPING DOMAIN FRAME */}
        <div className="flex flex-col gap-10 w-full">
          
          {/* Static Theory Reference Box - Solid native layout left purple frame configuration */}
          <div className="bg-[#111827] border border-[#2b3245] border-l-[10px] border-l-purple-500 rounded-[36px] p-10 shadow-md">
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2.5 tracking-wide">
              <span>🧠</span> Cross-Coordination Training Rules
            </h2>
            <p className="text-lg leading-relaxed text-gray-300">
              Your hands must act in a synchronized dance of opposites! When you type right-hand letters, your left pinky must drop onto the Left Shift. When you reach for left-hand letters, your right pinky must command the Right Shift.
            </p>
          </div>

          {/* Interactive Input Terminal Practice Field box */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[36px] shadow-2xl flex flex-col items-center justify-center p-12 min-h-[300px]">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-10">
              {!startTime ? "PRESS ANY TARGET KEY ABOVE TO START THE RUNTIME RUN" : "ACTIVE TYPING DRILL RUNNING"}
            </span>
            
            {/* Display character block loops */}
            <div className="flex flex-wrap gap-5 mb-10 justify-center max-w-[700px]">
              {practiceKeys.map((char, index) => {
                let colorClass = "text-gray-600";
                let underlineClass = "";
                
                if (index < typed.length) {
                  colorClass = "text-[#00E676]";
                } else if (index === typed.length) {
                  colorClass = "text-purple-400 scale-125 font-black";
                  underlineClass = "underline underline-offset-[12px] decoration-purple-400 decoration-4";
                }

                return (
                  <span 
                    key={index}
                    className={`text-6xl font-black font-mono transition-all duration-150 ${colorClass} ${underlineClass}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Inner bottom timeline slider wire */}
            <div className="w-full max-w-[440px] h-1.5 bg-[#1A1D26] rounded-full overflow-hidden">
               <div 
                  className="h-full bg-purple-500 transition-all duration-300" 
                  style={{ width: `${(typed.length / practiceKeys.length) * 100}%` }}
               />
            </div>
          </div>

          {/* Dynamic Shift Indicator Rails Module */}
          <div className="w-full flex justify-between gap-6 bg-[#111827]/40 p-6 rounded-3xl border border-[#2b3245]/60">
            {/* Left Shift Rail */}
            <div className={`px-6 py-4 rounded-xl border font-mono text-xs font-bold transition-all uppercase tracking-wider flex flex-col items-center justify-center w-1/2 min-h-[64px]
              ${isShiftActive 
                ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/20" 
                : nextTargetChar !== "—" && rightHandKeys.includes(nextTargetChar)
                  ? "bg-[#004D40]/40 border-[#00E676] text-[#00E676] animate-pulse border-dashed border-2 scale-[1.02]" 
                  : "bg-[#161f33]/40 border-gray-800 text-gray-600"}
            `}>
              <span>Left Shift Active</span>
              <span className="text-[10px] opacity-75 mt-1 font-sans normal-case tracking-normal">(For: J, K, L, ;, U, I, O)</span>
            </div>

            {/* Right Shift Rail */}
            <div className={`px-6 py-4 rounded-xl border font-mono text-xs font-bold transition-all uppercase tracking-wider flex flex-col items-center justify-center w-1/2 min-h-[64px]
              ${isShiftActive 
                ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/20" 
                : nextTargetChar !== "—" && leftHandKeys.includes(nextTargetChar)
                  ? "bg-[#4D3800]/40 border-amber-500 text-amber-400 animate-pulse border-dashed border-2 scale-[1.02]" 
                  : "bg-[#161f33]/40 border-gray-800 text-gray-600"}
            `}>
              <span>Right Shift Active</span>
              <span className="text-[10px] opacity-75 mt-1 font-sans normal-case tracking-normal">(For: A, S, D, F, E, R, T)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REALTIME ANALYTICS ERRORS & LOG REALS */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Targeted display frame element */}
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-8 shadow-xl flex flex-col items-center text-center justify-center min-h-[180px]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Target Key</p>
            <h3 className={`text-7xl font-black font-mono ${leftHandKeys.includes(nextTargetChar) ? "text-amber-400" : rightHandKeys.includes(nextTargetChar) ? "text-[#00E676]" : "text-gray-500"}`}>
              {nextTargetChar}
            </h3>
          </div>

          {/* Dynamic Error Logger block output terminal layout */}
          <div className="bg-[#0f172a] border border-[#2b3245] rounded-2xl p-5 shadow-inner flex flex-col min-h-[160px] justify-between">
            <div className="flex items-center gap-2 w-full justify-center border-b border-gray-800/80 pb-2.5">
              <span className="text-red-500 text-xs">⚠️</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Feedback Logger</p>
            </div>
            
            {!wrongKeyLog ? (
              <p className="text-gray-600 text-xs my-auto italic text-center">No active alignment errors registered</p>
            ) : (
              <div className="flex justify-center items-center h-full pt-2">
                <span className={`font-mono font-black rounded-xl shadow-md transition-all text-center leading-tight
                    ${wrongKeyLog === "HOLD SHIFT KEY FOR CAPITAL LETTERS" 
                      ? "bg-amber-950 text-amber-400 border-2 border-amber-600 text-[11px] px-4 py-2.5 font-sans font-bold tracking-wide" 
                      : "bg-red-950 text-red-400 border-2 border-red-600 px-6 py-3 text-3xl"
                    }
                  `}>
                  {wrongKeyLog}
                </span>
              </div>
            )}
          </div>

          {/* Static asset image container anchor map */}
          <div className="bg-[#050816] p-5 rounded-3xl border border-[#2b3245] flex flex-col items-center justify-center shadow-xl">
            <img src={lessonKeyboard} alt="Hardware reference chart wire map" className="w-full h-auto max-h-[160px] object-contain rounded-xl" />
            <span className="text-[10px] text-gray-500 mt-4 font-mono uppercase tracking-widest">Hardware Reference</span>
          </div>

        </div>

      </div>

      {/* RUNTIME LESSON COMPLETION OVERLAY DIALOG MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[40px] p-12 flex flex-col items-center shadow-2xl text-center max-w-[480px] w-full mx-4">
            <h2 className="text-4xl font-extrabold text-purple-400 mb-6 tracking-wide">Exercise Complete! ⚔️</h2>
            <div className="flex gap-14 mb-10 w-full justify-center border-y border-gray-800 py-6">
               <div>
                 <p className="text-gray-400 text-xs font-bold uppercase mb-1.5 tracking-wider">Accuracy</p>
                 <p className="text-4xl font-black text-[#00E676] font-mono">{accuracy}%</p>
               </div>
               <div>
                 <p className="text-gray-400 text-xs font-bold uppercase mb-1.5 tracking-wider">WPM Speed</p>
                 <p className="text-4xl font-black text-[#00E676] font-mono">{wpm}</p>
               </div>
            </div>
            <button
              onClick={() => navigate("/lesson5/5.2")}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/40 transform hover:scale-[1.02]"
            >
              Next Lesson →
            </button>
            <button 
              onClick={restartLesson}
              className="mt-4 text-sm text-gray-500 hover:text-purple-400 transition font-medium"
            >
              Try This Sequence Again
            </button>
            <p className="text-gray-600 text-xs mt-6 italic">Press [SPACE] to load Next Lesson directly</p>
          </div>
        </div>
      )}

    </div>
  );
}