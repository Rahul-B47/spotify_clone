import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FiEdit2, FiSave } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import Head from "next/head";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    displayName: "",
    bio: "",
    email: "",
    photoURL: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfileData(userSnap.data());
      } else {
        const fallback = {
          displayName: user.displayName || "Spotify User",
          email: user.email || "",
          phone: "",
          bio: "",
          photoURL: user.photoURL || "/images/profile.jpg",
        };
        await setDoc(userRef, fallback);
        setProfileData(fallback);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSave = async () => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, profileData);
    setEditMode(false);
  };

  if (!user || loading) return null;

  return (
    <>
      <Head>
        <title>{profileData.displayName} | Profile</title>
      </Head>

      <div
  className="min-h-screen w-full bg-gradient-to-b from-[#121212] via-[#191414] to-black text-white px-6 py-12"
  style={{
    backgroundImage: `url('/images/spotify-bg-pattern.png'),`,
    backgroundSize: "cover, 150px",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "center, top right",
    backgroundBlendMode: "overlay",
  }}
>

        <div className="max-w-5xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 md:p-12 shadow-xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={profileData.photoURL}
              onError={(e) => (e.target.src = "/images/profile.jpg")}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-green-500 shadow-md"
            />

            <div className="flex-1 text-center md:text-left">
              {editMode ? (
                <input
                  type="text"
                  value={profileData.displayName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, displayName: e.target.value })
                  }
                  className="bg-transparent border-b border-green-400 text-4xl md:text-5xl font-bold focus:outline-none w-full"
                />
              ) : (
                <h1 className="text-4xl md:text-5xl font-bold">{profileData.displayName}</h1>
              )}

              <div className="mt-4">
                <button
                  onClick={() => (editMode ? handleSave() : setEditMode(true))}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-green-400 rounded hover:bg-green-300 transition"
                >
                  {editMode ? <><FiSave /> Save</> : <><FiEdit2 /> Edit Details</>}
                </button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm text-white/60">Email</label>
              {editMode ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full p-2 bg-white/10 border border-white/20 rounded focus:outline-none text-white"
                />
              ) : (
                <p className="text-white">{profileData.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 text-sm text-white/60">Phone Number</label>
              {editMode ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full p-2 bg-white/10 border border-white/20 rounded focus:outline-none text-white"
                />
              ) : (
                <p className="text-white">{profileData.phone || "Not provided"}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-8">
            <label className="block mb-1 text-sm text-white/60">Bio</label>
            {editMode ? (
              <textarea
                rows={3}
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                className="w-full p-3 bg-white/10 border border-white/20 rounded focus:outline-none text-white resize-none"
              />
            ) : (
              <p className="italic text-white/80">{profileData.bio || "No bio added yet."}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
