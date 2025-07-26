// src/components/YouTubeAudioCard.js

"use client";
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { usePlayer } from "@/context/PlayerContext";

export default function YouTubeAudioCard({ video }) {
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const playerRef = useRef(null);
  const { playSong } = usePlayer();

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player(`yt-player-${video.id}`, {
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => clearInterval(intervalRef.current);
  }, []);

  const onPlayerReady = (event) => {
    iframeRef.current = event.target;
  };

  const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      trackProgress();
    } else {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    }
  };

  const trackProgress = () => {
    intervalRef.current = setInterval(() => {
      if (iframeRef.current && iframeRef.current.getDuration) {
        const duration = iframeRef.current.getDuration();
        const current = iframeRef.current.getCurrentTime();
        setProgress((current / duration) * 100);
      }
    }, 1000);
  };

  const togglePlay = () => {
    if (!iframeRef.current) return;

    if (isPlaying) {
      iframeRef.current.pauseVideo();
    } else {
      iframeRef.current.playVideo();

      // Update PlayerContext (bottom bar)
      const songObj = {
  id: video.id,
  title: video.title,
  artist: video.channel,
  image: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
  audioUrl: `https://www.youtube.com/watch?v=${video.id}`,
  isYouTube: true, // ✅ Very important!
};

      playSong(songObj, [songObj]); // Optional: pass array as queue
    }
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-4 shadow-md w-full max-w-md mx-auto">
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <img
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          className="w-16 h-16 rounded-md object-cover"
        />

        {/* Song Info */}
        <div className="flex-1">
          <h3 className="text-white text-sm font-semibold truncate">{video.title}</h3>
          <p className="text-gray-400 text-xs truncate">{video.channel}</p>

          {/* Progress Bar */}
          <div className="mt-2 bg-neutral-700 h-2 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="bg-green-500 text-black p-3 rounded-full hover:scale-110 active:scale-95 transition-transform"
        >
          {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
        </button>
      </div>

      {/* Hidden YouTube Player */}
      <div className="hidden">
        <div id={`yt-player-${video.id}`} />
      </div>
    </div>
  );
}
