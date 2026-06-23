import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  // 1. useState ko simple null rakho, koi parsing nahi
  const [savedUser, setSavedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 2. Data loading sirf useEffect mein, jo render hone ke baad chalta hai
  useEffect(() => {
    const checkStorage = () => {
      try {
        const rawData = localStorage.getItem("typelearner_user");
        // Sirf tabhi parse karo agar data valid JSON jaisa dikhe
        if (rawData && rawData !== "undefined" && rawData !== "null") {
          setSavedUser(JSON.parse(rawData));
        }
      } catch (e) {
        console.error("Storage corrupted, clearing...");
        localStorage.removeItem("typelearner_user");
      }
      setLoading(false);
    };
    checkStorage();
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
      alert("Server error.");
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#04050b] p-6 pt-24">
      <div className="w-full max-w-md bg-[#080914]/90 backdrop-blur-xl border border-[#1e1f38] rounded-[32px] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex w-full bg-[#121324] rounded-xl p-1 mb-8 border border-[#1e1f38]">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-bold uppercase rounded-lg transition-all ${isLogin ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Sign In</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-bold uppercase rounded-lg transition-all ${!isLogin ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input type="text" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#121324] border border-[#1e1f38] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-cyan-500" />
          )}
          <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#121324] border border-[#1e1f38] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500" />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#121324] border border-[#1e1f38] rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500" />
          
          <button type="submit" className={`w-full py-4 rounded-xl font-bold mt-4 transition ${isLogin ? "bg-purple-600 hover:bg-purple-700" : "bg-cyan-600 hover:bg-cyan-700"}`}>
            {isLogin ? "INITIALIZE LOGIN" : "REGISTER PROFILE"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default Profile;