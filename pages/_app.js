import Head from 'next/head';
import { Fraunces, Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import Layout from '../components/Layout';
import '../styles/globals.css';

const display = Fraunces({ subsets: ['latin'], variable: '--ff-display', display: 'swap' });
const body = Geist({ subsets: ['latin'], variable: '--ff-body', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--ff-mono', display: 'swap' });

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="author" content="Neelesh Chevuri" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#f6f3ee" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0b0a09" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link
          rel="apple-touch-icon"
          href="https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="alternate" type="application/rss+xml" title="CyberNeel RSS" href="/feed.xml" />
      </Head>

      <div className={`${display.variable} ${body.variable} ${mono.variable} font-sans`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
      <Analytics />
    </ThemeProvider>
  );
}
