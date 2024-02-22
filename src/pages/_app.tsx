import "bootstrap/dist/css/bootstrap.css";
import "../../styles/globals.css";

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

  return <Component {...pageProps} />;
}

export default MyApp;
