import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { FaMusic } from "react-icons/fa";

export default function CreatePlaylistModal({ onClose }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch songs on mount if user is authenticated
  useEffect(() => {
    if (!user) return;

    const fetchSongs = async () => {
      try {
        const q = query(collection(db, "songs"), orderBy("title"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSongs(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

    fetchSongs();
  }, [user]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter a playlist name.");
    if (!user || !user.email) return setError("Please log in to create a playlist.");
    if (selected.length === 0) return setError("Select at least one song to add.");

    try {
      setLoading(true);
      await addDoc(collection(db, "playlists"), {
        name: name.trim(),
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        songs: selected,
      });

      toast.success("Playlist created!");
      setName("");
      setSelected([]);
      onClose();
    } catch (err) {
      console.error("Failed to create playlist:", err);
      if (err.code === "permission-denied") {
        setError("Please log in to create a playlist.");
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center px-4">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-neutral-700 rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl text-white font-bold mb-4">Create Playlist</h2>

        {/* 🔐 Login Alert */}
        {!user && (
          <div className="bg-yellow-500 text-black px-4 py-2 rounded-md mb-4 font-semibold">
            Please log in to create a playlist.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Playlist Name Input */}
          <div>
            <label className="text-sm text-neutral-400 block mb-1">Playlist Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || !user}
              placeholder="e.g. Road Trip Vibes"
              className="w-full px-4 py-2 text-white bg-neutral-800 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-neutral-500"
            />
          </div>

          {/* Song List */}
          {user && (
            <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
              {songs.map((song) => {
                const isSelected = selected.includes(song.id);
                return (
                  <div
                    key={song.id}
                    onClick={() => toggleSelect(song.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer transition-all border ${
                      isSelected ? "border-green-500 scale-[1.01]" : "border-transparent"
                    }`}
                  >
                    {/* Cover Image or Icon */}
                    {song.coverUrl ? (
                      <img
                        src={song.coverUrl}
                        alt="Cover"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-neutral-600 rounded-md">
                        <FaMusic className="text-white text-lg" />
                      </div>
                    )}

                    {/* Song Info */}
                    <div className="flex-1">
                      <p className="text-white font-semibold">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <span className="text-xs bg-white text-black px-2 py-1 rounded-full font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-neutral-700 hover:bg-neutral-600 text-white rounded-md"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !user}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                user
                  ? "bg-green-500 text-black hover:bg-green-400"
                  : "bg-neutral-500 text-white cursor-not-allowed"
              }`}
            >
              {loading ? "Creating..." : "Create Playlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
