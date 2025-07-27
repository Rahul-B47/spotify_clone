"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import SongCard from "@/components/SongCard";

export default function LikedSongsPage() {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchLikedSongs = async () => {
      setLoading(true);
      try {
        const likedRef = collection(db, "users", user.uid, "likedSongs");
        const snapshot = await getDocs(likedRef);
        const songs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikedSongs(songs);
      } catch (err) {
        console.error("❌ Failed to fetch liked songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, [user?.uid]);

  return (
    <>
      <Head>
        <title>Liked Songs | Spotify Clone</title>
      </Head>

      <main className="min-h-screen bg-black text-white px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">❤️ Liked Songs</h1>

        {loading ? (
          <p className="text-gray-400">Loading your liked songs...</p>
        ) : likedSongs.length === 0 ? (
          <p className="text-gray-400">No liked songs yet. Start liking some!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {likedSongs.map((song) => (
              <SongCard
                key={song.id}
                id={song.id}
                title={song.title}
                artist={song.artist}
                image={song.image}
                audioUrl={song.audioUrl || null}
                youtubeUrl={song.youtubeUrl || null}
                playlist={likedSongs} // ✅ FIXED: Send liked songs as the playlist
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
