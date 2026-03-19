interface SeparatorProps {
  className?: string
}

export const Separator = ({ className }: SeparatorProps) => {
  return (
    <div
      className={['my-5 h-1 w-full', className].filter(Boolean).join(' ')}
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          var(--body-text),
         var(--body-text) 16px,
          transparent 12px,
          transparent 28px
        )`
      }}
    />
  )
}
