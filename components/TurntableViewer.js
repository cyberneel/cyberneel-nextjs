import { useRef, useState, useEffect } from 'react';

const TurntableViewer = ({ videoPath }) => {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.addEventListener('loadedmetadata', () => {
        setIsVideoLoaded(true);
        video.pause(); // Pause video for slider control
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', () => {});
      }
    };
  }, []);

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    setSliderValue(value);

    const video = videoRef.current;
    if (isVideoLoaded && video) {
      video.currentTime = (value / 100) * video.duration;
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
      <div
        style={{
          width: '100%',
          height: 'auto',
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '.75rem',
        }}
      >
        <video
          ref={videoRef}
          src={videoPath}
          preload="auto"
          type="video/mp4"
          loop
          style={{ width: '100%', display: 'block' }}
        />
        {!isVideoLoaded && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000',
              color: '#fff',
              fontSize: '1.2rem',
            }}
          >
            Loading...
          </div>
        )}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderValue}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            appearance: 'none',
            height: '12px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #FFC1C1 0%, #F75C5C 100%)',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        />
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #ffffff;
            border: 3px solid #F75C5C;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          input[type='range']::-webkit-slider-thumb:hover {
            transform: scale(1.2);
          }

          input[type='range']::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #ffffff;
            border: 3px solid #F75C5C;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          input[type='range']::-moz-range-thumb:hover {
            transform: scale(1.2);
          }
        `}</style>
      </div>
    </div>
  );
};

export default TurntableViewer;
