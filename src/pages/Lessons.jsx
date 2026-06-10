import React from "react";
import { useNavigate } from "react-router-dom";

function Lessons() {
  const navigate = useNavigate();

  const lessons = [
    { id: 1, title: "Home Row Basics", description: "Learn finger placement and home row typing.", level: "BEGINNER" },
    { id: 2, title: "Train your E and I Keys", description: "Train fingers for top row movement.", level: "BEGINNER" },
    { id: 3, title: "Train your R and U keys", description: "Train first fingers for R and U key movement.", level: "INTERMEDIATE" },
    { id: 4, title: "Practice with t and o keys", description: "Train with t and o.", level: "INTERMEDIATE" },
    { id: 5, title: "Shift key", description: "Practice with shift keys.", level: "INTERMEDIATE" },
    { id: 6, title: "Practice with C and , keys", description: "Train bottom row movement for C and comma.", level: "INTERMEDIATE" },
    { id: 7, title: "Practice G, H, ' and \"", description: "Train index stretches and pinky shift coordination.", level: "ADVANCED" },
    { id: 8, title: "Practice with keys N,v,/,?", description: "Keep it up! You are now in advanced level.", level: "ADVANCED" },
    { id: 9, title: "Practice W and M keys", description: "Paragraph typing using the w and m keys.", level: "ADVANCED" },
    { id: 10, title: "Practice Q and P keys", description: "Mastering the outward pinky stretches.", level: "ADVANCED" },
    { id: 11, title: "Practice B and Y keys", description: "Mastering the inner index finger stretches.", level: "ADVANCED" },
    { id: 12, title: "Practice Z and X keys", description: "Mastering the downward left hand stretches.", level: "ADVANCED" },
  ];

  const handleLessonClick = (id) => {
    if (id === 1) navigate("/lesson1/1.1");
    else if (id === 2) navigate("/lesson2/2.1");
    else if (id === 3) navigate("/lesson3/3.1");
    else if (id === 4) navigate("/lesson4/4.1");
    else if (id === 5) navigate("/lesson5/5.1");
    else if (id === 6) navigate("/lesson6/6.1");
    else if (id === 7) navigate("/lesson7/7.1");
    else if (id === 8) navigate("/lesson8/8.1");
    else if (id === 9) navigate("/lesson9/9.1");
    else if (id === 10) navigate("/lesson10/10.1");
    else if (id === 11) navigate("/lesson11/11.1");
    else if (id === 12) navigate("/lesson12/12.1");
  };

  const renderIcon = (id) => {
    const boxStyle = "flex items-center justify-center border border-purple-500/40 rounded-md text-[10px] font-bold text-purple-400 font-mono";
    
    switch (id) {
      case 1: return <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9m-9-9v18M9 21h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 10v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" /></svg>;
      case 2: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>E</span><span className={`${boxStyle} w-6 h-6`}>I</span></div>;
      case 3: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>R</span><span className={`${boxStyle} w-6 h-6`}>U</span></div>;
      case 4: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>T</span><span className={`${boxStyle} w-6 h-6`}>O</span></div>;
      case 5: return <div className="flex flex-col gap-1.5"><span className={`${boxStyle} px-2 py-0.5 text-[8px]`}>SHIFT ⇧</span><span className={`${boxStyle} px-2 py-0.5 text-[8px]`}>SHIFT ⇧</span></div>;
      case 6: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>C</span><span className={`${boxStyle} w-6 h-6`}>,</span></div>;
      case 7: return <div className="flex flex-col gap-1 items-center"><div className="flex gap-1"><span className={`${boxStyle} w-5 h-5 text-[8px]`}>G</span><span className={`${boxStyle} w-5 h-5 text-[8px]`}>H</span></div><div className="flex gap-1"><span className={`${boxStyle} w-5 h-5 text-[8px]`}>'</span><span className={`${boxStyle} w-5 h-5 text-[8px]`}>"</span></div></div>;
      case 8: return <div className="flex flex-col gap-1 items-center"><div className="flex gap-1"><span className={`${boxStyle} w-5 h-5 text-[8px]`}>N</span><span className={`${boxStyle} w-5 h-5 text-[8px]`}>V</span></div><div className="flex gap-1 ml-4"><span className={`${boxStyle} w-6 h-5 text-[9px]`}>?/</span></div></div>;
      case 9: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>W</span><span className={`${boxStyle} w-6 h-6`}>M</span></div>;
      case 10: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>Q</span><span className={`${boxStyle} w-6 h-6`}>P</span></div>;
      case 11: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>B</span><span className={`${boxStyle} w-6 h-6`}>Y</span></div>;
      case 12: return <div className="flex gap-1.5"><span className={`${boxStyle} w-6 h-6`}>Z</span><span className={`${boxStyle} w-6 h-6`}>X</span></div>;
      default: return null;
    }
  };

  return (
    <div 
      style={{ paddingTop: "110px" }} 
      className="min-h-screen w-full bg-[#04050b] text-white flex flex-col items-center pb-24 px-4 sm:px-12 relative overflow-x-hidden font-sans box-border"
    >
      
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vh] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[20%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div 
        className="absolute inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
          maskImage: "radial-gradient(ellipse at center, white 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, white 30%, transparent 80%)"
        }}
      />

      <div className="w-full max-w-[1100px] relative z-10 flex flex-col items-center box-border">
        
        <div className="text-center mb-20 sm:mb-24 w-full relative">
          <div 
            className="absolute text-[7rem] sm:text-[11rem] font-black tracking-widest uppercase select-none -top-12 sm:-top-20 left-1/2 -translate-x-1/2 font-sans z-[-1]"
            style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.03)", color: "transparent" }}
          >
            STAGES
          </div>
          
          {/* Modified: Changed mb-4 to mb-8 to add distinctive spacing under the title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-8">
            Typing Lessons <span className="inline-block text-purple-500 ml-1">⚔️</span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-400 font-medium">
            Master tactical touch typing patterns and level up your precision.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 box-border">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonClick(lesson.id)}
              className="w-full bg-[#080914]/80 backdrop-blur-xl border border-[#1e1f38] rounded-xl p-5 cursor-pointer transition-all duration-300 hover:border-purple-600/50 hover:bg-[#0c0d1e]/90 flex flex-row items-center gap-5 group box-border"
            >
              <div className="shrink-0 w-[72px] h-[72px] rounded-xl border border-[#2a2b4a] bg-[#0b0c1a] flex items-center justify-center group-hover:border-purple-500/40 transition-colors duration-300">
                {renderIcon(lesson.id)}
              </div>

              <div className="flex-1 flex flex-col min-w-0 transform -translate-y-1">
                <div className="flex items-center justify-between mb-1 w-full">
                  <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-[0.2em] text-purple-500">
                    STAGE // {(lesson.id).toString().padStart(2, '0')}
                  </span>
                  
                  <span className="px-3 py-1 rounded-full border border-slate-700 bg-transparent text-slate-300 text-[9px] sm:text-[10px] font-bold tracking-wider shrink-0">
                    {lesson.level}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide truncate group-hover:text-purple-100 transition-colors duration-300">
                  {lesson.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-400 mt-3 truncate">
                  {lesson.description}
                </p>
              </div>

              <div className="shrink-0 text-purple-600/60 group-hover:text-purple-400 transition-colors duration-300 pr-2">
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Lessons;