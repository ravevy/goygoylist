import { useRef, useState } from 'react'

interface AutoGrowTextareaProps {
  id: string
  value: string
  setValue: (value: string) => void
  className?: string
}

export default function AutoGrowTextarea({
  id,
  value,
  setValue,
  className
}: AutoGrowTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)

    const el = textareaRef.current
    if (!el) return

    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 2 + 'px'
  }

  return (
    <textarea
      id={id}
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      rows={1}
      style={{
        overflow: 'hidden',
        resize: 'none',
        width: '100%'
      }}
      className={className}
    />
  )
}
