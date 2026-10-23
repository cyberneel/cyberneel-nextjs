import Seo from '../components/Seo';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Get in touch with Neelesh Chevuri (CyberNeel)." />
      <div className="wrap pb-24">
        <header className="page-head">
          <h1>Get in touch</h1>
          <p>Have a project, a role or a question? Send a note and I&apos;ll get back to you.</p>
        </header>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <ul className="space-y-3 text-lg">
            <li><a href="mailto:contact@cyberneel.com">contact@cyberneel.com</a></li>
            <li><a href="https://github.com/cyberneel" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://linkedin.cyberneel.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
