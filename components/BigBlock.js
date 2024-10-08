import styles from './BigBlock.module.css';

const BigBlock = ({headText = '', description = '', linkText = 'About', link = '/about'}) => {
  
  if (!headText) {
    headText = 'Welcome to CyberNeel\'s Blog!';
  }
  
  if (!description) {
    description = 'Exploring the fascinating world of technology!\nFollow for art and tech updates! ';
  }
  
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
          <img src="https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp" alt="CyberNeel" className={`${styles.image} img-fluid`} />
        </div>
      </div>
    </div>
  );
}

export default BigBlock;
