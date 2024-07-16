import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchPosts(limit = 4) {
  const response = await client.getEntries({
    content_type: 'cyberneelPost',
    order: '-fields.date',
    limit,
  });
  return response.items;
}

export async function fetchAllPosts() {
  const response = await client.getEntries({
    content_type: 'cyberneelPost',
    order: '-fields.date',
  });
  return response.items;
}

export async function fetchAboutPost() {
  const response = await client.getEntries({
    content_type: 'aboutPage',
  });
  return response.items;
}

export async function fetchPostsPagination({ skip = 0, limit = 12, search = '' } = {}) {
  const query = {
    content_type: 'cyberneelPost',
    skip,
    limit,
    order: "-fields.date"
  };

  if (search) {
    query['query'] = search;
  }

  const response = await client.getEntries(query);

  return {
    posts: response.items,
    total: response.total,
  };
}
