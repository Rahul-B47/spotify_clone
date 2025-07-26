"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PlaylistCard({ id, title, image, isHardcoded = false }) {
  const router = useRouter();

  const handlePlay = () => {
    if (isHardcoded) {
      router.push(`/playlist/${id}`);
    } else {
      router.push(`/playlist/${id}`);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (isHardcoded) return;

    const confirmed = confirm("Are you sure you want to delete this playlist?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "playlists", id));
      toast.success("Playlist deleted!");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete playlist");
    }
  };

  return (
    <div
      onClick={handlePlay}
      className="group relative bg-neutral-800 hover:bg-neutral-700 p-4 rounded-lg transition-all duration-300 cursor-pointer"
    >
      {/* Playlist Cover */}
      <div className="relative w-full aspect-square overflow-hidden rounded-md">
        <Image
          src={image || "/images/lofi.jpg"}
          alt={title}
          width={300}
          height={300}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />

        {/* Delete Button */}
        {!isHardcoded && (
          <div className="absolute inset-0 flex items-center justify-end gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
              title="Delete Playlist"
            >
              <FaTrash size={14} />
            </button>
          </div>
        )}

        {/* Play Button – Always visible in mobile, hover only in desktop */}
        <div
          className="
            absolute bottom-3 right-3 
            md:opacity-0 md:group-hover:opacity-100 
            md:translate-y-2 md:group-hover:translate-y-0 
            transition-all duration-300
          "
        >
          <button
            className="bg-green-500 text-black p-3 rounded-full shadow-lg hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            title="Play"
          >
            <FaPlay size={16} />
          </button>
        </div>
      </div>

      {/* Playlist Title */}
      <h3 className="text-sm font-semibold mt-3 truncate">{title}</h3>
    </div>
  );
}
