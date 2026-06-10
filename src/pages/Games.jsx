import React from "react";
import { useNavigate } from "react-router-dom";

// FIXED: Changed "../../" to "../" 
import bubbleImage from "../assets/bubble.png";
import survivalImage from "../assets/cargame.png";

function Games() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#04050b] flex flex-col items-center pt-[180px] pb-24 px-4 sm:px-8 font-sans overflow-y-auto box-border">

      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vh] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Page Header */}
      <div className="text-center mb-16 z-10 relative px-4">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
          Training <span className="text-purple-500">Simulations</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-400">Select a high-stakes environment to push your WPM limits.</p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-[1200px] z-10 relative">

        {/* =========================================
            CARD 1: BUBBLE BLAST
            ========================================= */}
        <div
          onClick={() => navigate("/games/bubble")}
          className="group cursor-pointer bg-[#080914]/90 backdrop-blur-xl border-2 border-cyan-500/30 rounded-[32px] hover:border-cyan-400 hover:bg-[#0c0d1e] transition-all duration-300 relative flex flex-col min-h-[460px] shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_50px_rgba(6,182,212,0.2)]"
        >
          {/* IMAGE BANNER */}
          <div className="w-full h-48 relative overflow-hidden rounded-t-[30px] shrink-0 border-b-2 border-cyan-500/20">
            <img 
              src={bubbleImage} 
              alt="Bubble Game Background" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
            />
            {/* Fade effect blending image into the card */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-[#080914]/50 to-transparent pointer-events-none"></div>
            
            {/* Top Right Badge Over Image */}
            <span className="absolute top-6 right-6 bg-cyan-500/20 backdrop-blur-md text-cyan-300 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-widest border border-cyan-500/30 shadow-lg">
              Accuracy
            </span>
          </div>

          {/* LOWER CONTENT AREA */}
          <div className="relative z-10 flex flex-col flex-1 w-full p-8 md:p-10 pt-0 box-border">
            
            {/* Floating Symbol */}
            <div className="w-20 h-20 shrink-0 bg-[#080914] rounded-2xl border-2 border-cyan-500/30 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 shadow-xl -mt-10 mb-6 relative z-20">
              🫧
            </div>

            {/* Text Details */}
            <div className="flex-1 w-full flex flex-col justify-start">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight break-words w-full group-hover:text-cyan-100 transition-colors">
                Alphabetic Bubble Blast
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed break-words w-full">
                Bubbles float up containing alphabet keys. Strike your keys perfectly to burst them before they escape.
              </p>
            </div>

            {/* Bottom Action */}
            <div className="mt-8 pt-6 border-t border-cyan-500/20 flex items-center text-cyan-400 font-bold text-sm sm:text-base md:text-lg group-hover:text-cyan-300 uppercase tracking-widest w-full shrink-0 whitespace-nowrap">
              Initialize Scenario
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-3 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>

          </div>
        </div>

        {/* =========================================
            CARD 2: SURVIVAL RUN
            ========================================= */}
        <div
          onClick={() => navigate("/games/survival")}
          className="group cursor-pointer bg-[#080914]/90 backdrop-blur-xl border-2 border-red-500/30 rounded-[32px] hover:border-red-400 hover:bg-[#0c0d1e] transition-all duration-300 relative flex flex-col min-h-[460px] shadow-[0_0_30px_rgba(239,68,68,0.1)] hover:shadow-[0_0_50px_rgba(239,68,68,0.2)]"
        >
          {/* IMAGE BANNER */}
          <div className="w-full h-48 relative overflow-hidden rounded-t-[30px] shrink-0 border-b-2 border-red-500/20">
            <img 
              src={survivalImage} 
              alt="Survival Game Background" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
            />
            {/* Fade effect blending image into the card */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080914] via-[#080914]/50 to-transparent pointer-events-none"></div>
            
            {/* Top Right Badge Over Image */}
            <span className="absolute top-6 right-6 bg-red-500/20 backdrop-blur-md text-red-300 font-bold px-5 py-2 rounded-full text-xs uppercase tracking-widest border border-red-500/30 shadow-lg">
              Speed
            </span>
          </div>

          {/* LOWER CONTENT AREA */}
          <div className="relative z-10 flex flex-col flex-1 w-full p-8 md:p-10 pt-0 box-border">
            
            {/* Floating Symbol */}
            <div className="w-20 h-20 shrink-0 bg-[#080914] rounded-2xl border-2 border-red-500/30 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 shadow-xl -mt-10 mb-6 relative z-20">
              ⚠️
            </div>

            {/* Text Details */}
            <div className="flex-1 w-full flex flex-col justify-start">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight leading-tight break-words w-full group-hover:text-red-100 transition-colors">
                Survival Run
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed break-words w-full">
                A high-speed pursuit. Keep your WPM up and avoid typos, or the chase vehicle will catch you.
              </p>
            </div>

            {/* Bottom Action */}
            <div className="mt-8 pt-6 border-t border-red-500/20 flex items-center text-red-400 font-bold text-sm sm:text-base md:text-lg group-hover:text-red-300 uppercase tracking-widest w-full shrink-0 whitespace-nowrap">
              Initialize Scenario
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-3 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Games;