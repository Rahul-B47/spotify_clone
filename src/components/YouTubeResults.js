"use client";

import { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { usePlayer } from "@/context/PlayerContext";

export default function YouTubeResults({ results }) {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const iframeRefs = useRef({});
  const { playSong } = usePlayer();

  const togglePlay = (video) => {
    const newIframe = iframeRefs.current[video.id];
    if (!newIframe) return;

    // Pause the currently playing iframe (if different)
    if (currentlyPlayingId && currentlyPlayingId !== video.id) {
      const currentIframe = iframeRefs.current[currentlyPlayingId];
      if (currentIframe) {
        currentIframe.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "pauseVideo",
            args: [],
          }),
          "*"
        );
      }
    }

    const isPlaying = currentlyPlayingId === video.id;

    // Toggle play/pause on the clicked video
    newIframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: isPlaying ? "pauseVideo" : "playVideo",
        args: [],
      }),
      "*"
    );

    if (isPlaying) {
      // If already playing, pause and clear state
      setCurrentlyPlayingId(null);
    } else {
      // If new video clicked, update state and call playSong for bottom bar
      setCurrentlyPlayingId(video.id);

      const songObj = {
        id: video.id,
        title: video.title,
        artist: video.channel,
        image: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
        audioUrl: `https://www.youtube.com/watch?v=${video.id}`, // Adapt your player to support this if needed
      };

      playSong(songObj, results);
    }
  };

  if (!results?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 px-2 sm:px-4">
      {results.map((video) => (
        <div
          key={video.id}
          className="relative bg-neutral-800 p-4 rounded-lg cursor-pointer flex flex-col"
        >
          {/* Album Art */}
          <div className="relative w-full aspect-square overflow-hidden rounded-md">
            <img
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt={video.title}
              className="object-cover w-full h-full transition-transform duration-500"
            />

            {/* Fixed Play / Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay(video);
              }}
              className="absolute bottom-3 right-3 bg-green-500 text-black p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
              aria-label={currentlyPlayingId === video.id ? "Pause video" : "Play video"}
            >
              {currentlyPlayingId === video.id ? (
                <FaPause size={18} />
              ) : (
                <FaPlay size={18} />
              )}
            </button>
          </div>

          {/* Video Title and Channel */}
          <div className="mt-3 flex-grow">
            <h3 className="text-sm font-semibold truncate text-white">{video.title}</h3>
            <p className="text-xs text-neutral-400 truncate">{video.channel}</p>
          </div>

          {/* Hidden Iframe */}
          <iframe
            ref={(el) => (iframeRefs.current[video.id] = el)}
            id={`yt-iframe-${video.id}`}
            className="hidden"
            title={video.title}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&origin=${
              typeof window !== "undefined" ? window.location.origin : ""
            }`}
            allow="autoplay"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}
