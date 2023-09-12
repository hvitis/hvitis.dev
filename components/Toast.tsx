import { InfoIcon } from 'lucide-react'

interface Props {
  text: string
}

const Toast = ({ text }: Props) => {
  return (
    <div className="toast toast-end">
      <div className="alert">
        <InfoIcon className="stroke-info shrink-0 w-6 h-6" />
        <span>{text}</span>
      </div>
    </div>
  )
}

export default Toast
