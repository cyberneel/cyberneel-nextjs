import { useState, useEffect } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const field =
  'w-full rounded-xl border border-line bg-bg-tint/60 px-4 py-3 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/15';
const label = 'eyebrow mb-2 block';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [mathAnswer, setMathAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [mathQuestion, setMathQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [error, setError] = useState(null);

  const formAction = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;
  const nameID = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_NAME;
  const emailID = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_EMAIL;
  const messageID = process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE;

  useEffect(() => {
    const a = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 50);
    setMathQuestion(`What is ${a} + ${b}?`);
    setCorrectAnswer(a + b);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (honeypot) return;
    if (parseInt(mathAnswer, 10) !== correctAnswer) {
      setError('Please answer the math question correctly.');
      return;
    }
    fetch(formAction, { method: 'POST', body: new FormData(e.target), mode: 'no-cors' })
      .then(() => setSubmitted(true))
      .catch(() => setError('Something went wrong — try again or email me directly.'));
  };

  if (!formAction || !nameID || !emailID || !messageID) {
    return (
      <div className="card p-8 text-center text-muted">
        The contact form isn&apos;t configured yet. Reach me at{' '}
        <a href="mailto:contact@cyberneel.com" className="text-accent">contact@cyberneel.com</a>.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <CheckCircle2 className="text-accent" size={40} />
        <h2 className="font-display text-2xl">Message sent</h2>
        <p className="text-muted">Thanks for reaching out — I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-7 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="cf-name">Name</label>
          <input id="cf-name" name={nameID} required className={field} placeholder="Jane Doe" />
        </div>
        <div>
          <label className={label} htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" name={emailID} required className={field} placeholder="jane@example.com" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="cf-message">Message</label>
        <textarea id="cf-message" name={messageID} required rows={5} className={`${field} resize-none`} placeholder="What's on your mind?" />
      </div>

      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" onChange={(e) => setHoneypot(e.target.value)} />

      <div>
        <label className={label} htmlFor="cf-math">{mathQuestion}</label>
        <input
          id="cf-math"
          value={mathAnswer}
          onChange={(e) => setMathAnswer(e.target.value)}
          required
          inputMode="numeric"
          className={`${field} max-w-[12rem]`}
          placeholder="Answer"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button type="submit" className="btn btn-primary">
        Send message <Send size={16} />
      </button>
    </form>
  );
}
