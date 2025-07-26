import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase"; // your firebase config

export const toggleLike = async (userId, songId) => {
  if (!userId || !songId) return;

  const docRef = doc(db, "users", userId, "likedSongs", songId);
  const existing = await getDoc(docRef);

  if (existing.exists()) {
    await deleteDoc(docRef); // unlike
    return false;
  } else {
    await setDoc(docRef, {
      songId,
      likedAt: new Date(),
    });
    return true; // liked
  }
};

export const checkLiked = async (userId, songId) => {
  const docRef = doc(db, "users", userId, "likedSongs", songId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};
