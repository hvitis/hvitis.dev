// @ts-nocheck
import { InfoIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface NotificationInterface {
  title: string
  msg: string
  href?: string
}
const Notification = ({ title, msg, href }: NotificationInterface) => {
  return (
    <div className="alert shadow-lg my-3">
      <InfoIcon className="stroke-info shrink-0 w-6 h-6" />
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: msg }}></div>
      </div>
      {href && (
        <Link href={href} className="btn btn-sm">
          Read more
        </Link>
      )}
    </div>
  )
}

export default Notification
