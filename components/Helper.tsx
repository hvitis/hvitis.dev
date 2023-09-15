import { InfoIcon } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react'
import { ReactNode } from 'react'

interface Props {
  title: string
  text: string
  color?: 'warning'
  children?: ReactNode
}

const Helper = ({ title, text, color = 'warning', children }: Props) => {
  return (
    <>
      <Popover key={title} placement="top" color={color}>
        <PopoverTrigger className="my-auto mx-2">
          {children ? children : <InfoIcon className="w-4 h-4 text-yellow-500" />}
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold">{title}</div>
            <div className="text-tiny">{text}</div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default Helper
