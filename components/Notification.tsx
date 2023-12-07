// @ts-nocheck
'use client'

import slugify from '@/utils/slugify'
import clsx from 'clsx'
import { InfoIcon, XCircleIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

interface NotificationInterface {
  title: string
  msg: string
  href?: string
  className?: string
}
const Notification = ({ title, msg, btn, href, className }: NotificationInterface) => {
  const [isVisible, setVisible] = useLocalStorage(`isNotificationVisible-${slugify(title)}`, true)

  return (
    <>
      {isVisible && (
        <div className={clsx(className, 'alert shadow-lg my-3')}>
          <InfoIcon className="stroke-info shrink-0 w-6 h-6" />
          <div>
            <h3 id="notification-title" className="font-bold">
              {title}
            </h3>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: msg }}></div>
          </div>
          <div className="flex flex-row">
            {href && (
              <Link id="notification-link" href={href} className="btn btn-sm text-blue-600">
                {btn || 'Read more'}
              </Link>
            )}
            <div className="tooltip" data-tip={"Don't show again"}>
              <button
                id="notification-close"
                className="btn btn-sm"
                onClick={() => setVisible(false)}
              >
                <XCircleIcon className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Notification
