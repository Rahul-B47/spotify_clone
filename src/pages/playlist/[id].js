"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import SongCard from "@/components/SongCard";
import Head from "next/head";
import { FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";

export default function PlaylistPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadPlaylist = async () => {
      setLoading(true);
      try {
        const playlistRef = doc(db, "playlists", id);
        const playlistSnap = await getDoc(playlistRef);

        if (!playlistSnap.exists()) {
          console.warn("Playlist not found.");
          router.push("/library");
          return;
        }

        const playlistData = { id: playlistSnap.id, ...playlistSnap.data() };
        setPlaylist(playlistData);
        setNewName(playlistData.name);
        await loadSongs(playlistData.songs || []);
      } catch (err) {
        console.error("Error loading playlist:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const loadSongs = async (songIds) => {
      const songData = [];
      for (let songId of songIds) {
        try {
          const ref = doc(db, "songs", songId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            songData.push({ id: snap.id, ...snap.data() });
          }
        } catch (err) {
          console.warn(`Error loading song ${songId}:`, err.message);
        }
      }
      setSongs(songData);
    };

    loadPlaylist();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "playlists", id));
      router.push("/library");
    } catch (error) {
      console.error("❌ Failed to delete playlist:", error.message);
    }
  };

  const handleRename = async () => {
    if (!newName.trim()) return;

    try {
      await updateDoc(doc(db, "playlists", id), {
        name: newName.trim(),
      });
      setPlaylist((prev) => ({ ...prev, name: newName.trim() }));
      setIsRenaming(false);
    } catch (error) {
      console.error("❌ Failed to rename playlist:", error.message);
    }
  };

  return (
    <>
      <Head>
        <title>{playlist?.name || "Playlist"} | Spotify Clone</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 sm:px-6 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            {isRenaming ? (
              <>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-800 border border-gray-600 px-3 py-1 rounded-md text-base sm:text-lg"
                  placeholder="New playlist name"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  className="text-green-400 hover:text-green-500 text-xl"
                  title="Save"
                >
                  <FiCheck />
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold truncate max-w-[80vw]">
                  {playlist?.name || "Playlist"}
                </h1>
                {user && playlist?.createdBy === user.uid && (
                  <button
                    onClick={() => setIsRenaming(true)}
                    className="text-yellow-400 hover:text-yellow-500 text-xl"
                    title="Rename Playlist"
                  >
                    <FiEdit2 />
                  </button>
                )}
              </>
            )}
          </div>

          {user && playlist?.createdBy === user.uid && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm sm:text-base transition w-fit"
              title="Delete Playlist"
            >
              <FiTrash2 className="text-lg" />
              Delete
            </button>
          )}
        </div>

        {/* Song Grid */}
        {loading ? (
          <p className="text-gray-400">Loading songs...</p>
        ) : songs.length === 0 ? (
          <p className="text-gray-400">No songs in this playlist.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                id={song.id}
                title={song.title}
                artist={song.artist}
                image={song.image || "/images/lofi.jpg"}
                audioUrl={song.audioUrl}
                playlist={songs}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
