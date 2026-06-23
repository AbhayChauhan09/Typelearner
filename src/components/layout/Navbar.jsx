import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("typelearner_token"));
  const lastScrollY = useRef(0);
  const hideTimer = useRef(null);

  // Helper to show navbar and start/reset the 3-second timer
  const showAndResetTimer = () => {
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      // Hide only if we are not at the very top
      if (window.scrollY > 100) {
        setVisible(false);
      }
    }, 3000); // 3 seconds stay
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Agar scroll UP kar rahe hain, toh dikhao aur timer restart karo
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        showAndResetTimer();
      } 
      // Scroll DOWN karte waqt timer expire hone ka wait karo
      else if (currentScrollY > 100 && visible) {
        // Hum yahan timer ko allow kar rahe hain 3s tak khatam hone ka
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial timer start
    showAndResetTimer();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimer.current);
    };
  }, [visible]);

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-purple-500 font-bold" : "text-gray-400 hover:text-white transition";

  return (
    <header 
      className="fixed top-0 left-0 w-full border-b border-[#1f232d] bg-[#0F1115]/90 backdrop-blur-md z-50 transition-transform duration-500 ease-in-out"
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
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