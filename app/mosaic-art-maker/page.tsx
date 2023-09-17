'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

const MosaicArtMaker = dynamic(() => import('@/components/MosaicArtMaker/MosaicArtMaker'), {
  ssr: false,
})

const LEGOArt: React.FunctionComponent = ({ ...props }) => {
  return (
    <>
      <MosaicArtMaker></MosaicArtMaker>
    </>
  )
}

export default LEGOArt
