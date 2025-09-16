'use client'

import { useState, useRef, useEffect } from 'react'
import { diffChars } from 'diff'
import html2canvas from 'html2canvas'

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
    <div className="container mx-auto px-4">
      <div className="my-4 rounded-md bg-yellow-100 p-4 text-center text-yellow-800">
        Your data is not sent anywhere. Press Clear All if you want to delete it from local storage.
      </div>
      <h1 className="my-8 text-center text-3xl font-bold">Text Comparison</h1>
      <div className="my-4 text-center">
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <button
            className="mb-2 rounded-md bg-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-400"
            onClick={handleClearText1}
          >
            Clear
          </button>
          <textarea
            className="h-64 w-full rounded-md border border-gray-300 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Text 1"
          ></textarea>
        </div>
        <div>
          <button
            className="mb-2 rounded-md bg-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-400"
            onClick={handleClearText2}
          >
            Clear
          </button>
          <textarea
            className="h-64 w-full rounded-md border border-gray-300 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Text 2"
          ></textarea>
        </div>
      </div>
      <div className="my-4 text-center">
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleCompare}
        >
          Compare
        </button>
      </div>
      {diffResult && (
        <div className="my-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="mb-2 text-center text-xl font-bold">Original Text</h2>
              <pre className="whitespace-pre-wrap rounded-md border border-gray-300 p-4">
                {text1}
              </pre>
            </div>
            <div>
              <h2 className="mb-2 text-center text-xl font-bold">Differences</h2>
              <div ref={diffRef} className="rounded-md border border-gray-300 p-4">
                <pre className="whitespace-pre-wrap">
                  {diffResult.map((part, index) => (
                    <span
                      key={index}
                      className={`
                        ${part.added ? 'bg-green-200' : ''}
                        ${part.removed ? 'bg-red-200' : ''}
                      `}
                    >
                      {part.value}
                    </span>
                  ))}
                </pre>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              onClick={handleDownloadPng}
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextComparison
