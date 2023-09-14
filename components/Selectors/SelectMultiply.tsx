import React, { useState } from 'react'
import { Select, SelectItem, Avatar, Chip, SelectedItems } from '@nextui-org/react'
import { users } from './data'
import humanize from '@/utils/humanize'

type User = {
  id: number
  key: string
  name: string
  value: string
  description: string
  avatar: string
}

export default function SelectMultiply({ options }) {
  const [isShown, setIsShown] = useState(false)
  console.log(options)
  const optionsFormatted = Object.keys(options).map((set, index) => {
    const setName = humanize(set.slice(6, 30))
    return {
      id: index,
      key: index,
      name: humanize(set.slice(6, 30)),
      value: set,
      description: `Lego set of ${setName}`,
      avatar: '/webp/sets/world-map.webp',
    }
  })
  console.log(optionsFormatted)

  const [values, setValues] = React.useState<Selection>(new Set([]))

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = new Set(e.target.value.split(','))
    console.log(values)
    setValues(values)
  }

  return (
    <Select
      items={optionsFormatted}
      variant="bordered"
      isMultiline={true}
      selectionMode="multiple"
      label="LEGO Art sets"
      placeholder="Select a color set"
      color={'primary'}
      labelPlacement="outside"
      onChange={handleSelectionChange}
      classNames={{
        base: 'max-w-xs text-left',
        trigger: 'min-h-unit-12 py-2',
      }}
      renderValue={(items: SelectedItems<User>) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Chip onMouseEnter={(e) => console.log(e.target)} key={item.key}>
                {item.data.name}
              </Chip>
            ))}
          </div>
        )
      }}
    >
      {(option) => (
        <SelectItem key={option.id} textValue={option.name}>
          <div className="flex gap-2 items-center">
            <Avatar alt={option.name} className="flex-shrink-0" size="sm" src={option.avatar} />
            <div className="flex flex-col">
              <span className="text-small">{option.name}</span>
              <span className="text-tiny text-default-400">{option.description}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}
