import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson5.2.png";

// Hand territories for Shift tracking
const leftHandKeys = ["a", "s", "d", "f", "e", "r", "t", "A", "S", "D", "F", "E", "R", "T"];
const rightHandKeys = ["j", "k", "l", ";", "u", "i", "o", "J", "K", "L", ":", "U", "I", "O"];

// Generates realistic 2-3 letter combinations based strictly on your requested pool
const generateWordParagraph = () => {
  const words = [
    "As", "To", "Do", "If", "Is", "Or", "It", "So", "Re", "An",
    "See", "Too", "Are", "For", "Out", "Its", "Use", "Set", "Eat", "Let"
  ];
  const punctuation = ["", "", ";", ":", ""];
  
  let resultPool = [];
  for (let i = 0; i < 15; i++) {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    let punc = punctuation[Math.floor(Math.random() * punctuation.length)];
    resultPool.push(randomWord + punc);
  }
  
  return resultPool.join(" ").split("");
};

export default function Lesson5_4() {
  const navigate = useNavigate();

  // Core Typing State Machine
  const [practiceText, setPracticeText] = useState(() => generateWordParagraph());
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40); 
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

  /* TIMER IMPLEMENTATION */
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
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        navigate("/lesson5/5.5");
      }
      return;
    }

    if (gameOver) return;

    const key = e.key;
    const currentIndex = typed.length;

    if (key === "Shift") {
      setIsShiftActive(true);
      return;
    }

    if (!startTime && key !== "Shift" && (key.length === 1 || key === " ")) {
      setStartTime(Date.now());
    }

    if (key === "Backspace") {
      e.preventDefault();
      setTyped((prev) => prev.slice(0, -1));
      setWrongKeyLog("");
      return;
    }

    if (key.length === 1 || key === " ") {
      e.preventDefault();

      if (currentIndex >= practiceText.length) return;

      const expectedChar = practiceText[currentIndex];
      const typedChar = key; 

      const isCorrect = typedChar === expectedChar;

      if (isCorrect) {
        const updatedTyped = typed + typedChar;
        setTyped(updatedTyped);
        setCorrectCount((prev) => prev + 1);
        setWrongKeyLog("");

        if (updatedTyped.length === practiceText.length) {
          setGameOver(true);
          setShowPopup(true);
        }
      } else {
        setWrongCount((prev) => prev + 1);
        let displayInstruction = typedChar === " " ? "SPACE" : typedChar;

        if (
          typedChar !== " " && 
          expectedChar !== " " && 
          expectedChar !== ";" &&
          expectedChar === expectedChar.toUpperCase() && 
          typedChar === typedChar.toLowerCase()
        ) {
          displayInstruction = "HOLD SHIFT KEY FOR CAPITAL LETTERS";
        } else if (expectedChar === ":") {
          displayInstruction = "HOLD SHIFT + PRESS SEMICOLON (;) FOR COLON";
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
    setPracticeText(generateWordParagraph());
    setTyped("");
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(40);
    setGameOver(false);
    setStartTime(null);
    setWrongKeyLog("");
    setShowPopup(false);
    setIsShiftActive(false);
    if (mainDivRef.current) mainDivRef.current.focus();
  };

  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((correctCount / totalAttempts) * 100);
  
  const timeElapsedSeconds = 40 - timeLeft;
  const minutes = timeElapsedSeconds > 0 ? timeElapsedSeconds / 60 : 0.01;
  const wpm = Math.round((correctCount / 5) / minutes) || 0;

  const nextTargetChar = practiceText[typed.length] || "—";

  const dynamicShiftTarget = nextTargetChar !== "—" && nextTargetChar !== " " 
    ? (nextTargetChar === ":" || nextTargetChar === nextTargetChar.toUpperCase() && nextTargetChar !== ";")
    : false;

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      ref={mainDivRef}
      className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col items-center px-10 pb-16 font-sans outline-none select-none"
    >
      
      {/* Top Header bar */}
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
          🔄 New Mixed-Case Paragraph
        </button>
      </div>

      {/* Main Header Title */}
      <h1 className="text-4xl font-extrabold tracking-wide text-center w-full max-w-[1440px] mx-auto mb-12">
        Lesson 5.4 — Mixed-Case  Letter Words Practice
      </h1>

      {/* Dashboard Grid Container */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[200px_1fr_420px] gap-10 items-start">
        
        {/* STATS PANELS */}
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

        {/* CENTER TYPING ARENA */}
        <div className="flex flex-col gap-10 w-full">
          
          {/* FIXED WORKBENCH CARD: Replaced rounding with rounded-2xl to prevent oval collapse, and added px-10 py-8 internal spacing */}
          <div className="bg-[#111827] border border-[#2b3245] border-l-[10px] border-l-purple-500 rounded-2xl px-10 py-8 shadow-2xl flex flex-col w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🧠</span>
              <h2 className="text-xl font-extrabold tracking-wide text-purple-400">
                Cross-Coordination Training Rules
              </h2>
            </div>
            <p className="text-md leading-relaxed text-gray-300 font-medium">
              Your hands must act in a <span className="text-purple-400 font-bold">synchronized dance of opposites!</span> When you type right-hand letters, your left pinky must drop onto the Left Shift. When you reach for left-hand letters, your right pinky must command the Right Shift.
            </p>
          </div>

          {/* Large Interactive Typable Paragraph Card */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[36px] shadow-2xl flex flex-col p-12 min-h-[320px] justify-center items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">
              {!startTime ? "CLICK HERE & TYPE THE MIXED PARAGRAPH BELOW" : "PARAGRAPH IN PROGRESS"}
            </span>
            
            {/* Paragraph Word Stream Layout */}
            <div className="flex flex-wrap gap-x-4 gap-y-6 justify-center max-w-[800px] leading-relaxed">
              {practiceText.map((char, index) => {
                let colorClass = "text-gray-600";
                let decorationClass = "";
                
                if (index < typed.length) {
                  colorClass = "text-[#00E676]";
                } else if (index === typed.length) {
                  colorClass = "text-purple-400 scale-110 font-black";
                  decorationClass = "bg-purple-500/10 px-0.5 rounded border-b-4 border-purple-400";
                }

                return (
                  <span 
                    key={index}
                    className={`text-5xl font-mono transition-all duration-100 font-bold ${colorClass} ${decorationClass}`}
                  >
                    {char === " " ? "␣" : char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Dynamic Shift Rails Indicator Panels */}
          <div className="w-full flex justify-between gap-6 bg-[#111827]/40 p-6 rounded-3xl border border-[#2b3245]/60">
            {/* Left Shift Module */}
            <div className={`px-6 py-4 rounded-xl border font-mono text-xs font-bold transition-all uppercase tracking-wider flex flex-col items-center justify-center w-1/2 min-h-[64px]
              ${isShiftActive 
                ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/20" 
                : dynamicShiftTarget && rightHandKeys.includes(nextTargetChar)
                  ? "bg-[#004D40]/40 border-[#00E676] text-[#00E676] animate-pulse border-dashed border-2 scale-[1.02]" 
                  : "bg-[#161f33]/40 border-gray-800 text-gray-600"}
            `}>
              <span>Left Shift Indicator</span>
              <span className="text-[10px] opacity-75 mt-1 font-sans normal-case tracking-normal">(Hold for right hand capital targets)</span>
            </div>

            {/* Right Shift Module */}
            <div className={`px-6 py-4 rounded-xl border font-mono text-xs font-bold transition-all uppercase tracking-wider flex flex-col items-center justify-center w-1/2 min-h-[64px]
              ${isShiftActive 
                ? "bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/20" 
                : dynamicShiftTarget && leftHandKeys.includes(nextTargetChar)
                  ? "bg-[#4D3800]/40 border-amber-500 text-amber-400 animate-pulse border-dashed border-2 scale-[1.02]" 
                  : "bg-[#161f33]/40 border-gray-800 text-gray-600"}
            `}>
              <span>Right Shift Indicator</span>
              <span className="text-[10px] opacity-75 mt-1 font-sans normal-case tracking-normal">(Hold for left hand capital targets)</span>
            </div>
          </div>

        </div>

        {/* RIGHT FEEDBACK AND BLUEPRINT CARD */}
        <div className="flex flex-col gap-6 w-full">
          
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-8 shadow-xl flex flex-col items-center text-center justify-center min-h-[180px]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Target Character</p>
            <h3 className={`text-6xl font-black font-mono ${nextTargetChar === " " ? "text-gray-500" : leftHandKeys.includes(nextTargetChar) ? "text-amber-400" : "text-[#00E676]"}`}>
              {nextTargetChar === " " ? "SPACE" : nextTargetChar}
            </h3>
          </div>

          {/* Feedback logger console error tracking panel */}
          <div className="bg-[#0f172a] border border-[#2b3245] rounded-2xl p-5 shadow-inner flex flex-col min-h-[160px] justify-between">
            <div className="flex items-center gap-2 w-full justify-center border-b border-gray-800/80 pb-2.5">
              <span className="text-red-500 text-xs">⚠️</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Feedback Logger</p>
            </div>
            
            {!wrongKeyLog ? (
              <p className="text-gray-600 text-xs my-auto italic text-center">No input errors tracked</p>
            ) : (
              <div className="flex justify-center items-center h-full pt-2">
                <span className={`font-mono font-black rounded-xl shadow-md transition-all text-center leading-tight
                    ${wrongKeyLog.length > 3
                      ? "bg-amber-950 text-amber-400 border-2 border-amber-600 text-[11px] px-4 py-2.5 font-sans font-bold tracking-wide" 
                      : "bg-red-950 text-red-400 border-2 border-red-600 px-6 py-3 text-3xl"
                    }
                  `}>
                  {wrongKeyLog}
                </span>
              </div>
            )}
          </div>

          <div className="bg-[#050816] p-5 rounded-3xl border border-[#2b3245] flex flex-col items-center justify-center shadow-xl">
            <img src={lessonKeyboard} alt="Hardware map reference" className="w-full h-auto max-h-[160px] object-contain rounded-xl" />
            <span className="text-[10px] text-gray-500 mt-4 font-mono uppercase tracking-widest">Hardware Reference</span>
          </div>

        </div>

      </div>

      {/* SUCCESS POPUP MODAL OVERLAY */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 backdrop-blur-md">
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[40px] p-12 flex flex-col items-center shadow-2xl text-center max-w-[480px] w-full mx-4">
            <h2 className="text-4xl font-extrabold text-purple-400 mb-6 tracking-wide">Exercise Complete! 🎉</h2>
            <div className="flex gap-14 mb-10 w-full justify-center border-y border-gray-800 py-6">
               <div>
                 <p className="text-gray-400 text-xs font-bold uppercase mb-1.5 tracking-wider">Accuracy</p>
                 <p className="text-4xl font-black text-[#00E676] font-mono">{accuracy}%</p>
               </div>
               <div>
                 <p className="text-gray-400 text-xs font-bold uppercase mb-1.5 tracking-wider">Speed</p>
                 <p className="text-4xl font-black text-[#00E676] font-mono">{wpm} WPM</p>
               </div>
            </div>
            <button
              onClick={() => navigate("/lesson5/5.5")}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-purple-500 transition shadow-lg transform hover:scale-[1.02]"
            >
              Next Lesson →
            </button>
            <button 
              onClick={restartLesson}
              className="mt-4 text-sm text-gray-500 hover:text-purple-400 transition font-medium"
            >
              Load Another Paragraph
            </button>
          </div>
        </div>
      )}

    </div>
  );
}