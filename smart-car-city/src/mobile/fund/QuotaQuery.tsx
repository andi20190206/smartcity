import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Wallet, TrendingUp, AlertTriangle,
  CreditCard, PieChart, ArrowUpRight,
} from 'lucide-react'
import { mockDealerQuotas, mockInTransitDetails } from '../../shared/mock/fundMock'

export default function QuotaQuery() {
  const navigate = useNavigate()
  const [selectedDealer, setSelectedDealer] = useState(0)
  const quota = mockDealerQuotas[selectedDealer]
  const isNegative = quota.applyableQuota < 0

  // 额度使用率
  const usageRate = quota.maxQuota > 0 ? ((quota.inTransitQuota / quota.maxQuota) * 100).toFixed(1) : '0'

  return (
    <div className="page">
      <div className="nav-dark" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)' }}>
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">额度查询</div>
        <div className="nav-right" />
      </div>

      {/* 额度总览 */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '20px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <CreditCard size={18} color="var(--brand-soft)" />
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', opacity: 0.9 }}>
            {quota.storeName}
          </span>
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
                <span style={{ fontSize: 11, color: '#FF6B5A' }}>额度不足，请补充合作款项</span>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>最大额度</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-num)', letterSpacing: -0.5 }}>
              {quota.maxQuota.toFixed(2)}
              <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.6, marginLeft: 2 }}>万</span>
            </div>
          </div>
        </div>

        {/* 额度使用进度条 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, opacity: 0.5 }}>额度使用率</span>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-num)', opacity: 0.7 }}>{usageRate}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3, transition: 'width 0.6s ease',
              width: `${Math.min(parseFloat(usageRate), 100)}%`,
              background: parseFloat(usageRate) > 80 ? '#FF6B5A' : parseFloat(usageRate) > 60 ? '#FFD666' : '#7DFFB3',
            }} />
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

      {/* 额度明细 */}
      <div className="section-hd">额度明细</div>
      <div className="anim d2" style={{ padding: '0 16px' }}>
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        }}>
          {[
            { label: '代经销合作款项', value: quota.deposit, unit: '万' },
            { label: '已用合作款项', value: quota.usedDeposit, unit: '万' },
            { label: '可用合作款项', value: quota.availableDeposit, unit: '万', warn: quota.availableDeposit < 0 },
            { label: '最大额度', value: quota.maxQuota, unit: '万', sub: '杠杆比 30:100' },
            { label: '在途额度', value: quota.inTransitQuota, unit: '万' },
            { label: '可用额度', value: quota.availableQuota, unit: '万', warn: quota.availableQuota < 0 },
            { label: '可申请额度', value: quota.applyableQuota, unit: '万', warn: quota.applyableQuota < 0, highlight: true },
          ].map((item, i, arr) => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 16px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              background: item.highlight ? 'var(--brand-bg)' : 'transparent',
            }}>
              <div>
                <span style={{ fontSize: 14, color: item.highlight ? 'var(--brand)' : 'var(--text-1)', fontWeight: item.highlight ? 600 : 400 }}>{item.label}</span>
                {item.sub && <span style={{ fontSize: 10, color: 'var(--text-2)', marginLeft: 6 }}>{item.sub}</span>}
              </div>
              <span style={{
                fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-num)',
                color: item.warn ? 'var(--red)' : item.highlight ? 'var(--brand)' : 'var(--text-0)',
              }}>
                {item.value.toFixed(2)}
                <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-2)', marginLeft: 2 }}>{item.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 在途额度明细 */}
      <div className="section-hd">在途额度明细（{mockInTransitDetails.length}台）</div>
      <div className="anim d3" style={{ padding: '0 16px 20px' }}>
        {mockInTransitDetails.map((v, idx) => (
          <div key={v.vehicleId} className={`anim d${Math.min(idx + 1, 5)}`} style={{
            background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', marginBottom: 8, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{v.plateNo}</span>
                {v.registered && (
                  <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'var(--green-bg)', color: 'var(--green)', fontWeight: 600 }}>已签注</span>
                )}
              </div>
              <span className="price" style={{ fontSize: 16 }}>
                {v.advanceAmount.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 500 }}>万</span>
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{v.brandModel}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-num)' }}>垫款日期: {v.advanceDate}</div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="anim d4" style={{ padding: '0 16px 80px' }}>
        <button onClick={() => navigate('/fund/advance/create')} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
          background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
          cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpRight size={18} color="var(--brand)" />
          </div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-0)' }}>发起垫款申请</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>申请车辆垫款</div>
          </div>
          <ChevronRight size={16} color="var(--text-3)" />
        </button>
      </div>
    </div>
  )
}
