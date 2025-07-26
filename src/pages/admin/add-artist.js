import { useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { FaCloudUploadAlt } from "react-icons/fa";

const predefinedArtists = [
  { name: "Arijit Singh", image: "/images/arijit.jpg" },
  { name: "Pritam", image: "/images/pritam.jpg" },
  { name: "The Rish", image: "/images/rish.jpg" },
  { name: "Vishal-Shekhar", image: "/images/vishal_shekhar.jpg" },
  { name: "Badshah", image: "/images/badshah.jpg" },
];

export default function AddArtist() {
  const { user } = useAuth();
  const router = useRouter();
  const isAdmin = user?.email === "rahulrakeshpoojary0@gmail.com";

  const [form, setForm] = useState({ name: "", imageFile: null });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePreselect = (artist) => {
    setForm({ name: artist.name, imageFile: null });
    setPreview(artist.image);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, imageFile: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

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

    if (!isAdmin) return setError("Only admin can add artists.");
    if (!form.name || (!form.imageFile && !preview)) return setError("All fields required.");

    try {
      setLoading(true);
      const imageUrl = form.imageFile ? await uploadToCloudinary(form.imageFile) : preview;

      await addDoc(collection(db, "artists"), {
        name: form.name,
        image: imageUrl,
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaCloudUploadAlt className="text-green-400" />
        Add Artist
      </h1>

      {!isAdmin ? (
        <p className="text-red-500">❌ Unauthorized</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-900 p-6 rounded-lg">
          {/* Artist Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Artist Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-800 rounded text-white"
              placeholder="e.g. Arijit Singh"
            />
          </div>

          {/* Image File Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium">Artist Image</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 bg-neutral-800 rounded text-white"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 rounded w-32 h-32 object-cover"
              />
            )}
          </div>

          {/* Error Display */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-black px-6 py-2 rounded hover:bg-green-400 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Artist"}
          </button>

          {/* Quick Select Buttons */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Quick Select</h3>
            <div className="grid grid-cols-2 gap-2">
              {predefinedArtists.map((artist) => (
                <button
                  key={artist.name}
                  type="button"
                  onClick={() => handlePreselect(artist)}
                  className="bg-neutral-800 px-3 py-2 rounded text-sm hover:bg-neutral-700"
                >
                  {artist.name}
                </button>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
