import { Clock, ArrowDown, Pause, CheckCircle, AlertCircle, type LucideIcon } from 'lucide-react'
import { GlassBadge } from '../glass/GlassBadge'
import type { DownloadStatus } from '../../store/downloadStore'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

interface StatusConfig {
  icon: LucideIcon
  label: string
  variant: BadgeVariant
}

const STATUS_CONFIG: Record<DownloadStatus, StatusConfig> = {
  queued:      { icon: Clock,        label: 'Queued',      variant: 'neutral'  },
  downloading: { icon: ArrowDown,    label: 'Downloading', variant: 'warning'  },
  paused:      { icon: Pause,        label: 'Paused',      variant: 'neutral'  },
  complete:    { icon: CheckCircle,  label: 'Complete',    variant: 'success'  },
  error:       { icon: AlertCircle,  label: 'Error',       variant: 'danger'   },
}

interface StatusBadgeProps {
  status: DownloadStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { icon: Icon, label, variant } = STATUS_CONFIG[status]

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Icon size={12} aria-hidden="true" />
      <GlassBadge label={label} variant={variant} />
    </span>
  )
}
