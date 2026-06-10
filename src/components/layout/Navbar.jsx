import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  
  const scrollTimeoutRef = useRef(null);
  const isMouseOverNavbarRef = useRef(false); 

  const handleInteraction = () => {
    setVisible(true);

    if (isMouseOverNavbarRef.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverNavbarRef.current) {
        setVisible(false);
      }
    }, 3000); 
  };

  // Run the interaction logic every time the page changes
  // so the navbar appears, then hides after 3 seconds on initial load
  useEffect(() => {
    handleInteraction();

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [location.pathname]);

  // Attach event listeners for all pages
  useEffect(() => {
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("wheel", handleInteraction, { passive: true });
    window.addEventListener("touchmove", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const handleNavbarMouseEnter = () => {
    isMouseOverNavbarRef.current = true;
    setVisible(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleNavbarMouseLeave = () => {
    isMouseOverNavbarRef.current = false;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverNavbarRef.current) {
        setVisible(false);
      }
    }, 3000);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-purple-500 font-bold"
      : "text-gray-400 hover:text-white transition";

  return (
    <header 
      onMouseEnter={handleNavbarMouseEnter}
      onMouseLeave={handleNavbarMouseLeave}
      className="fixed top-0 left-0 w-full border-b border-[#1f232d] bg-[#0F1115]/90 backdrop-blur-md z-50 transition-transform duration-300 ease-in-out"
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)"
      }}
    >
      <nav className="w-full px-16 h-[90px] flex items-center justify-between">
        <h1 className="text-4xl font-bold text-purple-500 tracking-tight">
          TypeLearner
        </h1>

        <div className="flex gap-12 text-xl font-medium">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/lessons" className={navLinkClass}>
            Lessons
          </NavLink>
          <NavLink to="/games" className={navLinkClass}>
            Games
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;