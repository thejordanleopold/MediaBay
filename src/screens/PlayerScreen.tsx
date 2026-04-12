import { useNavigate } from 'react-router-dom'
import { PlayerPanel } from '../components/player/PlayerPanel'
import { TimelineEditor } from '../components/player/TimelineEditor'
import { TranscriptPanel } from '../components/player/TranscriptPanel'
import { usePlayerStore } from '../store/playerStore'

export function PlayerScreen() {
  const navigate = useNavigate()
  const { currentItem, currentMs, markers, seek, addMarker } = usePlayerStore()

  if (!currentItem) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
          flexDirection: 'column',
          gap: '16px',
          color: 'var(--color-text-muted)',
        }}
      >
        <p style={{ fontSize: '15px' }}>No media selected</p>
        <button
          type="button"
          onClick={() => navigate('/library')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'var(--font-family-base)',
            textDecoration: 'underline',
          }}
        >
          Open Library
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}>
      {/* Left column */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
        <PlayerPanel
          src={currentItem.src}
          title={currentItem.title}
          onClose={() => navigate(-1)}
          onTimeUpdate={seek}
        />
        <TimelineEditor
          durationMs={0}
          currentMs={currentMs}
          markers={markers}
          onSeek={seek}
          onAddMarker={addMarker}
        />
      </div>

      {/* Right column — transcript */}
      <div style={{ flex: 1, maxWidth: '340px' }}>
        <TranscriptPanel
          lines={[]}
          currentMs={currentMs}
          onSeek={seek}
        />
      </div>
    </div>
  )
}
