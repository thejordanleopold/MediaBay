import { useState } from 'react'
import { UrlInputCard } from '../components/download/UrlInputCard'
import { OptionsDrawer } from '../components/download/OptionsDrawer'
import { QueueList } from '../components/download/QueueList'
import { useDownloadStore, type DownloadOptions } from '../store/downloadStore'

const DEFAULT_OPTIONS: DownloadOptions = {
  format: 'mp4',
  quality: 'best',
  subtitles: false,
  metadata: true,
  outputDir: '~/Downloads',
}

let idCounter = 1

export function DownloadScreen() {
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [options, setOptions] = useState<DownloadOptions>(DEFAULT_OPTIONS)

  const { queue, addToQueue, pauseItem, resumeItem, cancelItem } = useDownloadStore()

  function handleSubmit(url: string) {
    setLoading(true)
    // Simulate async start
    setTimeout(() => {
      addToQueue({
        id: String(idCounter++),
        url,
        title: new URL(url).hostname + ' · ' + url.slice(-20),
        thumbnailUrl: null,
        format: options.format.toUpperCase(),
        fileSize: '',
      })
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Input + Options */}
      <div>
        <UrlInputCard onSubmit={handleSubmit} loading={loading} />
        <OptionsDrawer
          open={drawerOpen}
          options={options}
          onChange={setOptions}
          onClose={() => setDrawerOpen(false)}
        />
        <div style={{ marginTop: '8px' }}>
          <button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              padding: '4px 0',
              fontFamily: 'var(--font-family-base)',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            {drawerOpen ? '▲ Hide options' : '▼ Show options'}
          </button>
        </div>
      </div>

      {/* Queue */}
      <QueueList
        items={queue}
        onPause={pauseItem}
        onResume={resumeItem}
        onCancel={cancelItem}
      />
    </div>
  )
}
