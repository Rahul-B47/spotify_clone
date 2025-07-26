// src/pages/search.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { searchYouTube } from "@/utils/youtubeSearch";
import YouTubeResults from "@/components/YouTubeResults";

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await searchYouTube(query);
        setResults(res);
      } catch (err) {
        console.error("YouTube fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Search results for “{query}”</h1>

      {loading ? (
        <p className="text-gray-400">Searching Music...</p>
      ) : (
        <YouTubeResults results={results} />
      )}
    </div>
  );
}
