import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, CheckCircle, XCircle, Clock, FileText, User, Building2, Car, Send, ArrowRightLeft, ChevronDown, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Minus, Info, CreditCard, Banknote, HelpCircle } from 'lucide-react'
import { mockApprovals } from '../../shared/mock/approvalMock'
import { approvalStatusTagColor, approvalTypeTagColor } from '../../shared/constants/approvalStatusMap'
import type { VehiclePricingInfo } from '../../shared/types/Approval.types'

const transferCandidates = [
  { id: 'u1', name: '陈经理', role: '经销公司管理员', company: '广州天河旗舰店' },
  { id: 'u2', name: '王总', role: '经销公司管理员', company: '深圳福田精品店' },
  { id: 'u3', name: '刘主管', role: '平台审批员', company: '平台' },
  { id: 'u4', name: '赵财务', role: '财务主管', company: '广州天河旗舰店' },
  { id: 'u5', name: '银行审批岗', role: '资方审批员', company: '合作银行' },
]

export default function ApprovalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialAction = searchParams.get('action') as 'approve' | 'reject' | 'transfer' | null
  const record = mockApprovals.find((r) => r.id === id)
  const [action, setAction] = useState<'approve' | 'reject' | 'transfer' | null>(initialAction)
  const [opinion, setOpinion] = useState('')
  const [transferTo, setTransferTo] = useState<string | null>(null)
  const [showTransferPicker, setShowTransferPicker] = useState(false)

  if (!record) {
    return (
      <div className="page">
        <div className="nav-dark">
          <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
          <div className="nav-title">审批详情</div>
          <div className="nav-right" />
        </div>
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-2)' }}>未找到审批记录</div>
      </div>
    )
  }
  const tts = approvalTypeTagColor[record.type] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const isPending = record.status === 'pending' || record.status === 'approving'

  const getNodeIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={18} color="var(--green)" />
      case 'rejected': return <XCircle size={18} color="var(--red)" />
      case 'pending': return <Clock size={18} color="var(--orange)" />
      default: return <Clock size={18} color="var(--text-3)" />
    }
  }

  const handleSubmit = () => {
    if (action === 'transfer') {
      const target = transferCandidates.find((c) => c.id === transferTo)
      alert(`转交审批: ${record.id}\n转交给: ${target?.name}（${target?.role}）\n转交说明: ${opinion}`)
    } else {
      alert(`操作: ${action === 'approve' ? '通过' : '驳回'}\n意见: ${opinion}`)
    }
    setAction(null)
    setOpinion('')
    setTransferTo(null)
  }

  return (
    <div className="page" style={{ paddingBottom: isPending ? 200 : 40 }}>
      <div className="nav-dark" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)' }}>
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">审批详情</div>
        <div className="nav-right" />
      </div>

      {/* Status header card */}
      <div className="anim d1" style={{
        margin: '12px 16px', borderRadius: 16, overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)',
        color: '#fff', padding: '20px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          {getNodeIcon(record.status)}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{record.statusText}</div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{record.id}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600, background: tts.bg, color: tts.color }}>{record.typeText}</span>
          </div>
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, marginBottom: 12 }}>{record.summary}</div>
        {record.type === 'purchase' && record.purchaseMode && (
          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
              background: record.purchaseMode === 'batch' ? 'var(--blue-bg)' : 'var(--green-bg)',
              color: record.purchaseMode === 'batch' ? 'var(--blue)' : 'var(--green)',
            }}>
              {record.purchaseMode === 'batch' ? `多台采购（${record.vehiclePricingList?.length || 0}台）` : '单台采购'}
            </span>
          </div>
        )}
        {record.amount !== undefined && (
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>{record.type === 'purchase' ? '采购金额' : '涉及金额'}</div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-num)', letterSpacing: -1 }}>
              {record.amount.toFixed(2)}
              <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.6, marginLeft: 2 }}>万</span>
            </div>
          </div>
        )}
      </div>

      {/* 驳回理由 */}
      {record.status === 'rejected' && (() => {
        const rejectNode = record.nodes.find((n) => n.status === 'rejected')
        return rejectNode?.opinion ? (
          <div className="anim d1" style={{
            margin: '0 16px 12px', padding: '12px 14px', borderRadius: 12,
            background: 'var(--red-bg)', border: '1px solid rgba(255,59,48,0.15)',
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <XCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)', marginBottom: 2 }}>审批已驳回</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', marginBottom: 2 }}>驳回人: {rejectNode.approverName}（{rejectNode.approverRole}）</div>
              <div style={{ fontSize: 12, color: 'var(--red)', opacity: 0.8 }}>驳回理由: {rejectNode.opinion}</div>
            </div>
          </div>
        ) : null
      })()}

      {/* 基本信息 */}
      <div className="section-hd">基本信息</div>
      <div className="anim d2" style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { icon: <FileText size={14} color="var(--blue)" />, label: '审批单号', value: record.id },
          { icon: <FileText size={14} color="var(--text-2)" />, label: '关联单号', value: record.bizOrderId, isLink: true },
          { icon: <User size={14} color="var(--text-2)" />, label: '申请人', value: `${record.applicant}（${record.applicantRole}）` },
          { icon: <Building2 size={14} color="var(--text-2)" />, label: '经销公司', value: record.dealerCompany },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {item.icon}
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
            </div>
            {'isLink' in item && item.isLink ? (
              <a href={`/pc/approval/${item.value}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 500, textDecoration: 'underline' }}>
                {item.value}
              </a>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500, maxWidth: '55%', textAlign: 'right', wordBreak: 'break-all' }}>{item.value}</span>
            )}
          </div>
        ))}
      </div>
      {/* 垫款审批专用：车辆信息卡片 */}
      {record.type === 'advance' && record.advanceDetail && (
        <>
          <div className="section-hd">车辆信息</div>
          <div className="anim d2" style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 14,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-0)', marginBottom: 4 }}>{record.advanceDetail.brandModel}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>{record.advanceDetail.registerDate} | {record.advanceDetail.condition}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--brand)' }}>{record.advanceDetail.plateNo}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
              {[
                { label: '车辆状态', value: record.advanceDetail.vehicleStatus },
                { label: '在门店库', value: record.advanceDetail.warehouseInfo },
                { label: '过户状态', value: record.advanceDetail.transferStatus },
                { label: '车款', value: record.advanceDetail.paymentType },
              ].map((item) => (
                <div key={item.label} style={{ padding: '10px 8px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-2)', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-0)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-hd">金额信息</div>
          <div className="anim d2" style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 14,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
            {[
              { label: '合同价：', value: `${record.advanceDetail.contractPrice.toLocaleString()}元`, color: 'var(--brand)', bold: true },
              { label: '申请垫款：', value: `${record.advanceDetail.applyAdvance.toLocaleString()}元`, color: 'var(--brand)', bold: true },
              ...(record.advanceDetail.regionTotalAdvance ? [{ label: '区域总垫身', value: record.advanceDetail.regionTotalAdvance, color: 'var(--text-0)', bold: false }] : []),
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
                <span style={{ fontSize: item.bold ? 15 : 13, fontWeight: item.bold ? 700 : 500, fontFamily: 'var(--font-num)', color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="section-hd">收款人信息</div>
          <div className="anim d3" style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 14,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
            {[
              { icon: <User size={14} color="var(--text-2)" />, label: '收款人', value: record.advanceDetail.sellerName },
              { icon: <Building2 size={14} color="var(--text-2)" />, label: '开户行', value: record.advanceDetail.sellerBank },
              { icon: <CreditCard size={14} color="var(--text-2)" />, label: '银行卡号', value: record.advanceDetail.sellerCardNo },
              ...(record.advanceDetail.sellerPhone ? [{ icon: <User size={14} color="var(--text-2)" />, label: '手机号', value: record.advanceDetail.sellerPhone }] : []),
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {item.icon}
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-0)', fontWeight: 500, maxWidth: '55%', textAlign: 'right', wordBreak: 'break-all' }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="section-hd">门店额度信息</div>
          <div className="anim d3" style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 14,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}>
            {[
              { label: '待审批垫款：', value: `${record.advanceDetail.pendingAdvance.toLocaleString()}元` },
              { label: '可申请额度：', value: `${record.advanceDetail.applyableQuota.toLocaleString()}元` },
              { label: '可用合作款项：', value: `${record.advanceDetail.availableDeposit.toLocaleString()}元`, warn: record.advanceDetail.availableDeposit < 0 },
              { label: '可用额度：', value: `${record.advanceDetail.availableQuota.toLocaleString()}元` },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
                <span style={{
                  fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-num)',
                  color: item.warn ? 'var(--red)' : 'var(--text-0)',
                }}>{item.value}</span>
              </div>
            ))}
            {record.advanceDetail.availableDeposit < 0 && (
              <div style={{
                margin: '0 12px 10px', padding: '8px 10px', borderRadius: 8,
                background: 'var(--red-bg)', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <AlertTriangle size={13} color="var(--red)" />
                <span style={{ fontSize: 12, color: 'var(--red)' }}>!!本次申请已超实缴合作款项</span>
              </div>
            )}
            <div style={{
              margin: '0 12px 10px', padding: '10px 12px', borderRadius: 8,
              background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                <HelpCircle size={12} color="var(--text-2)" />
                <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>额度说明</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.8 }}>
                <div>待审批垫款：门店所有待审批垫款汇总求和</div>
                <div>可用额度：最大额度 - 未销售回款车辆的累计在途金额 - 待审批垫款</div>
                <div>可用合作款项：合作款项 - 未签注车辆的累计在途金额 - 待审批垫款</div>
                <div>可申请额度：≤ 可用额度</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 车辆定价信息 - 仅采购审批，紧跟基本信息 */}
      {record.type === 'purchase' && record.vehiclePricingList && record.vehiclePricingList.length > 0 && (
        <>
          <div className="section-hd">车辆定价信息{record.vehiclePricingList.length > 1 ? `（共${record.vehiclePricingList.length}台）` : ''}</div>
          {record.vehiclePricingList.map((v: VehiclePricingInfo, idx: number) => (
            <div key={v.vin} className="anim d3" style={{
              margin: `0 16px ${idx < record.vehiclePricingList!.length - 1 ? 8 : 12}px`,
              background: '#fff', borderRadius: 14,
              border: v.pricingStatus === 'no_price' ? '1px solid rgba(255,149,0,0.3)' : '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
            }}>
              {record.vehiclePricingList!.length > 1 && (
                <div style={{
                  padding: '10px 16px', background: 'rgba(0,0,0,0.02)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'var(--blue-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--blue)',
                  }}>{idx + 1}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{v.plateNo}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1 }}>{v.brandModel}</span>
                </div>
              )}
              <div style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <DollarSign size={13} color="var(--text-2)" />
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>采购价</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-num)', color: 'var(--text-0)' }}>{v.purchasePrice.toFixed(2)}万</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: v.pricingStatus === 'no_price' ? 8 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrendingUp size={13} color="var(--blue)" />
                    <span style={{ fontSize: 13, color: 'var(--text-2)' }}>建议采购价</span>
                  </div>
                  {v.pricingStatus === 'priced' && v.suggestedPrice !== null ? (
                    <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-num)', color: 'var(--blue)' }}>{v.suggestedPrice.toFixed(2)}万</span>
                  ) : (
                    <span style={{
                      fontSize: 12, padding: '2px 8px', borderRadius: 6,
                      background: 'var(--orange-bg)', color: 'var(--orange)', fontWeight: 600,
                    }}>暂无定价</span>
                  )}
                </div>
                {v.pricingStatus === 'priced' && v.deviationRate !== undefined && (
                  <div style={{
                    marginTop: 8, padding: '6px 10px', borderRadius: 8,
                    background: v.deviationRate < -10 ? 'var(--red-bg)' : v.deviationRate < 0 ? 'var(--green-bg)' : 'var(--orange-bg)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    {v.deviationRate < 0 ? <TrendingDown size={13} color="var(--green)" /> : v.deviationRate > 0 ? <TrendingUp size={13} color="var(--orange)" /> : <Minus size={13} color="var(--text-2)" />}
                    <span style={{
                      fontSize: 12, fontWeight: 500,
                      color: v.deviationRate < -10 ? 'var(--red)' : v.deviationRate < 0 ? 'var(--green)' : 'var(--orange)',
                    }}>
                      偏差率: {v.deviationRate > 0 ? '+' : ''}{v.deviationRate.toFixed(2)}%
                      {v.deviationRate < -10 ? '（偏差较大，请关注）' : v.deviationRate < 0 ? '（低于建议价）' : v.deviationRate > 0 ? '（高于建议价）' : ''}
                    </span>
                  </div>
                )}
                {v.pricingStatus === 'no_price' && (
                  <div style={{
                    padding: '8px 10px', borderRadius: 8,
                    background: 'rgba(255,149,0,0.06)', border: '1px solid rgba(255,149,0,0.15)',
                    display: 'flex', alignItems: 'flex-start', gap: 6,
                  }}>
                    <Info size={13} color="var(--orange)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12, color: 'var(--orange)', lineHeight: 1.5 }}>
                      定价接口未返回该车型建议价，请审批人结合市场行情自行评估采购价格合理性
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* 门店授信额度 - 仅采购审批 */}
      {record.type === 'purchase' && record.dealerCredit && (
        <>
          <div className="section-hd">门店授信额度</div>
          <div className="anim d2" style={{
            margin: '0 16px 12px', background: '#fff', borderRadius: 14,
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 16px', background: 'linear-gradient(135deg, rgba(0,122,255,0.06) 0%, rgba(88,86,214,0.04) 100%)',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Building2 size={14} color="var(--blue)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-0)' }}>{record.dealerCredit.storeName}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: '最大额度', value: record.dealerCredit.maxQuota, color: 'var(--text-0)' },
                  { label: '在途额度', value: record.dealerCredit.inTransitQuota, color: 'var(--orange)' },
                  { label: '可用额度', value: record.dealerCredit.availableQuota, color: record.dealerCredit.availableQuota < 0 ? 'var(--red)' : 'var(--green)' },
                  { label: '可申请额度', value: record.dealerCredit.applyableQuota, color: record.dealerCredit.applyableQuota < 0 ? 'var(--red)' : 'var(--blue)' },
                ].map((item) => (
                  <div key={item.label} style={{ flex: '1 1 calc(50% - 4px)', minWidth: 0, textAlign: 'center', padding: '8px 4px', background: 'rgba(255,255,255,0.8)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-num)', color: item.color }}>{item.value.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-2)' }}>万</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>本次采购占用</span>
              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-num)', color: 'var(--brand)' }}>{record.dealerCredit.currentPurchaseAmount.toFixed(2)}万</span>
            </div>
            {record.dealerCredit.applyableQuota < 0 && (
              <div style={{
                margin: '0 12px 10px', padding: '8px 10px', borderRadius: 8,
                background: 'var(--red-bg)', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <AlertTriangle size={13} color="var(--red)" />
                <span style={{ fontSize: 12, color: 'var(--red)' }}>额度预警：可申请额度为负数，请谨慎审批</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* 审批流程 */}
      <div className="section-hd">审批流程</div>
      <div className="anim d3" style={{
        margin: '0 16px 12px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '16px',
      }}>
        {record.nodes.map((node, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < record.nodes.length - 1 ? 20 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: node.status === 'approved' ? 'var(--green-bg)' : node.status === 'rejected' ? 'var(--red-bg)' : node.status === 'pending' && record.currentNode === node.nodeIndex ? 'var(--orange-bg)' : 'rgba(0,0,0,0.04)',
                flexShrink: 0,
              }}>
                {getNodeIcon(node.status)}
              </div>
              {i < record.nodes.length - 1 && (
                <div style={{ width: 2, flex: 1, background: node.status === 'approved' ? 'var(--green)' : 'var(--border)', marginTop: 4, borderRadius: 1, minHeight: 20 }} />
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: i < record.nodes.length - 1 ? 4 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: node.status === 'pending' && record.currentNode === node.nodeIndex ? 'var(--brand)' : 'var(--text-0)' }}>
                  {node.nodeName}
                </span>
                <span style={{
                  fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600,
                  background: node.status === 'approved' ? 'var(--green-bg)' : node.status === 'rejected' ? 'var(--red-bg)' : 'var(--orange-bg)',
                  color: node.status === 'approved' ? 'var(--green)' : node.status === 'rejected' ? 'var(--red)' : 'var(--orange)',
                }}>
                  {node.status === 'approved' ? '已通过' : node.status === 'rejected' ? '已驳回' : '待审批'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 2 }}>
                审批人: {node.approverName}（{node.approverRole}）
              </div>
              {node.opinion && (
                <div style={{
                  marginTop: 6, padding: '8px 10px', borderRadius: 8,
                  background: node.status === 'rejected' ? 'var(--red-bg)' : 'var(--green-bg)',
                  fontSize: 12, color: node.status === 'rejected' ? 'var(--red)' : 'var(--green)',
                }}>
                  审批意见: {node.opinion}
                </div>
              )}
              {node.time && (
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-num)' }}>{node.time}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 时间信息 */}
      <div className="section-hd">时间信息</div>
      <div className="anim d4" style={{
        margin: '0 16px 20px', background: '#fff', borderRadius: 14,
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
      }}>
        {[
          { label: '提交时间', value: record.createTime },
          { label: '最后更新', value: record.updateTime },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{item.label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-0)', fontFamily: 'var(--font-num)' }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* 审批操作区 */}
      {isPending && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, zIndex: 100,
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '0.5px solid var(--border)',
          padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        }}>
          {action ? (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: action === 'reject' ? 'var(--red)' : action === 'transfer' ? 'var(--blue)' : 'var(--text-0)' }}>
                {action === 'approve' ? '审批通过' : action === 'reject' ? '审批驳回' : '转交审批'}
              </div>

              {/* 转交人选择 */}
              {action === 'transfer' && (
                <div style={{ marginBottom: 10 }}>
                  <div onClick={() => setShowTransferPicker(!showTransferPicker)} style={{
                    padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)',
                    background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 14, color: transferTo ? 'var(--text-0)' : 'var(--text-2)' }}>
                      {transferTo ? (() => {
                        const t = transferCandidates.find((c) => c.id === transferTo)
                        return `${t?.name}（${t?.role}）- ${t?.company}`
                      })() : '请选择转交人'}
                    </span>
                    <ChevronDown size={16} color="var(--text-2)" style={{ transform: showTransferPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {showTransferPicker && (
                    <div style={{
                      marginTop: 6, borderRadius: 10, border: '1px solid var(--border)',
                      background: '#fff', overflow: 'hidden', boxShadow: 'var(--shadow-md)',
                      maxHeight: 200, overflowY: 'auto',
                    }}>
                      {transferCandidates.map((c) => (
                        <div key={c.id} onClick={() => { setTransferTo(c.id); setShowTransferPicker(false) }} style={{
                          padding: '10px 12px', borderBottom: '1px solid var(--border)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                          background: transferTo === c.id ? 'var(--blue-bg)' : '#fff',
                        }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%', background: 'var(--blue-bg)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <User size={14} color="var(--blue)" />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-0)' }}>{c.name}（{c.role}）</div>
                            <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{c.company}</div>
                          </div>
                          {transferTo === c.id && <CheckCircle size={16} color="var(--blue)" style={{ marginLeft: 'auto' }} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <textarea
                value={opinion} onChange={(e) => setOpinion(e.target.value)}
                placeholder={action === 'approve' ? '请输入审批意见（选填）' : action === 'transfer' ? '请输入转交说明（选填）' : '请输入驳回原因（必填）'}
                style={{
                  width: '100%', height: 60, borderRadius: 10, border: '1px solid var(--border)',
                  padding: '10px 12px', fontSize: 14, resize: 'none', outline: 'none',
                  background: 'var(--bg)', fontFamily: 'var(--font-body)',
                }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={() => { setAction(null); setOpinion(''); setTransferTo(null); setShowTransferPicker(false) }} className="btn-secondary" style={{ flex: 1, padding: 12 }}>取消</button>
                <button
                  onClick={handleSubmit}
                  disabled={action === 'transfer' && !transferTo}
                  className="btn-primary"
                  style={{
                    flex: 1, padding: 12,
                    background: action === 'reject' ? 'var(--red)' : action === 'transfer' ? 'var(--blue)' : 'var(--brand)',
                    boxShadow: action === 'reject' ? '0 4px 12px rgba(255,59,48,0.2)' : action === 'transfer' ? '0 4px 12px rgba(0,122,255,0.2)' : undefined,
                    opacity: action === 'transfer' && !transferTo ? 0.5 : 1,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {action === 'transfer' ? <ArrowRightLeft size={14} /> : <Send size={14} />}
                    {action === 'transfer' ? '确认转交' : '确认提交'}
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setAction('reject')} style={{
                flex: 1, padding: '12px 0', borderRadius: 12, border: '1.5px solid var(--red)',
                background: 'var(--red-bg)', color: 'var(--red)', fontSize: 15, fontWeight: 600,
                fontFamily: 'var(--font-display)', cursor: 'pointer',
              }}>驳回</button>
              <button onClick={() => setAction('transfer')} style={{
                flex: 1, padding: '12px 0', borderRadius: 12, border: '1.5px solid var(--blue)',
                background: 'var(--blue-bg)', color: 'var(--blue)', fontSize: 15, fontWeight: 600,
                fontFamily: 'var(--font-display)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                <ArrowRightLeft size={15} /> 转交
              </button>
              <button onClick={() => setAction('approve')} className="btn-primary" style={{ flex: 1.5, padding: 12 }}>
                通过
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}