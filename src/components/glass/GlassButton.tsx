import { type ComponentPropsWithoutRef, type ReactNode, useState } from 'react'
import { type LucideIcon, Loader2 } from 'lucide-react'
import '../../styles/app.css'

type ButtonVariant = 'primary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface GlassButtonProps {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconPos?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: ComponentPropsWithoutRef<'button'>['type']
  ariaLabel?: string
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: '32px', padding: '0 10px', fontSize: '13px', minWidth: '36px', minHeight: '36px' },
  md: { height: '40px', padding: '0 14px', fontSize: '14px', minWidth: '36px', minHeight: '40px' },
  lg: { height: '48px', padding: '0 18px', fontSize: '15px', minWidth: '36px', minHeight: '48px' },
}

const iconSize: Record<ButtonSize, number> = { sm: 15, md: 16, lg: 18 }

function getBaseStyle(
  variant: ButtonVariant,
  hovered: boolean,
  pressed: boolean,
  disabled: boolean,
): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    borderRadius: 'var(--glass-border-radius-sm)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background 220ms ease, border-color 220ms ease, color 220ms ease, transform 150ms ease',
    transform: pressed && !disabled ? 'scale(0.99)' : 'scale(1)',
    outline: 'none',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  }

  if (variant === 'primary') {
    return {
      ...base,
      background: hovered && !disabled ? 'var(--glass-bg-hover)' : 'var(--glass-bg)',
      backdropFilter: 'blur(var(--glass-blur))',
      WebkitBackdropFilter: 'blur(var(--glass-blur))',
      borderColor: 'var(--glass-border)',
      color: 'var(--color-text)',
      boxShadow: 'var(--shadow-glass)',
    }
  }

  if (variant === 'ghost') {
    return {
      ...base,
      background: 'transparent',
      borderColor: hovered && !disabled ? 'var(--glass-border)' : 'var(--glass-border-subtle)',
      color: hovered && !disabled ? 'var(--color-text)' : 'var(--color-text-muted)',
    }
  }

  // danger
  return {
    ...base,
    background: hovered && !disabled
      ? 'rgba(255,90,90,0.24)'
      : 'rgba(255,90,90,0.16)',
    borderColor: 'rgba(255,90,90,0.45)',
    color: 'var(--color-danger)',
  }
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPos = 'left',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ariaLabel,
}: GlassButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const isDisabled = disabled || loading
  const style: React.CSSProperties = {
    ...getBaseStyle(variant, hovered, pressed, isDisabled),
    ...sizeStyles[size],
  }

  const iSize = iconSize[size]
  const iconEl = loading
    ? <Loader2 size={iSize} className="spin-1s" aria-hidden="true" />
    : Icon
      ? <Icon size={iSize} aria-hidden="true" />
      : null

  return (
    <button
      type={type}
      style={style}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => !isDisabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      {iconEl && iconPos === 'left' && iconEl}
      {children}
      {iconEl && iconPos === 'right' && iconEl}
    </button>
  )
}
