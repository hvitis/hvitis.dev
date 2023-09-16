/* eslint-disable jsx-a11y/anchor-has-content */
import clsx from 'clsx'
import styles from './PulsatingButton.module.css'
import { Button } from '@nextui-org/react'

export default function PulsatingButton({ title = 'Click', isActive, onClick, children }) {
  return (
    <>
      <Button
        radius="md"
        size="lg"
        onClick={() => onClick()}
        className={clsx(
          'bg-gradient-to-r from-teal-500 from-10% via-sktealtealy-300 via-30% to-emerald-500 to-90% text-white shadow-lg',
          isActive && styles.pulse
        )}
      >
        {children || title}
      </Button>
    </>
  )
}
