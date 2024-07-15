import 'bootstrap/dist/css/bootstrap.css'
//import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    //import("bootstrap/dist/js/bootstrap");
  }, []);

  return (
    <>
    <Head>
      <link rel="icon" href="https://github.com/4301e00e-966d-44c8-b913-d06cf7b553b1" type="image/x-icon"/>
    </Head>

      <Component {...pageProps} />

    </>
    );
}
export default MyApp;