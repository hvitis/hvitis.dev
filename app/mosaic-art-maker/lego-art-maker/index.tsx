'use client'

import React from 'react'
import PaperCanvas from './paper-canvas'
import Link from 'next/link'
import NotificationSimple from '../components/NotificationSimple'
import Notification from '../components/Notification'

class LegoArtMaker extends React.Component {
  render() {
    return (
      <>
        <div>
          <NotificationSimple
            msg={' For the best experience open this page on your macOS or PC.'}
          />
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Mosaic Art Maker</h1>
              <p className="py-6">Make your favourite LEGO mosaic.</p>
            </div>
          </div>
          <PaperCanvas></PaperCanvas>
          <div>
            <div>
              <Notification
                title={'Learn how to use this generator.'}
                msg={
                  'You can use <b>.bsx</b> and <b>.xml</b> files on BrickLink.com to buy generated studs or on stud.io to render the picture in 3D.'
                }
                href={'https://www.bricklink.com/v2/wanted/upload.page'}
              ></Notification>
              <Notification
                title={'Disclaimer'}
                msg={
                  'LEGO and the LEGO logo are trademarks and/or copyrights of the LEGO Group. This project is not at all affiliated with The LEGO Group, and was simply a project of mine using the LEGO name as a proprietary eponym'
                }
              ></Notification>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default LegoArtMaker
