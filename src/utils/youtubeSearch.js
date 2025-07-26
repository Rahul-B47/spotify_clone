// src/utils/youtubeSearch.js

export async function searchYouTube(query) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const maxResults = 10;

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&key=${apiKey}`
  );

  const data = await res.json();

  return data.items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    channel: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.high.url, // Album cover
  }));
}
