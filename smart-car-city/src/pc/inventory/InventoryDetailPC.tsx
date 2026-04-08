import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Button, Table, Space, Badge, Timeline, Modal, Form, Input, Select, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined, EnvironmentOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, CheckCircleFilled,
} from '@ant-design/icons'
import {
  mockSupervisedVehicles, mockAlertRecords, mockVehicleUseRecords,
} from '../../shared/mock/inventoryMock'
import type { AlertRecord, VehicleUseRecord } from '../../shared/types/Inventory.types'

const stockStatusColorMap: Record<string, string> = {
  pending_in: 'warning', in_stock: 'success', out_stock: 'processing', transferred: 'default',
}
const salesFlowColorMap: Record<string, string> = {
  pending_in: 'warning', pending_listing: 'processing', on_sale: 'success', in_transaction: 'error', sold: 'default',
}
const supervisionStatusColorMap: Record<string, string> = {
  pending: 'warning', supervising: 'success', released: 'default',
}

interface ObdBindRecord {
  id: string
  obdCode: string
  operator: string
  time: string
  result: 'success' | 'fail'
  reason?: string
}

/* mock OBD绑定历史 */
const mockObdRecords: ObdBindRecord[] = [
  { id: 'OBD001', obdCode: 'OBD-20260301-A01', operator: '韩立', time: '2026-03-01 10:30:00', result: 'success' },
  { id: 'OBD002', obdCode: 'OBD-20260228-B03', operator: '韩立', time: '2026-02-28 14:20:00', result: 'fail', reason: '设备编码不存在' },
  { id: 'OBD003', obdCode: 'OBD-20260215-C05', operator: '陈伟', time: '2026-02-15 09:00:00', result: 'success' },
  { id: 'OBD004', obdCode: 'OBD-20260210-A01', operator: '李明', time: '2026-02-10 16:45:00', result: 'fail', reason: '该OBD已绑定其他车辆' },
]

const warehouseOptions = [
  { value: '智慧门店SM-A区', label: '智慧门店SM-A区' },
  { value: '天河仓A区', label: '天河仓A区' },
  { value: '福田仓B区', label: '福田仓B区' },
  { value: '梅州仓', label: '梅州仓' },
  { value: '番禺仓', label: '番禺仓' },
]

export default function InventoryDetailPC() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = mockSupervisedVehicles.find((v) => v.id === id)

  /* ---- 确认入库弹窗 ---- */
  const [stockInOpen, setStockInOpen] = useState(false)
  const [stockInWarehouse, setStockInWarehouse] = useState<string | undefined>()
  const [stockInFailOpen, setStockInFailOpen] = useState(false)

  /* ---- OBD绑定弹窗 ---- */
  const [obdBindOpen, setObdBindOpen] = useState(false)
  const [obdCode, setObdCode] = useState<string | undefined>(undefined)
  const [obdReason, setObdReason] = useState('')
  const [obdBindResult, setObdBindResult] = useState<'success' | 'fail' | null>(null)
  const [obdSearching, setObdSearching] = useState(false)

  /* ---- OBD绑定记录弹窗 ---- */
  const [obdHistoryOpen, setObdHistoryOpen] = useState(false)

  if (!vehicle) {
    return (
      <div className="detail-page">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#8c8c8c' }}>车辆不存在</div>
      </div>
    )
  }

  const relatedAlerts = mockAlertRecords.filter((a) => a.plateNo === vehicle.plateNo)
  const relatedUse = mockVehicleUseRecords.filter((u) => u.plateNo === vehicle.plateNo)

  /* ---- 确认入库 ---- */
  const openStockIn = () => {
    setStockInWarehouse(warehouseOptions[0].value)
    setStockInOpen(true)
  }
  const handleStockIn = () => {
    if (!stockInWarehouse) { message.warning('请选择待入仓库'); return }
    // 模拟：50%概率失败
    if (Math.random() > 0.5) {
      setStockInOpen(false)
      setStockInFailOpen(true)
    } else {
      message.success('入库成功')
      setStockInOpen(false)
    }
  }

  /* ---- OBD可选编码列表（模拟远程搜索） ---- */
  const allObdOptions = [
    { value: 'OBD-20260401-A01', label: 'OBD-20260401-A01' },
    { value: 'OBD-20260401-A02', label: 'OBD-20260401-A02' },
    { value: 'OBD-20260401-B01', label: 'OBD-20260401-B01' },
    { value: 'OBD-20260401-B02', label: 'OBD-20260401-B02' },
    { value: 'OBD-20260401-C01', label: 'OBD-20260401-C01' },
    { value: 'OBD-20260330-A01', label: 'OBD-20260330-A01' },
    { value: 'OBD-20260330-B03', label: 'OBD-20260330-B03' },
    { value: 'OBD-20260328-D01', label: 'OBD-20260328-D01' },
  ]
  const [obdOptions, setObdOptions] = useState(allObdOptions)

  const handleObdSearch = (keyword: string) => {
    setObdSearching(true)
    // 模拟远程搜索延迟
    setTimeout(() => {
      const filtered = keyword
        ? allObdOptions.filter((o) => o.value.toLowerCase().includes(keyword.toLowerCase()))
        : allObdOptions
      setObdOptions(filtered)
      setObdSearching(false)
    }, 300)
  }

  /* ---- OBD绑定 ---- */
  const openObdBind = () => {
    setObdCode(undefined)
    setObdReason('')
    setObdBindResult(null)
    setObdOptions(allObdOptions)
    setObdBindOpen(true)
  }
  const handleObdBind = () => {
    if (!obdCode) { message.warning('请选择OBD编码'); return }
    // 模拟绑定结果
    const result = Math.random() > 0.5 ? 'success' : 'fail'
    setObdBindResult(result)
    if (result === 'success') {
      message.success('OBD绑定成功')
    }
  }

  const alertColumns: ColumnsType<AlertRecord> = [
    {
      title: '告警编号', dataIndex: 'alertNo', key: 'alertNo', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    {
      title: '等级', dataIndex: 'alertLevel', key: 'alertLevel', width: 70,
      render: (v: string) => <Tag color={v === 'high' ? 'error' : v === 'medium' ? 'warning' : 'processing'} style={{ borderRadius: 4 }}>{v === 'high' ? '高' : v === 'medium' ? '中' : '低'}</Tag>,
    },
    {
      title: '状态', dataIndex: 'alertStatus', key: 'alertStatus', width: 80,
      render: (_: unknown, r: AlertRecord) => <Tag color={r.alertStatus === 'alerting' ? 'error' : r.alertStatus === 'processing' ? 'warning' : 'default'} style={{ borderRadius: 4 }}>{r.alertStatusText}</Tag>,
    },
    { title: '类型', dataIndex: 'alertType', key: 'alertType', width: 110 },
    { title: '内容', dataIndex: 'alertContent', key: 'alertContent', ellipsis: true },
    {
      title: '触发时间', dataIndex: 'triggerTime', key: 'triggerTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
  ]

  const useColumns: ColumnsType<VehicleUseRecord> = [
    {
      title: '用车单号', dataIndex: 'id', key: 'id', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    {
      title: '用车类型', dataIndex: 'useType', key: 'useType', width: 100,
      render: (v: string) => <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag>,
    },
    { title: '提车人', key: 'picker', width: 120, render: (_: unknown, r: VehicleUseRecord) => `${r.pickerName}（${r.pickerType}）` },
    {
      title: '状态', key: 'status', width: 80,
      render: (_: unknown, r: VehicleUseRecord) => {
        const cm: Record<string, string> = { using: 'processing', completed: 'success', expired: 'default', pending_approval: 'warning', rejected: 'error' }
        return <Tag color={cm[r.useStatus]} style={{ borderRadius: 4 }}>{r.useStatusText}</Tag>
      },
    },
    { title: '用车时段', dataIndex: 'useDuration', key: 'useDuration', render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v}</span> },
  ]

  const obdHistoryColumns: ColumnsType<ObdBindRecord> = [
    { title: 'OBD编码', dataIndex: 'obdCode', key: 'obdCode', width: 180, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13 }}>{v}</span> },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 80 },
    { title: '操作时间', dataIndex: 'time', key: 'time', width: 170, render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v}</span> },
    {
      title: '绑定结果', dataIndex: 'result', key: 'result', width: 100,
      render: (v: string) => v === 'success'
        ? <Tag icon={<CheckCircleFilled />} color="success" style={{ borderRadius: 4 }}>绑定成功</Tag>
        : <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: 4 }}>绑定失败</Tag>,
    },
    { title: '失败原因', dataIndex: 'reason', key: 'reason', render: (v: string) => <span style={{ color: v ? '#ff4d4f' : '#bfbfbf' }}>{v || '-'}</span> },
  ]

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
            <span className="order-id">{vehicle.plateNo}</span>
            <Tag color={stockStatusColorMap[vehicle.stockStatus]} style={{ borderRadius: 4, fontSize: 13 }}>{vehicle.stockStatusText}</Tag>
            <Tag color={salesFlowColorMap[vehicle.salesFlowStatus]} style={{ borderRadius: 4, fontSize: 13 }}>{vehicle.salesFlowStatusText}</Tag>
            <Tag color={supervisionStatusColorMap[vehicle.supervisionStatus]} style={{ borderRadius: 4, fontSize: 13 }}>{vehicle.supervisionStatusText}</Tag>
            {vehicle.isScrapped && <Tag color="error">报废车</Tag>}
            {vehicle.isSpecialEntry && <Tag color="warning">特殊入库</Tag>}
          </div>
          <div className="order-meta">
            <span>{vehicle.brandModel}</span>
            <span style={{ fontFamily: "'DM Sans', monospace" }}>VIN: {vehicle.vin}</span>
            <span><EnvironmentOutlined /> {vehicle.location}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 36, fontWeight: 700, fontFamily: "'DM Sans', monospace", letterSpacing: -1,
            color: vehicle.stockDays >= 60 ? '#ff4d4f' : vehicle.stockDays >= 45 ? '#fa8c16' : '#1a1a2e',
          }}>
            {vehicle.stockDays}
            <span style={{ fontSize: 14, fontWeight: 400, color: '#8c8c8c', marginLeft: 4 }}>天库龄</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
            <Badge status={vehicle.deviceOnline === 'online' ? 'success' : 'default'} text={`设备${vehicle.deviceOnline === 'online' ? '在线' : '离线'}`} />
            <Badge status={vehicle.cameraStatus === '正常' ? 'success' : 'error'} text={`摄像头${vehicle.cameraStatus}`} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* 车辆信息 */}
        <div className="detail-section">
          <div className="detail-section-title">车辆信息</div>
          <div className="detail-section-body">
            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: '设备编号', value: vehicle.deviceNo || '未绑定' },
                { label: '监管方案', value: vehicle.supervisionPlan },
                { label: '所在仓库', value: vehicle.warehouse },
                { label: '垫款日期', value: vehicle.loanDate },
                { label: '回款状态', value: vehicle.repaymentStatus },
                { label: '车辆来源', value: vehicle.source },
              ].map((item) => (
                <div key={item.label} className="info-item">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 归属信息 */}
        <div className="detail-section">
          <div className="detail-section-title">归属信息</div>
          <div className="detail-section-body">
            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: '经销公司', value: vehicle.companyName },
                { label: '归属门店', value: vehicle.storeName },
                { label: '业务员', value: vehicle.salesperson },
                { label: '联系电话', value: vehicle.salespersonPhone },
              ].map((item) => (
                <div key={item.label} className="info-item">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 监管状态流转 */}
      <div className="detail-section">
        <div className="detail-section-title">监管状态流转</div>
        <div className="detail-section-body">
          <Timeline
            items={[
              {
                color: 'green', dot: <CheckCircleOutlined />,
                children: <><span style={{ fontWeight: 500 }}>待入库</span><span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12 }}>{vehicle.loanDate}</span></>,
              },
              ...(vehicle.stockStatus !== 'pending_in' ? [{
                color: 'green' as const, dot: <CheckCircleOutlined />,
                children: <><span style={{ fontWeight: 500 }}>入库确认</span><span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12 }}>GPS设备安装后自动入库</span></>,
              }] : []),
              ...(vehicle.supervisionStatus === 'supervising' || vehicle.supervisionStatus === 'released' ? [{
                color: vehicle.supervisionStatus === 'supervising' ? 'blue' as const : 'green' as const,
                dot: vehicle.supervisionStatus === 'supervising' ? <ClockCircleOutlined /> : <CheckCircleOutlined />,
                children: <><span style={{ fontWeight: 500 }}>监管中</span><span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12 }}>{vehicle.supervisionPlan}</span></>,
              }] : []),
              ...(vehicle.supervisionStatus === 'released' ? [{
                color: 'green' as const, dot: <CheckCircleOutlined />,
                children: <span style={{ fontWeight: 500 }}>监管解除</span>,
              }] : []),
            ]}
          />
        </div>
      </div>

      {/* 关联告警 */}
      {relatedAlerts.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">
            关联告警
            <span style={{ marginLeft: 8, fontSize: 12, color: '#8c8c8c' }}>共 {relatedAlerts.length} 条</span>
          </div>
          <div className="table-card-body">
            <Table columns={alertColumns} dataSource={relatedAlerts} rowKey="id" size="small"
              pagination={false} scroll={{ x: 800 }}
            />
          </div>
        </div>
      )}

      {/* 关联用车 */}
      {relatedUse.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">
            关联用车记录
            <span style={{ marginLeft: 8, fontSize: 12, color: '#8c8c8c' }}>共 {relatedUse.length} 条</span>
          </div>
          <div className="table-card-body">
            <Table columns={useColumns} dataSource={relatedUse} rowKey="id" size="small"
              pagination={false} scroll={{ x: 800 }}
            />
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        {vehicle.stockStatus === 'pending_in' && (
          <Button type="primary" size="large" onClick={openStockIn}>确认入库</Button>
        )}
        {vehicle.supervisionStatus === 'supervising' && (
          <Button size="large">用车申请</Button>
        )}
        <Button type="primary" size="large" onClick={openObdBind}>OBD绑定</Button>
        <Button size="large" onClick={() => setObdHistoryOpen(true)}>OBD绑定记录</Button>
      </div>

      {/* ===== 确认入库弹窗 ===== */}
      <Modal
        title="车辆入库"
        open={stockInOpen}
        onCancel={() => setStockInOpen(false)}
        footer={null}
        width={480}
        destroyOnClose
      >
        <div style={{ color: '#ff4d4f', fontSize: 13, marginBottom: 20 }}>
          入库前请确保车辆在店，并已成功安装硬件OBD
        </div>
        <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item label={<span><span style={{ color: '#ff4d4f' }}>*</span>待入仓库</span>}>
            <Select
              value={stockInWarehouse}
              onChange={setStockInWarehouse}
              options={warehouseOptions}
              suffixIcon={<span style={{ fontSize: 12 }}>›</span>}
            />
          </Form.Item>
          <Form.Item label="入库地址">
            <span style={{ color: '#595959' }}>广东广州市天河区酷狗音乐</span>
          </Form.Item>
        </Form>
        <Button
          type="primary" danger block size="large"
          style={{ marginTop: 16, borderRadius: 8, height: 48, fontSize: 16, fontWeight: 500 }}
          onClick={handleStockIn}
        >
          确认入库
        </Button>
      </Modal>

      {/* ===== 入库失败弹窗 ===== */}
      <Modal
        open={stockInFailOpen}
        onCancel={() => setStockInFailOpen(false)}
        footer={null}
        width={380}
        centered
        closable
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>入库失败</div>
          <div style={{ color: '#8c8c8c', marginBottom: 8 }}>入库失败</div>
          <div style={{ color: '#ff4d4f', fontWeight: 500, marginBottom: 8 }}>原因：车辆实时定位不在电子围栏内</div>
          <div style={{ color: '#8c8c8c', marginBottom: 24 }}>请联系市场相关人员处理</div>
          <Button block size="large" onClick={() => setStockInFailOpen(false)}
            style={{ borderRadius: 8, height: 44 }}
          >
            关闭
          </Button>
        </div>
      </Modal>

      {/* ===== OBD绑定弹窗 ===== */}
      <Modal
        title="车辆绑定OBD"
        open={obdBindOpen}
        onCancel={() => setObdBindOpen(false)}
        footer={null}
        width={520}
        destroyOnClose
      >
        {/* 基本信息确认 */}
        <div style={{ background: '#fafafa', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>基本信息确认</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 14 }}>
            <div><span style={{ color: '#8c8c8c', marginRight: 12 }}>VIN后4位</span><span style={{ fontWeight: 500 }}>{vehicle.vin.slice(-4)}</span></div>
            <div><span style={{ color: '#8c8c8c', marginRight: 12 }}>车牌</span><span style={{ fontWeight: 500 }}>{vehicle.plateNo}</span></div>
            <div><span style={{ color: '#8c8c8c', marginRight: 12 }}>归属门店</span><span>{vehicle.storeName}</span></div>
            <div><span style={{ color: '#8c8c8c', marginRight: 12 }}>车商姓名</span><span>韩立</span></div>
            <div><span style={{ color: '#8c8c8c', marginRight: 12 }}>手机号</span><span>13016044456</span></div>
          </div>
        </div>

        {/* 硬件信息 */}
        <div style={{ background: '#fafafa', borderRadius: 6, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>硬件信息</div>
          <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
            <Form.Item label="OBD编码" style={{ marginBottom: 12 }}>
              <Space>
                <Select
                  showSearch
                  placeholder="请搜索选择OBD编码"
                  value={obdCode}
                  onChange={(v) => { setObdCode(v); setObdBindResult(null) }}
                  onSearch={handleObdSearch}
                  filterOption={false}
                  loading={obdSearching}
                  notFoundContent={obdSearching ? '搜索中...' : '无匹配设备'}
                  options={obdOptions}
                  style={{ width: 240 }}
                />
                {obdBindResult === 'fail' && (
                  <span style={{ color: '#ff4d4f', fontSize: 13 }}><CloseCircleOutlined /> 绑定失败</span>
                )}
                {obdBindResult === 'success' && (
                  <span style={{ color: '#52c41a', fontSize: 13 }}><CheckCircleFilled /> 绑定成功</span>
                )}
              </Space>
            </Form.Item>
            <Form.Item label="绑定原因" style={{ marginBottom: 0 }}>
              <Input
                placeholder="请输入(50字以内)"
                maxLength={50}
                value={obdReason}
                onChange={(e) => setObdReason(e.target.value)}
              />
            </Form.Item>
          </Form>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button size="large" style={{ width: 140, borderRadius: 6 }} onClick={() => setObdBindOpen(false)}>取消</Button>
          <Button type="primary" size="large" style={{ width: 140, borderRadius: 6 }} onClick={handleObdBind}>确定</Button>
        </div>
      </Modal>

      {/* ===== OBD绑定记录弹窗 ===== */}
      <Modal
        title="OBD绑定记录"
        open={obdHistoryOpen}
        onCancel={() => setObdHistoryOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <div style={{ marginBottom: 12, fontSize: 13, color: '#8c8c8c' }}>
          车牌：{vehicle.plateNo}　VIN：{vehicle.vin}
        </div>
        <Table
          columns={obdHistoryColumns}
          dataSource={mockObdRecords}
          rowKey="id"
          size="small"
          pagination={false}
        />
      </Modal>
    </div>
  )
}
