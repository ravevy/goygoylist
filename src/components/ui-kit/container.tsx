// components/Container.tsx
import { useTheme } from '@/context/themeContext'
import React from 'react'

type Variant = 'default' | 'dark' | 'centered' | 'rounded'

interface ContainerProps {
  title?: string
  children: React.ReactNode
  variants?: Variant[]
  className?: string
}

export const Container = ({
  title,
  children,
  variants = [],
  className
}: ContainerProps) => {
  const { theme } = useTheme()
  const variantClassMap: Record<Variant, string> = {
    default: '',
    dark: 'is-dark',
    centered: 'is-centered',
    rounded: 'is-rounded'
  }

  const classes = [
    'nes-container',
    ...variants.map((v) => variantClassMap[v]),
    theme === 'dark' ? 'is-dark' : '',
    title ? 'with-title' : '',
    'transition-all duration-[300]',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {title && <p className="title">{title}</p>}
      {children}
    </div>
  )
}
