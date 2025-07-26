import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* YouTube Iframe API - async load after page becomes interactive */}
        <Script
          src="https://www.youtube.com/iframe_api"
          strategy="afterInteractive"
        />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
