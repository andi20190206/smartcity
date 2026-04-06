import { useState, useMemo } from 'react'
import { Table, Tag, Input, Select, Button, Space, Tabs, Badge, Modal, Form, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, ReloadOutlined, SwapOutlined, EyeOutlined,
  ExclamationCircleOutlined, WifiOutlined, DisconnectOutlined,
} from '@ant-design/icons'
import { mockDevices, mockDeviceTransferLogs, mockDeviceAlerts } from '../../shared/mock/deviceMock'
import { deviceStatusMap, deviceTypeMap, alertStatusMap } from '../../shared/constants/deviceStatusMap'
import type { DeviceRecord, DeviceTransferLog, DeviceAlertRecord } from '../../shared/types/Device.types'

export default function DeviceListPC() {
  const [activeTab, setActiveTab] = useState('devices')
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [detailDevice, setDetailDevice] = useState<DeviceRecord | null>(null)
  const [transferModal, setTransferModal] = useState<DeviceRecord | null>(null)
  const [bindModal, setBindModal] = useState<DeviceRecord | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const stats = useMemo(() => {
    const total = mockDevices.length
    const online = mockDevices.filter((d) => d.status === 'online').length
    const offline = mockDevices.filter((d) => d.status === 'offline').length
    const fault = mockDevices.filter((d) => d.status === 'fault').length
    const bound = mockDevices.filter((d) => d.bindVin).length
    return { total, online, offline, fault, bound }
  }, [])

  const filteredDevices = useMemo(() => {
    let list = mockDevices
    if (typeFilter) list = list.filter((d) => d.deviceType === typeFilter)
    if (statusFilter) list = list.filter((d) => d.status === statusFilter)
    if (searchText) {
      const s = searchText.toLowerCase()
      list = list.filter((d) =>
        d.deviceNo.toLowerCase().includes(s) || d.owner.includes(s) ||
        d.companyName.includes(s) || d.bindVin.toLowerCase().includes(s) ||
        d.bindPlateNo.includes(s)
      )
    }
    return list
  }, [searchText, typeFilter, statusFilter])

  const handleTransfer = () => {
    message.success(`设备 ${transferModal?.deviceNo} 转移成功`)
    setTransferModal(null)
  }

  const handleBind = () => {
    message.success(`设备 ${bindModal?.deviceNo} 绑定成功`)
    setBindModal(null)
  }

  const handleBatchTransfer = () => {
    Modal.confirm({
      title: '批量转移',
      icon: <ExclamationCircleOutlined />,
      content: `确定批量转移选中的 ${selectedRowKeys.length} 台设备？`,
      onOk: () => { message.success('批量转移成功'); setSelectedRowKeys([]) },
    })
  }

  const deviceColumns: ColumnsType<DeviceRecord> = [
    {
      title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 180, fixed: 'left',
      render: (v: string, r: DeviceRecord) => (
        <a onClick={() => setDetailDevice(r)} style={{ fontWeight: 600, fontSize: 13 }}>{v}</a>
      ),
    },
    {
      title: '设备类型', dataIndex: 'deviceType', key: 'deviceType', width: 100,
      render: (_: unknown, r: DeviceRecord) => {
        const info = deviceTypeMap[r.deviceType]
        return <Tag color={info?.color}>{info?.text}</Tag>
      },
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (_: unknown, r: DeviceRecord) => {
        const info = deviceStatusMap[r.status]
        return <Badge color={info?.color} text={info?.text} />
      },
    },
    {
      title: '归属人员', key: 'owner', width: 120,
      render: (_: unknown, r: DeviceRecord) => (
        <div>
          <div style={{ fontSize: 13 }}>{r.owner}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.ownerPhone}</div>
        </div>
      ),
    },
    {
      title: '经销公司', dataIndex: 'companyName', key: 'companyName', width: 200, ellipsis: true,
    },
    {
      title: '绑定车辆', key: 'bind', width: 140,
      render: (_: unknown, r: DeviceRecord) => r.bindPlateNo
        ? <span style={{ fontSize: 13 }}>{r.bindPlateNo}</span>
        : <span style={{ color: '#bfbfbf' }}>未绑定</span>,
    },
    {
      title: '位置', dataIndex: 'location', key: 'location', width: 200, ellipsis: true,
      render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v}</span>,
    },
    {
      title: '最后心跳', dataIndex: 'lastHeartbeat', key: 'lastHeartbeat', width: 160,
      render: (v: string) => <span style={{ fontSize: 12, fontFamily: "'DM Sans', monospace" }}>{v}</span>,
    },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right',
      render: (_: unknown, r: DeviceRecord) => (
        <Space size={4}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetailDevice(r)}>详情</Button>
          <Button type="link" size="small" icon={<SwapOutlined />} onClick={() => setTransferModal(r)}>转移</Button>
          <Button type="link" size="small" onClick={() => setBindModal(r)}>
            {r.bindVin ? '解绑' : '绑定'}
          </Button>
        </Space>
      ),
    },
  ]

  const transferColumns: ColumnsType<DeviceTransferLog> = [
    { title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 180 },
    {
      title: '设备类型', dataIndex: 'deviceType', key: 'deviceType', width: 100,
      render: (v: string) => <Tag color={deviceTypeMap[v]?.color}>{deviceTypeMap[v]?.text}</Tag>,
    },
    { title: '原归属人', dataIndex: 'fromOwner', key: 'fromOwner', width: 100 },
    { title: '新归属人', dataIndex: 'toOwner', key: 'toOwner', width: 100 },
    {
      title: '转移时间', dataIndex: 'transferTime', key: 'transferTime', width: 170,
      render: (v: string) => <span style={{ fontSize: 12, fontFamily: "'DM Sans', monospace" }}>{v}</span>,
    },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ]

  const alertColumns: ColumnsType<DeviceAlertRecord> = [
    { title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 180 },
    {
      title: '设备类型', dataIndex: 'deviceType', key: 'deviceType', width: 100,
      render: (v: string) => <Tag color={deviceTypeMap[v]?.color}>{deviceTypeMap[v]?.text}</Tag>,
    },
    { title: '告警类型', dataIndex: 'alertType', key: 'alertType', width: 100 },
    { title: '告警内容', dataIndex: 'alertContent', key: 'alertContent', width: 260, ellipsis: true },
    {
      title: '告警时间', dataIndex: 'alertTime', key: 'alertTime', width: 170,
      render: (v: string) => <span style={{ fontSize: 12, fontFamily: "'DM Sans', monospace" }}>{v}</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (v: string) => {
        const info = alertStatusMap[v]
        return <Tag color={info?.color}>{info?.text}</Tag>
      },
    },
    {
      title: '处理人', dataIndex: 'handler', key: 'handler', width: 80,
      render: (v: string) => v || <span style={{ color: '#bfbfbf' }}>—</span>,
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="stat-card brand">
          <div className="stat-label">设备总数</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">全部设备</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">在线设备</div>
          <div className="stat-value">{stats.online}</div>
          <div className="stat-sub">正常运行</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">离线设备</div>
          <div className="stat-value">{stats.offline}</div>
          <div className="stat-sub">待检查</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">故障设备</div>
          <div className="stat-value">{stats.fault}</div>
          <div className="stat-sub">需维修</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">已绑定车辆</div>
          <div className="stat-value">{stats.bound}</div>
          <div className="stat-sub">设备绑定中</div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <WifiOutlined />
            设备管理
            <span className="count">{mockDevices.length} 台</span>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ padding: '0 20px' }}
          items={[
            { key: 'devices', label: `设备台账 (${mockDevices.length})` },
            { key: 'transfers', label: `转移记录 (${mockDeviceTransferLogs.length})` },
            { key: 'alerts', label: <span>设备告警 <Badge count={mockDeviceAlerts.filter(a => a.status === 'pending').length} size="small" offset={[4, -2]} /></span> },
          ]}
        />

        {/* 设备台账 */}
        {activeTab === 'devices' && (
          <>
            <div className="filter-bar">
              <Input
                placeholder="搜索设备编号/归属人/公司/VIN/车牌"
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchText} onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }} allowClear
              />
              <Select
                placeholder="设备类型" value={typeFilter} onChange={setTypeFilter}
                style={{ width: 130 }} allowClear
                options={[
                  { value: 'gps', label: 'GPS定位' },
                  { value: 'camera', label: '摄像头' },
                  { value: 'rfid', label: 'RFID标签' },
                  { value: 'pda', label: 'PDA终端' },
                  { value: 'gate', label: '道闸' },
                ]}
              />
              <Select
                placeholder="设备状态" value={statusFilter} onChange={setStatusFilter}
                style={{ width: 120 }} allowClear
                options={[
                  { value: 'online', label: '在线' },
                  { value: 'offline', label: '离线' },
                  { value: 'fault', label: '故障' },
                ]}
              />
              <div style={{ flex: 1 }} />
              {selectedRowKeys.length > 0 && (
                <Button icon={<SwapOutlined />} onClick={handleBatchTransfer}>
                  批量转移 ({selectedRowKeys.length})
                </Button>
              )}
              <Button icon={<ReloadOutlined />} onClick={() => { setSearchText(''); setTypeFilter(undefined); setStatusFilter(undefined) }}>
                重置
              </Button>
            </div>
            <div className="table-card-body">
              <Table
                columns={deviceColumns} dataSource={filteredDevices} rowKey="id"
                size="middle" scroll={{ x: 1400 }}
                rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
                pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 台` }}
              />
            </div>
          </>
        )}

        {/* 转移记录 */}
        {activeTab === 'transfers' && (
          <div className="table-card-body">
            <Table
              columns={transferColumns} dataSource={mockDeviceTransferLogs} rowKey="id"
              size="middle" pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
            />
          </div>
        )}

        {/* 设备告警 */}
        {activeTab === 'alerts' && (
          <div className="table-card-body">
            <Table
              columns={alertColumns} dataSource={mockDeviceAlerts} rowKey="id"
              size="middle" pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
            />
          </div>
        )}
      </div>

      {/* 设备详情弹窗 */}
      <Modal
        title={<Space><WifiOutlined />设备详情 — {detailDevice?.deviceNo}</Space>}
        open={!!detailDevice} onCancel={() => setDetailDevice(null)}
        footer={<Button onClick={() => setDetailDevice(null)}>关闭</Button>}
        width={560}
      >
        {detailDevice && (
          <div style={{ padding: '8px 0' }}>
            {[
              { label: '设备编号', value: detailDevice.deviceNo },
              { label: '设备类型', value: detailDevice.deviceTypeText },
              { label: '状态', value: <Badge color={deviceStatusMap[detailDevice.status]?.color} text={deviceStatusMap[detailDevice.status]?.text} /> },
              { label: '归属人员', value: `${detailDevice.owner}（${detailDevice.ownerPhone}）` },
              { label: '经销公司', value: detailDevice.companyName },
              { label: '门店', value: detailDevice.storeName },
              { label: '绑定车辆', value: detailDevice.bindPlateNo || '未绑定' },
              { label: '绑定VIN', value: detailDevice.bindVin || '—' },
              { label: '位置', value: detailDevice.location },
              { label: '最后心跳', value: detailDevice.lastHeartbeat },
              { label: '安装日期', value: detailDevice.installDate },
              { label: '厂商', value: detailDevice.manufacturer },
              { label: '型号', value: detailDevice.model },
              { label: '固件版本', value: detailDevice.firmwareVersion },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #fafafa' }}>
                <div style={{ width: 100, fontSize: 13, color: '#8c8c8c', flexShrink: 0 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* 转移弹窗 */}
      <Modal
        title={`转移设备 — ${transferModal?.deviceNo}`}
        open={!!transferModal} onCancel={() => setTransferModal(null)}
        onOk={handleTransfer} okText="确认转移" cancelText="取消" width={440}
      >
        <Form layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="当前归属人">
            <Input value={transferModal?.owner} disabled />
          </Form.Item>
          <Form.Item label="转移至" rules={[{ required: true }]}>
            <Select placeholder="选择新归属人" options={[
              { value: '陈伟', label: '陈伟 - 天河旗舰店' },
              { value: '李明', label: '李明 - 福田精品店' },
              { value: '王芳', label: '王芳 - 天河旗舰店' },
              { value: '赵强', label: '赵强 - 顺德旗舰店' },
            ]} />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea rows={2} placeholder="转移原因" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 绑定/解绑弹窗 */}
      <Modal
        title={bindModal?.bindVin ? `解绑设备 — ${bindModal?.deviceNo}` : `绑定车辆 — ${bindModal?.deviceNo}`}
        open={!!bindModal} onCancel={() => setBindModal(null)}
        onOk={handleBind} okText={bindModal?.bindVin ? '确认解绑' : '确认绑定'} cancelText="取消" width={440}
      >
        {bindModal?.bindVin ? (
          <div style={{ padding: '16px 0' }}>
            <p>当前绑定车辆：<strong>{bindModal.bindPlateNo}</strong>（{bindModal.bindVin}）</p>
            <p style={{ color: '#8c8c8c' }}>解绑后设备将变为空闲状态，可重新绑定其他车辆。</p>
          </div>
        ) : (
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="车辆VIN码" rules={[{ required: true }]}>
              <Input placeholder="输入要绑定的车辆VIN码" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}
