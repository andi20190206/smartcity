import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, Camera, Plus, Trash2, CheckCircle, Search, FileText, CreditCard, Scan, Loader, X } from 'lucide-react'

const stepTitles = ['车辆信息', '买家信息', '付款信息', '签名附件']

interface SalesVehicle {
  id: string
  plateNo: string; vin: string; brandModel: string; engineNo: string
  useType: string; mileage: string; registerDate: string
  contractPrice: string; salesPrice: string
  selected: boolean
}

/** 模拟已上架车辆（从采购车辆列表带入） */
const listedVehicles: SalesVehicle[] = [
  { id: 'LV01', plateNo: '粤A·12345', vin: 'LVHCV6637K50CLTS1', brandModel: '别克英朗 2019款 18T 自动互联精英型', engineNo: 'LFV2A21G5K3012345', useType: '非营运', mileage: '3.2', registerDate: '2019-06-15', contractPrice: '5.80', salesPrice: '', selected: false },
  { id: 'LV02', plateNo: '粤B·67890', vin: 'LGBH52E04GY654321', brandModel: '丰田卡罗拉 2021款 1.8L 双擎精英版', engineNo: '2ZR1234567', useType: '非营运', mileage: '5.8', registerDate: '2021-03-10', contractPrice: '9.20', salesPrice: '', selected: false },
  { id: 'LV03', plateNo: '粤A·33456', vin: 'WBAJB0C55JB174523', brandModel: '凯迪拉克 GT4 2023款 25T 尊贵型', engineNo: 'LSY1234567', useType: '非营运', mileage: '1.5', registerDate: '2023-01-20', contractPrice: '17.50', salesPrice: '', selected: false },
  { id: 'LV04', plateNo: '粤A·33457', vin: 'LNBSCCAK1JW200008', brandModel: '奔驰C260L 2023款 运动版', engineNo: 'M264920A7654321', useType: '非营运', mileage: '2.1', registerDate: '2023-05-18', contractPrice: '24.50', salesPrice: '', selected: false },
]

export default function SalesCreate() {
  const [step, setStep] = useState(0)
  const [vehicles, setVehicles] = useState<SalesVehicle[]>(listedVehicles)
  const [searchVehicle, setSearchVehicle] = useState('')
  const navigate = useNavigate()

  // 买家信息
  const [buyerType, setBuyerType] = useState<string>('个人')
  const [buyerData, setBuyerData] = useState({ name: '', idNo: '', phone: '' })

  // 付款信息
  const [payerIsBuyer, setPayerIsBuyer] = useState(true)
  const [payerData, setPayerData] = useState({ type: '个人', name: '', idNo: '', cardNo: '', bank: '', phone: '' })

  // 个体工商户收款方式
  const [indivPayMode, setIndivPayMode] = useState<string>('法人名下银行卡')
  // 个体工商户账户类型
  const [indivAccountType, setIndivAccountType] = useState<string>('他行')
  // 企业证件类型
  const [enterpriseCertType, setEnterpriseCertType] = useState<string>('统一社会信用代码')
  const [showCertPicker, setShowCertPicker] = useState(false)
  // 第三方付款人类型
  const [thirdPayerType, setThirdPayerType] = useState<string>('个人')
  const [thirdPayerIndivMode, setThirdPayerIndivMode] = useState<string>('法人名下银行卡')
  const [thirdPayerEntCert, setThirdPayerEntCert] = useState<string>('统一社会信用代码')
  const [thirdPayerAccountType, setThirdPayerAccountType] = useState<string>('他行')

  // 签名
  const [salesSign, setSalesSign] = useState(false)
  const [buyerSign, setBuyerSign] = useState(false)
  // 测试数据类型循环
  const [testTypeIndex, setTestTypeIndex] = useState(0)

  // 银行卡OCR
  const [bankCardImage, setBankCardImage] = useState<string | null>(null)
  const [ocrScanning, setOcrScanning] = useState(false)
  const [ocrDone, setOcrDone] = useState(false)
  const bankCardInputRef = useRef<HTMLInputElement>(null)

  /** 模拟银行卡OCR识别 */
  const handleBankCardOCR = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setBankCardImage(e.target?.result as string)
      setOcrScanning(true)
      setOcrDone(false)
      // 模拟OCR识别延迟
      setTimeout(() => {
        setOcrScanning(false)
        setOcrDone(true)
        // 模拟OCR识别结果 — 自动回填付款人信息
        setPayerData((prev) => ({
          ...prev,
          name: buyerData.name || '刘伟',
          idNo: buyerData.idNo || '440106199201011234',
          cardNo: '6222 0210 0100 1234 567',
          bank: '中国工商银行广州天河支行',
          phone: buyerData.phone || '13900001111',
        }))
      }, 1500)
    }
    reader.readAsDataURL(file)
  }

  const clearBankCard = () => {
    setBankCardImage(null)
    setOcrDone(false)
    setOcrScanning(false)
    setPayerData((prev) => ({ ...prev, cardNo: '', bank: '' }))
  }

  const selectedVehicles = vehicles.filter((v) => v.selected)
  const totalContract = selectedVehicles.reduce((s, v) => s + (parseFloat(v.contractPrice) || 0), 0)
  const totalSales = selectedVehicles.reduce((s, v) => s + (parseFloat(v.salesPrice) || 0), 0)

  const toggleSelect = (id: string) => {
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, selected: !v.selected } : v))
  }

  const updateSalesPrice = (id: string, price: string) => {
    setVehicles((prev) => prev.map((v) => v.id === id ? { ...v, salesPrice: price } : v))
  }

  const filteredVehicles = vehicles.filter((v) => {
    if (!searchVehicle) return true
    const s = searchVehicle.toLowerCase()
    return v.plateNo.includes(s) || v.vin.toLowerCase().includes(s) || v.brandModel.toLowerCase().includes(s)
  })

  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = () => {
    setShowConfirm(true)
  }

  const confirmSubmit = () => {
    setShowConfirm(false)
    alert('销售签约申请已提交')
    navigate('/sales')
  }

  // 测试数据填充
  const fillTestData = () => {
    if (step === 0) {
      setVehicles((prev) => prev.map((v, i) => i < 2 ? { ...v, selected: true, salesPrice: (parseFloat(v.contractPrice) + 0.5 + i * 0.3).toFixed(2) } : v))
    } else if (step === 1) {
      const types = ['个人', '企业', '个体工商户'] as const
      const t = types[testTypeIndex % 3]
      setTestTypeIndex(testTypeIndex + 1)
      setBuyerType(t)
      if (t === '个人') {
        setBuyerData({ name: '刘伟', idNo: '440106199201011234', phone: '13900001111' })
      } else if (t === '企业') {
        setBuyerData({ name: '广州市恒达汽车贸易有限公司', idNo: '91440101MA5CXLR8XY', phone: '020-88886666' })
      } else {
        setBuyerData({ name: '黄建国', idNo: '440106197805012233', phone: '13700003333' })
      }
    } else if (step === 2) {
      setPayerIsBuyer(true)
    } else if (step === 3) {
      setSalesSign(true)
      setBuyerSign(true)
    }
  }

  return (
    <div className="page page-bottom">
      <div className="nav-dark">
        <button className="nav-back" onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}><ChevronLeft size={22} /></button>
        <div className="nav-title">销售签约</div>
        <div className="nav-right" />
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

      {/* Step 0: 选择车辆 & 填写销售价 */}
      {step === 0 && (
        <>
          <div style={{ padding: '10px 16px', background: '#fff', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 22, padding: '8px 14px', gap: 8 }}>
              <Search size={16} color="var(--text-2)" />
              <input value={searchVehicle} onChange={(e) => setSearchVehicle(e.target.value)} placeholder="搜索车牌/VIN/品牌"
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, flex: 1, color: 'var(--text-0)' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 8 }}>
              从已上架车辆中选择，支持多选（同一买家）
            </div>
          </div>

          <div className="section-hd">已上架车辆（{filteredVehicles.length}台可选）</div>
          {filteredVehicles.map((v) => (
            <div key={v.id} style={{
              margin: '8px 16px', background: '#fff', borderRadius: 12, overflow: 'hidden',
              border: v.selected ? '1.5px solid var(--brand)' : '1px solid var(--border)',
              boxShadow: v.selected ? '0 2px 8px rgba(232,53,46,0.1)' : 'var(--shadow-sm)',
            }}>
              <div onClick={() => toggleSelect(v.id)} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, border: v.selected ? 'none' : '2px solid var(--text-3)',
                  background: v.selected ? 'var(--brand)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {v.selected && <CheckCircle size={16} color="#fff" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{v.plateNo}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>合同价 <span className="price" style={{ fontSize: 14 }}>{v.contractPrice}</span>万</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{v.brandModel}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>VIN: {v.vin}</div>
                </div>
              </div>
              {v.selected && (
                <div style={{ padding: '0 14px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-1)', flexShrink: 0 }}>销售价(万)</span>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--bg)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-2)', marginRight: 4 }}>¥</span>
                    <input type="number" value={v.salesPrice} onChange={(e) => updateSalesPrice(v.id, e.target.value)}
                      placeholder="请输入销售价" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-num)', color: 'var(--brand)', flex: 1, width: '100%' }} />
                  </div>
                </div>
              )}
            </div>
          ))}

          {selectedVehicles.length > 0 && (
            <div style={{ margin: '12px 16px', background: 'var(--brand-bg)', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-1)' }}>已选 {selectedVehicles.length} 台</span>
                <span style={{ color: 'var(--text-2)' }}>采购合同价合计 <span className="price">{totalContract.toFixed(2)}</span>万</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600 }}>
                <span style={{ color: 'var(--text-0)' }}>销售总价</span>
                <span className="price" style={{ fontSize: 18 }}>{totalSales.toFixed(2)}<span style={{ fontSize: 11, fontWeight: 500 }}>万</span></span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 1: 买家信息 */}
      {step === 1 && (
        <>
          <div className="section-hd">买家类型</div>
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8 }}>
            {['个人', '企业', '个体工商户'].map((t) => (
              <div key={t} onClick={() => setBuyerType(t)} style={{
                flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                background: buyerType === t ? 'var(--brand)' : '#fff', color: buyerType === t ? '#fff' : 'var(--text-1)',
                border: buyerType === t ? 'none' : '1px solid var(--border)',
              }}>{t}</div>
            ))}
          </div>

          <div className="section-hd">买家信息</div>
          <div className="weui-cells">
            {buyerType === '个人' && (
              <>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>证件类型</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14 }}>身份证</div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>买家姓名</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入姓名" value={buyerData.name} onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })} style={{ fontSize: 14 }} />
                  </div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>身份证号码</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入身份证号码" value={buyerData.idNo} onChange={(e) => setBuyerData({ ...buyerData, idNo: e.target.value })} style={{ fontSize: 14 }} />
                  </div>
                </div>
              </>
            )}
            {buyerType === '企业' && (
              <>
                <div className="weui-cell" onClick={() => setShowCertPicker(!showCertPicker)} style={{ cursor: 'pointer' }}>
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>证件类型</label></div>
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
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业名称</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入企业名称" value={buyerData.name} onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })} style={{ fontSize: 14 }} />
                  </div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>{enterpriseCertType === '统一社会信用代码' ? '信用代码' : '机构代码'}</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder={`请输入${enterpriseCertType}`} value={buyerData.idNo} onChange={(e) => setBuyerData({ ...buyerData, idNo: e.target.value })} style={{ fontSize: 14 }} />
                  </div>
                </div>
              </>
            )}
            {buyerType === '个体工商户' && (
              <>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>法人证件类型</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-3)' }}>身份证</div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>法人姓名</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入法人姓名" value={buyerData.name} onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })} style={{ fontSize: 14 }} />
                  </div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>法人身份证号码</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入法人身份证号码" value={buyerData.idNo} onChange={(e) => setBuyerData({ ...buyerData, idNo: e.target.value })} style={{ fontSize: 14 }} />
                  </div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业证件类型</label></div>
                  <div className="weui-cell__bd" style={{ fontSize: 14 }}>{enterpriseCertType}</div>
                  <div className="weui-cell__ft" onClick={() => setEnterpriseCertType(enterpriseCertType === '统一社会信用代码' ? '组织机构代码' : '统一社会信用代码')}><ChevronDown size={16} color="var(--text-3)" /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业名称</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入企业名称" style={{ fontSize: 14 }} /></div>
                </div>
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业证件号码</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder={`请输入${enterpriseCertType}`} style={{ fontSize: 14 }} /></div>
                </div>
              </>
            )}
            <div className="weui-cell">
              <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>联系电话</label></div>
              <div className="weui-cell__bd">
                <input className="weui-input" placeholder="请输入联系电话" value={buyerData.phone} onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })} style={{ fontSize: 14 }} />
              </div>
            </div>
          </div>

          {/* 买家证件上传 */}
          <div className="section-hd">买家证件（支持OCR识别）</div>
          <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {(buyerType === '企业' ? ['营业执照'] : buyerType === '个体工商户' ? ['法人身份证人像页', '法人身份证国徽页', '营业执照/组织机构代码证'] : ['身份证正面', '身份证反面']).map((label) => (
              <div key={label} className="upload-area" style={{ aspectRatio: '3/2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Camera size={24} color="var(--text-3)" />
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2: 付款信息 */}
      {step === 2 && (
        <>
          <div className="section-hd">付款人身份</div>
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8 }}>
            {[{ key: true, label: '付款人是买家' }, { key: false, label: '付款人非买家' }].map((opt) => (
              <div key={String(opt.key)} onClick={() => setPayerIsBuyer(opt.key)} style={{
                flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                background: payerIsBuyer === opt.key ? 'var(--brand)' : '#fff', color: payerIsBuyer === opt.key ? '#fff' : 'var(--text-1)',
                border: payerIsBuyer === opt.key ? 'none' : '1px solid var(--border)',
              }}>{opt.label}</div>
            ))}
          </div>

          {payerIsBuyer && (
            <>
              <div className="section-hd">银行卡上传（OCR自动识别）</div>
              <div style={{ padding: '0 16px 12px' }}>
                <input ref={bankCardInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBankCardOCR(f); e.target.value = '' }} />
                {!bankCardImage ? (
                  <div onClick={() => bankCardInputRef.current?.click()} style={{
                    background: '#fff', borderRadius: 14, border: '2px dashed var(--border-strong)',
                    padding: '24px 16px', cursor: 'pointer', textAlign: 'center',
                    transition: 'all 0.2s',
                  }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px',
                      background: 'var(--blue-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CreditCard size={28} color="var(--blue)" />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-0)', marginBottom: 4 }}>拍摄/上传银行卡</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>系统将自动识别卡号、开户行等信息并回填</div>
                    <div style={{
                      marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 20px', borderRadius: 20, background: 'var(--blue)', color: '#fff',
                      fontSize: 13, fontWeight: 600,
                    }}>
                      <Camera size={15} />拍照识别
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
                    overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
                  }}>
                    <div style={{ position: 'relative' }}>
                      <img src={bankCardImage} alt="银行卡" style={{
                        width: '100%', height: 180, objectFit: 'cover', display: 'block',
                      }} />
                      {ocrScanning && (
                        <div style={{
                          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                        }}>
                          <Loader size={28} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Scan size={16} color="#fff" />
                            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>OCR识别中...</span>
                          </div>
                        </div>
                      )}
                      {!ocrScanning && (
                        <button onClick={clearBankCard} style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <X size={16} color="#fff" />
                        </button>
                      )}
                    </div>
                    {ocrDone && (
                      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <CheckCircle size={14} color="var(--green)" />
                          <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>识别成功，已自动回填付款人信息</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                          卡号: {payerData.cardNo} · {payerData.bank}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="section-hd">收款账户信息</div>
              {buyerType === '个人' && (
                <div className="weui-cells">
                  <div className="weui-cell">
                    <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>开户名</label></div>
                    <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-2)' }}>自动带入买家姓名（不可修改）</div>
                  </div>
                  {[
                    { field: 'cardNo' as const, label: '银行卡号', placeholder: '请输入银行卡号' },
                    { field: 'bank' as const, label: '所属银行', placeholder: '请输入所属银行' },
                    { field: 'phone' as const, label: '预留手机', placeholder: '银行预留手机号' },
                  ].map((f) => (
                    <div key={f.field} className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>{f.label}</label></div>
                      <div className="weui-cell__bd">
                        <input className="weui-input" placeholder={f.placeholder} value={payerData[f.field]} onChange={(e) => setPayerData({ ...payerData, [f.field]: e.target.value })} style={{ fontSize: 14 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {buyerType === '企业' && (
                <>
                  <div className="weui-cells">
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>开户名</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-2)' }}>自动带入企业名称（不可修改）</div>
                    </div>
                    {[
                      { field: 'cardNo' as const, label: '对公账号', placeholder: '请输入对公账号' },
                      { field: 'bank' as const, label: '所属银行', placeholder: '请输入所属银行' },
                    ].map((f) => (
                      <div key={f.field} className="weui-cell">
                        <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>{f.label}</label></div>
                        <div className="weui-cell__bd">
                          <input className="weui-input" placeholder={f.placeholder} value={payerData[f.field]} onChange={(e) => setPayerData({ ...payerData, [f.field]: e.target.value })} style={{ fontSize: 14 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ margin: '8px 16px', background: 'var(--blue-bg)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--blue)' }}>
                    ℹ️ 系统会自动向该对公账户转入0.01元用于验证账号有效性
                  </div>
                </>
              )}
              {buyerType === '个体工商户' && (
                <>
                  {/* 银行卡类型选择 */}
                  <div className="weui-cells">
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*银行卡类型</label></div>
                      <div className="weui-cell__bd" style={{ display: 'flex', gap: 12 }}>
                        {['法人名下银行卡', '对公账户银行卡'].map((t) => (
                          <label key={t} onClick={() => setIndivPayMode(t)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 13 }}>
                            <span style={{ width: 18, height: 18, borderRadius: '50%', border: indivPayMode === t ? '5px solid var(--brand)' : '2px solid var(--text-3)', display: 'inline-block' }} />
                            {t}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* 银行卡照片（支持OCR识别） */}
                  <div style={{ padding: '8px 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {['银行卡正面（OCR识别）', '银行卡反面'].map((label, i) => (
                      <div key={i} className="upload-area" style={{ aspectRatio: '3/2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Camera size={20} color="var(--text-3)" />
                          {i === 0 && <Scan size={14} color="var(--blue)" />}
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'center' }}>{label}</span>
                        {i === 0 && <span style={{ fontSize: 9, color: 'var(--blue)', fontWeight: 600 }}>自动识别卡号</span>}
                      </div>
                    ))}
                  </div>
                  <div className="weui-cells">
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>开户名</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-3)' }}>
                        {indivPayMode === '法人名下银行卡' ? '自动带入法人姓名（不可修改）' : '自动带入企业名称（不可修改）'}
                      </div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*账户类型</label></div>
                      <div className="weui-cell__bd" style={{ display: 'flex', gap: 12 }}>
                        {(indivPayMode === '法人名下银行卡'
                          ? [{ key: '中信', label: '中信个人账户' }, { key: '他行', label: '他行个人账户' }]
                          : [{ key: '中信', label: '中信企业账户' }, { key: '他行', label: '他行企业账户' }]
                        ).map((opt) => (
                          <label key={opt.key} onClick={() => setIndivAccountType(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 13 }}>
                            <span style={{ width: 18, height: 18, borderRadius: '50%', border: indivAccountType === opt.key ? '5px solid var(--brand)' : '2px solid var(--text-3)', display: 'inline-block' }} />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*银行卡号</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入银行卡号" value={payerData.cardNo} onChange={(e) => setPayerData({ ...payerData, cardNo: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                    <div style={{ padding: '4px 16px 8px', fontSize: 11, color: 'var(--text-3)' }}>请填写与开户名对应的银行卡号，此银行卡将作为今后余额提现到账银行卡</div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*银行名称</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14 }}>请选择银行</div>
                      <div className="weui-cell__ft"><ChevronDown size={16} color="var(--text-3)" /></div>
                    </div>
                    {indivPayMode === '法人名下银行卡' && (
                      <div className="weui-cell">
                        <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*预留手机</label></div>
                        <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入银行卡对应银行预留手机号" value={payerData.phone} onChange={(e) => setPayerData({ ...payerData, phone: e.target.value })} style={{ fontSize: 14 }} /></div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {!payerIsBuyer && (
            <>
              <div className="section-hd">第三方付款人类型</div>
              <div style={{ padding: '0 16px 8px', display: 'flex', gap: 8 }}>
                {['个人', '企业', '个体工商户'].map((t) => (
                  <div key={t} onClick={() => setThirdPayerType(t)} style={{
                    flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    background: thirdPayerType === t ? 'var(--brand)' : '#fff', color: thirdPayerType === t ? '#fff' : 'var(--text-1)',
                    border: thirdPayerType === t ? 'none' : '1px solid var(--border)',
                  }}>{t}</div>
                ))}
              </div>

              <div className="section-hd">付款人信息</div>
              <div className="weui-cells">
                {thirdPayerType === '个人' && (
                  <>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>证件类型</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14 }}>身份证</div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>付款人姓名</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入姓名" value={payerData.name} onChange={(e) => setPayerData({ ...payerData, name: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>身份证号码</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入身份证号码" value={payerData.idNo} onChange={(e) => setPayerData({ ...payerData, idNo: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                  </>
                )}
                {thirdPayerType === '企业' && (
                  <>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>证件类型</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14 }}>{thirdPayerEntCert}</div>
                      <div className="weui-cell__ft" onClick={() => setThirdPayerEntCert(thirdPayerEntCert === '统一社会信用代码' ? '组织机构代码' : '统一社会信用代码')}><ChevronDown size={16} color="var(--text-3)" /></div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业名称</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入企业名称" value={payerData.name} onChange={(e) => setPayerData({ ...payerData, name: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>{thirdPayerEntCert === '统一社会信用代码' ? '信用代码' : '机构代码'}</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder={`请输入${thirdPayerEntCert}`} value={payerData.idNo} onChange={(e) => setPayerData({ ...payerData, idNo: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                  </>
                )}
                {thirdPayerType === '个体工商户' && (
                  <>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>法人证件类型</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-3)' }}>身份证</div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>法人姓名</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入法人姓名" value={payerData.name} onChange={(e) => setPayerData({ ...payerData, name: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>法人身份证号码</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入法人身份证号码" value={payerData.idNo} onChange={(e) => setPayerData({ ...payerData, idNo: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业证件类型</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14 }}>{thirdPayerEntCert}</div>
                      <div className="weui-cell__ft" onClick={() => setThirdPayerEntCert(thirdPayerEntCert === '统一社会信用代码' ? '组织机构代码' : '统一社会信用代码')}><ChevronDown size={16} color="var(--text-3)" /></div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业名称</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入企业名称" style={{ fontSize: 14 }} /></div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>企业证件号码</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder={`请输入${thirdPayerEntCert}`} style={{ fontSize: 14 }} /></div>
                    </div>
                  </>
                )}
                <div className="weui-cell">
                  <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>联系电话</label></div>
                  <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入联系电话" value={payerData.phone} onChange={(e) => setPayerData({ ...payerData, phone: e.target.value })} style={{ fontSize: 14 }} /></div>
                </div>
              </div>

              <div className="section-hd">收款账户信息</div>
              {thirdPayerType === '个体工商户' ? (
                <>
                  {/* 银行卡类型选择 */}
                  <div className="weui-cells">
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*银行卡类型</label></div>
                      <div className="weui-cell__bd" style={{ display: 'flex', gap: 12 }}>
                        {['法人名下银行卡', '对公账户银行卡'].map((t) => (
                          <label key={t} onClick={() => setThirdPayerIndivMode(t)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 13 }}>
                            <span style={{ width: 18, height: 18, borderRadius: '50%', border: thirdPayerIndivMode === t ? '5px solid var(--brand)' : '2px solid var(--text-3)', display: 'inline-block' }} />
                            {t}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '8px 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {['银行卡正面（OCR识别）', '银行卡反面'].map((label, i) => (
                      <div key={i} className="upload-area" style={{ aspectRatio: '3/2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Camera size={20} color="var(--text-3)" />
                          {i === 0 && <Scan size={14} color="var(--blue)" />}
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'center' }}>{label}</span>
                        {i === 0 && <span style={{ fontSize: 9, color: 'var(--blue)', fontWeight: 600 }}>自动识别卡号</span>}
                      </div>
                    ))}
                  </div>
                  <div className="weui-cells">
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>开户名</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-3)' }}>
                        {thirdPayerIndivMode === '法人名下银行卡' ? '自动带入法人姓名（不可修改）' : '自动带入企业名称（不可修改）'}
                      </div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*账户类型</label></div>
                      <div className="weui-cell__bd" style={{ display: 'flex', gap: 12 }}>
                        {(thirdPayerIndivMode === '法人名下银行卡'
                          ? [{ key: '中信', label: '中信个人账户' }, { key: '他行', label: '他行个人账户' }]
                          : [{ key: '中信', label: '中信企业账户' }, { key: '他行', label: '他行企业账户' }]
                        ).map((opt) => (
                          <label key={opt.key} onClick={() => setThirdPayerAccountType(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 13 }}>
                            <span style={{ width: 18, height: 18, borderRadius: '50%', border: thirdPayerAccountType === opt.key ? '5px solid var(--brand)' : '2px solid var(--text-3)', display: 'inline-block' }} />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*银行卡号</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入银行卡号" value={payerData.cardNo} onChange={(e) => setPayerData({ ...payerData, cardNo: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                    <div style={{ padding: '4px 16px 8px', fontSize: 11, color: 'var(--text-3)' }}>请填写与开户名对应的银行卡号</div>
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*银行名称</label></div>
                      <div className="weui-cell__bd" style={{ fontSize: 14 }}>请选择银行</div>
                      <div className="weui-cell__ft"><ChevronDown size={16} color="var(--text-3)" /></div>
                    </div>
                    {thirdPayerIndivMode === '法人名下银行卡' && (
                      <div className="weui-cell">
                        <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14, color: 'var(--brand)' }}>*预留手机</label></div>
                        <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入银行预留手机号" value={payerData.phone} onChange={(e) => setPayerData({ ...payerData, phone: e.target.value })} style={{ fontSize: 14 }} /></div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="weui-cells">
                  <div className="weui-cell">
                    <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>开户名</label></div>
                    <div className="weui-cell__bd" style={{ fontSize: 14, color: 'var(--text-3)' }}>自动带入（不可修改）</div>
                  </div>
                  <div className="weui-cell">
                    <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>{thirdPayerType === '企业' ? '对公账号' : '银行卡号'}</label></div>
                    <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入" value={payerData.cardNo} onChange={(e) => setPayerData({ ...payerData, cardNo: e.target.value })} style={{ fontSize: 14 }} /></div>
                  </div>
                  <div className="weui-cell">
                    <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>所属银行</label></div>
                    <div className="weui-cell__bd"><input className="weui-input" placeholder="请输入所属银行" value={payerData.bank} onChange={(e) => setPayerData({ ...payerData, bank: e.target.value })} style={{ fontSize: 14 }} /></div>
                  </div>
                  {thirdPayerType === '个人' && (
                    <div className="weui-cell">
                      <div className="weui-cell__hd"><label className="weui-label" style={{ width: 80, fontSize: 14 }}>预留手机</label></div>
                      <div className="weui-cell__bd"><input className="weui-input" placeholder="银行预留手机号" value={payerData.phone} onChange={(e) => setPayerData({ ...payerData, phone: e.target.value })} style={{ fontSize: 14 }} /></div>
                    </div>
                  )}
                </div>
              )}
              {thirdPayerType === '企业' && (
                <div style={{ margin: '8px 16px', background: 'var(--blue-bg)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--blue)' }}>
                  ℹ️ 系统会自动向该对公账户转入0.01元用于验证账号有效性
                </div>
              )}

              <div className="section-hd">付款人证件（支持OCR）</div>
              <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {(thirdPayerType === '企业' ? ['营业执照'] : thirdPayerType === '个体工商户' ? ['法人身份证人像页', '法人身份证国徽页', '营业执照/组织机构代码证'] : ['身份证正面', '身份证反面']).map((label) => (
                  <div key={label} className="upload-area" style={{ aspectRatio: '3/2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Camera size={24} color="var(--text-3)" />
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span>
                  </div>
                ))}
              </div>

              <div className="section-hd">代付证明文件（支持图片和PDF，多文件）</div>
              <div style={{ padding: '0 16px' }}>
                <div className="upload-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20 }}>
                  <FileText size={20} color="var(--text-3)" />
                  <span style={{ fontSize: 14, color: 'var(--text-2)' }}>点击上传代付证明</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, textAlign: 'center' }}>支持图片（JPG/PNG）和PDF格式，可上传多个文件</div>
              </div>
            </>
          )}
        </>
      )}

      {/* Step 3: 签名 & 附件 */}
      {step === 3 && (
        <>
          <div className="section-hd">签名信息</div>
          <div style={{ margin: '0 16px' }}>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--weui-FG-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>销售顾问签名</span>
                {salesSign && <span style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 2 }}><CheckCircle size={12} />已签</span>}
              </div>
              <div onClick={() => setSalesSign(true)} className="signature-box" style={{ margin: '8px 16px 12px', height: 100 }}>
                {salesSign ? (
                  <svg width="160" height="50" viewBox="0 0 160 50"><path d="M10 40 Q30 10 50 30 T90 20 T130 35 T150 15" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                ) : '点击签名'}
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--weui-FG-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>买家签名</span>
                {buyerSign && <span style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 2 }}><CheckCircle size={12} />已签</span>}
              </div>
              <div onClick={() => setBuyerSign(true)} className="signature-box" style={{ margin: '8px 16px 12px', height: 100 }}>
                {buyerSign ? (
                  <svg width="140" height="50" viewBox="0 0 140 50"><path d="M15 35 Q35 5 55 25 T95 15 T125 30" stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
                ) : '点击签名'}
              </div>
            </div>
          </div>

          <div className="section-hd">附件（选填）</div>
          <div style={{ padding: '0 16px' }}>
            <div className="upload-area" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16 }}>
              <FileText size={20} color="var(--text-3)" />
              <span style={{ fontSize: 14, color: 'var(--text-2)' }}>上传线下合同</span>
            </div>
          </div>

          {/* 销售汇总 */}
          <div className="section-hd">销售汇总</div>
          <div style={{ margin: '0 16px', background: '#fff', borderRadius: 12, padding: 16 }}>
            {[
              { label: '销售台次', value: `${selectedVehicles.length}台` },
              { label: '采购合同价合计', value: `${totalContract.toFixed(2)}万`, sub: true },
              { label: '销售总价', value: `${totalSales.toFixed(2)}万`, highlight: true },
              { label: '盈亏', value: `${(totalSales - totalContract) >= 0 ? '+' : ''}${(totalSales - totalContract).toFixed(2)}万`, loss: (totalSales - totalContract) < 0 },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--weui-FG-3)' }}>
                <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{row.label}</span>
                <span style={{
                  fontSize: row.highlight ? 18 : 14, fontWeight: row.highlight ? 700 : 500,
                  color: row.loss ? 'var(--red)' : row.highlight ? 'var(--brand)' : 'var(--text-0)',
                  fontFamily: 'var(--font-num)',
                }}>{row.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bottom bar */}
      <div className="bottom-bar">
        {step < 3 ? (
          <>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={fillTestData}>填充测试</button>
            <button className="btn-primary" style={{ flex: 2 }}
              onClick={() => {
                if (step === 0) {
                  const missing = selectedVehicles.filter((v) => !v.salesPrice || parseFloat(v.salesPrice) <= 0)
                  if (missing.length > 0) { alert(`请填写所有已选车辆的销售价（${missing.length}台未填写）`); return }
                }
                setStep(step + 1)
              }}
              disabled={step === 0 && selectedVehicles.length === 0}>
              下一步
            </button>
          </>
        ) : (
          <>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={fillTestData}>填充测试</button>
            <button className="btn-primary" style={{ flex: 2 }} onClick={handleSubmit}>提交销售签约</button>
          </>
        )}
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowConfirm(false)} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430, zIndex: 201,
            background: '#fff', borderRadius: '20px 20px 0 0',
            paddingBottom: 'env(safe-area-inset-bottom)',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>销售金额确认</span>
              <button onClick={() => setShowConfirm(false)} style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, color: 'var(--text-2)' }}>✕</button>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 16 }}>
                {[
                  { label: '销售台次', value: `${selectedVehicles.length}台` },
                  { label: '采购合同价', value: `${totalContract.toFixed(2)}万元` },
                  { label: '销售总价', value: `${totalSales.toFixed(2)}万元`, highlight: true },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{row.label}</span>
                    <span style={{ fontSize: row.highlight ? 20 : 14, fontWeight: row.highlight ? 700 : 500, color: row.highlight ? 'var(--brand)' : 'var(--text-0)', fontFamily: 'var(--font-num)' }}>{row.value}</span>
                  </div>
                ))}
              </div>
              {(totalSales - totalContract) < 0 && (
                <div style={{ marginTop: 12, background: 'var(--red-bg)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  ⚠️ 本次销售存在亏损 {Math.abs(totalSales - totalContract).toFixed(2)}万，将计入车商销售亏损
                </div>
              )}
            </div>
            <div style={{ padding: '0 20px 20px', display: 'flex', gap: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirm(false)}>取消</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={confirmSubmit}>确认提交</button>
            </div>
          </div>
          <style>{`@keyframes slideUp { from { transform: translateX(-50%) translateY(100%); } to { transform: translateX(-50%) translateY(0); } }`}</style>
        </>
      )}
    </div>
  )
}
