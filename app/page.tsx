import { allBlogs } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import Main from './Main'

export default async function Page() {
  const posts = allCoreContent(sortPosts(allBlogs))
  return <Main posts={posts} />
}
