import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Search, Car, Clock, CheckCircle, XCircle, Loader, MapPin } from 'lucide-react'
import { mockVehicleUseRecords } from '../../shared/mock/inventoryMock'

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending_approval', label: '待审批' },
  { key: 'using', label: '使用中' },
  { key: 'completed', label: '已完成' },
  { key: 'rejected', label: '已驳回' },
]

const statusStyle: Record<string, { bg: string; color: string }> = {
  pending_approval: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  using: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  completed: { bg: 'var(--green-bg)', color: 'var(--green)' },
  rejected: { bg: 'var(--red-bg)', color: 'var(--red)' },
  expired: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
}

const statusIcon: Record<string, React.ReactNode> = {
  pending_approval: <Clock size={14} color="var(--orange)" />,
  using: <Loader size={14} color="var(--blue)" />,
  completed: <CheckCircle size={14} color="var(--green)" />,
  rejected: <XCircle size={14} color="var(--red)" />,
}

export default function VehicleUseList() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return mockVehicleUseRecords.filter((r) => {
      if (tab !== 'all' && r.useStatus !== tab) return false
      if (search) {
        const s = search.toLowerCase()
        return r.id.toLowerCase().includes(s) || r.plateNo.includes(s)
          || r.pickerName.includes(s) || r.applicant.includes(s)
      }
      return true
    })
  }, [tab, search])

  const stats = useMemo(() => ({
    pending: mockVehicleUseRecords.filter((r) => r.useStatus === 'pending_approval').length,
    using: mockVehicleUseRecords.filter((r) => r.useStatus === 'using').length,
  }), [])

  return (
    <div className="page">
      <div className="nav-dark" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)' }}>
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">用车记录</div>
        <div className="nav-right" />
      </div>

      {/* 统计卡片 */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16,
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Car size={18} color="var(--brand-soft)" />
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', opacity: 0.9 }}>用车概览</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: '待审批', value: stats.pending, color: '#FFD666' },
            { label: '使用中', value: stats.using, color: '#69B4FF' },
            { label: '总记录', value: mockVehicleUseRecords.length, color: '#fff' },
          ].map((item) => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-num)', color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 搜索 */}
      <div style={{ padding: '0 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 22, padding: '8px 14px', gap: 8, border: '1px solid var(--border)' }}>
          <Search size={16} color="var(--text-2)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索单号/车牌/提车人"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: 'var(--text-0)' }} />
        </div>
      </div>

      {/* 状态 Tab */}
      <div className="anim d2" style={{ display: 'flex', padding: '0 16px', gap: 6, marginBottom: 8, overflowX: 'auto' }}>
        {statusTabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: tab === t.key ? 600 : 400, whiteSpace: 'nowrap',
            background: tab === t.key ? 'var(--dark)' : 'rgba(0,0,0,0.04)',
            color: tab === t.key ? '#fff' : 'var(--text-2)',
            fontFamily: 'var(--font-display)', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* 列表 */}
      <div style={{ padding: '4px 0 100px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>
            <Car size={40} color="var(--text-3)" style={{ marginBottom: 12 }} />
            <div>暂无用车记录</div>
          </div>
        ) : filtered.map((r, idx) => {
          const ss = statusStyle[r.useStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
          return (
            <div key={r.id} className={`anim d${Math.min(idx + 1, 5)}`} style={{
              margin: '0 16px 10px', background: '#fff', borderRadius: 14,
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden', cursor: 'pointer',
            }}>
              {/* Header */}
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.3 }}>{r.id}</span>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: 'var(--blue-bg)', color: 'var(--blue)' }}>{r.useType}</span>
                </div>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: ss.bg, color: ss.color }}>
                  {r.useStatusText}
                </span>
              </div>
              {/* Body */}
              <div style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Car size={15} color="var(--brand)" />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{r.plateNo}</span>
                  <span style={{
                    fontSize: 10, padding: '1px 5px', borderRadius: 4,
                    background: r.deviceStatus === 'online' ? 'var(--green-bg)' : 'var(--red-bg)',
                    color: r.deviceStatus === 'online' ? 'var(--green)' : 'var(--red)',
                  }}>{r.deviceStatus === 'online' ? '在线' : '离线'}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} />{r.useDuration}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>提车人: {r.pickerName}（{r.pickerType}）</span>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{r.applyTime.slice(5)}</span>
                </div>
                {r.location && (
                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={10} />{r.location}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => navigate('/vehicle-use/apply')}>
        <Plus size={24} />
      </button>
    </div>
  )
}
