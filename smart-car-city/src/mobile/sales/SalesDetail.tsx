import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Landmark } from 'lucide-react'
import { mockSalesOrders } from '../../shared/mock/salesMock'
import type { SalesVehicleItem } from '../../shared/types/Sales.types'

function InfoRow({ label, value, price, loss }: { label: string; value: string; price?: boolean; loss?: boolean }) {
  return (
    <div className="weui-cell" style={{ padding: '10px 16px' }}>
      <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--weui-FG-1)' }}>{label}</div>
      <div className="weui-cell__ft" style={{
        fontSize: 14, fontWeight: price || loss ? 600 : 400,
        color: loss ? 'var(--red)' : price ? 'var(--brand)' : 'var(--weui-FG-0)',
      }}>{value}</div>
    </div>
  )
}

function VehiclePanel({ v, index, total }: { v: SalesVehicleItem; index: number; total: number }) {
  const [open, setOpen] = useState(index === 0)
  const isLoss = v.profitLoss < 0
  return (
    <div style={{ background: '#fff', margin: '8px 16px', borderRadius: 8, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="tag tag-info" style={{ fontSize: 11 }}>#{index + 1}/{total}</span>
          <span style={{ fontWeight: 600 }}>{v.plateNo}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="price">{v.salesPrice.toFixed(2)}万</span>
          <span style={{ fontSize: 11, color: isLoss ? 'var(--red)' : 'var(--green)', fontWeight: 600, fontFamily: 'var(--font-num)' }}>
            {isLoss ? '' : '+'}{v.profitLoss.toFixed(2)}
          </span>
          {open ? <ChevronUp size={16} color="var(--weui-FG-2)" /> : <ChevronDown size={16} color="var(--weui-FG-2)" />}
        </div>
      </div>
      {open && (
        <div className="weui-cells" style={{ margin: 0 }}>
          <InfoRow label="采购单号" value={v.purchaseOrderId} />
          <InfoRow label="VIN码" value={v.vin} />
          <InfoRow label="品牌型号" value={v.brandModel} />
          <InfoRow label="发动机号" value={v.engineNo} />
          <InfoRow label="使用性质" value={v.useType} />
          <InfoRow label="里程" value={`${v.mileage}万公里`} />
          <InfoRow label="上牌日期" value={v.registerDate} />
          <InfoRow label="采购合同价" value={`${v.contractPrice.toFixed(2)}万元`} />
          <InfoRow label="销售价" value={`${v.salesPrice.toFixed(2)}万元`} price />
          <InfoRow label="盈亏" value={`${v.profitLoss >= 0 ? '+' : ''}${v.profitLoss.toFixed(2)}万元`} loss={isLoss} />
        </div>
      )}
    </div>
  )
}

export default function SalesDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = mockSalesOrders.find((o) => o.id === id) || mockSalesOrders[0]
  const isMulti = order.vehicles.length > 1
  const isLoss = order.totalProfitLoss < 0

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">销售详情</div>
        <div className="nav-right" />
      </div>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%)', padding: '16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(232,53,46,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative' }}>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>{order.id}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {isLoss && (
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600, background: 'rgba(255,59,48,0.2)', color: '#FF6B5A', display: 'flex', alignItems: 'center', gap: 3 }}>
                <TrendingDown size={12} />亏损
              </span>
            )}
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{order.statusText}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, position: 'relative' }}>
          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.12)', fontWeight: 500 }}>{isMulti ? `批量 ${order.vehicles.length}台` : '单车'}</span>
          <span style={{ fontSize: 13, opacity: 0.7 }}>买家：{order.buyerName}</span>
        </div>
        <div style={{ position: 'relative' }}>
          {isMulti ? (
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-num)' }}>
              销售总价 <span style={{ color: 'var(--brand-soft)' }}>{order.totalSalesPrice.toFixed(2)}</span><span style={{ fontSize: 13, fontWeight: 500 }}>万</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{order.vehicles[0].plateNo}</div>
              <div style={{ fontSize: 13, opacity: 0.6, marginTop: 2 }}>{order.vehicles[0].brandModel}</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-num)', marginTop: 4, color: 'var(--brand-soft)' }}>{order.totalSalesPrice.toFixed(2)}<span style={{ fontSize: 12, fontWeight: 500 }}>万</span></div>
            </>
          )}
        </div>
        <div style={{ fontSize: 11, opacity: 0.4, marginTop: 8, position: 'relative' }}>申请时间：{order.createTime}</div>
      </div>

      {/* Flow */}
      <div className="section-hd">流程进度</div>
      <div style={{ background: '#fff', margin: '0 16px', borderRadius: 8, padding: '12px 16px' }}>
        {['销售签约申请', '销售审批', '买家付款', '清分结算', '完成'].map((s, i) => {
          const statusIdx = ['pending_approval', 'approving', 'approved', 'pending_payment', 'paid', 'clearing', 'completed'].indexOf(order.status)
          const stepDone = i <= Math.floor(statusIdx / 1.5)
          return (
            <div key={s} style={{ display: 'flex', gap: 12, paddingBottom: i < 4 ? 12 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: stepDone ? 'var(--weui-brand)' : 'var(--weui-FG-3)' }} />
                {i < 4 && <div style={{ width: 1, flex: 1, background: stepDone && i < Math.floor(statusIdx / 1.5) ? 'var(--weui-brand)' : 'var(--weui-FG-3)', marginTop: 4 }} />}
              </div>
              <div style={{ fontSize: 13, color: stepDone ? 'var(--weui-FG-0)' : 'var(--weui-FG-1)', fontWeight: stepDone ? 500 : 400, paddingBottom: 4 }}>
                {s} {i === 0 && <span style={{ fontSize: 11, color: 'var(--weui-FG-1)' }}>· {order.createTime}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Vehicles */}
      <div className="section-hd" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>车辆销售明细</span>
        {isMulti && <span className="tag tag-info">{order.vehicles.length}台</span>}
      </div>

      {!isMulti ? (
        <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
          <InfoRow label="采购单号" value={order.vehicles[0].purchaseOrderId} />
          <InfoRow label="VIN码" value={order.vehicles[0].vin} />
          <InfoRow label="品牌型号" value={order.vehicles[0].brandModel} />
          <InfoRow label="发动机号" value={order.vehicles[0].engineNo} />
          <InfoRow label="使用性质" value={order.vehicles[0].useType} />
          <InfoRow label="里程" value={`${order.vehicles[0].mileage}万公里`} />
          <InfoRow label="上牌日期" value={order.vehicles[0].registerDate} />
          <InfoRow label="采购合同价" value={`${order.vehicles[0].contractPrice.toFixed(2)}万元`} />
          <InfoRow label="销售价" value={`${order.vehicles[0].salesPrice.toFixed(2)}万元`} price />
          <InfoRow label="盈亏" value={`${order.vehicles[0].profitLoss >= 0 ? '+' : ''}${order.vehicles[0].profitLoss.toFixed(2)}万元`} loss={order.vehicles[0].profitLoss < 0} />
        </div>
      ) : (
        <>
          {order.vehicles.map((v, i) => <VehiclePanel key={v.id} v={v} index={i} total={order.vehicles.length} />)}
          <div style={{ margin: '8px 16px', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isLoss ? 'var(--red-bg)' : 'var(--brand-bg)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-1)' }}>{order.vehicles.length}台合计</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 12, color: isLoss ? 'var(--red)' : 'var(--green)', fontWeight: 600, fontFamily: 'var(--font-num)' }}>
                盈亏 {order.totalProfitLoss >= 0 ? '+' : ''}{order.totalProfitLoss.toFixed(2)}万
              </span>
              <span className="price" style={{ fontSize: 16, fontWeight: 700 }}>{order.totalSalesPrice.toFixed(2)}万元</span>
            </div>
          </div>
        </>
      )}

      {/* Buyer info */}
      <div className="section-hd">买家信息</div>
      <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
        <InfoRow label="买家类型" value={order.buyerType} />
        <InfoRow label={order.buyerType === '企业' ? '企业名称' : '买家姓名'} value={order.buyerName} />
        <InfoRow label="证件号码" value={order.buyerIdNo} />
        <InfoRow label="联系电话" value={order.buyerPhone} />
      </div>

      {/* Payment info */}
      <div className="section-hd">付款信息</div>
      <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
        <InfoRow label="付款人是否为买家" value={order.payerIsBuyer ? '是（与买家一致）' : '否（第三方付款）'} />
        {/* 付款人基本信息 — 无论是否与买家一致都展示 */}
        {(() => {
          const effectiveType = order.payerIsBuyer ? order.buyerType : (order.payerType || '个人')
          const effectiveName = order.payerIsBuyer ? order.buyerName : (order.payerName || '-')
          const effectiveIdNo = order.payerIsBuyer ? order.buyerIdNo : (order.payerIdNo || '-')
          return (
            <>
              <InfoRow label="付款人类型" value={effectiveType} />
              <InfoRow label={effectiveType === '企业' ? '企业名称' : effectiveType === '个体工商户' ? '企业名称' : '付款人姓名'} value={effectiveName} />
              <InfoRow label="证件号码" value={effectiveIdNo} />
            </>
          )
        })()}
      </div>

      {/* 银行卡信息 — 根据类型区分 */}
      {(() => {
        const effectiveType = order.payerIsBuyer ? order.buyerType : (order.payerType || '个人')
        return (
          <>
            <div style={{ margin: '12px 16px 6px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Landmark size={14} color="var(--weui-brand)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--weui-FG-0)' }}>银行卡信息</span>
              <span style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 4, fontWeight: 600,
                background: effectiveType === '企业' ? 'rgba(22,119,255,0.1)' : effectiveType === '个体工商户' ? 'rgba(250,173,20,0.1)' : 'rgba(82,196,26,0.1)',
                color: effectiveType === '企业' ? '#1677ff' : effectiveType === '个体工商户' ? '#faad14' : '#52c41a',
              }}>{effectiveType}</span>
            </div>
            <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
              {/* 个人 */}
              {effectiveType === '个人' && (
                <>
                  <InfoRow label="开户名" value={order.payerName || order.buyerName || '-'} />
                  <InfoRow label="银行卡号" value={order.payerCardNo || '-'} />
                  <InfoRow label="开户行" value={order.payerBank || '-'} />
                  <InfoRow label="银行预留手机" value={order.payerPhone || '-'} />
                </>
              )}
              {/* 企业 */}
              {effectiveType === '企业' && (
                <>
                  <InfoRow label="对公账户名称" value={order.payerAccountName || '-'} />
                  <InfoRow label="对公账号" value={order.payerCardNo || '-'} />
                  <InfoRow label="所属银行" value={order.payerBank || '-'} />
                </>
              )}
              {/* 个体工商户 */}
              {effectiveType === '个体工商户' && (
                <>
                  <InfoRow label="银行卡类型" value={order.payerBankCardType || '-'} />
                  <InfoRow label="账户类型" value={order.payerAccountType || '-'} />
                  <InfoRow label="开户名" value={order.payerAccountName || order.payerName || order.buyerName || '-'} />
                  <InfoRow label="银行卡号" value={order.payerCardNo || '-'} />
                  <InfoRow label="银行名称" value={order.payerBank || '-'} />
                  <InfoRow label="银行预留手机" value={order.payerPhone || '-'} />
                </>
              )}
            </div>
          </>
        )
      })()}

      {/* Signature */}
      <div className="section-hd">签名信息</div>
      <div style={{ margin: '0 16px', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
          <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginBottom: 6 }}>销售顾问签名</div>
          <div style={{ height: 80, background: 'var(--weui-BG-1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {order.salesAdvisorSign ? (
              <svg width="160" height="50" viewBox="0 0 160 50"><path d="M10 40 Q30 10 50 30 T90 20 T130 35 T150 15" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
            ) : <span style={{ fontSize: 13, color: 'var(--text-3)' }}>未签名</span>}
            <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 10, color: 'var(--weui-FG-1)' }}>{order.salesAdvisor}（销售顾问）</div>
          </div>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginBottom: 6 }}>买家签名</div>
          <div style={{ height: 80, background: 'var(--weui-BG-1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {order.buyerSign ? (
              <svg width="140" height="50" viewBox="0 0 140 50"><path d="M15 35 Q35 5 55 25 T95 15 T125 30" stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
            ) : <span style={{ fontSize: 13, color: 'var(--text-3)' }}>未签名</span>}
            <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 10, color: 'var(--weui-FG-1)' }}>{order.buyerName}（买家）</div>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {/* Bottom actions */}
      <div className="bottom-bar" style={{ flexWrap: 'wrap', gap: 8 }}>
        {order.status === 'draft' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('编辑销售单')}>编辑</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('提交审批')}>提交审批</button>
          </div>
        )}
        {(order.status === 'pending_approval' || order.status === 'approving') && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('撤回申请')}>撤回</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>返回列表</button>
          </div>
        )}
        {order.status === 'approved' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看合同')}>查看合同</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('通知买家付款')}>通知付款</button>
          </div>
        )}
        {order.status === 'pending_payment' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看合同')}>查看合同</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('确认收款')}>确认收款</button>
          </div>
        )}
        {(order.status === 'paid' || order.status === 'clearing') && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看清分详情')}>清分详情</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>返回列表</button>
          </div>
        )}
        {order.status === 'completed' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看合同')}>查看合同</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>返回列表</button>
          </div>
        )}
        {order.status === 'rejected' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('驳回原因：销售价远低于合同价，亏损过大')}>查看原因</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('重新编辑并提交')}>重新提交</button>
          </div>
        )}
      </div>
    </div>
  )
}
