import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from "next/router"
import { useEffect, useState } from 'react';
import '../styles/transition.css'; // transition styles
import { PageTransition } from 'next-page-transitions';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import ScrollToTop from '../components/ScrollToTop';
//import Script from 'next/script'

function MyApp({ Component, pageProps }) {  

  const router = useRouter();

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap');
    }
    
    const script = document.createElement('script');
    script.src = '/js/backgroundMaskUpdate.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [router.events]);
  
  
  return (
    <>
    
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Neelesh Chevuri" />
      <meta name="language" content="English" />
      
      {/* Default Open Graph tags */}
      <meta property="og:site_name" content="CyberNeel" />
      <meta property="og:locale" content="en_US" />
      
      {/* Default Twitter Card tags */}
      <meta name="twitter:creator" content="@cyberneel" />
      <meta name="twitter:site" content="@cyberneel" />
      
      <link rel="icon" href="https://github.com/cyberneel/cyberneel.github.io/raw/refs/heads/main/img/CyberNeelLogoNewOutfit1080p.webp" type="image/x-icon"/>
    </Head>
    
    
    <div
        className="background-mask"
        style={{
          '--mask-x': `0px`,
          '--mask-y': `0px`,
        }}
      />
    
      <Layout>
        <PageTransition timeout={300} classNames="fade">
          <div className="page">
            <Component {...pageProps} />
            {/* <ScrollToTop/> */}
          </div>
        </PageTransition>
      </Layout>
      
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
      
    </>
    );
}
export default MyApp;