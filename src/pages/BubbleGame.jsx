import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function BubbleGame() {
  const navigate = useNavigate();

  // Core Mechanics State
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highStreak, setHighStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [difficulty, setDifficulty] = useState("beginner"); 

  // Diagnostic Tracking State: Tracks total attempts vs misses per character
  const [keyStats, setKeyStats] = useState({});

  // Persistent Score Record List State
  const [scoreHistory, setScoreHistory] = useState(() => {
    const saved = localStorage.getItem("bubble_game_history");
    return saved ? JSON.parse(saved) : [];
  });

  const gameAreaRef = useRef(null);
  const bubbleIdRef = useRef(0);
  const loopRef = useRef(null);

  // Restricted to unlocked alphabet keys
  const availableKeys = [
    "a", "s", "d", "f", "j", "k", "l", ";", 
    "e", "r", "t", "u", "i", "o"
  ];

  const neonGlows = [
    "border-[#00f0ff] text-[#00f0ff] bg-cyan-950/20 shadow-[0_0_15px_rgba(0,240,255,0.4)]",
    "border-[#a855f7] text-[#a855f7] bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    "border-[#10b981] text-[#10b981] bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    "border-[#f59e0b] text-[#f59e0b] bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
    "border-[#f43f5e] text-[#f43f5e] bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
  ];

  const getDifficultySettings = () => {
    switch (difficulty) {
      case "intermediate":
        return { baseSpeed: 2.8, speedVariance: 2.2, spawnInterval: 32 }; 
      case "expert":
        return { baseSpeed: 4.5, speedVariance: 3.5, spawnInterval: 18 }; 
      case "beginner":
      default:
        return { baseSpeed: 1.2, speedVariance: 1.2, spawnInterval: 48 }; 
    }
  };

  const spawnBubble = () => {
    if (!gameAreaRef.current) return;
    const width = gameAreaRef.current.clientWidth;
    const settings = getDifficultySettings();
    const chosenKey = availableKeys[Math.floor(Math.random() * availableKeys.length)];
    
    const newBubble = {
      id: bubbleIdRef.current++,
      key: chosenKey,
      x: Math.random() * (width - 90) + 15, 
      y: gameAreaRef.current.clientHeight,   
      speed: Math.random() * settings.speedVariance + settings.baseSpeed,        
      style: neonGlows[Math.floor(Math.random() * neonGlows.length)],
      size: Math.floor(Math.random() * 20) + 65 
    };

    // Track that this key appeared on screen
    setKeyStats((prev) => ({
      ...prev,
      [chosenKey]: {
        ...((prev[chosenKey]) || { hit: 0, miss: 0 }),
      }
    }));

    setBubbles((prev) => [...prev, newBubble]);
  };

  // Main Game Loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let frameCount = 0;
    const settings = getDifficultySettings();

    const updatePhysicsLoop = () => {
      frameCount++;
      
      if (frameCount % settings.spawnInterval === 0) {
        spawnBubble();
      }

      setBubbles((prevBubbles) => {
        return prevBubbles
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => {
            if (b.y < -90) {
              setMissed((m) => m + 1);
              setStreak(0);
              
              // Register a miss profile for this key
              setKeyStats((prev) => ({
                ...prev,
                [b.key]: {
                  hit: prev[b.key]?.hit || 0,
                  miss: (prev[b.key]?.miss || 0) + 1
                }
              }));
              return false;
            }
            return true;
          });
      });

      loopRef.current = requestAnimationFrame(updatePhysicsLoop);
    };

    loopRef.current = requestAnimationFrame(updatePhysicsLoop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [gameStarted, gameOver, difficulty]);

  // General Timer Control 
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          
          setScoreHistory((currentHistory) => {
            const updated = [
              { score, difficulty, date: new Date().toLocaleDateString() },
              ...currentHistory.slice(0, 4) 
            ];
            localStorage.setItem("bubble_game_history", JSON.stringify(updated));
            return updated;
          });

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, score, difficulty]);

  // Global Keyboard Event Dispatch Listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return;
      const pressedKey = e.key.toLowerCase();

      setBubbles((currentBubbles) => {
        const targets = currentBubbles.filter((b) => b.key === pressedKey);
        
        if (targets.length === 0) {
          setStreak(0);
          // If user mis-typed an active character on the board, penalize it
          if (availableKeys.includes(pressedKey)) {
            setKeyStats((prev) => ({
              ...prev,
              [pressedKey]: {
                hit: prev[pressedKey]?.hit || 0,
                miss: (prev[pressedKey]?.miss || 0) + 1
              }
            }));
          }
          return currentBubbles;
        }

        const lowestTarget = targets.reduce((lowest, b) => (b.y < lowest.y ? b : lowest), targets[0]);

        setScore((s) => s + 1);
        setKeyStats((prev) => ({
          ...prev,
          [pressedKey]: {
            hit: (prev[pressedKey]?.hit || 0) + 1,
            miss: prev[pressedKey]?.miss || 0
          }
        }));

        setStreak((prev) => {
          const next = prev + 1;
          if (next > highStreak) setHighStreak(next);
          return next;
        });

        return currentBubbles.filter((b) => b.id !== lowestTarget.id);
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, gameOver, highStreak]);

  const startGame = () => {
    setScore(0);
    setMissed(0);
    setStreak(0);
    setTimeLeft(60);
    setBubbles([]);
    setKeyStats({});
    setGameOver(false);
    setGameStarted(true);
  };

  // Compute keys with the highest error ratios
  const getTroubleKeys = () => {
    return Object.entries(keyStats)
      .map(([key, data]) => {
        const total = data.hit + data.miss;
        const errorRate = total > 0 ? (data.miss / total) * 100 : 0;
        return { key, errorRate, ...data };
      })
      .filter((item) => item.miss > 0)
      .sort((a, b) => b.errorRate - a.errorRate || b.miss - a.miss)
      .slice(0, 3);
  };

  const troubleKeys = getTroubleKeys();

  return (
    <div className="min-h-screen w-full bg-[#050512] text-[#9AA2CE] flex p-6 font-sans relative overflow-hidden select-none gap-6 pt-24">
      
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[50vh] bg-gradient-to-br from-purple-600/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-gradient-to-tl from-cyan-600/10 to-transparent blur-[120px] pointer-events-none" />

      {/* LEFT AREA: MAIN GAME AREA VIEWPORT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* STAGE HEADER BAR */}
        <header className="w-full flex justify-between items-center bg-[#0b0b26]/50 border border-[#1c1d42] px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/games")}
              className="px-4 py-2 bg-[#14153d] hover:bg-[#1b1c54] text-xs font-bold tracking-wider text-purple-400 border border-[#23255c] rounded-xl uppercase transition-all shadow-md"
            >
              ← Back to Games
            </button>
            <h1 className="text-xl font-black text-white uppercase tracking-widest">Alphabetic Bubble Blast 🫧</h1>
          </div>
          
          <div className="flex items-center gap-8 font-mono">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Score</p>
              <p className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Streak</p>
              <p className="text-2xl font-black text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">{streak}</p>
            </div>
            <div className="text-center bg-[#040416] px-5 py-2 rounded-xl border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Time Remaining</p>
              <p className="text-xl font-black text-cyan-400 tracking-wider">{timeLeft}s</p>
            </div>
          </div>
        </header>

        {/* INTERACTIVE MATRIX CANVAS */}
        <section 
          ref={gameAreaRef}
          className="flex-1 w-full bg-[#030311]/90 border border-[#16173a] rounded-2xl mt-6 relative overflow-hidden shadow-2xl backdrop-blur-sm"
        >
          {/* ADJUSTED OPEN SPACIOUS START SCREEN OVERLAY */}
          {!gameStarted && (
            <div className="absolute inset-0 bg-[#060618]/95 z-20 flex flex-col items-center justify-center p-12 text-center py-16 justify-evenly animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(168,85,247,0.35)] mb-2 animate-pulse">🫧</div>
                <h2 className="text-5xl font-black text-white tracking-widest uppercase">Pop the Letters!</h2>
                <p className="text-sm text-gray-400 max-w-xl mt-2 leading-relaxed">
                  Bubbles float up containing unlocked alphabet keys <span className="text-purple-400 font-bold font-mono">asdfjkl;ertuio</span>. Strike your keys to burst them down!
                </p>
              </div>

              {/* COMMODIOUS DIFFICULTY BUTTON WRAPPERS */}
              <div className="w-full max-w-2xl flex flex-col gap-4 my-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Select Game Complexity</p>
                <div className="grid grid-cols-3 gap-6 p-4 bg-[#030416] border border-[#1a1c49] rounded-[24px]">
                  {["beginner", "intermediate", "expert"].map((lvl) => {
                    const isActive = difficulty === lvl;
                    const styleMap = {
                      beginner: "hover:border-emerald-500/40 active:bg-emerald-500/10",
                      intermediate: "hover:border-amber-500/40 active:bg-amber-500/10",
                      expert: "hover:border-rose-500/40 active:bg-rose-500/10"
                    };
                    return (
                      <button
                        key={lvl}
                        onClick={() => setDifficulty(lvl)}
                        className={`py-6 px-4 rounded-xl text-sm font-black uppercase tracking-widest border transition-all duration-300 transform
                          ${isActive 
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)] scale-105" 
                            : `text-gray-500 bg-[#0a0b24]/60 border-transparent ${styleMap[lvl]} hover:text-gray-200`
                          }
                        `}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={startGame}
                className="px-16 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black rounded-xl text-base uppercase tracking-widest border border-emerald-400/30 shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:brightness-110 transition-all transform hover:scale-105 active:scale-95"
              >
                Start Simulator Engine 🚀
              </button>
            </div>
          )}

          {/* GAME OVER DIALOG MODAL */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center p-4">
              <div className="bg-[#0b0b26] border border-purple-500/30 rounded-[28px] p-8 max-w-sm w-full shadow-2xl text-center">
                <h3 className="text-2xl font-black text-purple-400 tracking-widest uppercase mb-6">Simulation Halted</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#030416] p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] block text-gray-500 uppercase font-bold tracking-widest">Total Burst</span>
                    <span className="text-3xl font-black text-white font-mono">{score}</span>
                  </div>
                  <div className="bg-[#030416] p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] block text-gray-500 uppercase font-bold tracking-widest">Peak Streak</span>
                    <span className="text-3xl font-black text-cyan-400 font-mono">{highStreak}</span>
                  </div>
                </div>
                <button onClick={startGame} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold tracking-widest uppercase text-xs hover:brightness-110 transition-all">
                  Play Again
                </button>
              </div>
            </div>
          )}

          {/* FLOATING RUNTIME BUBBLES */}
          {bubbles.map((b) => (
            <div
              key={b.id}
              className={`absolute rounded-full border-2 flex items-center justify-center font-mono font-black text-2xl select-none ${b.style}`}
              style={{
                left: `${b.x}px`,
                top: `${b.y}px`,
                width: `${b.size}px`,
                height: `${b.size}px`
              }}
            >
              {b.key === ";" ? " ; " : b.key.toUpperCase()}
            </div>
          ))}
        </section>
      </div>

      {/* RIGHT SIDE DIAGNOSTIC PROFILE CONSOLE TERMINAL */}
      <aside className="w-80 bg-[#0b0b26]/60 border border-[#1c1d42] rounded-2xl p-5 flex flex-col shrink-0 shadow-2xl z-10 backdrop-blur-md gap-6">
        
        {/* DYNAMIC DIAGNOSTIC PROFILE SECTION */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 border-b border-[#1c1d42] pb-3 mb-4">
            <span className="text-base text-amber-400">🎯</span>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Practice Targets</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
            {!gameStarted ? (
              <div className="my-auto text-center text-xs text-gray-500 italic px-4 leading-relaxed">
                Initialize the simulator. The system will live-track and display which characters need more accuracy drill attention here.
              </div>
            ) : troubleKeys.length === 0 ? (
              <div className="my-auto text-center text-xs text-emerald-400 font-medium px-4 leading-relaxed bg-emerald-500/5 border border-emerald-500/10 py-4 rounded-xl">
                🌟 Flawless accuracy detected! Keep popping those letters with zero misses to maintain precision metrics.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Keys to Improve:</p>
                {troubleKeys.map((item) => (
                  <div key={item.key} className="bg-[#030416] border border-rose-500/10 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-black text-lg">
                        {item.key === ";" ? ";" : item.key.toUpperCase()}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wide">Focus Needed</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">Missed {item.miss} times</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold block text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10 font-mono">
                        {Math.round(item.errorRate)}% Error
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOG RECORD LIST */}
        <div className="flex flex-col h-48 border-t border-[#1c1d42] pt-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance Record</h2>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
            {scoreHistory.length === 0 ? (
              <div className="text-center text-[11px] text-gray-600 italic mt-4">No records found.</div>
            ) : (
              scoreHistory.map((record, index) => (
                <div key={index} className="bg-[#030416] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400 uppercase font-bold text-[9px]">{record.difficulty}</span>
                  <span className="text-emerald-400 font-black">{record.score} pts</span>
                </div>
              ))
            )}
          </div>
        </div>

      </aside>
    </div>
  );
}