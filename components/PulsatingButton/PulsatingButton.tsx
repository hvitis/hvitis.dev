/* eslint-disable jsx-a11y/anchor-has-content */
import clsx from 'clsx'
import styles from './PulsatingButton.module.css'
import { Button } from '@nextui-org/react'

export default function PulsatingButton({ title = 'Click', isActive, onClick, children }) {
  return (
    <>
      <Button
        radius="full"
        size="lg"
        onClick={() => onClick()}
        className={clsx(
          'bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg',
          isActive && styles.pulse
        )}
      >
        {children || title}
      </Button>
    </>
  )
}
