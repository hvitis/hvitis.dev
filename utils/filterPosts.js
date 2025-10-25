import { sortPosts } from 'pliny/utils/contentlayer'

/**
 * Filters a list of blog posts to include only those with a 'polishSlug',
 * sorts them, and then selects the most recent unique post for each path's
 * date segment (assuming the path format is 'YYYY-MM-DD/slug').
 *
 * @param {Array<Object>} allPosts - The array of all blog post objects.
 * @returns {Array<Object>} An array of unique, filtered, and sorted blog post objects.
 */
export function getUniqueSortedPolishPosts(allPosts) {
  // 1. Filter out posts that do not have a 'polishSlug' property
  // TODO: Usunac wykrzyknik jesli pojawia sie polskie posty

  const postsWithoutEnglishSlug = allPosts.filter((post) => !post.polishSlug);

  // 2. Sort the filtered posts using the provided sorting function
  const sortedPosts = sortPosts(postsWithoutEnglishSlug);

  const uniquePosts = [];
  const seenPaths = new Set();

  // 3. Iterate through the sorted posts and select the first (most recent) unique post for each date
  for (const post of sortedPosts) {
    // Assuming 'post.path' is like 'YYYY-MM-DD/some-slug'
    // Split by '/' and take the first element, which is the date part
    const pathDate = post.path.split('/')[1];

    if (!seenPaths.has(pathDate)) {
      uniquePosts.push(post);
      seenPaths.add(pathDate);
    }
  }

  return uniquePosts;
}