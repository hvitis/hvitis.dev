'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { useState } from 'react'

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  let dropdownTimeout: NodeJS.Timeout
  const [showNoTranslationAlert, setShowNoTranslationAlert] = useState(false)

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout)
    setDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setDropdownOpen(false)
    }, 200)
  }

  const handleNoTranslation = () => {
    setShowNoTranslationAlert(true)
    setTimeout(() => {
      setShowNoTranslationAlert(false)
    }, 3000) // Hide alert after 3 seconds
  }

  return (
    <header className="flex items-center justify-between py-10">
      {showNoTranslationAlert && (
        <div
          className="absolute top-0 left-0 w-full bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 z-50"
          role="alert"
        >
          <p className="font-bold">No translation</p>
          <p>No translation for that post</p>
        </div>
      )}
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
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="hidden sm:flex items-center font-medium text-gray-900 dark:text-gray-100">
                    {link.title}
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
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
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
