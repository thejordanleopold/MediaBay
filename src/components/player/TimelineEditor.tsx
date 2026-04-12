import { useRef, useCallback } from 'react'
import { GlassCard } from '../glass/GlassCard'
import type { TimelineMarker } from '../../store/playerStore'

interface TimelineEditorProps {
  durationMs: number
  currentMs: number
  markers: TimelineMarker[]
  onSeek: (ms: number) => void
  onAddMarker: (marker: TimelineMarker) => void
}

const WAVEFORM_BARS = 60

function buildWaveform(): number[] {
  return Array.from({ length: WAVEFORM_BARS }, (_, i) => {
    return 30 + Math.abs(Math.sin(i * 0.45) * 55 + Math.cos(i * 0.3) * 25)
  })
}

const waveformHeights = buildWaveform()

let markerCounter = 1

export function TimelineEditor({
  durationMs,
  currentMs,
  markers,
  onSeek,
  onAddMarker,
}: TimelineEditorProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const posFromMs = useCallback(
    (ms: number) => (durationMs > 0 ? (ms / durationMs) * 100 : 0),
    [durationMs],
  )

  const msFromClientX = useCallback((clientX: number): number => {
    const track = trackRef.current
    if (!track || durationMs === 0) return 0
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return Math.floor(ratio * durationMs)
  }, [durationMs])

  function handleTrackMouseDown(e: React.MouseEvent) {
    dragging.current = true
    onSeek(msFromClientX(e.clientX))

    const handleMove = (ev: MouseEvent) => {
      if (dragging.current) onSeek(msFromClientX(ev.clientX))
    }
    const handleUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }

  function handleDoubleClick(e: React.MouseEvent) {
    const ms = msFromClientX(e.clientX)
    onAddMarker({
      id: String(markerCounter++),
      positionMs: ms,
      color: 'var(--color-primary)',
    })
  }

  return (
    <GlassCard variant="secondary">
      <div style={{ padding: '16px 20px' }}>
        <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Timeline — double-click to add marker
        </p>

        {/* Track */}
        <div
          ref={trackRef}
          role="slider"
          aria-label="Playback position"
          aria-valuenow={currentMs}
          aria-valuemin={0}
          aria-valuemax={durationMs}
          tabIndex={0}
          onMouseDown={handleTrackMouseDown}
          onDoubleClick={handleDoubleClick}
          onKeyDown={(e) => {
            const step = durationMs * 0.02
            if (e.key === 'ArrowRight') onSeek(Math.min(durationMs, currentMs + step))
            if (e.key === 'ArrowLeft')  onSeek(Math.max(0, currentMs - step))
          }}
          style={{
            position: 'relative',
            width: '100%',
            height: '40px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '6px',
            cursor: 'pointer',
            overflow: 'visible',
            userSelect: 'none',
          }}
        >
          {/* Waveform placeholder */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '1px',
              padding: '0 4px',
            }}
          >
            {waveformHeights.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  maxHeight: '32px',
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>

          {/* Playhead */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${posFromMs(currentMs)}%`,
              width: '2px',
              background: 'var(--color-primary)',
              transform: 'translateX(-1px)',
              pointerEvents: 'none',
              zIndex: 3,
            }}
          />

          {/* Markers */}
          {markers.map((m) => (
            <div
              key={m.id}
              title={m.label}
              aria-label={m.label ? `Marker: ${m.label}` : 'Marker'}
              style={{
                position: 'absolute',
                top: 0,
                left: `${posFromMs(m.positionMs)}%`,
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `8px solid ${m.color ?? 'var(--color-primary)'}`,
                zIndex: 2,
              }}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
