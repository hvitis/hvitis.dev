'use client'

import { useState, useRef, useEffect } from 'react'
import { diffChars } from 'diff'
import html2canvas from 'html2canvas'
import { Button, Label, Notice, Panel, Textarea, ToolHeader } from '@/components/ui/Tool'

const TextComparison = () => {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diffResult, setDiffResult] = useState<ReturnType<typeof diffChars> | null>(null)
  const diffRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedText1 = localStorage.getItem('text1')
    const savedText2 = localStorage.getItem('text2')
    if (savedText1) {
      setText1(savedText1)
    }
    if (savedText2) {
      setText2(savedText2)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('text1', text1)
  }, [text1])

  useEffect(() => {
    localStorage.setItem('text2', text2)
  }, [text2])

  const handleCompare = () => {
    const result = diffChars(text1, text2)
    setDiffResult(result)
  }

  const handleDownloadPng = () => {
    if (!diffRef.current) return

    const diffContainer = diffRef.current
    const { width, height } = diffContainer.getBoundingClientRect()
    const size = Math.max(width, height)

    html2canvas(diffContainer, { width: size, height: size }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'text-comparison.png'
      link.href = imgData
      link.click()
    })
  }

  const handleClearText1 = () => {
    setText1('')
  }

  const handleClearText2 = () => {
    setText2('')
  }

  const handleClearAll = () => {
    setText1('')
    setText2('')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <ToolHeader
        title="Text Comparison"
        description="Compare two blocks of text and see the differences highlighted, character by character."
      />

      <div className="mt-6">
        <Notice>
          Your data is not sent anywhere — all processing happens locally in your browser.
        </Notice>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Text 1</Label>
            <Button variant="ghost" onClick={handleClearText1}>
              Clear
            </Button>
          </div>
          <Textarea
            className="h-64"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Paste the first text here"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Text 2</Label>
            <Button variant="ghost" onClick={handleClearText2}>
              Clear
            </Button>
          </div>
          <Textarea
            className="h-64"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Paste the second text here"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Button variant="secondary" onClick={handleClearAll}>
          Clear All
        </Button>
        <Button variant="primary" onClick={handleCompare}>
          Compare
        </Button>
      </div>

      {diffResult && (
        <div className="mt-10 border-t border-gray-200 pt-8 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label>Original Text</Label>
              <Panel className="mt-2 p-4">
                <pre className="whitespace-pre-wrap font-serif text-sm text-gray-700 dark:text-gray-300">
                  {text1}
                </pre>
              </Panel>
            </div>
            <div>
              <Label>Differences</Label>
              <Panel ref={diffRef} className="mt-2 p-4">
                <pre className="whitespace-pre-wrap font-serif text-sm">
                  {diffResult.map((part, index) => (
                    <span
                      key={index}
                      className={
                        part.added
                          ? 'bg-emerald-100 text-emerald-900 underline decoration-emerald-400 dark:bg-emerald-900/40 dark:text-emerald-200'
                          : part.removed
                          ? 'bg-rose-100 text-rose-900 line-through decoration-rose-400 dark:bg-rose-900/40 dark:text-rose-200'
                          : 'text-gray-700 dark:text-gray-300'
                      }
                    >
                      {part.value}
                    </span>
                  ))}
                </pre>
              </Panel>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button variant="secondary" onClick={handleDownloadPng}>
              Download PNG
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextComparison
