import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { getUniqueSortedPolishPosts } from '@/utils/filterPosts'

export default async function Page() {
  const posts = getUniqueSortedPolishPosts(allBlogs)
  return <Main posts={posts} />
}
