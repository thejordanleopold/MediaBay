import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Download, Library, Play, Settings, Info } from 'lucide-react'
import { TopBar } from './components/layout/TopBar'
import { SideNav, type NavItem } from './components/layout/SideNav'
import { ContentArea } from './components/layout/ContentArea'
import { DownloadScreen } from './screens/DownloadScreen'
import { LibraryScreen } from './screens/LibraryScreen'
import { PlayerScreen } from './screens/PlayerScreen'
import './App.css'

const NAV_ITEMS: NavItem[] = [
  { id: 'download', label: 'Download', icon: Download, href: '/download' },
  { id: 'library',  label: 'Library',  icon: Library,  href: '/library'  },
  { id: 'player',   label: 'Player',   icon: Play,     href: '/player'   },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'about',    label: 'About',    icon: Info,     href: '/about'    },
]

function routeToNavId(pathname: string): NavItem['id'] | null {
  const entry = NAV_ITEMS.find((item) => pathname.startsWith(item.href))
  return entry ? entry.id : null
}

function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const activeId = routeToNavId(location.pathname)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'var(--top-bar-height) 1fr',
        gridTemplateColumns: collapsed
          ? 'var(--sidebar-collapsed) 1fr'
          : 'var(--sidebar-width) 1fr',
        transition: 'grid-template-columns 220ms ease',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <TopBar onMenuToggle={() => setCollapsed((c) => !c)} />
      <SideNav
        items={NAV_ITEMS}
        activeId={activeId}
        collapsed={collapsed}
        onNavigate={(href) => navigate(href)}
      />
      <ContentArea>
        <Routes>
          <Route path="/" element={<Navigate to="/download" replace />} />
          <Route path="/download" element={<DownloadScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/player" element={<PlayerScreen />} />
          <Route path="/player/:id" element={<PlayerScreen />} />
          <Route path="*" element={<Navigate to="/download" replace />} />
        </Routes>
      </ContentArea>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

export default App
