// src/pages/create-playlist.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { FaMusic } from "react-icons/fa";

export default function CreatePlaylist() {
  const { user } = useAuth();
  const router = useRouter();

  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        createdBy: user?.uid || "anonymous",
        createdAt: serverTimestamp(),
        songs: selectedSongs,
      });

      router.push(`/playlist/${docRef.id}`);
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-white animate-fade-in-fast">
      <h1 className="text-3xl font-bold mb-4">🎧 Create New Playlist</h1>

      <input
        type="text"
        className="w-full bg-neutral-800 text-white p-3 rounded mb-6 focus:ring-2 focus:ring-green-500 outline-none transition"
        placeholder="Enter playlist name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
        disabled={loading}
      />

      <h2 className="text-lg font-semibold mb-3">🎵 Select Songs:</h2>
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide pr-2">
        {songs.map((song) => {
          const isSelected = selectedSongs.includes(song.id);
          return (
            <div
              key={song.id}
              onClick={() => handleToggleSong(song.id)}
              className={`flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer transition group ${
                isSelected ? "ring-2 ring-green-500 scale-[1.01]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <FaMusic className="text-green-400 text-lg" />
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              {isSelected && (
                <span className="text-xs text-black bg-white px-3 py-1 rounded-full">
                  Selected
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

      {/* Create Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-green-500 text-black px-6 py-2 rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </div>
    </div>
  );
}
