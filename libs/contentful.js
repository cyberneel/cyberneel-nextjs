import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchPosts(limit = 4) {
  const response = await client.getEntries({
    content_type: 'cyberneelPost',
    order: '-sys.createdAt',
    limit,
  });
  return response.items;
}

export async function fetchAllPosts() {
  const response = await client.getEntries({
    content_type: 'cyberneelPost',
    order: '-sys.createdAt',
  });
  return response.items;
}
