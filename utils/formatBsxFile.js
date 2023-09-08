export function formatAndDownloadBsxFile(items) {
  //
  // Example.bsx file, it can be
  // made of strings attached together.
  //
  // <BrickStoreXML>
  // <Inventory>
  // <Item>
  // <ItemID>30374</ItemID>
  // <ItemTypeID>P</ItemTypeID>
  // <ColorID>11</ColorID>
  // <Qty>4</Qty>
  // <Price>0.000</Price>
  // <Condition>N</Condition>
  // </Item>
  // </Inventory>
  // </BrickStoreXML>

  var FileSaver = require('file-saver')
  var blob = new Blob([getStringBaxFromAllItems(items)], {
    type: 'text/plain;charset=utf-8',
  })
  FileSaver.saveAs(blob, 'Hvitis.dev-MOSAIC-list-of-pieces.bsx')
}
function getStringBaxFromAllItems(items) {
  let bsxFile
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    bsxFile += getItem(item)
  }
  bsxFile = bsxFile.split('undefined')[1]
  bsxFile = `<BrickStoreXML><Inventory>${bsxFile}</Inventory></BrickStoreXML>`
  return bsxFile
}
function getItem(item) {
  return `<Item>${getItemID()}${getItemTypeID()}${getColorID(item)}${getQty(
    item
  )}${getPrice()}${getCondition()}</Item>`
}
function getItemID() {
  return `<ItemID>98138</ItemID>`
}
function getItemTypeID() {
  return `<ItemTypeID>P</ItemTypeID>`
}
function getColorID(item) {
  return `<ColorID>${item.bl_id}</ColorID>`
}
function getQty(item) {
  return `<Qty>${item.amount}</Qty>`
}
function getPrice() {
  return `<Price>0.000</Price>`
}
function getCondition() {
  return `<Condition>N</Condition>`
}
