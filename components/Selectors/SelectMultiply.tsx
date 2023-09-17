import React from 'react'
import { Select, SelectItem, Avatar, Chip, SelectedItems } from '@nextui-org/react'

type LegoSet = {
  id: number
  name: string
  description: string
  colors: object[]
  nr: string
  image: string
  pcs: number
}

export default function SelectMultiply({ options, onSelect, label }) {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = new Set(e.target.value.split(','))
    onSelect(values)
  }

  return (
    <Select
      items={options}
      variant="bordered"
      isMultiline={true}
      selectionMode="multiple"
      label={label}
      placeholder="Select a color set"
      color={'primary'}
      labelPlacement="outside"
      defaultSelectedKeys={['1']}
      onChange={handleSelectionChange}
      classNames={{
        base: 'max-w-xs text-left',
        trigger: 'min-h-unit-12 py-2',
      }}
      renderValue={(items: SelectedItems<LegoSet>) => {
        return (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              // @ts-ignore
              <Chip key={index}>{item.data.name}</Chip>
            ))}
          </div>
        )
      }}
    >
      {(option) => (
        <SelectItem key={option.id} textValue={option.name}>
          <div className="flex gap-2 items-center">
            <Avatar alt={option.name} className="flex-shrink-0" size="sm" src={option.image} />
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
