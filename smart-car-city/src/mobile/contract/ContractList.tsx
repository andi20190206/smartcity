import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search, ChevronRight, FileText, Users, Paperclip } from 'lucide-react'
import { mockContracts } from '../../shared/mock/contractMock'
import { contractStatusTabs, contractStatusTagColor, contractTypeTagColor } from '../../shared/constants/contractStatusMap'

export default function ContractList() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = mockContracts.filter((c) => {
    if (activeTab !== 'all' && c.status !== activeTab) return false
    if (!search) return true
    const s = search.toLowerCase()
    return c.id.toLowerCase().includes(s) || c.bizOrderId.toLowerCase().includes(s)
      || c.dealerCompany.includes(s)
      || c.parties.some((p) => p.name.includes(s))
      || c.vehicles.some((v) => v.plateNo.includes(s) || v.vin.toLowerCase().includes(s))
  })

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">合同管理</div>
        <div className="nav-right" />
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
        {contractStatusTabs.map((t) => (
          <div key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: '0 0 auto', padding: '12px 14px', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索合同号/业务单号/车牌/签约方"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: 'var(--text-0)' }} />
        </div>
      </div>

      {/* Card list */}
      <div style={{ padding: '4px 0 80px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-2)', fontSize: 14 }}>暂无数据</div>
        ) : filtered.map((contract, idx) => {
          const ts = contractStatusTagColor[contract.status] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
          const tt = contractTypeTagColor[contract.contractType] || { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' }
          const signedCount = contract.parties.filter((p) => p.signed).length
          const isMulti = contract.vehicleCount > 1
          return (
            <div key={contract.id} className={`anim d${Math.min(idx + 1, 5)}`}
              onClick={() => navigate(`/contract/detail/${contract.id}`)}
              style={{
                margin: '10px 16px', background: '#fff', borderRadius: 14,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden', cursor: 'pointer',
              }}>
              {/* Header */}
              <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={14} color="var(--text-2)" />
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.3 }}>{contract.id}</span>
                  <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, fontWeight: 600, background: ts.bg, color: ts.color }}>{contract.statusText}</span>
                </div>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600, background: tt.bg, color: tt.color }}>
                  {contract.contractType}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '10px 14px' }}>
                {/* 车辆信息 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{contract.vehicles[0].plateNo}</span>
                  {isMulti && <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: 'var(--blue-bg)', color: 'var(--blue)' }}>共{contract.vehicleCount}台</span>}
                  <span className="price" style={{ fontSize: 15, marginLeft: 'auto' }}>{contract.totalAmount.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 500 }}>万</span></span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {contract.vehicles[0].brandModel}
                </div>

                {/* 签署进度 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Users size={12} color="var(--text-2)" />
                  <span style={{ fontSize: 12, color: 'var(--text-1)' }}>签署进度：{signedCount}/{contract.parties.length}</span>
                  <div style={{ flex: 1, height: 4, background: 'var(--bg)', borderRadius: 2, overflow: 'hidden', marginLeft: 4 }}>
                    <div style={{ width: `${(signedCount / contract.parties.length) * 100}%`, height: '100%', background: signedCount === contract.parties.length ? 'var(--green)' : 'var(--brand)', borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-2)' }}>关联：{contract.bizOrderId}</span>
                  {contract.hasAttachment && <Paperclip size={11} color="var(--text-2)" />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-num)' }}>{contract.createTime.slice(5)}</span>
                  <ChevronRight size={14} color="var(--text-3)" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
