import { useEffect, useRef, useState } from 'react';
import { FileText, Github, Globe, Instagram, Linkedin, Mail } from 'lucide-react';
import Seo from '../components/Seo';
import { LOGO } from '../components/Navbar';

// hello.cyberneel.com (rewritten to /hello in next.config.js): the card I hand to people I meet.
// A metal card that catches the light as it tilts, with my links below. Tap it for the QR on the back.

const LINKS = [
  { label: 'Website', handle: 'cyberneel.com', href: 'https://cyberneel.com', Icon: Globe },
  { label: 'LinkedIn', handle: 'Neelesh Chevuri', href: 'https://linkedin.cyberneel.com', Icon: Linkedin },
  { label: 'GitHub', handle: 'cyberneel', href: 'https://github.com/cyberneel', Icon: Github },
  { label: 'Instagram', handle: 'cyber_neel', href: 'https://instagram.com/cyber_neel', Icon: Instagram },
  { label: 'Email', handle: 'contact@cyberneel.com', href: 'mailto:contact@cyberneel.com', Icon: Mail },
  { label: 'Résumé', handle: 'cyberneel.com/resume', href: 'https://cyberneel.com/resume', Icon: FileText },
];

const clamp = (v) => Math.max(-1, Math.min(1, v));

function Card() {
  const ref = useRef(null);
  const [back, setBack] = useState(false);

  // Tilt toward the pointer; with no pointer (phones, idle) sway slowly so the metal still glints.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let last = -1e4;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const touch = e.pointerType !== 'mouse';
      if (touch && !el.contains(e.target)) return;
      tgt.x = clamp((e.clientX - r.left - r.width / 2) / (touch ? r.width / 2 : innerWidth / 2));
      tgt.y = clamp((e.clientY - r.top - r.height / 2) / (touch ? r.height / 2 : innerHeight / 2));
      last = performance.now();
    };
    const loop = (t) => {
      if (t - last > 2500) {
        tgt.x = Math.sin(t / 2300) * 0.55;
        tgt.y = Math.cos(t / 3100) * 0.35;
      }
      cur.x += (tgt.x - cur.x) * 0.07;
      cur.y += (tgt.y - cur.y) * 0.07;
      el.style.setProperty('--x', cur.x.toFixed(4));
      el.style.setProperty('--y', cur.y.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hc-stage">
      <div ref={ref} className="hc-tilt">
        <button
          type="button"
          className={`hc-card${back ? ' is-back' : ''}`}
          onClick={() => setBack(!back)}
          aria-label={back ? 'Show the front of the card' : 'Show the QR code on the back of the card'}
        >
          <span className="hc-face hc-front" aria-hidden={back}>
            <span className="hc-brand">
              Cyber<span>Neel</span>
            </span>
            <svg className="hc-chip" viewBox="0 0 50 38" aria-hidden>
              <defs>
                <linearGradient id="hc-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f1e3ad" />
                  <stop offset=".55" stopColor="#b3954f" />
                  <stop offset="1" stopColor="#e6d293" />
                </linearGradient>
              </defs>
              <rect x=".5" y=".5" width="49" height="37" rx="6" fill="url(#hc-gold)" stroke="#86703a" strokeWidth=".8" />
              <path d="M0 13h17M0 25h17M33 13h17M33 25h17M17 0v38M33 0v38M17 19h16" stroke="#86703a" strokeWidth=".8" fill="none" />
            </svg>
            <svg className="hc-wave" viewBox="0 0 24 24" aria-hidden>
              <path d="M8.5 7.5a6.5 6.5 0 0 1 0 9M12 5a10 10 0 0 1 0 14M15.5 2.5a13.5 13.5 0 0 1 0 19M5 10a3 3 0 0 1 0 4" />
            </svg>
            <span className="hc-role">Firmware, full stack, 3D</span>
            <span className="hc-name">Neelesh Chevuri</span>
            <span className="hc-holo">
              <img src={LOGO} alt="" />
            </span>
          </span>
          <span className="hc-face hc-back" aria-hidden={!back}>
            <span className="hc-stripe" />
            <span className="hc-sig">Neel</span>
            <img className="hc-qr" src="/hello/qr.svg" alt="QR code for hello.cyberneel.com" />
            <span className="hc-url">
              Scan to open this card
              <br />
              hello.cyberneel.com
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Hello() {
  return (
    <main className="hello">
      <Seo title="Hello" description="Neelesh Chevuri: computer science at UT Austin. Links, contact and a quick hello." />
      <Card />
      <p className="hello-hint">Tap the card for a QR code.</p>

      <section className="hello-bio">
        <h1>Hi, I&rsquo;m Neel.</h1>
        <p>
          I study computer science at UT Austin. I write Bluetooth firmware at EM Microelectronic, build telemetry
          for Longhorn Racing Electric, and make Friday, a personal AI that asks before it acts.
        </p>
        <a href="/hello/neelesh-chevuri.vcf" download className="btn primary">
          Save my contact
        </a>
      </section>

      <ul className="hello-links">
        {LINKS.map(({ label, handle, href, Icon }) => (
          <li key={label}>
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              <Icon size={18} aria-hidden />
              <span>{label}</span>
              <span className="h">{handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

Hello.bare = true; // no site nav or footer
Hello.theme = 'dark';
