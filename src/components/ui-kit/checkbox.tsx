import React, { useState } from 'react'
import { Spinner } from './spinner'

type CheckboxProps = {
  id: string
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => Promise<void> | void
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
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked
    setLoading(true)
    try {
      await onChange?.(newChecked)
    } finally {
      setLoading(false)
    }
  }

  return (
    <label
      htmlFor={id}
      className={`flex flex-row items-center text-xs ${className}`}
    >
      {loading ? (
        <Spinner
          className="mr-[11.5px] ml-[5.5px] inline-block size-3"
          variant="diamond"
        />
      ) : (
        <input
          id={id}
          type="checkbox"
          className={`nes-checkbox ${dark ? 'is-dark' : ''}`}
          checked={checked}
          onChange={handleChange}
        />
      )}
      {label && <span className="leading-5">{label}</span>}
    </label>
  )
}
