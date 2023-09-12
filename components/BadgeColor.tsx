// @ts-nocheck
import React from 'react'
import invert from 'invert-color'

interface BadgeProps {}

const BadgeColor: React.FunctionComponent<BadgeProps> = ({ color, pickEditColor, editColor }) => {
  const invertedColor = invert(color.hex_code, true)
  const tooltip = `${color.amount} ${color.name} pieces on board.`
  const hint = 'Click on board and edit cusing this color.'
  return (
    <div className="tooltip" data-tip={editColor === color.hex_code ? hint : tooltip}>
      <button
        onClick={() => pickEditColor(color.hex_code, color.bl_id)}
        key={color.hex}
        className="badge badge-lg"
        style={{
          color: `${invertedColor}`,
          backgroundColor: `${color.hex_code}`,
        }}
      >
        {editColor === color.hex_code && `Color nr ${color.bl_id}`}
      </button>
    </div>
  )
}

export default BadgeColor
