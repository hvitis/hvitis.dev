import * as React from 'react'

import LegoArtMaker from './lego-art-maker'

const LEGOArt: React.FunctionComponent = ({ ...props }) => {
  return (
    <div {...props}>
      <LegoArtMaker />
    </div>
  )
}

export default LEGOArt
