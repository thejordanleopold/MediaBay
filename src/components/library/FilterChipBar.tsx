import { FilterChip } from '../shared/FilterChip'
import { type LibraryFilter } from '../../store/libraryStore'

interface FilterChipBarProps {
  activeFilter: LibraryFilter
  onFilter: (filter: LibraryFilter) => void
}

const FILTERS: { id: LibraryFilter; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'video',     label: 'Video'     },
  { id: 'audio',     label: 'Audio'     },
  { id: 'recent',    label: 'Recent'    },
  { id: 'favorites', label: 'Favorites' },
]

export function FilterChipBar({ activeFilter, onFilter }: FilterChipBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Filter library"
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        paddingBottom: '4px',
      }}
    >
      {FILTERS.map(({ id, label }) => (
        <FilterChip
          key={id}
          label={label}
          active={activeFilter === id}
          onClick={() => onFilter(id)}
        />
      ))}
    </div>
  )
}
