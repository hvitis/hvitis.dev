'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

export default function Mermaid({ chart }: { chart: string }) {
  const container = useRef<HTMLDivElement>(null)
  const renderCount = useRef(0)
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { resolvedTheme } = useTheme()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    const renderId = `diagram-${id}-${++renderCount.current}`
    container.current?.replaceChildren()
    setStatus('loading')

    async function draw() {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          fontFamily: 'inherit',
          flowchart: { htmlLabels: false, useMaxWidth: true },
        })
        const { svg, bindFunctions } = await mermaid.render(renderId, chart)
        if (!cancelled && container.current) {
          container.current.innerHTML = svg
          bindFunctions?.(container.current)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    draw()
    return () => {
      cancelled = true
    }
  }, [chart, id, resolvedTheme])

  return (
    <figure className="my-8 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      {status !== 'ready' && (
        <p className="text-sm text-gray-600 dark:text-gray-300" role="status">
          {status === 'error'
            ? 'Nie udało się wyświetlić schematu. Wskazówki znajdziesz również w tekście.'
            : 'Wczytywanie schematu…'}
        </p>
      )}
      <div ref={container} className="flex justify-center overflow-x-auto" />
    </figure>
  )
}
