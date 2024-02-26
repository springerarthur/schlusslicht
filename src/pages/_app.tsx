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
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
