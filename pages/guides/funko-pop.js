import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import Seo from '../../components/Seo';
import TurntableViewer from '../../components/TurntableViewer';

// The guidebook behind the "make your own Funko Pop" reel (comment FUNKO).
// Ticked steps are remembered in this browser only.

const PROMPT = 'make this into a cartoon funkopop image with white background';
const KEY = 'guide:funko-pop';

function Out({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalLink size={13} className="ml-1 inline align-[-1px]" />
    </a>
  );
}

function CopyPrompt() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {} // no clipboard access: the prompt stays selectable below
  };
  return (
    <div className="my-5 flex items-center gap-3 border border-line p-4">
      <span className="flex-1 select-all font-mono text-sm leading-relaxed text-fg">{PROMPT}</span>
      <button type="button" onClick={copy} className="btn ghost sm shrink-0" aria-live="polite">
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

const STEPS = [
  {
    title: 'Make it a Funko',
    tool: 'ChatGPT',
    body: (
      <>
        <ol>
          <li>Open <Out href="https://chatgpt.com">ChatGPT</Out> and upload a photo: you, a pet, a figure on your desk.</li>
          <li>Paste this prompt and send it:</li>
        </ol>
        <CopyPrompt />
        <ol start={3}>
          <li>Download the image. The plain white background helps the next step.</li>
        </ol>
        <img src="/guides/funko-pop/chatgpt.webp" alt="A cartoon Funko-style figure on a white background" className="mx-auto my-6 w-full max-w-xs!" loading="lazy" />
      </>
    ),
  },
  {
    title: 'Turn it into 3D',
    tool: 'TRELLIS on Hugging Face',
    body: (
      <ol>
        <li>Open <Out href="https://huggingface.co/spaces/trellis-community/TRELLIS">TRELLIS on Hugging Face</Out> in your browser. It is free; you may wait in a queue.</li>
        <li>Upload the image from step 1 and press <strong>Generate &amp; Extract GLB</strong>.</li>
        <li>When the file shows up under <strong>Extracted GLB/Gaussian</strong>, download it.</li>
      </ol>
    ),
  },
  {
    title: 'Clean it up and add details',
    tool: 'Blender (or any 3D software)',
    body: (
      <>
        <p>The model comes out as lumpy triangles. Here is the whole clean-up, sped up:</p>
        <video
          src="/guides/funko-pop/cleanup.mp4"
          muted
          loop
          autoPlay
          playsInline
          className="my-6 w-full"
          aria-label="Blender screen recording: remesh, smooth, then crease and clay strip strokes"
        />
        <ol>
          <li>Install <Out href="https://www.blender.org/download/">Blender</Out> (free).</li>
          <li><strong>File → Import → glTF 2.0</strong> and pick the GLB.</li>
          <li>Switch to <strong>Sculpt Mode</strong>. Set the <strong>Remesh</strong> voxel size in the header (try 0.005; smaller keeps more detail) and press <strong>Ctrl+R</strong>. The triangle soup becomes one even surface.</li>
          <li>Use the <strong>Smooth</strong> brush (or hold <strong>Shift</strong> while sculpting) over the bumpy areas.</li>
          <li>Add details with <strong>Crease</strong> for lines and <strong>Clay Strips</strong> for plates.</li>
          <li><strong>File → Export → STL</strong>.</li>
        </ol>
      </>
    ),
  },
  {
    title: 'Print it',
    tool: 'A 3D printer',
    body: (
      <ol>
        <li>Open the STL in the printer's slicer and scale it to the size you want.</li>
        <li>Turn on supports: the big head and arms overhang.</li>
        <li>
          At UT Austin? <Out href="https://inventionworks.engr.utexas.edu">Texas Invention Works</Out> in the EER building has
          3D printers. Check their site for who can use them and how.
        </li>
      </ol>
    ),
  },
];

export default function FunkoPop() {
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
        title="Make your own Funko Pop"
        description="Photo to printed figure in four free steps: ChatGPT, TRELLIS, Blender, a 3D printer."
      />

      <section className="wrap max-w-[752px] pb-10">
        <header className="page-head">
          <h1>Make your own Funko Pop</h1>
          <p>From one photo to a figure you can hold, in four steps. Tick each one off as you go.</p>
        </header>

        <TurntableViewer videoPath="/3d/funko-clean.mp4" caption="The cleaned-up model from step 3. Drag to spin it." />

        <div className="sticky top-20 z-10 my-10 border border-line bg-bg px-5 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">
              {pct === 100 ? 'All done. Enjoy your Funko!' : `${done.length} of ${STEPS.length} steps`}
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
