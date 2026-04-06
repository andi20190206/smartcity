import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileSpreadsheet, ImagePlus, Car, ChevronLeft, Search, ChevronRight, User } from 'lucide-react'
import { mockOrders } from '../../shared/mock/purchaseMock'
import { purchaseStatusTabs } from '../../shared/constants/statusMap'
import { getCarThumb, handleImgError } from '../../shared/constants/carImages'

const tagStyle: Record<string, { bg: string; color: string }> = {
  pending_check: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  pending_sign: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  signed: { bg: 'var(--green-bg)', color: 'var(--green)' },
  rejected: { bg: 'var(--red-bg)', color: 'var(--red)' },
  cancelled: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
}

export default function PurchaseList() {
  const [activeTab, setActiveTab] = useState('pending_check')
  const [search, setSearch] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const filtered = mockOrders.filter((o) => {
    if (o.status !== activeTab) return false
    if (!search) return true
    return o.id.includes(search) || o.ownerName.includes(search) || o.vehicles.some((v) => v.plateNo.includes(search) || v.vin.includes(search))
  })

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">采购列表</div>
        <div className="nav-right" />
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
        {purchaseStatusTabs.map((t) => (
          <div key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: '0 0 auto', padding: '12px 16px', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索车牌/VIN/采购单号"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: 'var(--text-0)' }} />
        </div>
      </div>

      {/* 统一卡片列表 */}
      <div style={{ padding: '4px 0 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无数据</div>
        ) : filtered.map((order, idx) => {
          const ts = tagStyle[order.status]
          const isBatch = order.vehicles.length > 1
          return (
            <div key={order.id} className={`anim d${Math.min(idx + 1, 5)}`}
              onClick={() => navigate(`/purchase/detail/${order.id}`)}
              style={{
                margin: '10px 16px', background: '#fff', borderRadius: 14,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden', cursor: 'pointer',
                borderLeft: isBatch ? '3px solid var(--blue)' : '1px solid var(--border)',
              }}>

              {/* 采购单头部 */}
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: isBatch ? 'var(--blue-bg)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.3 }}>{order.id}</span>
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: ts.bg, color: ts.color }}>{order.statusText}</span>
                </div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600, background: isBatch ? 'var(--blue)' : 'rgba(0,0,0,0.04)', color: isBatch ? '#fff' : 'var(--text-2)' }}>
                  {isBatch ? `批量 ${order.vehicles.length}台` : '单车'}
                </span>
              </div>

              {/* 车辆展示区 */}
              {isBatch ? (
                /* 批量采购：叠加缩略图 + 车辆摘要 */
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                    {/* 叠加缩略图 */}
                    <div style={{ display: 'flex', flexShrink: 0 }}>
                      {order.vehicles.slice(0, 3).map((v, vi) => (
                        <div key={v.id} style={{
                          width: 44, height: 34, borderRadius: 6, overflow: 'hidden',
                          border: '2px solid #fff', marginLeft: vi > 0 ? -12 : 0,
                          position: 'relative', zIndex: 3 - vi,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                          <img src={getCarThumb(idx * 3 + vi)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                        </div>
                      ))}
                      {order.vehicles.length > 3 && (
                        <div style={{
                          width: 44, height: 34, borderRadius: 6, marginLeft: -12,
                          background: 'var(--bg)', border: '2px solid #fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, color: 'var(--text-2)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>+{order.vehicles.length - 3}</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.vehicles[0].plateNo}、{order.vehicles[1]?.plateNo}{order.vehicles.length > 2 ? ` 等${order.vehicles.length}台` : ''}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
                        {order.vehicles[0].brandModel.split(' ')[0]} 等 · {order.vehicles[0].city || ''}
                      </div>
                    </div>
                    <span className="price" style={{ fontSize: 17, flexShrink: 0 }}>{order.totalPrice.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 500 }}>万</span></span>
                  </div>
                  {/* 图片补充进度 */}
                  {order.photoStatus && order.photoStatus !== '已完成' && (
                    <div style={{ background: 'var(--orange-bg)', borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 500 }}>📷 图片{order.photoStatus}</span>
                      <span style={{ fontSize: 11, color: 'var(--orange)' }}>
                        {order.vehicles.filter((v) => v.photoCompleted).length}/{order.vehicles.length} 台已完成
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* 单车采购：原有样式 */
                <div style={{ padding: '0' }}>
                  {order.vehicles.map((v, vi) => (
                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px' }}>
                      <div style={{ width: 64, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #e8e8e8, #d5d5d5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={getCarThumb(idx * 3 + vi)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{v.plateNo}</span>
                          <span className="price" style={{ fontSize: 15, flexShrink: 0 }}>{v.price.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 500 }}>万</span></span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.brandModel}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 采购单底部 */}
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
                    <User size={12} color="var(--text-2)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.ownerName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 12 }}>
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
      <button className="fab" onClick={() => setShowMenu(!showMenu)}><Plus size={24} /></button>
      {showMenu && (
        <>
          <div className="overlay" onClick={() => setShowMenu(false)} />
          <div className="fab-menu">
            {[
              { icon: <Car size={18} color="var(--brand)" />, label: '单车采购', path: '/purchase/create' },
              { icon: <FileSpreadsheet size={18} color="var(--brand)" />, label: '批量导入', path: '/purchase/batch-import' },
              { icon: <ImagePlus size={18} color="var(--brand)" />, label: '图片补充', path: '/purchase/photo-supplement' },
            ].map((item) => (
              <button key={item.label} className="fab-menu-item" onClick={() => { setShowMenu(false); navigate(item.path) }}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
