import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp, FileText, Download, Paperclip, CheckCircle, Clock, UserCheck } from 'lucide-react'
import { mockContracts } from '../../shared/mock/contractMock'
import { contractStatusTagColor, contractTypeTagColor } from '../../shared/constants/contractStatusMap'
import type { ContractVehicleItem } from '../../shared/types/Contract.types'

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="weui-cell" style={{ padding: '10px 16px' }}>
      <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--weui-FG-1)' }}>{label}</div>
      <div className="weui-cell__ft" style={{ fontSize: 14, fontWeight: highlight ? 600 : 400, color: highlight ? 'var(--brand)' : 'var(--weui-FG-0)' }}>{value}</div>
    </div>
  )
}

function VehiclePanel({ v, index, total }: { v: ContractVehicleItem; index: number; total: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div style={{ background: '#fff', margin: '8px 16px', borderRadius: 8, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="tag tag-info" style={{ fontSize: 11 }}>#{index + 1}/{total}</span>
          <span style={{ fontWeight: 600 }}>{v.plateNo}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="price">{v.contractPrice.toFixed(2)}万</span>
          {open ? <ChevronUp size={16} color="var(--weui-FG-2)" /> : <ChevronDown size={16} color="var(--weui-FG-2)" />}
        </div>
      </div>
      {open && (
        <div className="weui-cells" style={{ margin: 0 }}>
          <InfoRow label="VIN码" value={v.vin} />
          <InfoRow label="品牌型号" value={v.brandModel} />
          <InfoRow label="合同价" value={`${v.contractPrice.toFixed(2)}万元`} highlight />
        </div>
      )}
    </div>
  )
}

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contract = mockContracts.find((c) => c.id === id) || mockContracts[0]
  const isMulti = contract.vehicleCount > 1
  const ts = contractStatusTagColor[contract.status] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const tt = contractTypeTagColor[contract.contractType] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
  const signedCount = contract.parties.filter((p) => p.signed).length

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">合同详情</div>
        <div className="nav-right" />
      </div>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%)', padding: '16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(232,53,46,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={16} />
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>{contract.id}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{contract.contractType}</span>
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{contract.statusText}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, position: 'relative' }}>
          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.12)', fontWeight: 500 }}>{isMulti ? `${contract.vehicleCount}台` : '单车'}</span>
          <span style={{ fontSize: 13, opacity: 0.7 }}>{contract.dealerCompany}</span>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-num)' }}>
            合同金额 <span style={{ color: 'var(--brand-soft)' }}>{contract.totalAmount.toFixed(2)}</span><span style={{ fontSize: 13, fontWeight: 500 }}>万</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, position: 'relative' }}>
          <span style={{ fontSize: 11, opacity: 0.4 }}>创建时间：{contract.createTime}</span>
          <span style={{ fontSize: 11, opacity: 0.4 }}>关联单号：{contract.bizOrderId}</span>
        </div>
      </div>

      {/* 签署进度 */}
      <div className="section-hd">签署进度（{signedCount}/{contract.parties.length}）</div>
      <div style={{ margin: '0 16px', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        {contract.parties.map((p, i) => (
          <div key={i} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < contract.parties.length - 1 ? '0.5px solid var(--weui-FG-3)' : 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: p.signed ? 'var(--green-bg)' : 'var(--bg)', color: p.signed ? 'var(--green)' : 'var(--text-3)',
            }}>
              {p.signed ? <CheckCircle size={16} /> : <Clock size={16} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: 'var(--bg)', color: 'var(--text-2)' }}>{p.role}</span>
              </div>
              {p.delegated && (
                <div style={{ fontSize: 11, color: 'var(--orange)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <UserCheck size={11} />委托代签：{p.delegateName}
                </div>
              )}
              {p.phone && <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{p.phone}</div>}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {p.signed ? (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>已签署</div>
                  {p.signTime && <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{p.signTime.slice(5)}</div>}
                </div>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 500 }}>待签署</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 车辆清单 */}
      <div className="section-hd" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>车辆清单</span>
        {isMulti && <span className="tag tag-info">{contract.vehicleCount}台</span>}
      </div>
      {!isMulti ? (
        <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
          <InfoRow label="车牌号" value={contract.vehicles[0].plateNo} />
          <InfoRow label="VIN码" value={contract.vehicles[0].vin} />
          <InfoRow label="品牌型号" value={contract.vehicles[0].brandModel} />
          <InfoRow label="合同价" value={`${contract.vehicles[0].contractPrice.toFixed(2)}万元`} highlight />
        </div>
      ) : (
        <>
          {contract.vehicles.map((v, i) => <VehiclePanel key={v.id} v={v} index={i} total={contract.vehicleCount} />)}
          <div style={{ margin: '8px 16px', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--brand-bg)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-1)' }}>{contract.vehicleCount}台合计</span>
            <span className="price" style={{ fontSize: 16, fontWeight: 700 }}>{contract.totalAmount.toFixed(2)}万元</span>
          </div>
        </>
      )}

      {/* 合同信息 */}
      <div className="section-hd">合同信息</div>
      <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
        <InfoRow label="合同类型" value={contract.contractType} />
        <InfoRow label="经销公司" value={contract.dealerCompany} />
        <InfoRow label="关联业务单号" value={contract.bizOrderId} />
        <InfoRow label="创建时间" value={contract.createTime} />
        {contract.signTime && <InfoRow label="签署完成时间" value={contract.signTime} />}
        <InfoRow label="合同附件" value={contract.hasAttachment ? (contract.offlineUpload ? '线下上传' : '电子合同') : '暂无'} />
      </div>

      {/* 附件区域 */}
      {contract.hasAttachment && (
        <>
          <div className="section-hd">合同附件</div>
          <div style={{ margin: '0 16px', background: '#fff', borderRadius: 8, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
              <Paperclip size={14} color="var(--text-2)" />
              <span style={{ fontSize: 13, flex: 1 }}>{contract.id}_合同.pdf</span>
              <Download size={14} color="var(--brand)" />
            </div>
            {contract.offlineUpload && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                <Paperclip size={14} color="var(--text-2)" />
                <span style={{ fontSize: 13, flex: 1 }}>{contract.id}_扫描件.jpg</span>
                <Download size={14} color="var(--brand)" />
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ height: 16 }} />

      {/* Bottom actions */}
      <div className="bottom-bar" style={{ flexWrap: 'wrap', gap: 8 }}>
        {contract.status === 'pending_sign' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看合同PDF')}>预览合同</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('发起签署')}>发起签署</button>
          </div>
        )}
        {contract.status === 'signing' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看合同PDF')}>预览合同</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('签署合同')}>签署合同</button>
          </div>
        )}
        {contract.status === 'signed' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('下载合同')}>下载合同</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('归档合同')}>归档</button>
          </div>
        )}
        {contract.status === 'archived' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('下载合同')}>下载合同</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>返回列表</button>
          </div>
        )}
      </div>
    </div>
  )
}
