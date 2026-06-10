import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson5.2.png";

const practiceKeys = ["A", "S", "D", "F", "J", "K", "L", ":"];

export default function Lesson5_2() {
  const navigate = useNavigate();

  // State Management
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); 
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wrongKeyLog, setWrongKeyLog] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false);

  const mainDivRef = useRef(null);

  useEffect(() => {
    if (mainDivRef.current) {
      mainDivRef.current.focus();
    }
  }, []);

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

  const handleKeyDown = (e) => {
    /* HANDLE POPUP NAVIGATION */
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        navigate("/lesson5/5.3");
      }
      return;
    }

    if (gameOver) return;

    const key = e.key;
    const currentIndex = typed.length;

    // Track active Shift modifier key presses live
    if (key === "Shift") {
      setIsShiftActive(true);
      return;
    }

    /* START TIMER ON FIRST KEY */
    if (!startTime && key !== "Shift" && (key.length === 1 || key === " ")) {
      setStartTime(Date.now());
    }

    /* BACKSPACE HANDLER */
    if (key === "Backspace") {
      e.preventDefault();
      setTyped((prev) => prev.slice(0, -1));
      setWrongKeyLog("");
      return;
    }

    /* ALLOWED INPUT CHARACTER TRACKING */
    if (key.length === 1 || key === " ") {
      e.preventDefault();

      if (currentIndex >= practiceKeys.length) return;

      const expectedChar = practiceKeys[currentIndex];
      const typedChar = key; 

      // Verifies exact match including capitalization cases
      const isCorrect = typedChar === expectedChar;

      if (isCorrect) {
        const updatedTyped = typed + typedChar;
        setTyped(updatedTyped);
        setCorrectCount((prev) => prev + 1);
        setWrongKeyLog("");

        /* CHECK LESSON COMPLETION */
        if (updatedTyped.length === practiceKeys.length) {
          setGameOver(true);
          setShowPopup(true);
        }
      } else {
        /* WRONG KEY LOGIC */
        setWrongCount((prev) => prev + 1);
        
        let displayInstruction = typedChar === " " ? "SPACE" : typedChar;

        // Custom alert if user forgets to use Shift keys for uppercase targets
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

  /* ANALYTICS CALCULATIONS (FIXED SAFETY BUFFER FOR RUNTIME CRASHES) */
  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((correctCount / totalAttempts) * 100);
  
  // Fixed time denominator tracking safely bounds runtime floats
  const timeElapsedSeconds = 20 - timeLeft;
  const minutes = timeElapsedSeconds > 0 ? timeElapsedSeconds / 60 : 0.01;
  const wpm = Math.round((correctCount / 5) / minutes) || 0;

  const nextTargetChar = practiceKeys[typed.length] || "—";

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={mainDivRef}
      className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col items-center outline-none px-8 pb-8 select-none"
    >
      {/* Header Area */}
      <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center mb-6 mt-4">
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/lessons")}
            className="px-5 py-2 bg-[#111A31] border border-[#232F4D] rounded-xl text-md hover:bg-[#1C2744] transition flex items-center gap-2 font-medium shadow-sm"
          >
            <span>←</span> Back to Lessons
          </button>
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-4xl font-bold tracking-wide text-center w-full max-w-[1400px] mx-auto mb-12">
        Lesson 5.2 — Alphabatic Capitalized Reach Practice
      </h1>

      {/* Main Dashboard Grid */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-[180px_1fr_240px] gap-8 items-start">
        
        {/* LEFT COLUMN: STATS */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl text-center">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-tighter">Time</p>
            <h2 className="text-4xl font-bold text-[#7ED321]">{timeLeft}s</h2>
          </div>
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl text-center">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-tighter">Accuracy</p>
            <h2 className="text-4xl font-bold text-[#7ED321]">{accuracy}%</h2>
          </div>
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl text-center">
            <p className="text-gray-400 text-sm mb-1 uppercase tracking-tighter">WPM</p>
            <h2 className="text-4xl font-bold text-[#7ED321]">{wpm}</h2>
          </div>
        </div>

        {/* CENTER COLUMN: HARDWARE & PRACTICE */}
        <div className="flex flex-col gap-6 w-full">
          {/* Top Panel: Keyboard Reference */}
          <div className="grid grid-cols-[1fr_minmax(400px,460px)] gap-6 items-center bg-[#111827] border border-[#2b3245] rounded-[32px] p-6 shadow-xl">
            <div className="bg-[#0A0D1A]/60 border border-[#1f293d] rounded-2xl p-4 flex flex-col gap-3 items-center">
              
              {/* Virtual Target Row */}
              <div className="flex gap-2.5 justify-center">
                {practiceKeys.map((key) => {
                  const isTarget = nextTargetChar === key;
                  return (
                    <div
                      key={key}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all border shadow-md
                        ${isTarget 
                          ? "bg-purple-600 border-purple-400 text-white scale-110 shadow-purple-900/40" 
                          : "bg-[#1F2A44] border-[#2b3245] text-gray-400"}
                      `}
                    >
                      {key}
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Shift Indicator Rails */}
              <div className="w-full flex justify-between px-2 mt-2">
                <div className={`px-4 py-1.5 rounded-lg border font-mono text-[10px] font-bold transition-all uppercase tracking-wider
                  ${isShiftActive 
                    ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/20" 
                    : nextTargetChar !== "—" && nextTargetChar !== ";" && ["J", "K", "L", ";"].includes(nextTargetChar)
                      ? "bg-purple-950/40 border-purple-500/40 text-purple-400 animate-pulse" 
                      : "bg-[#161f33] border-gray-800 text-gray-500"}
                `}>
                  Left Shift
                </div>
                <div className={`px-4 py-1.5 rounded-lg border font-mono text-[10px] font-bold transition-all uppercase tracking-wider
                  ${isShiftActive 
                    ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/20" 
                    : nextTargetChar !== "—" && ["A", "S", "D", "F"].includes(nextTargetChar)
                      ? "bg-purple-950/40 border-purple-500/40 text-purple-400 animate-pulse" 
                      : "bg-[#161f33] border-gray-800 text-gray-500"}
                `}>
                  Right Shift
                </div>
              </div>

            </div>

            <div className="bg-[#050816] p-3 rounded-2xl border border-[#222] flex flex-col items-center">
              <img src={lessonKeyboard} alt="Keyboard map" className="w-full h-auto max-h-[160px] object-contain rounded-xl" />
              <span className="text-[10px] text-gray-500 mt-1 font-mono uppercase tracking-widest">Hardware Reference</span>
            </div>
          </div>

          {/* Practice Box */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[32px] shadow-2xl flex flex-col items-center justify-center relative p-12 h-[340px]">
            <div className="flex gap-4 mb-8">
              {practiceKeys.map((char, index) => (
                <span 
                  key={index}
                  className={`text-6xl font-black font-mono transition-all duration-200
                    ${index < typed.length ? "text-[#7ED321]" : index === typed.length ? "text-purple-500 scale-125 underline underline-offset-8" : "text-gray-700"}
                  `}
                >
                  {char}
                </span>
              ))}
            </div>

            <div className="w-full max-w-[400px] h-1 bg-[#1A1D26] rounded-full overflow-hidden">
               <div 
                  className="h-full bg-purple-500 transition-all duration-500" 
                  style={{ width: `${(typed.length / practiceKeys.length) * 100}%` }}
               />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS PANEL */}
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-4 shadow-xl flex flex-col items-center justify-center min-h-[160px]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Target Key</p>
            <h2 className="text-7xl font-black text-[#7ED321] font-mono">{nextTargetChar}</h2>
          </div>

          <div className="bg-[#0f172a] border border-[#2b3245] rounded-2xl p-4 shadow-inner flex flex-col min-h-[145px] justify-between">
            <div className="flex items-center gap-2 w-full justify-center border-b border-gray-800 pb-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wrong Keys Log</p>
            </div>
            
            {!wrongKeyLog ? (
              <p className="text-gray-600 text-xs my-auto italic text-center">No active errors</p>
            ) : (
              <div className="flex justify-center items-center h-full pt-2">
                <span className={`font-mono font-black rounded-xl shadow-md transition-all text-center leading-tight
                    ${wrongKeyLog === "HOLD SHIFT KEY FOR CAPITAL LETTERS" 
                      ? "bg-amber-950 text-amber-400 border-2 border-amber-600 text-[10px] px-3 py-2 font-sans font-bold tracking-wide" 
                      : "bg-red-950 text-red-400 border-2 border-red-600 px-5 py-3 text-3xl"
                    }
                  `}>
                  {wrongKeyLog}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[35px] p-10 flex flex-col items-center shadow-2xl text-center">
            <h2 className="text-5xl font-bold text-purple-500 mb-6 tracking-wide">Lesson Complete! ⚔️</h2>
            <div className="flex gap-12 mb-10">
               <div>
                 <p className="text-gray-400 text-xs uppercase mb-1">Accuracy</p>
                 <p className="text-3xl font-black">{accuracy}%</p>
               </div>
               <div>
                 <p className="text-gray-400 text-xs uppercase mb-1">WPM</p>
                 <p className="text-3xl font-black">{wpm}</p>
               </div>
            </div>
            <button
              onClick={() => navigate("/lesson5/5.2")}
              className="bg-purple-600 text-white px-10 py-4 rounded-2xl text-xl font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/20"
            >
              Next Lesson →
            </button>
            <p className="text-gray-500 text-sm mt-4 italic">Press [SPACE] to continue</p>
          </div>
        </div>
      )}
    </div>
  );
}