// src/pages/create-playlist.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

export default function CreatePlaylist() {
  const { user } = useAuth();
  const router = useRouter();

  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all songs from Firestore
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "songs"));
        const songList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSongs(songList);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

    fetchSongs();
  }, []);

  const handleToggleSong = (songId) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const handleCreate = async () => {
    setError("");

    if (!user) {
      const message = "🚫 Please login to create a playlist.";
      setError(message);
      toast.error(message, {
        style: {
          background: "#1f1f1f",
          color: "#ff4d4d",
          border: "1px solid #ff4d4d",
        },
        icon: "🚫",
      });
      return;
    }

    if (!playlistName.trim()) {
      setError("⚠️ Playlist name cannot be empty.");
      return;
    }

    if (selectedSongs.length === 0) {
      setError("⚠️ Select at least one song.");
      return;
    }

    try {
      setLoading(true);

      const docRef = await addDoc(collection(db, "playlists"), {
        name: playlistName.trim(),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        songs: selectedSongs,
      });

      toast.success("✅ Playlist created!", {
        style: {
          background: "#1f1f1f",
          color: "#00ff99",
        },
      });

      router.push(`/playlist/${docRef.id}`);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setError("⚠️ Something went wrong. Please try again.");
      toast.error("Something went wrong.", {
        style: {
          background: "#1f1f1f",
          color: "#ff4d4d",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto text-white animate-fade-in-fast">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
          🎧 Create New Playlist
        </h1>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-500 text-black font-semibold px-6 py-2 rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </div>

      <input
        type="text"
        className="w-full bg-neutral-800 text-white p-3 rounded mb-6 focus:ring-2 focus:ring-green-500 outline-none transition"
        placeholder="Enter playlist name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        disabled={loading}
      />

      <h2 className="text-lg sm:text-xl font-semibold mb-3">🎵 Select Songs:</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {songs.map((song) => {
          const isSelected = selectedSongs.includes(song.id);
          return (
            <div
              key={song.id}
              onClick={() => handleToggleSong(song.id)}
              className={`flex gap-4 p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer transition group relative ${
                isSelected ? "ring-2 ring-green-500 scale-[1.01]" : ""
              }`}
            >
              <Image
                src={song.image || "/default-song.png"}
                alt={song.title}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex flex-col justify-center">
                <p className="font-semibold">{song.title}</p>
                <p className="text-sm text-gray-400">{song.artist}</p>
              </div>
              {isSelected && (
                <span className="absolute top-2 right-2 text-xs bg-green-500 text-black px-2 py-1 rounded-full font-bold">
                  ✓ Selected
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <p className="text-red-500 mt-4 text-sm font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
}
