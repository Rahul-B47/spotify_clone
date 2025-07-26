// src/data/[playlist].js
import { useRouter } from 'next/router';
import TopHits from './top-hits';
import WorkoutMix from './workout-mix';
import LofiCoding from './lofi-coding';

const PlaylistPage = () => {
  const router = useRouter();
  const { playlist } = router.query;

  switch (playlist) {
    case 'top-hits':
      return <TopHits />;
    case 'workout-mix':
      return <WorkoutMix />;
    case 'lofi-coding':
      return <LofiCoding />;
    // Add cases for other playlists
    default:
      return <div>Playlist not found</div>;
  }
};

export default PlaylistPage;