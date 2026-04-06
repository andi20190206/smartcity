import { useState } from 'react'
import {
  Steps, Form, Input, Select, Button, Card, Space,
  Table, Upload, Divider, Alert, Tag, message, Modal,
  Row, Col, Checkbox, InputNumber, Typography,
} from 'antd'
import {
  PlusOutlined, UploadOutlined, CarOutlined,
  UserOutlined, BankOutlined, FileTextOutlined,
  SaveOutlined, SendOutlined, ScanOutlined,
  CheckCircleOutlined, InfoCircleOutlined,
  ArrowLeftOutlined, ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

interface ListedVehicle {
  key: string
  purchaseOrderId: string
  plateNo: string
  vin: string
  brandModel: string
  engineNo: string
  useType: string
  mileage: number
  registerDate: string
  contractPrice: number
  salesPrice: number | null
  selected: boolean
}

/** 模拟已上架车辆 */
const mockListedVehicles: ListedVehicle[] = [
  { key: 'LV01', purchaseOrderId: 'CG-2026031001', plateNo: '粤A·12345', vin: 'LVHCV6637K50CLTS1', brandModel: '别克英朗 2019款 18T 自动互联精英型', engineNo: 'LFV2A21G5K3012345', useType: '非营运', mileage: 3.2, registerDate: '2019-06-15', contractPrice: 5.80, salesPrice: null, selected: false },
  { key: 'LV02', purchaseOrderId: 'CG-2026031002', plateNo: '粤B·67890', vin: 'LGBH52E04GY654321', brandModel: '丰田卡罗拉 2021款 1.8L 双擎精英版', engineNo: '2ZR1234567', useType: '非营运', mileage: 5.8, registerDate: '2021-03-10', contractPrice: 9.20, salesPrice: null, selected: false },
  { key: 'LV03', purchaseOrderId: 'CG-2026031003', plateNo: '粤A·33456', vin: 'WBAJB0C55JB174523', brandModel: '凯迪拉克 GT4 2023款 25T 尊贵型', engineNo: 'LSY1234567', useType: '非营运', mileage: 1.5, registerDate: '2023-01-20', contractPrice: 17.50, salesPrice: null, selected: false },
  { key: 'LV04', purchaseOrderId: 'CG-2026031003', plateNo: '粤A·33457', vin: 'LNBSCCAK1JW200008', brandModel: '奔驰C260L 2023款 运动版', engineNo: 'M264920A7654321', useType: '非营运', mileage: 2.1, registerDate: '2023-05-18', contractPrice: 24.50, salesPrice: null, selected: false },
  { key: 'LV05', purchaseOrderId: 'CG-2026031003', plateNo: '粤A·33458', vin: 'LGWEF4A57LF300009', brandModel: '宝马325Li 2022款 M运动套装', engineNo: 'B48B20C9876543', useType: '非营运', mileage: 3.2, registerDate: '2022-08-10', contractPrice: 22.80, salesPrice: null, selected: false },
  { key: 'LV06', purchaseOrderId: 'CG-2026031004', plateNo: '湘C·11111', vin: 'LSVAM4187CN200001', brandModel: '大众帕萨特 2020款 330TSI 精英版', engineNo: 'CSS1234567', useType: '非营运', mileage: 6.5, registerDate: '2020-08-05', contractPrice: 12.60, salesPrice: null, selected: false },
]

export default function SalesCreatePC() {
  const [currentStep, setCurrentStep] = useState(0)
  const [vehicles, setVehicles] = useState<ListedVehicle[]>(mockListedVehicles)
  const [buyerForm] = Form.useForm()
  const [paymentForm] = Form.useForm()

  const [buyerType, setBuyerType] = useState<string>('个人')
  const [payerIsBuyer, setPayerIsBuyer] = useState(true)
  const [pcIndivPayMode, setPcIndivPayMode] = useState<string>('法人名下银行卡')

  const selectedVehicles = vehicles.filter((v) => v.selected)
  const totalContract = selectedVehicles.reduce((s, v) => s + v.contractPrice, 0)
  const totalSales = selectedVehicles.reduce((s, v) => s + (v.salesPrice || 0), 0)
  const totalProfitLoss = totalSales - totalContract

  const toggleSelect = (key: string) => {
    setVehicles((prev) => prev.map((v) => v.key === key ? { ...v, selected: !v.selected } : v))
  }

  const updateSalesPrice = (key: string, price: number | null) => {
    setVehicles((prev) => prev.map((v) => v.key === key ? { ...v, salesPrice: price } : v))
  }

  const selectAll = (checked: boolean) => {
    setVehicles((prev) => prev.map((v) => ({ ...v, selected: checked })))
  }

  const fillTestData = () => {
    setVehicles((prev) => prev.map((v, i) => i < 3 ? { ...v, selected: true, salesPrice: +(v.contractPrice + 0.5 + i * 0.3).toFixed(2) } : v))
    buyerForm.setFieldsValue({ buyerType: '个人', buyerName: '刘伟', buyerIdNo: '440106199201011234', buyerPhone: '13900001111' })
    setBuyerType('个人')
    setPayerIsBuyer(true)
    message.success('测试数据已填充')
  }

  const handleSubmit = () => {
    const filled = selectedVehicles.filter((v) => v.salesPrice !== null && v.salesPrice > 0)
    if (filled.length === 0) {
      message.error('请至少选择一台车辆并填写销售价')
      return
    }
    const hasLoss = totalProfitLoss < 0
    Modal.confirm({
      title: '销售金额确认',
      width: 480,
      content: (
        <div style={{ padding: '12px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#8c8c8c' }}>销售台次</span>
            <span style={{ fontWeight: 600 }}>{filled.length}台</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#8c8c8c' }}>采购合同价合计</span>
            <span style={{ fontFamily: "'DM Sans', monospace" }}>{totalContract.toFixed(2)}万元</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: '#8c8c8c' }}>销售总价</span>
            <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 18 }}>{totalSales.toFixed(2)}万元</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ color: '#8c8c8c' }}>盈亏</span>
            <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: totalProfitLoss >= 0 ? '#52c41a' : '#ff4d4f' }}>
              {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)}万元
            </span>
          </div>
          {hasLoss && (
            <Alert type="error" showIcon style={{ marginTop: 12 }}
              message={`本次销售存在亏损 ${Math.abs(totalProfitLoss).toFixed(2)}万元，差额将计入车商销售亏损`} />
          )}
        </div>
      ),
      okText: '确认提交',
      okButtonProps: { style: { background: '#E8352E', borderColor: '#E8352E' } },
      onOk: () => {
        message.success('销售签约申请提交成功')
        setTimeout(() => window.close(), 500)
      },
    })
  }

  // 车辆选择表格列
  const vehicleColumns: ColumnsType<ListedVehicle> = [
    {
      title: <Checkbox checked={vehicles.every((v) => v.selected)} indeterminate={vehicles.some((v) => v.selected) && !vehicles.every((v) => v.selected)} onChange={(e) => selectAll(e.target.checked)} />,
      width: 50,
      render: (_: unknown, record: ListedVehicle) => (
        <Checkbox checked={record.selected} onChange={() => toggleSelect(record.key)} />
      ),
    },
    { title: '采购单号', dataIndex: 'purchaseOrderId', width: 140, render: (t: string) => <Text code style={{ fontSize: 12 }}>{t}</Text> },
    { title: '车牌号', dataIndex: 'plateNo', width: 110, render: (t: string) => <Text strong>{t}</Text> },
    { title: 'VIN码', dataIndex: 'vin', width: 190, render: (t: string) => <Text code style={{ fontSize: 12 }}>{t}</Text> },
    { title: '品牌车型', dataIndex: 'brandModel', width: 240, ellipsis: true },
    { title: '里程(万km)', dataIndex: 'mileage', width: 100, align: 'right' },
    { title: '上牌日期', dataIndex: 'registerDate', width: 110 },
    {
      title: '采购合同价(万)', dataIndex: 'contractPrice', width: 130, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", color: '#8c8c8c' }}>{v.toFixed(2)}</span>,
    },
    {
      title: '销售价(万)', width: 140, align: 'right',
      render: (_: unknown, record: ListedVehicle) => record.selected ? (
        <InputNumber
          value={record.salesPrice}
          onChange={(v) => updateSalesPrice(record.key, v)}
          placeholder="填写销售价"
          min={0} step={0.1} precision={2}
          style={{ width: 120 }}
          status={record.salesPrice !== null && record.salesPrice < record.contractPrice ? 'warning' : undefined}
        />
      ) : <span style={{ color: '#bfbfbf' }}>-</span>,
    },
    {
      title: '盈亏(万)', width: 100, align: 'right',
      render: (_: unknown, record: ListedVehicle) => {
        if (!record.selected || record.salesPrice === null) return <span style={{ color: '#bfbfbf' }}>-</span>
        const pl = record.salesPrice - record.contractPrice
        return (
          <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: pl >= 0 ? '#52c41a' : '#ff4d4f', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            {pl >= 0 ? <ArrowUpOutlined style={{ fontSize: 10 }} /> : <ArrowDownOutlined style={{ fontSize: 10 }} />}
            {pl >= 0 ? '+' : ''}{pl.toFixed(2)}
          </span>
        )
      },
    },
  ]

  const stepItems = [
    { title: '选择车辆', icon: <CarOutlined /> },
    { title: '买家信息', icon: <UserOutlined /> },
    { title: '付款信息', icon: <BankOutlined /> },
    { title: '签名附件', icon: <FileTextOutlined /> },
  ]

  const stepContent = [
    // Step 0: 选择车辆 & 填写销售价
    (
      <div key="step0">
        <Card size="small"
          title={<span><CarOutlined style={{ marginRight: 6 }} />已上架车辆（勾选后填写销售价）</span>}
          extra={
            <Space>
              <span style={{ fontSize: 13, color: '#8c8c8c' }}>
                已选 <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{selectedVehicles.length}</span> 台，
                销售总价：<span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>{totalSales.toFixed(2)}</span> 万
              </span>
            </Space>
          }
        >
          <Alert type="info" showIcon icon={<InfoCircleOutlined />}
            message="从已上架车辆中勾选，支持多选（批量销售要求同一买家）。每台车需独立填写销售价。"
            style={{ marginBottom: 12 }} />
          <Table
            columns={vehicleColumns}
            dataSource={vehicles}
            rowKey="key"
            size="small"
            scroll={{ x: 1500 }}
            pagination={false}
            rowClassName={(record) => record.selected ? 'ant-table-row-selected' : ''}
            summary={() => selectedVehicles.length > 0 ? (
              <Table.Summary.Row style={{ background: '#fafafa' }}>
                <Table.Summary.Cell index={0} colSpan={7}><Text strong>合计 ({selectedVehicles.length}台)</Text></Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{totalContract.toFixed(2)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E' }}>{totalSales.toFixed(2)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: totalProfitLoss >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    {totalProfitLoss >= 0 ? '+' : ''}{totalProfitLoss.toFixed(2)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            ) : null}
          />
        </Card>
      </div>
    ),

    // Step 1: 买家信息
    (
      <div key="step1">
        <Card size="small" title={<span><UserOutlined style={{ marginRight: 6 }} />买家信息</span>}>
          <Form form={buyerForm} layout="vertical" style={{ maxWidth: 800 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="买家类型" name="buyerType" rules={[{ required: true }]} initialValue="个人">
                  <Select options={[{ value: '个人', label: '个人' }, { value: '企业', label: '企业' }, { value: '个体工商户', label: '个体工商户' }]}
                    onChange={(v) => setBuyerType(v)} />
                </Form.Item>
              </Col>
              {buyerType === '个人' && (
                <>
                  <Col span={8}>
                    <Form.Item label="证件类型"><Input value="身份证" disabled /></Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="买家姓名" name="buyerName" rules={[{ required: true }]}>
                      <Input placeholder="请输入姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="身份证号码" name="buyerIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入身份证号码" />
                    </Form.Item>
                  </Col>
                </>
              )}
              {buyerType === '企业' && (
                <>
                  <Col span={8}>
                    <Form.Item label="证件类型" name="buyerCertType" initialValue="统一社会信用代码">
                      <Select options={[{ value: '统一社会信用代码', label: '统一社会信用代码' }, { value: '组织机构代码', label: '组织机构代码' }]} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="企业名称" name="buyerName" rules={[{ required: true }]}>
                      <Input placeholder="请输入企业名称" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="证件号码" name="buyerIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入证件号码" />
                    </Form.Item>
                  </Col>
                </>
              )}
              {buyerType === '个体工商户' && (
                <>
                  <Col span={8}>
                    <Form.Item label="法人证件类型"><Input value="身份证" disabled style={{ color: '#bfbfbf' }} /></Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="法人姓名" name="buyerLegalName" rules={[{ required: true }]}>
                      <Input placeholder="请输入法人姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="法人身份证号码" name="buyerIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入法人身份证号码" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="企业证件类型" name="buyerEntCertType" initialValue="统一社会信用代码">
                      <Select options={[{ value: '统一社会信用代码', label: '统一社会信用代码' }, { value: '组织机构代码', label: '组织机构代码' }]} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="企业名称" name="buyerName" rules={[{ required: true }]}>
                      <Input placeholder="请输入企业名称" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="企业证件号码" name="buyerEntIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入企业证件号码" />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={8}>
                <Form.Item label="联系电话" name="buyerPhone" rules={[{ required: true }]}>
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
              </Col>
            </Row>
            <Divider style={{ margin: '8px 0 16px' }} />
            <Form.Item label={<span>买家证件 <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>（支持OCR识别）</span></span>}>
              <Space size={16}>
                {buyerType === '企业' ? (
                  <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                    <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>营业执照</div></div>
                  </Upload>
                ) : buyerType === '个体工商户' ? (
                  <>
                    <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>法人身份证人像页</div></div>
                    </Upload>
                    <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>法人身份证国徽页</div></div>
                    </Upload>
                    <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>营业执照/组织机构代码证</div></div>
                    </Upload>
                  </>
                ) : (
                  <>
                    <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>身份证正面</div></div>
                    </Upload>
                    <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>身份证反面</div></div>
                    </Upload>
                  </>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    ),

    // Step 2: 付款信息
    (
      <div key="step2">
        <Card size="small" title={<span><BankOutlined style={{ marginRight: 6 }} />付款信息</span>}>
          <Form form={paymentForm} layout="vertical" style={{ maxWidth: 800 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="付款人是否为买家">
                  <Select value={payerIsBuyer ? 'yes' : 'no'} onChange={(v) => setPayerIsBuyer(v === 'yes')}
                    options={[{ value: 'yes', label: '是（与买家一致）' }, { value: 'no', label: '否（第三方付款）' }]} />
                </Form.Item>
              </Col>
            </Row>
            {payerIsBuyer ? (
              <>
                <Divider style={{ margin: '8px 0 16px' }} />
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>收款账户信息</div>
                {buyerType === '个人' && (
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item label="开户名"><Input value="自动带入买家姓名" disabled /></Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="银行卡号" name="payerCardNo" rules={[{ required: true }]}>
                        <Input placeholder="请输入银行卡号" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="所属银行" name="payerBank" rules={[{ required: true }]}>
                        <Input placeholder="请输入所属银行" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="银行预留手机" name="payerPhone" rules={[{ required: true }]}>
                        <Input placeholder="银行预留手机号" />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
                {buyerType === '企业' && (
                  <>
                    <Row gutter={24}>
                      <Col span={8}>
                        <Form.Item label="开户名"><Input value="自动带入企业名称" disabled /></Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="对公账号" name="payerCardNo" rules={[{ required: true }]}>
                          <Input placeholder="请输入对公账号" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="所属银行" name="payerBank" rules={[{ required: true }]}>
                          <Input placeholder="请输入所属银行" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Alert type="info" showIcon icon={<InfoCircleOutlined />}
                      message="系统会自动向该对公账户转入0.01元用于验证账号有效性" style={{ marginTop: 8 }} />
                  </>
                )}
                {buyerType === '个体工商户' && (
                  <>
                    <Row gutter={24}>
                      <Col span={8}>
                        <Form.Item label="银行卡类型" name="indivPayMode" initialValue="法人名下银行卡" rules={[{ required: true }]}>
                          <Select options={[{ value: '法人名下银行卡', label: '法人名下银行卡' }, { value: '对公账户银行卡', label: '对公账户银行卡' }]} onChange={(v) => setPcIndivPayMode(v)} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="账户类型" name="indivAccountType" initialValue="他行个人账户" rules={[{ required: true }]}>
                          <Select options={pcIndivPayMode === '法人名下银行卡'
                            ? [{ value: '他行个人账户', label: '他行个人账户' }, { value: '中信个人账户', label: '中信个人账户' }]
                            : [{ value: '他行企业账户', label: '他行企业账户' }, { value: '中信企业账户', label: '中信企业账户' }]
                          } />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="开户名"><Input value="自动带入法人姓名/企业名称" disabled style={{ color: '#bfbfbf' }} /></Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="银行卡号" name="payerCardNo" rules={[{ required: true }]}>
                          <Input placeholder="请输入银行卡号" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="银行名称" name="payerBank" rules={[{ required: true }]}>
                          <Input placeholder="请选择银行" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item label="银行预留手机" name="payerPhone">
                          <Input placeholder="法人名下银行卡时必填" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            ) : (
              <>
                <Divider style={{ margin: '8px 0 16px' }} />
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="付款人类型" name="payerType" rules={[{ required: true }]}>
                      <Select options={[{ value: '个人', label: '个人' }, { value: '企业', label: '企业' }, { value: '个体工商户', label: '个体工商户' }]} placeholder="请选择" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="付款人姓名" name="payerName" rules={[{ required: true }]}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="证件号码" name="payerIdNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="银行卡号" name="payerCardNo" rules={[{ required: true }]}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="开户行" name="payerBank" rules={[{ required: true }]}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="银行预留手机" name="payerPhone" rules={[{ required: true }]}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider style={{ margin: '8px 0 16px' }} />
                <Form.Item label={<span>付款人证件 & 银行卡 <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>（支持OCR识别）</span></span>}>
                  <Space size={16}>
                    <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>付款人证件</div></div>
                    </Upload>
                    <Upload listType="picture-card" maxCount={1} accept="image/*" beforeUpload={() => false}>
                      <div><UploadOutlined /><div style={{ marginTop: 4, fontSize: 12 }}>银行卡正面</div></div>
                    </Upload>
                  </Space>
                </Form.Item>
                <Divider style={{ margin: '8px 0 16px' }} />
                <Form.Item label={<span>代付证明文件 <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>（支持图片和PDF，可上传多个）</span></span>} required>
                  <Upload.Dragger accept="image/*,.pdf" multiple beforeUpload={() => false} style={{ padding: '16px 0' }}>
                    <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 28, color: '#bfbfbf' }} /></p>
                    <p className="ant-upload-text" style={{ fontSize: 13 }}>点击或拖拽上传代付证明</p>
                    <p className="ant-upload-hint" style={{ fontSize: 12 }}>支持 JPG/PNG 图片和 PDF 文件，可上传多个</p>
                  </Upload.Dragger>
                </Form.Item>
              </>
            )}
          </Form>
        </Card>
      </div>
    ),

    // Step 3: 签名 & 附件
    (
      <div key="step3">
        <Card size="small" title={<span><FileTextOutlined style={{ marginRight: 6 }} />签名信息</span>}>
          <Row gutter={24}>
            <Col span={12}>
              <div style={{ marginBottom: 8, fontSize: 13, color: '#8c8c8c' }}>销售顾问签名</div>
              <div style={{ height: 120, background: '#fafafa', borderRadius: 8, border: '1.5px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => message.info('签名板功能开发中')}>
                <span style={{ color: '#bfbfbf' }}>点击签名</span>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 8, fontSize: 13, color: '#8c8c8c' }}>买家签名</div>
              <div style={{ height: 120, background: '#fafafa', borderRadius: 8, border: '1.5px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => message.info('签名板功能开发中')}>
                <span style={{ color: '#bfbfbf' }}>点击签名</span>
              </div>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="附件（选填）" style={{ marginTop: 16 }}>
          <Upload.Dragger accept="image/*,.pdf" multiple beforeUpload={() => false} style={{ padding: '20px 0' }}>
            <p className="ant-upload-drag-icon"><UploadOutlined style={{ fontSize: 32, color: '#bfbfbf' }} /></p>
            <p className="ant-upload-text" style={{ fontSize: 14 }}>上传线下合同</p>
            <p className="ant-upload-hint" style={{ fontSize: 12 }}>支持图片或PDF格式</p>
          </Upload.Dragger>
        </Card>

        {/* 销售汇总 */}
        <Card size="small" title="销售汇总" style={{ marginTop: 16 }}>
          <div style={{ maxWidth: 500 }}>
            {[
              { label: '销售台次', value: `${selectedVehicles.length}台` },
              { label: '采购合同价合计', value: `${totalContract.toFixed(2)}万元` },
              { label: '销售总价', value: `${totalSales.toFixed(2)}万元`, highlight: true },
              { label: '盈亏', value: `${totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}万元`, loss: totalProfitLoss < 0 },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ color: '#8c8c8c' }}>{row.label}</span>
                <span style={{
                  fontFamily: "'DM Sans', monospace",
                  fontSize: row.highlight ? 20 : 14,
                  fontWeight: row.highlight || row.loss ? 700 : 500,
                  color: row.loss ? '#ff4d4f' : row.highlight ? '#E8352E' : '#1a1a2e',
                }}>{row.value}</span>
              </div>
            ))}
          </div>
          {totalProfitLoss < 0 && (
            <Alert type="error" showIcon style={{ marginTop: 12 }}
              message={`本次销售存在亏损 ${Math.abs(totalProfitLoss).toFixed(2)}万元，差额将计入车商销售亏损`} />
          )}
        </Card>
      </div>
    ),
  ]

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Space>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => window.close()} />
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", color: '#1a1a2e' }}>新建销售单</span>
        </Space>
        <Space>
          <Button icon={<SaveOutlined />} onClick={fillTestData}>填充测试数据</Button>
          <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit}
            style={{ background: '#E8352E', borderColor: '#E8352E' }}>
            提交销售签约
          </Button>
        </Space>
      </div>

      {/* Steps */}
      <Card size="small" style={{ marginBottom: 20 }}>
        <Steps current={currentStep} items={stepItems} onChange={(v) => setCurrentStep(v)} />
      </Card>

      {/* Content */}
      {stepContent[currentStep]}

      {/* Bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '16px 0' }}>
        <Button disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)}>
          上一步
        </Button>
        <Space>
          {currentStep < stepItems.length - 1 ? (
            <Button type="primary" onClick={() => {
              if (currentStep === 0) {
                const missing = selectedVehicles.filter((v) => v.salesPrice === null || v.salesPrice <= 0)
                if (missing.length > 0) { message.warning(`请填写所有已选车辆的销售价（${missing.length}台未填写）`); return }
              }
              setCurrentStep(currentStep + 1)
            }}
              disabled={currentStep === 0 && selectedVehicles.length === 0}
              style={{ background: '#E8352E', borderColor: '#E8352E' }}>
              下一步
            </Button>
          ) : (
            <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit}
              style={{ background: '#E8352E', borderColor: '#E8352E' }}>
              提交销售签约
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
}
