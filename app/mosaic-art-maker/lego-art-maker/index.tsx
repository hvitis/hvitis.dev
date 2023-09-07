'use client'

import React from 'react'
import PaperCanvas from './paper-canvas'
import Link from 'next/link'

class LegoArtMaker extends React.Component {
  render() {
    return (
      <div>
        <h1 id="LEGO">MOSAIC ART MAKER</h1>
        {/* Flex stretching works only on > sm screens. */}
        <div>
          <div>
            <div>INFO :</div> For the best experience open this page on your macOS or PC.
          </div>
        </div>
        <PaperCanvas></PaperCanvas>
        <div>
          <div>
            <div>
              <div>HOW TO :</div>{' '}
              <Link
                href={
                  'https://www.hvitis.dev/mosaic-art-creator-mosaic-and-portraits-free-online-editor'
                }
              >
                {' '}
                Click here{' '}
              </Link>{' '}
              to learn how to use this generator. You can use <b>.bsx</b> and <b>.xml</b> files on{' '}
              <Link href={'https://www.bricklink.com/v2/wanted/upload.page'}>BrickLink.com </Link>{' '}
              to buy generated studs or on{' '}
              <Link href={'https://www.bricklink.com/v3/studio/download.page'}>stud.io </Link> to
              render the picture in 3D.
            </div>
          </div>
          <div>
            <div>
              {' '}
              <div>DISCLAIMER :</div> LEGO and the LEGO logo are trademarks and/or copyrights of the
              LEGO Group. This project is not at all affiliated with The LEGO Group, and was simply
              a project of mine using the LEGO name as a proprietary eponym.{' '}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LegoArtMaker
