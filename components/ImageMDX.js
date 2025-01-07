import React from 'react';
import PropTypes from 'prop-types';
import styles from './ImageMDX.module.css';

const ImageMDX = ({ src, alt, position = 'center', aspectRatio = '16:9', width = '100%', caption }) => {
    const aspectRatioPadding = {
        '16:9': '56.25%',
        '4:3': '75%',
        '1:1': '100%',
    }[aspectRatio] || '56.25%';

    return (
        <div className={`${styles.imageContainer} ${styles[position]}`} style={{ width }}>
            <div className={styles.aspectRatio} style={{ paddingBottom: '0%'/*aspectRatioPadding*/ }}>
                <img src={src} alt={alt} className={styles.image} />
            </div>
            {caption && <div className={styles.caption}>{caption}</div>}
        </div>
    );
};

ImageMDX.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    position: PropTypes.oneOf(['left', 'center', 'right']),
    aspectRatio: PropTypes.oneOf(['16:9', '4:3', '1:1']),
    width: PropTypes.string,
    caption: PropTypes.string,
};

export default ImageMDX;