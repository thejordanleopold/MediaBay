import { Menu, Settings } from 'lucide-react'
import { GlassButton } from '../glass/GlassButton'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <header
      role="banner"
      data-tauri-drag-region
      style={{
        gridColumn: '1 / -1',
        gridRow: '1',
        height: 'var(--top-bar-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid var(--glass-border-subtle)',
        zIndex: 20,
      }}
    >
      {/* Left — menu toggle (no drag region) */}
      <div data-tauri-drag-region={undefined}>
        <GlassButton
          variant="ghost"
          size="sm"
          icon={Menu}
          onClick={onMenuToggle}
          ariaLabel="Toggle navigation"
        />
      </div>

      {/* Center — wordmark (drag region) */}
      <span
        data-tauri-drag-region
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--color-primary)',
          letterSpacing: '-0.01em',
          pointerEvents: 'none',
        }}
      >
        MediaBay
      </span>

      {/* Right — settings (no drag region) */}
      <div data-tauri-drag-region={undefined}>
        <GlassButton
          variant="ghost"
          size="sm"
          icon={Settings}
          ariaLabel="Open settings"
        />
      </div>
    </header>
  )
}
