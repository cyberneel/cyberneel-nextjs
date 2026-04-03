import { useState, useEffect, useRef } from 'react';
import { Terminal, ChevronRight, X, Minus, Square } from 'lucide-react';
import { motion } from 'framer-motion';

const COMMANDS = {
  help: 'Available commands: about, skills, art, projects, contact, clear, whoami',
  whoami: 'CyberNeel - Computer Scientist, Tinkerer, & Digital Artist.',
  about: 'I build things that live on the intersection of technology and creativity.',
  skills: 'React, Next.js, Three.js, Python, GLSL, Tinkering with hardware...',
  art: 'Check out my 3D renders and digital sketches in the gallery below!',
  projects: 'Redirecting to projects... (Just kidding, scroll down!)',
  contact: 'Find me on Instagram @cyber_neel or use the contact form.',
};

export default function TerminalHero() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to CyberNeel OS v4.0.0' },
    { type: 'system', content: 'Type "help" to see available commands.' },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', content: cmd }];
    
    if (cmd === 'clear') {
      setHistory([]);
    } else if (COMMANDS[cmd]) {
      newHistory.push({ type: 'system', content: COMMANDS[cmd] });
      setHistory(newHistory);
    } else {
      newHistory.push({ type: 'system', content: `Command not found: ${cmd}. Type "help" for assistance.` });
      setHistory(newHistory);
    }
    
    setInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-lg shadow-2xl overflow-hidden border border-slate-700 font-mono"
      >
        {/* Terminal Header */}
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-slate-400" />
            <span className="text-xs text-slate-300">cyberneel@workspace: ~</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
          </div>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="p-6 h-80 overflow-y-auto text-sm md:text-base space-y-2 scrollbar-thin scrollbar-thumb-slate-700"
        >
          {history.map((entry, i) => (
            <div key={i} className="flex gap-2">
              {entry.type === 'user' ? (
                <span className="text-green-400">➜</span>
              ) : (
                <span className="text-blue-400">i</span>
              )}
              <span className={entry.type === 'user' ? 'text-white' : 'text-slate-300'}>
                {entry.content}
              </span>
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex items-center gap-2 mt-4">
            <span className="text-green-400">➜</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full focus:ring-0 p-0"
              autoFocus
              spellCheck="false"
            />
          </form>
        </div>
      </motion.div>
      
      <div className="mt-8 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter dark:text-white">
          Computer Scientist <span className="text-blue-600">&</span> Digital Artist
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Building immersive digital experiences where code meets creativity. 
          Currently tinkering with Next.js, Three.js, and hardware.
        </p>
      </div>
    </div>
  );
}
