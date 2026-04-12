import { useRef, useEffect, useState } from 'react'
import { Play, Pause, Maximize2, X } from 'lucide-react'
import { GlassCard } from '../glass/GlassCard'
import { GlassButton } from '../glass/GlassButton'

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

interface PlayerPanelProps {
  src: string
  title: string
  onClose: () => void
  onTimeUpdate?: (ms: number) => void
}

export function PlayerPanel({ src, title, onClose, onTimeUpdate }: PlayerPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMs, setCurrentMs] = useState(0)
  const [durationMs, setDurationMs] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => {
      const ms = Math.floor(video.currentTime * 1000)
      setCurrentMs(ms)
    }
    const onDurationChange = () => setDurationMs(Math.floor(video.duration * 1000))

    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('durationchange', onDurationChange)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('durationchange', onDurationChange)
    }
  }, [])

  useEffect(() => {
    onTimeUpdate?.(currentMs)
  }, [currentMs, onTimeUpdate])

  function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) video.pause()
    else void video.play()
  }

  function handleFullscreen() {
    void videoRef.current?.requestFullscreen()
  }

  return (
    <GlassCard variant="primary" glow>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Video */}
        <video
          ref={videoRef}
          src={src}
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: '#000',
            borderRadius: '10px 10px 0 0',
            display: 'block',
          }}
          aria-label={title}
        />

        {/* Controls */}
        <div
          className="glass-secondary"
          style={{
            height: '52px',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderRadius: '0 0 var(--glass-border-radius) var(--glass-border-radius)',
          }}
        >
          {/* Play/Pause */}
          <GlassButton
            variant="ghost"
            size="md"
            icon={isPlaying ? Pause : Play}
            onClick={togglePlay}
            ariaLabel={isPlaying ? 'Pause' : 'Play'}
          />

          {/* Timestamp */}
          <span
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              fontVariantNumeric: 'tabular-nums',
              flex: 1,
            }}
          >
            {formatTime(currentMs)} / {formatTime(durationMs)}
          </span>

          {/* Right controls */}
          <GlassButton
            variant="ghost"
            size="md"
            icon={Maximize2}
            onClick={handleFullscreen}
            ariaLabel="Enter fullscreen"
          />
          <GlassButton
            variant="ghost"
            size="md"
            icon={X}
            onClick={onClose}
            ariaLabel="Close player"
          />
        </div>
      </div>
    </GlassCard>
  )
}
