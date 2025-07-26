// src/components/YouTubeIframePlayer.js
import { useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";

export default function YouTubeIframePlayer() {
  const { currentSong, isPlaying, setIsPlaying, playNext } = usePlayer();
  const playerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!currentSong?.videoId) return;

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
        window.onYouTubeIframeAPIReady = initializePlayer;
      } else {
        initializePlayer();
      }
    };

    const initializePlayer = () => {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        height: "0",
        width: "0",
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            if (isPlaying) event.target.playVideo();
            else event.target.pauseVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playNext();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      playerRef.current?.destroy();
    };
  }, [currentSong?.videoId]);

  // Sync with isPlaying changes
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.playVideo();
    else playerRef.current.pauseVideo();
  }, [isPlaying]);

  return (
    <div style={{ display: "none" }}>
      <div id="youtube-player" ref={iframeRef}></div>
    </div>
  );
}
