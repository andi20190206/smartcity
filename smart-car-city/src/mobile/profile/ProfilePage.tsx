import { useNavigate } from 'react-router-dom'
import { Bell, CreditCard, FileText, Settings, ChevronRight, LogOut, Wallet, Package, Clock } from 'lucide-react'

const menus = [
  { label: '消息通知', icon: Bell, badge: 3, color: '#FF3B30', bg: 'rgba(255,59,48,0.08)', path: '/message' },
  { label: '额度查询', icon: CreditCard, color: '#007AFF', bg: 'rgba(0,122,255,0.08)', path: '/quota' },
  { label: '用户协议', icon: FileText, color: '#8E8E93', bg: 'rgba(0,0,0,0.04)', path: '' },
  { label: '设置', icon: Settings, color: '#8E8E93', bg: 'rgba(0,0,0,0.04)', path: '' },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  return (
    <div className="page page-tabbar">
      {/* Dark header */}
      <div style={{
        background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%)',
        padding: '14px 16px 40px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(232,53,46,0.06)' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: 1, marginBottom: 20, position: 'relative' }}>我的</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(135deg, rgba(232,53,46,0.3), rgba(232,53,46,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)',
            border: '2px solid rgba(255,255,255,0.15)',
          }}>张</div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>张三</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: 'rgba(232,53,46,0.2)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: 'var(--brand-soft)' }}>车商</span>
              汇和 · 白云服务中心1库
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="anim" style={{
        background: '#fff', margin: '-20px 16px 0', borderRadius: 16,
        padding: '16px 0', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)',
        display: 'flex', position: 'relative', zIndex: 1,
      }}>
        {[
          { icon: Wallet, num: '13.00', unit: '万', label: '可用额度', color: '#FF3B30' },
          { icon: Package, num: '3', unit: '台', label: '在库车辆', color: '#007AFF' },
          { icon: Clock, num: '2', unit: '笔', label: '待审批', color: '#FF9500' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}>
            <s.icon size={16} color={s.color} strokeWidth={2} style={{ marginBottom: 4 }} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'var(--font-num)' }}>{s.num}</span>
              <span style={{ fontSize: 10, color: 'var(--text-2)', marginLeft: 2 }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="anim d1" style={{ margin: '16px 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
        {menus.map((m, i) => {
          const Icon = m.icon
          return (
            <div key={m.label} onClick={() => m.path && navigate(m.path)} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i < menus.length - 1 ? '0.5px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Icon size={17} color={m.color} strokeWidth={1.8} />
              </div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{m.label}</span>
              {m.badge && <span style={{ background: 'var(--red)', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-num)', marginRight: 8 }}>{m.badge}</span>}
              <ChevronRight size={16} color="var(--text-3)" />
            </div>
          )
        })}
      </div>

      <div className="anim d2" style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden', background: '#fff', border: '1px solid var(--border)' }}>
        <div onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', cursor: 'pointer' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <LogOut size={17} color="var(--text-2)" strokeWidth={1.8} />
          </div>
          <span style={{ flex: 1, fontSize: 15, color: 'var(--text-2)' }}>切换账号</span>
          <ChevronRight size={16} color="var(--text-3)" />
        </div>
      </div>
    </div>
  )
}
