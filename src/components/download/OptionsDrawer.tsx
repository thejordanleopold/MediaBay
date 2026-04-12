import { ToggleLeft, ToggleRight, FolderOpen } from 'lucide-react'
import type { DownloadOptions } from '../../store/downloadStore'

interface OptionsDrawerProps {
  open: boolean
  options: DownloadOptions
  onChange: (options: DownloadOptions) => void
  onClose: () => void
}

const selectStyle: React.CSSProperties = {
  height: '36px',
  background: 'rgba(0,0,0,0.32)',
  border: '1px solid var(--glass-border-subtle)',
  borderRadius: '8px',
  color: 'var(--color-text)',
  fontSize: '13px',
  padding: '0 10px',
  fontFamily: 'var(--font-family-base)',
  cursor: 'pointer',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--color-text-muted)',
  marginBottom: '6px',
  display: 'block',
}

export function OptionsDrawer({ open, options, onChange }: OptionsDrawerProps) {
  if (!open) return null

  return (
    <div
      style={{
        background: 'var(--glass-bg-secondary)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--glass-border-subtle)',
        borderTop: 'none',
        borderRadius: '0 0 16px 16px',
        padding: '16px 20px 20px',
        transition: 'opacity 220ms ease',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        {/* Format */}
        <div>
          <label htmlFor="opt-format" style={labelStyle}>Format</label>
          <select
            id="opt-format"
            style={{ ...selectStyle, width: '100%' }}
            value={options.format}
            onChange={(e) =>
              onChange({ ...options, format: e.target.value as DownloadOptions['format'] })
            }
          >
            <option value="mp4">MP4 (video)</option>
            <option value="mp3">MP3 (audio)</option>
            <option value="webm">WebM</option>
            <option value="wav">WAV (audio)</option>
          </select>
        </div>

        {/* Quality */}
        <div>
          <label htmlFor="opt-quality" style={labelStyle}>Quality</label>
          <select
            id="opt-quality"
            style={{ ...selectStyle, width: '100%' }}
            value={options.quality}
            onChange={(e) =>
              onChange({ ...options, quality: e.target.value as DownloadOptions['quality'] })
            }
          >
            <option value="best">Best available</option>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="480p">480p</option>
          </select>
        </div>

        {/* Subtitles toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onChange({ ...options, subtitles: !options.subtitles })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: options.subtitles ? 'var(--color-primary)' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              minWidth: '36px',
              minHeight: '36px',
              justifyContent: 'center',
            }}
            aria-label={options.subtitles ? 'Disable subtitles' : 'Enable subtitles'}
          >
            {options.subtitles ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
          </button>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Subtitles</span>
        </div>

        {/* Metadata toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => onChange({ ...options, metadata: !options.metadata })}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: options.metadata ? 'var(--color-primary)' : 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              minWidth: '36px',
              minHeight: '36px',
              justifyContent: 'center',
            }}
            aria-label={options.metadata ? 'Disable metadata embedding' : 'Enable metadata embedding'}
          >
            {options.metadata ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
          </button>
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Embed metadata</span>
        </div>

        {/* Output directory */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="opt-outdir" style={labelStyle}>Output folder</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="opt-outdir"
              type="text"
              value={options.outputDir}
              readOnly
              style={{ ...selectStyle, flex: 1, cursor: 'default' }}
              aria-label="Output directory path"
            />
            <button
              type="button"
              style={{
                ...selectStyle,
                width: '36px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                minWidth: '36px',
              }}
              aria-label="Browse output folder"
            >
              <FolderOpen size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
