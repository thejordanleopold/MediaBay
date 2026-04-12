import { useNavigate } from 'react-router-dom'
import { FilterChipBar } from '../components/library/FilterChipBar'
import { LibraryGrid } from '../components/library/LibraryGrid'
import { useLibraryStore, selectFilteredItems } from '../store/libraryStore'

export function LibraryScreen() {
  const navigate = useNavigate()
  const { activeFilter, setFilter, toggleFavorite, deleteItem } = useLibraryStore()
  const filteredItems = useLibraryStore(selectFilteredItems)

  function handleOpen(id: string) {
    navigate(`/player/${id}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Sticky filter bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'linear-gradient(to bottom, var(--color-surface-1, #0B0F12) 80%, transparent)',
          paddingBottom: '8px',
          marginBottom: '-8px',
        }}
      >
        <FilterChipBar activeFilter={activeFilter} onFilter={setFilter} />
      </div>

      <LibraryGrid
        items={filteredItems}
        onOpen={handleOpen}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteItem}
      />
    </div>
  )
}
