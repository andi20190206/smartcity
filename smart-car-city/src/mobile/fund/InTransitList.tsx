import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Car, CheckCircle, Clock } from 'lucide-react'
import { mockInTransitDetails } from '../../shared/mock/fundMock'

export default function InTransitList() {
  const navigate = useNavigate()
  const total = mockInTransitDetails.filter((d) => !d.registered).reduce((s, d) => s + d.advanceAmount, 0)

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">在途额度明细</div>
        <div className="nav-right" />
      </div>

      {/* 汇总 */}
      <div className="anim d1" style={{
        margin: '12px 16px', padding: '16px', borderRadius: 14,
        background: '#fff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>在途额度合计</div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-num)', color: 'var(--brand)' }}>
            {total.toFixed(2)}<span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-2)', marginLeft: 2 }}>万</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>未签注车辆</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-num)', color: 'var(--text-0)' }}>
            {mockInTransitDetails.filter((d) => !d.registered).length}
            <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-2)', marginLeft: 2 }}>台</span>
          </div>
        </div>
      </div>

      <div className="section-hd">车辆列表</div>
      <div style={{ padding: '0 16px 40px' }}>
        {mockInTransitDetails.map((item, idx) => (
          <div key={item.vehicleId} className={`anim d${Math.min(idx + 1, 5)}`} style={{
            background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)', marginBottom: 10, padding: '14px 16px',
            opacity: item.registered ? 0.5 : 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Car size={16} color={item.registered ? 'var(--text-3)' : 'var(--blue)'} />
                <span style={{ fontSize: 15, fontWeight: 600 }}>{item.plateNo}</span>
              </div>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 5, fontWeight: 600,
                background: item.registered ? 'var(--green-bg)' : 'var(--orange-bg)',
                color: item.registered ? 'var(--green)' : 'var(--orange)',
              }}>
                {item.registered ? '已签注' : '未签注'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 6 }}>{item.brandModel}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>垫款日期: {item.advanceDate}</span>
              <span className="price" style={{ fontSize: 15 }}>
                {item.advanceAmount.toFixed(2)}<span style={{ fontSize: 10, fontWeight: 500 }}>万</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
