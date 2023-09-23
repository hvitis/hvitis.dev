import { ReactNode } from 'react'

export default function Badge({ text, children }: { text: string; children: ReactNode }) {
  return (
    <>
      <span className="badge badge-info gap-2 px-3 py-2.5 mt-0.5 text-white">
        {text || children}
      </span>
    </>
  )
}
