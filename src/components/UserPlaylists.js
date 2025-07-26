import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";

export default function UserPlaylists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const router = useRouter();

  // 🔄 Fetch user playlists
  useEffect(() => {
    const fetchUserPlaylists = async () => {
      if (!user?.email) {
        setPlaylists([]);
        setLoading(false);
        return;
      }

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
      } catch (err) {
        console.error("Error fetching playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlaylists();
  }, [user]);

  // 🗑️ Delete a playlist
  const handleDelete = async (playlistId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "playlists", playlistId));
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  // ✏️ Rename a playlist
  const handleRename = async (playlistId) => {
    try {
      await updateDoc(doc(db, "playlists", playlistId), {
        name: editedName,
      });

      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, name: editedName } : p
        )
      );

      setEditingId(null);
      setEditedName("");
    } catch (err) {
      console.error("Error renaming playlist:", err);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm text-gray-400 mb-2 px-4">Your Playlists</h3>

      {loading ? (
        <p className="text-sm text-gray-500 px-4">Loading...</p>
      ) : playlists.length === 0 ? (
        <p className="text-sm text-gray-500 px-4">No playlists found.</p>
      ) : (
        <ul className="px-4 space-y-2 overflow-y-auto text-sm max-h-60 scrollbar-hide">
          {playlists.map((playlist) => (
            <li
              key={playlist.id}
              className="flex items-center justify-between text-gray-300 hover:text-white cursor-pointer group"
            >
              {/* Playlist Name or Input for Editing */}
              {editingId === playlist.id ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-neutral-800 px-2 py-1 rounded text-white w-2/3"
                />
              ) : (
                <span
                  onClick={() => router.push(`/playlist/${playlist.id}`)}
                  className="truncate w-2/3"
                  title={playlist.name}
                >
                  {playlist.name}
                </span>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 items-center">
                {editingId === playlist.id ? (
                  <button
                    onClick={() => handleRename(playlist.id)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <FaSave />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(playlist.id);
                      setEditedName(playlist.name);
                    }}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <FaEdit />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(playlist.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
