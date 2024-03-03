
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React from "react";
// import { GoogleAnalytics } from '@next/third-parties/google'
 
// const GoogleAnalyticsID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || '';

import CssBaseline from '@mui/material/CssBaseline';
// import { ThemeProvider, createTheme } from '@mui/material/styles';

// MUI 테마 생성 (선택 사항)
// const theme = createTheme({
//   // 테마 설정
// });


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
