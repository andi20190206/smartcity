import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search, ChevronRight, Clock, CheckCircle, XCircle, Loader, Filter, ShieldCheck, User } from 'lucide-react'
import { mockApprovals } from '../../shared/mock/approvalMock'
import { approvalStatusTabs, approvalStatusTagColor, approvalTypeTagColor } from '../../shared/constants/approvalStatusMap'

const typeFilters: { key: string; label: string }[] = [
  { key: 'all', label: '全部类型' },
  { key: 'purchase', label: '采购' },
  { key: 'advance', label: '垫款' },
  { key: 'sales_sign', label: '销售签约' },
  { key: 'supervision_release', label: '监管解除' },
  { key: 'vehicle_use', label: '用车' },
  { key: 'deposit_change', label: '款项变动' },
  { key: 'alarm_handle', label: '告警' },
]

export default function ApprovalList() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showTypeFilter, setShowTypeFilter] = useState(false)

  const filtered = useMemo(() => {
    return mockApprovals.filter((a) => {
      if (activeTab !== 'all' && a.status !== activeTab) return false
      if (typeFilter !== 'all' && a.type !== typeFilter) return false
      if (search) {
        const s = search.toLowerCase()
        return a.id.toLowerCase().includes(s) || a.bizOrderId.toLowerCase().includes(s)
          || a.summary.includes(s) || a.applicant.includes(s)
          || (a.plateNo && a.plateNo.includes(s))
      }
      return true
    })
  }, [activeTab, typeFilter, search])

  const stats = useMemo(() => ({
    pending: mockApprovals.filter((a) => a.status === 'pending').length,
    approving: mockApprovals.filter((a) => a.status === 'approving').length,
    approved: mockApprovals.filter((a) => a.status === 'approved').length,
    rejected: mockApprovals.filter((a) => a.status === 'rejected').length,
  }), [])

  return (
    <div className="page">
      <div className="nav-dark" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)' }}>
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">审批中心</div>
        <div className="nav-right" />
      </div>

      {/* 统计卡片 */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ShieldCheck size={18} color="var(--brand-soft)" />
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', opacity: 0.9 }}>审批概览</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { key: 'pending', label: '待审批', value: stats.pending, color: '#FFD666' },
            { key: 'approving', label: '审批中', value: stats.approving, color: '#69B4FF' },
            { key: 'approved', label: '已通过', value: stats.approved, color: '#7DFFB3' },
            { key: 'rejected', label: '已驳回', value: stats.rejected, color: '#FF6B5A' },
          ].map((item) => (
            <div key={item.key} onClick={() => setActiveTab(item.key)} style={{
              background: activeTab === item.key ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
              borderRadius: 10, padding: '10px 8px', textAlign: 'center', cursor: 'pointer',
              border: activeTab === item.key ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-num)', color: item.color, letterSpacing: -0.5 }}>
                {item.value}
              </div>
              <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Tabs */}
      <div style={{ background: '#fff', display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
        {approvalStatusTabs.map((t) => (
          <div key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: '0 0 auto', padding: '12px 16px', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
            fontWeight: activeTab === t.key ? 700 : 400,
            color: activeTab === t.key ? 'var(--brand)' : 'var(--text-2)',
            borderBottom: activeTab === t.key ? '2.5px solid var(--brand)' : '2.5px solid transparent',
            fontFamily: 'var(--font-display)', transition: 'all 0.2s',
          }}>
            {t.title}
            {t.key === 'pending' && stats.pending > 0 && (
              <span style={{
                marginLeft: 4, fontSize: 10, fontWeight: 700, color: '#fff',
                background: 'var(--brand)', borderRadius: 8, padding: '1px 5px',
                fontFamily: 'var(--font-num)',
              }}>{stats.pending}</span>
            )}
          </div>
        ))}
      </div>

      {/* Search + Type Filter */}
      <div style={{ padding: '10px 16px', background: '#fff', display: 'flex', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 22, padding: '8px 14px', gap: 8, flex: 1 }}>
          <Search size={16} color="var(--text-2)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索审批单号/业务单号/车牌"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: 'var(--text-0)' }} />
        </div>
        <button onClick={() => setShowTypeFilter(!showTypeFilter)} style={{
          width: 40, height: 40, borderRadius: 20, border: 'none', cursor: 'pointer',
          background: typeFilter !== 'all' ? 'var(--brand-bg)' : 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Filter size={16} color={typeFilter !== 'all' ? 'var(--brand)' : 'var(--text-2)'} />
        </button>
      </div>

      {/* Type filter chips */}
      {showTypeFilter && (
        <div style={{ padding: '0 16px 10px', background: '#fff', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {typeFilters.map((tf) => (
            <button key={tf.key} onClick={() => setTypeFilter(tf.key)} style={{
              padding: '5px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: typeFilter === tf.key ? 600 : 400,
              background: typeFilter === tf.key ? 'var(--dark)' : 'rgba(0,0,0,0.04)',
              color: typeFilter === tf.key ? '#fff' : 'var(--text-2)',
              transition: 'all 0.2s',
            }}>{tf.label}</button>
          ))}
        </div>
      )}

      {/* List */}
      <div style={{ padding: '4px 0 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无审批记录</div>
        ) : filtered.map((item, idx) => {
          const sts = approvalStatusTagColor[item.status] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
          const tts = approvalTypeTagColor[item.type] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
          const isFinished = item.status === 'approved' || item.status === 'rejected'
          const pendingNode = item.nodes.find((n) => n.status === 'pending')

          return (
            <div key={item.id} className={`anim d${Math.min(idx + 1, 5)}`}
              onClick={() => navigate(`/approval/detail/${item.id}`)}
              style={{
                margin: '10px 16px', borderRadius: 14,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden', cursor: 'pointer',
                background: isFinished ? '#fafafa' : '#fff',
                opacity: isFinished ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}>
              {/* Header */}
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.3, color: isFinished ? 'var(--text-2)' : 'var(--text-0)' }}>{item.id}</span>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: isFinished ? 'rgba(0,0,0,0.04)' : tts.bg, color: isFinished ? 'var(--text-2)' : tts.color }}>{item.typeText}</span>
                </div>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: sts.bg, color: sts.color }}>
                  {item.statusText}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: isFinished ? 'var(--text-2)' : 'var(--text-0)', marginBottom: 6, lineHeight: 1.4 }}>{item.summary}</div>
                {item.amount !== undefined && (
                  <div style={{ marginBottom: 6 }}>
                    <span className="price" style={{ fontSize: 18, color: isFinished ? 'var(--text-2)' : undefined }}>{item.amount.toFixed(2)}</span>
                    <span style={{ fontSize: 11, color: isFinished ? 'var(--text-2)' : 'var(--brand)', marginLeft: 1 }}>万</span>
                  </div>
                )}

                {/* 审批进度：当前待谁审批 */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
                  padding: '6px 10px', borderRadius: 8,
                  background: isFinished ? 'rgba(0,0,0,0.02)' : 'var(--blue-bg)',
                }}>
                  {isFinished ? (
                    <>
                      {item.status === 'approved'
                        ? <CheckCircle size={13} color="var(--green)" />
                        : <XCircle size={13} color="var(--red)" />}
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                        {item.status === 'approved' ? '审批已全部通过' : `已被 ${item.nodes.find((n) => n.status === 'rejected')?.approverName} 驳回`}
                      </span>
                    </>
                  ) : pendingNode ? (
                    <>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', background: 'var(--blue)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <User size={10} color="#fff" />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600 }}>
                        待 {pendingNode.approverName} 审批
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>
                        {item.nodes.filter((n) => n.status === 'approved').length}/{item.totalNodes}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock size={13} color="var(--orange)" />
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>等待审批</span>
                    </>
                  )}
                </div>

                {/* 已驳回展示驳回理由 */}
                {item.status === 'rejected' && (() => {
                  const rejectNode = item.nodes.find((n) => n.status === 'rejected')
                  return rejectNode?.opinion ? (
                    <div style={{
                      marginBottom: 8, padding: '8px 10px', borderRadius: 8,
                      background: 'var(--red-bg)', border: '1px solid rgba(255,59,48,0.1)',
                      fontSize: 12, color: 'var(--red)', lineHeight: 1.4,
                      display: 'flex', alignItems: 'flex-start', gap: 6,
                    }}>
                      <XCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>驳回理由: {rejectNode.opinion}</span>
                    </div>
                  ) : null
                })()}

                {/* 审批节点缩略 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  {item.nodes.map((node, ni) => {
                    const isDone = node.status === 'approved'
                    const isRejected = node.status === 'rejected'
                    const isCurrent = node.status === 'pending' && item.currentNode === node.nodeIndex
                    return (
                      <div key={ni} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isDone ? 'var(--green-bg)' : isRejected ? 'var(--red-bg)' : isCurrent ? 'var(--blue-bg)' : 'rgba(0,0,0,0.04)',
                        }}>
                          {isDone && <CheckCircle size={10} color="var(--green)" />}
                          {isRejected && <XCircle size={10} color="var(--red)" />}
                          {isCurrent && <Clock size={10} color="var(--blue)" />}
                          {!isDone && !isRejected && !isCurrent && <Clock size={10} color="var(--text-3)" />}
                        </div>
                        <span style={{
                          fontSize: 10,
                          color: isDone ? 'var(--text-3)' : isRejected ? 'var(--red)' : isCurrent ? 'var(--blue)' : 'var(--text-3)',
                          fontWeight: isCurrent ? 600 : 400,
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}>{node.nodeName}</span>
                        {ni < item.nodes.length - 1 && <span style={{ fontSize: 8, color: 'var(--text-3)', margin: '0 1px' }}>›</span>}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{item.applicant} · {item.dealerCompany}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{item.createTime.slice(5)}</span>
                  <ChevronRight size={14} color="var(--text-3)" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
