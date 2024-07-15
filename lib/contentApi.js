// lib/api.js
const client = require('../contentful');

export async function fetchBlogPosts() {
  const entries = await client.getEntries({
    content_type: 'BlogPost',
    order: '-sys.createdAt',
  });

  return entries.items.map((item) => ({
    id: item.sys.id,
    title: item.fields.title,
    content: item.fields.content,
    content: item.fields.content,
    thumbnail: item.fields.imageLink
  }));
}
