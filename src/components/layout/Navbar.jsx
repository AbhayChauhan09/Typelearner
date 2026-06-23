import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [isLoggedIn] = useState(!!localStorage.getItem("typelearner_token"));
  const hideTimer = useRef(null);

 
  const showAndResetTimer = () => {
    setVisible(true);
    clearTimeout(hideTimer.current);
    
 
    hideTimer.current = setTimeout(() => {
      if (window.scrollY > 100) {
        setVisible(false);
      }
    }, 3000); 
  };

  useEffect(() => {
    const handleScroll = () => {
       
      showAndResetTimer();
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial start
    showAndResetTimer();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(hideTimer.current);
    };
  }, []);  

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-purple-500 font-bold" : "text-gray-400 hover:text-white transition";

  return (
    <header 
      className="fixed top-0 left-0 w-full h-[90px] bg-[#0F1115]/90 backdrop-blur-md border-b border-[#1f232d] z-50 transition-transform duration-500 ease-in-out"
      style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
    >
      <nav className="w-full h-full px-16 flex items-center justify-between">
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
// Testing CI/CD Pipeline - Deployment check
export default Navbar;

