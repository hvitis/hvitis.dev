import * as React from 'react'
import dynamic from 'next/dynamic'

const LegoArtMaker = dynamic(() => import('@/components/lego-art-maker'), {
  ssr: false,
})

const LEGOArt: React.FunctionComponent = ({ ...props }) => {
  return (
    <div {...props}>
      <LegoArtMaker />
    </div>
  )
}

export default LEGOArt
