import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { ToolCard, toolsData } from '@/components/ToolCard'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Software Projects',
  description: 'Things I coded along the way.',
  image: '/static/images/pages/projects.png',
})

export default function Projects() {
  return (
    <>
      <header className="border-b border-gray-200 pb-8 pt-10 dark:border-gray-800">
        <h1 className="font-serif text-4xl italic tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-gray-500 dark:text-gray-400">
          Software I wrote
        </p>
      </header>
      <div className="py-12">
        <div className="-m-4 flex flex-wrap">
          {projectsData.map((d) => (
            <Card
              key={d.title}
              title={d.title}
              description={d.description}
              imgSrc={d.imgSrc}
              href={d.href}
            />
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 pb-12 pt-12 dark:border-gray-800">
        <h2 className="font-serif text-2xl italic text-gray-900 dark:text-gray-100">Tools</h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Small utilities I built and use myself.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          {toolsData.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </>
  )
}
