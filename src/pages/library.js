import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { FaPlay, FaPause, FaEdit, FaTrash } from "react-icons/fa";
import { Check, X } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

const tabs = ["Liked Songs", "Your Playlists"];

export default function Library() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Liked Songs");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    audioRef,
    queue,
    setQueue,
  } = usePlayer();

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "Liked Songs") {
          const q = query(
            collection(db, `users/${user.uid}/likedSongs`),
            orderBy("likedAt", "desc")
          );
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setItems(data);
        } else if (activeTab === "Your Playlists") {
          const q = query(
            collection(db, "playlists"),
            where("createdBy", "==", user.uid)
          );
          const snapshot = await getDocs(q);
          const data = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const playlistData = docSnap.data();
              let coverImage = "/images/playlist-cover.png";
              if (playlistData.songs?.length > 0) {
                const firstSongRef = doc(db, "songs", playlistData.songs[0]);
                const firstSongSnap = await getDoc(firstSongRef);
                if (firstSongSnap.exists()) {
                  const songData = firstSongSnap.data();
                  if (songData.image) coverImage = songData.image;
                }
              }
              return {
                id: docSnap.id,
                ...playlistData,
                coverImage,
              };
            })
          );
          setItems(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  const handlePlayPause = (song) => {
    if (currentSong?.id === song.id) {
      if (audioRef.current?.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setCurrentSong(song);
      setQueue([song]);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.play();
      }
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;
    try {
      await deleteDoc(doc(db, "playlists", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const startEditing = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewName("");
  };

  const handleRename = async (id) => {
    try {
      const playlistRef = doc(db, "playlists", id);
      await updateDoc(playlistRef, { name: newName });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, name: newName } : item
        )
      );
      setEditingId(null);
      setNewName("");
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Your Library - Spotify Clone</title>
      </Head>

      <section className="p-6 bg-gradient-to-b from-black via-neutral-900 to-black min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-white">📚 Your Library</h1>

        <div className="flex gap-6 mb-8 border-b border-neutral-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition duration-300 ${
                activeTab === tab
                  ? "text-white border-b-2 border-green-500"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-400">No items to show.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {activeTab === "Liked Songs" &&
              items.map((song) => (
                <div
                  key={song.id}
                  className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl p-4 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={song.image || "/images/default-cover.png"}
                    alt={song.title}
                    className="rounded w-full h-44 object-cover mb-3"
                  />
                  <h3 className="text-white font-semibold truncate mb-1">{song.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  <button
                    onClick={() => handlePlayPause(song)}
                    className="mt-3 text-sm px-4 py-2 bg-green-500 text-black rounded hover:bg-green-400 w-full font-semibold flex items-center justify-center gap-2"
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <>
                        <FaPause /> Pause
                      </>
                    ) : (
                      <>
                        <FaPlay /> Play
                      </>
                    )}
                  </button>
                </div>
              ))}

            {activeTab === "Your Playlists" &&
              items.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-gradient-to-br from-green-700/20 to-green-500/10 border border-green-600/30 rounded-xl p-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative group"
                >
                  <div
                    className="h-36 rounded overflow-hidden mb-3 cursor-pointer"
                    onClick={() => router.push(`/playlist/${playlist.id}`)}
                  >
                    <img
                      src={playlist.coverImage}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {editingId === playlist.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-neutral-900 text-white p-1 px-2 rounded text-sm w-full"
                      />
                      <button
                        onClick={() => handleRename(playlist.id)}
                        className="text-green-400 hover:text-green-600"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-white font-semibold truncate mb-1">
                        {playlist.name || "Untitled Playlist"}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">Created by You</p>
                    </>
                  )}

                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => startEditing(playlist.id, playlist.name)}
                      className="text-blue-400 hover:text-blue-600"
                      title="Rename"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </>
  );
}
