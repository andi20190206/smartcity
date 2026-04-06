import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, CircleCheck, Search } from 'lucide-react'
import { mockBatchVehicles } from '../../shared/mock/purchaseMock'

export default function PhotoSupplement() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const completedCount = mockBatchVehicles.filter((v) => v.completed).length
  const totalCount = mockBatchVehicles.length
  const filtered = mockBatchVehicles.filter((v) => !search || v.plateNo.includes(search) || v.vin.includes(search))

  return (
    <div className="page">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">批量图片补充</div>
        <div className="nav-right" />
      </div>

      {/* Progress */}
      <div style={{ background: '#fff', margin: '8px 16px', borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>完成进度</span>
          <span style={{ fontSize: 14, color: 'var(--weui-brand)', fontWeight: 600 }}>{completedCount}/{totalCount}台已完成</span>
        </div>
        <div className="progress-track" style={{ height: 6 }}>
          <div className="progress-fill" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <span className="tag tag-success">{completedCount} 已完成</span>
          <span className="tag tag-warn">{totalCount - completedCount} 待补充</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#EDEDED', borderRadius: 20, padding: '6px 12px', gap: 6 }}>
          <Search size={14} color="var(--weui-FG-1)" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索车牌/VIN码"
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1 }} />
        </div>
      </div>

      {/* List */}
      {filtered.map((v) => (
        <div key={v.id} style={{ background: '#fff', margin: '8px 16px', borderRadius: 8, padding: '12px 16px', cursor: 'pointer' }}
          onClick={() => navigate(`/purchase/photo-upload/${v.id}`)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {v.completed && <CircleCheck size={16} color="var(--weui-GREEN)" />}
              <span style={{ fontSize: 15, fontWeight: 600 }}>{v.plateNo}</span>
            </div>
            {v.completed ? <span className="tag tag-success">已完成</span> : v.photoProgress > 0 ? <span className="tag tag-warn">补充中</span> : <span className="tag tag-default">待拍照</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--weui-FG-1)' }}>{v.vin}</div>
          <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginTop: 2 }}>{v.brandModel}</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--weui-FG-1)', marginBottom: 4 }}>
              <span>照片进度</span><span>{v.photoProgress}/{v.photoTotal}</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(v.photoProgress / v.photoTotal) * 100}%` }} /></div>
          </div>
        </div>
      ))}
    </div>
  )
}
