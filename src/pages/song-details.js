"use client";

import { usePlayer } from "@/context/PlayerContext";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function SongDetailsPage() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    progress,
    seekTo,
    duration,
  } = usePlayer();

  const [liked, setLiked] = useState(false);

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-gray-400 text-lg">
        No song selected
      </div>
    );
  }

  // Format time helper
  const formatTime = (sec) => {
    if (!sec && sec !== 0) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Progress %
  const progressPercent = duration ? (progress / duration) * 100 : 0;

  // Seek interaction
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    seekTo(time);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 md:px-8">
        <div className="text-sm text-gray-400">Now Playing</div>
        <button onClick={() => setLiked(!liked)} aria-label="Like">
          {liked ? <FaHeart className="text-green-500" /> : <FaRegHeart />}
        </button>
      </div>

      {/* Album Art + Details */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 drop-shadow-2xl rounded-xl overflow-hidden mb-6">
          <Image
            src={currentSong.image || "/images/default_cover.jpg"}
            alt="Album Art"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-bold">{currentSong.title}</h1>
          <p className="text-base text-gray-400">{currentSong.artist}</p>
        </div>

        {/* Song Description */}
       {currentSong && currentSong.description && (
  <motion.div
    key={currentSong.id} // ✅ force re-render when song changes
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="mt-6 px-4 sm:px-6 max-w-2xl mx-auto"
  >
    <h2 className="text-xl font-semibold text-white mb-2">About the song</h2>
    <p className="text-gray-300 leading-relaxed text-sm sm:text-base tracking-wide">
      {currentSong.description}
    </p>
  </motion.div>
)}


        {/* Controls */}
        <div className="mt-6 flex gap-6 items-center">
          <button
            onClick={playPrevious}
            className="bg-neutral-700 p-4 rounded-full hover:bg-neutral-600 transition"
            aria-label="Previous"
          >
            <FaBackward size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-green-500 text-black p-6 rounded-full shadow-md hover:scale-110 transition"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={22} /> : <FaPlay size={22} />}
          </button>

          <button
            onClick={playNext}
            className="bg-neutral-700 p-4 rounded-full hover:bg-neutral-600 transition"
            aria-label="Next"
          >
            <FaForward size={18} />
          </button>
        </div>

       {/* Progress Bar */}
{/* Song Progress Bar – Song Details Page */}
<div className="mt-6 w-full max-w-xl px-4 sm:px-8">
  {/* Time Display */}
  <div className="flex justify-between text-xs text-neutral-400 font-medium mb-2">
    <span>{formatTime(progress)}</span>
    <span>{formatTime(duration)}</span>
  </div>

  {/* Slider Input */}
  <input
    type="range"
    min={0}
    max={duration || 1}
    step={0.1}
    value={progress}
    onChange={(e) => seekTo(parseFloat(e.target.value))}
    className="
      w-full h-1 rounded-full appearance-none cursor-pointer
      bg-neutral-700 accent-green-500
      transition-all duration-200 ease-in-out

      [&::-webkit-slider-runnable-track]:h-1
      [&::-webkit-slider-runnable-track]:rounded-full
      [&::-webkit-slider-runnable-track]:bg-neutral-700

      [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:h-4
      [&::-webkit-slider-thumb]:w-4
      [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:bg-green-500
      [&::-webkit-slider-thumb]:border-2
      [&::-webkit-slider-thumb]:border-white
      [&::-webkit-slider-thumb]:mt-[-6px]

      [&::-moz-range-thumb]:h-4
      [&::-moz-range-thumb]:w-4
      [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:bg-green-500
      [&::-moz-range-thumb]:border-2
      [&::-moz-range-thumb]:border-white
    "
  />
</div>

      </div>

      {/* Bottom Meta */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="px-6 py-4 border-t border-neutral-800 text-sm bg-neutral-950 text-gray-300 space-y-2"
>
  {currentSong.category && (
    <div className="flex items-center gap-2">
      <span className="text-white font-semibold">Category:</span>
      <span>{currentSong.category}</span>
    </div>
  )}
  {currentSong.type && (
    <div className="flex items-center gap-2">
      <span className="text-white font-semibold">Type:</span>
      <span>{currentSong.type}</span>
    </div>
  )}
  {currentSong.playlistSlug && (
    <div className="flex items-center gap-2">
      <span className="text-white font-semibold">Playlist:</span>
      <span className="capitalize">{currentSong.playlistSlug.replace(/-/g, " ")}</span>
    </div>
  )}
  {currentSong.createdAt && (
    <div className="flex items-center gap-2">
      <span className="text-white font-semibold">Added on:</span>
      <span>{new Date(currentSong.createdAt).toLocaleString()}</span>
    </div>
  )}
  {currentSong.addedBy && (
    <div className="flex items-center gap-2">
      <span className="text-white font-semibold">Added by:</span>
      <span>{currentSong.addedBy}</span>
    </div>
  )}
</motion.div>

    </div>
  );
}
