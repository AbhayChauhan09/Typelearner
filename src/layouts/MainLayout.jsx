import { Outlet } from "react-router-dom"
import Navbar from "../components/layout/Navbar"

function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="max-w-[1400px] mx-auto px-12">
        <Navbar />

        <main className="py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
