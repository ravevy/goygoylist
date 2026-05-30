import { useTheme } from '@/context/themeContext'
import React from 'react'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'dark'
type Size = 'xs' | 'sm' | 'md'

interface Option {
  label: string
  value: string | number
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  label?: string
  variant?: Variant
  size?: Size
  placeholder?: string
  options: Option[]
}

export const Select = ({
  label,
  variant = 'default',
  size = 'md',
  options,
  className = '',
  placeholder,
  ...props
}: SelectProps) => {
  const { theme } = useTheme()

  const variantClassMap: Record<Variant, string> = {
    default: '',
    success: 'is-success',
    warning: 'is-warning',
    error: 'is-error',
    dark: 'is-dark'
  }

  const sizeClassMap: Record<Size, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: ''
  }

  const containerClass = `nes-select ${
    theme === 'dark'
      ? `is-dark ${variantClassMap[variant]}`
      : variantClassMap[variant]
  } ${className}`

  return (
    <div
      className="nes-field"
      style={
        variant === 'dark'
          ? { backgroundColor: '#212529', padding: '1rem' }
          : undefined
      }
    >
      {label && (
        <label
          htmlFor={props.id}
          className={`nes-text ${variantClassMap[variant]} ${sizeClassMap[size]}`}
          style={variant === 'dark' ? { color: '#fff' } : undefined}
        >
          {label}
        </label>
      )}

      <div className={containerClass}>
        <select className={sizeClassMap[size]} {...props}>
          <option value="" disabled hidden>
            {placeholder || 'Select...'}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
