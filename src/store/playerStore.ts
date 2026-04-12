import { create } from 'zustand'

export interface PlayerItem {
  id: string
  src: string
  title: string
}

export interface TimelineMarker {
  id: string
  positionMs: number
  color?: string
  label?: string
}

export interface TranscriptLine {
  id: string
  startMs: number
  endMs: number
  text: string
}

interface PlayerState {
  currentItem: PlayerItem | null
  isPlaying: boolean
  currentMs: number
  markers: TimelineMarker[]
  openItem: (item: PlayerItem) => void
  play: () => void
  pause: () => void
  seek: (ms: number) => void
  addMarker: (marker: TimelineMarker) => void
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  currentItem: null,
  isPlaying: false,
  currentMs: 0,
  markers: [],

  openItem: (item) => set({ currentItem: item, isPlaying: false, currentMs: 0 }),
  play:  () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  seek:  (ms) => set({ currentMs: ms }),
  addMarker: (marker) =>
    set((state) => ({ markers: [...state.markers, marker] })),
}))
