// src/components/AuthForm.js
import { useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm({ isLogin }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/"); // go to home after auth
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-neutral-900 p-6 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        {isLogin ? "Login to Spotify" : "Sign up for Spotify"}
      </h2>

      {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="px-4 py-3 rounded bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="px-4 py-3 rounded bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-black font-semibold py-3 rounded hover:bg-green-400 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>

      <div className="my-4 text-center text-gray-400">OR</div>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-3 border border-gray-600 rounded flex items-center justify-center gap-3 text-white hover:bg-neutral-800 transition"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>

      <p className="text-center text-sm text-gray-400 mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <a
          href={isLogin ? "/signup" : "/login"}
          className="text-green-400 hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </a>
      </p>
    </div>
  );
}
