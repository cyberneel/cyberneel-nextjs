import React from 'react';
import Styles from './PostCard.module.css';
import Link from 'next/link';

const PostCard = ({ post }) => {
  //const { title, description, date, tags, image } = post.fields;
  //<div className="post-tags">{tags.join(', ')}</div>
  const { title, description, date, imageLink, slug } = post.fields;


  return (
    <Link href={`/posts/${slug}`} passHref legacyBehavior>
    <div className={Styles.postCard}>
      <img src={imageLink} alt={title} className={Styles.postImage} />
      <div className={Styles.postContent}>
        <h2 className={Styles.postTitle}>{title}</h2>
        <div className={Styles.postDate}>{new Date(date).toLocaleDateString()}</div>
        <p className={Styles.postDescription}>{description}</p>
        <button className={Styles.postButton}>See Post</button>
      </div>
    </div>
    </Link>
  );
};

export default PostCard;
