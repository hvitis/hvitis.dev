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
          <div className="hero-content mb-4">
            <div className="max-w-md">
              <div className="indicator">
                <span className="indicator-item indicator-bottom badge badge-secondary -right-5">
                  v. 2.0
                </span>
                {/* <div className="grid w-32 h-32 bg-base-300 place-items-center">content</div> */}
                <h1 className="text-5xl font-bold">Mosaic Art Maker</h1>
              </div>
              <p className="py-6">Make your favourite LEGO mosaic even better.</p>
            </div>
          </div>
          <Notification
            title={'New version has arrived!'}
            msg={'Learn what is new and what I am working on for the next version 3.0'}
            href={'blog/'}
            className="mb-20 w-5/6 mx-auto"
          ></Notification>
          <div className="mb-20">
            <PaperCanvas />
          </div>
          <div>
            <div className="divider"></div>

            <p className="text-xs font-thin">
              LEGO and the LEGO logo are trademarks and/or copyrights of the LEGO Group. This
              project is not at all affiliated with The LEGO Group, and was simply a project of mine
              using the LEGO name as a proprietary eponym
            </p>
          </div>
        </div>
      </>
    )
  }
}

export default LegoArtMaker
