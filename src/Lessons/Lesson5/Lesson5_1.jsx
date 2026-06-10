import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Image Assets
import lessonKeyboard from "../../assets/lesson5.2.png";

export default function Lesson5_1() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("A");

  // Left hand keys that require the Right Shift key
  const leftHandKeys = ["A", "S", "D", "F", "E", "R", "T"];
  // Right hand keys that require the Left Shift key
  const rightHandKeys = ["J", "K", "L", ";", "U", "I", "O"];

  const handleKeyInteraction = (key) => {
    setSelectedKey(key);
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0D1A] text-white flex flex-col items-center px-10 pb-16 font-sans select-none">
      
      {/* Top Header Navigation bar */}
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center mb-10 mt-8">
        <button
          onClick={() => navigate("/lessons")}
          className="px-6 py-2.5 bg-[#111A31] border border-[#232F4D] rounded-xl text-sm font-medium hover:bg-[#1C2744] transition flex items-center gap-2 shadow-sm text-gray-300"
        >
          <span>←</span> Back to Lessons
        </button>
        <button
          onClick={() => navigate("/lesson5/5.2")}
          className="px-7 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/30"
        >
          Next Lesson →
        </button>
      </div>

      {/* Main Page Title Header */}
      <h1 className="text-4xl font-extrabold tracking-wide text-center w-full max-w-[1440px] mx-auto mb-12">
        Lesson 5.1 — Shift Key Cross-Coordination Guide
      </h1>

      {/* Main Content Responsive Dashboard Grid layout */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">
        
        {/* LEFT COLUMN: PRIMARY STORY READING & VIRTUAL TRACKER PANEL */}
        <div className="flex flex-col gap-10 w-full">
          
          {/* FIXED: Replaced absolute purple bar with a solid native border-l layout */}
          <div className="bg-[#111827] border border-[#2b3245] border-l-[10px] border-l-purple-500 rounded-[36px] p-12 md:p-14 shadow-2xl">
            
            <h2 className="text-3xl font-extrabold text-purple-400 mb-8 flex items-center gap-3 tracking-wide">
              <span>👑</span> The Secret of the Royal Gatekeepers
            </h2>
            
            <p className="text-3xl leading-loose text-gray-200 tracking-wide font-normal">
              Picture your keyboard as a divided kingdom, where your pinky fingers act as the royal gatekeepers of the{" "}
              <span className="text-purple-400 font-bold">Shift</span> keys, executing a perfectly synchronized dance of opposites. 
              When your right hand aims to strike the letters{" "}
              <span className="text-[#00E676] font-bold font-mono">J, K, L, or the semicolon (;)</span>, or reaches upward for the vowels{" "}
              <span className="text-[#00E676] font-bold font-mono">U, I, or O</span>, your{" "}
              <span className="underline decoration-purple-500 decoration-2 underline-offset-8 font-bold text-white">left pinky</span>{" "}
              anchors down on the left Shift key like a steady weight. Conversely, when your left hand dances across{" "}
              <span className="text-[#FFC107] font-bold font-mono">A, S, D, F</span>, or stretches to the upper tier for{" "}
              <span className="text-[#FFC107] font-bold font-mono">E, R, or T</span>, your{" "}
              <span className="underline decoration-purple-500 decoration-2 underline-offset-8 font-bold text-white">right pinky</span>{" "}
              mirrors the movement, pressing firmly on the right Shift key. It is a flawless rule of cross-coordination: 
              to elevate any letter on the left side of your domain, your right pinky commands the shift, and to amplify any letter on the right, 
              your left pinky takes the charge, ensuring your hands never collide in their quest for capitalization.
            </p>
          </div>

          {/* Interactive Visualizer Segment */}
          <div className="bg-[#02040f] border border-[#1b2236] rounded-[36px] p-12 shadow-2xl flex flex-col items-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10 text-center block">
              INTERACTIVE GUIDE: CLICK OR HOVER OVER A KEY TO VISUALIZE ITS SHIFT PATH
            </span>

            <div className="w-full flex flex-col items-center gap-8">
              {/* Layout Button Rail Cluster */}
              <div className="flex flex-wrap gap-3 justify-center bg-[#070B19] p-5 rounded-2xl border border-gray-800/80 w-full max-w-[760px]">
                {/* Left side hand territory cluster rendered */}
                {leftHandKeys.map((key) => (
                  <button
                    key={key}
                    onMouseEnter={() => handleKeyInteraction(key)}
                    onClick={() => handleKeyInteraction(key)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black font-mono transition-all border
                      ${selectedKey === key 
                        ? "bg-amber-500 border-amber-300 text-black scale-110 shadow-xl shadow-amber-500/20" 
                        : "bg-[#1F2A44] border-[#2b3245] text-amber-400/90 hover:border-amber-400 hover:scale-105"}
                    `}
                  >
                    {key}
                  </button>
                ))}

                {/* Right side hand territory cluster rendered */}
                {rightHandKeys.map((key) => (
                  <button
                    key={key}
                    onMouseEnter={() => handleKeyInteraction(key)}
                    onClick={() => handleKeyInteraction(key)}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black font-mono transition-all border
                      ${selectedKey === key 
                        ? "bg-[#00E676] border-emerald-300 text-black scale-110 shadow-xl shadow-emerald-500/30" 
                        : "bg-[#1F2A44] border-[#2b3245] text-emerald-400/90 hover:border-emerald-400 hover:scale-105"}
                    `}
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Dynamic Bottom Rail Shift Key Modules */}
              <div className="w-full max-w-[760px] flex justify-between gap-6 mt-4">
                {/* Left Shift Button Visualizer */}
                <div className={`px-6 py-5 rounded-xl border font-mono text-sm font-bold transition-all uppercase tracking-wider flex flex-col items-center justify-center w-1/2 min-h-[76px]
                  ${selectedKey && rightHandKeys.includes(selectedKey)
                    ? "bg-[#004D40]/60 border-[#00E676] text-[#00E676] shadow-lg shadow-emerald-950/50 scale-[1.02] ring-2 ring-emerald-500/20" 
                    : "bg-[#161f33]/40 border-gray-800 text-gray-600"}
                `}>
                  <span>Left Shift Key</span>
                  <span className="text-xs opacity-75 mt-1.5 font-sans tracking-normal normal-case font-medium">(Pressed by Left Pinky)</span>
                </div>

                {/* Right Shift Button Visualizer */}
                <div className={`px-6 py-5 rounded-xl border font-mono text-sm font-bold transition-all uppercase tracking-wider flex flex-col items-center justify-center w-1/2 min-h-[76px]
                  ${selectedKey && leftHandKeys.includes(selectedKey)
                    ? "bg-[#4D3800]/50 border-amber-500 text-amber-400 shadow-lg shadow-amber-950/50 scale-[1.02] ring-2 ring-amber-500/20" 
                    : "bg-[#161f33]/40 border-gray-800 text-gray-600"}
                `}>
                  <span>Right Shift Key</span>
                  <span className="text-xs opacity-75 mt-1.5 font-sans tracking-normal normal-case font-medium">(Pressed by Right Pinky)</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: SYSTEM SUMMARY ANALYSIS & BLUEPRINTS */}
        <div className="flex flex-col gap-8 w-full">
          
          {/* Target Analytics Box */}
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-8 shadow-xl flex flex-col items-center text-center justify-center min-h-[200px]">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Target Key Analysis</p>
            <h3 className={`text-7xl font-black font-mono mb-3 ${leftHandKeys.includes(selectedKey) ? "text-amber-400" : "text-[#00E676]"}`}>
              {selectedKey || "—"}
            </h3>
            <p className="text-sm text-gray-300 max-w-[320px] leading-relaxed mt-1">
              {leftHandKeys.includes(selectedKey) ? (
                <span>Struck with the <strong>Left Hand</strong>. Requires holding down the <strong className="text-amber-400">Right Shift</strong> with your right pinky finger.</span>
              ) : (
                <span>Struck with the <strong>Right Hand</strong>. Requires holding down the <strong className="text-[#00E676]">Left Shift</strong> with your left pinky finger.</span>
              )}
            </p>
          </div>

          {/* Expanded Cross-Coordination Rules Card */}
          <div className="bg-[#111827] border border-[#2b3245] rounded-3xl p-8 shadow-xl flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-800/80 pb-3">
              Cross-Coordination Rules
            </h3>
            
            {/* Right Shift block rules */}
            <div className="bg-[#0A0D1A] p-6 rounded-xl border border-amber-500/10 transition-all hover:border-amber-500/20">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🛡️</span> Right Pinky Shift Rules
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Applies to left side reaches: <strong className="text-white font-mono bg-[#1E293B] px-1.5 py-0.5 rounded text-xs">A, S, D, F, E, R, T</strong>. Your right pinky drops onto the Right Shift while your left hand extends to the letter.
              </p>
            </div>

            {/* Left Shift block rules */}
            <div className="bg-[#0A0D1A] p-6 rounded-xl border border-emerald-500/10 transition-all hover:border-emerald-500/20">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>🛡️</span> Left Pinky Shift Rules
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                Applies to right side reaches: <strong className="text-white font-mono bg-[#1E293B] px-1.5 py-0.5 rounded text-xs">J, K, L, ;, U, I, O</strong>. Your left pinky drops onto the Left Shift while your right hand extends to the letter.
              </p>
            </div>
          </div>

          {/* Asset Window Box */}
          <div className="bg-[#050816] p-5 rounded-3xl border border-[#2b3245] flex flex-col items-center justify-center shadow-xl">
            <img src={lessonKeyboard} alt="Hardware map blueprint reference" className="w-full h-auto max-h-[170px] object-contain rounded-xl" />
            <span className="text-[10px] text-gray-500 mt-4 font-mono uppercase tracking-widest">Hardware Reference</span>
          </div>

        </div>

      </div>
    </div>
  );
}