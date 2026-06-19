import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import Navbar from "./components/layout/Navbar";

// Pages
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import Profile from "./pages/Profile"; // Ensure this matches your file name exactly
import NotFound from "./pages/NotFound";
import Kidszone from "./pages/Kidszone";
import Games from "./pages/Games";
import BubbleGame from "./pages/BubbleGame";
import EscapeGame from "./pages/EscapeGame";

// Lessons
import Lesson1_1 from "./Lessons/Lesson1/Lesson1_1";
import Lesson1_2 from "./Lessons/Lesson1/Lesson1_2";
import Lesson1_3 from "./Lessons/Lesson1/Lesson1_3";
import Lesson1_4 from "./Lessons/Lesson1/Lesson1_4";

import Lesson2_1 from "./Lessons/Lesson2/Lesson2_1";
import Lesson2_2 from "./Lessons/Lesson2/Lesson2_2";
import Lesson2_3 from "./Lessons/Lesson2/Lesson2_3";

import Lesson3_1 from "./Lessons/Lesson3/Lesson3_1";
import Lesson3_2 from "./Lessons/Lesson3/Lesson3_2";
import Lesson3_3 from "./Lessons/Lesson3/Lesson3_3";

import Lesson4_1 from "./Lessons/Lesson4/Lesson4_1";
import Lesson4_2 from "./Lessons/Lesson4/Lesson4_2";
import Lesson4_3 from "./Lessons/Lesson4/Lesson4_3";

import Lesson5_1 from "./Lessons/Lesson5/Lesson5_1";
import Lesson5_2 from "./Lessons/Lesson5/Lesson5_2";
import Lesson5_3 from "./Lessons/Lesson5/Lesson5_3";
import Lesson5_4 from "./Lessons/Lesson5/Lesson5_4";
import Lesson5_5 from "./Lessons/Lesson5/Lesson5_5";

import Lesson6_1 from "./Lessons/Lesson6/Lesson6_1";
import Lesson6_2 from "./Lessons/Lesson6/Lesson6_2";
import Lesson6_3 from "./Lessons/Lesson6/Lesson6_3";

import Lesson7_1 from "./Lessons/Lesson7/Lesson7_1";
import Lesson7_2 from "./Lessons/Lesson7/Lesson7_2";
import Lesson7_3 from "./Lessons/Lesson7/Lesson7_3";
import Lesson7_4 from "./Lessons/Lesson7/Lesson7_4";

import Lesson8_1 from "./Lessons/Lesson8/Lesson8_1";
import Lesson8_2 from "./Lessons/Lesson8/Lesson8_2";
import Lesson8_3 from "./Lessons/Lesson8/Lesson8_3";
import Lesson8_4 from "./Lessons/Lesson8/Lesson8_4";

import Lesson9_1 from "./Lessons/Lesson9/Lesson9_1";
import Lesson9_2 from "./Lessons/Lesson9/Lesson9_2";

import Lesson10_1 from "./Lessons/temp_Lesson10/Lesson10_1";
import Lesson10_2 from "./Lessons/temp_Lesson10/Lesson10_2";

import Lesson11_1 from "./Lessons/Lesson11/Lesson11_1";
import Lesson11_2 from "./Lessons/Lesson11/Lesson11_2";
import Lesson11_3 from "./Lessons/Lesson11/Lesson11_3";

import Lesson12_1 from "./Lessons/Lesson12/Lesson12_1";
import Lesson12_2 from "./Lessons/Lesson12/Lesson12_2";
import Lesson12_3 from "./Lessons/Lesson12/Lesson12_3";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0F1115] flex flex-col w-full overflow-x-hidden box-border">
        <Navbar />

        <main className="flex-1 w-full box-border flex flex-col relative z-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            
            {/* AUTH & PROFILE ROUTES */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Profile />} />

            <Route path="/kids" element={<Kidszone />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/bubble" element={<BubbleGame />} />
            <Route path="/games/survival" element={<EscapeGame />} />

            {/* LESSON TRACKS */}
            <Route path="/lesson1/1.1" element={<Lesson1_1 />} />
            <Route path="/lesson1/1.2" element={<Lesson1_2 />} />
            <Route path="/lesson1/1.3" element={<Lesson1_3 />} />
            <Route path="/lesson1/1.4" element={<Lesson1_4 />} />

            <Route path="/lesson2/2.1" element={<Lesson2_1 />} />
            <Route path="/lesson2/2.2" element={<Lesson2_2 />} />
            <Route path="/lesson2/2.3" element={<Lesson2_3 />} />

            <Route path="/lesson3/3.1" element={<Lesson3_1 />} />
            <Route path="/lesson3/3.2" element={<Lesson3_2 />} />
            <Route path="/lesson3/3.3" element={<Lesson3_3 />} />

            <Route path="/lesson4/4.1" element={<Lesson4_1 />} />
            <Route path="/lesson4/4.2" element={<Lesson4_2 />} />
            <Route path="/lesson4/4.3" element={<Lesson4_3 />} />

            <Route path="/lesson5/5.1" element={<Lesson5_1 />} />
            <Route path="/lesson5/5.2" element={<Lesson5_2 />} />
            <Route path="/lesson5/5.3" element={<Lesson5_3 />} />
            <Route path="/lesson5/5.4" element={<Lesson5_4 />} />
            <Route path="/lesson5/5.5" element={<Lesson5_5 />} />

            <Route path="/lesson6/6.1" element={<Lesson6_1 />} />
            <Route path="/lesson6/6.2" element={<Lesson6_2 />} />
            <Route path="/lesson6/6.3" element={<Lesson6_3 />} />

            <Route path="/lesson7/7.1" element={<Lesson7_1 />} />
            <Route path="/lesson7/7.2" element={<Lesson7_2 />} />
            <Route path="/lesson7/7.3" element={<Lesson7_3 />} />
            <Route path="/lesson7/7.4" element={<Lesson7_4 />} />

            <Route path="/lesson8/8.1" element={<Lesson8_1 />} />
            <Route path="/lesson8/8.2" element={<Lesson8_2 />} />
            <Route path="/lesson8/8.3" element={<Lesson8_3 />} />
            <Route path="/lesson8/8.4" element={<Lesson8_4 />} />

            <Route path="/lesson9/9.1" element={<Lesson9_1 />} />
            <Route path="/lesson9/9.2" element={<Lesson9_2 />} />

            <Route path="/lesson10/10.1" element={<Lesson10_1 />} />
            <Route path="/lesson10/10.2" element={<Lesson10_2 />} />

            <Route path="/lesson11/11.1" element={<Lesson11_1 />} />
            <Route path="/lesson11/11.2" element={<Lesson11_2 />} />
            <Route path="/lesson11/11.3" element={<Lesson11_3 />} />

            <Route path="/lesson12/12.1" element={<Lesson12_1 />} />
            <Route path="/lesson12/12.2" element={<Lesson12_2 />} />
            <Route path="/lesson12/12.3" element={<Lesson12_3 />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;