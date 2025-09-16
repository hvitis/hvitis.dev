'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import LanguageSwitch from './LanguageSwitch'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Header = () => {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center leading-5 space-x-4 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => {
            if (link.links) {
              return (
                <div
                  key={link.title}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="hidden sm:block font-medium text-gray-900 dark:text-gray-100">
                    {link.title}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {link.links.map((subLink) => (
                          <Link
                            key={subLink.title}
                            href={subLink.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {subLink.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={link.title}
                href={link.href}
                className="hidden sm:block font-medium text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            )
          })}
        {pathname.includes('mosaic-art-maker') && <LanguageSwitch />}
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header