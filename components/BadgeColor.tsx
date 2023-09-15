// @ts-nocheck
import React, { useState } from 'react'
import tinycolor from 'tinycolor2'

interface BadgeProps {}

const BadgeColor: React.FunctionComponent<BadgeProps> = ({ color, onClick, editColor, remove }) => {
  const [isClicked, setIsClicked] = useState(false)

  const tooltip = `${color.bl_name ? color.bl_name : 'Click on mosaic to edit it.'}`
  const hint = remove ? 'Click to remove from the list' : 'Click on generated image to edit it.'

  const handleClick = (e) => {
    setIsClicked(!isClicked)
    onClick(color)
  }

  const styledBackground = {
    opacity: 0.9,
    backgroundImage: `linear-gradient(135deg, ${
      color.hex_code
    } 25%, transparent 25%), linear-gradient(225deg, ${
      color.hex_code
    } 25%, transparent 25%), linear-gradient(45deg, ${
      color.hex_code
    } 25%, transparent 25%), linear-gradient(315deg, ${color.hex_code} 25%, ${tinycolor(
      color.hex_code
    )
      .darken(30)
      .toString()} 25%)`,
    backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
    backgroundSize: '20px 20px',
    backgroundRepeat: 'repeat',
  }

  const defaultBackground = {
    backgroundColor: color.hex_code,
  }

  return (
    <div className="tooltip" data-tip={editColor.hex_code === color.hex_code ? hint : tooltip}>
      <button
        onClick={(e) => handleClick(e)}
        key={color.hex}
        className="badge badge-lg w-4"
        style={isClicked ? styledBackground : defaultBackground}
      />
    </div>
  )
}

export default BadgeColor
