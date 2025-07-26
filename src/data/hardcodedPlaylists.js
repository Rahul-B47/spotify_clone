// src/data/hardcodedPlaylists.js

export const hardcodedPlaylists = [
  {
    id: "top-hits",
    title: "Top Hits 2025",
    description: "Latest chartbusters curated for you.",
    thumbnail: "/assets/playlist-top-hits.jpg",
    songs: [
      {
        id: "song1",
        title: "Blinding Lights",
        artist: "The Weeknd",
        thumbnail: "/assets/songs/blinding-lights.jpg",
        audioUrl: "https://example.com/audio/blinding-lights.mp3",
      },
      {
        id: "song2",
        title: "Stay",
        artist: "Justin Bieber",
        thumbnail: "/assets/songs/stay.jpg",
        audioUrl: "https://example.com/audio/stay.mp3",
      },
    ],
  },
  {
    id: "chill-vibes",
    title: "Chill Vibes",
    description: "Relaxing and ambient tunes to chill out.",
    thumbnail: "/assets/playlist-chill-vibes.jpg",
    songs: [
      {
        id: "song3",
        title: "Sunset Drive",
        artist: "Synthwave",
        thumbnail: "/assets/songs/sunset-drive.jpg",
        audioUrl: "https://example.com/audio/sunset-drive.mp3",
      },
    ],
  },
  // Add more playlists here...
];
