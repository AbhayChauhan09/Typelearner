import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson1.png";

const paragraph = `
ask all lads fall; dads ask flask lads. sad lass asks all dads. flask falls; all lads ask dads. all dads ask lads; sad lads fall. flask and salsa fall; all ask dads. lads add all flask salads. sad dads ask all lads. flask falls; lads ask dads. all salsa falls and lads add flask salad.
`.trim();

export default function Lesson1_4() {
  const navigate = useNavigate();

  // Settings Configuration
  const [selectedDuration, setSelectedDuration] = useState(60); // Default to 60s

  // State Management
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [wrongKeyLog, setWrongKeyLog] = useState("");

  const [letterStates, setLetterStates] = useState(new Array(paragraph.length).fill("untyped"));

  const mainDivRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const activeLetterRef = useRef(null);
  const lastLineTopRef = useRef(0); // Tracks current line to prevent scroll-shaking

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

  /* PERFECTED AUTO-SCROLL ENGINE (Scrolls ONLY on line breaks) */
  useEffect(() => {
    if (activeLetterRef.current && scrollContainerRef.current) {
      const elTop = activeLetterRef.current.offsetTop;
      
      // Only trigger a scroll if the cursor has moved to a completely new vertical line
      if (Math.abs(elTop - lastLineTopRef.current) > 10) {
        lastLineTopRef.current = elTop;
        const container = scrollContainerRef.current;
        
        container.scrollTo({
          top: elTop - (container.clientHeight / 2) + 40,
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
      const timeElapsedMinutes = (selectedDuration - timeLeft) / 60;
      if (timeElapsedMinutes > 0) {
        setWpm(Math.round(correctCount / 5 / timeElapsedMinutes));
      }
    }
  }, [startTime, timeLeft, correctCount, gameOver, selectedDuration]);

  const handleKeyDown = (e) => {
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        navigate("/Lesson6/6.2"); // Spacebar short-circuit routes to next sequential block
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

  const restartLesson = (duration = selectedDuration) => {
    setTyped("");
    setCorrectCount(0);
    setWrongCount(0);
    setTimeLeft(duration);
    setGameOver(false);
    setStartTime(null);
    setWrongKeyLog("");
    setShowPopup(false);
    setLetterStates(new Array(paragraph.length).fill("untyped"));
    lastLineTopRef.current = 0; // Reset scroll tracker
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

  const nextTargetChar = paragraph[typed.length]?.toUpperCase();
  const topKeys = ["A", "S", "D", "F", "J", "K", "L", ";"];

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={mainDivRef}
      className="min-h-screen w-full text-white flex flex-col outline-none px-8 pb-8 select-none relative overflow-x-hidden font-sans app-cyber-container"
    >
      {/* GLOBAL BACKGROUND INJECTION RULES */}
      <style dangerouslySetInnerHTML={{__html: `
        .app-cyber-container {
          background-color: #050614 !important;
          position: relative;
        }

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
        
        .glass-panel-fallback {
          background-color: rgba(13, 14, 38, 0.75) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
      `}} />

      {/* Render Dynamic Background Components */}
      <div className="cyber-orb-left" />
      <div className="cyber-orb-right" />

      {/* Top Header bar */}
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center mb-10 mt-8 relative z-10">
        <button
          onClick={() => navigate("/lessons")}
          className="px-6 py-4 bg-[#111A31] border border-[#232F4D] rounded-xl text-base font-medium hover:bg-[#1C2744] transition-all duration-300 flex items-center gap-2 text-gray-300 tracking-wide shadow-lg"
        >
          <span>←</span> Back to Lessons
          
        </button>

        <button
          onClick={() => navigate("/lesson1/1.3")}
          className="px-6 py-4 bg-[#111A31] border border-[#232F4D] rounded-xl text-base font-medium hover:bg-[#1C2744] transition-all duration-300 flex items-center gap-2 text-gray-300 tracking-wide shadow-lg"
        >
          <span>←</span> Previous Lessons
          
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
            🔄 Reset Target Stream
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-wider text-center w-full max-w-[1440px] mx-auto mb-12 relative z-10 text-white drop-shadow-md">
        Lesson 1.4 Practice
      </h1>

      {/* Grid Layout Matrix */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-[200px_1fr_420px] gap-10 items-start relative z-10">
        
        {/* LEFT COLUMN: STATS */}
        <div className="flex flex-col gap-6 w-full">
          {[
            { label: "Time Left", value: `${timeLeft}s`, color: "text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" },
            { label: "Accuracy", value: `${accuracy}%`, color: "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" },
            { label: "WPM", value: wpm, color: "text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" }
          ].map((stat, idx) => (
            <div key={idx} className="glass-panel-fallback rounded-3xl p-6 shadow-2xl relative overflow-hidden group transition-all duration-300 hover:border-white/20 text-center">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className={`text-4xl font-black font-mono transition-all duration-300 ${stat.color}`}>{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* CENTER COLUMN: INTERACTIVE VIEWPORTS */}
        <div className="flex flex-col gap-10 w-full">
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
              <img src={lessonKeyboard} alt="keyboard guide" className="w-full h-auto max-h-[144px] object-contain rounded-lg brightness-90 contrast-105 transition-all duration-300 group-hover:brightness-100" />
              <div className="w-full flex justify-between items-center mt-2 px-1">
                <span className="text-[10px] text-gray-500 font-mono tracking-wider">lesson1.png</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>
          </div>

          {/* MAIN TYPING CANVAS BOX */}
          <div className="bg-[#040516]/90 border border-white/5 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden h-[340px]" style={{ padding: "26px" }}>
            <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#040516] to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#040516] to-transparent pointer-events-none z-10" />
            
            {/* Added overflow-x-hidden and break-words to guarantee no horizontal movement */}
            <div 
              ref={scrollContainerRef}
              className="forced-purple-scroll w-full h-full overflow-y-auto overflow-x-hidden break-words text-3xl text-left font-medium select-none font-mono pr-2 relative"
              style={{ lineHeight: "3.8rem", letterSpacing: "2.5px" }}
            >
              {/* CLEANED UP MAPPING FUNCTION TO STOP SHAKING */}
              {paragraph.split("").map((char, index) => {
                let colorClass = "text-[#3a3f63]"; 
                let isCurrent = index === typed.length;
                
                if (letterStates[index] === "correct") {
                  colorClass = "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]"; 
                } else if (letterStates[index] === "wrong") {
                  colorClass = "text-rose-500 bg-rose-500/20 underline decoration-rose-500 decoration-2"; 
                }

                if (isCurrent) {
                  colorClass = "text-white bg-purple-600/40 underline decoration-purple-400 decoration-[3px] underline-offset-[6px] rounded-sm shadow-[0_0_10px_rgba(168,85,247,0.5)]";
                }

                return (
                  <span 
                    key={index} 
                    ref={isCurrent ? activeLetterRef : null} 
                    className={`${colorClass} transition-colors duration-100 whitespace-pre-wrap`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TARGET TERMINALS */}
        <div className="flex flex-col gap-6 w-full">
          <div className="glass-panel-fallback rounded-3xl p-8 shadow-xl flex flex-col items-center justify-center min-h-[180px] text-center relative overflow-hidden">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 self-start text-left w-full">Target Key</p>
            <h2 className="text-7xl font-black text-emerald-400 tracking-normal font-mono leading-none drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              {paragraph[typed.length] === " " ? "SPACE" : paragraph[typed.length] || "—"}
            </h2>
          </div>

          <div className="glass-panel-fallback rounded-2xl p-5 shadow-lg flex justify-between items-center px-4 transition-all hover:border-white/20">
            <p className="text-gray-400 text-xs font-semibold tracking-wide uppercase text-[10px]">Typed</p>
            <h3 className="text-lg font-bold text-white font-mono">{typed.length}</h3>
          </div>

          <div className="glass-panel-fallback rounded-2xl p-5 shadow-lg flex justify-between items-center px-4 transition-all hover:border-white/20">
            <p className="text-gray-400 text-xs font-semibold tracking-wide uppercase text-[10px]">Remaining</p>
            <h3 className="text-lg font-bold text-emerald-400 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{paragraph.length - typed.length}</h3>
          </div>

          {/* Diagnostic Key Log Terminal */}
          <div className="bg-[#040516]/90 border border-white/5 rounded-2xl p-5 shadow-inner flex flex-col min-h-[140px] justify-between relative overflow-hidden">
            <div className="flex items-center gap-2 w-full justify-center border-b border-white/5 pb-2.5">
              <span className="text-sm text-rose-500 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]">⚠️</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Error Core Log</p>
            </div>
            
            {!wrongKeyLog ? (
              <p className="text-gray-600 text-xs my-auto italic text-center tracking-wide">No input errors tracked</p>
            ) : (
              <div className="flex justify-center items-center h-full pt-2 animate-fadeIn">
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

           
        </div>

      </div>

      {/* End Practice Button */}
      <div className="fixed bottom-8 right-8">
        <button onClick={() => navigate("/lessons")} className="flex items-center gap-2 px-6 py-3 bg-[#111827] border border-[#2b3245] hover:border-red-900 hover:bg-red-950/20 text-gray-400 hover:text-red-400 rounded-2xl font-bold transition-all">
          ✕ End Practice
        </button>
      </div>
 
      {/* MAGNIFIED SUCCESS POPUP MODAL OVERLAY */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-[#02040f] border-2 border-[#2b3245] rounded-[48px] p-16 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.9)] max-w-[640px] w-full mx-auto transition-all">
            
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
            
            {/* Structured Dual Action Grid Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[500px]">
              <button
                onClick={() => navigate("/Lesson2/2.1")}
                className="w-full bg-purple-600 text-white px-6 py-5 rounded-2xl text-lg font-black hover:bg-purple-500 active:scale-[0.98] transition shadow-lg shadow-purple-900/30 text-center"
              >
                Next Lesson →
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
              🔄 Load New Paragraph Pool
            </button>
            
          </div> 
        </div>
      )}
    </div>
  );
}