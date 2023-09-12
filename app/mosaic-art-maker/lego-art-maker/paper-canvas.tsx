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
import tinycolor from 'tinycolor2'
import loadedColors from 'utils/colors'

import { clsx } from 'clsx'
import humanize from '@/utils/humanize'
import Statistics from '@/components/Statistics'
import { CheckCircle, CheckSquare, Circle } from 'lucide-react'
import Toast from '@/components/Toast'
import Helper from '@/components/Helper'

function PaperCanvas() {
  const radius = 9
  const spacing = 19
  const defBoardSize = 10
  const maxBoardSizes = [10, 64]

  const mosaicRef = useRef()
  const canvasRef = useRef()

  const [notification, setNotification] = useState(null)
  const [boardSize, setBoardSize] = useState({ width: defBoardSize, height: defBoardSize })

  const calcCanvas = (sideSize) => {
    return sideSize * (radius * 2 + (spacing - radius * 2)) + 2 * radius
  }

  const calculateShiftRange = (size) => {
    return (window.screen.width - calcCanvas(size)) / 2
  }

  const [canvasSize, setCanvasSize] = useState({
    width: 100,
    height: 100,
  })

  const [isRound, setIsRound] = useState(true)
  const [file, setFile] = useState(null)
  const [colors, setColors] = useState([])
  const [hasFileNotUploadedError, setHasFileNotUploadedError] = useState(false)
  const [LDrawMatrix, setLDrawMatrix] = useState([])
  const [editColor, setEditColor] = useState('#ffffff')
  const [editLegoId, setEditLegoId] = useState(1)
  const [isGenerated, setIsGenerated] = useState(false)
  const [reInitialiseCanvas, setReInitialiseCanvas] = useState(false)
  const [hasNumbers, setHasNumbers] = useState(false)
  const [shift, setShift] = useState(0)
  const [colorsToCompare, setColorsToCompare] = useState('COLORS_ALL')

  useEffect(() => {
    canvasRef.current.getContext('2d', { willReadFrequently: true })
  }, [])

  useEffect(() => {
    window.editColor = editColor
  }, [editColor])

  useEffect(() => {
    setReInitialiseCanvas(false)
  }, [reInitialiseCanvas])

  useEffect(() => {
    setTimeout(() => setNotification(null), 7000)
  }, [notification])

  useEffect(() => {
    let size = { ...boardSize }
    let newWidth = calcCanvas(size.width)
    let newHeight = calcCanvas(size.height)

    setShift(calculateShiftRange(size.width))
    setReInitialiseCanvas(true)
    setCanvasSize({ width: newWidth, height: newHeight })
    setIsGenerated(false)
  }, [boardSize, hasNumbers])

  function generateMosaic() {
    Paper.setup('paperCanvas')
    const raster = new Paper.Raster('mosaic')
    raster.visible = false
    raster.position = Paper.view.center
    raster.size = new Paper.Size([boardSize.width, boardSize.height])

    // Hide the Raster:
    raster.visible = false

    let chosenColors = loadedColors[colorsToCompare]
    const compareColors = generateComparableColors(chosenColors)
    const nearestColor = require('nearest-color').from(compareColors)

    // passing type of points to raster
    raster.isRound = isRound
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
        let path
        if (!raster.isRound) {
          // Create a square PORTRAIT shaped path:
          path = new Paper.Path.Rectangle({
            point: new Paper.Point(x * spacing, y * spacing),
            size: 18,
          })
          path.fillColor = pickedColor.value

          var pathDarker = new Paper.Path.Circle({
            center: new Paper.Point(x * spacing + 9, y * spacing + 9),
            radius: 7,
          })
          pathDarker.fillColor = tinycolor(pickedColor.value).darken().toString()

          let light = new Paper.Path.Circle({
            center: new Paper.Point(x * spacing + 8, y * spacing + 8),
            radius: 6,
          })
          light.fillColor = pickedColor.value

          let transparent = new Paper.Path.Rectangle({
            point: new Paper.Point(x * spacing, y * spacing),
            size: 18,
          })
          transparent.fillColor = pickedColor.value
          transparent.opacity = 0

          transparent.path = path
          transparent.light = light
          transparent.pathDarker = pathDarker
          transparent.onClick = function () {
            this.path.fillColor = window.editColor
            this.light.fillColor = window.editColor
            this.pathDarker.fillColor = tinycolor(window.editColor).darken().toString()
          }
        } else {
          path = new Paper.Path.Circle({
            center: new Paper.Point(x, y).multiply(spacing),
            radius: radius,
          })
          path.onClick = function () {
            this.fillColor = window.editColor
          }
        }

        if (raster.hasNumbers) {
          let text
          if (raster.isRound)
            text = new Paper.PointText(new Paper.Point(x * spacing, y * spacing + 3))
          if (!raster.isRound)
            text = new Paper.PointText(new Paper.Point(x * spacing + 7, y * spacing + 10))

          text.fontSize = 8
          text.content = filteredColour.bl_id
          text.justification = 'center'
          text.fontFamily = 'Fira Sans'
          text.fontWeight = '700'
          text.fillColor = invert(hexColor, true)
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
    Paper.project.remove()
  }

  function clickGenerateButton() {
    if (!isCorrectBoardSize()) {
      setNotification({ msg: 'Incorrect board size.' })
      return
    }
    if (!file) {
      setHasFileNotUploadedError(true)
      setNotification({ msg: 'You must add an image to generate mosaic.' })
      return
    }
    if (isGenerated) clearCanvas()

    updateColors()
    generateMosaic()
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
  }

  function handleEditMode() {
    setNotification({
      msg: 'Edit mode is now always ON. Allows you to edit colors by clicking on studs. Button will be removed in next version.',
    })
  }

  function pickEditColor(badgeColor, bl_id) {
    // Setting color for editing to state for editing canvas
    setEditColor(badgeColor)
    setEditLegoId(bl_id)
  }

  function handleCustomBoard(val) {
    if (val.match(/[^xX0-9]/)) {
      setNotification({ msg: 'Only numbers and character "x" are allowed ( E.g. 12x18 )' })
      return
    }
    if (!val || !val.includes('x'))
      return setBoardSize({ width: defBoardSize, height: defBoardSize })

    let [width, height] = val.split('x')

    if (height === '') height = 10
    if (width === '') width = 10

    console.log(`Setting w: ${width} h: ${height}`)
    return setBoardSize({ width, height })
  }

  function handleSliderChange(val) {
    setBoardSize({ width: val, height: val })
  }

  function isCorrectBoardSize() {
    return (
      boardSize.width !== '' &&
      boardSize.height !== undefined &&
      parseInt(boardSize.width) >= 10 &&
      parseInt(boardSize.width) <= 64 &&
      parseInt(boardSize.height) >= 10 &&
      parseInt(boardSize.height) <= 64
    )
  }

  function isCustomSize() {
    return boardSize.width !== boardSize.height
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col flex-wrap gap-2 w-full">
          {/* Image and size selection  */}
          {/* Select an image  */}
          <div className="flex flex-row xs:flex-wrap justify-start">
            <div className="flex flex-col w-1/2 mx-4">
              <label
                className={clsx(
                  'text-left font-medium text-gray-700 my-1',
                  hasFileNotUploadedError && 'text-red-700'
                )}
              >
                Select image:
              </label>
              <input
                className="file-input file-input-bordered file-input-info w-full max-w-xs"
                id="file"
                type="file"
                onChange={(e) => setFile(URL.createObjectURL(e.target.files[0]))}
              />
            </div>

            {/* Adjust board by slider or custom selector  */}
            <div className="flex flex-col w-full mx-4">
              <div className="flex flex-row">
                <div className="flex flex-col w-full">
                  <label className="text-left font-medium text-gray-700 my-1">
                    Board size:
                    <span className={clsx('mx-2', !isCorrectBoardSize() && 'text-yellow-500')}>
                      {`width ${boardSize.width} x height ${boardSize.height}`}
                    </span>
                    {!isCorrectBoardSize() && (
                      <Helper
                        title="Board sizes"
                        text="Each board side must be minimum 10 and maximum 64 studs."
                      />
                    )}
                  </label>
                  <div className="w-full mt-2.5 flex flex-col mx-2">
                    <input
                      value={boardSize.width}
                      onChange={(e) => handleSliderChange(e.target.value)}
                      type="range"
                      min={10}
                      max="64"
                      className={clsx('range', !isCustomSize() && 'range-info')}
                    />
                    <div className="w-full flex justify-between text-xs px-2 my-auto">
                      <span>min {maxBoardSizes[0]}</span>
                      <span className="relative lg:-left-5 xl:-left-10 hidden lg:block">
                        {maxBoardSizes[[maxBoardSizes.length - 1]] / 2}
                      </span>
                      <span>max {maxBoardSizes[[maxBoardSizes.length - 1]]}</span>
                    </div>
                  </div>
                </div>
                <div className="w-28 mx-4 my-auto">
                  <label className="input-group input-group-vertical">
                    <span className={clsx(isCustomSize() && 'bg-info text-white')}>Custom</span>
                    <input
                      type="text"
                      value={`${boardSize.width}x${boardSize.height}`}
                      onChange={(e) => handleCustomBoard(e.target.value)}
                      placeholder="e.g. 10x16"
                      className="input input-bordered"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row xs:flex-wrap justify-start my-3">
            {/* Colors selector */}
            <div className="flex flex-col w-full lg:w-1/3 mx-4">
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

            {/* Settings button group */}
            <div className="flex flex-col lg:mr-auto mx-4">
              <label className="text-left">Settings:</label>
              <div className="btn-group rounded-r-lg">
                <button
                  className="btn btn-info text-white my-auto"
                  onClick={() => {
                    setIsRound(!isRound)
                  }}
                >
                  {isRound && (
                    <>
                      Round
                      <CheckCircle className="h-5 w-5 text-white"></CheckCircle>
                    </>
                  )}
                  {!isRound && (
                    <>
                      Square
                      <CheckSquare className="h-5 w-5 text-white"></CheckSquare>
                    </>
                  )}
                </button>
                <button
                  className="btn btn-info text-white"
                  onClick={() => {
                    handleDrawNumbers()
                  }}
                >
                  Numbered
                  {hasNumbers ? (
                    <CheckCircle className="h-5 w-5 text-white"></CheckCircle>
                  ) : (
                    <Circle className="h-5 w-5 text-white"></Circle>
                  )}
                </button>

                {/* <button
                  className="btn btn-info text-white"
                  onClick={() => {
                    handleDrawNumbers()
                  }}
                >
                  Custom colors
                  {hasNumbers ? (
                    <CheckCircle className="h-5 w-5 text-white"></CheckCircle>
                  ) : (
                    <Circle className="h-5 w-5 text-white"></Circle>
                  )}
                </button> */}

                <div
                  onClick={() => {
                    handleEditMode()
                  }}
                  className="hidden lg:block"
                >
                  <button className="btn btn-info text-white rounded-l-none" disabled>
                    Edit mode
                    <CheckCircle className="h-5 w-5 text-white"></CheckCircle>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full my-4 mx-auto">
          <div>
            <button
              className="btn btn-success btn-lg mx-2 text-white"
              onClick={() => clickGenerateButton()}
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      <img
        src={file}
        alt="Generated mosaic LEGO Image"
        crossOrigin="*"
        ref={mosaicRef}
        id="mosaic"
        hidden
      />
      <div className="w-full mb-5 ">
        {/* Re init canvas to change it´s size in hard mode. data-paper-resize could
        be another option if it was not shifting path's onClick events. */}
        {!reInitialiseCanvas && (
          <canvas
            id="paperCanvas"
            ref={canvasRef}
            style={{ left: boardSize.width > 54 ? `-${shift}px` : '' }}
            className={clsx('mx-auto', boardSize.width > 50 ? `w-max relative` : '')}
            width={canvasSize.width}
            height={canvasSize.height}
            hidden={!isGenerated}
            willReadFrequently
          ></canvas>
        )}
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
          {colors.length !== 0 && isGenerated && (
            <Statistics size={boardSize}>
              {colors.map((color) => (
                <BadgeColor
                  pickEditColor={pickEditColor}
                  color={color}
                  key={color.bl_id}
                  editColor={editColor}
                />
              ))}
            </Statistics>
          )}
        </div>
      </div>
      {notification && <Toast text={notification.msg}></Toast>}
    </>
  )
}

export default PaperCanvas
