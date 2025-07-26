// src/data/workout-mix.js
import Head from "next/head";
import SongCard from "@/components/SongCard";

export default function WorkoutMix() {
  const songs = [
    {
      id: "1",
      title: "Eye of the Tiger",
      artist: "Survivor",
      image: "/images/workout.jpg",
      audioUrl: "/audio/eye_of_the_tiger.mp3",
    },
    {
      id: "2",
      title: "Stronger",
      artist: "Kanye West",
      image: "/images/workout.jpg",
      audioUrl: "/audio/stronger.mp3",
    },
  ];

  return (
    <>
      <Head>
        <title>Workout Mix</title>
      </Head>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">💪 Workout Mix</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              id={song.id}
              title={song.title}
              artist={song.artist}
              image={song.image}
              audioUrl={song.audioUrl}
            />
          ))}
        </div>
      </div>
    </>
  );
}