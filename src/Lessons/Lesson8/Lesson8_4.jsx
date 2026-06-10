import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson7.3.png";

// Hand territories for advanced cross-coordination Shift tracking (Added period '.')
const leftHandKeys = ["a", "s", "d", "f", "e", "r", "t", "c", "g", "A", "S", "D", "F", "E", "R", "T", "C", "G"];
const rightHandKeys = ["j", "k", "l", ";", "u", "i", "o", ",", "h", "'", "\"", "J", "K", "L", ":", "U", "I", "O", "<", "H", "."];

// Strictly filtered paragraphs using ONLY: asdfghjkl;'cvnmertuio + Shift (", :)
const paragraphLessons = [
  {
    id: 1,
    title: "Core Flow & Punctuation",
    text: "The cat ran to the river. He noticed a cold forest. She ran fast over the hill. The dog is dark red; he ran faster. The ocean is vast and cold.",
    focus: "Home Row, E, I, R, U, T, O, ;, '",
  },
  {
    id: 2,
    title: "Bottom Row & Dialog",
    text: "Mom said: \"Come here.\" He noticed a secret cave. \"The cave is dark,\" she cried. Colin ran into the cave. It is a massive cavern. He found a nice rock.",
    focus: "C, V, N, M, Shift + ; (Colon), Shift + ' (Quotes)",
  },
  {
    id: 3,
    title: "Speed & Capitalization",
    text: "A storm is near. The air is cold. \"Run to the van.\" he shouted. \"Never give in,\" she advised. The man drove the van fast. It is a safe haven.",
    focus: "Shift (Capital Letters), All taught rows combined",
  }
];

export default function Lesson8_4() {
  const navigate = useNavigate();

  // Settings Configuration
  const [selectedDuration, setSelectedDuration] = useState(60);

  // Core Typing State Machine
  const [currentLevel, setCurrentLevel] = useState(0);
  const practiceText = paragraphLessons[currentLevel].text;
  
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
  }, [currentLevel]);

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
        handleNextLevel();
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

        // Check if paragraph is finished before timer runs out
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
          expectedChar !== ":" &&
          expectedChar !== "," &&
          expectedChar !== "." &&
          expectedChar !== "'" &&
          expectedChar !== "\"" &&
          expectedChar === expectedChar.toUpperCase() && 
          typedChar === typedChar.toLowerCase()
        ) {
          displayInstruction = "HOLD SHIFT KEY FOR CAPITAL LETTERS";
        } else if (expectedChar === "'") {
          displayInstruction = "PRESS APOSTROPHE KEY WITH RIGHT PINKY";
        } else if (expectedChar === "\"") {
          displayInstruction = "HOLD LEFT SHIFT + PRESS APOSTROPHE";
        } else if (expectedChar === ":") {
          displayInstruction = "HOLD LEFT SHIFT + PRESS SEMICOLON";
        } else if (expectedChar === ",") {
          displayInstruction = "USE RIGHT MIDDLE FINGER FOR COMMA (,)";
        } else if (expectedChar === ".") {
          displayInstruction = "USE RIGHT RING FINGER FOR PERIOD (.)";
        } else if (expectedChar === "c" || expectedChar === "C") {
          displayInstruction = "USE LEFT MIDDLE FINGER FOR C";
        } else if (expectedChar === "g" || expectedChar === "G") {
          displayInstruction = "STRETCH LEFT INDEX RIGHTWARD FOR G";
        } else if (expectedChar === "h" || expectedChar === "H") {
          displayInstruction = "STRETCH RIGHT INDEX LEFTWARD FOR H";
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

  const handleNextLevel = () => {
    if (currentLevel < paragraphLessons.length - 1) {
      setCurrentLevel(prev => prev + 1);
      restartLesson(selectedDuration);
    } else {
      navigate("/lessons");
    }
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

  const dynamicShiftTarget = nextTargetChar !== "—" && nextTargetChar !== " " 
    ? (nextTargetChar === "\"" || nextTargetChar === ":" || nextTargetChar === nextTargetChar.toUpperCase() && nextTargetChar !== ";" && nextTargetChar !== "," && nextTargetChar !== "'" && nextTargetChar !== ".")
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
          className="px-6 py-4 bg-[#111A31] border border-[#232F4D] rounded-xl text-base font-medium hover:bg-[#1C2744] transition flex items-center gap-2 shadow-sm text-gray-300"
        >
          <span>←</span> Back to Lessons
        </button>

        {/* Top bar Control Panel */}
        <div className="flex items-center gap-8">
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

          <button
            onClick={() => restartLesson()}
            className="px-8 py-5 bg-[#1F2A44] border border-[#2b3245] rounded-xl text-base font-bold hover:bg-[#2A395C] transition flex items-center gap-2 shadow-md text-purple-400"
          >
            🔄 Reset Paragraph
          </button>
        </div>
      </div>

      {/* Main Header Title */}
      <h1 className="text-4xl font-extrabold tracking-wide text-center w-full max-w-[1440px] mx-auto mb-12 uppercase">
         {paragraphLessons[currentLevel].title}
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
              <span className="text-2xl">🧠</span>
              <h2 className="text-xl font-extrabold tracking-wide text-purple-400">
                Paragraph Flow & Formatting
              </h2>
            </div>
            <p className="text-md leading-relaxed text-gray-300 font-medium">
              <span className="text-purple-400 font-bold">Focus Keys: </span> 
              {paragraphLessons[currentLevel].focus}
            </p>
          </div>

          {/* Large Interactive Typable Paragraph Card */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[36px] shadow-2xl flex flex-col p-10 min-h-[360px] justify-center items-center">
            <div className="w-full flex justify-between items-center mb-6 px-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {!startTime ? "CLICK HERE & START TYPING" : "PARAGRAPH IN PROGRESS"}
              </span>
              <span className="text-xs font-bold text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                Paragraph {currentLevel + 1} of {paragraphLessons.length}
              </span>
            </div>
            
            {/* Paragraph Word Stream Layout - Sized down to text-2xl/3xl for paragraphs */}
            <div className="flex flex-wrap gap-x-1.5 gap-y-2 justify-center max-w-[900px] leading-loose text-center">
              {practiceText.split("").map((char, index) => {
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
                    className={`text-2xl lg:text-3xl font-mono transition-all duration-100 font-bold ${colorClass} ${decorationClass}`}
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
              <span className="text-[10px] opacity-75 mt-1 font-sans normal-case tracking-normal">(Hold left pinky for right-side upper targets)</span>
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
              <span className="text-[10px] opacity-75 mt-1 font-sans normal-case tracking-normal">(Hold right pinky for left-side upper targets)</span>
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

      {/* MAGNIFIED SUCCESS POPUP MODAL OVERLAY */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-[#02040f] border-2 border-[#2b3245] rounded-[48px] p-16 flex flex-col items-center shadow-2xl text-center max-w-[640px] w-full mx-auto transition-all">
            
            <h2 className="text-5xl font-black text-purple-400 mb-8 tracking-wide">
              {currentLevel < paragraphLessons.length - 1 ? "Paragraph Cleared! 🚀" : "Stage Complete! 🎉"}
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
            
            {/* Highly Scannable Grid Block Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[500px]">
              <button
                onClick={handleNextLevel}
                className="w-full bg-purple-600 text-white px-6 py-5 rounded-2xl text-lg font-black hover:bg-purple-500 active:scale-[0.98] transition shadow-lg shadow-purple-900/30 text-center"
              >
                {currentLevel < paragraphLessons.length - 1 ? "Next Paragraph" : "Finish Stage"}
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
              🔄 Retry This Paragraph
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
}