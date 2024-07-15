import React from 'react';
import styles from 'PostCard.module.css'

const PostCard = ({ post }) => {
  //const { title, description, date, tags, image } = post.fields;
  const { title, description, date, imageLink } = post.fields;


  return (
    <div className={styles.post-card}>
      <img src={imageLink} alt={title} className={styles.post-image} />
      <div className={styles.post-content}>
        //<div className="post-tags">{tags.join(', ')}</div>
        <h2 className={styles.post-title}>{title}</h2>
        <div className={styles.post-date}>{new Date(date).toLocaleDateString()}</div>
        <p className={styles.post-description}>{description}</p>
        <button className={styles.post-button}>Show More</button>
      </div>
    </div>
  );
};

export default PostCard;
