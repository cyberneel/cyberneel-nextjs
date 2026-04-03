import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Home, ChevronDown, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [pages, setPages] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    fetch('/pages.json')
      .then(response => response.json())
      .then(data => setPages(data))
      .catch(error => console.error('Error:', error));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderMenuItems = (isMobile = false) => {
    return pages.map((item, index) => {
      if (item.test) return null;
      
      if (item.children) {
        return (
          <div key={index} className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold tracking-tight text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500 transition-all">
              {item.label} <ChevronDown size={14} />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <ul className="glass border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl py-3 min-w-[220px]">
                {item.children.map((child, cIdx) => (
                  <li key={cIdx}>
                    <Link 
                      href={child.path}
                      className="block px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
      
      return (
        <Link 
          key={index} 
          href={item.path}
          className={`px-4 py-2 text-sm font-bold tracking-tight transition-all ${
            isMobile 
              ? 'block text-2xl font-black border-b border-slate-100 dark:border-white/5 last:border-0 py-6' 
              : 'text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-500'
          }`}
          onClick={() => isMobile && setIsMenuOpen(false)}
        >
          <span className="flex items-center gap-2">
            {item.path === '/' && !isMobile && <Home size={14} />}
            {item.label}
          </span>
        </Link>
      );
    });
  };
  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'py-4' 
        : 'py-8'
    }`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className={`flex items-center justify-between px-6 py-3 rounded-[2rem] transition-all duration-500 ${
          isScrolled 
            ? 'glass shadow-2xl shadow-black/10' 
            : 'bg-transparent'
        }`}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center overflow-hidden shadow-lg shadow-red-600/20 group-hover:rotate-6 transition-transform duration-500">
              <img 
                src="https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp" 
                alt="CyberNeel" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              CYBER<span className="text-red-600">NEEL</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-1">
            {renderMenuItems()}
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white dark:bg-[#0a0a0a] z-40 lg:hidden overflow-y-auto animate-in fade-in duration-300">
          <div className="container mx-auto px-8 pt-32 pb-12 flex flex-col h-full">
            <div className="flex-grow">
              {renderMenuItems(true)}
            </div>
            <div className="mt-auto pt-8 border-t border-slate-100 dark:border-white/5">
              <p className="text-slate-400 dark:text-zinc-600 font-mono text-xs uppercase tracking-widest">
                Tinkerer & Digital Artist
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
