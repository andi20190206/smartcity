import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, Shield, MapPin, Wifi, WifiOff, Camera, CameraOff,
  Clock, Warehouse, User, Phone, Building2, FileCheck, AlertTriangle,
  Car, Cpu, Navigation,
} from 'lucide-react'
import { mockSupervisedVehicles, mockAlertRecords, mockVehicleUseRecords } from '../../shared/mock/inventoryMock'
import { stockStatusTagColor, supervisionStatusTagColor, salesFlowTagColor } from '../../shared/constants/inventoryStatusMap'

export default function InventoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = mockSupervisedVehicles.find((v) => v.id === id)

  if (!vehicle) {
    return (
      <div className="page">
        <div className="nav-dark">
          <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
          <div className="nav-title">车辆详情</div>
          <div className="nav-right" />
        </div>
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-2)' }}>车辆不存在</div>
      </div>
    )
  }

  const ss = stockStatusTagColor[vehicle.stockStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const svs = supervisionStatusTagColor[vehicle.supervisionStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const sfc = salesFlowTagColor[vehicle.salesFlowStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const relatedAlerts = mockAlertRecords.filter((a) => a.plateNo === vehicle.plateNo)
  const relatedUse = mockVehicleUseRecords.filter((u) => u.plateNo === vehicle.plateNo)

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">车辆详情</div>
        <div className="nav-right" />
      </div>

      {/* 车辆头部卡片 */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '20px 18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>
              {vehicle.plateNo}
            </div>
            <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>{vehicle.brandModel}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600, background: sfc.bg, color: sfc.color }}>
              {vehicle.salesFlowStatusText}
            </span>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600, background: svs.bg, color: svs.color }}>
              {vehicle.supervisionStatusText}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>库龄</div>
            <div style={{
              fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-num)',
              color: vehicle.stockDays >= 60 ? '#FF6B5A' : vehicle.stockDays >= 45 ? '#FFD666' : '#7DFFB3',
            }}>
              {vehicle.stockDays}<span style={{ fontSize: 11, opacity: 0.6 }}>天</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>设备</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {vehicle.deviceOnline === 'online'
                ? <><Wifi size={14} color="#7DFFB3" /><span style={{ fontSize: 12, color: '#7DFFB3' }}>在线</span></>
                : <><WifiOff size={14} color="#FF6B5A" /><span style={{ fontSize: 12, color: '#FF6B5A' }}>离线</span></>}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 4 }}>摄像头</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {vehicle.cameraStatus === '正常'
                ? <><Camera size={14} color="#7DFFB3" /><span style={{ fontSize: 12, color: '#7DFFB3' }}>正常</span></>
                : <><CameraOff size={14} color="#FF6B5A" /><span style={{ fontSize: 12, color: '#FF6B5A' }}>故障</span></>}
            </div>
          </div>
        </div>

        {(vehicle.isScrapped || vehicle.isSpecialEntry) && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {vehicle.isScrapped && (
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,59,48,0.2)', color: '#FF6B5A', fontWeight: 600 }}>
                报废车辆
              </span>
            )}
            {vehicle.isSpecialEntry && (
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,149,0,0.2)', color: '#FFD666', fontWeight: 600 }}>
                特殊入库
              </span>
            )}
          </div>
        )}
      </div>

      {/* 车辆基础信息 */}
      <div className="section-hd anim d2">车辆信息</div>
      <div className="anim d2" style={{ margin: '0 16px 12px', background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {[
          { icon: Car, label: 'VIN码', value: vehicle.vin },
          { icon: Navigation, label: '当前位置', value: vehicle.location },
          { icon: Warehouse, label: '所在仓库', value: vehicle.warehouse },
          { icon: Cpu, label: '设备编号', value: vehicle.deviceNo || '未绑定' },
          { icon: Shield, label: '监管方案', value: vehicle.supervisionPlan },
          { icon: Clock, label: '垫款日期', value: vehicle.loanDate },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', padding: '12px 14px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <item.icon size={16} color="var(--text-2)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-2)', marginLeft: 8, width: 70, flexShrink: 0 }}>{item.label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500, flex: 1, textAlign: 'right', fontFamily: item.label === 'VIN码' || item.label === '设备编号' ? 'var(--font-num)' : undefined }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* 归属信息 */}
      <div className="section-hd anim d3">归属信息</div>
      <div className="anim d3" style={{ margin: '0 16px 12px', background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {[
          { icon: Building2, label: '经销公司', value: vehicle.companyName },
          { icon: Warehouse, label: '归属门店', value: vehicle.storeName },
          { icon: User, label: '业务员', value: vehicle.salesperson },
          { icon: Phone, label: '联系电话', value: vehicle.salespersonPhone },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', padding: '12px 14px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <item.icon size={16} color="var(--text-2)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--text-2)', marginLeft: 8, width: 70, flexShrink: 0 }}>{item.label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500, flex: 1, textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* 签注信息（仅库存金融车辆） */}
      {vehicle.source === '库存金融' && (
        <>
          <div className="section-hd anim d4">签注信息</div>
          <div className="anim d4" style={{ margin: '0 16px 12px', background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
            {[
              { label: '签注状态', value: vehicle.registrationStatusText || '-', highlight: vehicle.registrationStatus === 'pending' },
              { label: '原车主', value: vehicle.oldOwner || '-' },
              { label: '签约时间', value: vehicle.signTime || '-' },
              { label: '签注时间', value: vehicle.registrationTime || '-' },
              { label: '垫款状态', value: vehicle.loanStatus || '-' },
              { label: '回款状态', value: vehicle.repaymentStatus },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
                <span style={{
                  fontSize: 13, fontWeight: 500,
                  color: item.highlight ? 'var(--orange)' : 'var(--text-0)',
                }}>{item.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 上架信息（已上架车辆） */}
      {vehicle.listingPrice && (
        <>
          <div className="section-hd anim d4">上架信息</div>
          <div className="anim d4" style={{ margin: '0 16px 12px', background: '#fff', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
            {[
              { label: '零售价（售价）', value: `${vehicle.listingPrice.toFixed(2)}万元`, highlight: true },
              ...(vehicle.wholesalePrice ? [{ label: '批售价', value: `${vehicle.wholesalePrice.toFixed(2)}万元` }] : []),
              { label: '查验报告', value: vehicle.inspectionReport || '-' },
              { label: '上架时间', value: vehicle.listingTime || '-' },
              ...(vehicle.listingRemark ? [{ label: '备注', value: vehicle.listingRemark }] : []),
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
                <span style={{
                  fontSize: 13, fontWeight: 500,
                  color: (item as any).highlight ? 'var(--brand)' : 'var(--text-0)',
                  fontFamily: (item as any).highlight ? 'var(--font-num)' : undefined,
                }}>{item.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 关联告警 */}
      {relatedAlerts.length > 0 && (
        <>
          <div className="section-hd anim d5">关联告警</div>
          <div style={{ padding: '0 16px' }}>
            {relatedAlerts.map((a) => (
              <div key={a.id} className="anim d5" style={{
                background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
                padding: '12px 14px', marginBottom: 8,
                borderLeft: a.alertStatus === 'alerting' ? '3px solid var(--red)' : undefined,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={14} color={a.alertStatus === 'alerting' ? 'var(--red)' : 'var(--text-2)'} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{a.alertType}</span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{a.triggerTime}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.alertContent}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 关联用车 */}
      {relatedUse.length > 0 && (
        <>
          <div className="section-hd">关联用车</div>
          <div style={{ padding: '0 16px' }}>
            {relatedUse.map((u) => (
              <div key={u.id} style={{
                background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
                padding: '12px 14px', marginBottom: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{u.useType}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue)' }}>{u.useStatusText}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>提车人: {u.pickerName} · {u.useDuration}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 底部操作栏 */}
      <div className="bottom-bar">
        {vehicle.stockStatus === 'pending_in' && (
          <button className="btn-primary" style={{ flex: 1 }}>确认入库</button>
        )}
        {vehicle.supervisionStatus === 'supervising' && (
          <>
            <button className="btn-secondary" style={{ flex: 1 }}>用车申请</button>
            {vehicle.source === '库存金融' && vehicle.registrationStatus === 'pending' && (
              <button className="btn-primary" style={{ flex: 1 }}>确认签注</button>
            )}
          </>
        )}
        {vehicle.supervisionStatus === 'supervising' && !vehicle.deviceNo && (
          <button className="btn-primary" style={{ flex: 1 }}>OBD绑定</button>
        )}
      </div>
    </div>
  )
}
