import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import '../../styles/app.css'

interface ContentAreaProps {
  children: ReactNode
}

export function ContentArea({ children }: ContentAreaProps) {
  const location = useLocation()

  return (
    <main
      style={{
        gridColumn: '2',
        gridRow: '2',
        overflowY: 'auto',
        padding: '24px',
      }}
    >
      <div
        key={location.key}
        className="page-enter"
      >
        {children}
      </div>
    </main>
  )
}
