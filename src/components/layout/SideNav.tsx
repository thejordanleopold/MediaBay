import { type LucideIcon } from 'lucide-react'

export interface NavItem {
  id: 'download' | 'library' | 'player' | 'settings' | 'about'
  label: string
  icon: LucideIcon
  href: string
}

interface SideNavProps {
  items: NavItem[]
  activeId: NavItem['id'] | null
  collapsed: boolean
  onNavigate: (href: string) => void
}

export function SideNav({ items, activeId, collapsed, onNavigate }: SideNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        gridColumn: '1',
        gridRow: '2',
        width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        transition: 'width 220ms ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 10px',
        gap: '4px',
        background: 'var(--glass-bg-secondary)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--glass-border-subtle)',
      }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId
        const Icon = item.icon

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.href)}
            aria-label={collapsed ? item.label : undefined}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              height: '44px',
              minWidth: '44px',
              paddingLeft: collapsed ? '0' : '22px',
              paddingRight: '12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: '10px',
              border: 'none',
              borderLeft: isActive && !collapsed ? '3px solid var(--color-primary)' : '3px solid transparent',
              background: isActive ? 'rgba(255,122,60,0.20)' : 'transparent',
              color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              transition: 'background 220ms ease, color 220ms ease, border-color 220ms ease',
              fontFamily: 'var(--font-family-base)',
              fontSize: '14px',
              fontWeight: isActive ? 500 : 400,
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                const btn = e.currentTarget
                btn.style.background = 'rgba(255,255,255,0.06)'
                btn.style.color = 'var(--color-text)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                const btn = e.currentTarget
                btn.style.background = 'transparent'
                btn.style.color = 'var(--color-text-muted)'
              }
            }}
          >
            <Icon size={20} aria-hidden="true" style={{ flexShrink: 0 }} />
            {!collapsed && (
              <span
                style={{
                  overflow: 'hidden',
                  opacity: collapsed ? 0 : 1,
                  transition: 'opacity 220ms ease',
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
