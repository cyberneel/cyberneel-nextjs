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

  let response;
  let totalResponse;
  if (search) {
    // get all posts and then filter and paginate
    totalResponse = await client.getEntries({
      content_type: 'cyberneelPost',
    });
    const filteredItems = totalResponse.items.filter(post =>
      post.fields.title.toLowerCase().includes(search.toLowerCase()) ||
      post.fields.description.toLowerCase().includes(search.toLowerCase())
    );
    const paginatedItems = filteredItems.slice(skip, skip + limit);
    response = { items: paginatedItems, total: filteredItems.length };
  } else {
    // get paginated posts directly
    response = await client.getEntries(query);
    totalResponse = await client.getEntries({
      content_type: 'cyberneelPost',
    });
  }

  return {
    posts: response.items,
    total: totalResponse.total,
  };
}
