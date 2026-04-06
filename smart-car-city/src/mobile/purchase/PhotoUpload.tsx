import { useState, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Camera, Check, Images, X, GripVertical, Trash2 } from 'lucide-react'
import { mockBatchVehicles } from '../../shared/mock/purchaseMock'

interface PhotoSection {
  key: string
  title: string
  required: boolean
  hint?: string
}

const photoSections: PhotoSection[] = [
  { key: 'license_front', title: '行驶证（正本）', required: true, hint: 'OCR自动识别' },
  { key: 'license_back', title: '行驶证（副本）', required: true, hint: 'OCR自动识别' },
  { key: 'reg_front', title: '登记证（首页）', required: true, hint: 'OCR自动识别' },
  { key: 'reg_inner', title: '登记证（内页）', required: true, hint: 'OCR自动识别' },
  { key: 'photo_lf', title: '左前45°', required: true },
  { key: 'photo_rb', title: '右后45°', required: true },
  { key: 'photo_dashboard', title: '仪表盘', required: true },
  { key: 'photo_seat', title: '左前排座椅', required: false },
  { key: 'photo_nameplate', title: '铭牌', required: false },
  { key: 'photo_engine', title: '发动机舱/缸体', required: false },
]

interface PhotoItem {
  id: string
  url: string
  name: string
}

export default function PhotoUpload() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicle = mockBatchVehicles.find((v) => v.id === id) || mockBatchVehicles[0]

  // 待分类照片池
  const [unassigned, setUnassigned] = useState<PhotoItem[]>([])
  // 已分类照片 key -> PhotoItem
  const [assigned, setAssigned] = useState<Record<string, PhotoItem | null>>({})
  // 当前拖拽的照片
  const [dragging, setDragging] = useState<PhotoItem | null>(null)
  const [dragOverKey, setDragOverKey] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadedCount = Object.values(assigned).filter(Boolean).length
  const requiredDone = photoSections.filter((s) => s.required).every((s) => assigned[s.key])

  // 批量选择照片
  const handleBatchSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newPhotos: PhotoItem[] = Array.from(files).map((file, i) => ({
      id: `${Date.now()}-${i}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    setUnassigned((prev) => [...prev, ...newPhotos])
    e.target.value = ''
  }, [])

  // 直接拍照到指定分类
  const handleDirectUpload = (sectionKey: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const photo: PhotoItem = {
        id: `${Date.now()}`,
        url: URL.createObjectURL(file),
        name: file.name,
      }
      // 如果该分类已有照片，把旧的放回待分类
      const old = assigned[sectionKey]
      if (old) setUnassigned((prev) => [...prev, old])
      setAssigned((prev) => ({ ...prev, [sectionKey]: photo }))
    }
    input.click()
  }

  // 拖拽开始
  const handleDragStart = (photo: PhotoItem, fromSection?: string) => {
    setDragging(photo)
    if (fromSection) {
      // 从分类区拖出
      setAssigned((prev) => ({ ...prev, [fromSection]: null }))
    } else {
      // 从待分类区拖出
      setUnassigned((prev) => prev.filter((p) => p.id !== photo.id))
    }
  }

  // 拖拽放下到分类区
  const handleDropToSection = (sectionKey: string) => {
    if (!dragging) return
    // 如果目标已有照片，放回待分类
    const old = assigned[sectionKey]
    if (old) setUnassigned((prev) => [...prev, old])
    setAssigned((prev) => ({ ...prev, [sectionKey]: dragging }))
    setDragging(null)
    setDragOverKey(null)
  }

  // 拖拽放回待分类区
  const handleDropToPool = () => {
    if (!dragging) return
    setUnassigned((prev) => [...prev, dragging])
    setDragging(null)
    setDragOverKey(null)
  }

  // 从分类中移除
  const handleRemoveFromSection = (sectionKey: string) => {
    const photo = assigned[sectionKey]
    if (photo) {
      setUnassigned((prev) => [...prev, photo])
      setAssigned((prev) => ({ ...prev, [sectionKey]: null }))
    }
  }

  // 删除照片
  const handleDeletePhoto = (photo: PhotoItem) => {
    setUnassigned((prev) => prev.filter((p) => p.id !== photo.id))
  }

  const handleSave = () => {
    if (!requiredDone) { alert('请完成所有必拍项'); return }
    alert('保存成功')
    navigate(-1)
  }

  const handleNext = () => {
    const idx = mockBatchVehicles.findIndex((v) => v.id === id)
    if (idx < mockBatchVehicles.length - 1) {
      navigate(`/purchase/photo-upload/${mockBatchVehicles[idx + 1].id}`, { replace: true })
      setUnassigned([])
      setAssigned({})
    } else {
      alert('已是最后一台')
    }
  }

  return (
    <div className="page page-bottom">
      {/* NavBar */}
      <div className="nav-dark">
        <button className="nav-back" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">拍照上传</div>
        <div className="nav-right" />
      </div>

      {/* 车辆信息头 */}
      <div style={{ background: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{vehicle.plateNo}</div>
          <div style={{ fontSize: 12, color: 'var(--weui-FG-1)', marginTop: 2 }}>{vehicle.vin}</div>
          <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginTop: 2 }}>{vehicle.brandModel}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--weui-brand)' }}>{uploadedCount}/{photoSections.length}</div>
          <div style={{ fontSize: 11, color: 'var(--weui-FG-1)' }}>已分类</div>
        </div>
      </div>

      {/* 批量上传按钮 */}
      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleBatchSelect} style={{ display: 'none' }} />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%', padding: '12px', borderRadius: 8,
            background: '#FFF1F0', border: '1px dashed #E8352E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontWeight: 500, color: '#E8352E', cursor: 'pointer',
          }}
        >
          <Images size={20} /> 批量选择照片
        </button>
        <div style={{ fontSize: 12, color: 'var(--weui-FG-1)', marginTop: 6, textAlign: 'center' }}>
          选择多张照片后，拖动到下方对应分类区域
        </div>
      </div>

      {/* 待分类照片池 */}
      {unassigned.length > 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverKey('pool') }}
          onDragLeave={() => setDragOverKey(null)}
          onDrop={(e) => { e.preventDefault(); handleDropToPool() }}
          style={{
            margin: '8px 16px', padding: 12, borderRadius: 8,
            background: dragOverKey === 'pool' ? '#E8F4FF' : '#fff',
            border: dragOverKey === 'pool' ? '2px dashed var(--weui-BLUE)' : '1px solid var(--weui-FG-3)',
            transition: 'all 0.15s',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📷 待分类照片 ({unassigned.length}张)</span>
            <span style={{ fontSize: 11, color: 'var(--weui-FG-1)' }}>长按拖动到下方分类</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {unassigned.map((photo) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => handleDragStart(photo)}
                onDragEnd={() => { if (dragging) { setUnassigned((prev) => [...prev, dragging]); setDragging(null); setDragOverKey(null) } }}
                style={{
                  position: 'relative', aspectRatio: '1', borderRadius: 6, overflow: 'hidden',
                  cursor: 'grab', border: '1px solid var(--weui-FG-3)',
                }}
              >
                <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <GripVertical size={10} color="#fff" />
                  <span style={{ fontSize: 9, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{photo.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo) }}
                  style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '0 0 0 6px', padding: '3px', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={12} color="#fff" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 分类区域 */}
      <div style={{ padding: '4px 0 16px' }}>
        {photoSections.map((sec) => {
          const photo = assigned[sec.key]
          const isOver = dragOverKey === sec.key
          return (
            <div
              key={sec.key}
              onDragOver={(e) => { e.preventDefault(); setDragOverKey(sec.key) }}
              onDragLeave={() => setDragOverKey(null)}
              onDrop={(e) => { e.preventDefault(); handleDropToSection(sec.key) }}
              style={{
                background: isOver ? '#FFF1F0' : '#fff',
                margin: '6px 16px',
                borderRadius: 8,
                padding: 12,
                border: isOver ? '2px dashed #E8352E' : '1px solid var(--weui-FG-3)',
                transition: 'all 0.15s',
              }}
            >
              {/* 标题行 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{sec.title}</span>
                  {sec.required && <span style={{ color: 'var(--weui-RED)', fontSize: 12 }}>*</span>}
                </div>
                {photo ? (
                  <span className="tag tag-success" style={{ fontSize: 11 }}>已上传</span>
                ) : sec.required ? (
                  <span className="tag tag-error" style={{ fontSize: 11 }}>必拍</span>
                ) : (
                  <span className="tag tag-default" style={{ fontSize: 11 }}>选拍</span>
                )}
              </div>
              {sec.hint && <div style={{ fontSize: 11, color: 'var(--weui-BLUE)', marginBottom: 8 }}>{sec.hint}</div>}

              {/* 照片区域 */}
              {photo ? (
                <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden' }}>
                  <img
                    src={photo.url} alt=""
                    draggable
                    onDragStart={() => handleDragStart(photo, sec.key)}
                    style={{ width: '100%', height: 120, objectFit: 'cover', cursor: 'grab', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '16px 8px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#fff' }}>{photo.name}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleDirectUpload(sec.key)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#fff', cursor: 'pointer' }}>重拍</button>
                      <button onClick={() => handleRemoveFromSection(sec.key)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Trash2 size={10} /> 移除
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => handleDirectUpload(sec.key)}
                  style={{
                    padding: 20, textAlign: 'center', cursor: 'pointer',
                    background: isOver ? '#FFF1F0' : 'var(--weui-BG-1)',
                    borderRadius: 6, border: '1px dashed var(--weui-FG-2)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  }}
                >
                  <Camera size={24} color={isOver ? '#E8352E' : 'var(--weui-FG-2)'} />
                  <span style={{ fontSize: 12, color: isOver ? '#E8352E' : 'var(--weui-FG-1)' }}>
                    {isOver ? '松手放置照片' : '点击拍照 或 拖入照片'}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 底部 */}
      <div className="bottom-bar">
        <button className="weui-btn weui-btn_default" style={{ flex: 1, borderRadius: 8, fontSize: 15 }} onClick={handleSave}>保存</button>
        <button className="weui-btn weui-btn_primary" style={{ flex: 1, background: 'var(--weui-brand)', borderRadius: 8, fontSize: 15 }} onClick={handleNext}>保存并下一台</button>
      </div>
    </div>
  )
}
