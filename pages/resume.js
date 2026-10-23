import { Printer } from 'lucide-react';
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
  ['Developer tools', 'Git/GitHub, Docker, Firebase, Apache Kafka, Cloudflare, Proxmox, CMake'],
];

export default function Resume({ groups }) {
  return (
    <>
      <Seo title="Résumé" description="Résumé of Neelesh Chevuri: work, projects, education and skills." />

      <div className="wrap max-w-3xl pt-[clamp(48px,8vw,96px)] pb-24 print:pt-0">
        {/* header */}
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <h1 className="text-4xl tracking-[-0.035em] md:text-5xl">Neelesh Chevuri</h1>
            <p className="mt-2 text-lg text-muted">Eagle Scout, Full Stack Innovator, and Artist</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href="mailto:contact@cyberneel.com" className="lnk">contact@cyberneel.com</a>
              <a href="https://cyberneel.com" className="lnk">cyberneel.com</a>
              <a href="https://github.com/cyberneel" className="lnk">github.com/cyberneel</a>
              <a href="https://linkedin.cyberneel.com/" className="lnk">LinkedIn</a>
            </div>
          </div>
          <PrintButton />
        </header>

        {/* sections */}
        {ORDER.filter((cat) => groups[cat]?.length).map((cat) => (
          <section key={cat} className="mt-10">
            <h2 className="mb-5 border-b border-hair pb-2 text-xl">{HEADING[cat]}</h2>
            <div className="space-y-7">
              {groups[cat].map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <span className="font-mono text-[13px] text-muted">
                      {item.startDate}
                      {item.endDate ? ` – ${item.endDate}` : ''}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[15px]">
                    {item.company}
                    {item.location ? <span className="text-muted">, {item.location}</span> : null}
                  </p>
                  {bulletsOf(item.content).length > 0 ? (
                    <ul className="mt-2 list-[square] space-y-1.5 pl-5 marker:text-muted">
                      {bulletsOf(item.content).map((b, i) => (
                        <li key={i} className="text-[15px] leading-snug text-muted">{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 leading-relaxed text-muted">{summaryOf(item.content)}</p>
                  )}
                  {(item.keywords || item.technologies)?.length > 0 && (
                    <p className="mt-2 text-sm text-muted">
                      {(item.keywords || item.technologies).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* skills */}
        <section className="mt-10">
          <h2 className="mb-5 border-b border-hair pb-2 text-xl">Technical skills</h2>
          <dl className="space-y-2.5">
            {SKILLS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <dt className="text-[15px] font-medium sm:w-40 sm:shrink-0">{k}</dt>
                <dd className="text-[15px] text-muted">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}

function PrintButton() {
  return (
    <button onClick={() => typeof window !== 'undefined' && window.print()} className="btn ghost print:hidden">
      <Printer /> Print or save as PDF
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
