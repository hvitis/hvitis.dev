import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <header className="border-b border-gray-200 pb-8 pt-10 dark:border-gray-800">
        <h1 className="font-serif text-4xl italic tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-gray-500 dark:text-gray-400">
          {siteMetadata.description}
        </p>
      </header>
      <ul>
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((post) => {
          const { slug, date, title, summary, tags } = post
          return (
            <li
              key={slug}
              className="group border-b border-gray-200 py-10 first:pt-10 dark:border-gray-800"
            >
              <article>
                <time
                  dateTime={date}
                  className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500"
                >
                  {formatDate(date, siteMetadata.locale)}
                </time>
                <h2 className="mt-3">
                  <Link
                    href={`/blog/${slug}`}
                    className="font-serif text-2xl leading-snug text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400 sm:text-3xl"
                  >
                    {title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                  {summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
      {posts.length > MAX_DISPLAY && (
        <div className="pt-10 text-xs uppercase tracking-[0.2em]">
          <Link
            href="/blog"
            className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
