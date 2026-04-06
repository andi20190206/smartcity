import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Wallet, TrendingUp, AlertTriangle, CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import { mockDealerQuotas, mockAdvanceRecords, mockDepositChanges } from '../../shared/mock/fundMock'
import { advanceStatusTagColor } from '../../shared/constants/fundStatusMap'

export default function FundHome() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<'overview' | 'advance' | 'deposit'>('overview')

  // 当前车商（模拟取第一个）
  const quota = mockDealerQuotas[0]
  const recentAdvances = mockAdvanceRecords.slice(0, 5)
  const isNegative = quota.applyableQuota < 0

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">资金管理</div>
        <div className="nav-right" />
      </div>

      {/* 额度总览卡片 */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '20px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Wallet size={18} color="var(--brand-soft)" />
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', opacity: 0.9 }}>我的额度</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>可申请额度</div>
            <div style={{
              fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-num)', letterSpacing: -1,
              color: isNegative ? '#FF6B5A' : '#fff',
            }}>
              {quota.applyableQuota.toFixed(2)}
              <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.6, marginLeft: 2 }}>万</span>
            </div>
            {isNegative && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <AlertTriangle size={12} color="#FF6B5A" />
                <span style={{ fontSize: 11, color: '#FF6B5A' }}>额度不足，请注意风控</span>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>最大额度</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-num)', letterSpacing: -0.5 }}>
              {quota.maxQuota.toFixed(2)}<span style={{ fontSize: 11, fontWeight: 400, opacity: 0.6, marginLeft: 2 }}>万</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: '合作款项', value: quota.deposit, color: '#fff' },
            { label: '在途额度', value: quota.inTransitQuota, color: '#FFD666' },
            { label: '可用额度', value: quota.availableQuota, color: quota.availableQuota < 0 ? '#FF6B5A' : '#7DFFB3' },
          ].map((item) => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-num)', color: item.color }}>
                {item.value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="anim d2" style={{
        margin: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 10,
      }}>
        <button onClick={() => navigate('/fund/advance/create')} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
          background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
          cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpRight size={18} color="var(--brand)" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>发起垫款</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>申请车辆垫款</div>
          </div>
        </button>
        <button onClick={() => navigate('/fund/deposit-change')} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
          background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
          cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowDownLeft size={18} color="var(--blue)" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>款项变动</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>追加/退还款项</div>
          </div>
        </button>
      </div>

      {/* Section Tabs */}
      <div className="anim d3" style={{ display: 'flex', padding: '0 16px', gap: 6, marginBottom: 8 }}>
        {[
          { key: 'overview' as const, label: '额度明细' },
          { key: 'advance' as const, label: '垫款记录' },
          { key: 'deposit' as const, label: '款项变动' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setActiveSection(tab.key)} style={{
            padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: activeSection === tab.key ? 600 : 400,
            background: activeSection === tab.key ? 'var(--dark)' : 'rgba(0,0,0,0.04)',
            color: activeSection === tab.key ? '#fff' : 'var(--text-2)',
            fontFamily: 'var(--font-display)', transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '0 0 100px' }}>
        {activeSection === 'overview' && <QuotaDetail quota={quota} navigate={navigate} />}
        {activeSection === 'advance' && <AdvanceList records={recentAdvances} navigate={navigate} />}
        {activeSection === 'deposit' && <DepositSection navigate={navigate} />}
      </div>
    </div>
  )
}

/* ---- 额度明细 ---- */
function QuotaDetail({ quota, navigate }: { quota: typeof mockDealerQuotas[0]; navigate: ReturnType<typeof useNavigate> }) {
  const items = [
    { label: '代经销合作款项', value: quota.deposit, unit: '万' },
    { label: '已用合作款项', value: quota.usedDeposit, unit: '万', warn: false },
    { label: '可用合作款项', value: quota.availableDeposit, unit: '万', warn: quota.availableDeposit < 0 },
    { label: '最大额度', value: quota.maxQuota, unit: '万', sub: '杠杆比 30:100' },
    { label: '在途额度', value: quota.inTransitQuota, unit: '万' },
    { label: '可用额度', value: quota.availableQuota, unit: '万', warn: quota.availableQuota < 0 },
  ]

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        {items.map((item, i) => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 16px',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div>
              <span style={{ fontSize: 14, color: 'var(--text-1)' }}>{item.label}</span>
              {item.sub && <span style={{ fontSize: 10, color: 'var(--text-2)', marginLeft: 6 }}>{item.sub}</span>}
            </div>
            <span style={{
              fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-num)',
              color: item.warn ? 'var(--red)' : 'var(--text-0)',
            }}>
              {item.value.toFixed(2)}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-2)', marginLeft: 2 }}>{item.unit}</span>
            </span>
          </div>
        ))}
      </div>

      {/* 在途额度明细入口 */}
      <div onClick={() => navigate('/fund/in-transit')} style={{
        marginTop: 10, background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
        padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} color="var(--blue)" />
          <span style={{ fontSize: 14, fontWeight: 500 }}>在途额度明细</span>
        </div>
        <ChevronRight size={16} color="var(--text-3)" />
      </div>
    </div>
  )
}

/* ---- 垫款记录列表 ---- */
function AdvanceList({ records, navigate }: { records: typeof mockAdvanceRecords; navigate: ReturnType<typeof useNavigate> }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={14} color="var(--orange)" />
      case 'approving': return <Loader size={14} color="var(--blue)" />
      case 'approved': return <CheckCircle size={14} color="var(--green)" />
      case 'rejected': return <XCircle size={14} color="var(--red)" />
      case 'withdrawn': return <CheckCircle size={14} color="var(--text-2)" />
      case 'withdraw_failed': return <AlertTriangle size={14} color="var(--red)" />
      default: return null
    }
  }

  return (
    <div style={{ padding: '0 16px' }}>
      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无垫款记录</div>
      ) : records.map((r, idx) => {
        const ts = advanceStatusTagColor[r.status] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
        return (
          <div key={r.id} className={`anim d${Math.min(idx + 1, 5)}`}
            onClick={() => navigate(`/fund/advance/${r.id}`)}
            style={{
              background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)', marginBottom: 10, overflow: 'hidden', cursor: 'pointer',
            }}>
            <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.3 }}>{r.id}</span>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: ts.bg, color: ts.color }}>
                  {r.statusText}
                </span>
              </div>
              <span className="price" style={{ fontSize: 16 }}>
                {r.applyAmount.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 500 }}>万</span>
              </span>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{r.plateNo}</span>
                <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{r.fundSource}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>{r.brandModel}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>卖方: {r.sellerName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{r.createTime.slice(5)}</span>
                  <ChevronRight size={14} color="var(--text-3)" />
                </div>
              </div>
              {r.status === 'withdraw_failed' && r.failReason && (
                <div style={{
                  marginTop: 8, padding: '8px 10px', borderRadius: 8,
                  background: 'var(--red-bg)', fontSize: 12, color: 'var(--red)',
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  {r.failReason}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---- 款项变动 ---- */
function DepositSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div style={{ padding: '0 16px' }}>
      {mockDepositChanges.map((r, idx) => (
        <div key={r.id} className={`anim d${Math.min(idx + 1, 5)}`} style={{
          background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)', marginBottom: 10, padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: r.direction === 'increase' ? 'var(--green-bg)' : 'var(--red-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {r.direction === 'increase'
                  ? <ArrowDownLeft size={14} color="var(--green)" />
                  : <ArrowUpRight size={14} color="var(--red)" />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{r.reason}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{r.changeType}</div>
              </div>
            </div>
            <span style={{
              fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-num)',
              color: r.direction === 'increase' ? 'var(--green)' : 'var(--red)',
            }}>
              {r.direction === 'increase' ? '+' : '-'}{r.amount.toFixed(2)}
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-2)', marginLeft: 2 }}>万</span>
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.dealerName} · {r.storeName}</span>
            <span style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
              background: r.auditStatus === 'approved' ? 'var(--green-bg)' : r.auditStatus === 'rejected' ? 'var(--red-bg)' : 'var(--orange-bg)',
              color: r.auditStatus === 'approved' ? 'var(--green)' : r.auditStatus === 'rejected' ? 'var(--red)' : 'var(--orange)',
            }}>{r.auditStatusText}</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6, fontFamily: 'var(--font-num)' }}>{r.createTime}</div>
        </div>
      ))}
    </div>
  )
}
