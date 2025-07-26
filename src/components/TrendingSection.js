// src/components/TrendingSection.js
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SongCard from "@/components/SongCard";

export default function TrendingSection() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        const q = query(collection(db, "songs"), orderBy("title"), limit(10)); // Customize as needed
        const snapshot = await getDocs(q);
        const songs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrendingSongs(songs);
      } catch (err) {
        console.error("❌ Failed to fetch trending songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">🔥 Trending Songs</h2>

      {loading ? (
        <p className="text-gray-400">Loading trending songs...</p>
      ) : trendingSongs.length === 0 ? (
        <p className="text-gray-400">No trending songs found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {trendingSongs.map((song) => (
            <SongCard
              key={song.id}
              id={song.id}
              title={song.title}
              artist={song.artist}
              image={song.image}
              audioUrl={song.audioUrl}
              playlist={songs}
            />
          ))}
        </div>
      )}
    </section>
  );
}
