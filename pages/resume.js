import { Printer, Mail, Github, Linkedin, Globe } from 'lucide-react';
import Seo from '../components/Seo';
import { getAllExperienceData } from '../src/utils/experiences';

const ORDER = ['work', 'project', 'education'];
const HEADING = { work: 'Experience', project: 'Projects', education: 'Education' };

function summaryOf(content) {
  return (content || '').split('=ReAdMoRe=')[0].trim();
}

function bulletsOf(content) {
  const detail = (content || '').split('=ReAdMoRe=')[1] || '';
  return detail
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^-\s+/, ''));
}

const SKILLS = [
  ['Programming', 'Java, Python, C/C++, SQL (Postgres), Swift, JavaScript/TypeScript'],
  ['Frameworks', 'Next.js, React, Node.js, Flask, PyTorch, OpenCV, FreeRTOS, Bluetooth LE'],
  ['Developer Tools', 'Git/GitHub, Docker, Firebase, Apache Kafka, Cloudflare, Proxmox, CMake'],
];

export default function Resume({ groups }) {
  return (
    <>
      <Seo title="Résumé" description="Résumé of Neelesh Chevuri — computer scientist, tinkerer, and digital artist." />

      <section className="mx-auto max-w-3xl px-4 pt-32 pb-16 md:px-6 md:pt-40">
        {/* header */}
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">Neelesh Chevuri</h1>
            <p className="mt-2 text-lg text-muted">Eagle Scout, Full Stack Innovator, and Artist</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <a href="mailto:contact@cyberneel.com" className="inline-flex items-center gap-1.5 hover:text-fg">
                <Mail size={14} /> contact@cyberneel.com
              </a>
              <a href="https://cyberneel.com" className="inline-flex items-center gap-1.5 hover:text-fg">
                <Globe size={14} /> cyberneel.com
              </a>
              <a href="https://github.com/cyberneel" className="inline-flex items-center gap-1.5 hover:text-fg">
                <Github size={14} /> cyberneel
              </a>
              <a href="https://linkedin.cyberneel.com/" className="inline-flex items-center gap-1.5 hover:text-fg">
                <Linkedin size={14} /> LinkedIn
              </a>
            </div>
          </div>
          <PrintButton />
        </header>

        {/* sections */}
        {ORDER.filter((cat) => groups[cat]?.length).map((cat) => (
          <section key={cat} className="mt-10">
            <h2 className="eyebrow mb-5">{HEADING[cat]}</h2>
            <div className="space-y-7">
              {groups[cat].map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-display text-xl">{item.title}</h3>
                    <span className="text-sm text-faint">
                      {item.startDate}
                      {item.endDate ? ` — ${item.endDate}` : ''}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[15px] font-medium text-accent">
                    {item.company}
                    {item.location ? <span className="text-faint"> · {item.location}</span> : null}
                  </p>
                  {bulletsOf(item.content).length > 0 ? (
                    <ul className="mt-2 space-y-1.5">
                      {bulletsOf(item.content).map((b, i) => (
                        <li key={i} className="flex gap-2.5 text-[15px] leading-snug text-muted">
                          <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 leading-relaxed text-muted">{summaryOf(item.content)}</p>
                  )}
                  {(item.keywords || item.technologies)?.length > 0 && (
                    <p className="mt-2 text-sm text-faint">
                      {(item.keywords || item.technologies).join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* skills */}
        <section className="mt-10">
          <h2 className="eyebrow mb-5">Technical Skills</h2>
          <dl className="space-y-2.5">
            {SKILLS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <dt className="font-display text-[15px] sm:w-40 sm:shrink-0">{k}</dt>
                <dd className="text-[15px] text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </section>
    </>
  );
}

function PrintButton() {
  return (
    <button onClick={() => typeof window !== 'undefined' && window.print()} className="btn btn-ghost print:hidden">
      <Printer size={16} /> Print / Save PDF
    </button>
  );
}

export async function getStaticProps() {
  const all = getAllExperienceData();
  const groups = {};
  for (const item of all) {
    const cat = item.category || 'project';
    (groups[cat] ||= []).push(item);
  }
  return { props: { groups } };
}
