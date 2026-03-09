import React, { useRef, useEffect } from 'react'
import { useTheme } from '@/context/themeContext'
import { Spinner } from './spinner'

type Variant = 'default' | 'dark'

interface DialogProps {
  open: boolean
  title?: string
  variant?: Variant
  rounded?: boolean
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  children?: React.ReactNode
  className?: string
  isLoading?: boolean
}

export const Dialog = ({
  open,
  title,
  variant = 'default',
  rounded = false,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  children,
  className,
  isLoading
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const variantClass = variant === 'dark' || theme === 'dark' ? 'is-dark' : ''
  const roundedClass = rounded ? 'is-rounded' : ''

  const dialogClass = `nes-dialog mx-auto my-auto ${variantClass} ${roundedClass} ${className}`

  return (
    <dialog ref={dialogRef} className={dialogClass}>
      <div className="flex flex-col gap-4">
        {title && <p className="title">{title}</p>}

        {children}

        <menu className="dialog-menu flex justify-between">
          <button
            className="nes-btn"
            disabled={isLoading}
            onClick={() => {
              onCancel?.()
            }}
          >
            {cancelText}
          </button>

          <button
            className="nes-btn is-primary"
            disabled={isLoading}
            onClick={() => {
              onConfirm?.()
            }}
          >
            {isLoading ? (
              <Spinner className="mx-2 size-5" variant="diamond" />
            ) : (
              confirmText
            )}
          </button>
        </menu>
      </div>
    </dialog>
  )
}
