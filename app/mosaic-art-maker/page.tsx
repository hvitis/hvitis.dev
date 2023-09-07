import * as React from 'react'

import LegoArtMaker from './lego-art-maker'

type LEGOArtProps = {}

const LEGOArt: React.FunctionComponent<LEGOArtProps> = ({ ...props }) => {
  return (
    <div {...props}>
      <LegoArtMaker />
    </div>
  )
}

export default LEGOArt
