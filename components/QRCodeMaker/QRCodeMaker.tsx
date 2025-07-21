
'use client'

import React, { useState } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'

const QRCodeMaker = () => {
  const [link, setLink] = useState('')
  const [qrCodeValue, setQrCodeValue] = useState('')

  const handleInputChange = (event) => {
    setLink(event.target.value)
  }

  const generateQRCode = () => {
    setQrCodeValue(link)
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h1 className="mb-4 text-3xl font-bold">QR Code Maker</h1>
          <p className="mb-4">Enter a link to generate a QR code.</p>
          <div className="flex">
            <input
              type="text"
              value={link}
              onChange={handleInputChange}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="https://example.com"
            />
            <button
              onClick={generateQRCode}
              className="rounded-r-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
            >
              Generate
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          {qrCodeValue && (
            <>
              <QRCodeCanvas id="qr-code-canvas" value={qrCodeValue} size={256} style={{ display: 'none' }} />
              <QRCodeSVG
                id="qr-code-svg"
                value={qrCodeValue}
                size={256}
                className="mb-4"
              />
              <div className="flex space-x-4">
                <button
                  onClick={downloadPNG}
                  className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none"
                >
                  Download as PNG
                </button>
                <button
                  onClick={downloadSVG}
                  className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none"
                >
                  Download as SVG
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default QRCodeMaker
