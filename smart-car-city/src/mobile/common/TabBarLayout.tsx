import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { Home, Car, LayoutGrid, User } from 'lucide-react'

const tabs = [
  { key: '/home', title: '首页', icon: Home },
  { key: '/vehicle-source', title: '车源', icon: Car },
  { key: '/dealer', title: '代经销', icon: LayoutGrid },
  { key: '/profile', title: '我的', icon: User },
]

export default function TabBarLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const activeKey = tabs.find((t) => pathname.startsWith(t.key))?.key || '/home'

  return (
    <div style={{ minHeight: '100vh', maxWidth: 430, margin: '0 auto' }}>
      <Outlet />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 100,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(0,0,0,0.08)',
        display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {tabs.map((tab) => {
          const active = activeKey === tab.key
          const Icon = tab.icon
          return (
            <div key={tab.key} onClick={() => navigate(tab.key)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 0 6px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? 'var(--brand-bg-strong)' : 'transparent', transition: 'all 0.2s',
              }}>
                <Icon size={20} color={active ? 'var(--brand)' : '#999'} strokeWidth={active ? 2.2 : 1.5} />
              </div>
              <span style={{ fontSize: 10, marginTop: 2, fontWeight: active ? 600 : 400, color: active ? 'var(--brand)' : '#999', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}>{tab.title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
