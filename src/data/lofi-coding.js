// src/data/lofi-coding.js
import Head from "next/head";
import SongCard from "@/components/SongCard";

export default function LofiCoding() {
  const songs = [
    {
      id: "1",
      title: "Lofi Study",
      artist: "ChilledCow",
      image: "/images/lofi.jpg",
      audioUrl: "/audio/lofi_study.mp3",
    },
    {
      id: "2",
      title: "Coding Session",
      artist: "Programming Flow",
      image: "/images/lofi.jpg",
      audioUrl: "/audio/coding_session.mp3",
    },
  ];

  return (
    <>
      <Head>
        <title>Lofi Coding</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">🎧 Lofi Coding</h1>
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