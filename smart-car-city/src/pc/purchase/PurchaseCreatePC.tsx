import { useState } from 'react'
import {
  Steps, Form, Input, Select, DatePicker, Button, Card, Space,
  Radio, Table, Upload, Divider, Alert, Tag, Popconfirm, message, Modal,
  Descriptions, Typography, Row, Col,
} from 'antd'
import {
  PlusOutlined, UploadOutlined, CarOutlined,
  UserOutlined, BankOutlined, EnvironmentOutlined, FileTextOutlined,
  SaveOutlined, SendOutlined, ScanOutlined,
  CheckCircleOutlined, InfoCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

interface VehicleFormData {
  key: string
  plateNo: string
  vin: string
  brandModel: string
  engineNo: string
  useType: string
  mileage: string
  registerDate: string
  annualInspection: string
  color: string
  transferCount: string
  price: string
  condition: string
  collision: string
  waterDamage: string
  fireDamage: string
  maintenanceReport: string
}

const emptyVehicle = (): VehicleFormData => ({
  key: Date.now().toString(),
  plateNo: '', vin: '', brandModel: '', engineNo: '',
  useType: '', mileage: '', registerDate: '', annualInspection: '',
  color: '', transferCount: '', price: '', condition: '',
  collision: '正常', waterDamage: '正常', fireDamage: '正常', maintenanceReport: '有',
})

const colorOptions = ['白色', '黑色', '银色', '灰色', '红色', '蓝色', '星耀白', '曜岩黑', '矿石白', '珍珠白', '极光蓝', '赤帝红', '星空灰', '彩晶黑', '云母红'].map((c) => ({ label: c, value: c }))
const useTypeOptions = ['非营运', '营运', '出租', '租赁', '营转非'].map((c) => ({ label: c, value: c }))
const conditionOptions = ['良好', '一般', '较差'].map((c) => ({ label: c, value: c }))

export default function PurchaseCreatePC() {
  const [currentStep, setCurrentStep] = useState(0)
  const [mode, setMode] = useState<'single' | 'batch'>('single')
  const [vehicles, setVehicles] = useState<VehicleFormData[]>([emptyVehicle()])
  const [editingVehicle, setEditingVehicle] = useState<VehicleFormData | null>(null)
  const [ownerForm] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [deliveryForm] = Form.useForm()

  // OCR 状态
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle')
  const [ocrFields, setOcrFields] = useState<string[]>([])
  const [ocrImageUrl, setOcrImageUrl] = useState<string>('')
  const [vinQueryStatus, setVinQueryStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  // 卖方信息状态
  const [ownerType, setOwnerType] = useState<string>('个人')
  const [licenseOcrStatus, setLicenseOcrStatus] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [idOcrStatus, setIdOcrStatus] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [idOcrFields, setIdOcrFields] = useState<string[]>([])
  // 委托人状态
  const [delegateIdentity, setDelegateIdentity] = useState<string>('车主本人')
  // 收款人类型
  const [payeeType, setPayeeType] = useState<string>('个人')
  // 收款人身份
  const [payeeIdentityPC, setPayeeIdentityPC] = useState<string>('车主')
  // 个体工商户银行卡类型
  const [payeeIndivPayMode, setPayeeIndivPayMode] = useState<string>('法人名下银行卡')
  // 测试数据类型循环
  const [testTypeIndex, setTestTypeIndex] = useState(0)
  const [delegateOcrStatus, setDelegateOcrStatus] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [delegateOcrFields, setDelegateOcrFields] = useState<string[]>([])
  const [delegateData, setDelegateData] = useState({ name: '', idNo: '', phone: '' })

  /** 模拟营业执照OCR识别 */
  const handleLicenseOcr = (file: File) => {
    setLicenseOcrStatus('scanning')
    setTimeout(() => {
      ownerForm.setFieldsValue({
        ownerName: '广州市顺达汽车服务部',
        ownerIdNo: '92440106MA9XBCDE3F',
      })
      setLicenseOcrStatus('done')
      message.success('营业执照识别完成，已回填企业名称和证件号码')
    }, 1500)
    return false
  }

  /** 模拟身份证/营业执照OCR识别（个人/企业） */
  const handleIdOcr = (file: File) => {
    setIdOcrStatus('scanning')
    setIdOcrFields([])
    setTimeout(() => {
      if (ownerType === '个人') {
        ownerForm.setFieldsValue({ ownerName: '张三', ownerIdNo: '440106199001011234' })
        setIdOcrFields(['ownerName', 'ownerIdNo'])
        message.success('身份证识别完成，已回填姓名和身份证号')
      } else {
        ownerForm.setFieldsValue({ ownerName: '广州XX汽车经销有限公司', ownerIdNo: '91440106MA7DXLR8XY' })
        setIdOcrFields(['ownerName', 'ownerIdNo'])
        message.success('营业执照识别完成，已回填企业名称和信用代码')
      }
      setIdOcrStatus('done')
    }, 1500)
    return false
  }

  // 车辆编辑 — 内嵌界面
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const openVehicleForm = (v?: VehicleFormData) => {
    setEditingVehicle(v || emptyVehicle())
    setShowVehicleForm(true)
    setOcrStatus('idle')
    setOcrFields([])
    setOcrImageUrl('')
    setVinQueryStatus('idle')
  }

  /** 模拟OCR识别行驶证 */
  const handleOcrUpload = (file: File) => {
    if (!editingVehicle) return
    const imageUrl = URL.createObjectURL(file)
    setOcrImageUrl(imageUrl)
    setOcrStatus('scanning')
    setOcrFields([])

    // 模拟OCR识别延迟
    setTimeout(() => {
      const recognized: Partial<VehicleFormData> = {
        plateNo: '粤A·D2588',
        vin: 'LVHCV6637K50CLTS1',
        engineNo: 'LFV2A21G5K3012345',
        useType: '非营运',
        registerDate: '2019-06-15',
        color: '白色',
      }
      const filledFields: string[] = []
      const updated = { ...editingVehicle }
      if (recognized.plateNo) { updated.plateNo = recognized.plateNo; filledFields.push('plateNo') }
      if (recognized.vin) { updated.vin = recognized.vin; filledFields.push('vin') }
      if (recognized.engineNo) { updated.engineNo = recognized.engineNo; filledFields.push('engineNo') }
      if (recognized.useType) { updated.useType = recognized.useType; filledFields.push('useType') }
      if (recognized.registerDate) { updated.registerDate = recognized.registerDate; filledFields.push('registerDate') }
      if (recognized.color) { updated.color = recognized.color; filledFields.push('color') }

      setEditingVehicle(updated)
      setOcrFields(filledFields)
      setOcrStatus('done')
      message.success(`OCR识别完成，已回填 ${filledFields.length} 项`)

      // 模拟VIN码查询品牌车型
      if (recognized.vin) {
        setVinQueryStatus('loading')
        setTimeout(() => {
          setEditingVehicle((prev) => prev ? { ...prev, brandModel: '别克英朗 2019款 18T 自动互联精英型' } : prev)
          setOcrFields((prev) => [...prev, 'brandModel'])
          setVinQueryStatus('done')
        }, 1200)
      }
    }, 1800)
  }

  const saveVehicle = () => {
    if (!editingVehicle) return
    if (!editingVehicle.plateNo || !editingVehicle.vin) {
      message.warning('请填写车牌号和VIN码')
      return
    }
    setVehicles((prev) => {
      const idx = prev.findIndex((v) => v.key === editingVehicle.key)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = editingVehicle
        return next
      }
      const newList = [...prev, editingVehicle]
      // 单车模式下添加第二台车，自动切换为批量模式
      const filledCount = newList.filter((v) => v.plateNo).length
      if (mode === 'single' && filledCount > 1) {
        setMode('batch')
        message.info('已自动切换为批量采购模式')
      }
      return newList
    })
    setShowVehicleForm(false)
    setEditingVehicle(null)
    message.success('车辆信息已保存')
  }

  const removeVehicle = (key: string) => {
    setVehicles((prev) => prev.filter((v) => v.key !== key))
  }

  const totalPrice = vehicles.reduce((s, v) => s + (parseFloat(v.price) || 0), 0)

  // 填充测试数据
  const fillTestData = () => {
    const types = ['个人', '企业', '个体工商户'] as const
    const t = types[testTypeIndex % 3]
    setTestTypeIndex(testTypeIndex + 1)

    const testVehicles: VehicleFormData[] = [
      { key: '1', plateNo: '粤A·D2588', vin: 'LVHCV6637K50CLTS1', brandModel: '别克英朗 2019款 18T 自动互联精英型', engineNo: 'LFV2A21G5K3012345', useType: '非营运', mileage: '3.2', registerDate: '2019-06-15', annualInspection: '2027-06-15', color: '白色', transferCount: '1', price: '5.80', condition: '良好', collision: '正常', waterDamage: '正常', fireDamage: '正常', maintenanceReport: '有' },
    ]
    if (mode === 'batch') {
      testVehicles.push(
        { key: '2', plateNo: '粤B·67890', vin: 'LGBH52E04GY654321', brandModel: '丰田卡罗拉 2021款 1.8L 双擎精英版', engineNo: '2ZR1234567', useType: '非营运', mileage: '5.8', registerDate: '2021-03-10', annualInspection: '2027-03-10', color: '黑色', transferCount: '2', price: '9.20', condition: '良好', collision: '正常', waterDamage: '正常', fireDamage: '正常', maintenanceReport: '有' },
        { key: '3', plateNo: '粤A·33456', vin: 'WBAJB0C55JB174523', brandModel: '凯迪拉克 GT4 2023款 25T 尊贵型', engineNo: 'LSY1234567', useType: '非营运', mileage: '1.5', registerDate: '2023-01-20', annualInspection: '2027-01-20', color: '星耀白', transferCount: '0', price: '17.50', condition: '良好', collision: '正常', waterDamage: '正常', fireDamage: '正常', maintenanceReport: '有' },
      )
    }
    setVehicles(testVehicles)
    setOwnerType(t)

    if (t === '个人') {
      ownerForm.setFieldsValue({ ownerType: '个人', ownerName: '张三', ownerIdNo: '440106199001011234', ownerPhone: '13800138000' })
      paymentForm.setFieldsValue({ payeeIdentity: '车主', payeeCardNo: '6222021234567890123', payeeBank: '中国工商银行广州天河支行', payeePhone: '13800138000' })
    } else if (t === '企业') {
      ownerForm.setFieldsValue({ ownerType: '企业', ownerName: '广州市顺达汽车服务有限公司', ownerIdNo: '91440106MA7DXLR8XY', ownerPhone: '020-88886666' })
      paymentForm.setFieldsValue({ payeeIdentity: '车主', payeeCardNo: '6013823100125678', payeeBank: '中国银行广州分行' })
    } else {
      ownerForm.setFieldsValue({ ownerType: '个体工商户', ownerName: '广州市能达汽车服务部', ownerIdNo: '92440106MA9XBCDE3F', legalPersonName: '李法人', legalPersonIdNo: '440106198805012233', ownerPhone: '13700003333' })
      paymentForm.setFieldsValue({ payeeIdentity: '车主', payeeIndivPayMode: '法人名下银行卡', payeeCardNo: '6222025678901235678', payeeBank: '招商银行广州分行', payeePhone: '13700003333' })
    }
    setPayeeIdentityPC('车主')
    deliveryForm.setFieldsValue({ deliveryLocation: '白云服务中心1库（A区）' })
    message.success(`测试数据已填充（${t}）`)
  }

  const handleSubmit = () => {
    const filledVehicles = vehicles.filter((v) => v.plateNo)
    if (filledVehicles.length === 0) {
      message.error('请至少添加一台车辆')
      return
    }
    const msg = mode === 'single'
      ? '确认提交采购申请？将生成一车一合同。'
      : `确认提交采购申请？共${filledVehicles.length}台车辆，将生成一批一合同。`
    Modal.confirm({
      title: '提交确认',
      content: msg,
      okText: '确认提交',
      okButtonProps: { style: { background: '#E8352E', borderColor: '#E8352E' } },
      onOk: () => {
        message.success('采购申请提交成功')
        setTimeout(() => window.close(), 500)
      },
    })
  }

  // 车辆表格列
  const vehicleColumns: ColumnsType<VehicleFormData> = [
    { title: '车牌号', dataIndex: 'plateNo', width: 120, render: (t: string) => <Text strong>{t || '-'}</Text> },
    { title: 'VIN码', dataIndex: 'vin', width: 190, render: (t: string) => <Text code style={{ fontSize: 12 }}>{t || '-'}</Text> },
    { title: '品牌车型', dataIndex: 'brandModel', width: 240, ellipsis: true },
    { title: '颜色', dataIndex: 'color', width: 80 },
    { title: '里程(万km)', dataIndex: 'mileage', width: 100, align: 'right' as const },
    { title: '过户次数', dataIndex: 'transferCount', width: 90, align: 'center' as const },
    {
      title: '采购价(万)',
      dataIndex: 'price',
      width: 110,
      align: 'right' as const,
      render: (p: string) => p ? <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{parseFloat(p).toFixed(2)}</span> : '-',
    },
    {
      title: '车况信息',
      width: 180,
      render: (_: unknown, r: VehicleFormData) => (
        <Space size={4}>
          <Tag color={r.collision === '正常' ? 'green' : 'red'} style={{ fontSize: 11 }}>碰撞</Tag>
          <Tag color={r.waterDamage === '正常' ? 'green' : 'red'} style={{ fontSize: 11 }}>水泡</Tag>
          <Tag color={r.fireDamage === '正常' ? 'green' : 'red'} style={{ fontSize: 11 }}>火烧</Tag>
        </Space>
      ),
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right' as const,
      render: (_: unknown, record: VehicleFormData) => (
        <Space size={4}>
          <Button type="link" size="small" onClick={() => openVehicleForm(record)}>编辑</Button>
          <Popconfirm title="确认删除？" onConfirm={() => removeVehicle(record.key)} disabled={vehicles.length <= 1}>
            <Button type="link" size="small" danger disabled={vehicles.length <= 1}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // ===== Step 内容 =====
  const stepContent = [
    // Step 0: 车辆信息
    (
      <div key="step0">
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space size={16}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>采购模式</span>
              <Radio.Group value={mode} onChange={(e) => { setMode(e.target.value); if (e.target.value === 'single') setVehicles([vehicles[0] || emptyVehicle()]) }}>
                <Radio.Button value="single">单车采购</Radio.Button>
                <Radio.Button value="batch">批量采购</Radio.Button>
              </Radio.Group>
            </Space>
            {mode === 'batch' && (
              <Space>
                <Upload accept=".xlsx,.xls,.csv" showUploadList={false} beforeUpload={() => { message.info('Excel导入功能开发中'); return false }}>
                  <Button icon={<UploadOutlined />}>Excel导入</Button>
                </Upload>
              </Space>
            )}
          </div>
          {mode === 'batch' && (
            <Alert
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              message="批量采购要求所有车辆属于同一卖方，将生成一批一合同"
              style={{ marginTop: 12 }}
            />
          )}
        </Card>

        <Card
          size="small"
          title={<span><CarOutlined style={{ marginRight: 6 }} />车辆明细 ({vehicles.length}台)</span>}
          extra={
            <Space>
              <span style={{ fontSize: 13, color: '#8c8c8c' }}>
                合计：<span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>{totalPrice.toFixed(2)}</span> 万
              </span>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openVehicleForm()}
                style={{ background: '#E8352E', borderColor: '#E8352E' }}>
                添加车辆
              </Button>
            </Space>
          }
        >
          <Table
            columns={vehicleColumns}
            dataSource={vehicles.filter((v) => v.plateNo)}
            rowKey="key"
            size="small"
            scroll={{ x: 1300 }}
            pagination={false}
            locale={{ emptyText: <div style={{ padding: 32, color: '#bfbfbf' }}>暂无车辆，请点击"添加车辆"录入</div> }}
          />
        </Card>
      </div>
    ),

    // Step 1: 车主信息
    (
      <div key="step1">
        <Card size="small" title={<span><UserOutlined style={{ marginRight: 6 }} />车主/卖方信息</span>}>
          <Form form={ownerForm} layout="vertical" style={{ maxWidth: 800 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="车主类型" name="ownerType" rules={[{ required: true }]} initialValue="个人">
                  <Select options={[{ value: '个人', label: '个人' }, { value: '企业', label: '企业' }, { value: '个体工商户', label: '个体工商户' }]} placeholder="请选择"
                    onChange={(v) => setOwnerType(v)} />
                </Form.Item>
              </Col>
              {ownerType === '个人' && (
                <>
                  <Col span={8}>
                    <Form.Item label="姓名" name="ownerName" rules={[{ required: true }]}>
                      <Input placeholder="请输入车主姓名"
                        style={idOcrFields.includes('ownerName') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={idOcrFields.includes('ownerName') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="身份证号码" name="ownerIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入身份证号码"
                        style={idOcrFields.includes('ownerIdNo') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={idOcrFields.includes('ownerIdNo') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                </>
              )}
              {ownerType === '企业' && (
                <>
                  <Col span={8}>
                    <Form.Item label="企业名称" name="ownerName" rules={[{ required: true }]}>
                      <Input placeholder="请输入企业名称"
                        style={idOcrFields.includes('ownerName') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={idOcrFields.includes('ownerName') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="统一社会信用代码" name="ownerIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入统一社会信用代码"
                        style={idOcrFields.includes('ownerIdNo') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={idOcrFields.includes('ownerIdNo') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                </>
              )}
              {ownerType === '个体工商户' && (
                <>
                  <Col span={8}>
                    <Form.Item label="企业名称" name="ownerName" rules={[{ required: true }]}>
                      <Input placeholder="请输入企业名称"
                        style={licenseOcrStatus === 'done' ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={licenseOcrStatus === 'done' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="证件号码" name="ownerIdNo" rules={[{ required: true }]}>
                      <Input placeholder="统一社会信用代码/组织机构代码"
                        style={licenseOcrStatus === 'done' ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={licenseOcrStatus === 'done' ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="法人姓名" name="legalPersonName" rules={[{ required: true }]}>
                      <Input placeholder="请输入法人姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="法人证件类型">
                      <Input value="身份证" disabled style={{ color: '#bfbfbf' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="法人身份证号码" name="legalPersonIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入法人身份证号码" />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={8}>
                <Form.Item label="联系电话" name="ownerPhone" rules={[{ required: true }]}>
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0 16px' }} />

            {/* 个体工商户：营业执照OCR */}
            {ownerType === '个体工商户' && (
              <div style={{
                marginBottom: 16, padding: 16, borderRadius: 8,
                background: licenseOcrStatus === 'done' ? '#f6ffed' : '#fafafa',
                border: `1px solid ${licenseOcrStatus === 'done' ? '#b7eb8f' : '#f0f0f0'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <ScanOutlined style={{ color: licenseOcrStatus === 'done' ? '#52c41a' : '#E8352E' }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {licenseOcrStatus === 'done' ? '营业执照识别完成' : '上传营业执照，OCR自动识别'}
                  </span>
                  {licenseOcrStatus === 'scanning' && <LoadingOutlined spin style={{ color: '#fa8c16' }} />}
                  {licenseOcrStatus === 'done' && <Tag color="success" icon={<CheckCircleOutlined />}>已回填 2 项</Tag>}
                </div>
                <Space size={16} align="start">
                  <Upload listType="picture-card" maxCount={1} accept="image/*"
                    beforeUpload={(file) => { handleLicenseOcr(file); return false }}
                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}>
                    <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>营业执照</div></div>
                  </Upload>
                  {licenseOcrStatus === 'done' && (
                    <div style={{ paddingTop: 8 }}>
                      <Space wrap size={[6, 6]}>
                        <Tag color="green" icon={<CheckCircleOutlined />}>企业名称</Tag>
                        <Tag color="green" icon={<CheckCircleOutlined />}>证件号码</Tag>
                      </Space>
                    </div>
                  )}
                </Space>
              </div>
            )}

            {/* 个人/企业：证件OCR识别 */}
            {ownerType !== '个体工商户' && (
              <div style={{
                marginBottom: 16, padding: 16, borderRadius: 8,
                background: idOcrStatus === 'done' ? '#f6ffed' : '#fafafa',
                border: `1px solid ${idOcrStatus === 'done' ? '#b7eb8f' : '#f0f0f0'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <ScanOutlined style={{ color: idOcrStatus === 'done' ? '#52c41a' : '#E8352E' }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {idOcrStatus === 'idle' && (ownerType === '个人' ? '上传身份证，OCR自动识别' : '上传营业执照，OCR自动识别')}
                    {idOcrStatus === 'scanning' && '正在识别中...'}
                    {idOcrStatus === 'done' && (ownerType === '个人' ? '身份证识别完成' : '营业执照识别完成')}
                  </span>
                  {idOcrStatus === 'scanning' && <LoadingOutlined spin style={{ color: '#fa8c16' }} />}
                  {idOcrStatus === 'done' && <Tag color="success" icon={<CheckCircleOutlined />}>已回填 {idOcrFields.length} 项</Tag>}
                </div>
                <Space size={16} align="start">
                  {ownerType === '个人' ? (
                    <>
                      <Upload listType="picture-card" maxCount={1} accept="image/*"
                        beforeUpload={(file) => { handleIdOcr(file); return false }}
                        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}>
                        <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>身份证正面</div></div>
                      </Upload>
                      <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                        <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>身份证反面</div></div>
                      </Upload>
                    </>
                  ) : (
                    <Upload listType="picture-card" maxCount={1} accept="image/*"
                      beforeUpload={(file) => { handleIdOcr(file); return false }}
                      showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>营业执照</div></div>
                    </Upload>
                  )}
                  {idOcrStatus === 'done' && (
                    <div style={{ paddingTop: 8 }}>
                      <Space wrap size={[6, 6]}>
                        <Tag color="green" icon={<CheckCircleOutlined />}>{ownerType === '个人' ? '姓名' : '企业名称'}</Tag>
                        <Tag color="green" icon={<CheckCircleOutlined />}>证件号码</Tag>
                      </Space>
                    </div>
                  )}
                </Space>
              </div>
            )}
          </Form>
        </Card>

        <Card size="small" title="委托人信息（非车主签署时填写）" style={{ marginTop: 16 }}>
          <Form layout="vertical" style={{ maxWidth: 800 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="委托人身份">
                  <Select value={delegateIdentity} onChange={(v) => { setDelegateIdentity(v); setDelegateOcrStatus('idle'); setDelegateOcrFields([]); setDelegateData({ name: '', idNo: '', phone: '' }) }}
                    options={[{ value: '车主本人', label: '车主本人' }, { value: '非车主', label: '非车主（需上传委托证明）' }]} />
                </Form.Item>
              </Col>
              {delegateIdentity === '非车主' && (
                <>
                  <Col span={24}>
                    <div style={{
                      marginBottom: 16, padding: 16, borderRadius: 8,
                      background: delegateOcrStatus === 'done' ? '#f6ffed' : '#fafafa',
                      border: `1px solid ${delegateOcrStatus === 'done' ? '#b7eb8f' : '#f0f0f0'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <ScanOutlined style={{ color: delegateOcrStatus === 'done' ? '#52c41a' : '#E8352E' }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                          {delegateOcrStatus === 'idle' && '上传委托人身份证，OCR自动识别'}
                          {delegateOcrStatus === 'scanning' && '正在识别中...'}
                          {delegateOcrStatus === 'done' && '证件识别完成'}
                        </span>
                        {delegateOcrStatus === 'scanning' && <LoadingOutlined spin style={{ color: '#fa8c16' }} />}
                        {delegateOcrStatus === 'done' && <Tag color="success" icon={<CheckCircleOutlined />}>已回填 {delegateOcrFields.length} 项</Tag>}
                      </div>
                      <Space size={16} align="start">
                        <Upload listType="picture-card" maxCount={1} accept="image/*"
                          beforeUpload={(file) => {
                            setDelegateOcrStatus('scanning')
                            setTimeout(() => {
                              setDelegateData({ name: '李委托', idNo: '440106199505051234', phone: '' })
                              setDelegateOcrFields(['name', 'idNo'])
                              setDelegateOcrStatus('done')
                              message.success('委托人证件识别完成，已回填姓名和身份证号')
                            }, 1500)
                            return false
                          }}
                          showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}>
                          <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>身份证正面</div></div>
                        </Upload>
                        <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                          <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>身份证反面</div></div>
                        </Upload>
                        {delegateOcrStatus === 'done' && (
                          <div style={{ paddingTop: 8 }}>
                            <Space wrap size={[6, 6]}>
                              {delegateOcrFields.map((f) => (
                                <Tag key={f} color="green" icon={<CheckCircleOutlined />}>
                                  {{ name: '姓名', idNo: '身份证号' }[f] || f}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        )}
                      </Space>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="委托人姓名" rules={[{ required: true }]}>
                      <Input placeholder="请输入委托人姓名" value={delegateData.name} onChange={(e) => setDelegateData({ ...delegateData, name: e.target.value })}
                        style={delegateOcrFields.includes('name') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={delegateOcrFields.includes('name') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="委托人身份证号" rules={[{ required: true }]}>
                      <Input placeholder="请输入身份证号" value={delegateData.idNo} onChange={(e) => setDelegateData({ ...delegateData, idNo: e.target.value })}
                        style={delegateOcrFields.includes('idNo') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                        suffix={delegateOcrFields.includes('idNo') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="委托人手机号" rules={[{ required: true }]}>
                      <Input placeholder="请输入手机号" value={delegateData.phone} onChange={(e) => setDelegateData({ ...delegateData, phone: e.target.value })} />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
            {delegateIdentity === '非车主' && (
              <>
                <Divider style={{ margin: '4px 0 16px' }} />
                <Form.Item label={<span>委托证明材料 <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>（委托书、授权书等，支持图片或PDF）</span></span>} required>
                  <Upload listType="picture-card" multiple maxCount={4} accept="image/*,.pdf" beforeUpload={() => false}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <UploadOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
                      <span style={{ fontSize: 11, color: '#8c8c8c' }}>上传委托证明</span>
                    </div>
                  </Upload>
                </Form.Item>
              </>
            )}
          </Form>
        </Card>
      </div>
    ),

    // Step 2: 收款 & 交车
    (
      <div key="step2">
        <Card size="small" title={<span><BankOutlined style={{ marginRight: 6 }} />收款信息</span>}>
          <Form form={paymentForm} layout="vertical" style={{ maxWidth: 800 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="收款人身份" name="payeeIdentity" rules={[{ required: true }]} initialValue="车主">
                  <Select options={[{ value: '车主', label: '车主' }, { value: '非车主', label: '非车主' }]} onChange={(v) => setPayeeIdentityPC(v)} />
                </Form.Item>
              </Col>
            </Row>

            {/* 收款人=车主：自动带入车主信息，只需填银行卡 */}
            {payeeIdentityPC === '车主' && (
              <>
                <Alert type="success" showIcon icon={<CheckCircleOutlined />}
                  message="收款人信息自动带入车主/卖方信息" style={{ marginBottom: 16 }} />

                {/* 银行卡信息 — 根据车主类型展示 */}
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>银行卡信息</div>
                {ownerType === '个人' && (
                  <Row gutter={24}>
                    <Col span={8}><Form.Item label="开户名"><Input value="自动带入车主姓名" disabled style={{ color: '#bfbfbf' }} /></Form.Item></Col>
                    <Col span={8}><Form.Item label="银行卡号" name="payeeCardNo" rules={[{ required: true }]}><Input placeholder="请输入银行卡号" /></Form.Item></Col>
                    <Col span={8}><Form.Item label="所属银行" name="payeeBank" rules={[{ required: true }]}><Input placeholder="请输入所属银行" /></Form.Item></Col>
                    <Col span={8}><Form.Item label="银行预留手机" name="payeePhone" rules={[{ required: true }]}><Input placeholder="银行预留手机号" /></Form.Item></Col>
                  </Row>
                )}
                {ownerType === '企业' && (
                  <>
                    <Row gutter={24}>
                      <Col span={8}><Form.Item label="开户名"><Input value="自动带入企业名称" disabled style={{ color: '#bfbfbf' }} /></Form.Item></Col>
                      <Col span={8}><Form.Item label="对公账号" name="payeeCardNo" rules={[{ required: true }]}><Input placeholder="请输入对公账号" /></Form.Item></Col>
                      <Col span={8}><Form.Item label="所属银行" name="payeeBank" rules={[{ required: true }]}><Input placeholder="请输入所属银行" /></Form.Item></Col>
                    </Row>
                    <Alert type="info" showIcon icon={<InfoCircleOutlined />} message="系统会自动向该对公账户转入0.01元用于验证账号有效性" style={{ marginTop: 8 }} />
                  </>
                )}
                {ownerType === '个体工商户' && (
                  <>
                    <Row gutter={24}>
                      <Col span={8}>
                        <Form.Item label="银行卡类型" name="payeeIndivPayMode" initialValue="法人名下银行卡" rules={[{ required: true }]}>
                          <Select options={[{ value: '法人名下银行卡', label: '法人名下银行卡' }, { value: '对公账户银行卡', label: '对公账户银行卡' }]} onChange={(v) => setPayeeIndivPayMode(v)} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="账户类型" name="payeeAccountType" initialValue="他行个人账户" rules={[{ required: true }]}>
                          <Select options={payeeIndivPayMode === '法人名下银行卡'
                            ? [{ value: '他行个人账户', label: '他行个人账户' }, { value: '中信个人账户', label: '中信个人账户' }]
                            : [{ value: '他行企业账户', label: '他行企业账户' }, { value: '中信企业账户', label: '中信企业账户' }]
                          } />
                        </Form.Item>
                      </Col>
                      <Col span={8}><Form.Item label="开户名"><Input value={payeeIndivPayMode === '法人名下银行卡' ? '自动带入法人姓名' : '自动带入企业名称'} disabled style={{ color: '#bfbfbf' }} /></Form.Item></Col>
                      <Col span={8}><Form.Item label="银行卡号" name="payeeCardNo" rules={[{ required: true }]}><Input placeholder="请输入银行卡号" /></Form.Item></Col>
                      <Col span={8}><Form.Item label="银行名称" name="payeeBank" rules={[{ required: true }]}><Input placeholder="请选择银行" /></Form.Item></Col>
                      {payeeIndivPayMode === '法人名下银行卡' && (
                        <Col span={8}><Form.Item label="银行预留手机" name="payeePhone" rules={[{ required: true }]}><Input placeholder="银行预留手机号" /></Form.Item></Col>
                      )}
                    </Row>
                  </>
                )}
              </>
            )}

            {/* 收款人≠车主：需要填写收款人完整信息 */}
            {payeeIdentityPC === '非车主' && (
              <>
                <Divider style={{ margin: '8px 0 16px' }} />
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>收款人信息</div>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="收款人类型" name="payeeType" rules={[{ required: true }]}>
                      <Select options={[{ value: '个人', label: '个人' }, { value: '企业', label: '企业' }, { value: '个体工商户', label: '个体工商户' }]} placeholder="请选择"
                        onChange={(v) => setPayeeType(v)} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="收款人姓名" name="payeeName" rules={[{ required: true }]}>
                      <Input placeholder="请输入收款人姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="证件类型">
                      <Input value={payeeType === '个人' ? '身份证' : '统一社会信用代码'} disabled style={{ color: '#bfbfbf' }} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="证件号码" name="payeeIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入证件号码" />
                    </Form.Item>
                  </Col>
                  {payeeType === '个体工商户' && (
                    <>
                      <Col span={8}><Form.Item label="法人姓名" name="payeeLegalName" rules={[{ required: true }]}><Input placeholder="请输入法人姓名" /></Form.Item></Col>
                      <Col span={8}><Form.Item label="法人证件类型"><Input value="身份证" disabled style={{ color: '#bfbfbf' }} /></Form.Item></Col>
                      <Col span={8}><Form.Item label="法人身份证号码" name="payeeLegalIdNo" rules={[{ required: true }]}><Input placeholder="请输入法人身份证号码" /></Form.Item></Col>
                    </>
                  )}
                </Row>
                <Divider style={{ margin: '8px 0 16px' }} />
                <Form.Item label={<span>代收款证明 <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>（支持图片和PDF，可上传多个）</span></span>} required>
                  <Upload.Dragger accept="image/*,.pdf" multiple beforeUpload={() => false} style={{ padding: '16px 0' }}>
                    <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 28, color: '#bfbfbf' }} /></p>
                    <p className="ant-upload-text" style={{ fontSize: 13 }}>点击或拖拽上传代收款证明</p>
                    <p className="ant-upload-hint" style={{ fontSize: 12 }}>支持 JPG/PNG 图片和 PDF 文件</p>
                  </Upload.Dragger>
                </Form.Item>

                <Divider style={{ margin: '8px 0 16px' }} />
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>银行卡信息</div>
                {payeeType === '个体工商户' ? (
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item label="银行卡类型" name="payeeNonOwnerIndivPayMode" initialValue="法人名下银行卡" rules={[{ required: true }]}>
                        <Select options={[{ value: '法人名下银行卡', label: '法人名下银行卡' }, { value: '对公账户银行卡', label: '对公账户银行卡' }]} onChange={(v) => setPayeeIndivPayMode(v)} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="账户类型" name="payeeNonOwnerAccountType" initialValue="他行个人账户" rules={[{ required: true }]}>
                        <Select options={payeeIndivPayMode === '法人名下银行卡'
                          ? [{ value: '他行个人账户', label: '他行个人账户' }, { value: '中信个人账户', label: '中信个人账户' }]
                          : [{ value: '他行企业账户', label: '他行企业账户' }, { value: '中信企业账户', label: '中信企业账户' }]
                        } />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="开户名">
                        <Input value={payeeIndivPayMode === '法人名下银行卡' ? '自动带入法人姓名' : '自动带入企业名称'} disabled style={{ color: '#bfbfbf' }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}><Form.Item label="银行卡号" name="payeeCardNo" rules={[{ required: true }]}><Input placeholder="请输入银行卡号" /></Form.Item></Col>
                    <Col span={8}><Form.Item label="银行名称" name="payeeBank" rules={[{ required: true }]}><Input placeholder="请选择银行" /></Form.Item></Col>
                    {payeeIndivPayMode === '法人名下银行卡' && (
                      <Col span={8}><Form.Item label="银行预留手机" name="payeePhone" rules={[{ required: true }]}><Input placeholder="银行预留手机号" /></Form.Item></Col>
                    )}
                  </Row>
                ) : payeeType === '企业' ? (
                  <>
                    <Row gutter={24}>
                      <Col span={8}><Form.Item label="开户名"><Input value="自动带入企业名称" disabled style={{ color: '#bfbfbf' }} /></Form.Item></Col>
                      <Col span={8}><Form.Item label="对公账号" name="payeeCardNo" rules={[{ required: true }]}><Input placeholder="请输入对公账号" /></Form.Item></Col>
                      <Col span={8}><Form.Item label="所属银行" name="payeeBank" rules={[{ required: true }]}><Input placeholder="请输入所属银行" /></Form.Item></Col>
                    </Row>
                    <Alert type="info" showIcon icon={<InfoCircleOutlined />} message="系统会自动向该对公账户转入0.01元用于验证账号有效性" style={{ marginTop: 8 }} />
                  </>
                ) : (
                  <Row gutter={24}>
                    <Col span={8}><Form.Item label="开户名"><Input value="自动带入收款人姓名" disabled style={{ color: '#bfbfbf' }} /></Form.Item></Col>
                    <Col span={8}><Form.Item label="银行卡号" name="payeeCardNo" rules={[{ required: true }]}><Input placeholder="请输入银行卡号" /></Form.Item></Col>
                    <Col span={8}><Form.Item label="所属银行" name="payeeBank" rules={[{ required: true }]}><Input placeholder="请输入所属银行" /></Form.Item></Col>
                    <Col span={8}><Form.Item label="银行预留手机" name="payeePhone" rules={[{ required: true }]}><Input placeholder="银行预留手机号" /></Form.Item></Col>
                  </Row>
                )}
              </>
            )}
          </Form>
        </Card>

        <Card size="small" title={<span><EnvironmentOutlined style={{ marginRight: 6 }} />交车信息</span>} style={{ marginTop: 16 }}>
          <Form form={deliveryForm} layout="vertical" style={{ maxWidth: 800 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="交车时间" name="deliveryTime" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} placeholder="请选择交车日期" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="交车地点" name="deliveryLocation" rules={[{ required: true }]}>
                  <Select placeholder="请选择交车地点" options={[
                    { value: '白云服务中心1库（A区）', label: '白云服务中心1库（A区）' },
                    { value: '白云服务中心2库（B区）', label: '白云服务中心2库（B区）' },
                    { value: '天河展厅', label: '天河展厅' },
                    { value: '番禺仓库', label: '番禺仓库' },
                  ]} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    ),

    // Step 3: 确认提交
    (
      <div key="step3">
        <Card size="small" title={<span><FileTextOutlined style={{ marginRight: 6 }} />采购汇总</span>}>
          <Descriptions column={3} bordered size="small">
            <Descriptions.Item label="采购模式">
              <Tag color={mode === 'batch' ? 'blue' : 'default'}>{mode === 'single' ? '单车采购（一车一合同）' : '批量采购（一批一合同）'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="车辆数量">
              <span style={{ fontWeight: 600 }}>{vehicles.filter((v) => v.plateNo).length}</span> 台
            </Descriptions.Item>
            <Descriptions.Item label="采购总价">
              <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 18 }}>{totalPrice.toFixed(2)}</span>
              <span style={{ color: '#8c8c8c', marginLeft: 4 }}>万</span>
            </Descriptions.Item>
            <Descriptions.Item label="卖方">{ownerForm.getFieldValue('ownerName') || '-'}</Descriptions.Item>
            <Descriptions.Item label="卖方类型">{ownerForm.getFieldValue('ownerType') || '-'}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{ownerForm.getFieldValue('ownerPhone') || '-'}</Descriptions.Item>
            <Descriptions.Item label="收款人">{paymentForm.getFieldValue('payeeName') || '-'}</Descriptions.Item>
            <Descriptions.Item label="开户行">{paymentForm.getFieldValue('payeeBank') || '-'}</Descriptions.Item>
            <Descriptions.Item label="交车地点">{deliveryForm.getFieldValue('deliveryLocation') || '-'}</Descriptions.Item>
          </Descriptions>

          <Divider />
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>车辆清单</div>
          <Table
            columns={[
              { title: '车牌号', dataIndex: 'plateNo', width: 120 },
              { title: 'VIN码', dataIndex: 'vin', width: 200, render: (t: string) => <Text code style={{ fontSize: 12 }}>{t}</Text> },
              { title: '品牌车型', dataIndex: 'brandModel', ellipsis: true },
              { title: '采购价(万)', dataIndex: 'price', width: 110, align: 'right' as const, render: (p: string) => <span style={{ fontWeight: 600, color: '#E8352E' }}>{p ? parseFloat(p).toFixed(2) : '-'}</span> },
            ]}
            dataSource={vehicles.filter((v) => v.plateNo)}
            rowKey="key"
            size="small"
            pagination={false}
          />
        </Card>

        <Alert
          type="warning"
          showIcon
          message="提交后将进入审批流程，请确认所有信息填写正确"
          style={{ marginTop: 16 }}
        />
      </div>
    ),
  ]

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* 顶部 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>新建采购单</span>
        <Space>
          <Button onClick={fillTestData} style={{ borderColor: '#fa8c16', color: '#fa8c16' }}>🧪 填充测试数据</Button>
          <Button icon={<SaveOutlined />}>保存草稿</Button>
        </Space>
      </div>

      {/* Steps */}
      <Card size="small" style={{ marginBottom: 20 }}>
        <Steps
          current={currentStep}
          items={[
            { title: '车辆信息', icon: <CarOutlined /> },
            { title: '车主信息', icon: <UserOutlined /> },
            { title: '收款&交车', icon: <BankOutlined /> },
            { title: '确认提交', icon: <CheckCircleOutlined /> },
          ]}
        />
      </Card>

      {/* 内容 */}
      {stepContent[currentStep]}

      {/* 底部操作 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '16px 0' }}>
        <div>
          {currentStep > 0 && (
            <Button size="large" onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>
          )}
        </div>
        <Space>
          {currentStep < 3 && (
            <Button type="primary" size="large" onClick={() => setCurrentStep(currentStep + 1)}
              style={{ background: '#E8352E', borderColor: '#E8352E', minWidth: 120 }}>
              下一步
            </Button>
          )}
          {currentStep === 3 && (
            <Button type="primary" size="large" icon={<SendOutlined />} onClick={handleSubmit}
              style={{ background: '#E8352E', borderColor: '#E8352E', minWidth: 140 }}>
              提交采购申请
            </Button>
          )}
        </Space>
      </div>

      {/* 车辆编辑 — 内嵌界面（仅在车辆信息步骤显示） */}
      {currentStep === 0 && showVehicleForm && editingVehicle && (
        <Card
          size="small"
          title={<span><CarOutlined style={{ marginRight: 6 }} />{vehicles.find((v) => v.key === editingVehicle.key) ? '编辑车辆' : '添加车辆'}</span>}
          extra={
            <Space>
              <Button onClick={() => {
                if (!editingVehicle) return
                setEditingVehicle({
                  ...editingVehicle,
                  plateNo: '粤A·D2588', vin: 'LVHCV6637K50CLTS1',
                  brandModel: '别克英朗 2019款 18T 自动互联精英型',
                  engineNo: 'LFV2A21G5K3012345', useType: '非营运',
                  mileage: '3.2', registerDate: '2019-06-15', annualInspection: '2027-06-15',
                  color: '白色', transferCount: '1', price: '5.80', condition: '良好',
                  collision: '正常', waterDamage: '正常', fireDamage: '正常', maintenanceReport: '有',
                })
                message.success('已填充测试数据')
              }} style={{ borderColor: '#fa8c16', color: '#fa8c16' }}>🧪 填充测试数据</Button>
              <Button onClick={() => { setShowVehicleForm(false); setEditingVehicle(null) }}>取消</Button>
              <Button type="primary" onClick={saveVehicle} style={{ background: '#E8352E', borderColor: '#E8352E' }}>保存车辆</Button>
            </Space>
          }
          style={{ marginTop: 16 }}
        >
            {/* OCR 识别区域 */}
            <div style={{
              marginBottom: 20, borderRadius: 10, overflow: 'hidden',
              border: `1px solid ${ocrStatus === 'done' ? '#b7eb8f' : ocrStatus === 'scanning' ? '#ffe58f' : '#f0f0f0'}`,
              background: ocrStatus === 'done' ? '#f6ffed' : ocrStatus === 'scanning' ? '#fffbe6' : '#fafafa',
            }}>
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <ScanOutlined style={{ fontSize: 18, color: ocrStatus === 'done' ? '#52c41a' : '#E8352E' }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>
                    {ocrStatus === 'idle' && '上传行驶证，OCR自动识别'}
                    {ocrStatus === 'scanning' && '正在识别中...'}
                    {ocrStatus === 'done' && '识别完成'}
                    {ocrStatus === 'error' && '识别失败'}
                  </span>
                  {ocrStatus === 'scanning' && <LoadingOutlined spin style={{ color: '#fa8c16' }} />}
                </Space>
                {ocrStatus === 'done' && (
                  <Tag color="success" icon={<CheckCircleOutlined />}>已回填 {ocrFields.length} 项</Tag>
                )}
              </div>

              {/* 图片预览 + 上传 */}
              <div style={{ padding: '0 16px 14px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {ocrImageUrl ? (
                  <div style={{ position: 'relative', width: 200, flexShrink: 0 }}>
                    <img src={ocrImageUrl} alt="行驶证" style={{
                      width: 200, height: 130, objectFit: 'cover', borderRadius: 6,
                      border: '1px solid #d9d9d9',
                    }} />
                    {ocrStatus === 'scanning' && (
                      <div style={{
                        position: 'absolute', inset: 0, borderRadius: 6,
                        background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 6, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                          <LoadingOutlined spin /> 识别中...
                        </div>
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '1px 8px', fontSize: 11, color: '#fff' }}>
                      行驶证正本
                    </div>
                  </div>
                ) : null}
                <div style={{ flex: 1 }}>
                  {ocrStatus === 'idle' && (
                    <Upload.Dragger
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={(file) => { handleOcrUpload(file); return false }}
                      style={{ padding: '16px 0' }}
                    >
                      <p style={{ marginBottom: 8 }}><ScanOutlined style={{ fontSize: 28, color: '#E8352E' }} /></p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', margin: 0 }}>点击或拖拽上传行驶证照片</p>
                      <p style={{ fontSize: 12, color: '#8c8c8c', margin: '4px 0 0' }}>支持 JPG/PNG，OCR自动识别并回填车辆信息</p>
                    </Upload.Dragger>
                  )}
                  {ocrStatus === 'done' && (
                    <div>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>已识别字段（绿色标记）：</div>
                      <Space wrap size={[6, 6]}>
                        {ocrFields.map((f) => (
                          <Tag key={f} color="green" icon={<CheckCircleOutlined />} style={{ fontSize: 12 }}>
                            {{ plateNo: '车牌号', vin: 'VIN码', engineNo: '发动机号', useType: '使用性质', registerDate: '上牌日期', color: '颜色', brandModel: '品牌车型' }[f] || f}
                          </Tag>
                        ))}
                        {vinQueryStatus === 'loading' && <Tag icon={<LoadingOutlined spin />} color="blue" style={{ fontSize: 12 }}>VIN查询中...</Tag>}
                      </Space>
                      <div style={{ marginTop: 12 }}>
                        <Upload accept="image/*" showUploadList={false} beforeUpload={(file) => { handleOcrUpload(file); return false }}>
                          <Button size="small" icon={<ScanOutlined />} style={{ borderColor: '#E8352E', color: '#E8352E' }}>重新上传识别</Button>
                        </Upload>
                      </div>
                    </div>
                  )}
                  {ocrStatus === 'scanning' && (
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                      <LoadingOutlined spin style={{ fontSize: 24, color: '#fa8c16' }} />
                      <div style={{ fontSize: 13, color: '#fa8c16', marginTop: 8 }}>正在识别行驶证信息，请稍候...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Row gutter={[16, 0]}>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    车牌号 <span style={{ color: '#ff4d4f' }}>*</span>
                    {ocrFields.includes('plateNo') && <Tag color="green" style={{ fontSize: 10, marginLeft: 4, padding: '0 4px', lineHeight: '16px' }}>OCR</Tag>}
                  </label>
                  <Input value={editingVehicle.plateNo} onChange={(e) => setEditingVehicle({ ...editingVehicle, plateNo: e.target.value })} placeholder="如：粤A·D2588"
                    style={ocrFields.includes('plateNo') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                    suffix={ocrFields.includes('plateNo') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    VIN码 <span style={{ color: '#ff4d4f' }}>*</span>
                    {ocrFields.includes('vin') && <Tag color="green" style={{ fontSize: 10, marginLeft: 4, padding: '0 4px', lineHeight: '16px' }}>OCR</Tag>}
                  </label>
                  <Input value={editingVehicle.vin} onChange={(e) => setEditingVehicle({ ...editingVehicle, vin: e.target.value })} placeholder="17位车架号" maxLength={17}
                    style={ocrFields.includes('vin') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                    suffix={ocrFields.includes('vin') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : vinQueryStatus === 'loading' ? <LoadingOutlined spin style={{ color: '#1677ff' }} /> : undefined} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    品牌车型 <span style={{ color: '#ff4d4f' }}>*</span>
                    {ocrFields.includes('brandModel') && <Tag color="green" style={{ fontSize: 10, marginLeft: 4, padding: '0 4px', lineHeight: '16px' }}>VIN查询</Tag>}
                  </label>
                  <Input value={editingVehicle.brandModel} onChange={(e) => setEditingVehicle({ ...editingVehicle, brandModel: e.target.value })} placeholder="通过VIN码自动查询"
                    style={ocrFields.includes('brandModel') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                    suffix={ocrFields.includes('brandModel') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : vinQueryStatus === 'loading' ? <LoadingOutlined spin style={{ color: '#1677ff' }} /> : undefined} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>
                    发动机号 <span style={{ color: '#ff4d4f' }}>*</span>
                    {ocrFields.includes('engineNo') && <Tag color="green" style={{ fontSize: 10, marginLeft: 4, padding: '0 4px', lineHeight: '16px' }}>OCR</Tag>}
                  </label>
                  <Input value={editingVehicle.engineNo} onChange={(e) => setEditingVehicle({ ...editingVehicle, engineNo: e.target.value })} placeholder="请输入发动机号"
                    style={ocrFields.includes('engineNo') ? { borderColor: '#52c41a', color: '#389e0d' } : undefined}
                    suffix={ocrFields.includes('engineNo') ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : undefined} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>使用性质</label>
                  <Select value={editingVehicle.useType || undefined} onChange={(v) => setEditingVehicle({ ...editingVehicle, useType: v })} options={useTypeOptions} placeholder="请选择" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>颜色</label>
                  <Select value={editingVehicle.color || undefined} onChange={(v) => setEditingVehicle({ ...editingVehicle, color: v })} options={colorOptions} placeholder="请选择" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>里程(万km)</label>
                  <Input value={editingVehicle.mileage} onChange={(e) => setEditingVehicle({ ...editingVehicle, mileage: e.target.value })} placeholder="如：3.2" />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>过户次数</label>
                  <Input value={editingVehicle.transferCount} onChange={(e) => setEditingVehicle({ ...editingVehicle, transferCount: e.target.value })} placeholder="请输入" />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>采购价(万) <span style={{ color: '#ff4d4f' }}>*</span></label>
                  <Input value={editingVehicle.price} onChange={(e) => setEditingVehicle({ ...editingVehicle, price: e.target.value })} placeholder="系统定价或手动填写" />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>车况</label>
                  <Select value={editingVehicle.condition || undefined} onChange={(v) => setEditingVehicle({ ...editingVehicle, condition: v })} options={conditionOptions} placeholder="请选择" style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>上牌日期</label>
                  <Input value={editingVehicle.registerDate} onChange={(e) => setEditingVehicle({ ...editingVehicle, registerDate: e.target.value })} placeholder="如：2019-06-15" />
                </div>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>年审有效期</label>
                  <Input value={editingVehicle.annualInspection} onChange={(e) => setEditingVehicle({ ...editingVehicle, annualInspection: e.target.value })} placeholder="如：2027-06-15" />
                </div>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0 16px' }}>车况信息</Divider>
            <Row gutter={[16, 0]}>
              <Col span={6}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>碰撞</label>
                  <Select value={editingVehicle.collision} onChange={(v) => setEditingVehicle({ ...editingVehicle, collision: v })} options={[{ value: '正常', label: '正常' }, { value: '异常', label: '异常' }]} style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>水泡</label>
                  <Select value={editingVehicle.waterDamage} onChange={(v) => setEditingVehicle({ ...editingVehicle, waterDamage: v })} options={[{ value: '正常', label: '正常' }, { value: '异常', label: '异常' }]} style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>火烧</label>
                  <Select value={editingVehicle.fireDamage} onChange={(v) => setEditingVehicle({ ...editingVehicle, fireDamage: v })} options={[{ value: '正常', label: '正常' }, { value: '异常', label: '异常' }]} style={{ width: '100%' }} />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 4 }}>维保报告</label>
                  <Select value={editingVehicle.maintenanceReport} onChange={(v) => setEditingVehicle({ ...editingVehicle, maintenanceReport: v })} options={[{ value: '有', label: '有' }, { value: '无', label: '无' }]} style={{ width: '100%' }} />
                </div>
              </Col>
            </Row>
            {editingVehicle.maintenanceReport === '有' && (
              <div style={{ marginTop: 4, marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>
                  维保报告附件 <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>（支持PDF或图片，最多6个）</span>
                </label>
                <Upload
                  accept=".pdf,.jpg,.jpeg,.png"
                  listType="picture-card"
                  multiple
                  maxCount={6}
                  beforeUpload={() => false}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <UploadOutlined style={{ fontSize: 18, color: '#8c8c8c' }} />
                    <span style={{ fontSize: 11, color: '#8c8c8c' }}>上传文件</span>
                  </div>
                </Upload>
              </div>
            )}
        </Card>
      )}
    </div>
  )
}
