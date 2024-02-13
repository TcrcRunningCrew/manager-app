import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { GoogleAnalytics } from '@next/third-parties/google'
 
const GoogleAnalyticsID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <GoogleAnalytics gaId= {GoogleAnalyticsID} />
    </SessionProvider>
  );
}

