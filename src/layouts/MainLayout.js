// src/layouts/MainLayout.js
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Player from "@/components/Player";
import { FaSpotify } from "react-icons/fa";

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen font-sans bg-gradient-to-b from-black via-neutral-900 to-black text-white">
      {/* Top Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-black border-r border-neutral-800 shadow-lg animate-slide-in">
          <div className="flex items-center gap-3 px-5 py-6 text-green-500 text-2xl font-bold select-none">
            <FaSpotify className="text-green-500 text-3xl animate-pulse" />
            <span className="text-white tracking-wide">Spotify</span>
          </div>
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header />
          <main className="flex-1 px-4 py-6 animate-fade-in-slow">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom Player */}
      <footer className="z-50 border-t border-neutral-800 shadow-[0_-2px_12px_rgba(0,0,0,0.3)] bg-black">
        <Player />
      </footer>
    </div>
  );
}
