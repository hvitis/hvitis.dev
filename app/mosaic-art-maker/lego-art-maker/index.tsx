'use client'

import React from 'react'
import PaperCanvas from './paper-canvas'
import NotificationSimple from '@/components/NotificationSimple'
import Notification from '@/components/Notification'
import { isMobile } from 'react-device-detect'

class LegoArtMaker extends React.Component {
  render() {
    return (
      <>
        <div className="w-full mx-auto text-center">
          {isMobile && (
            <NotificationSimple
              msg={' For the best experience open this page on your macOS or PC.'}
            />
          )}
          <div className="hero-content">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Mosaic Art Maker</h1>
              <p className="py-6">Make your favourite LEGO mosaic.</p>
            </div>
          </div>
          <PaperCanvas />
          <div>
            <Notification
              title={'Obtain various file options'}
              msg={
                'You can download .png file with your mosaic image to Download .png or .xml file you can use in various places to download list of needed pieces .xml or .bsx file is used to make orders on BrickLink.com'
              }
            />
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
      </>
    )
  }
}

export default LegoArtMaker
