import styles from './BigBlock.module.css';

function BigBlock(){
    return (<>
    <div className={`container ${styles.customContainer}`}>
      <div className={`row ${styles.customRow}`}>
        <div className="col-md-6 d-flex align-items-center">
          <div className={`card ${styles.customCard}` + " rounded-4"}>
            <div className="card-body">
              <h1 className="card-title">Welcome to CyberNeel's Blog!</h1>
              <p className="card-text">
                Exploring the fascinating world of technology!<br />
                Follow for art and tech updates!&nbsp; 
                <a href="https://twitter.com/cyber_neel" target="_blank" rel="noopener noreferrer">@cyber_neel</a>
              </p>
              <a href="/about" className="btn btn-danger">About</a>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img src="https://cyberneel.design/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp" alt="CyberNeel" className={styles.image + " img-fluid"} />
        </div>
      </div>
    </div>
  </>)
}
export default BigBlock;