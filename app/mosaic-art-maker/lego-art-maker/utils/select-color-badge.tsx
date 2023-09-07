'use client' // This is a client component 👈🏽

import React, { useState } from 'react'
import invert from 'invert-color'

interface BadgeProps {}

const SelectColorBadge: React.FunctionComponent<BadgeProps> = (props) => {
  const color = props.color
  const [isPressed, setIsPressed] = useState(false)
  const onPressed = () => {
    setIsPressed(!isPressed)
  }

  const invertedColor = invert(color.hex_code, true)
  return (
    <button
      onClick={() => {
        props.addCustomColor(color, isPressed)
      }}
      onFocus={onPressed}
      key={color.hex_code}
      style={
        isPressed
          ? {
              color: `${invertedColor}`,
              backgroundColor: `${color.hex_code}`,
            }
          : {
              color: `${color.hex_code}`,
              backgroundColor: `${color.hex_code}`,
            }
      }
    >
      <div>{`${color.bl_name}`}</div>
      <span>{color && color.bl_id ? `BrickLinkID: ${color.bl_id}` : 'No brickLink ID'}</span>
    </button>
  )
}

export default SelectColorBadge
