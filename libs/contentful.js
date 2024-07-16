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
    content_type: 'cyberneelPost',
    order: '-sys.createdAt',
    skip,
    limit,
  };

  const response = await client.getEntries(query);
  
  let filteredPosts = response.items;
  if (search) {
    const lowercasedSearch = search.toLowerCase();
    filteredPosts = response.items.filter(post => 
      post.fields.title.toLowerCase().includes(lowercasedSearch) ||
      post.fields.description.toLowerCase().includes(lowercasedSearch)
    );
  }

  const totalResponse = await client.getEntries({
    content_type: 'cyberneelPost',
  });

  return {
    posts: filteredPosts,
    total: totalResponse.total,
  };
}
