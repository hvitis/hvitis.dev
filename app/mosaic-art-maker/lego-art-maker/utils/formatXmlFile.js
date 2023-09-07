export function formatAndDownloadXmlFile(items) {
  //
  // Example.xml file, it can be
  // made of strings attached together.
  //
  // <INVENTORY>
  //   <ITEM>
  //        <ITEMTYPE>P</ITEMTYPE>
  //        <ITEMID>98138</ITEMID>
  //        <COLOR>99</COLOR>
  //        <MINQTY>190</MINQTY>
  //    </ITEM>
  // </INVENTORY>

  var FileSaver = require('file-saver')
  var blob = new Blob([getStringXmlFromAllItems(items)], {
    type: 'text/plain;charset=utf-8',
  })
  FileSaver.saveAs(blob, 'Hvitis.dev-MOSAIC-Art-list-of-pieces.xml')
}
function getStringXmlFromAllItems(items) {
  let bsxFile
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    bsxFile += getItem(item)
  }
  bsxFile = bsxFile.split('undefined')[1]
  bsxFile = `<INVENTORY${bsxFile}</INVENTORY>`
  return bsxFile
}
function getItem(item) {
  return `<ITEM>${getItemID()}${getItemTypeID()}${getColorID(item)}${getQty(
    item
  )}</ITEM>`
}
function getItemTypeID() {
  return `<ITEMTYPE>P</ITEMTYPE>`
}
function getItemID() {
  return `<ITEMID>98138</ITEMID>`
}
function getColorID(item) {
  return `<COLOR>${item.bl_id}</COLOR>`
}
function getQty(item) {
  return `<MINQTY>${item.amount}</MINQTY>`
}
