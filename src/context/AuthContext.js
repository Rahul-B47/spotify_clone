import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  collection,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

// Create context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Ensure Firestore user document exists
  const ensureUserDocumentExists = async (firebaseUser) => {
    if (!firebaseUser) return;

    const userRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "Anonymous",
        photoURL: firebaseUser.photoURL || "",
        createdAt: Timestamp.now(),
      });
      console.log("✅ Firestore user document created");
    }
  };

  // 🔁 Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureUserDocumentExists(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUser({
            ...firebaseUser,
            ...docSnap.data(),
          });
        } else {
          setUser(firebaseUser); // fallback if Firestore fails
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Auth functions
  const signup = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserDocumentExists(result.user);
    return result;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDocumentExists(result.user);
    return result;
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await ensureUserDocumentExists(result.user);
    return result;
  };

  const logout = () => signOut(auth);

  // --------------------------------------------
  // 🔥 Liked Songs Utility Functions
  // --------------------------------------------

  const likeSong = async (song) => {
    if (!user?.uid || !song?.id) return;

    const likeRef = doc(db, "users", user.uid, "likedSongs", song.id);
    await setDoc(likeRef, {
      ...song,
      likedAt: Timestamp.now(),
    });
  };

  const unlikeSong = async (songId) => {
    if (!user?.uid || !songId) return;

    const likeRef = doc(db, "users", user.uid, "likedSongs", songId);
    await deleteDoc(likeRef);
  };

  const isSongLiked = (songId, callback) => {
    if (!user?.uid || !songId) return;

    const likeRef = doc(db, "users", user.uid, "likedSongs", songId);
    return onSnapshot(likeRef, (docSnap) => {
      callback(docSnap.exists());
    });
  };

  const getAllLikedSongs = async () => {
    if (!user?.uid) return [];

    const likedRef = collection(db, "users", user.uid, "likedSongs");
    const snapshot = await getDocs(likedRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        loginWithGoogle,
        loading,
        likeSong,
        unlikeSong,
        isSongLiked,
        getAllLikedSongs,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
