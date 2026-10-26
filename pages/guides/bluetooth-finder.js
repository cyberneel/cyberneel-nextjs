import { useEffect, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import Seo from '../../components/Seo';

// The guidebook behind the "find anything Bluetooth" reel (comment RADAR).
// The reel's dBm numbers are examples, so the ones here are a rough rule of thumb.
// Ticked steps are remembered in this browser only.

const KEY = 'guide:bluetooth-finder';

function Out({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalLink size={13} className="ml-1 inline align-[-1px]" />
    </a>
  );
}

const STEPS = [
  {
    title: 'Get nRF Connect',
    tool: 'Free, on iPhone and Android',
    body: (
      <>
        <p>
          A Bluetooth gadget that is switched on keeps calling out a few times a second, so phones can find it. nRF
          Connect is a free Bluetooth scanner: it lists every call it hears and how loud each one arrives.
        </p>
        <ol>
          <li>
            Install nRF Connect for Mobile from the{' '}
            <Out href="https://apps.apple.com/us/app/nrf-connect-for-mobile/id1054362403">App Store</Out> or{' '}
            <Out href="https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp">Google Play</Out>. Any other
            free BLE scanner works the same way.
          </li>
          <li>Allow the Bluetooth permission it asks for. Android may call it <strong>Nearby devices</strong> or <strong>Location</strong>.</li>
          <li>Make sure the lost gadget is switched on and has some battery left. Off or dead, it stays silent.</li>
        </ol>
      </>
    ),
  },
  {
    title: 'Find your gadget in the list',
    tool: 'The Scanner tab',
    body: (
      <ol>
        <li>Open the Scanner tab and start a scan. Everything nearby that is calling out shows up, often dozens of entries.</li>
        <li>Look for your gadget's name, the same one your phone shows in Bluetooth settings. Ignore the unnamed rows.</li>
        <li>
          Not there? It may be off, out of battery, or connected to another phone or console. Some gadgets go quiet
          while connected. If it's connected to your phone, play a sound through it instead.
        </li>
      </ol>
    ),
  },
  {
    title: 'Watch the number',
    tool: 'Signal strength, in dBm',
    body: (
      <>
        <p>The number in dBm on each row is how loud the call arrives. It is negative, and closer to zero means closer to you.</p>
        <ul>
          <li><strong>Around −80</strong>: across the room, or further.</li>
          <li><strong>Around −60</strong>: a few steps away.</li>
          <li><strong>−45 or higher</strong>: within arm's reach.</li>
        </ul>
        <p>
          Treat these as a rough guide. A tiny earbud calls quieter than a speaker, and every room is different, so
          watch which way the number moves, not the exact value. It jumps around too: give it a second or two at each spot.
        </p>
      </>
    ),
  },
  {
    title: 'Walk the way it climbs',
    tool: 'Hot and cold',
    body: (
      <ol>
        <li>Take a few slow steps in one direction and wait for the number to settle.</li>
        <li>Climbing toward zero? Keep going. Dropping? Turn back and try another way.</li>
        <li>Once it's high, check under cushions, in bags and behind furniture.</li>
      </ol>
    ),
  },
  {
    title: 'Lost the direction? Use your body',
    tool: 'The turn trick',
    body: (
      <>
        <p>
          Bluetooth uses the same 2.4 GHz radio band as a microwave oven, and microwaves heat water. You're mostly
          water, so your body soaks up the signal and the number drops when you stand between the phone and the gadget.
        </p>
        <ol>
          <li>Hold the phone flat against your chest.</li>
          <li>Stand still and turn slowly in a full circle, pausing every quarter turn.</li>
          <li>Where the number drops lowest, the gadget is right behind you. Turn around and walk that way.</li>
        </ol>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/guides/bluetooth-finder/turn.webp"
          alt="A low-poly figure holding a phone at its chest, turning slowly in a living room"
          className="mx-auto my-6 w-full max-w-xs!"
          loading="lazy"
        />
      </>
    ),
  },
];

export default function BluetoothFinder() {
  const [done, setDone] = useState([]);

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(KEY)) || []);
    } catch {}
  }, []);

  const toggle = (i) => {
    const next = done.includes(i) ? done.filter((d) => d !== i) : [...done, i];
    setDone(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const pct = Math.round((done.length / STEPS.length) * 100);

  return (
    <>
      <Seo
        title="Find anything Bluetooth"
        description="Find lost earbuds, controllers and speakers with your phone: a free scanner app, the signal number, and the turn trick."
      />

      <section className="wrap max-w-[752px] pb-10">
        <header className="page-head">
          <h1>Find anything Bluetooth</h1>
          <p>
            Lost earbuds, a controller, a speaker? If it's switched on, your phone can play hot and cold with it. Five
            steps. Tick each one off as you go.
          </p>
        </header>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/guides/bluetooth-finder/cover.webp"
          alt="A low-poly figure next to a couch, with a scanner reading of −45 dBm"
          className="mx-auto w-full max-w-xs"
        />
        <p className="mt-3 text-center text-sm text-muted">From the reel. Its numbers are examples; yours will vary.</p>

        <div className="sticky top-20 z-10 my-10 border border-line bg-bg px-5 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">
              {pct === 100 ? 'All done. Hope you found it!' : `${done.length} of ${STEPS.length} steps`}
            </span>
            <span className="font-mono">{pct}%</span>
          </div>
          <div className="mt-2 h-1 bg-hair">
            <div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {STEPS.map((s, i) => {
          const on = done.includes(i);
          return (
            <article key={s.title} className="border-t border-hair py-10">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  aria-label={`Mark step ${i + 1} ${on ? 'not done' : 'done'}`}
                  className={`mt-1 grid size-9 shrink-0 place-items-center border font-mono text-sm transition-colors ${
                    on ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:bg-surface hover:text-fg'
                  }`}
                >
                  {on ? <Check size={16} /> : i + 1}
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className={`text-3xl font-medium tracking-tight ${on ? 'text-muted line-through' : ''}`}>{s.title}</h2>
                  <p className="mt-1 text-muted">{s.tool}</p>
                  <div className="prose mt-5">{s.body}</div>
                </div>
              </div>
            </article>
          );
        })}
        <div aria-hidden className="h-28" /> {/* room for the sticky bar to park below the last step */}
      </section>
    </>
  );
}
