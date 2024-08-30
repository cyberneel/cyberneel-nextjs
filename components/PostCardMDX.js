import React from 'react';
import Styles from './PostCard.module.css';
import Link from 'next/link';
import dayjs from 'dayjs';

const PostCard = ({ type, post }) => {
  //const { title, description, date, tags, image } = post.fields;
  //<div className="post-tags">{tags.join(', ')}</div>
  //const { title, excerpt, publishedAt, cover_image_link, slug, readingTime } = post;


  return (
    <Link href={`/${type}/${post.slug}`} passHref legacyBehavior>
    <div className={Styles.postCard}>
      <img src={post.cover_image_link} alt={post.title} className={Styles.postImage} />
      <div className={Styles.postContent}>
        <h2 className={Styles.postTitle}>{post.title}</h2>
        {post.draft && <div class="alert alert-danger text-center" role="alert">DRAFT!</div>}
        <div className={Styles.postDate}>{dayjs(post.publishedAt).format('MMMM D, YYYY')} &mdash;{' '} {post.readingTime}</div>
        <p className={Styles.postDescription}>{post.excerpt}</p>
        <button className={Styles.postButton}>See Post</button>
      </div>
    </div>
    </Link>
  );
};

export default PostCard;
