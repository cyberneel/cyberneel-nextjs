import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import Head from 'next/head'
import Layout from '../components/Layout'
import { useRouter } from "next/router"
import { useEffect, useState } from 'react';
import '../styles/transition.css'; // transition styles
//import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof document !== undefined) {
      require('bootstrap/dist/js/bootstrap');
    }
    
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [router.events]);
  
  
  return (
    <>
    
    <Head>
      <link rel="icon" href="https://github.com/4301e00e-966d-44c8-b913-d06cf7b553b1" type="image/x-icon"/>
    </Head>
    
    
    <div
        className="background-mask"
        style={{
          '--mask-x': `${mousePosition.x}px`,
          '--mask-y': `${mousePosition.y}px`,
        }}
      />
    
      <Layout>
        <Component {...pageProps} />
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