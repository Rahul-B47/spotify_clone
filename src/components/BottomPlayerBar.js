import { useState } from "react";
import { useRouter } from "next/router";
import { usePlayer } from "@/context/PlayerContext";
import Image from "next/image";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRedo,
  FaTimes,
  FaVolumeUp,
  FaVolumeDown,
  FaVolumeMute,
} from "react-icons/fa";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function BottomPlayerBar() {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    progress,
    duration,
    seekTo,
    repeat,
    setRepeat,
    shuffle,
    setShuffle,
    volume,
    setVolume,
  } = usePlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [lastVolume, setLastVolume] = useState(volume || 0.5);

  if (!currentSong) return null;

  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(lastVolume || 0.5);
    } else {
      setLastVolume(volume);
      setVolume(0);
    }
  };

  const renderVolumeIcon = () => {
    if (volume === 0) return <FaVolumeMute />;
    if (volume < 0.4) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  const navigateToDetails = () => {
    router.push("/song-details");
  };

  return (
    <>
      {/* Expanded Fullscreen View */}
      {isExpanded && (
        <div className="fixed inset-0 bg-neutral-950 text-white z-[9999] flex flex-col items-center justify-center px-6 py-10">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            <FaTimes />
          </button>

          <Image
            src={currentSong.image || "/images/default_cover.jpg"}
            alt={currentSong.title}
            width={300}
            height={300}
            className="rounded-lg object-cover mb-6"
          />

          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">{currentSong.title}</h2>
            <p className="text-gray-400 text-sm">{currentSong.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full max-w-xl mt-2">
            <span className="text-xs text-gray-400 min-w-[30px]">
              {formatTime(progress)}
            </span>
            <div
              className="flex-1 h-1 bg-gray-600 rounded cursor-pointer relative"
              onClick={handleSeek}
            >
              <div
                className="h-1 bg-green-500 rounded transition-all duration-200 ease-linear"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 min-w-[30px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-6 mt-6 text-2xl">
            <button
              onClick={() => setShuffle((prev) => !prev)}
              className={shuffle ? "text-green-400" : ""}
            >
              <FaRandom />
            </button>
            <button onClick={playPrevious}>
              <FaStepBackward />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black p-3 rounded-full"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={playNext}>
              <FaStepForward />
            </button>
            <button
              onClick={() => setRepeat((prev) => !prev)}
              className={repeat ? "text-green-400" : ""}
            >
              <FaRedo />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 mt-6">
            <button onClick={toggleMute} className="text-xl">
              {renderVolumeIcon()}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 accent-green-500"
            />
          </div>
        </div>
      )}

      {/* Bottom Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-white px-3 py-2 border-t border-neutral-800 z-50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Song Info */}
          <div
            className="flex items-center gap-3 sm:w-1/3 w-full px-2 cursor-pointer"
            onClick={navigateToDetails}
          >
            <Image
              src={currentSong.image || "/images/default_cover.jpg"}
              alt={currentSong.title}
              width={48}
              height={48}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{currentSong.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Mobile View (Stacked Controls) */}
          <div className="sm:hidden w-full flex flex-col items-center justify-center gap-2">
            {/* Volume Control on Top */}
            <div className="flex items-center justify-start w-full px-4 gap-2">
              <button onClick={toggleMute} className="text-lg">
                {renderVolumeIcon()}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-28 accent-green-500"
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 mt-1">
              <button
                onClick={() => setShuffle((prev) => !prev)}
                className={shuffle ? "text-green-400" : "text-white"}
              >
                <FaRandom />
              </button>
              <button onClick={playPrevious} className="hover:scale-110 transition">
                <FaStepBackward />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white text-black p-2 rounded-full hover:scale-110 transition"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={playNext} className="hover:scale-110 transition">
                <FaStepForward />
              </button>
              <button
                onClick={() => setRepeat((prev) => !prev)}
                className={repeat ? "text-green-400" : "text-white"}
              >
                <FaRedo />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full px-4 mt-1">
              <span className="text-xs text-gray-400 min-w-[30px]">
                {formatTime(progress)}
              </span>
              <div
                className="flex-1 h-1 bg-gray-600 rounded cursor-pointer relative"
                onClick={handleSeek}
              >
                <div
                  className="h-1 bg-green-500 rounded transition-all duration-200 ease-linear"
                  style={{ width: `${(progress / duration) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 min-w-[30px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:flex items-center justify-between w-2/3 gap-4">
            {/* Controls */}
            <div className="flex items-center justify-center gap-4 flex-1">
              <button
                onClick={() => setShuffle((prev) => !prev)}
                className={shuffle ? "text-green-400" : "text-white"}
              >
                <FaRandom />
              </button>
              <button onClick={playPrevious} className="hover:scale-110 transition">
                <FaStepBackward />
              </button>
              <button
                onClick={togglePlay}
                className="bg-white text-black p-2 rounded-full hover:scale-110 transition"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={playNext} className="hover:scale-110 transition">
                <FaStepForward />
              </button>
              <button
                onClick={() => setRepeat((prev) => !prev)}
                className={repeat ? "text-green-400" : "text-white"}
              >
                <FaRedo />
              </button>
            </div>

            {/* Progress & Volume */}
            <div className="flex items-center gap-4 w-full max-w-md">
              {/* Progress */}
              <span className="text-xs text-gray-400">{formatTime(progress)}</span>
              <div
                className="flex-1 h-1 bg-gray-600 rounded cursor-pointer relative"
                onClick={handleSeek}
              >
                <div
                  className="h-1 bg-green-500 rounded transition-all duration-200 ease-linear"
                  style={{ width: `${(progress / duration) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>

              {/* Volume */}
              <button onClick={toggleMute} className="text-lg">
                {renderVolumeIcon()}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
