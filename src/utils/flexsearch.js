import FlexSearch from 'flexsearch'
import { getPostFromSlug } from './mdx';

// Function to add posts to the index
export function indexPosts(posts) {

      // Create a FlexSearch Document index
    const postsIndex = new FlexSearch.Document({
      document: {
        id: "id",  // Unique identifier for each post
        index: ["title", "content"],  // Fields to index
        store: ["title", "content"]  // Fields to store and retrieve in the result
      }
    });

  const indexingPromise = posts.map((post) => {
    // Extract plain text content asynchronously
    return getPostFromSlug(post.slug).then((data) => {
      const plainTextContent = extractTextFromMDX(data.content);
      // Add post to the index
      postsIndex.add({
        id: post.slug,
        title: post.title,
        content: plainTextContent,
      });
    });
  });

  // // Wait for all promises to resolve
  // Promise.all(indexingPromise).then(() => {
  //   // Now, print the index after all posts are added
  //   const results = postsIndex.search("white", { field: "title" });
  //   console.log(results);  // Should now return results matching the word "White"
  // });

  // Wait for all promises to resolve
  //await Promise.all(indexingPromise);

  return postsIndex;  // Return the index after indexing
}

// Function to extract plain text from compiled MDX source
function extractTextFromMDX(compiledSource) {
  // A simple way could be to remove JSX tags and keep the plain text
  return compiledSource.replace(/<[^>]*>?/gm, ''); // This removes HTML/JSX tags
}

// Function to search the index
export function searchPosts(query, posts) { 

  // Create a FlexSearch Document index
  const postsIndex = indexPosts(posts);

  return postsIndex.search(query);
}
