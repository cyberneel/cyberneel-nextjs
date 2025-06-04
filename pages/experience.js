import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SEO from '../components/SEO';
import BigBlock from '../components/BigBlock';
import styles from './experience.module.css';
import { getAllExperienceData } from '../src/utils/experiences';
import dynamic from 'next/dynamic';
import Masonry from 'react-responsive-masonry';

export default function Experience({ experienceData }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredData, setFilteredData] = useState(experienceData);
  const [years, setYears] = useState([]);
  const [modalItem, setModalItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Initialize on component mount
    const sortedData = [...experienceData].sort((a, b) => b.year - a.year);
    setFilteredData(sortedData);
    
    const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
    setYears(uniqueYears);
  }, []);

  useEffect(() => {
    // Filter data when category changes
    if (selectedCategory === 'all') {
      const sortedData = [...experienceData].sort((a, b) => b.year - a.year);
      setFilteredData(sortedData);
      
      const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
      setYears(uniqueYears);
    } else {
      const filtered = experienceData.filter(item => item.category === selectedCategory);
      const sortedData = filtered.sort((a, b) => b.year - a.year);
      setFilteredData(sortedData);
      
      const uniqueYears = [...new Set(sortedData.map(item => item.year))].sort((a, b) => b - a);
      setYears(uniqueYears);
    }
  }, [selectedCategory]);

  const toggleExpand = (item) => {
    setModalItem(item);
    setShowModal(true);
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
      }, 300); // Match this to the animation duration in CSS
    } else {
      // Fallback if elements not found
      setShowModal(false);
      setModalItem(null);
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

  return (
    <>
      <SEO 
        title="CyberNeel - Professional Experience"
        description="Explore CyberNeel's professional journey, including work experience, education, and personal projects."
        canonicalUrl="https://cyberneel.com/experience"
        tags={["experience", "portfolio", "career", "education", "projects"]}
      />
      
      <div className='p-3 col-md-8 container'>
        <BigBlock 
          headText='Professional Experience'
          description='My journey through education, work, and personal projects. '
          linkText="Let's Explore!"
          link='#experienceSection'
        />
      </div>
      
      <hr className="hr hr-blurry" id="experienceSection"/>
      <h2 className="text-center p-3 subtleTransparent">My Experience</h2>
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
              className={`btn ${selectedCategory === 'education' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setSelectedCategory('education')}
            >
              Education
            </button>
            <button 
              type="button" 
              className={`btn ${selectedCategory === 'work' ? 'btn-danger' : 'btn-outline-danger'}`}
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
        
        {/* Timeline sections by year */}
        {years.map(year => (
          <div key={year} className={styles.timelineYear}>
            <div className={styles.yearHeader}>
              <h3 className={styles.yearTitle}>{year}</h3>
              <div className={styles.yearLine} />
            </div>
            
            <Masonry gutter="1rem">
              {filteredData.filter(item => item.year === year).map(item => (
                <div key={item.id} className={`card shadow-sm ${styles.card}`}>
                  <div className="card-body d-flex flex-column">
                    <div className={styles.cardHeader + " mb-2"}>
                      <h5 className="card-title mb-0">{item.title}</h5>
                      <span className="badge bg-danger">{item.category}</span>
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
                          <span key={tech} className={styles.techBadge + " badge me-1 mb-1"}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                        <button 
                          className={`btn btn-sm btn-outline-danger ${styles.expandButton}`}
                          onClick={() => toggleExpand(item)}
                        >
                          Read More
                        </button>
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.linkButton + " btn btn-sm btn-link"}
                          >
                            Visit
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            </div>
          ))}
        </div>

        {/* Modal for expanded content */}
        {showModal && modalItem && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h4 className={styles.modalTitle}>{modalItem.title}</h4>
                <button className={styles.modalClose} onClick={closeModal}>×</button>
              </div>
              <div className={styles.modalBody}>
                <h6 className="text-muted mb-2">{modalItem.company}</h6>
                <p className="small text-muted mb-3">
                  {modalItem.location} · {modalItem.startDate} - {modalItem.endDate}
                </p>
                <div className={styles.modalContent}>
                  {modalItem.content.split('=ReAdMoRe=')[1] ? 
                    <>
                      <p>{modalItem.content.split('=ReAdMoRe=')[0]}</p>
                      <p>{modalItem.content.split('=ReAdMoRe=')[1]}</p>
                    </> :
                    <p>{modalItem.content}</p>
                  }
                </div>
                {modalItem.technologies && (
                  <div className="mt-3">
                    <h6>Technologies:</h6>
                    <div>
                      {modalItem.technologies.map(tech => (
                        <span key={tech} className={styles.techBadge + " badge me-1 mb-1"}>
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
                      className="btn btn-danger"
                    >
                      Visit Project
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