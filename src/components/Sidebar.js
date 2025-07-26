// src/components/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { sidebarMenu } from "@/constants/menu";
import { FaHeart, FaPlus, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Sidebar() {
  const router = useRouter();
  const [showPlaylists, setShowPlaylists] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user?.email) return;
      try {
        const q = query(
          collection(db, "playlists"),
          where("createdBy", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlaylists(data);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    };

    fetchPlaylists();
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false); // Close menu on mobile after navigation
  };

  const renderMenu = () => (
    <>
      {/* 🗭 Navigation */}
      <nav className="flex flex-col gap-1 mb-6">
        {sidebarMenu.map((item) => (
          <div
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center gap-4 px-3 py-2 rounded-md cursor-pointer text-sm font-semibold hover:bg-neutral-800 transition ${
              router.pathname === item.path ? "bg-neutral-800" : ""
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      {/* ➕ Create Playlist & ❤️ Liked */}
      <div className="flex flex-col gap-2 mb-4">
        <div
          onClick={() => handleNavigation("/create-playlist")}
          className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-md cursor-pointer text-sm transition"
        >
          <div className="bg-gray-400 text-black rounded-sm w-6 h-6 flex items-center justify-center text-xs font-bold">
            <FaPlus />
          </div>
          <span className="text-sm font-semibold">Create Playlist</span>
        </div>

        <div
          onClick={() => handleNavigation("/liked")}
          className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-800 rounded-md cursor-pointer text-sm transition"
        >
          <div className="bg-gradient-to-br from-purple-700 to-blue-400 rounded-sm w-6 h-6 flex items-center justify-center text-white text-xs">
            <FaHeart />
          </div>
          <span className="text-sm font-semibold">Liked Songs</span>
        </div>
      </div>

      <hr className="border-neutral-800 my-3" />

      {/* 📁 Playlists Section */}
      <div
        className="text-xs uppercase text-gray-400 font-semibold px-3 py-2 cursor-pointer hover:text-white transition"
        onClick={() => setShowPlaylists((prev) => !prev)}
      >
        {showPlaylists ? "Your Playlists ▾" : "Your Playlists ▸"}
      </div>

      {showPlaylists && (
        <div className="overflow-y-auto scrollbar-hide mt-2 px-3 space-y-2">
          {playlists.length === 0 ? (
            <p className="text-gray-500 text-xs">No playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handleNavigation(`/playlist/${playlist.id}`)}
                className="text-base text-gray-300 hover:text-white cursor-pointer font-semibold font-sans hover:underline hover:scale-[1.02] transition-all duration-150 capitalize truncate"
                title={playlist.name}
              >
                {playlist.name}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );

  return (
    <>
      {/* 📱 Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-black text-white p-4 border-b border-neutral-800">
        <h1 className="text-xl font-bold tracking-wide">My Music</h1>
        <button onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* 🔥 Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-black text-white w-64 h-screen border-r border-neutral-800 px-4 py-6 font-sans sticky top-0">
        {renderMenu()}
      </aside>

      {/* 📱 Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full h-[calc(100vh-3.5rem)] bg-black text-white z-50 px-4 py-4 overflow-y-auto">
          {renderMenu()}
        </div>
      )}
    </>
  );
}
