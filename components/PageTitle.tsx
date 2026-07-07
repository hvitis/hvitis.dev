import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="font-serif text-3xl italic leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
      {children}
    </h1>
  )
}
