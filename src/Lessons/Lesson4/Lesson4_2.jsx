import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson4.1.png";

// Paragraph structure matching the requested multi-word sequence template pattern
const paragraph = `
to ot tt oo to to toot oto to ot tt oo to to toot oto to ot tt oo to to toot oto to ot tt oo to to toot oto to ot tt oo to to toot oto to ot tt oo to to toot oto to ot tt oo to to toot oto to ot tt oo to to toot oto
`.trim();

export default function Lesson4_2() {
  const navigate = useNavigate();

  // State Management
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // Swapped to a standard longer practice window for text paragraphs
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [wrongKeyLog, setWrongKeyLog] = useState("");

  // Track the state of each letter character: "correct", "wrong", or "untyped"
  const [letterStates, setLetterStates] = useState(new Array(paragraph.length).fill("untyped"));

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
    /* POPUP SHORTCUT ACTIONS SETUP */
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        navigate("/lesson4/4.3");
      }
      return;
    }

    if (gameOver) return;

    const key = e.key;
    const currentIndex = typed.length;

    /* BOOTSTRAP TIMER INITIALIZATION */
    if (!startTime) {
      setStartTime(Date.now());
    }

    /* BACKSPACE CONTROL HANDLER */
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

    /* TYPING ELEMENT SELECTION INGESTION */
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

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={mainDivRef}
      className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col outline-none px-8 pb-8 select-none"
    >
      {/* Custom injected styling matrix rules for continuous typing container scrolls */}
      <style dangerouslySetInnerHTML={{__html: `
        .forced-purple-scroll::-webkit-scrollbar {
          width: 8px !important;
        }
        .forced-purple-scroll::-webkit-scrollbar-track {
          background: transparent !important;
        }
        .forced-purple-scroll::-webkit-scrollbar-thumb {
          background-color: #9333ea !important;
          border-radius: 20px !important;
        }
        .forced-purple-scroll {
          scrollbar-width: thin !important;
          scrollbar-color: #9333ea transparent !important;
        }
      `}} />

      {/* Header Bar Back Selection Controls */}
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

      {/* Title Header */}
      <h1 
        className="text-4xl font-bold tracking-wide text-center w-full max-w-[1400px] mx-auto"
        style={{ marginBottom: "60px" }}
      >
        Lesson 4.2 Practice
      </h1>

      {/* Three-Column Interface Grid Template Layout Matrix */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-[180px_1fr_240px] gap-8 items-start">
        
        {/* LEFT PROFILE TELEMETRY TRACKERS */}
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

        {/* CENTER INTERACTIVE ENGINE COLUMN */}
        <div className="flex flex-col gap-6 w-full">
          {/* Top Panel Map Frame Wrapper */}
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
                alt="keyboard configuration map display reference"
                className="w-full h-auto max-h-[160px] object-contain rounded-xl"
              />
              <span className="text-[11px] text-gray-500 mt-1 block tracking-wider font-mono">lesson4.2.png</span>
            </div>
          </div>

          {/* REBUILT: Paragraph Flow Stream Container Workspace Area Box */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[32px] shadow-2xl relative flex flex-col" style={{ padding: "24px", height: "340px" }}>
            <div 
              className="forced-purple-scroll flex-1 overflow-y-auto text-3xl text-left font-semibold select-none font-mono"
              style={{ height: "100%", width: "100%", paddingRight: "4px", lineHeight: "3.5rem", letterSpacing: "2px" }}
            >
              {paragraph.split("").map((char, index) => {
                let colorClass = "text-gray-600"; 
                
                if (letterStates[index] === "correct") {
                  colorClass = "text-[#7ED321]"; 
                } else if (letterStates[index] === "wrong") {
                  colorClass = "text-red-500 bg-red-900/20 underline decoration-red-500 font-bold"; 
                }

                if (index === typed.length) {
                  colorClass = "text-white bg-purple-600/40 px-[2px] rounded font-bold border-l-2 border-purple-400 animate-pulse";
                }

                return (
                  <span key={index} className={`${colorClass} transition-colors duration-150`}>
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT ANALYTICAL INSTRUCTIONS MONITOR COLUMN */}
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-4 shadow-xl flex flex-col items-center justify-center min-h-[160px]">
            <p className="text-gray-400 text-xs font-medium self-start w-full text-left mb-1 uppercase tracking-wider">Target Key</p>
            <h2 className="text-7xl font-black text-[#7ED321] tracking-normal font-mono leading-none">
              {paragraph[typed.length] === " " ? "␣" : paragraph[typed.length] || "—"}
            </h2>
          </div>

          <div className="bg-[#111827] border border-[#2b3245] rounded-2xl p-3 shadow-md flex justify-between items-center px-4">
            <p className="text-gray-400 text-xs font-medium tracking-wide">Typed Characters</p>
            <h3 className="text-xl font-bold text-white font-mono">{typed.length}</h3>
          </div>

          <div className="bg-[#111827] border border-[#2b3245] rounded-2xl p-3 shadow-md flex justify-between items-center px-4">
            <p className="text-gray-400 text-xs font-medium tracking-wide">Remaining</p>
            <h3 className="text-xl font-bold text-[#7ED321] font-mono">{paragraph.length - typed.length}</h3>
          </div>

          {/* WRONG KEYS CONTAINER POPUP WIDGET FRAME */}
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

      {/* POPUP ACCURACY COMPLETION SCORECARD MODAL */}
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