import { InfoIcon } from 'lucide-react'

interface Props {
  title: string
  text: string
}

const Helper = ({ title, text }: Props) => {
  return (
    <>
      <div className="dropdown dropdown-end my-auto">
        <button tabIndex={0} className="btn btn-circle btn-ghost btn-xs text-info my-auto">
          <InfoIcon className="stroke-info shrink-0 w-5 h-5" />
        </button>
        <div className="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
          <div className="card-body">
            <h2 className="card-title">{title}</h2>
            <p>{text}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Helper
