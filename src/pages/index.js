import Head from "next/head";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

import SongCard from "@/components/SongCard";
import PopularArtists from "@/components/PopularArtists";

// Static playlists
const hardcodedPlaylists = [
  {
    title: "🎶 Top Hits",
    songs: [
      {
        id: "1",
        title: "Saiyaara",
        artist: "Mohit Chauhan and Tarannum Malik Jain",
        image: "/images/saiyaara.jpeg",
        audioUrl: "/songs/saiyaara.mp3",
      },
{
        id: "2",
        title: "Maand X Jhol",
        artist: "Aditya Rikhari",
        image: "/images/maand_x_jhol.jpeg",
        audioUrl: "/songs/maand_x_jhol.mp3",
      },
     {
        id: "3",
        title: "Baarishein",
        artist: "Anuv Jain",
        image: "/images/baarishein.jpeg",
        audioUrl: "/songs/baarishein.mp3",
      },
    ],
  },
  {
    title: "🌿 Kannada Chill Hits ",
    songs: [
      {
        id: "4",
        title: "Singara Siriye",
        artist: "B. Ajaneesh Loknath feat. Vijay Prakash",
        image: "/images/singara_siriye.jpeg",
        audioUrl: "/songs/singara_siriye.mp3",
      },
      {
        id: "5",
        title: "Mayavi",
        artist: "Sonu Nigam & Sanjith Hegde",
        image: "/images/mayavi.jpeg",
        audioUrl: "/songs/mayavi.mp3",
      },
      {
        id: "6",
        title: "Cotton Candy",
        artist: "Chandan Shetty",
        image: "/images/cotton_candy.jpeg",
        audioUrl: "/songs/cotton_candy.mp3",
      },
      {
        id: "7",
        title: "Usire Usire",
        artist: "Rajesh Krishnan",
        image: "/images/usire_usire.jpeg",
        audioUrl: "/songs/usire_usire.mp3",
      },
      {
        id: "8",
        title: "Aadi Baa Magane Bheema",
        artist: "Charan Raj MR",
        image: "/images/aadi_baa_bheema.jpeg",
        audioUrl: "/songs/aadi_baa_bheema.mp3",
      },
      {
        id: "9",
        title: "Bangle Bangari",
        artist: "Antony Dasan",
        image: "/images/bangle_bangari.jpeg",
        audioUrl: "/songs/bangle_bangari.mp3",
      },
    ],
  },
  {
  title: "🌟 English Pop Vibes",
  songs: [
    {
      id: "10",
      title: "Stay",
      artist: "Justin Bieber & The Kid LAROI",
      image: "/images/stay.jpeg",
      audioUrl: "/songs/stay.mp3",
    },
    {
      id: "11",
      title: "Let Me Love You",
      artist: "DJ Snake ft. Justin Bieber",
      image: "/images/let_me_love_you.jpeg",
      audioUrl: "/songs/let_me_love_you.mp3",
    },
    {
      id: "12",
      title: "Starboy",
      artist: "The Weeknd ft. Daft Punk",
      image: "/images/starboy.jpeg",
      audioUrl: "/songs/starboy.mp3",
    },
    {
      id: "13",
      title: "Unstoppable",
      artist: "Sia",
      image: "/images/unstoppable.jpeg",
      audioUrl: "/songs/unstoppable.mp3",
    },
    {
      id: "14",
      title: "Believer",
      artist: "Imagine Dragons",
      image: "/images/believer.jpeg",
      audioUrl: "/songs/believer.mp3",
    },
    {
      id: "15",
      title: "Perfect",
      artist: "Ed Sheeran",
      image: "/images/perfect.jpeg",
      audioUrl: "/songs/perfect.mp3",
    },
    {
      id: "16",
      title: "Die With A Smile",
      artist: "Lady Gaga and Bruno Mars",
      image: "/images/die_with_a_smile.jpeg",
      audioUrl: "/songs/die_with_a_smile.mp3",
    },
  ],
},

];

export default function Home() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        const q = query(
          collection(db, "songs"),
          where("type", "==", "individual")
        );
        const snapshot = await getDocs(q);
        const songs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrendingSongs(songs);
      } catch (error) {
        console.error("Failed to fetch trending songs:", error);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  useEffect(() => {
    const fetchRecommendedSongs = async () => {
      try {
        const q = query(
          collection(db, "songs"),
          where("recommended", "==", true),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const snapshot = await getDocs(q);
        const songs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecommendedSongs(songs);
      } catch (error) {
        console.error("Failed to fetch recommended songs:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedSongs();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <Head>
        <title>Spotify Clone</title>
        <meta name="description" content="A modern Spotify clone using Next.js and Tailwind." />
      </Head>

      {/* Greeting */}
      <section className="mb-6 p-6 pt-8">
        <h2 className="text-2xl font-bold">{getGreeting()}</h2>
      </section>

      {/* Hardcoded Playlists */}
      {hardcodedPlaylists.map((playlist, idx) => (
        <section key={idx} className="p-6">
          <h2 className="text-2xl font-bold mb-4">{playlist.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {playlist.songs.map((song) => (
              <SongCard
                key={song.id}
                id={song.id}
                title={song.title}
                artist={song.artist}
                image={song.image}
                audioUrl={song.audioUrl}
                playlist={playlist.songs} // ✅ Pass full list for queue control
              />
            ))}
          </div>
        </section>
      ))}
      <PopularArtists />

      {/* Trending Songs */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4">🔥 Trending Songs</h2>
        {loadingTrending ? (
          <p className="text-gray-400">Loading trending songs...</p>
        ) : trendingSongs.length === 0 ? (
          <p className="text-gray-400">No trending songs found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {trendingSongs.map((song) => (
              <SongCard
                key={song.id}
                id={song.id}
                title={song.title || "Untitled"}
                artist={song.artist || "Unknown Artist"}
                image={song.image || "/images/default_song.jpg"}
                audioUrl={song.audioUrl || ""}
                playlist={trendingSongs} // ✅ Pass the current list
              />
            ))}
          </div>
        )}
      </section>

      {/* Popular Artists */}
      

      {/* Recommended Songs */}
      <section className="p-6 mb-10">
        <h2 className="text-2xl font-bold mb-4">🎧 Recommended For You</h2>
        {loadingRecommended ? (
          <p className="text-gray-400">Loading recommendations...</p>
        ) : recommendedSongs.length === 0 ? (
          <p className="text-gray-400">No recommended songs available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {recommendedSongs.map((song) => (
              <SongCard
                key={song.id}
                id={song.id}
                title={song.title || "Untitled"}
                artist={song.artist || "Unknown Artist"}
                image={song.image || "/images/default_song.jpg"}
                audioUrl={song.audioUrl || ""}
                playlist={recommendedSongs} // ✅ Fixed: playlist now defined
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
