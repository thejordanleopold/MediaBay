import { Download } from 'lucide-react'
import { QueueItem } from './QueueItem'
import type { QueueItemData } from '../../store/downloadStore'

interface QueueListProps {
  items: QueueItemData[]
  onPause: (id: string) => void
  onResume: (id: string) => void
  onCancel: (id: string) => void
}

export function QueueList({ items, onPause, onResume, onCancel }: QueueListProps) {
  if (items.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '48px 24px',
          color: 'var(--color-text-muted)',
        }}
      >
        <Download size={48} aria-hidden="true" />
        <span style={{ fontSize: '15px' }}>No downloads yet</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((item) => (
        <QueueItem
          key={item.id}
          item={item}
          onPause={onPause}
          onResume={onResume}
          onCancel={onCancel}
        />
      ))}
    </div>
  )
}
