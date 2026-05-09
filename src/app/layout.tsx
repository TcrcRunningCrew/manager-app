import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { PwaInstallBanner } from "@/components/molecules/PwaInstallBanner";

export const metadata: Metadata = {
  title: "T.C.R.C",
  description: "T.C.R.C - 출석?",
  openGraph: {
    title: "T.C.R.C",
    description: "T.C.R.C - 출석",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 600,
        alt: "T.C.R.C",
      },
    ],
    type: "website",
    locale: "ko_KR",
    siteName: "T.C.R.C",
  },
  twitter: {
    card: "summary_large_image",
    title: "T.C.R.C",
    description: "T.C.R.C - 출석",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TCRC",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#C8FF3E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' className='dark'>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Do+Hyeon&family=JetBrains+Mono:wght@500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(console.error);})}`,
          }}
        />
      </head>
      <body className='overscroll-none'>
        <SessionProvider>
          <div className='mobile-viewport'>
            <main className='main-content'>{children}</main>
          </div>
          <PwaInstallBanner />
        </SessionProvider>
      </body>
    </html>
  );
}
