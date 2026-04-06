import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Car, AlertTriangle, Wallet, ChevronRight } from 'lucide-react'
import { mockDealerQuotas } from '../../shared/mock/fundMock'
import { mockOrders } from '../../shared/mock/purchaseMock'

export default function AdvanceCreate() {
  const navigate = useNavigate()
  const quota = mockDealerQuotas[0]
  const isNegative = quota.applyableQuota < 0

  // 模拟选择的采购单（已签约的）
  const signedOrders = mockOrders.filter((o) => o.status === 'signed' || o.status === 'pending_sign')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [showOrderPicker, setShowOrderPicker] = useState(false)

  const order = signedOrders.find((o) => o.id === selectedOrder)
  const vehicle = order?.vehicles.find((v) => v.id === selectedVehicle)

  // 模拟已垫金额
  const advancedAmount = 0
  const contractAmount = vehicle?.price || 0
  const maxApply = contractAmount - advancedAmount

  const canSubmit = selectedOrder && selectedVehicle && amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxApply

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">发起垫款</div>
        <div className="nav-right" />
      </div>

      {/* 额度提示 */}
      <div className="anim d1" style={{
        margin: '12px 16px', padding: '14px 16px', borderRadius: 12,
        background: isNegative ? 'var(--red-bg)' : 'var(--blue-bg)',
        border: `1px solid ${isNegative ? 'rgba(255,59,48,0.15)' : 'rgba(0,122,255,0.15)'}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Wallet size={18} color={isNegative ? 'var(--red)' : 'var(--blue)'} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: isNegative ? 'var(--red)' : 'var(--blue)', marginBottom: 2 }}>
            当前可申请额度
          </div>
          <div style={{
            fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-num)',
            color: isNegative ? 'var(--red)' : 'var(--blue)',
          }}>
            {quota.applyableQuota.toFixed(2)} <span style={{ fontSize: 12, fontWeight: 400 }}>万</span>
          </div>
        </div>
        {isNegative && <AlertTriangle size={18} color="var(--red)" />}
      </div>

      {/* 选择采购单 */}
      <div className="section-hd">选择采购单</div>
      <div className="anim d2" style={{ margin: '0 16px 12px' }}>
        <div onClick={() => setShowOrderPicker(true)} style={{
          background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
          padding: '14px 16px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {selectedOrder && vehicle ? (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Car size={16} color="var(--brand)" />
                <span style={{ fontSize: 15, fontWeight: 600 }}>{vehicle.plateNo}</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{order?.id}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4, marginLeft: 24 }}>{vehicle.brandModel}</div>
            </div>
          ) : (
            <span style={{ fontSize: 14, color: 'var(--text-2)' }}>请选择采购单和车辆</span>
          )}
          <ChevronRight size={16} color="var(--text-3)" />
        </div>
      </div>

      {/* 金额信息 */}
      {vehicle && (
        <>
          <div className="section-hd">金额信息</div>
          <div className="anim d3" style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 14,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
            {[
              { label: '采购合同金额', value: `${contractAmount.toFixed(2)} 万` },
              { label: '已垫金额', value: `${advancedAmount.toFixed(2)} 万` },
              { label: '可申请金额', value: `${maxApply.toFixed(2)} 万`, highlight: true },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
                <span style={{
                  fontSize: 14, fontWeight: item.highlight ? 700 : 500,
                  fontFamily: 'var(--font-num)', color: item.highlight ? 'var(--brand)' : 'var(--text-0)',
                }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* 输入垫款金额 */}
          <div className="section-hd">申请垫款金额</div>
          <div className="anim d4" style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 14,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--brand)', fontFamily: 'var(--font-num)' }}>¥</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="请输入垫款金额"
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: 24, fontWeight: 700,
                  fontFamily: 'var(--font-num)', color: 'var(--text-0)', background: 'transparent',
                }}
              />
              <span style={{ fontSize: 14, color: 'var(--text-2)', flexShrink: 0 }}>万元</span>
            </div>
            {amount && parseFloat(amount) > maxApply && (
              <div style={{
                marginTop: 8, fontSize: 12, color: 'var(--red)',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <AlertTriangle size={12} />
                超出可申请金额，最大可申请 {maxApply.toFixed(2)} 万
              </div>
            )}
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
              {[maxApply * 0.5, maxApply * 0.8, maxApply].map((v) => (
                <button key={v} onClick={() => setAmount(v.toFixed(2))} style={{
                  padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)',
                  background: 'var(--bg)', fontSize: 12, color: 'var(--text-1)', cursor: 'pointer',
                  fontFamily: 'var(--font-num)',
                }}>
                  {v.toFixed(2)}万
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 底部按钮 */}
      <div className="bottom-bar">
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>取消</button>
        <button
          className="btn-primary"
          style={{ flex: 2, opacity: canSubmit ? 1 : 0.5 }}
          disabled={!canSubmit}
          onClick={() => { if (canSubmit) navigate('/fund') }}
        >
          提交垫款申请
        </button>
      </div>

      {/* 采购单选择弹窗 */}
      {showOrderPicker && (
        <>
          <div className="overlay" onClick={() => setShowOrderPicker(false)} />
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
              <button onClick={() => setShowOrderPicker(false)} style={{
                border: 'none', background: 'none', fontSize: 14, color: 'var(--brand)', cursor: 'pointer',
              }}>关闭</button>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
              {signedOrders.map((o) => (
                <div key={o.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
                    {o.id} · {o.ownerName}
                  </div>
                  {o.vehicles.map((v) => (
                    <div key={v.id} onClick={() => {
                      setSelectedOrder(o.id)
                      setSelectedVehicle(v.id)
                      setShowOrderPicker(false)
                      setAmount('')
                    }} style={{
                      padding: '12px 14px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
                      background: selectedVehicle === v.id ? 'var(--brand-bg)' : 'var(--bg)',
                      border: selectedVehicle === v.id ? '1.5px solid var(--brand)' : '1.5px solid transparent',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{v.plateNo}</span>
                        <span className="price" style={{ fontSize: 14 }}>{v.price.toFixed(2)}万</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{v.brandModel}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
