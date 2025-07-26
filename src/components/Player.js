// src/components/Player.js
import { usePlayer } from "@/context/PlayerContext";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import Image from "next/image";

export default function Player() {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  if (!currentSong) {
    return (
      <div className="h-20 bg-black text-gray-400 flex items-center justify-center border-t border-neutral-800 animate-fade-in-slow">
        No song playing
      </div>
    );
  }

  return (
    <div className="h-20 bg-black text-white flex items-center justify-between px-4 border-t border-neutral-800 animate-fade-in-slow">
      {/* Left: Song Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-14 h-14 rounded overflow-hidden">
          <Image
            src={currentSong.image || "/images/song1.jpg"}
            alt={currentSong.title}
            width={56}
            height={56}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="text-sm font-semibold truncate max-w-[150px]">
            {currentSong.title}
          </p>
          <p className="text-xs text-gray-400 truncate max-w-[150px]">
            {currentSong.artist}
          </p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center justify-center w-1/3">
        <div className="flex items-center gap-5">
          <button className="hover:text-green-500 transition">
            <FaBackward size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white text-black p-2 rounded-full hover:scale-105 transition"
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
          <button className="hover:text-green-500 transition">
            <FaForward size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-2 h-1 bg-neutral-700 rounded">
          <div
            className="h-1 bg-green-500 rounded transition-all duration-500 ease-in-out"
            style={{ width: "40%" }}
          ></div>
        </div>
      </div>

      {/* Right: Reserved for volume, etc. */}
      <div className="w-1/3 hidden md:flex justify-end pr-4"></div>
    </div>
  );
}
