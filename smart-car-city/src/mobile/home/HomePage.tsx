import { Upload, Store, Wrench, Search, Globe, Bell, MapPin, Flame, Car, Key, FileText, Edit, File, Truck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCarImage, handleImgError } from '../../shared/constants/carImages'
import { mockApprovals } from '../../shared/mock/approvalMock'

const entries = [
  { icon: Upload, label: '发布车源', bg: '#FF3B30', bgSoft: 'rgba(255,59,48,0.08)' },
  { icon: Store, label: '我的微店', bg: '#FF9500', bgSoft: 'rgba(255,149,0,0.08)' },
  { icon: Wrench, label: '维保出险', bg: '#007AFF', bgSoft: 'rgba(0,122,255,0.08)' },
  { icon: Search, label: '车况查验', bg: '#34C759', bgSoft: 'rgba(52,199,89,0.08)' },
  { icon: Globe, label: '二手车出口', bg: '#AF52DE', bgSoft: 'rgba(175,82,222,0.08)' },
]

const cars = [
  { name: '别克英朗 2019款 18T 精英型', year: '2019', km: '3.2万km', city: '广州', price: '5.80' },
  { name: '丰田卡罗拉 2021款 双擎精英版', year: '2021', km: '5.8万km', city: '深圳', price: '9.20' },
  { name: '凯迪拉克 GT4 2023款 25T', year: '2023', km: '1.5万km', city: '广州', price: '17.50' },
  { name: '比亚迪汉 2024款 EV 冠军版', year: '2024', km: '0.8万km', city: '贵阳', price: '16.80' },
  { name: '本田雅阁 2022款 260T 豪华版', year: '2022', km: '4.3万km', city: '广州', price: '13.50' },
  { name: '奔驰C260L 2023款 运动版', year: '2023', km: '2.1万km', city: '佛山', price: '24.50' },
]

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="page page-tabbar" style={{ background: 'var(--bg)' }}>
      {/* Dark header */}
      <div style={{
        background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%)',
        padding: '14px 16px 20px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(232,53,46,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(232,53,46,0.05)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>唯车帮</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2, letterSpacing: 0.5 }}>二手车线上经销平台</div>
          </div>
          <div onClick={() => navigate('/message')} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
            <Bell size={18} color="rgba(255,255,255,0.7)" />
            <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', border: '1.5px solid #1A1A2E' }} />
          </div>
        </div>

        {/* Banner */}
        <div className="anim d1" style={{
          marginTop: 16, borderRadius: 14, overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(232,53,46,0.15), rgba(232,53,46,0.05))',
          border: '1px solid rgba(232,53,46,0.15)', padding: '14px 18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Flame size={14} color="var(--brand-soft)" />
            <span style={{ fontSize: 11, color: 'var(--brand-soft)', fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>HOT</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>新车商入驻享千元补贴</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>限时活动 · 名额有限</div>
        </div>
      </div>

      {/* Quick entries */}
      <div className="anim d2" style={{ margin: '12px 16px', padding: '18px 10px 14px', borderRadius: 16, background: '#fff', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {entries.map((e) => (
            <div key={e.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: e.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <e.icon size={21} color={e.bg} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-1)', fontWeight: 500 }}>{e.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 用车工具 */}
      <div className="anim d2" style={{ margin: '0 16px 4px', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>用车工具</div>
      <div className="anim d2" style={{
        margin: '6px 16px 12px', padding: '18px 16px', borderRadius: 16,
        background: '#fff', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
        display: 'flex', gap: 24,
      }}>
        {[
          { icon: Key, label: '用车申请', path: '/vehicle-use/apply', color: '#007AFF', bg: 'rgba(0,122,255,0.08)' },
          { icon: FileText, label: '用车列表', path: '/vehicle-use', color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
        ].map((item) => (
          <div key={item.label} onClick={() => navigate(item.path)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
          }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <item.icon size={24} color={item.color} strokeWidth={1.8} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* 审批 */}
      <div className="anim d3" style={{ margin: '0 16px 4px', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>审批</div>
      <div className="anim d3" style={{
        margin: '6px 16px 12px', padding: '18px 16px', borderRadius: 16,
        background: '#fff', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
        display: 'flex', gap: 24,
      }}>
        {(() => {
          const pendingApprovals = mockApprovals.filter((a) => a.status === 'pending' || a.status === 'approving')
          const purchaseCount = pendingApprovals.filter((a) => a.type === 'purchase').length
          const salesCount = pendingApprovals.filter((a) => a.type === 'sales_sign').length
          const vehicleUseCount = pendingApprovals.filter((a) => a.type === 'vehicle_use').length
          return [
            { icon: Edit, label: '采购审批', color: '#FF3B30', bg: 'rgba(255,59,48,0.08)', badge: purchaseCount },
            { icon: File, label: '销售审批', color: '#FF9500', bg: 'rgba(255,149,0,0.08)', badge: salesCount },
            { icon: Truck, label: '用车审批', color: '#AF52DE', bg: 'rgba(175,82,222,0.08)', badge: vehicleUseCount },
          ].map((item) => (
            <div key={item.label} onClick={() => navigate('/approval')} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', position: 'relative',
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={24} color={item.color} strokeWidth={1.8} />
                </div>
                {item.badge > 0 && (
                  <div style={{
                    position: 'absolute', top: -4, right: -4,
                    minWidth: 18, height: 18, borderRadius: 9,
                    background: '#FF3B30', color: '#fff',
                    fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-num)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 4px', border: '2px solid #fff',
                  }}>{item.badge}</div>
                )}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500 }}>{item.label}</span>
            </div>
          ))
        })()}
      </div>

      {/* Recommend */}
      <div className="anim d3" style={{ padding: '4px 16px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--font-display)' }}>为您推荐</span>
        <span style={{ fontSize: 12, color: 'var(--text-2)' }}>更多 ›</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '4px 16px 20px' }}>
        {cars.map((c, i) => (
          <div key={i} className={`anim d${Math.min(i + 3, 5)}`} style={{
            background: '#fff', borderRadius: 14, overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
          }}>
            <div style={{ height: 105, position: 'relative', overflow: 'hidden' }}>
              <img src={getCarImage(i)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
              <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '2px 7px', fontSize: 10, color: '#fff', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={9} />{c.city}
              </div>
            </div>
            <div style={{ padding: '10px 12px 12px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, height: 35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 5, display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ background: 'var(--bg)', borderRadius: 4, padding: '1px 5px', fontWeight: 600, fontSize: 10 }}>{c.year}</span>
                <span>·</span><span>{c.km}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="price" style={{ fontSize: 20 }}>{c.price}</span>
                <span style={{ fontSize: 11, color: 'var(--brand)', marginLeft: 1 }}>万</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
