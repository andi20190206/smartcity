import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp, Camera } from 'lucide-react'
import { mockOrders } from '../../shared/mock/purchaseMock'
import type { VehicleItem } from '../../shared/types/Purchase.types'
import { vehicleDocImages, vehiclePhotoImages, idDocImages, payeeDocImages, maintenanceImages } from '../../shared/constants/docImages'
import { getCollisionShort, getCollisionColor, getWaterDamageColor, getFireDamageShort, getFireDamageColor } from '../../shared/constants/vehicleConditionOptions'

const tagClass: Record<string, string> = {
  pending_check: 'tag-warn', pending_sign: 'tag-info', signed: 'tag-success', rejected: 'tag-error', cancelled: 'tag-default',
}

function InfoRow({ label, value, price }: { label: string; value: string; price?: boolean }) {
  return (
    <div className="weui-cell" style={{ padding: '10px 16px' }}>
      <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--weui-FG-1)' }}>{label}</div>
      <div className="weui-cell__ft" style={{ fontSize: 14, color: price ? 'var(--weui-brand)' : 'var(--weui-FG-0)', fontWeight: price ? 600 : 400 }}>{value}</div>
    </div>
  )
}

function VehiclePanel({ v, index, total }: { v: VehicleItem; index: number; total: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: '#fff', margin: '8px 16px', borderRadius: 8, overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="tag tag-info" style={{ fontSize: 11 }}>#{index + 1}/{total}</span>
          <span style={{ fontWeight: 600 }}>{v.plateNo}</span>
          <span style={{ fontSize: 12, color: 'var(--weui-FG-1)' }}>{v.brandModel.slice(0, 12)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="price">{v.price.toFixed(2)}万</span>
          {open ? <ChevronUp size={16} color="var(--weui-FG-2)" /> : <ChevronDown size={16} color="var(--weui-FG-2)" />}
        </div>
      </div>
      {open && (
        <div className="weui-cells" style={{ margin: 0 }}>
          <InfoRow label="VIN码" value={v.vin} />
          <InfoRow label="发动机号" value={v.engineNo} />
          <InfoRow label="使用性质" value={v.useType} />
          <InfoRow label="里程" value={`${v.mileage}万公里`} />
          <InfoRow label="上牌日期" value={v.registerDate} />
          <InfoRow label="颜色" value={v.color} />
          <InfoRow label="车况" value={v.condition} />
          <InfoRow label="碰撞" value={getCollisionShort(v.collision)} />
          <InfoRow label="水泡" value={v.waterDamage} />
          <InfoRow label="火烧" value={getFireDamageShort(v.fireDamage)} />
          {v.odometerStatus && <InfoRow label="里程表状态" value={v.odometerStatus} />}
          {v.conditionDesc && <InfoRow label="车况描述" value={v.conditionDesc} />}
          {/* 车辆照片 */}
          <div style={{ padding: '8px 16px 4px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-1)', marginBottom: 6, fontWeight: 500 }}>车辆照片</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {([
                ['左前45°', vehiclePhotoImages.lf45],
                ['右后45°', vehiclePhotoImages.rb45],
                ['仪表盘', vehiclePhotoImages.dashboard],
                ['座椅', vehiclePhotoImages.seat],
                ['铭牌', vehiclePhotoImages.nameplate],
                ['发动机舱', vehiclePhotoImages.engine],
              ] as const).map(([label, src]) => (
                <div key={label} style={{ aspectRatio: '1', background: 'var(--bg)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 4px 3px', fontSize: 9, color: '#fff', textAlign: 'center' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* 证件照片 */}
          <div style={{ padding: '8px 16px 12px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-1)', marginBottom: 6, fontWeight: 500 }}>证件照片</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
              {([
                ['行驶证正本', vehicleDocImages.licenseF],
                ['行驶证副本', vehicleDocImages.licenseB],
                ['登记证首页', vehicleDocImages.regF],
                ['登记证内页', vehicleDocImages.regB],
              ] as const).map(([label, src]) => (
                <div key={label} style={{ aspectRatio: '3/2', background: 'var(--bg)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                  <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 4px 3px', fontSize: 9, color: '#fff', textAlign: 'center' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PurchaseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = mockOrders.find((o) => o.id === id) || mockOrders[0]
  const isBatch = order.mode === 'batch'

  const [showLoanModal, setShowLoanModal] = useState(false)

  const handleAdvance = () => setShowLoanModal(true)

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">采购详情</div>
        <div className="nav-right" />
      </div>

      {/* Header */}
      <div style={{ background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%)', padding: '16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(232,53,46,0.08)' }} />
        {/* 第一行：采购单号 + 状态 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative' }}>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>{order.id}</span>
          <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff' }}>{order.statusText}</span>
        </div>
        {/* 第二行：车主 + 车辆数 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, position: 'relative' }}>
          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.12)', fontWeight: 500 }}>{isBatch ? `批量 ${order.vehicles.length}台` : '单车'}</span>
          <span style={{ fontSize: 13, opacity: 0.7 }}>车主：{order.ownerName}</span>
        </div>
        {/* 第三行：金额 */}
        <div style={{ position: 'relative' }}>
          {isBatch ? (
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-num)' }}>
              合计 <span style={{ color: 'var(--brand-soft)' }}>{order.totalPrice.toFixed(2)}</span><span style={{ fontSize: 13, fontWeight: 500 }}>万</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{order.vehicles[0].plateNo}</div>
              <div style={{ fontSize: 13, opacity: 0.6, marginTop: 2 }}>{order.vehicles[0].brandModel}</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-num)', marginTop: 4, color: 'var(--brand-soft)' }}>{order.totalPrice.toFixed(2)}<span style={{ fontSize: 12, fontWeight: 500 }}>万</span></div>
            </>
          )}
        </div>
        {/* 第四行：时间 */}
        <div style={{ fontSize: 11, opacity: 0.4, marginTop: 8, position: 'relative' }}>申请时间：{order.createTime}</div>
      </div>

      {/* Flow */}
      <div className="section-hd">流程进度</div>
      <div style={{ background: '#fff', margin: '0 16px', borderRadius: 8, padding: '12px 16px' }}>
        {['采购申请', '待查验', isBatch ? '逐台定价' : '定价审批', isBatch ? '合同签署(一批一合同)' : '合同签署(一车一合同)', '垫款放款'].map((s, i) => (
          <div key={s} style={{ display: 'flex', gap: 12, paddingBottom: i < 4 ? 12 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: i <= 1 ? 'var(--weui-brand)' : 'var(--weui-FG-3)' }} />
              {i < 4 && <div style={{ width: 1, flex: 1, background: i < 1 ? 'var(--weui-brand)' : 'var(--weui-FG-3)', marginTop: 4 }} />}
            </div>
            <div style={{ fontSize: 13, color: i <= 1 ? 'var(--weui-FG-0)' : 'var(--weui-FG-1)', fontWeight: i === 1 ? 500 : 400, paddingBottom: 4 }}>
              {s} {i === 0 && <span style={{ fontSize: 11, color: 'var(--weui-FG-1)' }}>· {order.createTime}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Vehicles */}
      <div className="section-hd" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>车辆信息</span>
        {isBatch && <span className="tag tag-info">{order.vehicles.length}台</span>}
      </div>
      {!isBatch && (
        <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
          {[
            ['VIN码', order.vehicles[0].vin],
            ['品牌型号', order.vehicles[0].brandModel],
            ['发动机号', order.vehicles[0].engineNo],
            ['使用性质', order.vehicles[0].useType],
            ['里程', `${order.vehicles[0].mileage}万公里`],
            ['上牌日期', order.vehicles[0].registerDate],
            ['颜色', order.vehicles[0].color],
            ['过户次数', `${order.vehicles[0].transferCount}次`],
          ].map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}
          <InfoRow label="采购价" value={`${order.vehicles[0].price.toFixed(2)}万元`} price />
        </div>
      )}
      {/* 单车：车辆照片 & 证件 */}
      {!isBatch && (
        <div style={{ margin: '8px 16px', background: '#fff', borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8, fontWeight: 500 }}>车辆照片</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {([
              ['左前45°', vehiclePhotoImages.lf45],
              ['右后45°', vehiclePhotoImages.rb45],
              ['仪表盘', vehiclePhotoImages.dashboard],
              ['座椅', vehiclePhotoImages.seat],
              ['铭牌', vehiclePhotoImages.nameplate],
              ['发动机舱', vehiclePhotoImages.engine],
            ] as const).map(([label, src]) => (
              <div key={label} style={{ aspectRatio: '1', background: 'var(--bg)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 4px 3px', fontSize: 10, color: '#fff', textAlign: 'center' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-1)', margin: '12px 0 8px', fontWeight: 500 }}>证件照片</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {([
              ['行驶证正本', vehicleDocImages.licenseF],
              ['行驶证副本', vehicleDocImages.licenseB],
              ['登记证首页', vehicleDocImages.regF],
              ['登记证内页', vehicleDocImages.regB],
            ] as const).map(([label, src]) => (
              <div key={label} style={{ aspectRatio: '3/2', background: 'var(--bg)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 4px 3px', fontSize: 10, color: '#fff', textAlign: 'center' }}>{label}</div>
              </div>
            ))}
          </div>
          {order.vehicles[0].maintenanceReport === '有' && (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-1)', margin: '12px 0 8px', fontWeight: 500 }}>维保报告</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                <div style={{ aspectRatio: '3/2', background: 'var(--bg)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <img src={maintenanceImages.report} alt="维保报告" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 4px 3px', fontSize: 10, color: '#fff', textAlign: 'center' }}>维保报告</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {isBatch && order.vehicles.map((v, i) => <VehiclePanel key={v.id} v={v} index={i} total={order.vehicles.length} />)}
      {isBatch && (
        <div style={{ background: '#FFF1F0', margin: '8px 16px', borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--weui-FG-1)' }}>{order.vehicles.length}台合计</span>
          <span className="price" style={{ fontSize: 16, fontWeight: 700 }}>{order.totalPrice.toFixed(2)}万元</span>
        </div>
      )}

      {/* Owner & Payment */}
      <div className="section-hd">车主信息</div>
      <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
        <InfoRow label="车主类型" value={order.ownerType} />
        <InfoRow label={order.ownerType === '企业' ? '企业名称' : '车主姓名'} value={order.ownerName} />
        <InfoRow label="证件号码" value={order.ownerIdNo} />
        <InfoRow label="联系电话" value={order.ownerPhone} />
      </div>
      {/* 车主证件照片 */}
      <div style={{ margin: '8px 16px', background: '#fff', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8, fontWeight: 500 }}>车主证件照片</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {order.ownerType === '企业' ? (
            <div style={{ aspectRatio: '3/2', background: 'var(--bg)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <img src={idDocImages.bizLicense} alt="营业执照" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 6px 4px', fontSize: 10, color: '#fff', textAlign: 'center' }}>营业执照</div>
            </div>
          ) : ([
            ['身份证正面', idDocImages.idFront],
            ['身份证反面', idDocImages.idBack],
          ] as const).map(([label, src]) => (
            <div key={label} style={{ aspectRatio: '3/2', background: 'var(--bg)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 6px 4px', fontSize: 10, color: '#fff', textAlign: 'center' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-hd">收款信息</div>
      <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
        <InfoRow label="收款人身份" value={order.payeeIdentity} />
        <InfoRow label="收款人" value={order.payeeName} />
        <InfoRow label="开户行" value={order.payeeBank} />
        <InfoRow label="银行卡号" value={order.payeeCardNo} />
        <InfoRow label="预留手机" value={order.payeePhone} />
      </div>
      {/* 收款证件 & 银行卡照片 */}
      <div style={{ margin: '8px 16px', background: '#fff', borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 13, color: 'var(--text-1)', marginBottom: 8, fontWeight: 500 }}>收款人证件 & 银行卡</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {([
            ['收款人证件正面', payeeDocImages.payeeIdFront],
            ['收款人证件反面', payeeDocImages.payeeIdBack],
            ['银行卡正面', payeeDocImages.bankCardFront],
            ['银行卡反面', payeeDocImages.bankCardBack],
          ] as const).map(([label, src]) => (
            <div key={label} style={{ aspectRatio: '3/2', background: 'var(--bg)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
              <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.55))', padding: '10px 6px 4px', fontSize: 10, color: '#fff', textAlign: 'center' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {order.contractNo && (
        <>
          <div className="section-hd">合同信息</div>
          <div className="weui-cells" style={{ margin: '0 16px', borderRadius: 8, overflow: 'hidden' }}>
            <InfoRow label="合同号" value={order.contractNo} />
            <InfoRow label="合同类型" value={isBatch ? '一批一合同' : '一车一合同'} />
          </div>
        </>
      )}

      {/* 签名信息 */}
      <div className="section-hd">签名信息</div>
      <div style={{ margin: '0 16px', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
          <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginBottom: 6 }}>业务员签名</div>
          <div style={{ height: 80, background: 'var(--weui-BG-1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <svg width="160" height="50" viewBox="0 0 160 50"><path d="M10 40 Q30 10 50 30 T90 20 T130 35 T150 15" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
            <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 10, color: 'var(--weui-FG-1)' }}>张伟（业务员）</div>
          </div>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginBottom: 6 }}>车主/委托人签名</div>
          <div style={{ height: 80, background: 'var(--weui-BG-1)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <svg width="140" height="50" viewBox="0 0 140 50"><path d="M15 35 Q35 5 55 25 T95 15 T125 30" stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
            <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 10, color: 'var(--weui-FG-1)' }}>{order.ownerName}（{order.payeeIdentity === '车主' ? '车主' : '委托人'}）</div>
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      {/* Bottom — 根据状态显示不同操作 */}
      <div className="bottom-bar" style={{ flexWrap: 'wrap', gap: 8 }}>
        {/* 待查验：可编辑、可撤回 */}
        {order.status === 'pending_check' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('编辑采购单')}>编辑</button>
            <button className="btn-secondary" style={{ flex: 1, color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => { if (confirm('确认取消采购？')) alert('已取消') }}>取消采购</button>
          </div>
        )}
        {/* 待签约：查看合同、取消采购、发起垫款 */}
        {order.status === 'pending_sign' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看合同')}>查看合同</button>
            <button className="btn-secondary" style={{ flex: 1, color: 'var(--red)', borderColor: 'var(--red)' }} onClick={() => { if (confirm('确认取消采购？')) alert('已取消') }}>取消采购</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdvance}>发起垫款</button>
          </div>
        )}
        {/* 签约完成：查看合同、发起垫款 */}
        {order.status === 'signed' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('查看合同')}>查看合同</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdvance}>发起垫款</button>
          </div>
        )}
        {/* 不通过：查看原因、重新提交 */}
        {order.status === 'rejected' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert('驳回原因：碰撞检测异常，请重新检测后提交')}>查看原因</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => alert('重新编辑并提交')}>重新提交</button>
          </div>
        )}
        {/* 签约取消：仅查看 */}
        {order.status === 'cancelled' && (
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate(-1)}>返回列表</button>
          </div>
        )}
      </div>

      {/* 垫款申请弹框 */}
      {showLoanModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowLoanModal(false)} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 201,
            background: '#fff', borderRadius: '20px 20px 0 0',
            paddingBottom: 'env(safe-area-inset-bottom)',
            animation: 'slideUp 0.3s ease',
          }}>
            {/* 标题 */}
            <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>垫款申请</span>
              <button onClick={() => setShowLoanModal(false)} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>✕</button>
            </div>

            {/* 金额信息 */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ background: 'var(--bg)', borderRadius: 14, padding: '16px', marginBottom: 12 }}>
                {[
                  { label: '采购总金额', value: `${order.totalPrice.toFixed(2)}万元`, highlight: true },
                  { label: '车辆数量', value: `${order.vehicles.length}台` },
                  { label: '车主', value: order.ownerName },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{row.label}</span>
                    <span style={{ fontSize: row.highlight ? 18 : 14, fontWeight: row.highlight ? 700 : 500, color: row.highlight ? 'var(--brand)' : 'var(--text-0)', fontFamily: row.highlight ? 'var(--font-num)' : undefined }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* 额度信息 */}
              <div style={{ background: 'var(--green-bg)', borderRadius: 14, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>可申请额度</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-num)' }}>13.00万元</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-2)' }}>
                  <span>可用保证金额度：13.00万</span>
                  <span>可用授信额度：40.00万</span>
                </div>
              </div>

              {/* 申请垫款金额 */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8 }}>申请垫款金额（万元）</div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 12, padding: '12px 16px', border: '1.5px solid var(--border)' }}>
                  <span style={{ fontSize: 16, color: 'var(--text-2)', marginRight: 4 }}>¥</span>
                  <input type="number" defaultValue={order.totalPrice.toFixed(2)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-num)', color: 'var(--text-0)', flex: 1, width: '100%' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-2)', flexShrink: 0 }}>万元</span>
                </div>
              </div>
            </div>

            {/* 按钮 */}
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowLoanModal(false)}>取消</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setShowLoanModal(false); alert('垫款申请已提交') }}>确认申请</button>
            </div>
          </div>
          <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
        </>
      )}
    </div>
  )
}
