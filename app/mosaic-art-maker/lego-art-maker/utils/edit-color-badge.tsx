import React from 'react'
import invert from 'invert-color'

interface BadgeProps {}

const BadgeColor: React.FunctionComponent<BadgeProps> = (props) => {
  const color = props.color
  const invertedColor = invert(color.hex_code, true)
  return (
    <button
      onClick={() => props.pickEditColor(color.hex_code, color.bl_id)}
      key={color.hex}
      style={{
        color: `${invertedColor}`,
        backgroundColor: `${color.hex_code}`,
      }}
    >
      <span variant="light">{`${color.name}`}</span>

      <span>
        {`Amount of pieces: ${color.amount}
        BrickLinkID: ${color.bl_id}` || 'No brickLink ID'}
      </span>
    </button>
  )
}

export default BadgeColor
