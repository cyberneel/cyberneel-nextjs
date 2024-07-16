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

export async function fetchPostsPagination({ skip = 0, limit = 12, search = '' } = {}) {
  const query = {
    content_type: 'dermalyzePosts',
    order: '-sys.createdAt',
    skip,
    limit,
  };

  if (search) {
    query['query'] = search;
  }

  const response = await client.getEntries(query);

  const totalResponse = await client.getEntries({
    content_type: 'cyberneelPost',
    ...(search && { query: search })
  });

  return {
    posts: response.items,
    total: totalResponse.total,
  };
}
