import { useState, type FormEvent } from 'react'
import { Download } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import { GlassButton } from '../glass/GlassButton'

interface UrlInputCardProps {
  onSubmit: (url: string) => void
  loading: boolean
}

export function UrlInputCard({ onSubmit, loading }: UrlInputCardProps) {
  const [url, setUrl] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (trimmed) {
      onSubmit(trimmed)
      setUrl('')
    }
  }

  return (
    <GlassCard variant="primary" glow>
      <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            aria-label="Media URL"
            style={{
              flex: 1,
              height: '48px',
              background: 'rgba(0,0,0,0.32)',
              border: '1px solid var(--glass-border-subtle)',
              borderRadius: '10px',
              color: 'var(--color-text)',
              fontSize: '15px',
              padding: '0 14px',
              outline: 'none',
              fontFamily: 'var(--font-family-base)',
              transition: 'border-color 150ms ease, box-shadow 150ms ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--glass-border)'
              e.target.style.boxShadow = '0 0 0 3px rgba(255,122,60,0.20)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--glass-border-subtle)'
              e.target.style.boxShadow = 'none'
            }}
          />
          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            icon={Download}
            loading={loading}
            disabled={!url.trim()}
            ariaLabel="Start download"
          >
            Download
          </GlassButton>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          Paste URL or drag a link here
        </span>
      </form>
    </GlassCard>
  )
}
