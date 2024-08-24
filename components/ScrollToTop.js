// components/ScrollToTop.js

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '50px',
          right: '50px',
          padding: '10px 20px',
          fontSize: '18px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: '1000',
        }}
      >
        ↑ Top
      </button>
    )
  );
}
