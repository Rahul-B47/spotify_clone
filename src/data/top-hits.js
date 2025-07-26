// src/data/top-hits.js
import Head from "next/head";
import SongCard from "@/components/SongCard";

export default function TopHits() {
  const songs = [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "/images/top_hits.jpg",
      audioUrl: "/audio/blinding_lights.mp3",
    },
    {
      id: "2",
      title: "Levitating",
      artist: "Dua Lipa",
      image: "/images/top_hits.jpg",
      audioUrl: "/audio/levitating.mp3",
    },
  ];

  return (
    <>
      <Head>
        <title>Top Hits</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">🎶 Top Hits</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {songs.map((song) => (
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
      </div>
    </>
  );
}