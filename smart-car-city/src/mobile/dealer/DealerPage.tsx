import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, ClipboardList, DollarSign, BarChart3,
  Package, Tag, Car, Handshake, CircleCheck,
  KeyRound, FileText, PenLine, FilePen, CarFront, Zap,
} from 'lucide-react'

interface Item { icon: typeof Car; label: string; path: string; badge: number; color: string; bg: string }

const sections: { title: string; items: Item[] }[] = [
  { title: '采销工具', items: [
    { icon: ShoppingCart, label: '车辆采购', path: '/purchase/create', badge: 0, color: '#FF3B30', bg: 'rgba(255,59,48,0.08)' },
    { icon: ClipboardList, label: '采购列表', path: '/purchase', badge: 3, color: '#FF9500', bg: 'rgba(255,149,0,0.08)' },
    { icon: DollarSign, label: '车辆销售', path: '/sales/create', badge: 0, color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
    { icon: BarChart3, label: '销售列表', path: '/sales', badge: 0, color: '#007AFF', bg: 'rgba(0,122,255,0.08)' },
  ]},
  { title: '车辆管理', items: [
    { icon: Package, label: '待入库', path: '/dealer', badge: 5, color: '#FF9500', bg: 'rgba(255,149,0,0.08)' },
    { icon: Tag, label: '待上架', path: '/dealer', badge: 2, color: '#AF52DE', bg: 'rgba(175,82,222,0.08)' },
    { icon: Car, label: '在售', path: '/dealer', badge: 18, color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
    { icon: Handshake, label: '交易中', path: '/dealer', badge: 3, color: '#007AFF', bg: 'rgba(0,122,255,0.08)' },
    { icon: CircleCheck, label: '已售', path: '/dealer', badge: 0, color: '#8E8E93', bg: 'rgba(0,0,0,0.04)' },
  ]},
  { title: '用车工具', items: [
    { icon: KeyRound, label: '用车申请', path: '/dealer', badge: 0, color: '#007AFF', bg: 'rgba(0,122,255,0.08)' },
    { icon: FileText, label: '用车列表', path: '/dealer', badge: 0, color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
  ]},
  { title: '审批', items: [
    { icon: PenLine, label: '采购审批', path: '/dealer', badge: 2, color: '#FF3B30', bg: 'rgba(255,59,48,0.08)' },
    { icon: FilePen, label: '销售审批', path: '/dealer', badge: 1, color: '#FF9500', bg: 'rgba(255,149,0,0.08)' },
    { icon: CarFront, label: '用车审批', path: '/dealer', badge: 0, color: '#AF52DE', bg: 'rgba(175,82,222,0.08)' },
  ]},
]

export default function DealerPage() {
  const navigate = useNavigate()
  return (
    <div className="page page-tabbar">
      {/* Dark header */}
      <div style={{
        background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%)',
        padding: '14px 16px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(232,53,46,0.06)' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: 1, marginBottom: 14, position: 'relative' }}>代经销</div>
        <div className="anim" style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Zap size={14} color="var(--brand-soft)" fill="var(--brand-soft)" />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>打造高效经销服务</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['合规经营', '智慧库管', '营销获客'].map((t) => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections — 统一4列 */}
      {sections.map((sec, si) => (
        <div key={sec.title}>
          <div className="section-hd">{sec.title}</div>
          <div className={`anim d${Math.min(si + 1, 5)}`} style={{
            background: '#fff', margin: '0 16px', borderRadius: 16, padding: '18px 0 10px',
            boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 0' }}>
              {sec.items.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} onClick={() => navigate(item.path)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={23} color={item.color} strokeWidth={1.6} />
                      </div>
                      {item.badge > 0 && (
                        <span style={{ position: 'absolute', top: -4, right: -6, background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 8, padding: '0 5px', minWidth: 16, height: 16, lineHeight: '16px', textAlign: 'center', fontFamily: 'var(--font-num)' }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500 }}>{item.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
      <div style={{ height: 12 }} />
    </div>
  )
}
