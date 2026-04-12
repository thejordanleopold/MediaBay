import { Film, Pause, Play, X } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import { GlassButton } from '../glass/GlassButton'
import { ProgressBar } from '../shared/ProgressBar'
import { StatusBadge } from '../shared/StatusBadge'
import type { QueueItemData } from '../../store/downloadStore'

interface QueueItemProps {
  item: QueueItemData
  onPause: (id: string) => void
  onResume: (id: string) => void
  onCancel: (id: string) => void
}

export function QueueItem({ item, onPause, onResume, onCancel }: QueueItemProps) {
  const showProgress = item.status === 'downloading' || item.status === 'paused'
  const showSpeed = item.status === 'downloading'

  return (
    <GlassCard variant="secondary">
      <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', padding: '12px' }}>
        {/* Thumbnail */}
        <div
          style={{
            width: '72px',
            height: '48px',
            borderRadius: '6px',
            flexShrink: 0,
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
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Film size={20} aria-hidden="true" style={{ color: 'var(--color-text-muted)' }} />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <StatusBadge status={item.status} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              {item.format}
            </span>
            {item.fileSize && (
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {item.fileSize}
              </span>
            )}
          </div>

          {showProgress && (
            <ProgressBar
              value={item.progress}
              height={4}
              animated={item.status === 'downloading'}
            />
          )}

          {showSpeed && (
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {item.speed} · ETA {item.eta}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          {item.status === 'downloading' && (
            <GlassButton
              variant="ghost"
              size="sm"
              icon={Pause}
              onClick={() => onPause(item.id)}
              ariaLabel="Pause download"
            />
          )}
          {item.status === 'paused' && (
            <GlassButton
              variant="ghost"
              size="sm"
              icon={Play}
              onClick={() => onResume(item.id)}
              ariaLabel="Resume download"
            />
          )}
          <GlassButton
            variant="ghost"
            size="sm"
            icon={X}
            onClick={() => onCancel(item.id)}
            ariaLabel="Cancel download"
          />
        </div>
      </div>
    </GlassCard>
  )
}
