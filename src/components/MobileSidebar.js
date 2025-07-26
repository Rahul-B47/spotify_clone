"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  FaHome,
  FaSearch,
  FaBook,
  FaSignOutAlt,
  FaPlus,
  FaHeart,
} from "react-icons/fa";
import { SiSpotify } from "react-icons/si";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function MobileSidebar({ closeDrawer }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activePath, setActivePath] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylists, setShowPlaylists] = useState(true);

  // Highlight active page
  useEffect(() => {
    setActivePath(router.pathname);
  }, [router.pathname]);

  // Fetch playlists
  useEffect(() => {
   const fetchUserPlaylists = async () => {
  if (!user?.uid) {
    console.log("User UID not available yet.");
    return;
  }
  try {
    console.log("Fetching playlists for UID:", user.uid);

    const q = query(
      collection(db, "playlists"),
      where("createdBy", "==", user.uid)
    );
    const snapshot = await getDocs(q);

    console.log("Raw snapshot docs:", snapshot.docs);

    const fetchedPlaylists = snapshot.docs.map((doc) => {
      console.log("Doc Data:", doc.data());
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    console.log("Fetched playlists:", fetchedPlaylists);
    setPlaylists(fetchedPlaylists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
  }
};


    fetchUserPlaylists();
  }, [user?.uid]);

  // Navigation handler
  const handleLinkClick = (path) => {
    closeDrawer();
    router.push(path);
  };

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-colors duration-200 ${
      activePath === path
        ? "bg-neutral-800 text-white"
        : "text-gray-300 hover:bg-neutral-700"
    }`;

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="fixed top-0 left-0 z-50 w-72 h-full bg-black text-white flex flex-col shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 bg-white text-green-600">
        <SiSpotify className="text-3xl" />
        <h1 className="text-xl font-bold">Spotify</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-20">
        <button onClick={() => handleLinkClick("/")} className={linkClass("/")}>
          <FaHome className="text-lg" />
          Home
        </button>
        <button
          onClick={() => handleLinkClick("/search")}
          className={linkClass("/search")}
        >
          <FaSearch className="text-lg" />
          Search
        </button>
        <button
          onClick={() => handleLinkClick("/library")}
          className={linkClass("/library")}
        >
          <FaBook className="text-lg" />
          Your Library
        </button>
        <button
          onClick={() => handleLinkClick("/liked")}
          className={linkClass("/liked")}
        >
          <FaHeart className="text-lg text-pink-500" />
          Liked Songs
        </button>
      </nav>

      {/* Divider */}
      <div className="border-t border-neutral-800 my-4" />

      {/* Create Playlist */}
      <button
        onClick={() => handleLinkClick("/create-playlist")}
        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-neutral-700"
      >
        <FaPlus />
        Create Playlist
      </button>

      {/* Toggle Playlists Section */}
      <div
        onClick={() => setShowPlaylists((prev) => !prev)}
        className="cursor-pointer text-xs uppercase text-gray-400 font-semibold px-4 py-3 hover:text-white transition"
      >
        {showPlaylists ? "Your Playlists ▾" : "Your Playlists ▸"}
      </div>

      {/* Playlist List */}
      {showPlaylists && (
        <div className="overflow-y-auto scrollbar-hide mt-2 px-3 space-y-2 flex-1">
          {playlists.length === 0 ? (
            <p className="text-gray-500 text-xs">No playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handleLinkClick(`/playlist/${playlist.id}`)}
                className="text-base text-gray-300 hover:text-white cursor-pointer font-semibold font-sans hover:underline hover:scale-[1.02] transition-all duration-150 capitalize truncate"
                title={playlist.name}
              >
                {playlist.name}
              </div>
            ))
          )}
        </div>
      )}

      {/* Logout */}
      {user && (
        <button
          onClick={async () => {
            await logout();
            closeDrawer();
            router.push("/login");
          }}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-3 border-t border-neutral-800 mt-auto"
        >
          <FaSignOutAlt />
          Logout
        </button>
      )}
    </motion.div>
  );
}
