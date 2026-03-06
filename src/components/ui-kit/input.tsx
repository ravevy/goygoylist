import { useTheme } from '@/context/themeContext'
import React from 'react'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'dark'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  variant?: Variant
  inline?: boolean
}

export const Input = ({
  label,
  variant = 'default',
  inline = false,
  ...props
}: InputProps) => {
  const { theme } = useTheme()
  const variantClassMap: Record<Variant, string> = {
    default: '',
    success: 'is-success',
    warning: 'is-warning',
    error: 'is-error',
    dark: 'is-dark'
  }

  const containerClass = inline ? 'nes-field is-inline' : 'nes-field'
  const inputClass = `nes-input ${theme === 'dark' ? 'is-dark' : variantClassMap[variant]}`

  return (
    <div
      className={containerClass}
      style={
        variant === 'dark'
          ? { backgroundColor: '#212529', padding: '1rem' }
          : undefined
      }
    >
      {label && (
        <label
          htmlFor={props.id}
          style={variant === 'dark' ? { color: '#fff' } : undefined}
        >
          {label}
        </label>
      )}
      <input className={inputClass} {...props} />
    </div>
  )
}
