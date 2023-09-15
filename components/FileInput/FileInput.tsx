/* eslint-disable jsx-a11y/anchor-has-content */
import clsx from 'clsx'
import styles from './FileInput.module.css'

const FileInput = ({ onClick, error, file }) => {
  return (
    <div className={clsx('flex flex-col w-1/2 mx-4')}>
      <label
        className={clsx(
          'text-left font-medium text-gray-600 dark:text-gray-300 my-1 range-accent',
          error && 'text-yellow-500 font-medium'
        )}
      >
        Select image:
        <input
          type="file"
          className={clsx(
            'file-input file-input-bordered file-input-info w-full max-w-xs',
            !file && styles.pulse
          )}
          onChange={(e) => onClick(URL.createObjectURL(e.target.files[0]))}
        />
      </label>
    </div>
  )
}

export default FileInput
