import { motion } from 'framer-motion';
import { ArrowRight, Code, Palette, Zap } from 'lucide-react';

export default function ModernHero() {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest uppercase bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                Computer Scientist • Tinkerer • Artist
              </span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8 text-slate-900 dark:text-white">
                Exploring the <span className="text-red-600">intersection</span> of code & creativity.
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
                I build immersive digital experiences, tinker with hardware, and create digital art. 
                Welcome to my digital workspace where I share my latest projects and insights.
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a href="#projects" className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-red-600/20 flex items-center gap-2 group">
                  View My Work <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/about" className="px-8 py-4 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-zinc-800">
                  About Me
                </a>
              </div>
            </motion.div>
          </div>
          
          <div className="flex-1 relative hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-square"
            >
              {/* Decorative Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/20 blur-3xl rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 blur-2xl rounded-full" />
              
              {/* Floating Icons */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 text-red-600"
              >
                <Code size={40} />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-0 p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 text-red-500"
              >
                <Palette size={48} />
              </motion.div>
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 bg-red-600 text-white rounded-[2.5rem] shadow-2xl shadow-red-600/40"
              >
                <Zap size={64} fill="white" />
              </motion.div>
              
              <div className="absolute bottom-0 right-10 p-4 bg-zinc-900 text-white rounded-2xl border border-white/10 text-xs font-mono shadow-2xl">
                <div className="flex gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="text-red-400">const</div> <div className="text-white">cyberNeel</div> = <div className="text-green-400">"creative"</div>;
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
