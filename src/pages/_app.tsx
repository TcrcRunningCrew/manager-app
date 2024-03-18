
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React from "react";



import { CircularProgress } from '@mui/material';
import '../styles/globals.css'; // 또는 프로젝트에 맞는 글로벌 스타일

// import { GoogleAnalytics } from '@next/third-parties/google'
 
// const GoogleAnalyticsID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';




export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
     {/* <ThemeProvider theme={theme}> */}
      <Component {...pageProps} />
      {/* {process.env.NODE_ENV !== 'development' && <GoogleAnalytics gaId={GoogleAnalyticsID} />} */}
      {/* </ThemeProvider> */}
    </SessionProvider>
  );
}


// export default function MyApp({ Component, pageProps }) {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Component {...pageProps} />
//     </ThemeProvider>
//   );
// }
