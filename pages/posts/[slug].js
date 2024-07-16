

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import client from '../../libs/contentfulPosts';
import styles from './post.module.css';

export default function Post({ post }) {
  const { title, date, description, content, imageLink, slug } = post.fields;

  return (
    <div className={styles.postContainer + " rounded-3"}>
      {imageLink && <img src={imageLink} alt={title} className={styles.postImage} />}
      <h1 className={styles.postTitle}>{title}</h1>
      <p className={styles.postDate}>{new Date(date).toLocaleDateString()}</p>
      <p className={styles.postDescription}>{description}</p>
      <div className={styles.postContent}>
        {documentToReactComponents(content)}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const response = await client.getEntries({
    content_type: 'cyberneelPost',
  });

  const paths = response.items.map((item) => ({
    params: { slug: item.fields.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const response = await client.getEntries({
    content_type: 'cyberneelPost',
    'fields.slug': slug,
  });

  return {
    props: {
      post: response.items[0],
    },
  };
}
