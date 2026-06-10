import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  
  // State to toggle between Login and Register modes
  const [isLogin, setIsLogin] = useState(true); 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a successful login/registration and route to the profile page
    navigate("/profile");
  };

  return (
    <div className="min-h-screen w-full bg-[#04050b] flex items-center justify-center p-6 font-sans relative overflow-hidden box-border pt-24">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Login/Register Card Container */}
      <div className="w-full max-w-md bg-[#080914]/90 backdrop-blur-xl border border-[#1e1f38] rounded-[32px] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Header Icon */}
        <div className="w-16 h-16 bg-purple-500/10 border-2 border-purple-500/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          {isLogin ? '🔐' : '📝'}
        </div>

        {/* =========================================
            PROMINENT TOGGLE TABS
            ========================================= */}
        <div className="flex w-full bg-[#121324] rounded-xl p-1 mb-8 border border-[#1e1f38]">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${
              isLogin 
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${
              !isLogin 
                ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* USERNAME FIELD (Only shows when on the "Register" tab) */}
          {!isLogin && (
            <div className="animate-fade-in">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Callsign (Username)</label>
              <input 
                type="text" 
                required 
                placeholder="Choose a username"
                className="w-full bg-[#121324] border-2 border-[#1e1f38] rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-[#16182d] focus:outline-none transition-all duration-300 shadow-inner"
              />
            </div>
          )}

          {/* Email Field (Shows on both) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Coordinates</label>
            <input 
              type="email" 
              required 
              placeholder="agent@typelearner.com"
              className={`w-full bg-[#121324] border-2 border-[#1e1f38] rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:bg-[#16182d] focus:outline-none transition-all duration-300 shadow-inner
                ${isLogin ? 'focus:border-purple-500' : 'focus:border-cyan-500'}
              `}
            />
          </div>

          {/* Password Field (Shows on both) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Security Key (Password)</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••"
              className={`w-full bg-[#121324] border-2 border-[#1e1f38] rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:bg-[#16182d] focus:outline-none transition-all duration-300 shadow-inner
                ${isLogin ? 'focus:border-purple-500' : 'focus:border-cyan-500'}
              `}
            />
          </div>

          {/* Submit Button (Changes color and text based on tab) */}
          <button 
            type="submit"
            className={`w-full text-white font-black text-lg py-4 rounded-xl mt-4 hover:brightness-110 active:scale-[0.98] transition-all tracking-wide
              ${isLogin 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
              }
            `}
          >
            {isLogin ? "INITIALIZE LOGIN" : "REGISTER PROFILE"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;