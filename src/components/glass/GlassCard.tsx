import { type ReactNode, useState } from 'react'

interface GlassCardProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  glow?: boolean
  className?: string
  onClick?: () => void
}

export function GlassCard({
  children,
  variant = 'primary',
  glow = false,
  className = '',
  onClick,
}: GlassCardProps) {
  const [pressed, setPressed] = useState(false)
  const isClickable = Boolean(onClick)
  const glassClass = variant === 'primary' ? 'glass' : 'glass-secondary'

  const style: React.CSSProperties = {}

  if (glow) {
    style.boxShadow = 'var(--shadow-glass), var(--shadow-glow)'
  }

  if (isClickable) {
    style.transition = 'transform 150ms ease'
    style.transform = pressed ? 'scale(0.99)' : 'scale(1)'
  }

  return (
    <div
      className={`${glassClass}${isClickable ? ' cursor-pointer' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onMouseDown={isClickable ? () => setPressed(true) : undefined}
      onMouseUp={isClickable ? () => setPressed(false) : undefined}
      onMouseLeave={isClickable ? () => setPressed(false) : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick?.()
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}
