import styles from './BigBlock.module.css';
import { useState, useRef, useEffect } from 'react';

const BigBlock = ({
  headText = '', 
  description = '', 
  linkText = 'About', 
  link = '/about',
  // Add new props with default values for tilt control
  maxTiltAngle = 10, 
  tiltDistance = 400
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imgRef.current) return;
      
      // Get the image element's bounding rectangle
      const rect = imgRef.current.getBoundingClientRect();
      
      // Calculate the center of the image
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to center
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      
      // Calculate proximity (closer = stronger effect)
      const proximity = Math.sqrt(distX * distX + distY * distY);
      
      // Only apply effect when mouse is within the specified distance
      if (proximity < tiltDistance) {
        // Use a non-linear formula for smoother effect as distance changes
        const factor = 1 - Math.min(1, proximity / tiltDistance);
        
        // Calculate tilt amount based on the max angle and distance factor
        const tiltX = (distY / tiltDistance) * maxTiltAngle * factor;
        const tiltY = -(distX / tiltDistance) * maxTiltAngle * factor;
        
        setTilt({ x: tiltX, y: tiltY });
      } else {
        // Reset when mouse is far away
        setTilt({ x: 0, y: 0 });
      }
    };
    
    // Add smooth transition back to normal when mouse leaves
    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  if (!headText) {
    headText = 'Welcome to CyberNeel\'s Blog!';
  }
  
  if (!description) {
    description = 'Exploring the fascinating world of technology!\nFollow for art and tech updates! ';
  }
  
  const imageStyle = {
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: 'transform 0.2s ease-out',
  };
  
  return (
    <div className={`container ${styles.customContainer}`}>
      <div className={`row ${styles.customRow}`}>
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div className={`card ${styles.customCard} rounded-4`}>
            <div className="card-body">
              <h1 className="card-title">{headText}</h1>
              <p className="card-text">
                {description}
                <a href="https://instagram.com/cyber_neel" target="_blank" rel="noopener noreferrer">@cyber_neel</a>
              </p>
              <a href={link} className="btn btn-danger">{linkText}</a>
            </div>
          </div>
        </div>
        <div className={`col-12 col-md-6 d-flex align-items-center justify-content-center ${styles.imageDiv}`}>
          <img 
            ref={imgRef}
            src="https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp" 
            alt="CyberNeel" 
            className={`${styles.image} img-fluid`} 
            style={imageStyle}
          />
        </div>
      </div>
    </div>
  );
}

export default BigBlock;
