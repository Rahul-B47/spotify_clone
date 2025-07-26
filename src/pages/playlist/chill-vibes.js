import HardcodedPlaylistPage from "@/components/HardcodedPlaylistPage";

const songs = [
  {
    id: "3",
    title: "Sunset Lover",
    artist: "Petit Biscuit",
    image: "/images/sunset_lover.jpg",
    audioUrl: "/audio/sunset_lover.mp3",
  },
];

export default function ChillVibes() {
  return <HardcodedPlaylistPage title="Chill Vibes" songs={songs} />;
}
