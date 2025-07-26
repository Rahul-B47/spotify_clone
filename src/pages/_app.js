// pages/_app.js
import "@/styles/globals.css";
import MainLayout from "@/layouts/MainLayout";
import { PlayerProvider } from "@/context/PlayerContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/router";
import BottomPlayerBar from "@/components/BottomPlayerBar";
import YouTubeIframePlayer from "@/components/YouTubeIframePlayer"; // 👈 Import here

const noLayoutRoutes = ["/login", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isNoLayout = noLayoutRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      <PlayerProvider>
        {isNoLayout ? (
          <>
            <Component {...pageProps} />
            <YouTubeIframePlayer /> {/* 👈 Hidden player still needed */}
          </>
        ) : (
          <>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
            <BottomPlayerBar />
            <YouTubeIframePlayer /> {/* 👈 Hidden YouTube player here */}
          </>
        )}
      </PlayerProvider>
    </AuthProvider>
  );
}
