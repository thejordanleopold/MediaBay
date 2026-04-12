import '../../styles/app.css'

type ProgressVariant = 'primary' | 'success' | 'warning'

interface ProgressBarProps {
  value: number
  variant?: ProgressVariant
  height?: number
  animated?: boolean
}

const fillGradient: Record<ProgressVariant, string> = {
  primary: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%)',
  success: 'linear-gradient(90deg, var(--color-success) 0%, var(--color-success) 100%)',
  warning: 'linear-gradient(90deg, var(--color-warning) 0%, var(--color-warning) 100%)',
}

export function ProgressBar({
  value,
  variant = 'primary',
  height = 4,
  animated = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))
  const showShimmer = animated && clampedValue < 100

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        width: '100%',
        height: `${height}px`,
        borderRadius: '2px',
        background: 'rgba(255,255,255,0.10)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className={showShimmer ? 'progress-shimmer' : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          right: `${100 - clampedValue}%`,
          background: fillGradient[variant],
          borderRadius: '2px',
          transition: 'right 220ms ease',
        }}
      />
    </div>
  )
}
