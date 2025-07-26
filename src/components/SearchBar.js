// src/components/SearchBar.js
import { useState } from "react";
import { searchYouTube } from "@/utils/youtubeSearch";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const results = await searchYouTube(query);
      onResults(results);
    } catch (err) {
      console.error("YouTube search error:", err.message);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search YouTube songs..."
        className="p-3 rounded bg-neutral-800 text-white flex-grow focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button type="submit" className="bg-green-500 text-black p-3 rounded">
        <FaSearch />
      </button>
    </form>
  );
}
