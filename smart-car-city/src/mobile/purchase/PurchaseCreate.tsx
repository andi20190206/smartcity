import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronDown, Camera, Plus, Trash2, FileSpreadsheet,
  Images, X, GripVertical, ScanLine, CheckCircle, Loader, AlertCircle,
  ZoomIn, ZoomOut, RotateCw,
} from 'lucide-react'
import ImageViewer from '../common/ImageViewer'

const stepTitles = ['车辆信息', '车况&照片', '车主信息', '收款&签名']

interface VehicleData {
  id: string
  plateNo: string; vin: string; brandModel: string; engineNo: string
  useType: string; mileage: string; registerDate: string; color: string
  transferCount: string; price: string; condition: string
  ocrStatus: 'none' | 'scanning' | 'done' | 'error'
  ocrFields: string[]
  vinQueryStatus: 'none' | 'loading' | 'done' | 'error'
  licenseImageUrl: string // 行驶证照片预览
}

const emptyVehicle = (): VehicleData => ({
  id: Date.now().toString(),
  plateNo: '', vin: '', brandModel: '', engineNo: '',
  useType: '', mileage: '', registerDate: '', color: '',
  transferCount: '', price: '', condition: '',
  ocrStatus: 'none', ocrFields: [], vinQueryStatus: 'none', licenseImageUrl: '',
})

/** 模拟OCR识别行驶证 */
const mockOcrRecognize = (): Promise<Partial<VehicleData>> => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      plateNo: '粤A·D2588',
      vin: 'LVHCV6637K50CLTS1',
      engineNo: 'LFV2A21G5K3012345',
      useType: '非营运',
      registerDate: '2019-06-15',
      color: '白色',
    })
  }, 1800)
})

/** 模拟VIN码查询品牌车型 */
const mockVinQuery = (vin: string): Promise<{ brandModel: string }> => new Promise((resolve) => {
  setTimeout(() => {
    resolve({ brandModel: '别克英朗 2019款 18T 自动互联精英型' })
  }, 1200)
})

export default function PurchaseCreate() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'single' | 'batch'>('single')
  const [vehicles, setVehicles] = useState<VehicleData[]>([emptyVehicle()])
  const [activeIdx, setActiveIdx] = useState(0)

  // Step 2 photo states
  const [photoPool, setPhotoPool] = useState<{ id: string; url: string; name: string }[]>([])
  const [photoAssigned, setPhotoAssigned] = useState<Record<string, { id: string; url: string; name: string } | null>>({})
  const [draggingPhoto, setDraggingPhoto] = useState<{ id: string; url: string; name: string } | null>(null)
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null)
  const batchInputRef = useRef<HTMLInputElement>(null)
  const [viewerSrc, setViewerSrc] = useState('')
  const [viewerVisible, setViewerVisible] = useState(false)

  // 行驶证内嵌查看器状态
  const [licenseScale, setLicenseScale] = useState(1)
  const [licenseRotation, setLicenseRotation] = useState(0)
  const [licensePos, setLicensePos] = useState({ x: 0, y: 0 })
  const [licenseDragging, setLicenseDragging] = useState(false)
  
  const licenseDragStart = useRef({ x: 0, y: 0 })
  const licensePinchDist = useRef(0)
  const licensePinchScale = useRef(1)

  const openViewer = (src: string) => { setViewerSrc(src); setViewerVisible(true) }

  const photoSlots = [
    { key: 'lf45', label: '左前45°', required: true },
    { key: 'rb45', label: '右后45°', required: true },
    { key: 'dashboard', label: '仪表盘', required: true },
    { key: 'seat', label: '座椅', required: false },
    { key: 'nameplate', label: '铭牌', required: false },
    { key: 'engine', label: '发动机舱', required: false },
    { key: 'license_f', label: '行驶证正本', required: true, hint: 'OCR识别' },
    { key: 'license_b', label: '行驶证副本', required: true, hint: 'OCR识别' },
    { key: 'reg_f', label: '登记证首页', required: true, hint: 'OCR识别' },
    { key: 'reg_b', label: '登记证内页', required: true, hint: 'OCR识别' },
  ]

  const navigate = useNavigate()
  const cur = vehicles[activeIdx] || vehicles[0]

  const updateField = (field: keyof VehicleData, value: string) => {
    setVehicles((prev) => prev.map((v, i) => i === activeIdx ? { ...v, [field]: value } : v))
  }

  const updateVehicle = (idx: number, data: Partial<VehicleData>) => {
    setVehicles((prev) => prev.map((v, i) => i === idx ? { ...v, ...data } : v))
  }

  // OCR扫描行驶证
  const handleOcrScan = async (vehicleIdx: number) => {
    // 弹出文件选择
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment'
    input.onchange = async (ev) => {
      const file = (ev.target as HTMLInputElement).files?.[0]
      if (!file) return
      const imageUrl = URL.createObjectURL(file)
      updateVehicle(vehicleIdx, { ocrStatus: 'scanning', licenseImageUrl: imageUrl })
      try {
        const result = await mockOcrRecognize()
        const ocrFields: string[] = []
        const updates: Partial<VehicleData> = { ocrStatus: 'done' }
        if (result.plateNo) { updates.plateNo = result.plateNo; ocrFields.push('plateNo') }
        if (result.vin) { updates.vin = result.vin; ocrFields.push('vin') }
        if (result.engineNo) { updates.engineNo = result.engineNo; ocrFields.push('engineNo') }
        if (result.useType) { updates.useType = result.useType; ocrFields.push('useType') }
        if (result.registerDate) { updates.registerDate = result.registerDate; ocrFields.push('registerDate') }
        if (result.color) { updates.color = result.color; ocrFields.push('color') }
        updates.ocrFields = ocrFields
        updateVehicle(vehicleIdx, updates)
        if (result.vin) {
          updateVehicle(vehicleIdx, { ...updates, vinQueryStatus: 'loading' })
          try {
            const vinResult = await mockVinQuery(result.vin)
            updateVehicle(vehicleIdx, { brandModel: vinResult.brandModel, vinQueryStatus: 'done', ocrFields: [...ocrFields, 'brandModel'] })
          } catch { updateVehicle(vehicleIdx, { vinQueryStatus: 'error' }) }
        }
      } catch { updateVehicle(vehicleIdx, { ocrStatus: 'error' }) }
    }
    input.click()
  }

  const addVehicle = () => {
    setVehicles([...vehicles, emptyVehicle()])
    setActiveIdx(vehicles.length)
  }

  const removeVehicle = (idx: number) => {
    if (vehicles.length <= 1) return
    const next = vehicles.filter((_, i) => i !== idx)
    setVehicles(next)
    setActiveIdx(Math.min(activeIdx, next.length - 1))
  }

  const handleSubmit = () => {
    const msg = mode === 'single'
      ? '确认提交采购申请？\n将生成一车一合同。'
      : `确认提交采购申请？\n共${vehicles.length}台车辆，将生成一批一合同。`
    if (confirm(msg)) { alert('提交成功'); navigate('/purchase') }
  }

  // Photo helpers
  const handleBatchPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return
    setPhotoPool((p) => [...p, ...Array.from(files).map((f, i) => ({ id: `${Date.now()}-${i}`, url: URL.createObjectURL(f), name: f.name }))])
    e.target.value = ''
  }
  const directUploadSlot = (k: string) => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'
    input.onchange = (ev) => {
      const f = (ev.target as HTMLInputElement).files?.[0]; if (!f) return
      const item = { id: `${Date.now()}`, url: URL.createObjectURL(f), name: f.name }
      const old = photoAssigned[k]; if (old) setPhotoPool((p) => [...p, old])
      setPhotoAssigned((p) => ({ ...p, [k]: item }))
    }; input.click()
  }
  const startDrag = (photo: { id: string; url: string; name: string }, fromSlot?: string) => {
    setDraggingPhoto(photo)
    if (fromSlot) setPhotoAssigned((p) => ({ ...p, [fromSlot]: null }))
    else setPhotoPool((p) => p.filter((x) => x.id !== photo.id))
  }
  const dropSlot = (k: string) => {
    if (!draggingPhoto) return
    const old = photoAssigned[k]; if (old) setPhotoPool((p) => [...p, old])
    setPhotoAssigned((p) => ({ ...p, [k]: draggingPhoto })); setDraggingPhoto(null); setDragOverTarget(null)
  }
  const dropPool = () => { if (!draggingPhoto) return; setPhotoPool((p) => [...p, draggingPhoto]); setDraggingPhoto(null); setDragOverTarget(null) }

  /** 渲染OCR状态标识 */
  const ocrBadge = (field: string) => {
    if (!cur.ocrFields.includes(field)) return null
    return <span style={{ fontSize: 10, color: 'var(--weui-GREEN)', marginLeft: 4, display: 'inline-flex', alignItems: 'center', gap: 2 }}><CheckCircle size={10} />识别</span>
  }

  // ===== 测试数据填充 =====
  const fillStep0 = () => {
    updateVehicle(activeIdx, {
      plateNo: '粤A·D2588', vin: 'LVHCV6637K50CLTS1', brandModel: '别克英朗 2019款 18T 自动互联精英型',
      engineNo: 'LFV2A21G5K3012345', useType: '非营运', mileage: '3.2', registerDate: '2019-06-15',
      color: '白色', transferCount: '1', price: '5.80', condition: '良好',
      ocrStatus: 'done', ocrFields: ['plateNo', 'vin', 'brandModel', 'engineNo', 'useType', 'registerDate', 'color'], vinQueryStatus: 'done',
      licenseImageUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect fill="%23e8e8e8" width="400" height="250" rx="8"/><rect x="20" y="20" width="360" height="210" fill="%23fff" rx="4"/><text x="200" y="60" text-anchor="middle" fill="%23999" font-size="16">中华人民共和国</text><text x="200" y="85" text-anchor="middle" fill="%23999" font-size="14">机动车行驶证（正本）</text><text x="40" y="120" fill="%23333" font-size="13">号牌号码：粤A·D2588</text><text x="40" y="145" fill="%23333" font-size="13">车辆识别代号：LVHCV6637K50CLTS1</text><text x="40" y="170" fill="%23333" font-size="13">发动机号：LFV2A21G5K3012345</text><text x="40" y="195" fill="%23333" font-size="13">使用性质：非营运  注册日期：2019-06-15</text><text x="40" y="215" fill="%23333" font-size="13">车身颜色：白色</text></svg>`,
    })
  }

  const fillStep1 = () => {
    const svg = (name: string) => `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23e8e8e8" width="200" height="150"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12">${encodeURIComponent(name)}</text></svg>`
    const a: Record<string, { id: string; url: string; name: string }> = {}
    photoSlots.forEach((s) => { a[s.key] = { id: `t-${s.key}`, url: svg(s.label), name: `${s.label}.jpg` } })
    setPhotoAssigned(a); setPhotoPool([])
  }

  const [paymentData, setPaymentData] = useState({
    payeeIdentity: '', payeeName: '', payeeIdNo: '', payeeCardNo: '', payeeBank: '', payeePhone: '', deliveryLocation: '',
  })

  // 车主/卖方类型
  const [ownerTypeState, setOwnerTypeState] = useState<string>('个人')
  // 个体工商户收款方式
  const [indivPayMode, setIndivPayMode] = useState<string>('法人名下银行卡')
  // 个体工商户账户类型
  const [indivAccountType, setIndivAccountType] = useState<string>('中信')
  // 企业证件类型
  const [enterpriseCertType, setEnterpriseCertType] = useState<string>('统一社会信用代码')
  const [showCertPicker, setShowCertPicker] = useState(false)

  // 第3步车主证件照片状态
  const [ownerIdPhotos, setOwnerIdPhotos] = useState<Record<string, string>>({})
  // 第4步收款证件照片状态
  const [payeePhotos, setPayeePhotos] = useState<Record<string, string>>({})
  // 签名模式
  const [signMode, setSignMode] = useState<'local' | 'remote'>('local')
  const [remoteSignUrl, setRemoteSignUrl] = useState('')
  const [remoteSignStatus, setRemoteSignStatus] = useState<'pending' | 'signed'>('pending')
  const mockSvg = (text: string) => `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect fill="%23e8e8e8" width="200" height="150" rx="4"/><text x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12">${encodeURIComponent(text)}</text></svg>`

  const fillStep2 = () => {
    // 车主信息 — DOM填充 + 证件照片
    const inputs = document.querySelectorAll<HTMLInputElement>('.weui-cells .weui-input')
    const vals = ['张三', '440106199001011234', '13800138000']
    inputs.forEach((el, i) => {
      if (i < vals.length) {
        const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
        set?.call(el, vals[i]); el.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    setOwnerIdPhotos({ '身份证正面': mockSvg('身份证正面'), '身份证反面': mockSvg('身份证反面') })
  }

  const fillStep3 = () => {
    setPaymentData({
      payeeIdentity: '车主', payeeName: '张三', payeeIdNo: '440106199001011234',
      payeeCardNo: '6222021234567890123', payeeBank: '中国工商银行广州天河支行',
      payeePhone: '13800138000', deliveryLocation: '白云服务中心1库（A区）',
    })
    setPayeePhotos({
      '收款人证件正面': mockSvg('收款人证件正面'), '收款人证件反面': mockSvg('收款人证件反面'),
      '银行卡正面': mockSvg('银行卡正面'), '银行卡反面': mockSvg('银行卡反面'),
    })
  }

  const fillCurrentStep = () => { [fillStep0, fillStep1, fillStep2, fillStep3][step]() }

  return (
    <div className="page page-bottom">
      {/* NavBar */}
      <div className="nav-dark">
        <button className="nav-back" onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">采购录入</div>
        <div className="nav-right" />
      </div>

      {/* 模式切换 */}
      <div style={{ background: '#fff', padding: '12px 16px', display: 'flex', gap: 10, borderBottom: '0.5px solid var(--weui-FG-3)' }}>
        {([['single', '单车采购'], ['batch', '批量采购']] as const).map(([key, label]) => (
          <div key={key} onClick={() => { setMode(key); if (key === 'single') { setVehicles([vehicles[0] || emptyVehicle()]); setActiveIdx(0) } }}
            style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
              background: mode === key ? 'var(--weui-brand)' : 'var(--weui-BG-1)', color: mode === key ? '#fff' : 'var(--weui-FG-1)' }}>{label}</div>
        ))}
      </div>

      {/* Steps */}
      <div className="steps">
        {stepTitles.map((t, i) => (
          <div key={i} className="step">
            <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>{i < step ? '✓' : i + 1}</div>
            <div className={`step-label ${i === step ? 'active' : ''}`}>{t}</div>
            {i < stepTitles.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* ===== Step 1: 车辆信息（OCR驱动） ===== */}
      {step === 0 && (
        <>
          {/* 批量模式操作栏 */}
          {mode === 'batch' && (
            <div style={{ background: '#fff', padding: '10px 16px', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button className="weui-btn weui-btn_mini weui-btn_default" style={{ borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, padding: '4px 12px' }}
                  onClick={() => navigate('/purchase/batch-import')}><FileSpreadsheet size={14} /> Excel导入</button>
                <button className="weui-btn weui-btn_mini weui-btn_default" style={{ borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, padding: '4px 12px' }}
                  onClick={addVehicle}><Plus size={14} /> 添加车辆</button>
              </div>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {vehicles.map((v, i) => (
                  <div key={v.id} onClick={() => setActiveIdx(i)} style={{
                    flexShrink: 0, padding: '6px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                    background: i === activeIdx ? 'var(--weui-brand)' : 'var(--weui-BG-1)', color: i === activeIdx ? '#fff' : 'var(--weui-FG-1)' }}>
                    {v.ocrStatus === 'done' && <CheckCircle size={12} />}
                    第{i + 1}台 {v.plateNo && <span style={{ fontSize: 11 }}>{v.plateNo}</span>}
                    {vehicles.length > 1 && <span onClick={(e) => { e.stopPropagation(); removeVehicle(i) }} style={{ opacity: 0.6 }}><Trash2 size={12} /></span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ★ OCR扫描入口 */}
          <div style={{ margin: '12px 16px', background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--weui-FG-3)' }}>
            <div style={{ padding: '16px', background: cur.ocrStatus === 'done' ? '#F0FDF4' : cur.ocrStatus === 'scanning' ? '#FFF8E6' : '#FFF1F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ScanLine size={18} color={cur.ocrStatus === 'done' ? 'var(--weui-GREEN)' : 'var(--weui-brand)'} />
                  {cur.ocrStatus === 'none' && '扫描行驶证自动录入'}
                  {cur.ocrStatus === 'scanning' && '正在识别中...'}
                  {cur.ocrStatus === 'done' && '识别完成'}
                  {cur.ocrStatus === 'error' && '识别失败'}
                </div>
                {cur.ocrStatus === 'done' && (
                  <span style={{ fontSize: 12, color: 'var(--weui-GREEN)', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle size={14} /> 已回填{cur.ocrFields.length}项
                  </span>
                )}
              </div>

              {cur.ocrStatus === 'none' && (
                <div style={{ fontSize: 13, color: 'var(--weui-FG-1)', marginBottom: 12 }}>
                  使用行驶证首页，自动识别车辆信息
                </div>
              )}

              {/* 行驶证照片预览 */}
              {cur.licenseImageUrl && (
                <div style={{ marginBottom: 10 }}>
                  {/* 内嵌可操作图片区域 */}
                  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--weui-FG-3)', position: 'relative', background: '#f5f5f5' }}
                    onWheel={(e) => { e.stopPropagation(); setLicenseScale((s) => Math.min(Math.max(s - e.deltaY * 0.003, 0.5), 4)) }}>
                    <div style={{ height: 200, overflow: 'hidden', position: 'relative', touchAction: 'none' }}
                      onMouseDown={(e) => { setLicenseDragging(true); licenseDragStart.current = { x: e.clientX - licensePos.x, y: e.clientY - licensePos.y } }}
                      onMouseMove={(e) => { if (licenseDragging) setLicensePos({ x: e.clientX - licenseDragStart.current.x, y: e.clientY - licenseDragStart.current.y }) }}
                      onMouseUp={() => setLicenseDragging(false)} onMouseLeave={() => setLicenseDragging(false)}
                      onTouchStart={(e) => {
                        if (e.touches.length === 1) { setLicenseDragging(true); licenseDragStart.current = { x: e.touches[0].clientX - licensePos.x, y: e.touches[0].clientY - licensePos.y } }
                        if (e.touches.length === 2) { const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; licensePinchDist.current = Math.sqrt(dx*dx+dy*dy); licensePinchScale.current = licenseScale }
                      }}
                      onTouchMove={(e) => {
                        if (e.touches.length === 1 && licenseDragging) setLicensePos({ x: e.touches[0].clientX - licenseDragStart.current.x, y: e.touches[0].clientY - licenseDragStart.current.y })
                        if (e.touches.length === 2 && licensePinchDist.current > 0) { const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; const d = Math.sqrt(dx*dx+dy*dy); setLicenseScale(Math.min(Math.max(licensePinchScale.current * (d / licensePinchDist.current), 0.5), 4)) }
                      }}
                      onTouchEnd={() => { setLicenseDragging(false); licensePinchDist.current = 0 }}>
                      <img src={cur.licenseImageUrl} alt="行驶证" draggable={false}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', userSelect: 'none', pointerEvents: 'none',
                          transform: `translate(${licensePos.x}px, ${licensePos.y}px) scale(${licenseScale}) rotate(${licenseRotation}deg)`,
                          transition: licenseDragging ? 'none' : 'transform 0.15s ease', transformOrigin: 'center center' }} />
                      {cur.ocrStatus === 'scanning' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 8, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                            <Loader size={16} color="var(--weui-ORANGE)" style={{ animation: 'spin 1s linear infinite' }} /> 识别中...
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 8px', fontSize: 11, color: '#fff' }}>行驶证正本</div>
                    <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '2px 6px', fontSize: 10, color: '#fff' }}>{Math.round(licenseScale * 100)}%</div>
                  </div>
                  {/* 工具栏 */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginTop: 8, background: '#f7f7f7', borderRadius: 20, padding: '2px', width: 'fit-content', margin: '8px auto 0' }}>
                    {[
                      { icon: ZoomOut, label: '缩小', action: () => setLicenseScale((s) => Math.max(s - 0.3, 0.5)) },
                      { icon: ZoomIn, label: '放大', action: () => setLicenseScale((s) => Math.min(s + 0.3, 4)) },
                      { icon: RotateCw, label: '旋转', action: () => setLicenseRotation((r) => r + 90) },
                    ].map((btn) => (
                      <button key={btn.label} onClick={btn.action}
                        style={{ background: 'transparent', border: 'none', borderRadius: 18, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 12, color: '#666', transition: 'background 0.15s' }}
                        onPointerDown={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
                        onPointerUp={(e) => (e.currentTarget.style.background = 'transparent')}
                        onPointerLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <btn.icon size={15} /> {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {cur.ocrStatus === 'scanning' && !cur.licenseImageUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: 13, color: 'var(--weui-ORANGE)' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> 正在识别行驶证信息...
                </div>
              )}

              {cur.vinQueryStatus === 'loading' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 13, color: 'var(--weui-BLUE)' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> 正在通过VIN码查询品牌车型...
                </div>
              )}

              {cur.ocrStatus === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--weui-RED)', marginBottom: 8 }}>
                  <AlertCircle size={14} /> 识别失败，请重试或手动填写
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => handleOcrScan(activeIdx)} disabled={cur.ocrStatus === 'scanning'}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500,
                    background: cur.ocrStatus === 'done' ? '#fff' : 'var(--weui-brand)', color: cur.ocrStatus === 'done' ? 'var(--weui-brand)' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    opacity: cur.ocrStatus === 'scanning' ? 0.6 : 1,
                    border: cur.ocrStatus === 'done' ? '1px solid var(--weui-brand)' : 'none',
                  } as React.CSSProperties}>
                  <Camera size={16} />
                  {cur.ocrStatus === 'done' ? '重新拍摄' : cur.ocrStatus === 'scanning' ? '识别中...' : '拍摄/上传行驶证'}
                </button>
              </div>
            </div>
          </div>

          {/* 车辆信息表单 */}
          <div className="section-hd">
            车辆信息 {mode === 'batch' && <span style={{ color: 'var(--weui-brand)', fontSize: 12 }}>（第{activeIdx + 1}台 / 共{vehicles.length}台）</span>}
          </div>
          <div className="weui-cells">
            {[
              { field: 'plateNo' as const, label: '车牌号', placeholder: '如：粤A·D2588' },
              { field: 'vin' as const, label: 'VIN码', placeholder: '17位车架号' },
              { field: 'brandModel' as const, label: '品牌车型', placeholder: '通过VIN码自动查询' },
              { field: 'engineNo' as const, label: '发动机号', placeholder: '请输入发动机号' },
              { field: 'mileage' as const, label: '里程(万km)', placeholder: '如：3.2' },
              { field: 'transferCount' as const, label: '过户次数', placeholder: '请输入' },
              { field: 'price' as const, label: '采购价(万)', placeholder: '系统定价或手动填写' },
            ].map((f) => (
              <div key={f.field} className="weui-cell">
                <div className="weui-cell__hd">
                  <label className="weui-label" style={{ width: 90, fontSize: 14 }}>{f.label}{ocrBadge(f.field)}</label>
                </div>
                <div className="weui-cell__bd" style={{ display: 'flex', alignItems: 'center' }}>
                  <input className="weui-input" placeholder={f.placeholder}
                    value={cur[f.field]} onChange={(e) => updateField(f.field, e.target.value)}
                    style={{ fontSize: 14, color: cur.ocrFields.includes(f.field) ? 'var(--weui-GREEN)' : undefined, fontWeight: cur.ocrFields.includes(f.field) ? 500 : undefined }} />
                  {f.field === 'vin' && cur.vinQueryStatus === 'loading' && <Loader size={14} color="var(--weui-BLUE)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
                  {f.field === 'vin' && cur.vinQueryStatus === 'done' && <CheckCircle size={14} color="var(--weui-GREEN)" style={{ flexShrink: 0 }} />}
                  {f.field === 'brandModel' && cur.vinQueryStatus === 'done' && <CheckCircle size={14} color="var(--weui-GREEN)" style={{ flexShrink: 0 }} />}
                </div>
              </div>
            ))}
            {[
              { field: 'useType' as const, label: '使用性质' },
              { field: 'registerDate' as const, label: '上牌日期' },
              { field: 'color' as const, label: '颜色' },
              { field: 'condition' as const, label: '车况' },
            ].map((f) => (
              <div key={f.field} className="weui-cell">
                <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>{f.label}{ocrBadge(f.field)}</label></div>
                <div className="weui-cell__bd" style={{ fontSize: 14, color: cur[f.field] ? (cur.ocrFields.includes(f.field) ? 'var(--weui-GREEN)' : 'var(--weui-FG-0)') : 'var(--weui-FG-1)', fontWeight: cur.ocrFields.includes(f.field) ? 500 : undefined }}>
                  {cur[f.field] || '请选择'}
                </div>
                <div className="weui-cell__ft"><ChevronDown size={16} color="var(--weui-FG-2)" /></div>
              </div>
            ))}
          </div>

          {mode === 'batch' && vehicles.length > 1 && (
            <div style={{ background: '#FFF1F0', margin: '8px 16px', borderRadius: 8, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--weui-FG-1)' }}>{vehicles.length}台车辆合计</span>
              <span className="price" style={{ fontWeight: 600 }}>{vehicles.reduce((s, v) => s + (parseFloat(v.price) || 0), 0).toFixed(2)}万</span>
            </div>
          )}

        </>
      )}

      {/* ===== Step 2: 车况 & 照片 ===== */}
      {step === 1 && (
        <>
          {mode === 'batch' && (
            <div style={{ background: '#fff', padding: '10px 16px', borderBottom: '0.5px solid var(--weui-FG-3)', display: 'flex', gap: 6, overflowX: 'auto' }}>
              {vehicles.map((v, i) => (
                <div key={v.id} onClick={() => setActiveIdx(i)} style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
                  background: i === activeIdx ? 'var(--weui-brand)' : 'var(--weui-BG-1)', color: i === activeIdx ? '#fff' : 'var(--weui-FG-1)' }}>
                  第{i + 1}台 {v.plateNo || ''}
                </div>
              ))}
            </div>
          )}

          <div className="section-hd">车况信息 {mode === 'batch' && <span style={{ color: 'var(--weui-brand)', fontSize: 12 }}>（第{activeIdx + 1}台）</span>}</div>
          <div className="weui-cells">
            {['碰撞', '水泡', '火烧', '维保报告'].map((label) => (
              <div key={label} className="weui-cell">
                <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>{label}</label></div>
                <div className="weui-cell__bd" style={{ fontSize: 14 }}>{label === '维保报告' ? '有' : '正常'}</div>
                <div className="weui-cell__ft"><ChevronDown size={16} color="var(--weui-FG-2)" /></div>
              </div>
            ))}
            <div className="weui-cell">
              <div className="weui-cell__bd">
                <textarea className="weui-textarea" placeholder="请描述车况（限200字）" rows={3} maxLength={200} style={{ fontSize: 14 }} />
                <div className="weui-textarea-counter"><span>0</span>/200</div>
              </div>
            </div>
          </div>

          <div className="section-hd" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>车辆照片 & 证件</span>
            <span style={{ fontSize: 12, color: 'var(--weui-brand)' }}>{Object.values(photoAssigned).filter(Boolean).length}/{photoSlots.length}</span>
          </div>

          <div style={{ padding: '0 16px 8px' }}>
            <input ref={batchInputRef} type="file" accept="image/*" multiple onChange={handleBatchPhotos} style={{ display: 'none' }} />
            <button onClick={() => batchInputRef.current?.click()} style={{
              width: '100%', padding: '10px', borderRadius: 8, background: '#FFF1F0', border: '1px dashed #E8352E',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 500, color: '#E8352E', cursor: 'pointer' }}>
              <Images size={18} /> 批量选择照片
            </button>
            <div style={{ fontSize: 11, color: 'var(--weui-FG-1)', marginTop: 4, textAlign: 'center' }}>选择多张后拖动到对应分类</div>
          </div>

          {photoPool.length > 0 && (
            <div onDragOver={(e) => { e.preventDefault(); setDragOverTarget('pool') }} onDragLeave={() => setDragOverTarget(null)} onDrop={(e) => { e.preventDefault(); dropPool() }}
              style={{ margin: '0 16px 8px', padding: 10, borderRadius: 8, background: dragOverTarget === 'pool' ? '#E8F4FF' : '#fff', border: dragOverTarget === 'pool' ? '2px dashed var(--weui-BLUE)' : '1px solid var(--weui-FG-3)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>📷 待分类 ({photoPool.length}张)</span>
                <span style={{ fontSize: 11, color: 'var(--weui-FG-1)', fontWeight: 400 }}>拖动到下方</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {photoPool.map((p) => (
                  <div key={p.id} draggable onDragStart={() => startDrag(p)}
                    onDragEnd={() => { if (draggingPhoto) { setPhotoPool((prev) => [...prev, draggingPhoto]); setDraggingPhoto(null) } }}
                    style={{ position: 'relative', aspectRatio: '1', borderRadius: 4, overflow: 'hidden', cursor: 'grab', border: '1px solid var(--weui-FG-3)' }}>
                    <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.45)', padding: '1px 3px', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GripVertical size={8} color="#fff" /><span style={{ fontSize: 8, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{p.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setPhotoPool((prev) => prev.filter((x) => x.id !== p.id)) }}
                      style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '0 0 0 4px', padding: 2, cursor: 'pointer', display: 'flex' }}><X size={10} color="#fff" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photoSlots.map((slot) => {
            const photo = photoAssigned[slot.key]; const isOver = dragOverTarget === slot.key
            return (
              <div key={slot.key} onDragOver={(e) => { e.preventDefault(); setDragOverTarget(slot.key) }} onDragLeave={() => setDragOverTarget(null)} onDrop={(e) => { e.preventDefault(); dropSlot(slot.key) }}
                style={{ background: isOver ? '#FFF1F0' : '#fff', margin: '4px 16px', borderRadius: 8, padding: 10, border: isOver ? '2px dashed #E8352E' : '1px solid var(--weui-FG-3)', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{slot.label}</span>
                    {slot.required && <span style={{ color: 'var(--weui-RED)', fontSize: 11 }}>*</span>}
                    {slot.hint && <span style={{ fontSize: 10, color: 'var(--weui-BLUE)' }}>{slot.hint}</span>}
                  </div>
                  {photo ? <span className="tag tag-success" style={{ fontSize: 10 }}>已上传</span> : slot.required ? <span className="tag tag-error" style={{ fontSize: 10 }}>必拍</span> : <span className="tag tag-default" style={{ fontSize: 10 }}>选拍</span>}
                </div>
                {photo ? (
                  <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
                    <img src={photo.url} alt="" draggable onDragStart={() => startDrag(photo, slot.key)} onClick={() => openViewer(photo.url)} style={{ width: '100%', height: 80, objectFit: 'cover', cursor: 'grab', display: 'block' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '12px 6px 4px', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                      <button onClick={() => directUploadSlot(slot.key)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 3, padding: '2px 6px', fontSize: 10, color: '#fff', cursor: 'pointer' }}>重拍</button>
                      <button onClick={() => { const old = photoAssigned[slot.key]; if (old) setPhotoPool((p) => [...p, old]); setPhotoAssigned((p) => ({ ...p, [slot.key]: null })) }}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 3, padding: '2px 6px', fontSize: 10, color: '#fff', cursor: 'pointer' }}>移除</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => directUploadSlot(slot.key)} style={{ padding: 14, textAlign: 'center', cursor: 'pointer', borderRadius: 4, background: isOver ? '#FFF1F0' : 'var(--weui-BG-1)', border: '1px dashed var(--weui-FG-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Camera size={18} color={isOver ? '#E8352E' : 'var(--weui-FG-2)'} />
                    <span style={{ fontSize: 11, color: isOver ? '#E8352E' : 'var(--weui-FG-1)' }}>{isOver ? '松手放置' : '点击拍照或拖入'}</span>
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}

      {/* ===== Step 3: 车主/卖方信息 ===== */}
      {step === 2 && (
        <>
          <div className="section-hd">车主/卖方类型</div>
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8 }}>
            {['个人', '企业', '个体工商户'].map((t) => (
              <div key={t} onClick={() => setOwnerTypeState(t)} style={{
                flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                background: ownerTypeState === t ? 'var(--brand)' : '#fff', color: ownerTypeState === t ? '#fff' : 'var(--text-1)',
                border: ownerTypeState === t ? 'none' : '1px solid var(--border)',
              }}>{t}</div>
            ))}
          </div>

          <div className="section-hd">车主/卖方信息</div>
          <div className="weui-cells">
            {ownerTypeState === '个人' && (
              <>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>证件类型</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14 }}>身份证</div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>车主姓名</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入车主姓名" style={{ fontSize: 14 }} /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>身份证号码</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入身份证号码" style={{ fontSize: 14 }} /></div>
                </div>
              </>
            )}
            {ownerTypeState === '企业' && (
              <>
                <div className="weui-cell" onClick={() => setShowCertPicker(!showCertPicker)} style={{ cursor: 'pointer' }}>
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>证件类型</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14 }}>{enterpriseCertType}</div>
                  <div className="weui-cell__ft"><ChevronDown size={16} color="var(--text-3)" /></div>
                </div>
                {showCertPicker && (
                  <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8 }}>
                    {['统一社会信用代码', '组织机构代码'].map((t) => (
                      <div key={t} onClick={() => { setEnterpriseCertType(t); setShowCertPicker(false) }} style={{
                        flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 6, fontSize: 13, cursor: 'pointer',
                        background: enterpriseCertType === t ? 'var(--brand)' : 'var(--bg)', color: enterpriseCertType === t ? '#fff' : 'var(--text-1)',
                      }}>{t}</div>
                    ))}
                  </div>
                )}
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>企业名称</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入企业名称" style={{ fontSize: 14 }} /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>{enterpriseCertType === '统一社会信用代码' ? '信用代码' : '机构代码'}</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder={`请输入${enterpriseCertType}`} style={{ fontSize: 14 }} /></div>
                </div>
              </>
            )}
            {ownerTypeState === '个体工商户' && (
              <>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>法人证件类型</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-3)' }}>身份证</div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>法人姓名</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入法人姓名" style={{ fontSize: 14 }} /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>法人身份证号码</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入法人身份证号码" style={{ fontSize: 14 }} /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>企业证件类型</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14 }}>{enterpriseCertType}</div>
                  <div className="weui-cell__ft" onClick={() => setEnterpriseCertType(enterpriseCertType === '统一社会信用代码' ? '组织机构代码' : '统一社会信用代码')}><ChevronDown size={16} color="var(--text-3)" /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>企业名称</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入企业名称" style={{ fontSize: 14 }} /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>企业证件号码</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder={`请输入${enterpriseCertType}`} style={{ fontSize: 14 }} /></div>
                </div>
              </>
            )}
            <div className="weui-cell">
              <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>联系电话</label></div>
              <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入手机号" style={{ fontSize: 14 }} /></div>
            </div>
          </div>

          <div className="section-hd">证件照片（支持OCR自动识别）</div>
          <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {(ownerTypeState === '企业' ? ['营业执照'] : ownerTypeState === '个体工商户' ? ['法人身份证人像页', '法人身份证国徽页', '营业执照/组织机构代码证'] : ['身份证正面', '身份证反面']).map((label) => (
              <div key={label} className="upload-area" style={{ padding: ownerIdPhotos[label] ? 0 : 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                {ownerIdPhotos[label] ? (
                  <img src={ownerIdPhotos[label]} alt={label} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 10 }} />
                ) : (
                  <><Camera size={20} color="var(--text-3)" /><span style={{ fontSize: 11, color: 'var(--text-2)' }}>{label}</span></>
                )}
              </div>
            ))}
          </div>

          <div className="section-hd">委托人信息（非车主签署时填写）</div>
          <div className="weui-cells">
            <div className="weui-cell">
              <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>委托人身份</label></div>
              <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-2)' }}>车主本人</div>
              <div className="weui-cell__ft"><ChevronDown size={16} color="var(--text-3)" /></div>
            </div>
          </div>
        </>
      )}

      {/* ===== Step 4: 收款 & 签名 ===== */}
      {step === 3 && (
        <>
          <div className="section-hd">收款信息</div>

          {ownerTypeState === '个人' && (
            <div className="weui-cells">
              <div className="weui-cell">
                <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>开户名</label></div>
                <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-2)' }}>自动带入车主姓名（不可修改）</div>
              </div>
              {[
                { key: 'payeeCardNo' as const, l: '银行卡号', p: '请输入银行卡号' },
                { key: 'payeeBank' as const, l: '所属银行', p: '请输入所属银行' },
                { key: 'payeePhone' as const, l: '预留手机', p: '银行预留手机号' },
              ].map((f) => (
                <div key={f.l} className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>{f.l}</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder={f.p} style={{ fontSize: 14 }}
                      value={paymentData[f.key]} onChange={(e) => setPaymentData({ ...paymentData, [f.key]: e.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {ownerTypeState === '企业' && (
            <>
              <div className="weui-cells">
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>开户名</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-2)' }}>自动带入企业名称（不可修改）</div>
                </div>
                {[
                  { key: 'payeeCardNo' as const, l: '对公账号', p: '请输入对公账号' },
                  { key: 'payeeBank' as const, l: '所属银行', p: '请输入所属银行' },
                ].map((f) => (
                  <div key={f.l} className="weui-cell">
                    <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>{f.l}</label></div>
                    <div className="weui-cell__bd">
                      <input className="weui-input" placeholder={f.p} style={{ fontSize: 14 }}
                        value={paymentData[f.key]} onChange={(e) => setPaymentData({ ...paymentData, [f.key]: e.target.value })} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ margin: '8px 16px', background: 'var(--blue-bg)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--blue)' }}>
                ℹ️ 系统会自动向该对公账户转入0.01元用于验证账号有效性
              </div>
            </>
          )}

          {ownerTypeState === '个体工商户' && (
            <>
              {/* 银行卡类型选择 */}
              <div className="weui-cells">
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14, color: 'var(--brand)' }}>*银行卡类型</label></div>
                  <div className="weui-cell__bd" style={{ display: 'flex', gap: 12 }}>
                    {['法人名下银行卡', '对公账户银行卡'].map((t) => (
                      <label key={t} onClick={() => setIndivPayMode(t)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 14 }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', border: indivPayMode === t ? '5px solid var(--brand)' : '2px solid var(--text-3)', display: 'inline-block' }} />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 银行卡照片上传 */}
              <div style={{ padding: '8px 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {['上传银行卡正面', '上传银行卡正面'].map((label, i) => (
                  <div key={i} className="upload-area" style={{ aspectRatio: '3/2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Camera size={24} color="var(--text-3)" />
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                  </div>
                ))}
              </div>

              <div className="weui-cells">
                {/* 开户名 */}
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>开户名</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-3)' }}>
                    {indivPayMode === '法人名下银行卡' ? '自动带入法人姓名（不可修改）' : '自动带入企业名称（不可修改）'}
                  </div>
                </div>
                {/* 账户类型 */}
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14, color: 'var(--brand)' }}>*账户类型</label></div>
                  <div className="weui-cell__bd" style={{ display: 'flex', gap: 12 }}>
                    {(indivPayMode === '法人名下银行卡'
                      ? [{ key: '中信', label: '中信个人账户' }, { key: '他行', label: '他行个人账户' }]
                      : [{ key: '中信', label: '中信企业账户' }, { key: '他行', label: '他行企业账户' }]
                    ).map((opt) => (
                      <label key={opt.key} onClick={() => setIndivAccountType(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 14 }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', border: indivAccountType === opt.key ? '5px solid var(--brand)' : '2px solid var(--text-3)', display: 'inline-block' }} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
                {/* 银行卡号 */}
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14, color: 'var(--brand)' }}>*银行卡号</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入银行卡号" style={{ fontSize: 14 }}
                      value={paymentData.payeeCardNo} onChange={(e) => setPaymentData({ ...paymentData, payeeCardNo: e.target.value })} />
                  </div>
                </div>
                {/* 提示 */}
                <div style={{ padding: '4px 16px 8px', fontSize: 11, color: 'var(--text-3)' }}>
                  请填写与开户名对应的银行卡号，此银行卡将作为今后余额提现到账银行卡
                </div>
                {/* 银行名称 */}
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14, color: 'var(--brand)' }}>*银行名称</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14 }}>请选择银行</div>
                  <div className="weui-cell__ft"><ChevronDown size={16} color="var(--text-3)" /></div>
                </div>
                {/* 银行预留手机（仅法人名下银行卡） */}
                {indivPayMode === '法人名下银行卡' && (
                  <div className="weui-cell">
                    <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14, color: 'var(--brand)' }}>*预留手机</label></div>
                    <div className="weui-cell__bd">
                      <input className="weui-input" placeholder="请输入银行卡对应银行预留手机号" style={{ fontSize: 14 }}
                        value={paymentData.payeePhone} onChange={(e) => setPaymentData({ ...paymentData, payeePhone: e.target.value })} />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="section-hd">交车信息</div>
          <div className="weui-cells">
            <div className="weui-cell">
              <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>交车时间</label></div>
              <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--weui-FG-1)' }}>请选择日期</div>
              <div className="weui-cell__ft"><ChevronDown size={16} color="var(--weui-FG-2)" /></div>
            </div>
            <div className="weui-cell">
              <div className="weui-cell__hd"><label className="weui-label" style={{ width: 90, fontSize: 14 }}>交车地点</label></div>
              <div className="weui-cell__bd"><input className="weui-input" placeholder="如：白云服务中心1库（A区）" style={{ fontSize: 14 }}
                value={paymentData.deliveryLocation} onChange={(e) => setPaymentData({ ...paymentData, deliveryLocation: e.target.value })} /></div>
            </div>
          </div>

          <div className="section-hd">签名确认</div>

          {/* 业务员签名 — 当面签 */}
          <div style={{ padding: '0 16px 4px', fontSize: 13, color: 'var(--text-1)' }}>业务员签名 *</div>
          <div className="signature-box">点击此处进行手写签名</div>

          {/* 车主/委托人签名 — 支持当面签或远程签 */}
          <div style={{ padding: '12px 16px 4px', fontSize: 13, color: 'var(--text-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>车主/委托人签名 *</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['local', 'remote'] as const).map((m) => (
                <span key={m} onClick={() => setSignMode(m)} style={{
                  fontSize: 12, padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                  background: signMode === m ? 'var(--brand-bg-strong)' : 'var(--bg)',
                  color: signMode === m ? 'var(--brand)' : 'var(--text-2)',
                  fontWeight: signMode === m ? 600 : 400,
                }}>{m === 'local' ? '当面签名' : '远程签名'}</span>
              ))}
            </div>
          </div>

          {signMode === 'local' && (
            <div className="signature-box" style={{ marginBottom: 16 }}>点击此处进行手写签名</div>
          )}

          {signMode === 'remote' && (
            <div style={{ margin: '8px 16px 16px', background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', background: 'var(--blue-bg)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', marginBottom: 4 }}>远程签名</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>生成签名链接发送给车主/委托人，对方打开链接即可完成签名</div>
              </div>
              {!remoteSignUrl ? (
                <div style={{ padding: 16 }}>
                  <button onClick={() => {
                    setRemoteSignUrl(`https://sign.weichebang.com/s/${Date.now().toString(36)}`)
                    setRemoteSignStatus('pending')
                  }} style={{
                    width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                    background: 'var(--blue)', color: '#fff', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'var(--font-display)',
                  }}>生成签名链接</button>
                </div>
              ) : (
                <div style={{ padding: 16 }}>
                  {/* 链接展示 */}
                  <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, fontSize: 12, color: 'var(--text-1)', wordBreak: 'break-all', fontFamily: 'var(--font-num)' }}>{remoteSignUrl}</div>
                    <button onClick={() => { navigator.clipboard?.writeText(remoteSignUrl); alert('链接已复制') }}
                      style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: '#fff', fontSize: 12, cursor: 'pointer', color: 'var(--text-1)', fontWeight: 500 }}>
                      复制
                    </button>
                  </div>

                  {/* 发送方式 */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <button onClick={() => alert('已通过微信发送签名链接')} style={{
                      flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #07C160', background: 'rgba(7,193,96,0.06)',
                      fontSize: 13, color: '#07C160', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}>微信发送</button>
                    <button onClick={() => alert('已通过短信发送签名链接')} style={{
                      flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--blue)', background: 'var(--blue-bg)',
                      fontSize: 13, color: 'var(--blue)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}>短信发送</button>
                  </div>

                  {/* 签名状态 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: remoteSignStatus === 'signed' ? 'var(--green-bg)' : 'var(--orange-bg)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: remoteSignStatus === 'signed' ? 'var(--green)' : 'var(--orange)' }} />
                    <span style={{ fontSize: 13, color: remoteSignStatus === 'signed' ? 'var(--green)' : 'var(--orange)', fontWeight: 500 }}>
                      {remoteSignStatus === 'signed' ? '对方已完成签名' : '等待对方签名...'}
                    </span>
                    {remoteSignStatus === 'pending' && (
                      <button onClick={() => setRemoteSignStatus('signed')} style={{
                        marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)',
                        background: '#fff', fontSize: 11, cursor: 'pointer', color: 'var(--text-2)',
                      }}>模拟已签</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ background: '#fff', margin: '0 16px 16px', borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>采购汇总</div>
            {[
              ['采购模式', mode === 'single' ? '单车采购（一车一合同）' : '批量采购（一批一合同）'],
              ['车辆数量', `${vehicles.length}台`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', color: 'var(--weui-FG-1)' }}>
                <span>{l}</span><span style={{ color: 'var(--weui-FG-0)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0', color: 'var(--weui-FG-1)' }}>
              <span>采购总价</span>
              <span className="price" style={{ fontSize: 16, fontWeight: 600 }}>{vehicles.reduce((s, v) => s + (parseFloat(v.price) || 0), 0).toFixed(2)}万</span>
            </div>
          </div>
        </>
      )}

      {/* Bottom */}
      <div className="bottom-bar" style={{ flexWrap: 'wrap' }}>
        <button onClick={fillCurrentStep}
          style={{ width: '100%', padding: '6px', borderRadius: 6, border: '1px dashed var(--weui-ORANGE)', background: '#FFF8E6', color: 'var(--weui-ORANGE)', fontSize: 12, cursor: 'pointer', marginBottom: 4, fontWeight: 500 }}>
          🧪 填充测试数据（第{step + 1}步）
        </button>
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          {step > 0 && <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(step - 1)}>上一步</button>}
          {step < 3 ? (
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(step + 1)}>下一步</button>
          ) : (
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>提交采购申请</button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      <ImageViewer src={viewerSrc} visible={viewerVisible} onClose={() => setViewerVisible(false)} />
    </div>
  )
}
