/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-6 text-sm dark:border-gray-800">
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          ← Previous
        </Link>
      ) : (
        <span className="cursor-default text-gray-300 dark:text-gray-700">← Previous</span>
      )}
      <span className="font-serif italic text-gray-400 dark:text-gray-600">
        {currentPage} of {totalPages}
      </span>
      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          Next →
        </Link>
      ) : (
        <span className="cursor-default text-gray-300 dark:text-gray-700">Next →</span>
      )}
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b border-gray-200 pb-8 pt-10 dark:border-gray-800">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'}
        </p>
        <h1 className="mt-2 font-serif text-4xl italic tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          {title}
        </h1>
      </header>

      <div className="flex flex-col gap-12 sm:flex-row sm:gap-16">
        <nav className="order-2 shrink-0 pt-10 sm:order-1 sm:w-40 sm:border-r sm:border-gray-200 sm:pr-8 sm:dark:border-gray-800">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            Topics
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              {pathname.startsWith('/blog') ? (
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  All posts
                </span>
              ) : (
                <Link
                  href="/blog"
                  className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  All posts
                </Link>
              )}
            </li>
            {sortedTags.map((t) => (
              <li key={t}>
                {pathname.split('/tags/')[1] === slug(t) ? (
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t} <span className="text-gray-400 dark:text-gray-600">{tagCounts[t]}</span>
                  </span>
                ) : (
                  <Link
                    href={`/tags/${slug(t)}`}
                    className="text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    aria-label={`View posts tagged ${t}`}
                  >
                    {t} <span className="text-gray-400 dark:text-gray-600">{tagCounts[t]}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-1 min-w-0 flex-1 sm:order-2">
          <ul>
            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <li
                  key={path}
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
                        href={`/${path}`}
                        className="font-serif text-2xl leading-snug text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400 sm:text-3xl"
                      >
                        {title}
                      </Link>
                    </h2>
                    <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-gray-500 dark:text-gray-400">
                      {summary}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  )
}
