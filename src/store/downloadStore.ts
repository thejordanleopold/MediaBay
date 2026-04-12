import { create } from 'zustand'

export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'complete' | 'error'

export interface QueueItemData {
  id: string
  url: string
  title: string
  thumbnailUrl: string | null
  status: DownloadStatus
  progress: number
  speed: string
  eta: string
  format: string
  fileSize: string
}

export interface DownloadOptions {
  format: 'mp4' | 'mp3' | 'webm' | 'wav'
  quality: '1080p' | '720p' | '480p' | 'best'
  subtitles: boolean
  metadata: boolean
  outputDir: string
}

interface DownloadState {
  queue: QueueItemData[]
  addToQueue: (item: Omit<QueueItemData, 'status' | 'progress' | 'speed' | 'eta'>) => void
  pauseItem: (id: string) => void
  resumeItem: (id: string) => void
  cancelItem: (id: string) => void
  updateProgress: (id: string, progress: number, speed: string, eta: string) => void
}

export const useDownloadStore = create<DownloadState>()((set) => ({
  queue: [],

  addToQueue: (item) =>
    set((state) => ({
      queue: [
        ...state.queue,
        { ...item, status: 'queued', progress: 0, speed: '', eta: '' },
      ],
    })),

  pauseItem: (id) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id && item.status === 'downloading'
          ? { ...item, status: 'paused' }
          : item,
      ),
    })),

  resumeItem: (id) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id && item.status === 'paused'
          ? { ...item, status: 'downloading' }
          : item,
      ),
    })),

  cancelItem: (id) =>
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
    })),

  updateProgress: (id, progress, speed, eta) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id
          ? {
              ...item,
              progress,
              speed,
              eta,
              status: progress >= 100 ? 'complete' : item.status,
            }
          : item,
      ),
    })),
}))
