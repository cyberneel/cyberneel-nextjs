import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';
import Seo from '../components/Seo';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Get in touch with Neelesh Chevuri (CyberNeel)." />

      <section className="mx-auto max-w-5xl px-4 pt-36 pb-10 md:px-6 md:pt-44">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow mb-5">Contact</p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-medium leading-[1.0]">
              Say <span className="text-accent italic">hello</span>.
            </h1>
            <p className="mt-5 text-lg text-muted">
              Have a project, an idea, or just want to chat? Drop me a line and I&apos;ll get back to you.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <a href="mailto:contact@cyberneel.com" className="group inline-flex items-center gap-3 text-muted hover:text-fg">
                <Mail size={17} className="text-accent" /> <span className="link-underline">contact@cyberneel.com</span>
              </a>
              <a href="https://github.com/cyberneel" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-muted hover:text-fg">
                <Github size={17} className="text-accent" /> <span className="link-underline">github.com/cyberneel</span>
              </a>
              <a href="https://linkedin.cyberneel.com/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-muted hover:text-fg">
                <Linkedin size={17} className="text-accent" /> <span className="link-underline">LinkedIn</span>
              </a>
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </>
  );
}
