'use client'

import { useReadLocalStorage } from 'usehooks-ts'
import { isMobile } from 'react-device-detect'
import NotificationSimple from '@/components/NotificationSimple'
import Link from 'next/link'
import dictionary from 'locales/mosaic'

export default function Hero() {
  const locale = useReadLocalStorage('locale') || 'en'

  return (
    <>
      {isMobile && (
        <NotificationSimple msg={' For the best experience open this page on your macOS or PC.'} />
      )}
      <div className="hero-content mb-4">
        <div className="max-w-md">
          <div className="indicator">
            <Link
              href={dictionary[locale].notification.banner.url}
              className="indicator-item indicator-bottom badge badge-secondary lg:-right-5 lg:top-5 -top-5"
            >
              v. 2.0
            </Link>
            <h1 className="lg:text-5xl text-2xl font-bold lg:px-1">Mosaic Art Maker</h1>
          </div>
          <p className="py-6">{dictionary[locale].subtitle}</p>
        </div>
      </div>
    </>
  )
}
