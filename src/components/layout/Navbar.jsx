import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("typelearner_token"));
  const lastScrollY = useRef(0);
  const hideTimer = useRef(null);

  // Function to hide the navbar after 3 seconds
  const startHideTimer = () => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar if scrolling UP or at the very top
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setVisible(true);
        startHideTimer(); // Restart the 3s countdown whenever we scroll
      } 
      // Hide if scrolling DOWN significantly
      else if (currentScrollY > 100) {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    // Listen only to wheel/scroll events
    window.addEventListener("scroll", handleScroll);
    
    // Initialize the auto-hide timer on mount
    startHideTimer();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimer.current);
    };
  }, []);

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