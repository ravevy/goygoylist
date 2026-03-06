import { useTheme } from '@/context/themeContext'
import Link from 'next/link'
import React from 'react'

type Variant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'disabled'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  href?: string
  children: React.ReactNode
}

export const Button = ({
  variant = 'default',
  href,
  children,
  className,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme()
  const variantClassMap: Record<Variant, string> = {
    default: '',
    primary: theme === 'dark' ? '' : 'is-primary',
    success: 'is-success',
    warning: 'is-warning',
    error: 'is-error',
    disabled: 'is-disabled'
  }

  const btnClass = `nes-btn ${props.disabled ? 'disabled' : variantClassMap[variant]} ${className}`

  if (href) {
    return (
      <Link
        href={href}
        className={btnClass}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={btnClass} {...props}>
      {children}
    </button>
  )
}
