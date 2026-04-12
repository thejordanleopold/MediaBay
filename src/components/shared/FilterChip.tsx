import { useState } from 'react'

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  const [hovered, setHovered] = useState(false)

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    height: '32px',
    padding: '6px 16px',
    borderRadius: '16px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: active ? 500 : 400,
    cursor: 'pointer',
    transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
    fontFamily: 'var(--font-family-base)',
    outline: 'none',
    background: active
      ? 'rgba(255,122,60,0.20)'
      : hovered
        ? 'rgba(255,255,255,0.10)'
        : 'rgba(255,255,255,0.06)',
    borderColor: active
      ? 'rgba(255,122,60,0.55)'
      : hovered
        ? 'rgba(255,255,255,0.22)'
        : 'rgba(255,255,255,0.12)',
    color: active
      ? 'var(--color-primary)'
      : hovered
        ? 'var(--color-text)'
        : 'var(--color-text-muted)',
  }

  return (
    <button
      type="button"
      style={style}
      onClick={onClick}
      aria-pressed={active}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  )
}
