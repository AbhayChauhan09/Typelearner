import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson1.png";

export default function Lesson1_1() {
  const navigate = useNavigate();

  function goBack() {
    navigate("/lessons");
  }

  useEffect(() => {
    function handleContinue(e) {
      if (e.code === "Space") {
        e.preventDefault();
        navigate("/lesson1/1.2");
      }
    }

    window.addEventListener("keydown", handleContinue);
    return () => window.removeEventListener("keydown", handleContinue);
  }, [navigate]);

  return (
    /* FIXED: Added "items-center justify-center flex-1" to center the workspace cards perfectly on screen */
    <div className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col items-center outline-none px-8 pb-8 select-none">
      
      {/* Header Bar with Action Controls */}
      <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center mb-6 mt-4">
        <div className="flex gap-4">
          <button
            onClick={goBack}
            className="px-5 py-2 bg-[#111A31] border border-[#232F4D] rounded-xl text-md hover:bg-[#1C2744] transition flex items-center gap-2 font-medium shadow-sm"
          >
            <span>←</span> Back to Lessons
          </button>
        </div>
      </div>

      {/* Centered Title */}
      <h1 
        className="text-4xl font-bold tracking-wide text-center w-full max-w-[1400px] mx-auto"
        style={{ marginBottom: "50px" }}
      >
        Lesson 1.1 — Home Row Introduction
      </h1>

      {/* Rebuilt Layout Container Map to match premium look */}
      <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center bg-[#111827] border border-[#2b3245] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow styling accent strip backplate element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60" />

        <p className="text-xl text-gray-400 font-medium tracking-wide text-center mb-8 uppercase">
          In this lesson you will learn:
        </p>

        {/* Highlighted Target Key Ring Array Indicator Display */}
        <div className="flex gap-4 justify-center items-center mb-12 w-full flex-wrap">
          {["A", "S", "D", "F", "J", "K", "L", ";"].map((char, index) => (
            <div 
              key={index}
              className="px-6 py-4 rounded-2xl bg-purple-950/40 text-purple-300 font-mono font-black text-3xl border-2 border-purple-500/30 shadow-md min-w-[75px] text-center"
            >
              {char}
            </div>
          ))}
        </div>

        {/* Central Layout Reference Hardware Frame */}
        <div className="bg-[#02040f] border border-[#1b2236] rounded-[24px] p-8 shadow-inner w-full max-w-[700px] flex flex-col items-center justify-center mb-12">
          <img
            src={lessonKeyboard}
            alt="Typing Lesson Home Row configuration guide"
            className="w-full h-auto max-h-[260px] object-contain rounded-xl border border-[#222]"
          />
          <span className="text-[11px] text-gray-500 mt-2 block tracking-wider font-mono">lesson1.png</span>
        </div>

        {/* Interactive Workspace Continuous Continuation Badge Row */}
        <div className="w-full max-w-[460px] mx-auto rounded-2xl bg-[#0F172A] border border-[#2b3245] p-5 flex items-center justify-center shadow-lg animate-pulse">
          <p className="text-xl text-purple-400 font-bold tracking-widest font-sans uppercase">
            Press [SPACE] to continue ⚔️
          </p>
        </div>

      </div>
    </div>
  );
}