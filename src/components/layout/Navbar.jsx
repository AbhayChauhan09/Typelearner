import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("typelearner_token"));

  const scrollTimeoutRef = useRef(null);
  const isMouseOverNavbarRef = useRef(false);

  // Sync login status
  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("typelearner_token"));
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // ... (Keep your existing handleInteraction, mouseEnter, and mouseLeave functions here)

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-purple-500 font-bold" : "text-gray-400 hover:text-white transition";

  return (
    <header className="fixed top-0 left-0 w-full border-b border-[#1f232d] bg-[#0F1115]/90 backdrop-blur-md z-50 transition-transform duration-300 ease-in-out"
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}>
      <nav className="w-full px-16 h-[90px] flex items-center justify-between">
        <h1 className="text-4xl font-bold text-purple-500 tracking-tight">TypeLearner</h1>
        <div className="flex gap-12 text-xl font-medium items-center">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/lessons" className={navLinkClass}>Lessons</NavLink>
          <NavLink to="/games" className={navLinkClass}>Games</NavLink>
          <NavLink to={isLoggedIn ? "/profile" : "/login"} className={navLinkClass}>
            {isLoggedIn ? "Account" : "Login"}
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
export default Navbar;