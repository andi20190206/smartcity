import { useState, useRef, useCallback, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface Props {
  src: string
  visible: boolean
  onClose: () => void
}

export default function ImageViewer({ src, visible, onClose }: Props) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })

  // 双指缩放
  const lastDistance = useRef(0)
  const lastScale = useRef(1)

  useEffect(() => {
    if (visible) { setScale(1); setRotation(0); setPosition({ x: 0, y: 0 }) }
  }, [visible])

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 5))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.5, 0.5))
  const handleRotate = () => setRotation((r) => r + 90)
  const handleReset = () => { setScale(1); setRotation(0); setPosition({ x: 0, y: 0 }) }

  // 鼠标拖拽
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    posStart.current = { ...position }
  }, [position])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    })
  }, [dragging])

  const onMouseUp = useCallback(() => setDragging(false), [])

  // 触摸拖拽 + 双指缩放
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setDragging(true)
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      posStart.current = { ...position }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      lastDistance.current = Math.sqrt(dx * dx + dy * dy)
      lastScale.current = scale
    }
  }, [position, scale])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragging) {
      setPosition({
        x: posStart.current.x + (e.touches[0].clientX - dragStart.current.x),
        y: posStart.current.y + (e.touches[0].clientY - dragStart.current.y),
      })
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (lastDistance.current > 0) {
        const newScale = lastScale.current * (dist / lastDistance.current)
        setScale(Math.min(Math.max(newScale, 0.5), 5))
      }
    }
  }, [dragging])

  const onTouchEnd = useCallback(() => {
    setDragging(false)
    lastDistance.current = 0
  }, [])

  // 滚轮缩放
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale((s) => Math.min(Math.max(s - e.deltaY * 0.002, 0.5), 5))
  }, [])

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', color: '#fff' }}>
        <div style={{ fontSize: 14, opacity: 0.7 }}>{Math.round(scale * 100)}% · {rotation}°</div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={20} color="#fff" />
        </button>
      </div>

      {/* 图片区域 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        onWheel={onWheel}>
        <img src={src} alt="" draggable={false}
          style={{
            maxWidth: '90%', maxHeight: '80vh', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none',
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transition: dragging ? 'none' : 'transform 0.2s ease',
          }} />
      </div>

      {/* 底部工具栏 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, padding: '12px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: '2px' }}>
          {[
            { icon: ZoomOut, label: '缩小', action: handleZoomOut },
            { icon: ZoomIn, label: '放大', action: handleZoomIn },
            { icon: RotateCw, label: '旋转', action: handleRotate },
          ].map((btn) => (
            <button key={btn.label} onClick={btn.action}
              style={{ background: 'transparent', border: 'none', borderRadius: 22, padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', transition: 'background 0.15s' }}
              onPointerDown={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              onPointerUp={(e) => (e.currentTarget.style.background = 'transparent')}
              onPointerLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <btn.icon size={20} color="#fff" />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
