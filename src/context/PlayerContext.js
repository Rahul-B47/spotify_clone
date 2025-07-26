// src/context/PlayerContext.js
import { createContext, useContext, useState, useRef, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [isYouTubeSong, setIsYouTubeSong] = useState(false);

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // 🎚️ Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 🎵 Set and autoplay new song if not YouTube
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const isYT = !!currentSong?.videoId;
    setIsYouTubeSong(isYT);

    if (!isYT) {
      audioRef.current.src = currentSong.audioUrl;

      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.error("Auto-play failed:", err);
        }
      };

      playAudio();
    }
  }, [currentSong]);

  // ▶️ / ⏸️ Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isYouTubeSong) return;

    if (isPlaying) {
      audio
        .play()
        .then(() => {
          animationRef.current = requestAnimationFrame(updateProgress);
        })
        .catch((err) => console.error("Playback error:", err));
    } else {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying, isYouTubeSong]);

  // 🕒 Update progress
  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current?.duration || 0);
    setProgress(audioRef.current?.currentTime || 0);
  };

  const handleSongEnd = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    playNext();
  };

  const playSong = (song, playlist = []) => {
    const index = playlist.findIndex((s) => s.id === song.id);
    setQueue(playlist);
    setCurrentIndex(index !== -1 ? index : 0);
    setCurrentSong({ ...song });

    setProgress(0);
  };

  const handlePlayPause = (song, playlist = []) => {
    if (currentSong?.id === song.id) {
      setIsPlaying((prev) => !prev);
    } else {
      playSong(song, playlist);
    }
  };

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const playNext = () => {
    if (queue.length === 0 || currentIndex === -1) return;

    let nextIndex;
    if (shuffle) {
      const remainingIndices = queue
        .map((_, i) => i)
        .filter((i) => i !== currentIndex);
      if (remainingIndices.length === 0) return;
      nextIndex =
        remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= queue.length) {
      setIsPlaying(false);
      return;
    }

    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setProgress(0);
  };

  const playPrevious = () => {
    if (queue.length === 0 || currentIndex <= 0) return;
    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentSong(queue[prevIndex]);
    setProgress(0);
  };

  const seekTo = (time) => {
    if (audioRef.current && !isYouTubeSong) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        progress,
        seekTo,
        duration,
        repeat,
        setRepeat,
        shuffle,
        setShuffle,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        handlePlayPause,
        queue,
        setQueue,
        audioRef,
        currentIndex,
        setCurrentIndex,
        isYouTubeSong,
        setIsYouTubeSong,
      }}
    >
      {children}

      {/* ✅ Only load <audio> for Firebase songs */}
      {!isYouTubeSong && (
        <audio
          ref={audioRef}
          src={currentSong?.audioUrl || ""}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleSongEnd}
          preload="metadata"
        />
      )}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
