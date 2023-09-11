// @ts-nocheck
'use client'
import React, { useEffect, useRef, useState } from 'react'

import { formatAndDownloadBsxFile } from '@/utils/formatBsxFile'
import { formatAndDownloadXmlFile } from '@/utils/formatXmlFile'
import { formatAndDownloadLdrFile } from '@/utils/formatLDrawFile'

import BadgeColor from '@/components/BadgeColor'
import SelectColorBadge from '@/components/SelectColorBadge'
import Paper from 'paper'
import invert from 'invert-color'
import { clsx } from 'clsx'
import loadedColors from 'utils/colors'
import humanize from '@/utils/humanize'
import Statistics from '@/components/Statistics'
import shadeColor from '@/utils/shadeColor'

const boardSizes = [10, 16, 32, 46, 48, 64]

function PaperCanvas() {
  const mosaicRef = useRef()
  const canvasRef = useRef()

  const [radius, setRadius] = useState(9)
  const [boardSize, setBoardSize] = useState(10)
  const [canvasSize, setCanvasSize] = useState(190)
  const [isCircle, setIsCircle] = useState(true)
  const [spacing, setSpacing] = useState(19)
  const [file, setFile] = useState(null)
  const [colors, setColors] = useState([])
  const [customColors, setCustomColors] = useState([])
  const [hasFileNotUploadedError, setHasFileNotUploadedError] = useState(false)
  const [LDrawMatrix, setLDrawMatrix] = useState([])
  const [editColor, setEditColor] = useState('#ffffff')
  const [editLegoId, setEditLegoId] = useState(1)
  const [isGenerated, setIsGenerated] = useState(false)
  const [hasNumbers, setHasNumbers] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [colorsToCompare, setColorsToCompare] = useState('COLORS_ALL')

  useEffect(() => {
    window.editColor = editColor
  }, [editColor])

  useEffect(() => {
    // canvasRef.current.height = getCanvasSize(boardSize)
    // canvasRef.current.width = getCanvasSize(boardSize)
    // setCanvasSize(boardSize * radius * 2 + boardSize)
  }, [boardSize])

  function makeMosaic() {
    if (isGenerated) clearCanvas()
    Paper.setup('paperCanvas')
    const raster = new Paper.Raster('mosaic')
    raster.visible = false
    raster.position = Paper.view.center
    raster.size = new Paper.Size(boardSize, boardSize)
    // Hide the Raster:
    raster.visible = false

    let chosenColors = loadedColors[colorsToCompare]
    const compareColors = generateComparableColors(chosenColors)
    const nearestColor = require('nearest-color').from(compareColors)

    // passing type of points to raster
    raster.isCircle = isCircle
    raster.isEditMode = isEditMode
    raster.hasNumbers = hasNumbers

    raster.chosenColors = chosenColors

    const colorCodes = []
    const colorCodesVerify = []

    for (let x = 0; x < raster.width; x++) {
      for (let y = raster.height - 1; y >= 0; y--) {
        // Get the color of the pixel:
        const singleColor = {}
        const color = raster.getPixel(x, y)
        const hexColor = color.toCSS(true)
        const pickedColor = nearestColor(hexColor)

        // Filtering the color to get more info, besides hex
        let filteredColour = raster.chosenColors.filter(
          (color) => color.hex_code === pickedColor.value
        )
        filteredColour = filteredColour[0]

        // Create a circle ART MOSAIC shaped path:
        var path = new Paper.Path.Circle({
          center: new Paper.Point(x, y).multiply(spacing),
          radius: radius,
        })
        path.fillColor = pickedColor.value

        path.onClick = function () {
          this.fillColor = window.editColor
        }
        if (!colorCodesVerify.includes(pickedColor.value)) {
          /* colors contains already the color we're iterating */
          colorCodesVerify.push(pickedColor.value)
          singleColor['hex_code'] = pickedColor.value
          singleColor['name'] = pickedColor.name
          singleColor['bl_id'] = filteredColour.bl_id
          singleColor['amount'] = 1
          colorCodes.push(singleColor)
        } else {
          // Getting the color code from the array of colors that will be used for BUTTONS
          let newFilteredColour = colorCodes.filter((color) => color.hex_code === pickedColor.value)
          newFilteredColour[0]['amount'] += 1
        }
      }
    }
    Paper.project.activeLayer.position = Paper.view.center

    // Returning colors array to create buttons with information and
    setColors(colorCodes)
    setIsGenerated(true)
  }

  function generateComparableColors(colorsSet) {
    const NEAREST_COLOR_COMPARE = {}
    colorsSet.map((color) => (NEAREST_COLOR_COMPARE[color.bl_name.toString()] = color.hex_code))
    return NEAREST_COLOR_COMPARE
  }

  function clearCanvas() {
    Paper.project.activeLayer.removeChildren()
    Paper.project.clear()
  }

  function clickGenerateMosaicButton() {
    if (!file) {
      setHasFileNotUploadedError(true)
      return
    }
    updateColors()
    makeMosaic()
  }

  function updateColors() {
    // Order here colours by amount of them in the picture
    colors.sort((a, b) => (a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0))
    setColors(colors)
    setLDrawMatrix(LDrawMatrix)
  }

  function handleCanvasSave() {
    const FileSaver = require('file-saver')
    const canvas = document.getElementById('paperCanvas')
    canvas.toBlob(function (blob) {
      FileSaver.saveAs(blob, 'Hvitis.dev-MOSAIC-Art.png')
    })
  }

  function handleDrawNumbers() {
    setHasNumbers(!hasNumbers)
    setIsCircle(true)
    setIsEditMode(false)
  }

  function handleEditMode() {
    setIsEditMode(!isEditMode)
    setHasNumbers(true)
    setIsCircle(true)
  }

  function pickEditColor(badgeColor, bl_id) {
    // Setting color for editing to state for editing canvas
    setEditColor(badgeColor)
    setEditLegoId(bl_id)
  }

  return (
    <>
      <div className="w-full">
        <div className="flex lg:flex-row flex-col flex-wrap gap-2 w-full">
          <div className="flex flex-col lg:ml-auto mx-auto">
            <label className={clsx('text-center', hasFileNotUploadedError && 'text-red-600')}>
              Select image:
            </label>
            <input
              className="file-input file-input-bordered file-input-info w-full max-w-xs"
              id="file"
              type="file"
              onChange={(e) => setFile(URL.createObjectURL(e.target.files[0]))}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-center">Board size:</label>
            <select
              className="select select-info"
              as="select"
              size="lg"
              onChange={(e) => {
                setBoardSize(e.target.value)
              }}
              name="selectedToBucket"
              value={boardSize}
            >
              {boardSizes.map((sideInStuds) => (
                <option key={sideInStuds} value={sideInStuds}>
                  {`${sideInStuds}x${sideInStuds}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-center">Colors set:</label>
            <select
              className="select select-info"
              required
              type="text"
              as="select"
              size="lg"
              onChange={(e) => {
                setColorsToCompare(e.target.value)
              }}
              name="selectedToBucket"
              value={colorsToCompare}
            >
              {Object.keys(loadedColors)
                .map((set, index) => {
                  return { id: index, name: humanize(set.slice(6, 30)), value: set }
                })
                .map((colorSet) => (
                  <option key={colorSet.id} value={colorSet.value}>
                    {colorSet.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col lg:mr-auto mx-auto">
            <label className="text-center">Settings:</label>
            <div className="btn-group">
              <button
                className="btn btn-info"
                onClick={() => {
                  setIsCircle(!isCircle)
                }}
              >
                {isCircle ? 'Circles' : 'Squares'}
              </button>
              <button
                className="btn btn-info"
                onClick={() => {
                  handleDrawNumbers()
                }}
              >
                {hasNumbers && isCircle ? 'Numbers' : 'Blank'}
              </button>

              <button
                className="btn btn-info"
                onClick={() => {
                  handleEditMode()
                }}
              >
                {isEditMode ? 'Edit' : 'No Edit'}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full my-4 mx-auto">
          <div>
            <button
              className="btn btn-success btn-lg mx-2"
              onClick={() => clickGenerateMosaicButton()}
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      {/* console.log(this.mosaicRef.current.editor.getValue()); */}
      <img
        src={file}
        alt="Generated mosaic LEGO Image"
        crossOrigin="*"
        ref={mosaicRef}
        id="mosaic"
        hidden
      />
      <div className="w-full">
        <canvas
          className="p-1 mx-auto w-full"
          id="paperCanvas"
          height={1170}
          width={1170}
          ref={canvasRef}
          data-paper-resize
          hidden={!isGenerated}
        ></canvas>
      </div>

      <div
        className="btn-group lg:mx-10 mx-auto"
        style={{ display: isGenerated ? 'inherit' : 'none' }}
      >
        <button className="btn lg:btn btn-sm btn-info" onClick={() => handleCanvasSave()}>
          Download
        </button>
        <button className="btn lg:btn btn-sm" onClick={() => handleCanvasSave()}>
          .Png
        </button>
        <button className="btn lg:btn btn-sm" onClick={() => formatAndDownloadBsxFile(colors)}>
          .bsx
        </button>
        <button className="btn lg:btn btn-sm" onClick={() => formatAndDownloadXmlFile(colors)}>
          .xml
        </button>
        <button className="btn lg:btn btn-sm" onClick={() => formatAndDownloadLdrFile(LDrawMatrix)}>
          .ldr
        </button>
      </div>
      <div className="w-full flex flex-row justify-between">
        <div>
          {colors.length !== 0 && (
            <Statistics size={boardSize}>
              {colors.map((color) => (
                <BadgeColor
                  pickEditColor={pickEditColor}
                  color={color}
                  key={color.bl_id}
                  editColor={editColor}
                  isEditMode={isEditMode}
                />
              ))}
            </Statistics>
          )}
        </div>
      </div>
    </>
  )
}

export default PaperCanvas
