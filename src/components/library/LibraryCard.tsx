import { useState } from 'react'
import { Heart, Trash2, Film } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import { GlassBadge } from '../glass/GlassBadge'
import { GlassButton } from '../glass/GlassButton'
import type { LibraryItemData } from '../../store/libraryStore'

interface LibraryCardProps {
  item: LibraryItemData
  onOpen: (id: string) => void
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export function LibraryCard({ item, onOpen, onToggleFavorite, onDelete }: LibraryCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <GlassCard
      variant="secondary"
      onClick={() => onOpen(item.id)}
      className="overflow-hidden"
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            borderRadius: '10px 10px 0 0',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl}
              alt={`Thumbnail for ${item.title}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Film size={32} aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
          )}

          {/* Duration badge — top right */}
          {item.duration && (
            <div
              style={{ position: 'absolute', top: '8px', right: '8px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassBadge label={item.duration} variant="neutral" />
            </div>
          )}

          {/* Favorite — top left */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id) }}
            aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              minWidth: '36px',
              minHeight: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.isFavorite ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color 150ms ease',
            }}
          >
            <Heart
              size={18}
              aria-hidden="true"
              style={{ fill: item.isFavorite ? 'var(--color-primary)' : 'none' }}
            />
          </button>

          {/* Delete — visible on hover */}
          {hovered && (
            <div
              style={{ position: 'absolute', bottom: '8px', right: '8px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassButton
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={() => onDelete(item.id)}
                ariaLabel={`Delete ${item.title}`}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.title}
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {item.format} · {item.fileSize}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {item.addedDate}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
