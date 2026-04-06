import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle, XCircle, Clock, Loader, FileText, User, Building2, Car, Send, ShieldCheck } from 'lucide-react'
import { mockApprovals } from '../../shared/mock/approvalMock'
import { approvalStatusTagColor, approvalTypeTagColor } from '../../shared/constants/approvalStatusMap'

export default function ApprovalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const record = mockApprovals.find((r) => r.id === id)
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [opinion, setOpinion] = useState('')

  if (!record) {
    return (
      <div className="page">
        <div className="nav-dark"><button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button><div className="nav-title">审批详情</div><div className="nav-right" /></div>
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-2)' }}>未找到审批记录</div>
      </div>
    )
  }

  const sts = approvalStatusTagColor[record.status] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
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
    alert(`操作: ${action === 'approve' ? '通过' : '驳回'}\n意见: ${opinion}`)
    setAction(null)
    setOpinion('')
  }

  return (
    <div className="page" style={{ paddingBottom: isPending ? 180 : 40 }}>
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
        {record.amount !== undefined && (
          <div>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 4 }}>涉及金额</div>
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
          { icon: <FileText size={14} color="var(--text-2)" />, label: '关联单号', value: record.bizOrderId },
          { icon: <User size={14} color="var(--text-2)" />, label: '申请人', value: `${record.applicant}（${record.applicantRole}）` },
          { icon: <Building2 size={14} color="var(--text-2)" />, label: '经销公司', value: record.dealerCompany },
          ...(record.plateNo ? [{ icon: <Car size={14} color="var(--blue)" />, label: '车牌号', value: record.plateNo }] : []),
          ...(record.brandModel ? [{ icon: <Car size={14} color="var(--text-2)" />, label: '车型', value: record.brandModel }] : []),
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
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: action === 'reject' ? 'var(--red)' : 'var(--text-0)' }}>
                {action === 'approve' ? '审批通过' : action === 'reject' ? '审批驳回' : '转交审批'}
              </div>
              <textarea
                value={opinion} onChange={(e) => setOpinion(e.target.value)}
                placeholder={action === 'approve' ? '请输入审批意见（选填）' : '请输入审批意见'}
                style={{
                  width: '100%', height: 60, borderRadius: 10, border: '1px solid var(--border)',
                  padding: '10px 12px', fontSize: 14, resize: 'none', outline: 'none',
                  background: 'var(--bg)', fontFamily: 'var(--font-body)',
                }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={() => { setAction(null); setOpinion('') }} className="btn-secondary" style={{ flex: 1, padding: 12 }}>取消</button>
                <button onClick={handleSubmit} className="btn-primary" style={{
                  flex: 1, padding: 12,
                  background: action === 'reject' ? 'var(--red)' : 'var(--brand)',
                  boxShadow: action === 'reject' ? '0 4px 12px rgba(255,59,48,0.2)' : undefined,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Send size={14} />
                    确认提交
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
