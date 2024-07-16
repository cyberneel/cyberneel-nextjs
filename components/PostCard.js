import React from 'react';
import Styles from './PostCard.module.css';
import Link from 'next/link';

const PostCard = ({ post }) => {
  //const { title, description, date, tags, image } = post.fields;
  //<div className="post-tags">{tags.join(', ')}</div>
  const { title, description, date, imageLink, slug } = post.fields;


  return (
    <div className={Styles.postCard}>
      <img src={imageLink} alt={title} className={Styles.postImage} />
      <div className={Styles.postContent}>
        <h2 className={Styles.postTitle}>{title}</h2>
        <div className={Styles.postDate}>{new Date(date).toLocaleDateString()}</div>
        <p className={Styles.postDescription}>{description}</p>
        <Link href={`/posts/${slug}`}>
          <button className={Styles.postButton}>Show More</button>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
