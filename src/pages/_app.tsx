import "bootstrap/dist/css/bootstrap.css";
import "../../styles/globals.css";
import Head from "next/head";

import { useEffect } from "react";
import { AppProps } from "next/app";
import { registerServieWorker } from "../utilities/serviceWorker";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    async function setUpServiceWorker() {
      try {
        registerServieWorker();
      } catch (error) {
        console.error(error);
      }
    }

    setUpServiceWorker();
  }, []);

  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#CFF4FC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="/logo_192x192.png"></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
