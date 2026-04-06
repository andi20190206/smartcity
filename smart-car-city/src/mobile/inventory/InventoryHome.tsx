import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Warehouse, Shield, MapPin, Wifi, WifiOff,
  AlertTriangle, Camera, CameraOff, Clock, Search, Filter, Package,
  FileCheck, Bell, ClipboardList,
} from 'lucide-react'
import { mockSupervisedVehicles, mockAlertRecords, mockVehicleUseRecords, mockInventoryChecks } from '../../shared/mock/inventoryMock'
import { stockStatusTagColor, supervisionStatusTagColor, alertLevelTagColor } from '../../shared/constants/inventoryStatusMap'

type SectionKey = 'vehicles' | 'alerts' | 'use' | 'check'

export default function InventoryHome() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState<SectionKey>('vehicles')
  const [stockFilter, setStockFilter] = useState('all')
  const [searchText, setSearchText] = useState('')

  const stats = useMemo(() => {
    const total = mockSupervisedVehicles.length
    const inStock = mockSupervisedVehicles.filter((v) => v.stockStatus === 'in_stock').length
    const supervising = mockSupervisedVehicles.filter((v) => v.supervisionStatus === 'supervising').length
    const alerting = mockAlertRecords.filter((a) => a.alertStatus === 'alerting').length
    const pendingIn = mockSupervisedVehicles.filter((v) => v.stockStatus === 'pending_in').length
    const overAge = mockSupervisedVehicles.filter((v) => v.stockDays >= 60).length
    return { total, inStock, supervising, alerting, pendingIn, overAge }
  }, [])

  const filteredVehicles = useMemo(() => {
    let list = mockSupervisedVehicles
    if (stockFilter !== 'all') list = list.filter((v) => v.stockStatus === stockFilter)
    if (searchText) {
      const s = searchText.toLowerCase()
      list = list.filter((v) =>
        v.plateNo.includes(s) || v.vin.toLowerCase().includes(s) || v.brandModel.includes(s)
      )
    }
    return list
  }, [stockFilter, searchText])

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">库存监管</div>
        <div className="nav-right" />
      </div>

      {/* 统计卡片 */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '20px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Shield size={18} color="var(--brand-soft)" />
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', opacity: 0.9 }}>监管总览</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: '在库车辆', value: stats.inStock, color: '#7DFFB3' },
            { label: '监管中', value: stats.supervising, color: '#fff' },
            { label: '待入库', value: stats.pendingIn, color: '#FFD666' },
          ].map((item) => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-num)', color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}>
          {[
            { label: '告警中', value: stats.alerting, color: stats.alerting > 0 ? '#FF6B5A' : '#fff' },
            { label: '库龄≥60天', value: stats.overAge, color: stats.overAge > 0 ? '#FF6B5A' : '#fff' },
            { label: '车辆总数', value: stats.total, color: '#fff' },
          ].map((item) => (
            <div key={item.label} style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-num)', color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="anim d2" style={{
        margin: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8,
      }}>
        {[
          { icon: Package, label: '入库确认', color: 'var(--brand)', bg: 'var(--brand-bg)', path: '' },
          { icon: FileCheck, label: '签注管理', color: 'var(--blue)', bg: 'var(--blue-bg)', path: '/inventory/registration' },
          { icon: Bell, label: '告警记录', color: 'var(--orange)', bg: 'var(--orange-bg)', path: '' },
          { icon: ClipboardList, label: '库存盘点', color: 'var(--green)', bg: 'var(--green-bg)', path: '' },
        ].map((item) => (
          <button key={item.label} onClick={() => {
            if (item.label === '告警记录') setActiveSection('alerts')
            else if (item.label === '库存盘点') setActiveSection('check')
            else if (item.path) navigate(item.path)
          }} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '12px 8px', background: '#fff', borderRadius: 12,
            border: '1px solid var(--border)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: item.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <item.icon size={18} color={item.color} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)' }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Section Tabs */}
      <div className="anim d3" style={{ display: 'flex', padding: '0 16px', gap: 6, marginBottom: 8 }}>
        {([
          { key: 'vehicles' as const, label: '监管车辆' },
          { key: 'alerts' as const, label: '告警记录' },
          { key: 'use' as const, label: '用车管理' },
          { key: 'check' as const, label: '库存盘点' },
        ]).map((tab) => (
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
        {activeSection === 'vehicles' && (
          <VehicleSection
            vehicles={filteredVehicles}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
            searchText={searchText}
            setSearchText={setSearchText}
            navigate={navigate}
          />
        )}
        {activeSection === 'alerts' && <AlertSection navigate={navigate} />}
        {activeSection === 'use' && <UseSection navigate={navigate} />}
        {activeSection === 'check' && <CheckSection />}
      </div>
    </div>
  )
}

/* ---- 监管车辆列表 ---- */
function VehicleSection({ vehicles, stockFilter, setStockFilter, searchText, setSearchText, navigate }: {
  vehicles: typeof mockSupervisedVehicles
  stockFilter: string
  setStockFilter: (v: string) => void
  searchText: string
  setSearchText: (v: string) => void
  navigate: ReturnType<typeof useNavigate>
}) {
  return (
    <div style={{ padding: '0 16px' }}>
      {/* 搜索 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        background: '#fff', borderRadius: 10, padding: '8px 12px',
        border: '1px solid var(--border)',
      }}>
        <Search size={16} color="var(--text-3)" />
        <input
          value={searchText} onChange={(e) => setSearchText(e.target.value)}
          placeholder="搜索车牌/VIN/品牌"
          style={{
            flex: 1, border: 'none', outline: 'none', fontSize: 14,
            background: 'transparent', color: 'var(--text-0)',
          }}
        />
      </div>

      {/* 库存状态筛选 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, overflowX: 'auto' }}>
        {[
          { key: 'all', label: '全部' },
          { key: 'pending_in', label: '待入库' },
          { key: 'in_stock', label: '在库' },
          { key: 'out_stock', label: '出库' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setStockFilter(tab.key)} style={{
            padding: '5px 12px', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: stockFilter === tab.key ? 600 : 400,
            background: stockFilter === tab.key ? 'var(--brand-bg)' : 'rgba(0,0,0,0.03)',
            color: stockFilter === tab.key ? 'var(--brand)' : 'var(--text-2)',
            whiteSpace: 'nowrap', transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* 车辆卡片列表 */}
      {vehicles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无车辆数据</div>
      ) : vehicles.map((v, idx) => {
        const ss = stockStatusTagColor[v.stockStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
        const svs = supervisionStatusTagColor[v.supervisionStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
        return (
          <div key={v.id} className={`anim d${Math.min(idx + 1, 5)}`}
            onClick={() => navigate(`/inventory/detail/${v.id}`)}
            style={{
              background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)', marginBottom: 10, overflow: 'hidden', cursor: 'pointer',
              borderLeft: v.isScrapped ? '3px solid var(--red)' : v.stockDays >= 60 ? '3px solid var(--orange)' : undefined,
            }}>
            {/* Header */}
            <div style={{
              padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{v.plateNo}</span>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: ss.bg, color: ss.color }}>
                  {v.stockStatusText}
                </span>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: svs.bg, color: svs.color }}>
                  {v.supervisionStatusText}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {v.deviceOnline === 'online'
                  ? <Wifi size={14} color="var(--green)" />
                  : <WifiOff size={14} color="var(--text-3)" />}
                {v.cameraStatus === '正常'
                  ? <Camera size={14} color="var(--blue)" />
                  : <CameraOff size={14} color="var(--red)" />}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{v.brandModel}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6, fontFamily: 'var(--font-num)' }}>
                VIN: {v.vin}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Warehouse size={12} color="var(--text-2)" />
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{v.warehouse}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} color={v.stockDays >= 60 ? 'var(--orange)' : 'var(--text-2)'} />
                  <span style={{
                    fontSize: 12, fontFamily: 'var(--font-num)', fontWeight: 600,
                    color: v.stockDays >= 60 ? 'var(--orange)' : v.stockDays >= 45 ? 'var(--orange)' : 'var(--text-2)',
                  }}>
                    库龄 {v.stockDays}天
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{v.salesperson} · {v.companyName}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {v.isScrapped && (
                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'var(--red-bg)', color: 'var(--red)', fontWeight: 600 }}>报废</span>
                  )}
                  {v.isSpecialEntry && (
                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'var(--orange-bg)', color: 'var(--orange)', fontWeight: 600 }}>特殊入库</span>
                  )}
                  <ChevronRight size={14} color="var(--text-3)" />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---- 告警记录 ---- */
function AlertSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div style={{ padding: '0 16px' }}>
      {/* 告警统计 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12,
      }}>
        {[
          { label: '报警中', value: mockAlertRecords.filter((a) => a.alertStatus === 'alerting').length, color: 'var(--red)' },
          { label: '处理中', value: mockAlertRecords.filter((a) => a.alertStatus === 'processing').length, color: 'var(--orange)' },
          { label: '已结束', value: mockAlertRecords.filter((a) => a.alertStatus === 'ended').length, color: 'var(--text-2)' },
        ].map((item) => (
          <div key={item.label} style={{
            background: '#fff', borderRadius: 10, padding: '10px 12px', textAlign: 'center',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-num)', color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {mockAlertRecords.map((a, idx) => {
        const lc = alertLevelTagColor[a.alertLevel] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
        return (
          <div key={a.id} className={`anim d${Math.min(idx + 1, 5)}`} style={{
            background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', marginBottom: 10, overflow: 'hidden',
            borderLeft: a.alertStatus === 'alerting' ? '3px solid var(--red)' : undefined,
          }}>
            <div style={{
              padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color={a.alertStatus === 'alerting' ? 'var(--red)' : 'var(--text-2)'} />
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{a.alertNo}</span>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: lc.bg, color: lc.color }}>
                  {a.alertLevel === 'high' ? '高' : a.alertLevel === 'medium' ? '中' : '低'}
                </span>
              </div>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                background: a.alertStatus === 'alerting' ? 'var(--red-bg)' : a.alertStatus === 'processing' ? 'var(--orange-bg)' : 'rgba(0,0,0,0.04)',
                color: a.alertStatus === 'alerting' ? 'var(--red)' : a.alertStatus === 'processing' ? 'var(--orange)' : 'var(--text-2)',
              }}>{a.alertStatusText}</span>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{a.alertType}</div>
              <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 6 }}>{a.alertContent}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.plateNo}</span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{a.triggerTime}</span>
              </div>
              {a.remark && (
                <div style={{
                  marginTop: 6, padding: '6px 10px', borderRadius: 8,
                  background: 'var(--bg-warm)', fontSize: 12, color: 'var(--text-2)',
                }}>
                  备注: {a.remark}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---- 用车管理 ---- */
function UseSection({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div style={{ padding: '0 16px' }}>
      {mockVehicleUseRecords.map((r, idx) => {
        const statusColor: Record<string, { bg: string; color: string }> = {
          using: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
          completed: { bg: 'var(--green-bg)', color: 'var(--green)' },
          expired: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
          pending_approval: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
          rejected: { bg: 'var(--red-bg)', color: 'var(--red)' },
        }
        const sc = statusColor[r.useStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
        return (
          <div key={r.id} className={`anim d${Math.min(idx + 1, 5)}`} style={{
            background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', marginBottom: 10, overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{r.id}</span>
              <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: sc.bg, color: sc.color }}>
                {r.useStatusText}
              </span>
            </div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{r.plateNo}</span>
                <span style={{ fontSize: 12, padding: '1px 6px', borderRadius: 4, background: 'var(--blue-bg)', color: 'var(--blue)', fontWeight: 500 }}>
                  {r.useType}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>
                提车人: {r.pickerName}（{r.pickerType}）
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>
                用车时段: {r.useDuration}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>申请人: {r.applicant}</span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{r.applyTime.slice(5)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ---- 库存盘点 ---- */
function CheckSection() {
  return (
    <div style={{ padding: '0 16px' }}>
      {mockInventoryChecks.map((c, idx) => (
        <div key={c.id} className={`anim d${Math.min(idx + 1, 5)}`} style={{
          background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)', marginBottom: 10, padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={16} color="var(--blue)" />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{c.warehouse}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                background: c.checkStatus === 'checking' ? 'var(--blue-bg)' : 'rgba(0,0,0,0.04)',
                color: c.checkStatus === 'checking' ? 'var(--blue)' : 'var(--text-2)',
              }}>{c.checkStatusText}</span>
              <span style={{
                fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                background: c.checkResult === '正常' ? 'var(--green-bg)' : 'var(--red-bg)',
                color: c.checkResult === '正常' ? 'var(--green)' : 'var(--red)',
              }}>{c.checkResult}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)' }}>
            <span>盘点类型: {c.checkTypeText}</span>
            <span>车辆数: <span style={{ fontWeight: 600, fontFamily: 'var(--font-num)', color: 'var(--text-0)' }}>{c.totalCount}</span></span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
            <span>盘点人: {c.checker}</span>
            <span style={{ fontFamily: 'var(--font-num)', fontSize: 10, color: 'var(--text-3)' }}>
              {c.finishTime || c.createTime}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
