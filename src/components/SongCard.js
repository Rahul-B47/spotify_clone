"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";
import { usePlayer } from "@/context/PlayerContext";
import { useAuth } from "@/context/AuthContext";

export default function SongCard({
  id,
  title,
  artist,
  image,
  audioUrl,
  youtubeUrl, // ✅ optional
  playlist = [],
}) {
  const router = useRouter();
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  const { user, likeSong, unlikeSong, isSongLiked } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const isCurrent = currentSong?.id === id;

  useEffect(() => {
    if (!user?.uid || !id || !isSongLiked) return;
    const unsubscribe = isSongLiked(id, (exists) => {
      setLiked(exists);
    });
    return () => unsubscribe?.();
  }, [user?.uid, id, isSongLiked]);

  const handlePlay = () => {
    const sourceType = youtubeUrl ? "youtube" : "firebase";

    const fullPlaylist = Array.isArray(playlist) && playlist.length
      ? playlist
      : [{
          id,
          title,
          artist,
          image,
          audioUrl,
          youtubeUrl,
          sourceType,
        }];

    const currentSongData = {
      id,
      title,
      artist,
      image,
      audioUrl,
      youtubeUrl,
      sourceType,
    };

    if (isCurrent) {
      togglePlay();
    } else {
      playSong(currentSongData, fullPlaylist);
    }
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (!user?.uid || likeLoading) return;

    setLikeLoading(true);
    try {
      if (liked) {
        await unlikeSong(id);
        setLiked(false);
      } else {
        // ✅ Prepare only defined fields for Firestore
        const likeData = {
          id: id || `${title}-${artist}`.replace(/\s+/g, "-").toLowerCase(),
          title,
          artist,
          image,
        };

        if (audioUrl) likeData.audioUrl = audioUrl;
        if (youtubeUrl) likeData.youtubeUrl = youtubeUrl;

        await likeSong(likeData);
        setLiked(true);
      }
    } catch (error) {
      console.error("❤️ Like Error:", error.message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCardClick = () => {
    handlePlay();
    router.push("/song-details");
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-neutral-800 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-neutral-700 ${
        isCurrent ? "ring-2 ring-green-500 animate-pulse" : ""
      }`}
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-md shadow-lg">
        <Image
          src={image || "/images/default_cover.jpg"}
          alt={title}
          width={300}
          height={300}
          className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleLikeToggle}
          disabled={likeLoading}
          className="absolute top-2 right-2 z-10 text-white bg-black/60 p-2 rounded-full hover:scale-110 transition"
          aria-label="Like song"
        >
          {liked ? (
            <FaHeart size={14} className="text-red-500 scale-110" />
          ) : (
            <FaRegHeart size={14} />
          )}
        </button>

        {/* ▶️ Mobile Play */}
        <div className="absolute bottom-2 right-2 md:hidden z-10">
          <button
            className="bg-green-500 text-black p-4 rounded-full shadow-md hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
          >
            {isCurrent && isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
          </button>
        </div>

        {/* ▶️ Desktop Play */}
        <div className="hidden md:flex absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            className="bg-green-500 text-black p-3 rounded-full shadow-md hover:scale-110 transition"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
          >
            {isCurrent && isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        <p className="text-xs text-gray-400 truncate">{artist}</p>
      </div>
    </div>
  );
}
