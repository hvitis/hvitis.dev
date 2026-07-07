'use client'

import React, { useState } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { Button, ColorInput, Input, Label, Panel, Select, ToolHeader } from '@/components/ui/Tool'

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

const SIZES = [128, 256, 384, 512]

const ERROR_CORRECTION_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'L', label: 'Low (~7%)' },
  { value: 'M', label: 'Medium (~15%)' },
  { value: 'Q', label: 'Quartile (~25%)' },
  { value: 'H', label: 'High (~30%)' },
]

const QRCodeMaker = () => {
  const [link, setLink] = useState('')
  const [qrCodeValue, setQrCodeValue] = useState('')
  const [size, setSize] = useState(256)
  const [level, setLevel] = useState<ErrorCorrectionLevel>('M')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [includeMargin, setIncludeMargin] = useState(true)

  const handleInputChange = (event) => {
    setLink(event.target.value)
  }

  const generateQRCode = () => {
    setQrCodeValue(link)
  }

  const handleLinkKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      generateQRCode()
    }
  }

  const downloadPNG = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = 'qr-code.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const downloadSVG = () => {
    const svg = document.getElementById('qr-code-svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      const downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = 'qr-code.svg'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <ToolHeader
        title="QR Code Maker"
        description="Enter a link to generate a QR code you can download as PNG or SVG."
      />
      <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
        <div>
          <Label>Link</Label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Input
              type="text"
              value={link}
              onChange={handleInputChange}
              onKeyDown={handleLinkKeyDown}
              placeholder="https://example.com"
              className="flex-1"
            />
            <Button variant="primary" onClick={generateQRCode}>
              Generate
            </Button>
          </div>

          <div className="mt-8">
            <Label>Options</Label>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="qr-size"
                  className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                >
                  Size
                </label>
                <Select id="qr-size" value={size} onChange={(e) => setSize(Number(e.target.value))}>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s} px
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label
                  htmlFor="qr-level"
                  className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                >
                  Error correction
                </label>
                <Select
                  id="qr-level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as ErrorCorrectionLevel)}
                >
                  {ERROR_CORRECTION_LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label
                  htmlFor="qr-fg-color"
                  className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                >
                  Foreground
                </label>
                <ColorInput
                  id="qr-fg-color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="qr-bg-color"
                  className="mb-1 block text-xs text-gray-500 dark:text-gray-400"
                >
                  Background
                </label>
                <ColorInput
                  id="qr-bg-color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={includeMargin}
                onChange={(e) => setIncludeMargin(e.target.checked)}
                className="h-4 w-4 accent-gray-900 dark:accent-gray-100"
              />
              Include quiet-zone margin (recommended for printing)
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6">
          {qrCodeValue && (
            <>
              <QRCodeCanvas
                id="qr-code-canvas"
                value={qrCodeValue}
                size={size}
                level={level}
                fgColor={fgColor}
                bgColor={bgColor}
                marginSize={includeMargin ? 4 : 0}
                style={{ display: 'none' }}
              />
              <Panel className="p-6">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrCodeValue}
                  size={size}
                  level={level}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  marginSize={includeMargin ? 4 : 0}
                />
              </Panel>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={downloadPNG}>
                  Download PNG
                </Button>
                <Button variant="secondary" onClick={downloadSVG}>
                  Download SVG
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default QRCodeMaker
