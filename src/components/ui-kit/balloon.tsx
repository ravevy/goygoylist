import React from 'react'
import { useTheme } from '@/context/themeContext'
import Image from 'next/image'

type Variant = 'default' | 'dark'
type Direction = 'left' | 'right'

interface BalloonProps {
  direction?: Direction
  variant?: Variant
  className?: string
  children: React.ReactNode
  showClippy?: boolean
}

export const Balloon = ({
  direction = 'left',
  variant = 'default',
  className = '',
  children,
  showClippy
}: BalloonProps) => {
  const { theme } = useTheme()

  const variantClassMap: Record<Variant, string> = {
    default: '',
    dark: 'is-dark'
  }

  const directionClass = direction === 'left' ? 'from-left' : 'from-right'

  const balloonClass = `nes-balloon ${directionClass} ${theme === 'dark' ? 'is-dark ' + variantClassMap[variant] : variantClassMap[variant]}`

  return (
    <div className={'flex items-end justify-center ' + className}>
      <div className={balloonClass}>{children}</div>
      {showClippy && (
        <Image
          src="/assets/clippy.webp"
          alt="microsoft helper clippy image"
          height={100}
          width={100}
          className="aspect-79/126 max-h-30 w-auto"
        />
      )}
    </div>
  )
}
