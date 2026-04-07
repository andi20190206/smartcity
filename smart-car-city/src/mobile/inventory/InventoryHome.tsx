import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Warehouse, Shield, MapPin, Wifi, WifiOff,
  AlertTriangle, Camera, CameraOff, Clock, Search, Filter, Package,
  FileCheck, Bell, ClipboardList, X, CheckCircle, XCircle, Phone,
  Upload, Tag,
} from 'lucide-react'
import { mockSupervisedVehicles, mockAlertRecords, mockVehicleUseRecords, mockInventoryChecks } from '../../shared/mock/inventoryMock'
import { stockStatusTagColor, supervisionStatusTagColor, alertLevelTagColor, salesFlowTabs, salesFlowTagColor } from '../../shared/constants/inventoryStatusMap'
import type { SupervisedVehicle } from '../../shared/types/Inventory.types'

type SectionKey = 'vehicles' | 'alerts' | 'use' | 'check'

export default function InventoryHome() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<SectionKey>('vehicles')
  const [salesFlowFilter, setSalesFlowFilter] = useState('all')
  const [searchText, setSearchText] = useState('')

  // 入库弹窗
  const [entryModal, setEntryModal] = useState<SupervisedVehicle | null>(null)
  const [entryFailed, setEntryFailed] = useState(false)
  // 上架弹窗
  const [listingModal, setListingModal] = useState<SupervisedVehicle | null>(null)
  const [listingPrice, setListingPrice] = useState('')
  const [hasReport, setHasReport] = useState<'有' | '无'>('有')
  const [listingRemark, setListingRemark] = useState('')

  const stats = useMemo(() => {
    const total = mockSupervisedVehicles.length
    const inStock = mockSupervisedVehicles.filter((v) => v.stockStatus === 'in_stock').length
    const supervising = mockSupervisedVehicles.filter((v) => v.supervisionStatus === 'supervising').length
    const alerting = mockAlertRecords.filter((a) => a.alertStatus === 'alerting').length
    const pendingIn = mockSupervisedVehicles.filter((v) => v.salesFlowStatus === 'pending_in').length
    const pendingListing = mockSupervisedVehicles.filter((v) => v.salesFlowStatus === 'pending_listing').length
    const onSale = mockSupervisedVehicles.filter((v) => v.salesFlowStatus === 'on_sale').length
    const overAge = mockSupervisedVehicles.filter((v) => v.stockDays >= 60).length
    return { total, inStock, supervising, alerting, pendingIn, pendingListing, onSale, overAge }
  }, [])

  const filteredVehicles = useMemo(() => {
    let list = mockSupervisedVehicles
    if (salesFlowFilter !== 'all') list = list.filter((v) => v.salesFlowStatus === salesFlowFilter)
    if (searchText) {
      const s = searchText.toLowerCase()
      list = list.filter((v) =>
        v.plateNo.includes(s) || v.vin.toLowerCase().includes(s) || v.brandModel.includes(s)
      )
    }
    return list
  }, [salesFlowFilter, searchText])

  const openEntry = (v: SupervisedVehicle) => { setEntryModal(v); setEntryFailed(false) }
  const openListing = (v: SupervisedVehicle) => {
    setListingModal(v); setListingPrice(v.listingPrice ? String(v.listingPrice * 10000) : ''); setHasReport('有'); setListingRemark('')
  }

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">车辆管理</div>
        <div className="nav-right" />
      </div>

      {/* 销售流程条 */}
      <div className="anim d1" style={{
        margin: '10px 16px 0', background: 'var(--brand)', borderRadius: 10, padding: '8px 14px',
        display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto',
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>销售流程:</span>
        {['入库', '查验', '上架', '销售', '付款', '完成'].map((s, i, arr) => (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 500, whiteSpace: 'nowrap' }}>{s}</span>
            {i < arr.length - 1 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>→</span>}
          </span>
        ))}
        <ChevronRight size={14} color="rgba(255,255,255,0.5)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
      </div>

      {/* 搜索 */}
      <div className="anim d1" style={{
        display: 'flex', alignItems: 'center', gap: 8, margin: '10px 16px 0',
        background: '#fff', borderRadius: 10, padding: '8px 12px',
        border: '1px solid var(--border)',
      }}>
        <Search size={16} color="var(--text-3)" />
        <input
          value={searchText} onChange={(e) => setSearchText(e.target.value)}
          placeholder="支持VIN码、车牌搜索"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent', color: 'var(--text-0)' }}
        />
      </div>

      {/* 销售流程状态筛选 Tabs */}
      <div className="anim d2" style={{ display: 'flex', padding: '10px 16px 0', gap: 6, overflowX: 'auto' }}>
        {salesFlowTabs.map((tab) => (
          <button key={tab.key} onClick={() => setSalesFlowFilter(tab.key)} style={{
            padding: '5px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: salesFlowFilter === tab.key ? 600 : 400,
            background: salesFlowFilter === tab.key ? 'var(--brand)' : 'rgba(0,0,0,0.03)',
            color: salesFlowFilter === tab.key ? '#fff' : 'var(--text-2)',
            whiteSpace: 'nowrap', transition: 'all 0.2s',
            textDecoration: salesFlowFilter === tab.key ? 'underline' : 'none',
            textUnderlineOffset: 3,
          }}>{tab.title}</button>
        ))}
      </div>

      {/* 车辆卡片列表 */}
      <div style={{ padding: '10px 16px 100px' }}>
        {filteredVehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无车辆数据</div>
        ) : filteredVehicles.map((v, idx) => {
          const sfc = salesFlowTagColor[v.salesFlowStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
          return (
            <div key={v.id} className={`anim d${Math.min(idx + 1, 5)}`}
              style={{
                background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)', marginBottom: 10, overflow: 'hidden', cursor: 'pointer',
              }}>
              <div onClick={() => navigate(`/inventory/detail/${v.id}`)} style={{ display: 'flex', padding: '12px 14px', gap: 10 }}>
                {/* 车辆缩略图 */}
                <div style={{ width: 80, height: 60, borderRadius: 8, background: 'var(--bg)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"><rect fill="%23e8e8e8" width="80" height="60" rx="4"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="9">${encodeURIComponent(v.brandModel.slice(0, 6))}</text></svg>`}
                    alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{v.brandModel.length > 18 ? v.brandModel.slice(0, 18) + '...' : v.brandModel}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font-num)' }}>
                    {v.plateNo} | VIN后四位 {v.vin.slice(-4)}
                  </div>
                </div>
              </div>
              {/* 操作按钮 */}
              <div style={{ padding: '0 14px 12px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                {v.salesFlowStatus === 'pending_in' && (
                  <button onClick={(e) => { e.stopPropagation(); openEntry(v) }}
                    style={{ padding: '6px 16px', borderRadius: 20, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    确认入库
                  </button>
                )}
                {v.salesFlowStatus === 'pending_listing' && (
                  <button onClick={(e) => { e.stopPropagation(); openListing(v) }}
                    style={{ padding: '6px 16px', borderRadius: 20, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    申请上架
                  </button>
                )}
                {v.salesFlowStatus === 'on_sale' && v.listingPrice && (
                  <span style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    售价 <span style={{ fontFamily: 'var(--font-num)', fontWeight: 700, color: 'var(--brand)', fontSize: 14 }}>{v.listingPrice.toFixed(2)}</span>万
                  </span>
                )}
              </div>
            </div>
          )
        })}
        {filteredVehicles.length > 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-3)', fontSize: 12 }}>没有更多了～</div>
        )}
      </div>

      {/* ===== 入库弹窗 ===== */}
      {entryModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setEntryModal(null)} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 201,
            background: '#fff', borderRadius: '20px 20px 0 0',
            paddingBottom: 'env(safe-area-inset-bottom)',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>车辆入库</span>
              <button onClick={() => setEntryModal(null)} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>
                <X size={16} />
              </button>
            </div>

            {/* 提示 */}
            <div style={{ margin: '12px 20px', padding: '10px 14px', borderRadius: 10, background: 'var(--orange-bg)', fontSize: 12, color: 'var(--orange)', lineHeight: 1.6 }}>
              入库前请确保车辆在店，并已成功安装硬件OBD
            </div>

            {/* 入库失败弹窗 */}
            {entryFailed && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                <div style={{ position: 'relative', background: '#fff', borderRadius: 16, padding: '28px 24px', width: 300, textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>入库失败</div>
                  <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 6 }}>入库失败</div>
                  <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 6 }}>原因：车辆实时定位不在电子围栏内</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 20 }}>请联系市场相关人员处理</div>
                  <button onClick={() => setEntryFailed(false)}
                    style={{ padding: '10px 40px', borderRadius: 8, border: 'none', background: 'var(--blue)', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                    关闭
                  </button>
                </div>
              </div>
            )}

            {/* 仓库选择 */}
            <div style={{ padding: '0 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-1)' }}><span style={{ color: 'var(--brand)' }}>*</span>待入仓库</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-0)', fontWeight: 500 }}>{entryModal.entryWarehouse || '智慧门店SM-A区'}</span>
                  <ChevronRight size={16} color="var(--text-3)" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-1)' }}>入库地址</span>
                <span style={{ fontSize: 14, color: 'var(--text-0)' }}>{entryModal.entryAddress || '广东广州市天河区酷狗音乐'}</span>
              </div>
              {/* 监管方案提示 */}
              <div style={{ padding: '12px 0', fontSize: 12, color: 'var(--text-2)' }}>
                监管方案：<span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{entryModal.supervisionPlan}</span>
                {entryModal.supervisionPlan.includes('GPS') && <span style={{ marginLeft: 8, color: 'var(--blue)' }}>GPS设备将在入库+1天早9:00自动确认</span>}
              </div>
            </div>

            {/* 确认入库按钮 */}
            <div style={{ padding: '16px 20px 20px' }}>
              <button onClick={() => setEntryFailed(true)}
                style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                确认入库
              </button>
            </div>
          </div>
          <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
        </>
      )}

      {/* ===== 上架弹窗 ===== */}
      {listingModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setListingModal(null)} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 201,
            background: '#fff', borderRadius: '20px 20px 0 0',
            paddingBottom: 'env(safe-area-inset-bottom)',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>车辆上架</span>
              <button onClick={() => setListingModal(null)} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>
                <X size={16} />
              </button>
            </div>

            {/* 提示 */}
            <div style={{ margin: '12px 20px', padding: '10px 14px', borderRadius: 10, background: 'var(--green-bg)', fontSize: 12, color: 'var(--green)', lineHeight: 1.6 }}>
              车辆上架需上传真实有效查验报告，报告提交审核通过车辆将自动上架，您可联系业务人员加快报告审核速度
            </div>

            <div style={{ padding: '0 20px' }}>
              {/* 车辆售价 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-1)' }}>车辆售价</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input type="number" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)}
                    placeholder="请输入" style={{ width: 100, textAlign: 'right', border: 'none', outline: 'none', fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-num)', color: 'var(--text-0)', background: 'transparent' }} />
                  <span style={{ fontSize: 14, color: 'var(--text-2)' }}>元</span>
                </div>
              </div>

              {/* 查验报告 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-1)' }}>查验报告</span>
                <div style={{ display: 'flex', gap: 16 }}>
                  {(['有', '无'] as const).map((opt) => (
                    <label key={opt} onClick={() => setHasReport(opt)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 14 }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        border: hasReport === opt ? 'none' : '2px solid var(--text-3)',
                        background: hasReport === opt ? 'var(--brand)' : 'transparent',
                      }}>
                        {hasReport === opt && <CheckCircle size={14} color="#fff" />}
                      </span>
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* 有报告：上传 */}
              {hasReport === '有' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-1)' }}>查验报告</span>
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>上传真实有效查验报告二维码图片</span>
                  </div>
                  <div style={{ padding: '12px 0' }}>
                    <div style={{ width: 80, height: 80, borderRadius: 8, background: 'var(--bg)', border: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer' }}>
                      <Upload size={20} color="var(--text-3)" />
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>上传</span>
                    </div>
                  </div>
                </>
              )}

              {/* 无报告：呼叫查验上门 */}
              {hasReport === '无' && (
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 16 }}>本次查验服务机构：唯车查验</div>
                </div>
              )}

              {/* 备注 */}
              <div style={{ padding: '14px 0', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-1)' }}>备注</span>
                </div>
                <textarea value={listingRemark} onChange={(e) => setListingRemark(e.target.value)}
                  placeholder="额外说明，100字以内" maxLength={100} rows={2}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-0)', background: 'transparent', resize: 'none' }} />
                <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--text-3)' }}>{listingRemark.length}/100</div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div style={{ padding: '8px 20px 20px' }}>
              {hasReport === '有' ? (
                <button onClick={() => { alert('上架申请已提交'); setListingModal(null) }}
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                  申请上架
                </button>
              ) : (
                <button onClick={() => { alert('已呼叫查验上门'); setListingModal(null) }}
                  style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: 'var(--brand)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                  呼叫查验上门
                </button>
              )}
            </div>
          </div>
          <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
        </>
      )}
    </div>
  )
}
