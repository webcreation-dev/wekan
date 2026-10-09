'use client'

import { useState } from 'react'

interface PhoneInputProps {
  value: string
  onChange: (raw: string, formatted: string) => void
  placeholder?: string
  className?: string
  onBlur?: () => void
  showCountryPrefix?: boolean
}

/**
 * Bénin phone input: 10 digits, prefix "01" pre-filled
 * Format: 01 XX XX XX XX (displayed as separate pairs)
 * The "01" prefix is fixed (cannot be deleted)
 */
export default function PhoneInput({
  value,
  onChange,
  placeholder = 'XX XX XX XX',
  className = '',
  onBlur,
  showCountryPrefix = false,
}: PhoneInputProps) {
  // value = raw digits after "01" prefix (8 digits max)
  const [focused, setFocused] = useState(false)

  const formatDisplay = (digits: string) => {
    // digits is the 8-char suffix after "01"
    // Display: 01 XX XX XX XX
    const parts: string[] = []
    const clean = digits.slice(0, 8)
    for (let i = 0; i < clean.length; i += 2) {
      parts.push(clean.slice(i, i + 2))
    }
    return parts.join(' ')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8)
    const formatted = '01' + raw
    onChange(raw, formatted)
  }

  const displayValue = value ? formatDisplay(value) : ''
  const fullNumber = '+229 01 ' + (value ? formatDisplay(value) : '')

  return (
    <div className={`flex items-center gap-0 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden h-[54px] focus-within:border-[#2d7ff9] transition-colors ${className}`}>
      {/* Flag */}
      <div className="flex items-center justify-center px-4 border-r border-[var(--border)] h-full flex-shrink-0 bg-[var(--bg-surface)]">
        <span className="text-[16px]">🇧🇯</span>
        {!showCountryPrefix && <span className="ml-1.5 text-[13px] font-semibold text-[var(--text-secondary)]">+229</span>}
      </div>

      {/* Fixed prefix 01 */}
      <div className="flex items-center px-2 h-full flex-shrink-0">
        <span className="text-[15px] font-bold text-[var(--text-primary)]">
          {showCountryPrefix ? '229 01' : '01'}
        </span>
      </div>

      {/* Input for remaining 8 digits */}
      <input
        type="tel"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur?.() }}
        placeholder={placeholder}
        maxLength={11} // XX XX XX XX = 10 chars with spaces
        className="flex-1 bg-transparent text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none pr-4"
      />
    </div>
  )
}
