import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  FaMusic,
  FaImage,
  FaCloudUploadAlt,
  FaTags,
  FaInfoCircle,
  FaList,
} from "react-icons/fa";

export default function UploadSong() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.email === "rahulrakeshpoojary0@gmail.com";

  const [songType, setSongType] = useState("individual");
  const [form, setForm] = useState({
    title: "",
    artist: "",
    category: "",
    playlistSlug: "",
    description: "",
    imageFile: null,
    audioFile: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Top Kannada",
    "Workout",
    "Coding",
    "Romantic",
    "Chill Vibes",
    "Hip Hop",
    "Bollywood",
    "English Pop",
    "Trending",
    "Instrumental",
    "Party",
  ];

  const playlistOptions = [
    { name: "Top Hits", slug: "top-hits" },
    { name: "Chill Vibes", slug: "chill-vibes" },
    { name: "Workout Mix", slug: "workout" },
    { name: "Lofi Coding", slug: "lofi-coding" },
    { name: "Focus Flow", slug: "focus-flow" },
    { name: "Sleep", slug: "sleep" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      if (name === "imageFile") setImagePreview(URL.createObjectURL(files[0]));
      if (name === "audioFile") setAudioPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadToCloudinary = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    const endpoint =
      type === "image"
        ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
        : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;

    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { title, artist, category, playlistSlug, imageFile, audioFile, description } = form;

    if (!isAdmin) return setError("Only admin can upload songs.");
    if (!title || !artist || !imageFile || !audioFile)
      return setError("Please fill all mandatory fields.");

    if (songType === "library" && !category)
      return setError("Library songs must have a category.");

    if (!playlistSlug)
      return setError("Please select a playlist for this song.");

    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary(imageFile, "image");
      const audioUrl = await uploadToCloudinary(audioFile, "audio");

      await addDoc(collection(db, "songs"), {
        title,
        artist,
        description: description || "",
        image: imageUrl,
        audioUrl,
        type: songType,
        category: songType === "library" ? category : "",
        libraryTag: songType === "library" ? category : "",
        playlistSlug: playlistSlug,
        recommended: true,
        addedBy: user.email,
        createdAt: serverTimestamp(),
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCloudUploadAlt className="text-green-400" /> Upload New Song
      </h1>

      {!isAdmin && <p className="text-red-500">❌ You are not authorized.</p>}

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-neutral-900 p-6 rounded-lg border border-neutral-700 shadow-lg"
        >
          <div>
            <label className="block mb-1 font-medium">🎚️ Song Type</label>
            <select
              value={songType}
              onChange={(e) => setSongType(e.target.value)}
              className="w-full p-3 bg-neutral-800 rounded"
            >
              <option value="individual">Individual Song</option>
              <option value="library">Library Song</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">🎵 Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter song title"
              className="w-full p-3 bg-neutral-800 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">🎤 Artist</label>
            <input
              name="artist"
              value={form.artist}
              onChange={handleChange}
              placeholder="Artist name"
              className="w-full p-3 bg-neutral-800 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FaInfoCircle /> Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional song description"
              className="w-full p-3 bg-neutral-800 rounded"
            />
          </div>

          {songType === "library" && (
            <div>
              <label className="block mb-1 font-medium flex items-center gap-2">
                <FaTags /> Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 bg-neutral-800 rounded"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FaList /> Playlist
            </label>
            <select
              name="playlistSlug"
              value={form.playlistSlug}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 rounded"
            >
              <option value="">-- Select Playlist --</option>
              {playlistOptions.map((pl) => (
                <option key={pl.slug} value={pl.slug}>
                  {pl.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FaImage /> Cover Image
            </label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 bg-neutral-800 rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 rounded-lg max-h-40 object-cover border border-neutral-700"
              />
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium flex items-center gap-2">
              <FaMusic /> Audio File
            </label>
            <input
              type="file"
              name="audioFile"
              accept="audio/*"
              onChange={handleChange}
              className="w-full p-2 bg-neutral-800 rounded"
            />
            {audioPreview && (
              <audio controls className="mt-3 w-full">
                <source src={audioPreview} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-black px-6 py-2 rounded hover:bg-green-400 disabled:opacity-50 font-semibold"
          >
            {loading ? "Uploading..." : "Upload Song"}
          </button>
        </form>
      )}
    </div>
  );
}
