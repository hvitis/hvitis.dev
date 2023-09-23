import { InfoIcon } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  title: string
  text: string
  color?:
    | 'default'
    | 'warning'
    | 'foreground'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | undefined
  children?: ReactNode
}

const Helper = ({ title, text, children, color = 'warning' }: Props) => {
  return (
    <>
      <Popover key={title} placement="top" color={color}>
        <PopoverTrigger className="my-auto mx-2">
          {children ? children : <InfoIcon className={clsx('w-4 h-4 ', `text-${color}`)} />}
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
