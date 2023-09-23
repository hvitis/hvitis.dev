export function formatAndDownloadLdrFile(matrix) {
  //
  // Example.ldr file, it can be
  // made of strings attached together.
  //
  // First the file starts with description and comments:
  // 0 Untitled Model
  // 0 Name:  10x10
  // 0 Author:
  // 0 CustomBrick
  // 0 NumOfBricks:  112 (eg extra bricks for the base)
  // then it is followed by a base
  // 1 71 100.000000 -8.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 3832.dat
  // 1 71 20.000000 -8.000000 100.000000 0.000000 0.000000 -1.000000 0.000000 1.000000 0.000000 1.000000 0.000000 0.000000 3034.dat
  // 1 71 80.000000 -16.000000 60.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 41539.dat
  // 1 71 100.000000 -16.000000 160.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 3832.dat
  // 1 71 70.000000 -8.000000 150.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 11212.dat
  // 1 71 120.000000 -8.000000 140.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 3022.dat
  // 1 71 140.000000 -8.000000 170.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 3710.dat
  // 1 71 170.000000 -8.000000 50.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 11212.dat
  // 1 71 160.000000 -8.000000 120.000000 0.000000 0.000000 -1.000000 0.000000 1.000000 0.000000 1.000000 0.000000 0.000000 3020.dat
  // 1 71 180.000000 -16.000000 60.000000 0.000000 0.000000 -1.000000 0.000000 1.000000 0.000000 1.000000 0.000000 0.000000 3034.dat
  // 1 71 190.000000 -8.000000 120.000000 0.000000 0.000000 -1.000000 0.000000 1.000000 0.000000 1.000000 0.000000 0.000000 3710.dat
  // 1 71 190.000000 -8.000000 170.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 3024.dat
  // And finished by a comment STEP
  // 0 STEP
  // Then actual line explaining stud comes into play:

  // 1 15 10.000000 -24.000000 -10.000000 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 98138.dat

  // Explanation of this line is as follows:
  // 1 <colour> x y z a b c d e f g h i <file>
  // <colour> is a number representing the colour of the part. See the Colours section for allowable colour numbers.
  // x y z is the x y z coordinate of the part
  // a b c d e f g h iis a top left 3x3 matrix of a standard 4x4 homogeneous transformation matrix. This represents the rotation and scaling of the part.
  // LDraw uses a right-handed co-ordinate system where -Y is "up".

  // That is why the only variables here are x, y and color.

  // {matrix} that we pass into function is an array of arrays of objects
  // Main array numeration stands for x coordinates
  // Numeration of objects in nested arrays stands for y coordinates

  // Objects within arrays have the follows scheme:
  // {
  //   x: {int}
  //   y: {int}
  //   color: {ldraw_color_id}
  // }

  var FileSaver = require('file-saver')
  var blob = new Blob([getStringLdrFromAllItems(matrix)], {
    type: 'text/plain;charset=utf-8',
  })
  FileSaver.saveAs(blob, 'Hvitis.dev-MOSAIC-list-of-pieces.ldr')
}

function getStringLdrFromAllItems(matrix) {
  let edgeSize = Math.sqrt(matrix.length)
  let ldrFile = `0 Lego Art \n0 Name:  ${edgeSize}x${edgeSize} \n0 Author:  \n0 CustomBrick \n0 NumOfBricks:  ${matrix.length} \n`

  for (let index = 0; index < matrix.length; index++) {
    let obj = matrix[index]
    ldrFile = ldrFile.concat(getSingleLine(obj))
  }
  return ldrFile
}

function getSingleLine({ x, y, ldraw_id }) {
  return `1 ${ldraw_id} ${parseNumber(x * 20)} -10 ${parseNumber(
    y * 20
  )} 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1.000000 98138.dat \n`
}

function parseNumber(num) {
  return parseFloat(num).toFixed(6)
}
