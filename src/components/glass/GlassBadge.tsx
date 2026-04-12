type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

interface GlassBadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: {
    background: 'rgba(55,211,156,0.16)',
    borderColor: 'rgba(55,211,156,0.45)',
    color: 'var(--color-success)',
  },
  warning: {
    background: 'rgba(255,204,77,0.16)',
    borderColor: 'rgba(255,204,77,0.45)',
    color: 'var(--color-warning)',
  },
  danger: {
    background: 'rgba(255,90,90,0.16)',
    borderColor: 'rgba(255,90,90,0.45)',
    color: 'var(--color-danger)',
  },
  neutral: {
    background: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.18)',
    color: 'var(--color-text-muted)',
  },
}

export function GlassBadge({ label, variant = 'neutral' }: GlassBadgeProps) {
  const vs = variantStyles[variant]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '22px',
        padding: '2px 10px',
        borderRadius: '11px',
        fontSize: '11px',
        fontWeight: 500,
        border: '1px solid',
        lineHeight: 1,
        ...vs,
      }}
    >
      {label}
    </span>
  )
}
