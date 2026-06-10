import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function KidsZone() {
  const navigate = useNavigate();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [targetLetter, setTargetLetter] = useState("");
  const [score, setScore] = useState(0);
  const [popEffect, setPopEffect] = useState(false);
  const [currentBg, setCurrentBg] = useState("from-sky-400 to-blue-500");

  const audioCtxRef = useRef(null);

  // Initialize Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // "Singing" Robot Voice
  const speakLetter = (letter) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Added pauses for rhythm to make it sound like chanting/singing
      const utterance = new SpeechSynthesisUtterance(`${letter}!`);
      
      utterance.rate = 0.7; // Slower for melodic feel
      utterance.pitch = 1.6; // High and cheerful
      
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Microsoft') && v.lang.includes('en'));
      if (friendlyVoice) utterance.voice = friendlyVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Play musical notes on every key press
  const playNote = (char) => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const charCode = char.toLowerCase().charCodeAt(0) - 97; 
    const baseFreq = 261.63; // Middle C
    const frequency = baseFreq * Math.pow(Math.pow(2, 1/12), charCode); 

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = "sine"; 
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  };

  // Happy success chord
  const playSuccessChime = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    [523.25, 659.25, 783.99].forEach((freq, i) => { 
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }, i * 100);
    });
  };

  const getNewLetter = () => {
    const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
    setTargetLetter(randomChar);
    speakLetter(randomChar);
    
    const bgs = [
      "from-sky-400 to-blue-500", "from-emerald-400 to-teal-500", 
      "from-amber-400 to-orange-500", "from-rose-400 to-pink-500",
      "from-violet-400 to-purple-500"
    ];
    setCurrentBg(bgs[Math.floor(Math.random() * bgs.length)]);
  };

  const startGame = () => {
    initAudio();
    setHasStarted(true);
    getNewLetter();
  };

  const repeatLetter = () => {
    if (targetLetter) speakLetter(targetLetter);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasStarted || e.key.length > 1) return;

      const typedChar = e.key.toLowerCase();
      playNote(typedChar);

      if (typedChar === targetLetter) {
        setPopEffect(true);
        playSuccessChime();
        setScore((prev) => prev + 1);
        
        setTimeout(() => {
          setPopEffect(false);
          getNewLetter();
        }, 400); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [targetLetter, hasStarted]);

  if (!hasStarted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-8 font-sans">
        <div className="bg-white/20 p-12 rounded-[40px] backdrop-blur-md border border-white/30 text-center shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
          <h1 className="text-6xl font-black text-white mb-8 drop-shadow-md">Junior Academy 🚀</h1>
          <button 
            onClick={startGame}
            className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-4xl font-black px-12 py-6 rounded-full shadow-[0_10px_0_#b45309] hover:shadow-[0_5px_0_#b45309] hover:translate-y-[5px] transition-all"
          >
            PLAY NOW!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${currentBg} flex flex-col items-center justify-center p-8 font-sans transition-colors duration-1000 overflow-hidden relative select-none`}>
      
      <div className="absolute top-20 left-20 text-8xl opacity-50 animate-bounce" style={{ animationDuration: '4s' }}>☁️</div>
      <div className="absolute top-40 right-32 text-7xl opacity-50 animate-bounce" style={{ animationDuration: '5s' }}>☁️</div>
      <div className="absolute bottom-20 left-1/4 text-9xl opacity-30 animate-pulse">🌟</div>

      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
        <button 
          onClick={() => navigate("/")}
          className="bg-white/30 hover:bg-white/50 text-white border-4 border-white backdrop-blur-sm px-6 py-3 rounded-full text-xl font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105"
        >
          ⬅️ Back to Base
        </button>
        <div className="bg-white text-yellow-500 border-4 border-yellow-400 px-8 py-3 rounded-full text-3xl font-black shadow-xl flex items-center gap-3">
          ⭐ Score: {score}
        </div>
      </div>

      <div className="text-center mb-12 z-10 mt-16">
        <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_5px_0_rgba(0,0,0,0.2)] mb-4">
          Type the Letter!
        </h1>
        <p className="text-2xl text-white/90 font-bold bg-black/10 px-6 py-2 rounded-full inline-block backdrop-blur-sm">
          Listen closely! 🎵
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-center h-80 w-80">
        <div 
          onClick={repeatLetter}
          className={`absolute transition-all duration-200 flex items-center justify-center cursor-pointer
            ${popEffect ? 'scale-[2.0] opacity-0 blur-md' : 'scale-100 opacity-100 animate-bounce hover:scale-110'}
          `}
        >
          <div className="w-64 h-72 bg-white rounded-[45%] shadow-[0_20px_0_rgba(0,0,0,0.1)] border-8 border-white/50 flex flex-col items-center justify-center relative">
            <span className="text-[140px] font-black text-gray-800 uppercase leading-none drop-shadow-sm">
              {targetLetter}
            </span>
            <div className="absolute -bottom-6 w-8 h-8 bg-white rotate-45 rounded-sm"></div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-white/80 font-bold text-2xl tracking-widest text-center w-full">
        Find the <span className="text-white bg-black/20 px-4 py-1 rounded-lg border-2 border-white/30">{targetLetter.toUpperCase()}</span> key! <br/>
        <span className="text-sm font-normal mt-2 inline-block opacity-80">(Click the balloon to hear it again)</span>
      </div>

    </div>
  );
}

export default KidsZone;