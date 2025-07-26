"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Image from "next/image";
import SongCard from "@/components/SongCard";
import { usePlayer } from "@/context/PlayerContext";
import BottomPlayerBar from "@/components/BottomPlayerBar";

export default function ArtistPage() {
  const router = useRouter();
  const { name } = router.query;

  const [songs, setSongs] = useState([]);
  const [artistImage, setArtistImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    setQueue,
  } = usePlayer();

  useEffect(() => {
    if (!name) return;

    const fetchSongs = async () => {
      try {
        const q = query(collection(db, "songs"), where("artist", "==", name));
        const snapshot = await getDocs(q);
        const songsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSongs(songsData);
        setQueue(songsData); // for next/prev/shuffle/repeat
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    const fetchArtistImage = async () => {
      try {
        const q = query(collection(db, "artists"), where("name", "==", name));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setArtistImage(snapshot.docs[0].data().image);
        }
      } catch (err) {
        console.error("Error fetching artist image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
    fetchArtistImage();
  }, [name]);

  const handlePlayPause = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <>
      <Head>
        <title>{name} - Artist Page</title>
      </Head>

      <div className="p-4 sm:p-6 animate-fade-in text-white min-h-screen pb-36">
        {/* Artist Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <div className="w-36 h-36 md:w-48 md:h-48 relative rounded-full overflow-hidden shadow-lg border-2 border-neutral-700">
            <Image
              src={artistImage || "/images/default_artist.jpg"}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs text-gray-400 uppercase">Artist</p>
            <h1 className="text-3xl md:text-5xl font-bold mt-1">{name}</h1>
            <p className="text-sm text-gray-300 mt-2">
              {songs.length} Song{songs.length !== 1 && "s"} Uploaded
            </p>
          </div>
        </div>

        {/* Song Grid */}
        {loading ? (
          <p className="text-gray-400">Loading songs...</p>
        ) : songs.length === 0 ? (
          <p className="text-gray-500">No songs uploaded by {name} yet.</p>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">🎵 Songs by {name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  id={song.id}
                  title={song.title}
                  artist={song.artist}
                  image={song.image}
                  audioUrl={song.audioUrl}
                  isPlaying={currentSong?.id === song.id && isPlaying}
                  onPlayPause={() => handlePlayPause(song)}
                  playlist={songs}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-800">
        <BottomPlayerBar />
      </div>
    </>
  );
}
