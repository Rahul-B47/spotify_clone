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

  // Fetch uploaded songs from Firestore
  useEffect(() => {
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
        console.error("Failed to fetch songs:", err);
      }
    };

    fetchSongs();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter a playlist name.");
    if (!user || !user.email) return setError("You must be logged in.");
    if (selected.length === 0)
      return setError("Select at least one song to add.");

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
      onClose();
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-[95%] max-w-2xl bg-[#121212] border border-neutral-700 rounded-xl shadow-2xl p-6 animate-fade-in overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-white text-2xl font-bold mb-4">Create Playlist</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-neutral-400 block mb-1">Playlist Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="e.g. Road Trip"
              className="w-full px-4 py-2 text-white bg-neutral-800 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-neutral-500"
            />
          </div>

          {/* Songs List */}
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {songs.map((song) => {
              const isSelected = selected.includes(song.id);
              return (
                <div
                  key={song.id}
                  onClick={() => toggleSelect(song.id)}
                  className={`flex items-center justify-between p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer group transition ${
                    isSelected ? "ring-2 ring-green-500 scale-[1.01]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaMusic className="text-green-400" />
                    <div>
                      <p className="font-medium text-white">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-xs bg-white text-black px-2 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
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
              className="px-4 py-2 text-sm font-medium bg-green-500 text-black rounded-md hover:bg-green-400 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Playlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
