import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson7.3.png";

// Hand territories for Shift tracking and styling indicators
const leftHandKeys = ["Shift", "A", "S", "D", "F", "E", "R", "T", "C", "G"];
const rightHandKeys = ["'", "\"", "j", "k", "l", ";", "u", "i", "o", ",", "h"];

// Generates practice streams containing ONLY ''', '"', and spaces
const generateWordParagraph = () => {
  const templates = [
    "' \" ' ' \" ' \" \" ' ' ' \" ' \" ' ' \" \" ' ' \" ' \" ' ' \" ' \"",
    "\" \" ' ' \" ' \" ' \" ' \" ' ' \" ' \" ' \" ' \" ' \" ' ' \" ' \" ' '",
    "' \" ' ' ' \" ' \" ' ' \" ' \" ' \" \" ' ' \" ' \" ' ' \" ' \" ' ' \"",
    "' ' \" \" ' ' \" ' \" ' ' \" ' \" ' ' \" ' ' \" \" ' ' \" ' \" ' ' \"",
    "\" ' \" ' \" \" ' ' \" ' \" ' ' \" ' \" ' ' \" ' \" ' ' \" \" ' ' \" '"
  ];

  const randomParagraph = templates[Math.floor(Math.random() * templates.length)];
  return randomParagraph.split("");
};

export default function Lesson7_2() {
  const navigate = useNavigate();

  // Settings Configuration
  const [selectedDuration, setSelectedDuration] = useState(60); // Default to 60s

  // Core Typing State Machine
  const [practiceText, setPracticeText] = useState(() => generateWordParagraph());
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wrongKeyLog, setWrongKeyLog] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false);

  const mainDivRef = useRef(null);

  // Sync clock when user updates settings
  useEffect(() => {
    if (!startTime) {
      setTimeLeft(selectedDuration);
    }
  }, [selectedDuration, startTime]);

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
        navigate("/Lesson7/7.3");
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

        if (expectedChar === "'") {
          displayInstruction = "PRESS APOSTROPHE USING RIGHT PINKY FINGER";
        } else if (expectedChar === "\"") {
          displayInstruction = "HOLD LEFT SHIFT (LEFT PINKY) + PRESS APOSTROPHE KEY";
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

  const restartLesson = (duration = selectedDuration) => {
    setPracticeText(generateWordParagraph());
    setTyped("");
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(duration);
    setGameOver(false);
    setStartTime(null);
    setWrongKeyLog("");
    setShowPopup(false);
    setIsShiftActive(false);
    setTimeout(() => {
      if (mainDivRef.current) mainDivRef.current.focus();
    }, 10);
  };

  const handleTimerChange = (seconds) => {
    setSelectedDuration(seconds);
    restartLesson(seconds);
  };

  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((correctCount / totalAttempts) * 100);
  
  const timeElapsedSeconds = selectedDuration - timeLeft;
  const minutes = timeElapsedSeconds > 0 ? timeElapsedSeconds / 60 : 0.01;
  const wpm = Math.round((correctCount / 5) / minutes) || 0;

  const nextTargetChar = practiceText[typed.length] || "—";

  // Light up Left Shift module strictly when a Quote (") is required
  const dynamicShiftTarget = nextTargetChar === "\"";

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
          className="px-6 py-4 bg-[#111A31] border border-[#232F4D] rounded-xl text-base font-medium hover:bg-[#1C2744] transition flex items-center gap-2 shadow-sm text-gray-300"
        >
          <span>←</span> Back to Lessons
        </button>

        {/* Top bar Control Panel */}
        <div className="flex items-center gap-8">
          {/* Taller Multi-Duration Selector Module */}
          <div className="bg-[#111827] border border-[#2b3245] p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
            <span className="text-base font-extrabold text-purple-400 px-3 uppercase tracking-wider">
              Goal Duration:
            </span>
            {[30, 60, 100].map((seconds) => (
              <button
                key={seconds}
                onClick={() => handleTimerChange(seconds)}
                className={`px-8 py-4.5 rounded-xl text-base font-black font-mono transition-all duration-200 min-w-[85px] text-center
                  ${selectedDuration === seconds 
                    ? "bg-purple-600 text-white shadow-xl shadow-purple-900/40 scale-105 border border-purple-400" 
                    : "text-gray-400 hover:text-white hover:bg-[#1f293d] border border-transparent"
                  }`}
              >
                {seconds}s
              </button>
            ))}
          </div>

          {/* Big Restart Button */}
          <button
            onClick={() => restartLesson()}
            className="px-8 py-5 bg-[#1F2A44] border border-[#2b3245] rounded-xl text-base font-bold hover:bg-[#2A395C] transition flex items-center gap-2 shadow-md text-purple-400"
          >
            🔄 Reset Target Stream
          </button>
        </div>
      </div>

      {/* Main Header Title */}
      <h1 className="text-4xl font-extrabold tracking-wide text-center w-full max-w-[1440px] mx-auto mb-12">
        Lesson7_2 Isolated Punctuation Drill — Apostrophe ['] and Quote ["]
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
          
          {/* WORKBENCH CARD */}
          <div className="bg-[#111827] border border-[#2b3245] border-l-[10px] border-l-purple-500 rounded-2xl px-10 py-8 shadow-2xl flex flex-col w-full">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">💡</span>
              <h2 className="text-xl font-extrabold tracking-wide text-purple-400">
                Fingering Guide for Quotes
              </h2>
            </div>
            <p className="text-md leading-relaxed text-gray-300 font-medium">
              Press the target key with your <span className="text-amber-400 font-bold">Right Pinky Finger</span>. When targeting the quotation mark (<span className="text-purple-400 font-bold">"</span>), anchor down your <span className="text-purple-400 font-bold">Left Pinky Finger</span> onto the Left Shift key.
            </p>
          </div>

          {/* Large Interactive Typable Paragraph Card */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[36px] shadow-2xl flex flex-col p-12 min-h-[320px] justify-center items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">
              {!startTime ? "CLICK HERE & START TYPING THE CODES" : "DRILL IN PROGRESS"}
            </span>
            
            {/* Paragraph Word Stream Layout */}
            <div className="flex flex-wrap gap-x-2 gap-y-4 justify-center max-w-[850px] leading-relaxed">
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
                    className={`text-4xl font-mono transition-all duration-100 font-bold ${colorClass} ${decorationClass}`}
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
                : dynamicShiftTarget
                  ? "bg-[#004D40]/40 border-[#00E676] text-[#00E676] animate-pulse border-dashed border-2 scale-[1.02]" 
                  : "bg-[#161f33]/40 border-gray-800 text-gray-600"}
            `}>
              <span>Left Shift Indicator</span>
              <span className="text-[10px] opacity-75 mt-1 font-sans normal-case tracking-normal">(Hold left pinky for Quote target)</span>
            </div>

            {/* Right Shift Module */}
            <div className="px-6 py-4 rounded-xl border font-mono text-xs font-bold transition-all uppercase tracking-wider flex flex-col items-center justify-center w-1/2 min-h-[64px] bg-[#161f33]/40 border-gray-800 text-gray-600 opacity-40">
              <span>Right Shift Panel</span>
              <span className="text-[10px] mt-1 font-sans normal-case tracking-normal">(Inactive for this layout configuration)</span>
            </div>
          </div>

        </div>

        {/* RIGHT FEEDBACK AND BLUEPRINT CARD */}
        <div className="flex flex-col gap-6 w-full">
          
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-8 shadow-xl flex flex-col items-center text-center justify-center min-h-[180px]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Target Character</p>
            <h3 className={`text-6xl font-black font-mono ${nextTargetChar === " " ? "text-gray-500" : nextTargetChar === "'" ? "text-amber-400" : "text-purple-400"}`}>
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

      {/* MAGNIFIED SUCCESS POPUP MODAL OVERLAY */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-[#02040f] border-2 border-[#2b3245] rounded-[48px] p-16 flex flex-col items-center shadow-2xl text-center max-w-[640px] w-full mx-auto transition-all">
            
            <h2 className="text-5xl font-black text-purple-400 mb-8 tracking-wide">
              Exercise Complete! 🎉
            </h2>
            
            {/* Stats Breakdown Container */}
            <div className="flex gap-16 mb-12 w-full justify-center border-y border-gray-800/60 py-8">
               <div>
                 <p className="text-gray-400 text-sm font-bold uppercase mb-2 tracking-widest">Accuracy</p>
                 <p className="text-5xl font-black text-[#00E676] font-mono">{accuracy}%</p>
               </div>
               <div>
                 <p className="text-gray-400 text-sm font-bold uppercase mb-2 tracking-widest">Speed</p>
                 <p className="text-5xl font-black text-[#00E676] font-mono">{wpm} <span className="text-lg tracking-normal font-sans text-gray-400">WPM</span></p>
               </div>
            </div>
            
            {/* Highly Scannable Grid Action Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[500px]">
              <button
                onClick={() => navigate("/Lesson7/7.3")}
                className="w-full bg-purple-600 text-white px-6 py-5 rounded-2xl text-lg font-black hover:bg-purple-500 active:scale-[0.98] transition shadow-lg shadow-purple-900/30 text-center"
              >
                Next Lesson
              </button>
              
              <button
                onClick={() => navigate("/lessons")}
                className="w-full bg-[#111A31] border-2 border-[#232F4D] text-gray-200 px-6 py-5 rounded-2xl text-lg font-bold hover:bg-[#1C2744] active:scale-[0.98] transition shadow-md text-center"
              >
                Main Menu
              </button>
            </div>

            <button 
              onClick={() => restartLesson()}
              className="mt-8 text-base text-gray-400 hover:text-purple-400 transition font-bold underline underline-offset-4 decoration-purple-500/40"
            >
              🔄 Load New Practice Pool
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
}