// @ts-nocheck
'use client'
import React from 'react'

import COLORS_ALL from './utils/colors/colorsAll.json'
import COLORS_ALL_CUSTOM from './utils/colors/colorsAllCustom.json'
import COLORS_WARHOL from './utils/colors/colorsWarhol.json'
import COLORS_HARRY_POTTER from './utils/colors/colorsHarryPotter.json'
import COLORS_IRON_MAN from './utils/colors/colorsIronMan.json'
import COLORS_STAR_WARS from './utils/colors/colorsStarWars.json'
import COLORS_THE_BEATELS from './utils/colors/colorsTheBeatelsLauras.json'
import COLORS_MICKEY_MOUSE from './utils/colors/colorsMickeyMouseLauras.json'
import COLORS_LEGO_WORLD_MAP from './utils/colors/worldMap.json'
import COLORS_PORTRAIT from './utils/colors/colorsPortraits.json'
// New
import COLORS_BATMAN from './utils/colors/colorsBatman.json'
import COLORS_BATMAN_QUIN from './utils/colors/colorsBatmanQuin.json'
import COLORS_BATMAN_JOKER from './utils/colors/colorsBatmanJoker.json'
import COLORS_ELVIS from './utils/colors/colorsElvis.json'
import COLORS_ART_PROJECT from './utils/colors/colorsArtProject.json'

import BadgeColor from './utils/edit-color-badge'

import { formatAndDownloadBsxFile } from './utils/formatBsxFile'
import { formatAndDownloadXmlFile } from './utils/formatXmlFile'
import { formatAndDownloadLdrFile } from './utils/formatLDrawFile'
import invert from 'invert-color'

import SelectColorBadge from './utils/select-color-badge'

import {
  CheckCheckIcon,
  CheckCircle,
  CheckSquare,
  Circle,
  PanelTopClose,
  Square,
} from 'lucide-react'
import Notification from '../components/Notification'
import { clsx } from 'clsx'

// TODO:
// 1. Check picture editing before loading
// 2. Check different sizes selection - slider x/y like in lego remix
// 3. Check jspdf exporter how to make and draw inside it, draw some example things
// 4. Maybe we could draw the matrix independently from the preview edited canvasss  (draw basing only on matrix)
// 5. Split the matrix into x pieces depending on the selected width and height
// 6. Change the editing mode to only rounded studs.)
// 7. Implement edit mode information when exporting to rendering programs!

const loadedColors = {
  COLORS_ALL: COLORS_ALL,
  COLORS_WARHOL: COLORS_WARHOL,
  COLORS_THE_BEATELS: COLORS_THE_BEATELS,
  COLORS_IRON_MAN: COLORS_IRON_MAN,
  COLORS_HARRY_POTTER: COLORS_HARRY_POTTER,
  COLORS_STAR_WARS: COLORS_STAR_WARS,
  COLORS_MICKEY_MOUSE: COLORS_MICKEY_MOUSE,
  COLORS_LEGO_WORLD_MAP: COLORS_LEGO_WORLD_MAP,
  COLORS_PORTRAIT: COLORS_PORTRAIT,
  COLORS_BATMAN: COLORS_BATMAN,
  COLORS_BATMAN_QUIN: COLORS_BATMAN_QUIN,
  COLORS_BATMAN_JOKER: COLORS_BATMAN_JOKER,
  COLORS_ELVIS: COLORS_ELVIS,
  COLORS_ART_PROJECT: COLORS_ART_PROJECT,
}

const colorsSets = [
  {
    id: 'All',
    value: 'COLORS_ALL',
  },
  {
    id: 'Elvis (new)',
    value: 'COLORS_ELVIS',
  },
  {
    id: 'Batman (new)',
    value: 'COLORS_BATMAN',
  },
  {
    id: 'Batman Harley Quin (new)',
    value: 'COLORS_BATMAN_QUIN',
  },
  {
    id: 'Batman Joker (new)',
    value: 'COLORS_BATMAN_JOKER',
  },
  {
    id: 'Art Project (new)',
    value: 'COLORS_ART_PROJECT',
  },
  {
    id: 'World Map',
    value: 'COLORS_LEGO_WORLD_MAP',
  },
  {
    id: 'LEGO Portraits',
    value: 'COLORS_PORTRAIT',
  },
  {
    id: 'Warhol',
    value: 'COLORS_WARHOL',
  },
  {
    id: 'The Beatels',
    value: 'COLORS_THE_BEATELS',
  },
  {
    id: 'Iron Man',
    value: 'COLORS_IRON_MAN',
  },
  {
    id: 'Harry Potter',
    value: 'COLORS_HARRY_POTTER',
  },
  {
    id: 'Star Wars',
    value: 'COLORS_STAR_WARS',
  },
  {
    id: 'Mickey Mouse',
    value: 'COLORS_MICKEY_MOUSE',
  },
  {
    id: 'Custom Colors',
    value: 'CUSTOM_COLORS',
  },
]

const coords = [
  {
    id: '10x10',
    value: 10,
  },
  {
    id: '16x16',
    value: 16,
  },
  {
    id: '32x32',
    value: 32,
  },
  {
    id: '46x46',
    value: 46,
  },
  {
    id: '48x48',
    value: 48,
  },
  {
    id: '64x64',
    value: 64,
  },
]

type MyProps = {}
type MyState = {
  height: number
  width: number
  updated: boolean
  isCircle: boolean
  file: any | null
  newPhoto: boolean
  selectedBoardSize: number
  colors: []
  customColors: []
  hasFileNotUploadedError: boolean
  LDrawMatrix: []
  editColor: string
  editLegoId: number
  isGenerated: boolean
  hasNumbers: boolean
  extraInfo: any | null
  isEditMode: boolean
  colorsToCompare: string
  hasNotSelectedColors: boolean
}

class PaperCanvas extends React.Component<MyProps, MyState> {
  constructor(props) {
    super(props)

    this.state = {
      height: 450,
      width: 450,
      updated: false,
      isCircle: true,
      file: null,
      newPhoto: false,
      selectedBoardSize: 46,
      colors: [],
      customColors: [],
      hasFileNotUploadedError: false,
      LDrawMatrix: [],
      editColor: '#ffffff',
      editLegoId: 1,
      isGenerated: false,
      hasNumbers: false,
      extraInfo: null,
      isEditMode: false,
      colorsToCompare: 'COLORS_ALL',
      hasNotSelectedColors: false,
    }
    this.makeMosaic = this.makeMosaic.bind(this)

    this.pickEditColor = this.pickEditColor.bind(this)
    this.addCustomColor = this.addCustomColor.bind(this)
    this.updateMatrix = this.updateMatrix.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.resizeMethod = this.resizeMethod.bind(this)
    this.clearCanvas = this.clearCanvas.bind(this)
    this.updateColors = this.updateColors.bind(this)

    this.handleSelectBoardSize = this.handleSelectBoardSize.bind(this)
    this.handleSelectColorsSet = this.handleSelectColorsSet.bind(this)
    this.handleChangeShape = this.handleChangeShape.bind(this)
    this.handleDrawNumbers = this.handleDrawNumbers.bind(this)
    this.handleEditMode = this.handleEditMode.bind(this)
    this.showExtraStudInfo = this.showExtraStudInfo.bind(this)
    this.handleBsxSave = this.handleBsxSave.bind(this)
    this.handleXmlSave = this.handleXmlSave.bind(this)
    this.handleLdrSave = this.handleLdrSave.bind(this)
  }

  componentDidMount() {
    if (typeof window !== `undefined`) {
      const paper = require('paper')
      paper.setup('paperCanvas')
      const raster = new paper.Raster('mosaic')
      raster.visible = false
      raster.position = paper.view.center
    }
    window.addEventListener('resize', this.resizeMethod)
  }
  handleSelectColorsSet(event) {
    this.setState({
      colorsToCompare: event.target.value,
    })
  }
  generateComparableColors(colorsSet) {
    const NEAREST_COLOR_COMPARE = {}
    colorsSet.map((color) => (NEAREST_COLOR_COMPARE[color.bl_name.toString()] = color.hex_code))
    return NEAREST_COLOR_COMPARE
  }
  shadeColor(color, percent) {
    let R: number = parseInt(color.substring(1, 3), 16)
    let G: number = parseInt(color.substring(3, 5), 16)
    let B: number = parseInt(color.substring(5, 7), 16)

    R = (R * (100 + percent)) / 100
    G = (G * (100 + percent)) / 100
    B = (B * (100 + percent)) / 100

    R = R < 255 ? R : 255
    G = G < 255 ? G : 255
    B = B < 255 ? B : 255

    const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16)
    const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16)
    const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16)

    return '#' + RR + GG + BB
  }
  updateMatrix(newMatrix) {
    this.setState({ LDrawMatrix: newMatrix })
  }
  makeMosaic(callback) {
    this.setState({ isGenerated: true })
    this.setState({ hasFileNotUploadedError: false })
    this.clearCanvas()
    const paper = require('paper')
    let chosenColors
    if (this.state.colorsToCompare !== 'CUSTOM_COLORS') {
      chosenColors = loadedColors[this.state.colorsToCompare]
    }
    if (this.state.colorsToCompare === 'CUSTOM_COLORS') {
      if (this.state.customColors.length < 5) {
        this.setState({ hasNotSelectedColors: true })
        return
      }
      chosenColors = this.state.customColors
    }

    const colorsToCompare = this.generateComparableColors(chosenColors)
    const nearestColor = require('nearest-color').from(colorsToCompare)

    // Create a raster item using the image tag with id='mona'
    const raster = new paper.Raster('mosaic')
    // Hide the Raster:
    raster.position = paper.view.center
    raster.visible = false
    // The size of our grid cells:
    const gridSize = this.state.selectedBoardSize

    // Space the cells by 120%:
    const spacing = 19

    // As the web is asynchronous, we need to wait for the raster to load
    // before we can perform any operation on its pixels.

    // passing type of points to raster
    raster.isCircle = this.state.isCircle
    raster.isEditMode = this.state.isEditMode
    raster.hasNumbers = this.state.hasNumbers
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
                this.fillColor = raster.thus.state.editColor
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
                        singleStudObj.hex_code = raster.thus.state.editColor
                        // Getting bl_id for the Hex color from clicking on a badge.
                        singleStudObj.text.content = raster.thus.state.editLegoId
                        singleStudObj.text.fillColor = invert(raster.thus.state.editColor, true)
                        break
                      }
                    }
                  }
                }
                const extraInfo = `LEGO id: ${filteredColour.lego_id}, Hex code: ${filteredColour.hex_code}, RGB: ${filteredColour.rgb}, Color name: ${filteredColour.lego_name}`
                raster.thus.showExtraStudInfo(extraInfo)
                raster.thus.updateMatrix(LDrawMatrix)
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
                this.fillColor = raster.thus.state.editColor
                pathLighter.fillColor = raster.thus.state.editColor
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
                        singleStudObj.hex_code = raster.thus.state.editColor

                        break
                      }
                    }
                  }
                }
                raster.thus.updateMatrix(LDrawMatrix)
              }
            }
          }

          // pathDarker.onClick = function() {
          //   console.log( this.x, this.y, this.LDrawZCoord, this.LDrawXCoord )
          //   this.fillColor = raster.thus.state.editColor
          // }

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
            pathDarker.fillColor = raster.thus.shadeColor(pickedColor.value, -40)
            pathLighter.fillColor = raster.thus.shadeColor(pickedColor.value, 10)
          }
        }
        LDrawMatrix.push(verticalRowBotToTop)
        // Increasing horizontal location of next piece
        LDrawXCoord += 20
      }
      paper.project.activeLayer.position = paper.view.center

      // Returning colors array to create buttons with information and
      // Returning LDraw matrix of color IDs for LDraw to draw board
      callback(colorCodes, LDrawMatrix)
    })
  }

  clearCanvas() {
    if (typeof window !== `undefined`) {
      const paper = require('paper')
      paper.project.activeLayer.removeChildren()
      paper.project.clear()
    }
  }

  updateDimensions() {
    this.setState({
      height: window.innerWidth,
      width: window.innerWidth,
    })
  }

  resizeMethod() {
    this.makeMosaic(this.updateColors)
  }

  clickGenerateMosaicButton() {
    if (!this.state.file) {
      this.setState({ hasFileNotUploadedError: true })
      return
    }

    this.makeMosaic(this.updateColors)
  }

  showExtraStudInfo(extraInfo) {
    // Showing span with all info on a stud
    this.setState({ extraInfo: extraInfo })
  }

  updateColors(colors, LDrawMatrix) {
    // Order here colours by amount of them in the picture
    colors.sort((a, b) => (a.amount > b.amount ? 1 : b.amount > a.amount ? -1 : 0))
    this.setState({ colors: colors, LDrawMatrix: LDrawMatrix })
  }

  handleImageUpload(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
    })
  }
  handleSelectBoardSize(event) {
    this.setState({
      selectedBoardSize: event.target.value,
    })
  }
  handleBsxSave() {
    formatAndDownloadBsxFile(this.state.colors)
  }
  handleLdrSave() {
    formatAndDownloadLdrFile(this.state.LDrawMatrix)
  }

  handleXmlSave() {
    formatAndDownloadXmlFile(this.state.colors)
  }

  handleCanvasSave() {
    const FileSaver = require('file-saver')
    const canvas = document.getElementById('paperCanvas')
    canvas.toBlob(function (blob) {
      FileSaver.saveAs(blob, 'Hvitis.dev-MOSAIC-Art.png')
    })
  }
  handleChangeShape() {
    this.setState({ isCircle: !this.state.isCircle })
  }
  handleDrawNumbers() {
    this.setState({ hasNumbers: !this.state.hasNumbers, isCircle: true, isEditMode: false })
  }
  handleEditMode() {
    this.setState({ isEditMode: !this.state.isEditMode, hasNumbers: true, isCircle: true })
  }
  addCustomColor(colorObject, isSelected) {
    // Adding colors to the list of custom colors
    let currentlySelectedColors = [...this.state.customColors, colorObject]
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
    this.setState({
      customColors: uniqueColors,
      hasNotSelectedColors: false,
    })
  }
  pickEditColor(badgeColor, bl_id) {
    // Setting color for editing to state for editing canvas
    this.setState({
      editColor: badgeColor,
      editLegoId: bl_id,
    })
  }
  render() {
    return (
      <>
        <div className="w-full mx-auto">
          <div className="flex flex-row gap-2 mr-auto">
            <div>
              <div>
                <div
                  className={clsx(
                    'text-center',
                    this.state.hasFileNotUploadedError && 'text-red-600'
                  )}
                >
                  Select image:
                </div>
                <div id="center">
                  <input
                    className="file-input file-input-bordered file-input-info w-full max-w-xs"
                    id="file"
                    type="file"
                    onChange={this.handleImageUpload}
                  />
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>Board size:</div>
                <select
                  className="select select-info w-full max-w-xs"
                  required
                  type="text"
                  as="select"
                  size="lg"
                  onChange={this.handleSelectBoardSize}
                  name="selectedToBucket"
                  value={this.state.selectedBoardSize}
                >
                  <option disabled selected>
                    Select board size
                  </option>
                  {coords.map((sizeOfBoard) => (
                    <option key={sizeOfBoard.id} value={sizeOfBoard.value}>
                      {sizeOfBoard.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div>Colors set:</div>
              <div>
                <select
                  className="select select-info w-full max-w-xs"
                  required
                  type="text"
                  as="select"
                  size="lg"
                  onChange={this.handleSelectColorsSet}
                  name="selectedToBucket"
                  value={this.state.colorsToCompare}
                >
                  <option disabled selected>
                    Select color set
                  </option>
                  {colorsSets.map((colorSet) => (
                    <option key={colorSet.id} value={colorSet.value}>
                      {colorSet.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="">
              <div>Settings:</div>
              <div className="btn-group">
                <button
                  className="btn btn-info"
                  onClick={() => {
                    this.handleChangeShape()
                  }}
                >
                  {this.state.isCircle ? 'Circles' : 'Squares'}
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => {
                    this.handleDrawNumbers()
                  }}
                >
                  {this.state.hasNumbers && this.state.isCircle ? 'Numbers' : 'Blank'}
                </button>

                <button
                  className="btn btn-info"
                  onClick={() => {
                    this.handleEditMode()
                  }}
                >
                  {this.state.isEditMode ? 'Edit' : 'No Edit'}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full my-4 text-center">
            <button
              className="btn btn-success btn-lg mx-2"
              onClick={() => this.clickGenerateMosaicButton(this.updateColors)}
            >
              Generate
            </button>
          </div>
        </div>

        <img
          src={this.state.file}
          alt="Generated mosaic LEGO Image"
          crossOrigin="*"
          ref="mosaic"
          id="mosaic"
          hidden
        />
        <div className="mx-auto">
          <div
            className="btn-group text-right btn-sm mx-10"
            style={{ display: this.state.isGenerated ? 'inherit' : 'none' }}
          >
            <button className="btn btn-info" disabled>
              Download
            </button>
            <button className="btn" onClick={() => this.handleCanvasSave()}>
              .Png
            </button>
            <button className="btn" onClick={() => this.handleBsxSave()}>
              .bsx
            </button>
            <button className="btn" onClick={() => this.handleXmlSave()}>
              .xml
            </button>
            <button className="btn" onClick={() => this.handleLdrSave()}>
              .ldr
            </button>
          </div>
          <canvas
            style={{ display: this.state.isGenerated ? 'inherit' : 'none' }}
            className="p-10 mx-auto"
            id="paperCanvas"
            height={this.state.height}
            width={this.state.width}
          ></canvas>
        </div>

        <Notification
          title={'Obtain various file options'}
          msg={
            'You can download .png file with your mosaic image to Download .png or .xml file you can use in various places to download list of needed pieces .xml or .bsx file is used to make orders on BrickLink.com'
          }
        />
        <div>
          {this.state.colorsToCompare === 'CUSTOM_COLORS' ? (
            COLORS_ALL_CUSTOM.map((color) => (
              <SelectColorBadge
                addCustomColor={this.addCustomColor}
                color={color}
                key={color.lego_name}
              />
            ))
          ) : (
            <></>
          )}

          {this.state.colors.length !== 0 ? (
            <p>
              <span>
                <mark>Average</mark> price of
                <mark>all</mark> pieces.
              </span>
              Estimated price :{' '}
              {`${this.state.selectedBoardSize * this.state.selectedBoardSize * 0.04} $`}
            </p>
          ) : (
            <></>
          )}
          {this.state.extraInfo && (
            <p>
              <span>
                <mark>Color names</mark> correspond to unofficial LEGO names.
              </span>
              {`Extra Stud Info : ${this.state.extraInfo}`}
            </p>
          )}
        </div>

        {this.state.colors.length !== 0 ? (
          <p style={{ maxWidth: '200px' }}>
            <span>
              <mark>Click</mark> on item to set color in
              <mark>EDIT</mark> mode
            </span>
            List of mosaic colors :
          </p>
        ) : (
          <></>
        )}
        {this.state.colors.map((color) => (
          <BadgeColor pickEditColor={this.pickEditColor} color={color} key={color.bl_id} />
        ))}
      </>
    )
  }
}

export default PaperCanvas
