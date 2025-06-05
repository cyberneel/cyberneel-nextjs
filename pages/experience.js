import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SEO from '../components/SEO';
import BigBlock from '../components/BigBlock';
import styles from './experience.module.css';
import { getAllExperienceData } from '../src/utils/experiences';
import dynamic from 'next/dynamic';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import ImageMDX from '../components/ImageMDX';
import FontWrapper from '../components/FontWrapper';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Experience({ experienceData }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredData, setFilteredData] = useState(experienceData);
  const [years, setYears] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mdxSource, setMdxSource] = useState(null);
  const [visibleYears, setVisibleYears] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_LOAD = 3; // Number of years to load at a time

  useEffect(() => {
    // Initialize on component mount
    const sortedData = [...experienceData].sort((a, b) => b.year - a.year);
    setFilteredData(sortedData);
    
    const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
    setYears(uniqueYears);
    
    // Initialize with first batch of years
    setVisibleYears(uniqueYears.slice(0, ITEMS_PER_LOAD));
    setHasMore(uniqueYears.length > ITEMS_PER_LOAD);
  }, [experienceData]);

  useEffect(() => {
    // Filter data when category changes
    if (selectedCategory === 'all') {
      const sortedData = [...experienceData].sort((a, b) => b.year - a.year);
      setFilteredData(sortedData);
      
      const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
      setYears(uniqueYears);
      
      // Reset visible years on category change
      setVisibleYears(uniqueYears.slice(0, ITEMS_PER_LOAD));
      setHasMore(uniqueYears.length > ITEMS_PER_LOAD);
    } else {
      const filtered = experienceData.filter(item => item.category === selectedCategory);
      const sortedData = filtered.sort((a, b) => b.year - a.year);
      setFilteredData(sortedData);
      
      const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
      setYears(uniqueYears);
      
      // Reset visible years on category change
      setVisibleYears(uniqueYears.slice(0, ITEMS_PER_LOAD));
      setHasMore(uniqueYears.length > ITEMS_PER_LOAD);
    }
  }, [selectedCategory, experienceData]);

  const toggleExpand = async (item) => {
    setModalItem(item);
    
    try {
      // Extract content after ReadMore separator if it exists
      const contentParts = item.content.split('=ReAdMoRe=');
      const mdxContent = contentParts.length > 1 ? contentParts[1] : item.content;
      
      // Process MDX content with next-mdx-remote
      const mdxSource = await serialize(mdxContent);
      setMdxSource(mdxSource);
      
      // Show modal after content is processed
      setShowModal(true);
    } catch (error) {
      console.error('Error processing MDX:', error);
      setShowModal(true); // Show modal anyway, with fallback content
    }
  };

  const closeModal = () => {
    // Get modal elements to add closing animation classes
    const modalOverlay = document.querySelector(`.${styles.modalOverlay}`);
    const modal = document.querySelector(`.${styles.modal}`);
    
    if (modalOverlay && modal) {
      // Add closing animation classes
      modalOverlay.classList.add(styles.fadeOut);
      modal.classList.add(styles.slideUp);
      
      // Wait for animation to complete before removing from DOM
      setTimeout(() => {
        setShowModal(false);
        setModalItem(null);
        setMdxSource(null); // Clear MDX source when closing
      }, 300); // Match this to the animation duration in CSS
    } else {
      // Fallback if elements not found
      setShowModal(false);
      setModalItem(null);
      setMdxSource(null); // Clear MDX source when closing
    }
  };

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    const handleClickOutside = (e) => {
      if (showModal && e.target.classList.contains(styles.modalOverlay)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showModal]);

  // Load more years for infinite scroll
  const loadMoreYears = () => {
    const currentLength = visibleYears.length;
    const moreYears = years.slice(currentLength, currentLength + ITEMS_PER_LOAD);
    
    if (moreYears.length > 0) {
      setVisibleYears(prevVisibleYears => [...prevVisibleYears, ...moreYears]);
      setHasMore(currentLength + moreYears.length < years.length);
    } else {
      setHasMore(false);
    }
  };

  return (
    <>
      <SEO 
        title="CyberNeel - Professional Experience"
        description="Explore CyberNeel's professional journey, including work experience, education, and personal projects."
        canonicalUrl="https://cyberneel.com/experience"
        tags={["experience", "portfolio", "career", "education", "projects"]}
      />
      
      <div className='p-3 container'>
        <BigBlock 
          headText='Professional Experience'
          description='My journey through education, work, and personal projects. '
          linkText="Let's Explore!"
          link='#experienceSection'
        />
      </div>
      
      <hr className="hr hr-blurry" id="experienceSection"/>
      <h2 className="text-center p-3 subtleTransparent">My Experience</h2>
      <div className="text-center">
        <span className={`badge mx-1 ${
          selectedCategory === 'education' ? 'bg-primary' : 
          selectedCategory === 'work' ? 'bg-success' : 
          selectedCategory === 'all' ? 'd-none' :
          'bg-danger'
        }`}>
          {selectedCategory !== 'all' && `Showing ${selectedCategory} only`}
        </span>
      </div>
      <hr className="hr hr-blurry" />
      
      <div className={styles.experienceContainer + " rounded-3"}>
        {/* Category filters */}
        <div className={styles.filterButtons}>
          <div className="btn-group" role="group" aria-label="Experience categories">
            <button 
              type="button" 
              className={`btn ${selectedCategory === 'all' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button 
              type="button" 
              className={`btn ${selectedCategory === 'education' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory('education')}
            >
              Education
            </button>
            <button 
              type="button" 
              className={`btn ${selectedCategory === 'work' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setSelectedCategory('work')}
            >
              Work
            </button>
            <button 
              type="button" 
              className={`btn ${selectedCategory === 'project' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setSelectedCategory('project')}
            >
              Projects
            </button>
          </div>
        </div>
        
        {/* Timeline sections with infinite scroll */}
        <InfiniteScroll
          dataLength={visibleYears.length}
          next={loadMoreYears}
          hasMore={hasMore}
          loader={
            <div className="text-center my-4">
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
          endMessage={
            <p className="text-center text-muted my-4">
              {years.length > 0 ? "That's all the experiences!" : "No experiences found for this category."}
            </p>
          }
        >
          {visibleYears.map(year => (
            <div key={year} className={styles.timelineYear}>
              <div className={styles.yearHeader}>
                <h3 className={`${styles.yearTitle} ${
                  selectedCategory === 'education' ? styles.yearTitleEducation : 
                  selectedCategory === 'work' ? styles.yearTitleWork : 
                  selectedCategory === 'project' ? styles.yearTitleProject :
                  ''
                }`}>{year}</h3>
                <div className={`${styles.yearLine} ${
                  selectedCategory === 'education' ? styles.yearLineEducation : 
                  selectedCategory === 'work' ? styles.yearLineWork : 
                  styles.yearLineDefault
                }`} />
              </div>
              
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 700: 2, 1000: 3 }}>
                <Masonry gutter="1rem">
                  {filteredData.filter(item => item.year === year).map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`card shadow-sm ${styles.card} ${styles.clickableCard} ${
                        item.category === 'education' ? styles.cardEducation : 
                        item.category === 'work' ? styles.cardWork : 
                        styles.cardProject
                      }`}
                      onClick={() => toggleExpand(item)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="card-body d-flex flex-column">
                        <div className={styles.cardHeader + " mb-2"}>
                          <h5 className="card-title mb-0">{item.title}</h5>
                          <span className={`badge ${
                            item.category === 'education' ? 'bg-primary' : 
                            item.category === 'work' ? 'bg-success' : 
                            'bg-danger'
                          }`}>{item.category}</span>
                        </div>
                        <h6 className="card-subtitle mb-2 text-muted">{item.company}</h6>
                        <p className="card-text small text-muted mb-2">
                          {item.location} · {item.startDate} - {item.endDate}
                        </p>
                        <p className="card-text">
                          {item.content.split('=ReAdMoRe=')[0] || item.content}
                        </p>
                        {item.technologies && (
                          <div className="mb-3">
                            {item.technologies.map(tech => (
                              <span key={tech} className={`${styles.techBadge} ${
                                item.category === 'education' ? styles.techBadgeEducation : 
                                item.category === 'work' ? styles.techBadgeWork : 
                                styles.techBadgeProject
                              } badge me-1 mb-1`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.keywords && (
                          <div className="mb-2">
                            <span className="fw-semibold small me-2">Keywords:</span>
                            {item.keywords.map(tech => (
                              <span key={tech} className={`${styles.techBadge} ${
                                item.category === 'education' ? styles.techBadgeEducation : 
                                item.category === 'work' ? styles.techBadgeWork : 
                                item.category === 'project' ? styles.techBadgeProject : ''
                              } badge me-1 mb-1`}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                          <div 
                            className={`btn btn-sm ${
                              item.category === 'education' ? 'btn-outline-primary' : 
                              item.category === 'work' ? 'btn-outline-success' : 
                              'btn-outline-danger'
                            } ${styles.expandButton}`}
                          >
                            Read More
                          </div>
                          {item.link && (
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={`${styles.linkButton} btn btn-sm btn-link ${
                                item.category === 'education' ? styles.linkButtonEducation : 
                                item.category === 'work' ? styles.linkButtonWork : 
                                styles.linkButtonProject
                              }`}
                              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
                            >
                              Visit
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </div>
          ))}
        </InfiniteScroll>
      </div>

      {/* Modal for expanded content */}
      {showModal && modalItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={`${styles.modalHeader} ${
              modalItem.category === 'education' ? styles.modalHeaderEducation : 
              modalItem.category === 'work' ? styles.modalHeaderWork : 
              modalItem.category === 'project' ? styles.modalHeaderProject : ''
            }`}>
              <h4 className={styles.modalTitle}>{modalItem.title}</h4>
              <button className={styles.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-muted mb-0">{modalItem.company}</h6>
                <span className={`badge ${
                  modalItem.category === 'education' ? 'bg-primary' : 
                  modalItem.category === 'work' ? 'bg-success' : 
                  'bg-danger'
                }`}>{modalItem.category}</span>
              </div>
              <p className="small text-muted mb-3">
                {modalItem.location} · {modalItem.startDate} - {modalItem.endDate}
              </p>
              <div className={styles.modalContent}>
                {modalItem.content.split('=ReAdMoRe=')[1] ? (
                  <>
                    <p>{modalItem.content.split('=ReAdMoRe=')[0]}</p>
                    <div className={styles.mdxContent}>
                      {mdxSource ? (
                        <MDXRemote 
                          {...mdxSource} 
                          components={{ 
                            ImageMDX,
                            Font: FontWrapper
                          }} 
                        />
                      ) : (
                        <p>Loading content...</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p>{modalItem.content}</p>
                )}
              </div>
              {modalItem.keywords && (
                <div className="mt-3">
                  <h6>Keywords:</h6>
                  <div>
                    {modalItem.keywords.map(tech => (
                      <span key={tech} className={`${styles.techBadge} ${
                        modalItem.category === 'education' ? styles.techBadgeEducation : 
                        modalItem.category === 'work' ? styles.techBadgeWork : 
                        modalItem.category === 'project' ? styles.techBadgeProject : ''
                      } badge me-1 mb-1`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {modalItem.link && (
                <div className="mt-3">
                  <a 
                    href={modalItem.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`btn ${
                      modalItem.category === 'education' ? 'btn-primary' : 
                      modalItem.category === 'work' ? 'btn-success' : 
                      'btn-danger'
                    }`}
                  >
                    Visit {modalItem.category === 'project' ? 'Project' : modalItem.category === 'work' ? 'Company' : 'Institution'}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const experienceData = getAllExperienceData();
  
  return {
    props: {
      experienceData
    }
  };
}
