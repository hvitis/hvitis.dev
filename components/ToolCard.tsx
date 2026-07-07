import Link from './Link'

interface Tool {
  title: string
  description: string
  href: string
}

export const toolsData: Tool[] = [
  {
    title: 'Text Comparison',
    description:
      'Compare two blocks of text and see the differences highlighted character by character.',
    href: '/text-comparison',
  },
  {
    title: 'QR Code Maker',
    description:
      'Generate a QR code for any link, with size, colour, and error-correction options.',
    href: '/qr-code-maker',
  },
]

export function ToolCard({ title, description, href }: Tool) {
  return (
    <Link
      href={href}
      aria-label={`Open ${title}`}
      className="group flex items-center justify-between gap-6 border border-gray-200 px-6 py-5 transition-colors hover:border-gray-900 dark:border-gray-800 dark:hover:border-gray-100"
    >
      <div>
        <h3 className="font-serif text-xl italic text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="shrink-0 text-gray-300 transition-colors group-hover:text-gray-900 dark:text-gray-700 dark:group-hover:text-gray-100"
      >
        &rarr;
      </span>
    </Link>
  )
}
