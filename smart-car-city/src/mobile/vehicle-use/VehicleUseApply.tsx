import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Car, User, Phone, CreditCard, Clock, MapPin } from 'lucide-react'
import { mockSupervisedVehicles } from '../../shared/mock/inventoryMock'

const useTypes = ['试乘试驾', '展示出库', '维修保养', '客户看车'] as const
const pickerTypes = ['业务员', '买家', '其他'] as const

export default function VehicleUseApply() {
  const navigate = useNavigate()
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [useType, setUseType] = useState<string>('')
  const [pickerType, setPickerType] = useState<string>('')
  const [pickerName, setPickerName] = useState('')
  const [pickerPhone, setPickerPhone] = useState('')
  const [pickerIdNo, setPickerIdNo] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [showVehiclePicker, setShowVehiclePicker] = useState(false)

  const availableVehicles = mockSupervisedVehicles.filter(
    (v) => v.stockStatus === 'in_stock' && v.supervisionStatus === 'supervising'
  )
  const vehicle = availableVehicles.find((v) => v.id === selectedVehicle)

  const canSubmit = selectedVehicle && useType && pickerType && pickerName && pickerPhone && startTime && endTime

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">用车申请</div>
        <div className="nav-right" />
      </div>

      {/* 选择车辆 */}
      <div className="section-hd">选择车辆</div>
      <div className="anim d1" style={{ margin: '0 16px 12px' }}>
        <div onClick={() => setShowVehiclePicker(true)} style={{
          background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
          padding: '14px 16px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {vehicle ? (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Car size={16} color="var(--brand)" />
                <span style={{ fontSize: 15, fontWeight: 600 }}>{vehicle.plateNo}</span>
                <span style={{
                  fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600,
                  background: vehicle.deviceOnline === 'online' ? 'var(--green-bg)' : 'var(--red-bg)',
                  color: vehicle.deviceOnline === 'online' ? 'var(--green)' : 'var(--red)',
                }}>{vehicle.deviceOnline === 'online' ? '在线' : '离线'}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4, marginLeft: 24 }}>{vehicle.brandModel}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, marginLeft: 24, display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={10} />{vehicle.warehouse}
              </div>
            </div>
          ) : (
            <span style={{ fontSize: 14, color: 'var(--text-2)' }}>请选择用车车辆</span>
          )}
          <ChevronRight size={16} color="var(--text-3)" />
        </div>
      </div>

      {/* 用车类型 */}
      <div className="section-hd">用车类型</div>
      <div className="anim d2" style={{ margin: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {useTypes.map((t) => (
          <button key={t} onClick={() => setUseType(t)} style={{
            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: useType === t ? 600 : 400,
            background: useType === t ? 'var(--brand)' : '#fff',
            color: useType === t ? '#fff' : 'var(--text-1)',
            boxShadow: useType === t ? '0 2px 8px rgba(232,53,46,0.2)' : 'var(--shadow-sm)',
            transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      {/* 用车时间 */}
      <div className="section-hd">用车时间</div>
      <div className="anim d3" style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <Clock size={15} color="var(--blue)" style={{ marginRight: 10 }} />
          <span style={{ fontSize: 13, color: 'var(--text-2)', width: 70 }}>开始时间</span>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-0)', background: 'transparent', textAlign: 'right' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
          <Clock size={15} color="var(--orange)" style={{ marginRight: 10 }} />
          <span style={{ fontSize: 13, color: 'var(--text-2)', width: 70 }}>结束时间</span>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-0)', background: 'transparent', textAlign: 'right' }} />
        </div>
      </div>

      {/* 提车人信息 */}
      <div className="section-hd">提车人信息</div>
      <div className="anim d4" style={{ margin: '0 16px 12px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {pickerTypes.map((t) => (
            <button key={t} onClick={() => setPickerType(t)} style={{
              flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: pickerType === t ? 600 : 400,
              background: pickerType === t ? 'var(--dark)' : '#fff',
              color: pickerType === t ? '#fff' : 'var(--text-2)',
              boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>
        <div style={{
          background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
        }}>
          {[
            { icon: User, label: '姓名', value: pickerName, onChange: setPickerName, placeholder: '请输入提车人姓名' },
            { icon: Phone, label: '手机号', value: pickerPhone, onChange: setPickerPhone, placeholder: '请输入手机号' },
            { icon: CreditCard, label: '身份证', value: pickerIdNo, onChange: setPickerIdNo, placeholder: '请输入身份证号（选填）' },
          ].map((field, i, arr) => (
            <div key={field.label} style={{
              display: 'flex', alignItems: 'center', padding: '12px 16px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <field.icon size={15} color="var(--text-2)" style={{ marginRight: 10 }} />
              <span style={{ fontSize: 13, color: 'var(--text-2)', width: 56 }}>{field.label}</span>
              <input value={field.value} onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--text-0)', background: 'transparent', textAlign: 'right' }} />
            </div>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="bottom-bar">
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>取消</button>
        <button className="btn-primary" style={{ flex: 2, opacity: canSubmit ? 1 : 0.5 }}
          disabled={!canSubmit}
          onClick={() => { if (canSubmit) navigate('/vehicle-use') }}>
          提交用车申请
        </button>
      </div>

      {/* 车辆选择弹窗 */}
      {showVehiclePicker && (
        <>
          <div className="overlay" onClick={() => setShowVehiclePicker(false)} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, background: '#fff', borderRadius: '20px 20px 0 0',
            zIndex: 100, maxHeight: '70vh', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)' }}>选择车辆</span>
              <button onClick={() => setShowVehiclePicker(false)} style={{
                border: 'none', background: 'none', fontSize: 14, color: 'var(--brand)', cursor: 'pointer',
              }}>关闭</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
              {availableVehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无可用车辆</div>
              ) : availableVehicles.map((v) => (
                <div key={v.id} onClick={() => { setSelectedVehicle(v.id); setShowVehiclePicker(false) }} style={{
                  padding: '12px 14px', borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                  background: selectedVehicle === v.id ? 'var(--brand-bg)' : 'var(--bg)',
                  border: selectedVehicle === v.id ? '1.5px solid var(--brand)' : '1.5px solid transparent',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{v.plateNo}</span>
                    <span style={{
                      fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600,
                      background: v.deviceOnline === 'online' ? 'var(--green-bg)' : 'var(--red-bg)',
                      color: v.deviceOnline === 'online' ? 'var(--green)' : 'var(--red)',
                    }}>{v.deviceOnline === 'online' ? 'GPS在线' : 'GPS离线'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{v.brandModel}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, display: 'flex', gap: 8 }}>
                    <span>{v.warehouse}</span><span>·</span><span>库龄 {v.stockDays} 天</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
