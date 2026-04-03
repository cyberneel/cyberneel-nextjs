import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from "next/router"
import { useEffect } from 'react';
import '../styles/transition.css'; 
import '../styles/globals.css'
import ScrollToTop from '../components/ScrollToTop';
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {  

  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/backgroundMaskUpdate.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [router.events]);
  
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Neelesh Chevuri" />
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
        <Component {...pageProps} />
      </Layout>
      
      <ScrollToTop />
    </ThemeProvider>
    );
}
export default MyApp;