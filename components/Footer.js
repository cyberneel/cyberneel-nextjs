import { Github, Linkedin, Instagram, Play } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-6 py-12 flex flex-col items-center">
        <div className="flex gap-6 mb-8">
          <a 
            href="https://linkedin.cyberneel.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a 
            href="https://instagram.com/cyber_neel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white transition-all transform hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="https://github.com/cyberneel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all transform hover:scale-110"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        </div>

        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            © {new Date().getFullYear()} <span className="font-bold text-slate-900 dark:text-white">Neelesh Chevuri</span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
            Built with <span className="text-blue-500">Next.js</span> & <span className="text-blue-500">Tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;