import 'bootstrap/dist/css/bootstrap.css'
//import '../styles/globals.css'
import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from "next/router"
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    
    // Ensure scripts are only loaded on the client side
    if (typeof window !== 'undefined') {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      // Load scripts in sequence
      loadScript('../public/bootstrap.min.js');
    }
    
  }, [router.events]);
  
  
  return (
    <>
    <Head>
      <link rel="icon" href="https://github.com/4301e00e-966d-44c8-b913-d06cf7b553b1" type="image/x-icon"/>
    </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
    );
}
export default MyApp;