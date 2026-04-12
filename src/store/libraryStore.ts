import { create } from 'zustand'

export type LibraryFilter = 'all' | 'video' | 'audio' | 'recent' | 'favorites'

export interface LibraryItemData {
  id: string
  title: string
  thumbnailUrl: string | null
  duration: string
  format: string
  fileSize: string
  addedDate: string
  isFavorite: boolean
}

interface LibraryState {
  items: LibraryItemData[]
  activeFilter: LibraryFilter
  setFilter: (filter: LibraryFilter) => void
  toggleFavorite: (id: string) => void
  deleteItem: (id: string) => void
}

const VIDEO_FORMATS = new Set(['mp4', 'webm', 'mkv', 'mov', 'avi'])
const AUDIO_FORMATS = new Set(['mp3', 'wav', 'aac', 'flac', 'm4a'])

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export function selectFilteredItems(state: LibraryState): LibraryItemData[] {
  const { items, activeFilter } = state
  const now = Date.now()

  switch (activeFilter) {
    case 'video':
      return items.filter((i) => VIDEO_FORMATS.has(i.format.toLowerCase()))
    case 'audio':
      return items.filter((i) => AUDIO_FORMATS.has(i.format.toLowerCase()))
    case 'recent':
      return items.filter((i) => now - new Date(i.addedDate).getTime() < SEVEN_DAYS_MS)
    case 'favorites':
      return items.filter((i) => i.isFavorite)
    default:
      return items
  }
}

export const useLibraryStore = create<LibraryState>()((set) => ({
  items: [],
  activeFilter: 'all',

  setFilter: (filter) => set({ activeFilter: filter }),

  toggleFavorite: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}))
