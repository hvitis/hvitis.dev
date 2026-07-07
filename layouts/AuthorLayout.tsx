import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <>
      <header className="border-b border-gray-200 pb-8 pt-10 dark:border-gray-800">
        <h1 className="font-serif text-4xl italic tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          About
        </h1>
      </header>
      <div className="items-start gap-x-8 pt-10 xl:grid xl:grid-cols-3">
        <div className="flex flex-col items-center pb-10 xl:pb-0">
          {avatar && (
            <Image
              src={avatar}
              alt="avatar"
              width={192}
              height={192}
              className="h-48 w-48 rounded-full"
            />
          )}
          <h3 className="pb-1 pt-4 font-serif text-2xl italic text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <div className="text-sm text-gray-400 dark:text-gray-500">{occupation}</div>
          <div className="text-sm text-gray-400 dark:text-gray-500">{company}</div>
          <div className="flex space-x-3 pt-6 text-gray-400 dark:text-gray-500">
            <SocialIcon kind="mail" href={`mailto:${email}`} />
            <SocialIcon kind="github" href={github} />
            <SocialIcon kind="linkedin" href={linkedin} />
            <SocialIcon kind="twitter" href={twitter} />
          </div>
        </div>
        <div className="prose max-w-none border-t border-gray-200 pb-8 pt-10 font-serif dark:prose-invert dark:border-gray-800 xl:col-span-2 xl:border-t-0 xl:pt-0">
          {children}
        </div>
      </div>
    </>
  )
}
