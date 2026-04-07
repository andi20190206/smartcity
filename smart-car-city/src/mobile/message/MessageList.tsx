import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Bell, ShieldCheck, Wallet, AlertTriangle, Package, Settings,
  CheckCircle, ChevronRight, Check,
} from 'lucide-react'
import { mockMessages } from '../../shared/mock/messageMock'

const typeFilters = [
  { key: 'all', label: '全部' },
  { key: 'approval', label: '审批' },
  { key: 'fund', label: '资金' },
  { key: 'inventory', label: '库存' },
  { key: 'alert', label: '预警' },
  { key: 'system', label: '系统' },
]

const typeIcon: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  approval: { icon: ShieldCheck, color: 'var(--blue)', bg: 'var(--blue-bg)' },
  fund: { icon: Wallet, color: 'var(--green)', bg: 'var(--green-bg)' },
  inventory: { icon: Package, color: 'var(--orange)', bg: 'var(--orange-bg)' },
  alert: { icon: AlertTriangle, color: 'var(--red)', bg: 'var(--red-bg)' },
  system: { icon: Settings, color: 'var(--text-2)', bg: 'rgba(0,0,0,0.04)' },
}

export default function MessageList() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [messages, setMessages] = useState(mockMessages)

  const filtered = useMemo(() => {
    if (tab === 'all') return messages
    return messages.filter((m) => m.type === tab)
  }, [tab, messages])

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  const markAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, status: 'read' as const })))
  }

  const markRead = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: 'read' as const } : m))
  }

  const getRelativeTime = (time: string) => {
    const diff = Date.now() - new Date(time).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}分钟前`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}小时前`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}天前`
    return time.slice(5, 16)
  }

  return (
    <div className="page">
      <div className="nav-dark" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)' }}>
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">消息通知</div>
        <div className="nav-right">
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
              fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <Check size={14} />全部已读
            </button>
          )}
        </div>
      </div>

      {/* 未读统计 */}
      {unreadCount > 0 && (
        <div className="anim d1" style={{
          margin: '12px 16px', padding: '14px 16px', borderRadius: 12,
          background: 'var(--brand-bg)', border: '1px solid rgba(232,53,46,0.15)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Bell size={18} color="var(--brand)" />
          <span style={{ fontSize: 14, color: 'var(--brand)', fontWeight: 600 }}>
            您有 {unreadCount} 条未读消息
          </span>
        </div>
      )}

      {/* 类型 Tab */}
      <div className="anim d2" style={{ display: 'flex', padding: '0 16px', gap: 6, marginBottom: 8, overflowX: 'auto' }}>
        {typeFilters.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: tab === t.key ? 600 : 400, whiteSpace: 'nowrap',
            background: tab === t.key ? 'var(--dark)' : 'rgba(0,0,0,0.04)',
            color: tab === t.key ? '#fff' : 'var(--text-2)',
            fontFamily: 'var(--font-display)', transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* 消息列表 */}
      <div style={{ padding: '4px 0 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>
            <Bell size={40} color="var(--text-3)" style={{ marginBottom: 12 }} />
            <div>暂无消息</div>
          </div>
        ) : filtered.map((msg, idx) => {
          const ti = typeIcon[msg.type] || typeIcon.system
          const Icon = ti.icon
          const isUnread = msg.status === 'unread'
          return (
            <div key={msg.id} className={`anim d${Math.min(idx + 1, 5)}`}
              onClick={() => {
                markRead(msg.id)
                // 根据业务类型跳转
                if (msg.bizType === 'approval' && msg.bizId) navigate(`/approval/detail/${msg.bizId}`)
                else if (msg.bizType === 'advance' && msg.bizId) navigate(`/fund/advance/${msg.bizId}`)
                else if (msg.bizType === 'vehicle_use') navigate('/vehicle-use')
              }}
              style={{
                margin: '0 16px 10px', background: '#fff', borderRadius: 14,
                border: isUnread ? '1px solid rgba(232,53,46,0.15)' : '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)', overflow: 'hidden', cursor: 'pointer',
                position: 'relative',
              }}>
              {/* 未读指示器 */}
              {isUnread && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)',
                }} />
              )}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: ti.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={18} color={ti.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{
                        fontSize: 14, fontWeight: isUnread ? 700 : 500,
                        color: 'var(--text-0)',
                      }}>{msg.title}</span>
                    </div>
                    <div style={{
                      fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>{msg.content}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{
                        fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                        background: ti.bg, color: ti.color,
                      }}>{msg.typeText}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>
                        {getRelativeTime(msg.createTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
