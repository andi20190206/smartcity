import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search, ChevronRight, User, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { mockSalesOrders } from '../../shared/mock/salesMock'
import { salesStatusTabs, salesStatusTagColor } from '../../shared/constants/salesStatusMap'
import { getCarThumb, handleImgError } from '../../shared/constants/carImages'

export default function SalesList() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = mockSalesOrders.filter((o) => {
    if (activeTab !== 'all' && o.status !== activeTab) return false
    if (!search) return true
    const s = search.toLowerCase()
    return o.id.toLowerCase().includes(s) || o.buyerName.includes(s)
      || o.vehicles.some((v) => v.plateNo.includes(s) || v.vin.toLowerCase().includes(s))
  })

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">销售列表</div>
        <div className="nav-right" />
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
        {salesStatusTabs.map((t) => (
          <div key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: '0 0 auto', padding: '12px 14px', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
            fontWeight: activeTab === t.key ? 700 : 400,
            color: activeTab === t.key ? 'var(--brand)' : 'var(--text-2)',
            borderBottom: activeTab === t.key ? '2.5px solid var(--brand)' : '2.5px solid transparent',
            fontFamily: 'var(--font-display)', transition: 'all 0.2s',
          }}>{t.title}</div>
        ))}
      </div>

      {/* Search */}
      <div style={{ padding: '10px 16px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 22, padding: '8px 14px', gap: 8 }}>
          <Search size={16} color="var(--text-2)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索车牌/VIN/销售单号/买家"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: 'var(--text-0)' }} />
        </div>
      </div>

      {/* Card list */}
      <div style={{ padding: '4px 0 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无数据</div>
        ) : filtered.map((order, idx) => {
          const ts = salesStatusTagColor[order.status] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
          const isMulti = order.vehicles.length > 1
          const isLoss = order.totalProfitLoss < 0
          return (
            <div key={order.id} className={`anim d${Math.min(idx + 1, 5)}`}
              onClick={() => navigate(`/sales/detail/${order.id}`)}
              style={{
                margin: '10px 16px', background: '#fff', borderRadius: 14,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden', cursor: 'pointer',
              }}>
              {/* Header */}
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.3 }}>{order.id}</span>
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: ts.bg, color: ts.color }}>{order.statusText}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isLoss && (
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: 'var(--red-bg)', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingDown size={10} />亏损
                    </span>
                  )}
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600, background: isMulti ? 'var(--blue-bg)' : 'rgba(0,0,0,0.04)', color: isMulti ? 'var(--blue)' : 'var(--text-2)' }}>
                    {isMulti ? `${order.vehicles.length}台` : '单车'}
                  </span>
                </div>
              </div>

              {/* Vehicles */}
              <div>
                {order.vehicles.slice(0, 3).map((v, vi) => (
                  <div key={v.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    borderBottom: vi < Math.min(order.vehicles.length, 3) - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ width: 64, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #e8e8e8, #d5d5d5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={getCarThumb(idx * 3 + vi)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{v.plateNo}</span>
                        <span className="price" style={{ fontSize: 15, flexShrink: 0 }}>{v.salesPrice.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 500 }}>万</span></span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{v.brandModel}</span>
                        <span style={{ flexShrink: 0, marginLeft: 8, color: v.profitLoss >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600, fontFamily: 'var(--font-num)', fontSize: 11 }}>
                          {v.profitLoss >= 0 ? '+' : ''}{v.profitLoss.toFixed(2)}万
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {order.vehicles.length > 3 && (
                  <div style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'center', padding: '6px 0', borderTop: '1px solid var(--border)' }}>
                    还有 {order.vehicles.length - 3} 台…
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
                    <User size={12} color="var(--text-2)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>买家：{order.buyerName || '未填写'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                    <span className="price" style={{ fontSize: 14 }}>
                      {isMulti ? `合计${order.totalSalesPrice.toFixed(2)}万` : ''}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{order.createTime.slice(5)}</span>
                    <ChevronRight size={14} color="var(--text-3)" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => navigate('/sales/create')}>
        <Plus size={24} />
      </button>
    </div>
  )
}
