import { useRef, useEffect, useState } from 'react'
import { GlassCard } from '../glass/GlassCard'
import type { TranscriptLine } from '../../store/playerStore'

function formatTimestamp(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

interface TranscriptPanelProps {
  lines: TranscriptLine[]
  currentMs: number
  onSeek: (ms: number) => void
}

export function TranscriptPanel({ lines, currentMs, onSeek }: TranscriptPanelProps) {
  const activeRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Auto-scroll active line into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentMs])

  return (
    <GlassCard variant="secondary">
      <div style={{ padding: '12px 0', maxHeight: '320px', overflowY: 'auto' }}>
        {lines.length === 0 ? (
          <p style={{ padding: '16px', fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
            No transcript available
          </p>
        ) : (
          lines.map((line) => {
            const isActive = currentMs >= line.startMs && currentMs < line.endMs
            const isHovered = hoveredId === line.id

            return (
              <div
                key={line.id}
                ref={isActive ? activeRef : undefined}
                role="button"
                tabIndex={0}
                onClick={() => onSeek(line.startMs)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSeek(line.startMs)
                }}
                onMouseEnter={() => setHoveredId(line.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  margin: '0 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '0',
                  alignItems: 'flex-start',
                  borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  background: isActive
                    ? 'rgba(255,122,60,0.16)'
                    : isHovered
                      ? 'rgba(255,255,255,0.06)'
                      : 'transparent',
                  transition: 'background 150ms ease',
                  outline: 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    marginRight: '8px',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {formatTimestamp(line.startMs)}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                    transition: 'color 150ms ease',
                    lineHeight: '20px',
                  }}
                >
                  {line.text}
                </span>
              </div>
            )
          })
        )}
      </div>
    </GlassCard>
  )
}
