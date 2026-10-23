import { useState, useEffect } from 'react';
const field = 'input';
const label = 'mb-2 block text-sm font-medium';

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
      .catch(() => setError('Something went wrong. Try again or email me directly.'));
  };

  if (!formAction || !nameID || !emailID || !messageID) {
    return (
      <p className="border border-line p-8 text-muted">
        The contact form isn&apos;t set up yet. Email me at <a href="mailto:contact@cyberneel.com">contact@cyberneel.com</a>.
      </p>
    );
  }

  if (submitted) {
    return (
      <div className="border border-line p-8">
        <h2 className="text-2xl">Message sent</h2>
        <p className="mt-2 text-muted">Thanks for reaching out. I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <textarea id="cf-message" name={messageID} required rows={5} className={`${field} resize-y`} placeholder="What's on your mind?" />
      </div>

      <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" onChange={(e) => setHoneypot(e.target.value)} />

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

      {error && <p role="alert" className="text-sm font-medium">{error}</p>}

      <button type="submit" className="btn primary">Send message</button>
    </form>
  );
}
