import { useState } from 'react'
import { Clock, MapPin, Search } from 'lucide-react'
import { getCarListImage, handleImgError } from '../../shared/constants/carImages'

const auctionCars = [
  { name: '别克英朗 2019款 18T 精英型', year: '2019', km: '3.2万km', city: '广州', price: '5.80', end: '2h 30min' },
  { name: '丰田凯美瑞 2020款 2.0G 豪华版', year: '2020', km: '4.5万km', city: '佛山', price: '12.80', end: '5h 15min' },
  { name: '大众朗逸 2021款 1.4T 舒适版', year: '2021', km: '2.8万km', city: '梅州', price: '7.50', end: '1d 3h' },
  { name: '日产轩逸 2022款 经典版', year: '2022', km: '1.5万km', city: '广州', price: '8.90', end: '3h 45min' },
]
const wholesaleCars = [
  { name: '本田飞度 2020款 1.5L CVT 潮跑版', year: '2020', km: '5.1万km', city: '广州', plate: '粤A', price: '6.20' },
  { name: '日产轩逸 2022款 1.6L CVT 经典版', year: '2022', km: '1.9万km', city: '深圳', plate: '粤B', price: '8.90' },
  { name: '马自达3 昂克赛拉 2021款 2.0L', year: '2021', km: '3.6万km', city: '贵阳', plate: '贵A', price: '10.50' },
]

export default function VehicleSourcePage() {
  const [tab, setTab] = useState<'auction' | 'wholesale'>('auction')
  const list = tab === 'auction' ? auctionCars : wholesaleCars

  return (
    <div className="page page-tabbar">
      <div style={{ background: 'linear-gradient(160deg, #1A1A2E 0%, #2D2D44 100%)', padding: '14px 16px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(232,53,46,0.06)' }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: 1, marginBottom: 12, position: 'relative' }}>车源广场</div>
      </div>

      {/* Tabs + Search */}
      <div style={{ background: '#fff', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex' }}>
          {(['auction', 'wholesale'] as const).map((t) => (
            <div key={t} onClick={() => setTab(t)} style={{
              flex: 1, textAlign: 'center', padding: '12px 0', fontSize: 15, cursor: 'pointer',
              fontWeight: tab === t ? 700 : 400, color: tab === t ? 'var(--brand)' : 'var(--text-2)',
              borderBottom: tab === t ? '2.5px solid var(--brand)' : '2.5px solid transparent',
              fontFamily: 'var(--font-display)', transition: 'all 0.2s',
            }}>{t === 'auction' ? '竞拍车源' : '同行批售'}</div>
          ))}
        </div>
        <div style={{ padding: '8px 16px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 22, padding: '8px 14px', gap: 8 }}>
            <Search size={16} color="var(--text-2)" />
            <input placeholder="搜索品牌等关键字" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: 'var(--text-0)' }} />
          </div>
        </div>
      </div>

      {/* List */}
      {list.map((c, i) => (
        <div key={i} className={`anim d${Math.min(i + 1, 5)}`} style={{
          background: '#fff', margin: '8px 16px', borderRadius: 14, padding: 12,
          display: 'flex', gap: 12, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
        }}>
          <div style={{ width: 115, height: 80, borderRadius: 10, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <img src={getCarListImage(i + (tab === 'wholesale' ? 5 : 0))} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={handleImgError} />
            {tab === 'auction' && <span style={{ position: 'absolute', bottom: 4, right: 4, background: 'var(--green)', borderRadius: 4, padding: '1px 6px', fontSize: 9, color: '#fff', fontWeight: 700 }}>竞拍中</span>}
            {tab === 'wholesale' && 'plate' in c && <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', borderRadius: 4, padding: '1px 6px', fontSize: 9, color: '#fff' }}>{(c as typeof wholesaleCars[0]).plate}</span>}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{c.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ background: 'var(--bg)', borderRadius: 4, padding: '1px 5px', fontWeight: 600, fontSize: 10 }}>{c.year}</span>
              · {c.km} · <MapPin size={9} />{c.city}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><span className="price" style={{ fontSize: 18 }}>{c.price}</span><span style={{ fontSize: 11, color: 'var(--brand)', marginLeft: 1 }}>万</span></div>
              {tab === 'auction' && 'end' in c && (
                <span style={{ fontSize: 10, color: 'var(--green)', background: 'var(--green-bg)', borderRadius: 6, padding: '3px 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={10} /> {(c as typeof auctionCars[0]).end}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
