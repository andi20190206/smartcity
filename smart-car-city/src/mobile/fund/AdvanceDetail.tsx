import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, CreditCard, User, Building2, Car, FileText, AlertTriangle, CheckCircle, Clock, Loader, XCircle } from 'lucide-react'
import { mockAdvanceRecords } from '../../shared/mock/fundMock'
import { advanceStatusTagColor, withdrawStatusTagColor } from '../../shared/constants/fundStatusMap'

export default function AdvanceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const record = mockAdvanceRecords.find((r) => r.id === id)

  if (!record) {
    return (
      <div className="page">
        <div className="nav-dark">
          <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
          <div className="nav-title">垫款详情</div>
          <div className="nav-right" />
        </div>
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-2)' }}>未找到垫款记录</div>
      </div>
    )
  }

  const ats = advanceStatusTagColor[record.status] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const wts = withdrawStatusTagColor[record.withdrawStatus] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const remaining = record.contractAmount - record.advancedAmount

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={20} color="var(--orange)" />
      case 'approving': return <Loader size={20} color="var(--blue)" />
      case 'approved': return <CheckCircle size={20} color="var(--green)" />
      case 'rejected': return <XCircle size={20} color="var(--red)" />
      case 'withdrawn': return <CheckCircle size={20} color="var(--text-1)" />
      case 'withdraw_failed': return <AlertTriangle size={20} color="var(--red)" />
      default: return <Clock size={20} color="var(--text-2)" />
    }
  }

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">垫款详情</div>
        <div className="nav-right" />
      </div>

      {/* 状态卡片 */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '20px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          {getStatusIcon(record.status)}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{record.statusText}</div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{record.id}</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>申请垫款金额</div>
            <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-num)', letterSpacing: -1 }}>
              {record.applyAmount.toFixed(2)}
              <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.6, marginLeft: 2 }}>万</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
              background: wts.bg, color: wts.color,
            }}>{record.withdrawStatusText}</span>
          </div>
        </div>
      </div>

      {/* 提现失败提示 */}
      {record.status === 'withdraw_failed' && record.failReason && (
        <div className="anim d2" style={{
          margin: '0 16px 12px', padding: '12px 14px', borderRadius: 12,
          background: 'var(--red-bg)', border: '1px solid rgba(255,59,48,0.15)',
          display: 'flex', alignItems: 'flex-start', gap: 8,
        }}>
          <AlertTriangle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)', marginBottom: 2 }}>提现失败</div>
            <div style={{ fontSize: 12, color: 'var(--red)', opacity: 0.8 }}>{record.failReason}</div>
          </div>
        </div>
      )}

      {/* 金额信息 */}
      <div className="section-hd">金额信息</div>
      <div className="anim d2" style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { label: '采购合同金额', value: `${record.contractAmount.toFixed(2)} 万` },
          { label: '已垫金额', value: `${record.advancedAmount.toFixed(2)} 万` },
          { label: '本次申请金额', value: `${record.applyAmount.toFixed(2)} 万`, highlight: true },
          { label: '剩余可垫金额', value: `${remaining.toFixed(2)} 万` },
          { label: '资金来源', value: record.fundSource },
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

      {/* 车辆信息 */}
      <div className="section-hd">车辆信息</div>
      <div className="anim d3" style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { icon: <Car size={14} color="var(--blue)" />, label: '车牌号', value: record.plateNo },
          { icon: <FileText size={14} color="var(--text-2)" />, label: 'VIN码', value: record.vin },
          { icon: null, label: '车型', value: record.brandModel },
          { icon: null, label: '采购单号', value: record.purchaseOrderId },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {item.icon}
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500, maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* 收款信息 */}
      <div className="section-hd">收款信息</div>
      <div className="anim d4" style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { icon: <User size={14} color="var(--text-2)" />, label: '卖方', value: record.sellerName },
          { icon: <Building2 size={14} color="var(--text-2)" />, label: '收款银行', value: record.sellerBank },
          { icon: <CreditCard size={14} color="var(--text-2)" />, label: '银行卡号', value: record.sellerCardNo },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {item.icon}
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500 }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* 时间线 */}
      <div className="section-hd">操作记录</div>
      <div className="anim d5" style={{
        margin: '0 16px 20px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '16px',
      }}>
        {[
          { time: record.createTime, label: '发起垫款申请', done: true },
          { time: record.approveTime, label: record.status === 'rejected' ? '审批驳回' : '审批通过', done: !!record.approveTime },
          { time: record.withdrawTime, label: record.withdrawStatus === 'failed' ? '提现失败' : '提现完成', done: !!record.withdrawTime },
        ].map((step, i, arr) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < arr.length - 1 ? 16 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: step.done ? 'var(--brand)' : 'var(--text-3)',
                flexShrink: 0,
              }} />
              {i < arr.length - 1 && (
                <div style={{ width: 1.5, flex: 1, background: step.done ? 'var(--brand)' : 'var(--border)', marginTop: 4 }} />
              )}
            </div>
            <div style={{ paddingBottom: i < arr.length - 1 ? 4 : 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: step.done ? 'var(--text-0)' : 'var(--text-3)' }}>{step.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, fontFamily: 'var(--font-num)' }}>
                {step.time || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
