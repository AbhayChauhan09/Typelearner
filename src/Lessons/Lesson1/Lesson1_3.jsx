import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson1.png";

const paragraph = "asdf jkl; asdf jkl; sadf lkj; fjdsa ;lkj";

export default function Lesson1_3() {
  const navigate = useNavigate();

  // State Management
  const [typed, setTyped] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wrongKeyLog, setWrongKeyLog] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [letterStates, setLetterStates] = useState(new Array(paragraph.length).fill("untyped"));

  const mainDivRef = useRef(null);

  useEffect(() => {
    if (mainDivRef.current) mainDivRef.current.focus();
  }, []);

  /* TIMER LOGIC */
  useEffect(() => {
    let timer;
    if (isTyping && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
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
    }
    return () => clearInterval(timer);
  }, [isTyping, timeLeft, gameOver]);

  const handleKeyDown = (e) => {
    if (showPopup) {
      if (e.key === " ") {
        e.preventDefault();
        navigate("/lesson1/1.4");
      }
      return;
    }
    if (gameOver) return;

    const key = e.key;
    const currentIndex = typed.length;

    if (!isTyping && (key.length === 1 || key === " ")) setIsTyping(true);

    if (key === "Backspace") {
      e.preventDefault();
      if (currentIndex > 0) {
        const deletedIndex = currentIndex - 1;
        if (letterStates[deletedIndex] === "correct") setCorrectCount((prev) => Math.max(0, prev - 1));
        else if (letterStates[deletedIndex] === "wrong") setWrongCount((prev) => Math.max(0, prev - 1));

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

    if (key.length === 1 || key === " ") {
      e.preventDefault();
      if (currentIndex >= paragraph.length) return;

      const expectedChar = paragraph[currentIndex];
      const isCorrect = key === expectedChar;

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
        let display = key === " " ? "SPACE" : key;
        if (key !== " " && expectedChar !== " " && key === key.toUpperCase() && expectedChar === expectedChar.toLowerCase()) {
          display = "YOU TYPED IN CAPITAL LETTERS";
        }
        setWrongKeyLog(display);
      }

      const updatedTyped = typed + key;
      setTyped(updatedTyped);

      if (updatedTyped.length === paragraph.length) {
        setGameOver(true);
        setShowPopup(true);
      }
    }
  };

  const accuracy = (correctCount + wrongCount) === 0 ? 100 : Math.round((correctCount / (correctCount + wrongCount)) * 100);
  const wpm = ((60 - timeLeft) / 60) > 0 ? Math.round((correctCount / 5) / ((60 - timeLeft) / 60)) : 0;
  const nextTargetChar = paragraph[typed.length]?.toUpperCase();
  const topKeys = ["A", "S", "D", "F", "J", "K", "L", ";"];

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} ref={mainDivRef} className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col outline-none px-8 pb-8 select-none">
      <style>{`
        .forced-purple-scroll::-webkit-scrollbar { width: 8px; }
        .forced-purple-scroll::-webkit-scrollbar-thumb { background-color: #9333ea; border-radius: 20px; }
      `}</style>

      {/* Header */}
      <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center mb-6 mt-4">
        <div className="flex gap-4">
            <button onClick={() => navigate("/lesson1/1.2")} className="px-5 py-2 bg-[#111A31] border border-[#232F4D] rounded-xl hover:bg-[#1C2744] transition flex items-center gap-2">◀ Previous</button>
            <button onClick={() => navigate("/lessons")} className="px-5 py-2 bg-[#111A31] border border-[#232F4D] rounded-xl hover:bg-[#1C2744] transition">Lessons</button>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-center w-full max-w-[1400px] mx-auto mb-16">Lesson 1.3 Practice</h1>

      {/* Main Content Grid */}
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-[180px_1fr_240px] gap-8 items-start">
        
        {/* Statistics */}
        <div className="flex flex-col gap-5">
          {[{label: "Time", val: `${timeLeft}s`}, {label: "Accuracy", val: `${accuracy}%`}, {label: "WPM", val: wpm}].map(item => (
            <div key={item.label} className="bg-[#111827] border border-[#2b3245] rounded-3xl p-6 text-center">
              <p className="text-gray-400 text-sm">{item.label}</p>
              <h2 className="text-4xl font-bold text-[#7ED321]">{item.val}</h2>
            </div>
          ))}
        </div>

        {/* Typing Area */}
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-[1fr_200px] gap-6 bg-[#111827] border border-[#2b3245] rounded-[32px] p-6">
            <div className="flex flex-wrap gap-2.5 justify-center">
              {topKeys.map(key => <div key={key} className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold border ${nextTargetChar === key ? "bg-purple-600 border-purple-400" : "bg-[#1F2A44] border-[#2b3245]"}`}>{key}</div>)}
              <div className={`w-24 h-11 rounded-lg flex items-center justify-center font-bold border ${nextTargetChar === " " ? "bg-purple-600 border-purple-400" : "bg-[#1F2A44] border-[#2b3245]"}`}>SPACE</div>
            </div>
            <img src={lessonKeyboard} alt="Keyboard layout" className="max-h-[120px] object-contain rounded-xl" />
          </div>

          <div className="bg-[#02040f] border border-[#1b2236] rounded-[32px] p-6 h-[340px] forced-purple-scroll overflow-y-auto">
            {paragraph.split("").map((char, index) => (
              <span key={index} className={`${letterStates[index] === "correct" ? "text-[#7ED321]" : letterStates[index] === "wrong" ? "text-red-500 bg-red-900/20" : index === typed.length ? "bg-purple-600/40 border-l-2 border-purple-400" : "text-gray-600"} transition-colors font-mono text-4xl`}>
                {char === " " && letterStates[index] === "wrong" ? "␣" : char}
              </span>
            ))}
          </div>
        </div>

        {/* Error Monitor */}
        <div className="flex flex-col gap-4 w-full">
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-4 min-h-[160px]">
            <p className="text-gray-400 text-xs uppercase mb-1">Target Key</p>
            <h2 className="text-7xl font-black text-[#7ED321]">{paragraph[typed.length] || "—"}</h2>
          </div>
          <div className="bg-[#0f172a] border border-[#2b3245] rounded-2xl p-4 min-h-[145px] flex flex-col items-center">
            <p className="text-xs font-bold text-gray-300 uppercase">Wrong Keys Log</p>
            {wrongKeyLog && <span className="bg-red-950 text-red-400 border border-red-600 px-4 py-2 mt-4 rounded-xl">{wrongKeyLog}</span>}
          </div>
        </div>
      </div>

      {/* End Practice Button */}
      <div className="fixed bottom-8 right-8">
        <button onClick={() => navigate("/lessons")} className="flex items-center gap-2 px-6 py-3 bg-[#111827] border border-[#2b3245] hover:border-red-900 hover:bg-red-950/20 text-gray-400 hover:text-red-400 rounded-2xl font-bold transition-all">
          ✕ End Practice
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[35px] p-10 text-center">
            <h2 className="text-5xl font-bold text-purple-500 mb-8">Practice Complete!</h2>
            <div className="bg-purple-600 px-8 py-4 rounded-2xl text-xl font-bold">Press [SPACE] to continue</div>
          </div>
        </div>
      )}
    </div>
  );
}