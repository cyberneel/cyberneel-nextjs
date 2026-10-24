import Head from 'next/head';
import { Schibsted_Grotesk, Martian_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import Layout from '../components/Layout';
import '../styles/globals.css';

const sans = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'] });
const mono = Martian_Mono({ subsets: ['latin'], weight: ['300', '400'] });
// Not Fragment: styled-jsx hands the shell a className, which Fragment warns about.
const Bare = ({ children }) => children;

export default function App({ Component, pageProps }) {
  const Shell = Component.bare ? Bare : Layout;
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange forcedTheme={Component.theme}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="author" content="Neelesh Chevuri" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link
          rel="apple-touch-icon"
          href="https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="alternate" type="application/rss+xml" title="CyberNeel RSS" href="/feed.xml" />
      </Head>

      <style jsx global>{`
        :root { --ff-sans: ${sans.style.fontFamily}; --ff-mono: ${mono.style.fontFamily}; }
      `}</style>
      <Shell>
        <Component {...pageProps} />
      </Shell>
      <Analytics />
    </ThemeProvider>
  );
}
