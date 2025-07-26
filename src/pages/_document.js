// pages/_document.js (or app/document.js if you're using App Router)

import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Load YouTube Iframe API after page is interactive */}
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
