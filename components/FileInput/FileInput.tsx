/* eslint-disable jsx-a11y/anchor-has-content */
import clsx from 'clsx'
import styles from './FileInput.module.css'

const FileInput = ({ onClick, error, file, title }) => {
  const handleFileInput = (e) => {
    if (!e.target.files) return
    onClick(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <div className={clsx('flex flex-col lg:w-1/2 lg:mx-4 lg:my-0 my-5')}>
      <label
        className={clsx(
          'text-sm text-left font-medium text-gray-600 dark:text-gray-300 my-1 range-accent',
          error && 'text-yellow-500 font-medium'
        )}
      >
        {title}:
        <input
          type="file"
          className={clsx(
            'file-input file-input-bordered file-input-info w-full max-w-xs',
            !file && styles.pulse
          )}
          onChange={(e) => handleFileInput(e)}
        />
      </label>
    </div>
  )
}

export default FileInput
