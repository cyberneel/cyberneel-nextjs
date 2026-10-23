import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink } from 'lucide-react';
import Seo from '../../components/Seo';
import TurntableViewer from '../../components/TurntableViewer';

// The guidebook behind the "make your own Funko Pop" reel (comment FUNKO).
// Ticked steps are remembered in this browser only.

const PROMPT = 'make this into a cartoon funkopop image with white background';
const KEY = 'guide:funko-pop';
const ease = [0.16, 1, 0.3, 1];

function Out({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent">
      {children}
      <ExternalLink size={13} className="ml-1 inline align-[-1px]" />
    </a>
  );
}

// prose-atelier leaves <ol> unnumbered (Tailwind's reset)
const OL = (p) => <ol className="list-decimal space-y-2 marker:text-accent" {...p} />;

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
    <div className="card my-5 flex items-center gap-3 p-4">
      <span className="flex-1 select-all font-mono text-sm leading-relaxed text-fg">{PROMPT}</span>
      <button type="button" onClick={copy} className="btn btn-ghost shrink-0" aria-live="polite">
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
        <OL>
          <li>Open <Out href="https://chatgpt.com">ChatGPT</Out> and upload a photo: you, a pet, a figure on your desk.</li>
          <li>Paste this prompt and send it:</li>
        </OL>
        <CopyPrompt />
        <OL start={3}>
          <li>Download the image. The plain white background helps the next step.</li>
        </OL>
        <img src="/guides/funko-pop/chatgpt.webp" alt="A cartoon Funko-style figure on a white background" className="card mx-auto my-6 w-full max-w-xs" loading="lazy" />
      </>
    ),
  },
  {
    title: 'Turn it into 3D',
    tool: 'TRELLIS on Hugging Face',
    body: (
      <OL>
        <li>Open <Out href="https://huggingface.co/spaces/trellis-community/TRELLIS">TRELLIS on Hugging Face</Out> in your browser. It is free; you may wait in a queue.</li>
        <li>Upload the image from step 1 and press <strong>Generate &amp; Extract GLB</strong>.</li>
        <li>When the file shows up under <strong>Extracted GLB/Gaussian</strong>, download it.</li>
      </OL>
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
          className="card my-6 w-full"
          aria-label="Blender screen recording: remesh, smooth, then crease and clay strip strokes"
        />
        <OL>
          <li>Install <Out href="https://www.blender.org/download/">Blender</Out> (free).</li>
          <li><strong>File → Import → glTF 2.0</strong> and pick the GLB.</li>
          <li>Switch to <strong>Sculpt Mode</strong>. Set the <strong>Remesh</strong> voxel size in the header (try 0.005; smaller keeps more detail) and press <strong>Ctrl+R</strong>. The triangle soup becomes one even surface.</li>
          <li>Use the <strong>Smooth</strong> brush (or hold <strong>Shift</strong> while sculpting) over the bumpy areas.</li>
          <li>Add details with <strong>Crease</strong> for lines and <strong>Clay Strips</strong> for plates.</li>
          <li><strong>File → Export → STL</strong>.</li>
        </OL>
      </>
    ),
  },
  {
    title: 'Print it',
    tool: 'A 3D printer',
    body: (
      <OL>
        <li>Open the STL in the printer's slicer and scale it to the size you want.</li>
        <li>Turn on supports: the big head and arms overhang.</li>
        <li>
          At UT Austin? <Out href="https://inventionworks.engr.utexas.edu">Texas Inventionworks</Out> in the EER building has
          3D printers. Check their site for who can use them and how.
        </li>
      </OL>
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

      <section className="mx-auto max-w-3xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="eyebrow mb-5">Guide</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.0]">
            Make your own <span className="text-accent italic">Funko Pop</span>.
          </h1>
          <p className="mt-6 text-lg text-muted">
            From one photo to a figure you can hold, in four steps. Tick each one off as you go.
          </p>
        </motion.header>

        <TurntableViewer videoPath="/3d/funko-clean.mp4" caption="The cleaned-up model from step 3. Drag to spin it." />

        <div className="sticky top-24 z-10 mb-10 rounded-full border border-line bg-bg/90 px-5 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">
              {pct === 100 ? 'All done. Enjoy your Funko!' : `${done.length} of ${STEPS.length} steps`}
            </span>
            <span className="font-mono text-accent">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {STEPS.map((s, i) => {
          const on = done.includes(i);
          return (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease }}
              className="hairline py-10"
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  aria-label={`Mark step ${i + 1} ${on ? 'not done' : 'done'}`}
                  className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border font-mono text-sm transition-colors ${
                    on ? 'border-accent bg-accent text-white' : 'border-line-strong text-muted hover:border-accent'
                  }`}
                >
                  {on ? <Check size={16} /> : i + 1}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow mb-2">{s.tool}</p>
                  <h2 className={`font-display text-3xl font-medium ${on ? 'text-muted line-through decoration-accent/60' : ''}`}>
                    {s.title}
                  </h2>
                  <div className="prose-atelier mt-5">{s.body}</div>
                </div>
              </div>
            </motion.article>
          );
        })}
        <div aria-hidden className="h-28" /> {/* room for the sticky bar to park below the last step */}
      </section>
    </>
  );
}
