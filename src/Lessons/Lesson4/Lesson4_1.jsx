import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets (Update the asset filename if you create a specific layout image for 3.4)
import lessonKeyboard from "../../assets/lesson4.1.png";

const practicePairs = [
  "to ", "ot ", "tt ", "oo ", "to ", "ot ", "tt ", "oo", "to ", "ot ", "tt ", "oo ",
];

export default function Lesson4_1() {
  const navigate = useNavigate();

  // State Management
  const [currentPair, setCurrentPair] = useState("");
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // Matches the 10s blitz duration pattern
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wrongKeyLog, setWrongKeyLog] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const mainDivRef = useRef(null);

  useEffect(() => {
    generatePair();
    if (mainDivRef.current) {
      mainDivRef.current.focus();
    }
  }, []);

  /* TIMER */
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

  const generatePair = () => {
    const randomPair = practicePairs[Math.floor(Math.random() * practicePairs.length)];
    setCurrentPair(randomPair);
    setTyped("");
    setStatus("");
    setWrongKeyLog("");
  };

  const handleKeyDown = (e) => {
    /* HANDLE POPUP - PRESS SPACE TO CONTINUE */
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        // Redirect back to main lesson hub or next level sequence
        navigate("/lesson4/4.2");
      }
      return;
    }

    if (gameOver) return;

    const key = e.key;
    const currentIndex = typed.length;

    /* START TIMER */
    if (!startTime) {
      setStartTime(Date.now());
    }

    /* BACKSPACE */
    if (key === "Backspace") {
      e.preventDefault();
      setTyped((prev) => prev.slice(0, -1));
      setStatus("");
      setWrongKeyLog("");
      return;
    }

    /* ALLOWED KEYS TRACKING */
    if (key.length === 1 || key === " ") {
      e.preventDefault();

      if (currentIndex >= currentPair.length) return;

      const expectedChar = currentPair[currentIndex];
      const typedChar = key; 

      // Strict matching case evaluation
      const isCorrect = typedChar === expectedChar;

      if (isCorrect) {
        const updatedTyped = typed + typedChar;
        setTyped(updatedTyped);
        setWrongKeyLog("");

        /* CHECK PAIR COMPLETION */
        if (updatedTyped === currentPair) {
          setCorrectCount((prev) => prev + 1);
          setStatus("Correct ✅");
          setTimeout(() => {
            generatePair();
          }, 250);
        }
      } else {
        /* WRONG KEY PROCESSING */
        setWrongCount((prev) => prev + 1);
        setStatus("Wrong ❌");

        let displayInstruction = typedChar === " " ? "SPACE" : typedChar;

        // Custom validation check if error is due to active capitalization
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
    }
  };

  /* ACCURACY */
  const totalAttempts = correctCount + wrongCount;
  const accuracy = totalAttempts === 0 ? 100 : Math.round((correctCount / totalAttempts) * 100);

  /* WPM */
  const minutes = (10 - timeLeft) / 60 || 1;
  const wpm = Math.round(correctCount / minutes);

  const nextTargetChar = currentPair[typed.length]?.toUpperCase();

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={mainDivRef}
      className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col outline-none px-8 pb-8 select-none"
    >
      {/* Header Bar with Action Controls */}
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

      {/* Centered Title */}
      <h1 
        className="text-4xl font-bold tracking-wide text-center w-full max-w-[1400px] mx-auto"
        style={{ marginBottom: "60px" }}
      >
        T & O Keys Practice
      </h1>

      {/* Main Container Layout Workspace */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-[180px_1fr_240px] gap-8 items-start">
        
        {/* LEFT COLUMN: STATS CARDS */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-gray-400 text-sm mb-1 font-medium text-center">Time</p>
            <h2 className="text-4xl font-bold text-[#7ED321] text-center tracking-tight">{timeLeft}s</h2>
          </div>
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-gray-400 text-sm mb-1 font-medium text-center">Accuracy</p>
            <h2 className="text-4xl font-bold text-[#7ED321] text-center tracking-tight">{accuracy}%</h2>
          </div>
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <p className="text-gray-400 text-sm mb-1 font-medium text-center">WPM</p>
            <h2 className="text-4xl font-bold text-[#7ED321] text-center tracking-tight">{wpm}</h2>
          </div>
        </div>

        {/* CENTER COLUMN: HARDWARE & TEXT TEST PLAYGROUND */}
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-[1fr_minmax(400px,460px)] gap-6 items-center bg-[#111827] border border-[#2b3245] rounded-[32px] p-6 shadow-xl">
            <div className="bg-[#0A0D1A]/60 border border-[#1f293d] rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex flex-wrap gap-2.5 justify-center">
                {["T", "O"].map((key) => (
                  <div
                    key={key}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold transition-all border shadow-md
                      ${
                        nextTargetChar === key
                          ? "bg-purple-600 border-purple-400 text-white scale-105 shadow-purple-900/40"
                          : "bg-[#1F2A44] border-[#2b3245] text-gray-200"
                      }
                    `}
                  >
                    {key}
                  </div>
                ))}
              </div>
              <div className={`w-24 h-7 mx-auto rounded-lg shadow-inner flex items-center justify-center text-[10px] font-bold tracking-wider border transition-colors
                ${nextTargetChar === " " 
                  ? "bg-purple-600 border-purple-400 text-white" 
                  : "bg-[#1F2A44] border-[#2b3245] text-gray-500"
                }`}
              >
                SPACE
              </div>
            </div>

            <div className="bg-[#050816] p-3 rounded-2xl border border-[#222] flex flex-col items-center">
              <img
                src={lessonKeyboard}
                alt="keyboard configuration map"
                className="w-full h-auto max-h-[160px] object-contain rounded-xl"
              />
              <span className="text-[11px] text-gray-500 mt-1 block tracking-wider font-mono">lesson3.4.png</span>
            </div>
          </div>

          {/* Word Display Practice Box Framework Container */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[32px] shadow-2xl relative flex flex-col items-center justify-center" style={{ padding: "24px", height: "340px" }}>
            
            {/* TARGET WORD */}
            <div className="text-6xl font-black tracking-[6px] mb-6 text-purple-500 font-mono">
              {currentPair}
            </div>

            {/* LIVE INPUT ELEMENT FIELD VIEW */}
            <div className="w-[340px] h-[60px] rounded-2xl bg-[#111827] border border-[#2b3245] flex items-center justify-center text-3xl tracking-[4px] mb-4 text-white font-mono shadow-inner">
              {typed}
            </div>

            {/* STATUS ALERT FIELD TEXT */}
            <div className={`text-xl font-medium tracking-wide h-6 ${status.includes("Correct") ? "text-[#7ED321]" : "text-red-500"}`}>
              {status}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHARACTER MONITOR & DYNAMIC INSTRUCTION WIDGET */}
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-4 shadow-xl flex flex-col items-center justify-center min-h-[160px]">
            <p className="text-gray-400 text-xs font-medium self-start w-full text-left mb-1 uppercase tracking-wider">Type This</p>
            <h2 className="text-4xl font-black text-[#7ED321] tracking-normal font-mono break-all w-full text-center">
              {currentPair || "—"}
            </h2>
          </div>

          <div className="bg-[#111827] border border-[#2b3245] rounded-2xl p-3 shadow-md flex justify-between items-center px-4">
            <p className="text-gray-400 text-xs font-medium tracking-wide">You Typed</p>
            <h3 className="text-xl font-bold text-white font-mono">{typed || "_"}</h3>
          </div>

          {/* DYNAMIC WRONG KEYS WIDGET MONITOR PANEL */}
          <div className="bg-[#0f172a] border border-[#2b3245] rounded-2xl p-4 shadow-inner flex flex-col min-h-[145px] justify-between mt-2">
            <div className="flex items-center gap-2 w-full justify-center border-b border-gray-800 pb-2">
              <span className="text-md text-red-500">⚠️</span>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Wrong Keys Log</p>
            </div>
            
            {!wrongKeyLog ? (
              <p className="text-gray-500 text-xs my-auto italic text-center">No active errors</p>
            ) : (
              <div className="flex gap-3 justify-center items-center w-full mt-auto pt-4 pb-1">
                <span
                  className={`font-mono font-black rounded-xl shadow-md transition-all text-center leading-tight
                    ${wrongKeyLog === "YOU TYPED IN CAPITAL LETTERS" 
                      ? "bg-amber-950 text-amber-400 border-2 border-amber-600 text-xs px-3 py-2 font-sans font-bold tracking-wide uppercase" 
                      : "bg-red-950 text-red-400 border-2 border-red-600 px-4 py-2 text-2xl"
                    }
                  `}
                >
                  {wrongKeyLog}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* POPUP COMPLETION MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[35px] p-10 flex flex-col items-center shadow-2xl">
            <h2 className="text-5xl font-bold text-purple-500 mb-8 tracking-wide">
              Practice Complete! ⚔️
            </h2>

            <div className="flex gap-12 mb-10 text-2xl font-bold">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Final WPM</p>
                <p className="text-white text-4xl font-black">{wpm}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Final Accuracy</p>
                <p className="text-white text-4xl font-black">{accuracy}%</p>
              </div>
            </div>

            <div className="bg-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold animate-pulse tracking-wide shadow-lg border border-purple-400">
              Press [SPACE] to continue
            </div>
          </div>
        </div>
      )}
    </div>
  );
}