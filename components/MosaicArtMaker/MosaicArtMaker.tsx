// @ts-nocheck
'use client'

import React, { useEffect, useRef, useState } from 'react'

import { formatAndDownloadBsxFile } from '@/utils/formatBsxFile'
import { formatAndDownloadXmlFile } from '@/utils/formatXmlFile'
import { formatAndDownloadLdrFile } from '@/utils/formatLDrawFile'

import BadgeColor from '@/components/BadgeColor'

import Paper from 'paper'
import tinycolor from 'tinycolor2'
import loadedColors from 'utils/colors'
import { clsx } from 'clsx'
import Statistics from '@/components/Statistics'
import { CheckCircle, CheckSquare } from 'lucide-react'
import Toast from '@/components/Toast'
import Helper from '@/components/Helper'
import ColorInterface from 'interfaces/ColorInterface'
import FileInput from '@/components/FileInput/FileInput'
import PulsatingButton from '@/components/PulsatingButton/PulsatingButton'
import Badge from '@/components/Badge'

import SelectMultiply from '@/components/Selectors/SelectMultiply'
import { trackMosaicClick } from '@/utils/gtag'
import Notification from '../Notification'
import { useReadLocalStorage } from 'usehooks-ts'
import dictionary from 'locales/mosaic'
import Loader from '../Loader'

function MosaicArtMaker() {
  const radius = 9
  const spacing = 19
  const defBoardSize = 10
  const maxBoardSizes = [10, 64]
  const textColor = '#94a3b8'

  const imgRef = useRef()
  const canvasRef = useRef()

  const [notification, setNotification] = useState(null)
  const [boardSize, setBoardSize] = useState({ width: defBoardSize, height: defBoardSize })

  const locale = useReadLocalStorage('locale') || 'en'

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

  const [selectedCustomColors, setSelectedCustomColors] = useState([])
  const [customMode, setCanSelectCustomColors] = useState(false)

  const [selectedColors, setSelectedColors] = useState(loadedColors['en'][0].colors)

  const [isRound, setIsRound] = useState(true)
  const [file, setFile] = useState(null)
  const [colors, setColors] = useState([])
  const [hasFileNotUploadedError, setHasFileNotUploadedError] = useState(false)
  const [LDrawMatrix, setLDrawMatrix] = useState([])
  const [editColor, setEditColor] = useState(null)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reInitialiseCanvas, setReInitialiseCanvas] = useState(false)
  const [hasNumbers, setHasNumbers] = useState(false)
  const [shift, setShift] = useState(0)
  const [studsAvailable, setStudsAvailable] = useState(0)
  const [isDetailViewOpen, setDetailViewOpen] = useState(false)

  useEffect(() => {
    setReInitialiseCanvas(false)
  }, [reInitialiseCanvas])

  useEffect(() => {
    if (file) setHasFileNotUploadedError(false)
  }, [file])

  useEffect(() => {
    setTimeout(() => setNotification(null), 7000)
  }, [notification])

  useEffect(() => {
    const size = { ...boardSize }
    const newWidth = calcCanvas(size.width)
    const newHeight = calcCanvas(size.height)

    setShift(calculateShiftRange(size.width))
    setReInitialiseCanvas(true)
    setCanvasSize({ width: newWidth, height: newHeight })
    setIsGenerated(false)
  }, [boardSize, hasNumbers])

  function writeText(raster, x, y, content) {
    let text
    if (raster.isRound) text = new Paper.PointText(new Paper.Point(x * spacing, y * spacing + 3))
    if (!raster.isRound)
      text = new Paper.PointText(new Paper.Point(x * spacing + 7, y * spacing + 10))

    text.fontSize = 8
    text.content = content
    text.justification = 'center'
    text.fontFamily = 'Fira Sans'
    text.fontWeight = '700'
    text.fillColor = textColor
    return text
  }

  function drawCircle(x, y, rad) {
    return new Paper.Path.Circle({
      center: new Paper.Point(x, y),
      radius: rad,
    })
  }
  function drawRectangle(x, y, size) {
    return new Paper.Path.Rectangle({
      point: new Paper.Point(x, y),
      size: size,
    })
  }

  function generateMosaic() {
    Paper.setup('paperCanvas')
    const raster = new Paper.Raster('image')
    raster.visible = false
    raster.position = Paper.view.center
    raster.size = new Paper.Size([boardSize.width, boardSize.height])

    // Hide the Raster:
    raster.visible = false

    const chosenColors = customMode ? selectedCustomColors : selectedColors

    const compareColors = generateComparableColors(chosenColors)
    const nearestColor = require('nearest-color').from(compareColors)

    // passing type of points to raster
    raster.isRound = isRound
    raster.hasNumbers = hasNumbers

    raster.chosenColors = chosenColors

    const colorCodes = []
    const colorCodesVerify = []

    const LDrawMatrix = []
    for (let x = 0; x < raster.width; x++) {
      for (let y = 0; y < raster.height; y++) {
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
        let text
        let transparent

        if (!raster.isRound) {
          // Create a square PORTRAIT shaped path:
          path = drawRectangle(x * spacing, y * spacing, 18)
          path.fillColor = pickedColor.value

          const pathDarker = drawCircle(x * spacing + 9, y * spacing + 9, 7)
          pathDarker.fillColor = tinycolor(pickedColor.value).darken().toString()

          const light = drawCircle(x * spacing + 8, y * spacing + 8, 6)
          light.fillColor = pickedColor.value

          if (raster.hasNumbers) text = writeText(raster, x, y, filteredColour.bl_id)

          transparent = drawRectangle(x * spacing, y * spacing, 18)
          transparent.fillColor = pickedColor.value

          transparent.opacity = 0
          transparent.path = path
          transparent.light = light
          transparent.pathDarker = pathDarker
          if (text) transparent.text = text
        }
        if (raster.isRound) {
          path = drawCircle(x * spacing, y * spacing, spacing / 2)
          path.fillColor = pickedColor.value
          if (raster.hasNumbers) {
            path.text = writeText(raster, x, y, filteredColour.bl_id)
          }
        }

        if (!raster.isRound) {
          transparent.onClick = function () {
            if (!window.editColor) return
            this.path.fillColor = window.editColor.hex_code
            this.light.fillColor = window.editColor.hex_code
            this.pathDarker.fillColor = tinycolor(window.editColor.hex_code).darken().toString()
            if (this.text) this.text.content = window.editColor.bl_id
          }
        }
        if (raster.isRound) {
          path.onClick = function () {
            if (!window.editColor) return
            this.fillColor = window.editColor.hex_code
            if (this.text) this.text.content = window.editColor.bl_id
          }
        }

        // TODO: Verify this functionality if it´s not redundant
        if (!colorCodesVerify.includes(pickedColor.value)) {
          /* Colors contains already the Color we're iterating */
          colorCodesVerify.push(pickedColor.value)
          singleColor['hex_code'] = pickedColor.value
          singleColor['name'] = pickedColor.name
          singleColor['bl_id'] = filteredColour.bl_id
          singleColor['amount'] = 1
          colorCodes.push(singleColor)
        } else {
          // Getting the Color code from the array of Colors that will be used for BUTTONS
          const newFilteredColour = colorCodes.filter(
            (color) => color.hex_code === pickedColor.value
          )
          newFilteredColour[0]['amount'] += 1
        }
        LDrawMatrix.push({ x, y, z: -10, ldraw_id: filteredColour.ldraw_id })
      }
    }
    Paper.project.activeLayer.position = Paper.view.center

    // Returning Colors array to create buttons with information and
    setColors(updateColors(colorCodes))
    setLDrawMatrix(LDrawMatrix)
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
      setNotification({ msg: dictionary[locale].notification.incorrect_size })
      return
    }
    if (!file) {
      setHasFileNotUploadedError(true)
      setNotification({ msg: dictionary[locale].notification.add_image })
      return
    }
    if ((customMode && selectedCustomColors.length === 0) || selectedColors.length === 0) {
      setNotification({ msg: dictionary[locale].notification.select_colors })
      return
    }
    setIsGenerating(true)

    if (isGenerated) clearCanvas()

    generateMosaic()
    trackMosaicClick('generate', `${boardSize.width}x${boardSize.height}`)
    setIsGenerating(false)
  }

  function updateColors(colors) {
    // Order here colours by amount of them in the picture
    return colors.sort((a, b) => (a.amount < b.amount ? 1 : b.amount < a.amount ? -1 : 0))
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

  function pickEditColor(color: ColorInterface) {
    setEditColor(color)
    window.editColor = color
  }

  function addCustomColor(color: ColorInterface) {
    const isAlreadySelected = selectedCustomColors.find((clr) => clr.hex_code == color.hex_code)

    if (isAlreadySelected) {
      const filteredNumbers = selectedCustomColors.filter((clr) => clr.hex_code !== color.hex_code)
      setSelectedCustomColors([...filteredNumbers])
    }
    if (!isAlreadySelected) {
      setSelectedCustomColors([...selectedCustomColors, color])
    }
    pickEditColor(color)
  }

  function handleCustomBoard(val) {
    if (val.match(/[^xX0-9]/)) {
      setNotification({ msg: dictionary[locale].notification.board_requirements })
      return
    }
    if (!val || !val.includes('x'))
      return setBoardSize({ width: defBoardSize, height: defBoardSize })

    let [width, height] = val.split('x')

    if (height === '') height = 10
    if (width === '') width = 10

    return setBoardSize({ width, height })
  }

  function handleSliderChange(val) {
    setBoardSize({ width: val, height: val })
  }

  const isEnglish = () => {
    return locale === 'en'
  }

  function handleMultipleSelect(val) {
    const selectedColorSets = [...loadedColors[locale]].filter((set) => val.has(`${set.id}`))
    // Count pieces for sets other than 'All'
    if (!val.has('1'))
      setStudsAvailable(
        selectedColorSets.reduce(function (acc, obj) {
          return acc + obj.pcs
        }, 0)
      )
    if (val.has('1')) setStudsAvailable(0)

    const selectedColors = selectedColorSets.map((set) => set.colors).flat(1)
    const key = 'lego_id'
    const uniqueColors = [...new Map(selectedColors.map((item) => [item[key], item])).values()]
    setSelectedColors(uniqueColors)
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

  function removeColor(color) {
    const filteredNumbers = selectedCustomColors.filter((clr) => clr.hex_code !== color.hex_code)
    setSelectedCustomColors([...filteredNumbers])
  }

  function onCanvasClick() {
    if (!window.editColor) setNotification({ msg: dictionary[locale].notification.pick_color })
  }

  return (
    <>
      <Notification
        title={dictionary[locale].notification.banner.title}
        msg={dictionary[locale].notification.banner.msg}
        btn={dictionary[locale].notification.banner.button}
        href={dictionary[locale].notification.banner.url}
        className="mb-20 w-5/6 mx-auto"
      />
      <div className="mb-20">
        <div className="w-full">
          <div className="flex flex-col flex-wrap gap-2 w-full">
            {/* Image and size selection  */}
            {/* Select an image  */}
            <div className="flex flex-row flex-wrap md:flex-nowrap justify-start">
              <FileInput
                title={dictionary[locale].fileInput.title}
                onClick={setFile}
                file={file}
                error={hasFileNotUploadedError}
              />

              {/* Adjust board by slider or custom selector  */}
              <div className="flex flex-col w-full lg:mx-4">
                <div className="flex flex-row">
                  <div className="flex flex-col lg:w-full">
                    <label className="flex text-sm text-left font-medium text-gray-600 dark:text-gray-300 my-auto">
                      {dictionary[locale].boardSize.title}
                      <span
                        id="board-size-text"
                        className={clsx('mx-2', !isCorrectBoardSize() && 'text-yellow-500')}
                      >
                        {`${dictionary[locale].boardSize.width} ${boardSize.width} x ${dictionary[locale].boardSize.height} ${boardSize.height}`}
                      </span>
                      {!isCorrectBoardSize() && isEnglish() && (
                        <Helper
                          title="Board sizes"
                          text="Each board side must be minimum 10 and maximum 64 studs."
                        />
                      )}
                    </label>
                    <div className="w-full flex flex-col lg:mx-2 lg:my-0 my-5">
                      <input
                        id="select-file"
                        value={boardSize.width}
                        data-umami-event="Select File"
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
                  <div className="w-28 ml-6 mr-2 my-auto lg:block hidden">
                    <label className="input-group input-group-vertical">
                      <span className={clsx(isCustomSize() && 'bg-info text-white')}>
                        {dictionary[locale].boardSize.custom}
                      </span>
                      <input
                        id="board-size"
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

            <div className="flex flex-row flex-wrap md:flex-nowrap justify-between my-3">
              {/* Colors selector */}
              <div className="flex flex-col w-full lg:w-1/3 lg:mx-4">
                <SelectMultiply
                  label={dictionary[locale].selector.title}
                  options={loadedColors[locale]}
                  onSelect={handleMultipleSelect}
                ></SelectMultiply>
              </div>

              {/* Settings button group */}
              <div className=" lg:ml-auto lg:mx-6 lg:my-0 my-5">
                <label
                  htmlFor="settings"
                  className="flex flex-col text-sm text-left font-medium text-gray-600 dark:text-gray-300 my-1"
                >
                  <span>{dictionary[locale].settings.title}</span>
                  <div id="settings" className="btn-group rounded-r-lg">
                    <button
                      id="set-roundness"
                      if="set-roundness"
                      data-umami-event="Set Roundness"
                      className="btn btn-info btn-sm md:btn-md text-white"
                      onClick={() => {
                        setIsRound(!isRound)
                      }}
                    >
                      {isRound && (
                        <>
                          {dictionary[locale].settings.round}
                          <CheckCircle className="h-5 w-5 text-white"></CheckCircle>
                        </>
                      )}
                      {!isRound && (
                        <>
                          {dictionary[locale].settings.square}
                          <CheckSquare className="h-5 w-5 text-white"></CheckSquare>
                        </>
                      )}
                    </button>
                    <button
                      id="set-draw-numbers"
                      data-umami-event="Set Draw Numbers"
                      className="btn btn-info text-white"
                      onClick={() => {
                        handleDrawNumbers()
                      }}
                    >
                      {hasNumbers
                        ? `${dictionary[locale].settings.numbered}`
                        : `${dictionary[locale].settings.blanks}`}
                    </button>

                    <button
                      id="set-custom-mode"
                      className="btn btn-info text-white"
                      data-umami-event="Set Custom Mode"
                      onClick={() => {
                        setCanSelectCustomColors(!customMode)
                      }}
                    >
                      {customMode
                        ? `${dictionary[locale].settings.custom_colors}`
                        : `${dictionary[locale].settings.set_colors}`}
                    </button>
                  </div>
                </label>
              </div>
            </div>
            {
              <>
                <div className="text-left mx-4">
                  <label className="text-left font-medium text-gray-600 dark:text-gray-300 my-1">
                    {!customMode && 'Colors to use:'}
                    <div className="flex flex-wrap my-2" id="colors-selected">
                      {selectedColors.map((color) => (
                        <BadgeColor
                          id={`selected-${color.hex_code}`}
                          key={color.hex_code}
                          onClick={addCustomColor}
                          color={color}
                          editColor={editColor}
                          isRound={isRound}
                        />
                      ))}
                    </div>
                  </label>
                </div>
                {customMode && (
                  <div className="text-left mx-4">
                    <label className="text-left font-medium text-gray-600 dark:text-gray-300 my-1">
                      {dictionary[locale].colors_to_use}:
                      {selectedCustomColors.length !== 0 && (
                        <div className="flex flex-wrap my-2" id="colors-custom">
                          {selectedCustomColors.map((color) => (
                            <BadgeColor
                              id={`custom-${color.hex_code}`}
                              key={color.hex_code}
                              color={color}
                              editColor={editColor}
                              onClick={removeColor}
                              isRound={isRound}
                              remove
                            />
                          ))}
                        </div>
                      )}
                    </label>
                    <div className="flex flex-wrap my-2">
                      {selectedCustomColors.length === 0 && (
                        <Badge>{dictionary[locale].no_colors_selected}.</Badge>
                      )}
                    </div>
                  </div>
                )}
              </>
            }
          </div>

          <div className="w-full my-4 mx-auto">
            <div>
              <PulsatingButton isActive={!isGenerated && file} onClick={clickGenerateButton}>
                {dictionary[locale].generate}
              </PulsatingButton>
            </div>
          </div>
        </div>
        <img
          id="image"
          src={file}
          ref={imgRef}
          alt="Generated mosaic LEGO"
          crossOrigin="*"
          hidden
        />
        <div className="w-full mb-5 ">
          {/* Re init canvas to change it´s size in hard mode. data-paper-resize could
        be another option if it was not shifting path's onClick events. */}
          {!reInitialiseCanvas && (
            <canvas
              id="paperCanvas"
              ref={canvasRef}
              style={{ left: boardSize.width > 58 ? `-${shift}px` : '' }}
              className={clsx('mx-auto', boardSize.width > 50 ? `w-max relative` : '')}
              width={canvasSize.width}
              height={canvasSize.height}
              hidden={!isGenerated}
              onClick={() => {
                onCanvasClick()
              }}
            ></canvas>
          )}
          {isGenerating && <Loader />}
        </div>

        <div
          className="btn-group lg:mx-10 mx-auto"
          style={{ display: isGenerated ? 'inherit' : 'none' }}
        >
          <button
            id="download-png"
            className="btn lg:btn btn-sm btn-info"
            data-umami-event="Download PNG"
            onClick={() => handleCanvasSave()}
          >
            {dictionary[locale].download}
          </button>
          <button
            id="download-png-2"
            className="btn lg:btn btn-sm"
            data-umami-event="Download PNG"
            onClick={() => handleCanvasSave()}
          >
            .Png
          </button>
          <button
            id="download-bsx"
            data-umami-event="Download BSX"
            className="btn lg:btn btn-sm"
            onClick={() => formatAndDownloadBsxFile(colors)}
          >
            .bsx
          </button>
          <button
            id="download-xml"
            data-umami-event="Download XML"
            className="btn lg:btn btn-sm"
            onClick={() => formatAndDownloadXmlFile(colors)}
          >
            .xml
          </button>
          <button
            id="download-ldr"
            data-umami-event="Download LDR"
            className="btn lg:btn btn-sm"
            onClick={() => formatAndDownloadLdrFile(LDrawMatrix)}
          >
            .ldr
          </button>
        </div>
        <div className="w-full flex flex-row justify-center">
          <div id="colors-statistics">
            {colors.length !== 0 && isGenerated && (
              <Statistics
                size={boardSize}
                studsAvailable={studsAvailable}
                text={dictionary[locale].statistics}
                isDetailViewOpen={isDetailViewOpen}
                onChange={setDetailViewOpen}
              >
                {colors.map((color) => (
                  <BadgeColor
                    id={`statistic-${color.hex_code}`}
                    key={color.hex_code}
                    onClick={pickEditColor}
                    color={color}
                    editColor={editColor}
                    isRound={isRound}
                    isDetailViewOpen={isDetailViewOpen}
                  />
                ))}
              </Statistics>
            )}
          </div>
        </div>
        {notification && <Toast text={notification.msg}></Toast>}
      </div>
    </>
  )
}

export default MosaicArtMaker
