// @ts-nocheck
'use client'
import React, { useEffect, useRef, useState } from 'react'

import { formatAndDownloadBsxFile } from '@/utils/formatBsxFile'
import { formatAndDownloadXmlFile } from '@/utils/formatXmlFile'
import { formatAndDownloadLdrFile } from '@/utils/formatLDrawFile'

import BadgeColor from '@/components/BadgeColor'
import SelectColorBadge from '@/components/SelectColorBadge'

import invert from 'invert-color'
import { clsx } from 'clsx'
import loadedColors from 'utils/colors'
import humanize from '@/utils/humanize'
import Statistics from '@/components/Statistics'
import shadeColor from '@/utils/shadeColor'

const boardSizes = [10, 16, 32, 46, 48, 64]

function PaperCanvas() {
  const mosaicRef = useRef()

  const [size, setSize] = useState(120)
  const [isCircle, setIsCircle] = useState(true)
  const [file, setFile] = useState(null)
  const [boardSize, setBoardSize] = useState(10)
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
  const [hasNotSelectedColors, setHasNotSelectedColors] = useState(false)

  useEffect(() => {
    const paper = require('paper')
    paper.setup('paperCanvas')
    const raster = new paper.Raster('mosaic')
    raster.visible = false
    raster.position = paper.view.center
  }, [])

  function generateComparableColors(colorsSet) {
    const NEAREST_COLOR_COMPARE = {}
    colorsSet.map((color) => (NEAREST_COLOR_COMPARE[color.bl_name.toString()] = color.hex_code))
    return NEAREST_COLOR_COMPARE
  }

  function makeMosaic(callback) {
    setIsGenerated(true)
    setHasFileNotUploadedError(false)
    clearCanvas()
    const paper = require('paper')
    let chosenColors
    if (colorsToCompare !== 'CUSTOM_COLORS') {
      chosenColors = loadedColors[colorsToCompare]
    }
    if (colorsToCompare === 'CUSTOM_COLORS') {
      if (customColors.length < 5) {
        setHasNotSelectedColors(true)
        return
      }
      chosenColors = customColors
    }

    const compareColors = generateComparableColors(chosenColors)
    const nearestColor = require('nearest-color').from(compareColors)

    // Create a raster item using the image tag with id='mona'
    const raster = new paper.Raster('mosaic')
    // Hide the Raster:
    raster.position = paper.view.center
    raster.visible = false
    // The  of our grid cells:
    const gridSize = boardSize

    // Space the cells by 120%:
    const spacing = 19

    // As the web is asynchronous, we need to wait for the raster to load
    // before we can perform any operation on its pixels.

    // passing type of points to raster
    raster.isCircle = isCircle
    raster.isEditMode = isEditMode
    raster.hasNumbers = hasNumbers
    raster.thus = this
    raster.chosenColors = chosenColors
    raster.on('load', function () {
      const colorCodes = []
      // This verification is an additional copy of colorCodes array
      // in order to push just hex codes and not Objects
      // this can be refactored if only I knew how to filter
      // for keys of objects in array
      const colorCodesVerify = []

      // LDraw matrix
      const LDrawMatrix = []
      // Since the example image we're using is much too large,
      // and therefore has way too many pixels, lets downsize it to
      // 40 pixels wide and 30 pixels high:
      raster.size = new paper.Size(gridSize, gridSize)

      // LDraw board is x, y, z coordinates. Here we start by placing first x coordinate
      // that we will be increasing during iteration.
      let LDrawXCoord = 10
      const LDrawYCoord = -24
      for (let x = 0; x < raster.width; x++) {
        const verticalRowBotToTop = []
        let LDrawZCoord = -10
        for (let y = raster.height - 1; y >= 0; y--) {
          // Get the color of the pixel:
          const color = raster.getPixel(x, y)
          // Set the fill color of the path to the color
          // of the pixel:
          const singleColor = {}
          const hexColor = color.toCSS(true)

          // Filtering the color to get more info, besides hex
          const pickedColor = nearestColor(hexColor)
          let filteredColour
          // if (raster.chosenColors.length > 20) {
          filteredColour = raster.chosenColors.filter(
            (color) => color.hex_code === pickedColor.value
          )
          filteredColour = filteredColour[0]
          // } else {
          //   filteredColour = pickedColor
          // }
          if (raster.isCircle) {
            // Create a circle ART MOSAIC shaped path:
            var path = new paper.Path.Circle({
              center: new paper.Point(x * spacing, y * spacing),
              // center: paper.view.center,
              // radius: gridSize / 2 / spacing,
              radius: 9,
            })
            if (raster.hasNumbers) {
              var text = new paper.PointText(new paper.Point(x * spacing, y * spacing + 3))
              path.text = text
              // Text functionality
              text.fontSize = 8
              if (filteredColour.bl_id > 99) {
                text.fontSize = 7
              }
              text.content = filteredColour.bl_id
              text.justification = 'center'
              text.fontFamily = 'Fira Sans'
              text.fontWeight = '700'
              text.fillColor = invert(hexColor, true)
            }
            if (raster.isEditMode) {
              // Editing functionality starts here
              path.x = x
              path.y = y
              path.LDrawZCoord = LDrawZCoord
              // path.text = text // Appending to matrix instead
              // When the mouse enters the stud, get its fill color in HE:
              path.onClick = function () {
                this.fillColor = raster.thus.editColor
                for (let index = 0; index < LDrawMatrix.length; index++) {
                  // Here we have nested arrays that consist of objects
                  const nestedArray = LDrawMatrix[index]
                  // for (let y = raster.height - 1; y >= 0; y--) {
                  for (let index = nestedArray.length - 1; index >= 0; index--) {
                    // Here we have a list of studs so we check for each stud
                    const singleStudObj = nestedArray[index]
                    // If it matches the stud we are updating
                    if (singleStudObj.pdf_x == this.x) {
                      if (singleStudObj.pdf_y == this.y) {
                        singleStudObj.hex_code = raster.thus.editColor
                        // Getting bl_id for the Hex color from clicking on a badge.
                        singleStudObj.text.content = editLegoId
                        singleStudObj.text.fillColor = invert(raster.thus.editColor, true)
                        break
                      }
                    }
                  }
                }

                setLDrawMatrix(LDrawMatrix)
              }
            }
          }
          if (!raster.isCircle) {
            // Create a square PORTRAIT shaped path:
            var path = new paper.Path.Rectangle({
              point: new paper.Point(x * spacing, y * spacing),
              // center: paper.view.center,
              // radius: gridSize / 2 / spacing,
              size: 18,
            })
            var pathDarker = new paper.Path.Circle({
              center: new paper.Point(x * spacing + 9, y * spacing + 9),
              // center: paper.view.center,
              // radius: gridSize / 2 / spacing,
              radius: 6,
            })
            var pathLighter = new paper.Path.Circle({
              center: new paper.Point(x * spacing + 8, y * spacing + 8),
              // center: paper.view.center,
              // radius: gridSize / 2 / spacing,
              radius: 6,
            })
            // path.mainColor = hexColor
            // pathLighter.mainColor = hexColor
            // pathDarker.mainColor = hexColor

            path.x = x
            pathLighter.x = x

            path.y = y
            pathLighter.y = y

            pathLighter.LDrawXCoord = LDrawXCoord

            path.LDrawZCoord = LDrawZCoord
            pathLighter.LDrawZCoord = LDrawZCoord
            if (raster.isEditMode) {
              // When the mouse enters the stud, get its fill color in HE:
              path.onClick = function () {
                this.fillColor = raster.thus.editColor
                pathLighter.fillColor = raster.thus.editColor
                for (let index = 0; index < LDrawMatrix.length; index++) {
                  // Here we have nested arrays that consist of objects
                  const nestedArray = LDrawMatrix[index]

                  // for (let y = raster.height - 1; y >= 0; y--) {
                  for (let index = nestedArray.length - 1; index >= 0; index--) {
                    // Here we have a list of studs so we check for each stud
                    const singleStudObj = nestedArray[index]
                    // If it matches the stud we are updating
                    if (singleStudObj.pdf_x == this.x) {
                      if (singleStudObj.pdf_y == this.y) {
                        singleStudObj.hex_code = raster.thus.editColor

                        break
                      }
                    }
                  }
                }
                setLDrawMatrix(LDrawMatrix)
              }
            }
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
            let newFilteredColour = colorCodes.filter(
              (color) => color.hex_code === pickedColor.value
            )
            newFilteredColour[0]['amount'] += 1
          }
          // Appending a LDraw color value to vertical row
          let singleStudDataToAppend = {
            x: LDrawXCoord,
            y: LDrawYCoord,
            z: LDrawZCoord,
            color: filteredColour.ldraw_id,
            hex_code: filteredColour.hex_code,
            pdf_x: x,
            pdf_y: y,
          }
          if (raster.isEditMode) {
            singleStudDataToAppend.text = text
          }
          verticalRowBotToTop.push(singleStudDataToAppend)
          // Increasing vertical location of a next piece
          LDrawZCoord += 20

          path.fillColor = pickedColor.value
          if (!raster.isCircle) {
            // Coloring drawn studs with shadow
            pathDarker.fillColor = shadeColor(pickedColor.value, -40)
            pathLighter.fillColor = shadeColor(pickedColor.value, 10)
          }
        }
        LDrawMatrix.push(verticalRowBotToTop)
        // Increasing horizontal location of next piece
        LDrawXCoord += 20
      }
      paper.project.activeLayer.position = paper.view.center

      // Returning colors array to create buttons with information and
      // Returning LDraw matrix of color IDs for LDraw to draw board
      // callback(colorCodes, LDrawMatrix)
      setColors(colorCodes)
      setLDrawMatrix(LDrawMatrix)
    })
  }

  function clearCanvas() {
    const paper = require('paper')
    paper.project.activeLayer.removeChildren()
    paper.project.clear()
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

  function addCustomColor(colorObject, isSelected) {
    // Adding colors to the list of custom colors
    let currentlySelectedColors = [...customColors, colorObject]
    let uniqueColors
    if (isSelected) {
      // Adding object to selected colors and filtering duplicates
      uniqueColors = Array.from(new Set(currentlySelectedColors.map((color) => color.bl_id))).map(
        (bl_id) => {
          return currentlySelectedColors.find((color) => color.bl_id === bl_id)
        }
      )
    } else {
      // Removing object from selected colors
      uniqueColors = currentlySelectedColors.filter((color) => color.bl_id !== colorObject.bl_id)
    }
    // currentlySelectedColors = currentlySelectedColors.filter(function(el) {
    //   return el.bl_id != colorObject.bl_id
    // })
    setCustomColors(uniqueColors)
    setHasNotSelectedColors(hasNotSelectedColors)
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
              onChange={setColorsToCompare}
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
              onClick={() => clickGenerateMosaicButton(updateColors())}
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
      <canvas
        className="p-1 mx-auto"
        id="paperCanvas"
        height={boardSize * 10}
        width={boardSize * 10}
      ></canvas>

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
          {colorsToCompare === 'CUSTOM_COLORS' &&
            COLORS_ALL_CUSTOM.map((color) => (
              <SelectColorBadge
                addCustomColor={addCustomColor}
                color={color}
                key={color.lego_name}
              />
            ))}
        </div>

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
