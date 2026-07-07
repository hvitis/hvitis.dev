import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center gap-4 pb-12 pt-10">
        <div className="flex space-x-4 text-gray-400 dark:text-gray-500">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
          <SocialIcon kind="github" href={siteMetadata.github} size={5} />
          <SocialIcon kind="facebook" href={siteMetadata.facebook} size={5} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={5} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={5} />
        </div>
        <div className="text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
            {siteMetadata.author}
          </Link>
          <span className="mx-2">·</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
