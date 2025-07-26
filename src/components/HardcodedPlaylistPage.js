// components/HardcodedPlaylistPage.jsx
import Head from "next/head";
import SongCard from "./SongCard";

export default function HardcodedPlaylistPage({ title, songs }) {
  return (
    <>
      <Head>
        <title>{title} | Spotify Clone</title>
      </Head>
      <section className="p-6">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
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
      </section>
    </>
  );
}
