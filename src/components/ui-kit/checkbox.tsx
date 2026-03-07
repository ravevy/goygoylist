import React from 'react'

type CheckboxProps = {
  id: string
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  dark?: boolean
  className?: string
}

export const Checkbox = ({
  id,
  label,
  checked = false,
  onChange,
  dark = false,
  className = ''
}: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 text-xs ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        className={`nes-checkbox ${dark ? 'is-dark' : ''}`}
        checked={checked}
        onChange={handleChange}
      />
      {label && <span>{label}</span>}
    </label>
  )
}
