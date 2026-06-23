import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // FIXED: useState mein complex logic mat rakho, null se start karo
  const [savedUser, setSavedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // SAFE DATA LOADING: Component load hone ke baad hi storage check karenge
  useEffect(() => {
    const rawData = localStorage.getItem("typelearner_user");
    if (rawData && rawData !== "undefined" && rawData !== "null") {
      try {
        const parsed = JSON.parse(rawData);
        setSavedUser(parsed);
      } catch (e) {
        localStorage.removeItem("typelearner_user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setSavedUser(null);
    window.location.reload(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = window.ENV?.VITE_API_URL || 'http://18.212.243.128:3000/api';
    const endpoint = isLogin ? `${baseUrl}/auth/login` : `${baseUrl}/auth/register`;
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem("typelearner_token", data.token || "");
        const userObj = { username: data.username || username };
        localStorage.setItem("typelearner_user", JSON.stringify(userObj));
        setSavedUser(userObj);
      } else {
        alert(data.message || "Authentication failed.");
      }
    } catch (error) {
      alert("Server unreachable.");
    }
  };

  if (loading) return <div className="text-white text-center pt-20">Loading...</div>;

  if (savedUser) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#04050b] text-white p-6 pt-24">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {savedUser.username}!</h1>
        <button onClick={handleLogout} className="bg-red-600 px-8 py-3 rounded-xl font-bold transition">Sign Out</button>
      </div>
    );
  }

  // ... (Auth UI remains same)
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#04050b] p-6 pt-24">
       {/* Auth Form UI here */}
    </div>
  );
}
export default Profile;