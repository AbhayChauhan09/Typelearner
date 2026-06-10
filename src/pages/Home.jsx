import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#04050b] flex flex-col items-center pt-[150px] pb-24 px-4 sm:px-8 font-sans overflow-x-hidden box-border relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* =========================================
          HERO SECTION (The Explanation)
          ========================================= */}
      <div className="text-center max-w-4xl z-10 relative mb-20 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-purple-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          System Online
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
          Type Like the  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Wind.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-400 leading-relaxed mb-10">
          An advanced, high-stakes typing environment designed to push your WPM to the absolute limit. 
          Build muscle memory through structured lessons, then test your skills in intense survival simulations.
        </p>

        <button 
          onClick={() => navigate("/lessons")}
          className="bg-white text-black font-black text-lg px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] uppercase tracking-widest"
        >
          Begin Training sequence
        </button>
      </div>

      {/* =========================================
          NAVIGATION CARDS GRID
          ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-[1400px] z-10 relative mt-10">

        {/* 1. LESSONS CARD (Emerald Glow) */}
        <div 
          onClick={() => navigate("/lessons")}
          className="group cursor-pointer bg-[#080914]/90 backdrop-blur-xl border-2 border-white/5 hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col shadow-lg hover:shadow-[0_10px_40px_rgba(16,185,129,0.15)]"
        >
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border-2 border-emerald-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            📚
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Curriculum</h2>
          <p className="text-gray-400 text-sm leading-relaxed flex-1">
            Step-by-step structural learning. Master home-row positioning and complex keystrokes to build flawless accuracy.
          </p>
          <div className="mt-6 flex items-center text-emerald-400 font-bold text-sm uppercase tracking-widest group-hover:text-emerald-300">
            Access Database →
          </div>
        </div>

        {/* 2. GAMES CARD (Cyan Glow) */}
        <div 
          onClick={() => navigate("/games")}
          className="group cursor-pointer bg-[#080914]/90 backdrop-blur-xl border-2 border-white/5 hover:border-cyan-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col shadow-lg hover:shadow-[0_10px_40px_rgba(6,182,212,0.15)]"
        >
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl border-2 border-cyan-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            🎮
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Simulations</h2>
          <p className="text-gray-400 text-sm leading-relaxed flex-1">
            High-stress typing challenges. Escape vehicles and pop targets to test your speed under pressure.
          </p>
          <div className="mt-6 flex items-center text-cyan-400 font-bold text-sm uppercase tracking-widest group-hover:text-cyan-300">
            Deploy Scenarios →
          </div>
        </div>

        {/* 3. PROFILE CARD (Purple Glow) */}
        <div 
          onClick={() => navigate("/profile")}
          className="group cursor-pointer bg-[#080914]/90 backdrop-blur-xl border-2 border-white/5 hover:border-purple-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col shadow-lg hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)]"
        >
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl border-2 border-purple-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            👤
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Operative Profile</h2>
          <p className="text-gray-400 text-sm leading-relaxed flex-1">
            Track your metrics. View your historical WPM, accuracy rates, and pinpoint which keys need the most practice.
          </p>
          <div className="mt-6 flex items-center text-purple-400 font-bold text-sm uppercase tracking-widest group-hover:text-purple-300">
            View Analytics →
          </div>
        </div>

        {/* 4. KIDS CARD (Amber Glow) */}
        <div 
          onClick={() => navigate("/kids")}
          className="group cursor-pointer bg-[#080914]/90 backdrop-blur-xl border-2 border-white/5 hover:border-amber-500/50 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 flex flex-col shadow-lg hover:shadow-[0_10px_40px_rgba(245,158,11,0.15)]"
        >
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl border-2 border-amber-500/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            🚀
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Junior Academy</h2>
          <p className="text-gray-400 text-sm leading-relaxed flex-1">
            A beginner-friendly safe zone for younger typists. Slower speeds, colorful targets, and no high-stress timers.
          </p>
          <div className="mt-6 flex items-center text-amber-400 font-bold text-sm uppercase tracking-widest group-hover:text-amber-300">
            Enter Kids Zone →
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;