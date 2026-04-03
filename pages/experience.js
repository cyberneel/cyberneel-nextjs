import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SEO from '../components/SEO';
import { getAllExperienceData } from '../src/utils/experiences';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import ImageMDX from '../components/ImageMDX';
import FontWrapper from '../components/FontWrapper';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import InfiniteScroll from 'react-infinite-scroll-component';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Briefcase, GraduationCap, Laptop, X, ExternalLink } from 'lucide-react';

export default function Experience({ experienceData }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [years, setYears] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mdxSource, setMdxSource] = useState(null);
  const [visibleYears, setVisibleYears] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_LOAD = 3;

  const experienceList = experienceData || [];

  useEffect(() => {
    const sortedData = [...experienceList].sort((a, b) => b.year - a.year);
    const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
    setYears(uniqueYears);
    setVisibleYears(uniqueYears.slice(0, ITEMS_PER_LOAD));
    setHasMore(uniqueYears.length > ITEMS_PER_LOAD);
  }, [experienceList]);

  useEffect(() => {
    const filtered = selectedCategory === 'all' 
      ? experienceList 
      : experienceList.filter(item => item.category === selectedCategory);
    
    const sortedData = filtered.sort((a, b) => b.year - a.year);
    const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
    
    setYears(uniqueYears);
    setVisibleYears(uniqueYears.slice(0, ITEMS_PER_LOAD));
    setHasMore(uniqueYears.length > ITEMS_PER_LOAD);
  }, [selectedCategory, experienceList]);

  const toggleExpand = async (item) => {
    setModalItem(item);
    try {
      const contentParts = item.content.split('=ReAdMoRe=');
      const mdxContent = contentParts.length > 1 ? contentParts[1] : item.content;
      const mdxSource = await serialize(mdxContent);
      setMdxSource(mdxSource);
      setShowModal(true);
    } catch (error) {
      console.error('Error processing MDX:', error);
      setShowModal(true);
    }
  };

  const loadMoreYears = () => {
    const currentLength = visibleYears.length;
    const moreYears = years.slice(currentLength, currentLength + ITEMS_PER_LOAD);
    if (moreYears.length > 0) {
      setVisibleYears(prev => [...prev, ...moreYears]);
      setHasMore(currentLength + moreYears.length < years.length);
    } else {
      setHasMore(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'work': return <Briefcase size={14} />;
      case 'education': return <GraduationCap size={14} />;
      default: return <Laptop size={14} />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'work': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'education': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <SEO title="Experience | CyberNeel" />
      
      <div className="container mx-auto px-4 md:px-8">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 uppercase"
          >
            MY <span className="text-red-600">JOURNEY</span>
          </motion.h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
            A timeline of my professional growth, educational milestones, and creative projects.
          </p>
        </header>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {['all', 'education', 'work', 'project'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                ? 'bg-red-600 text-white shadow-xl shadow-red-600/20 scale-105' 
                : 'glass dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <InfiniteScroll
          dataLength={visibleYears.length}
          next={loadMoreYears}
          hasMore={hasMore}
          loader={<div className="text-center py-10 text-red-600 animate-pulse font-black uppercase tracking-widest">Loading more...</div>}
        >
          {visibleYears.map(year => (
            <div key={year} className="mb-20">
              <div className="flex items-center gap-6 mb-10">
                <h2 className="text-6xl font-black tracking-tighter text-red-600/20 dark:text-red-600/10 italic">{year}</h2>
                <div className="h-[2px] flex-grow bg-slate-200 dark:bg-white/5" />
              </div>
              
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 800: 2, 1200: 3 }}>
                <Masonry gutter="2rem">
                  {experienceList.filter(item => item.year === year && (selectedCategory === 'all' || item.category === selectedCategory)).map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={item.id} 
                      className="glass-card rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-red-600/5 transition-all cursor-pointer group"
                      onClick={() => toggleExpand(item)}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)} {item.category}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-lg font-bold text-slate-600 dark:text-slate-400 mb-6">{item.company}</p>
                      
                      <div className="space-y-2 mb-8 text-sm font-bold text-slate-500 dark:text-slate-500">
                        <div className="flex items-center gap-2"><Calendar size={14} /> {item.startDate} - {item.endDate}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} /> {item.location}</div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed">
                        {item.content.split('=ReAdMoRe=')[0]}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {(item.technologies || item.keywords || []).slice(0, 4).map(tech => (
                          <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                        Details →
                      </div>
                    </motion.div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          ))}
        </InfiniteScroll>
      </div>

      <AnimatePresence>
        {showModal && modalItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass-card rounded-[3rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 mb-6 ${getCategoryColor(modalItem.category)}`}>
                      {getCategoryIcon(modalItem.category)} {modalItem.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                      {modalItem.title}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 dark:text-white hover:bg-red-600 hover:text-white transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-lg font-bold text-slate-900 dark:text-white">
                      <Briefcase className="text-red-600" /> {modalItem.company}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Calendar className="text-red-600" /> {modalItem.startDate} - {modalItem.endDate}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <MapPin className="text-red-600" /> {modalItem.location}
                    </div>
                  </div>
                  
                  {modalItem.link && (
                    <div className="flex md:justify-end items-center">
                      <a 
                        href={modalItem.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                      >
                        Visit <ExternalLink size={18} />
                      </a>
                    </div>
                  )}
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none 
                  prose-headings:tracking-tighter prose-headings:font-black
                  prose-p:text-lg prose-p:leading-relaxed">
                  <div className="mb-8">{modalItem.content.split('=ReAdMoRe=')[0]}</div>
                  {mdxSource && (
                    <MDXRemote {...mdxSource} components={{ ImageMDX, Font: FontWrapper }} />
                  )}
                </div>

                {(modalItem.technologies || modalItem.keywords) && (
                  <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 italic">Keywords & Tech</h4>
                    <div className="flex flex-wrap gap-2">
                      {(modalItem.technologies || modalItem.keywords).map(tech => (
                        <span key={tech} className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export async function getStaticProps() {
  const experienceData = getAllExperienceData();
  return { props: { experienceData } };
}

