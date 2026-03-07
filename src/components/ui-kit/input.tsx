import { useTheme } from '@/context/themeContext'
import React from 'react'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'dark'

type Size = 'xs' | 'sm' | 'md'

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  label?: string
  variant?: Variant
  inline?: boolean
  size?: Size
}

export const Input = ({
  label,
  variant = 'default',
  inline = false,
  size = 'md',
  className = '',
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

  const sizeClassMap: Record<Size, string> = {
    xs: 'h-3 text-xs! placeholder:text-xs',
    sm: 'h-4 text-sm! placeholder:text-sm',
    md: ''
  }

  const containerClass = inline ? 'nes-field is-inline' : 'nes-field'
  const inputClass = `nes-input ${theme === 'dark' ? 'is-dark' : variantClassMap[variant]} ${sizeClassMap[size]} ${className}`

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
          className={sizeClassMap[size]}
          style={variant === 'dark' ? { color: '#fff' } : undefined}
        >
          {label}
        </label>
      )}
      <input className={inputClass} {...props} />
    </div>
  )
}
