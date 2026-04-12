import { FolderOpen } from 'lucide-react'
import { LibraryCard } from './LibraryCard'
import type { LibraryItemData } from '../../store/libraryStore'

interface LibraryGridProps {
  items: LibraryItemData[]
  onOpen: (id: string) => void
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export function LibraryGrid({ items, onOpen, onToggleFavorite, onDelete }: LibraryGridProps) {
  if (items.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '80px 24px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        <FolderOpen size={64} aria-hidden="true" />
        <div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 8px' }}>
            Your library is empty
          </p>
          <p style={{ fontSize: '14px', margin: 0 }}>
            Downloaded files will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
      }}
    >
      {items.map((item) => (
        <LibraryCard
          key={item.id}
          item={item}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
