import { useState, useEffect, useRef } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen, type UnlistenFn } from '@tauri-apps/api/event'
import { UrlInputCard } from '../components/download/UrlInputCard'
import { OptionsDrawer } from '../components/download/OptionsDrawer'
import { QueueList } from '../components/download/QueueList'
import { useDownloadStore, type DownloadOptions, type ProgressEvent } from '../store/downloadStore'

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

  const { queue, addToQueue, pauseItem, resumeItem, cancelItem, applyProgressEvent } =
    useDownloadStore()

  // Keep a stable ref to applyProgressEvent so the listener closure doesn't stale
  const applyRef = useRef(applyProgressEvent)
  useEffect(() => { applyRef.current = applyProgressEvent }, [applyProgressEvent])

  // Set up / tear down the Tauri event listener once
  useEffect(() => {
    let unlisten: UnlistenFn | undefined

    listen<ProgressEvent>('download-progress', (event) => {
      applyRef.current(event.payload)
    }).then((fn) => { unlisten = fn })

    return () => { unlisten?.() }
  }, [])

  async function handleSubmit(url: string) {
    setLoading(true)

    let hostname = url
    try { hostname = new URL(url).hostname } catch { /* keep raw url */ }

    const id = String(idCounter++)

    addToQueue({
      id,
      url,
      title: hostname,
      thumbnailUrl: null,
      format: options.format.toUpperCase(),
      fileSize: '',
    })

    setLoading(false)

    // Fire-and-forget — progress comes back via the 'download-progress' event
    await invoke('start_download', {
      id,
      url,
      format: options.format,
      quality: options.quality,
      outputDir: options.outputDir,
      subtitles: options.subtitles,
      metadata: options.metadata,
    }).catch((err: unknown) => {
      console.error('start_download error:', err)
    })
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
