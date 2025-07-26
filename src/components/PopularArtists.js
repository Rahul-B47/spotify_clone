// src/components/PopularArtists.js
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PopularArtists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const q = query(collection(db, "artists"), orderBy("name"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setArtists(data);
    };

    fetchArtists();
  }, []);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-white">🎤 Popular Artists</h2>

      {artists.length === 0 ? (
        <p className="text-gray-400 text-sm">No artists added yet.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-6">
          {artists.map((artist, idx) => (
            <Link
              key={idx}
              href={`/artist/${encodeURIComponent(artist.name)}`}
              className="group flex flex-col items-center text-center transition-transform hover:scale-105 duration-300"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-full border-2 border-neutral-700 group-hover:border-green-500 shadow-md transition">
                <Image
                  src={artist.image || "/images/default_artist.jpg"}
                  alt={artist.name}
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <p className="mt-3 text-sm font-medium text-white truncate w-full">
                {artist.name}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
