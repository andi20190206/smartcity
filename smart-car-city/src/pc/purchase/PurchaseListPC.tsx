import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, DatePicker, Space, Tooltip, Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, PlusOutlined, ExportOutlined, ReloadOutlined,
  EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined,
  CarOutlined, FileTextOutlined,
} from '@ant-design/icons'
import { mockOrders } from '../../shared/mock/purchaseMock'
import type { PurchaseOrder } from '../../shared/types/Purchase.types'

const { RangePicker } = DatePicker

const statusColorMap: Record<string, string> = {
  pending_check: 'processing',
  pending_sign: 'warning',
  signed: 'success',
  rejected: 'error',
  cancelled: 'default',
}

const statusTextMap: Record<string, string> = {
  pending_check: '待查验',
  pending_sign: '待签约',
  signed: '签约完成',
  rejected: '不通过',
  cancelled: '已取消',
}

export default function PurchaseListPC() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [modeFilter, setModeFilter] = useState<string | undefined>(undefined)

  const filteredData = useMemo(() => {
    return mockOrders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false
      if (modeFilter && o.mode !== modeFilter) return false
      if (searchText) {
        const s = searchText.toLowerCase()
        const match = o.id.toLowerCase().includes(s)
          || o.ownerName.toLowerCase().includes(s)
          || o.vehicles.some((v) => v.plateNo.includes(s) || v.vin.toLowerCase().includes(s) || v.brandModel.toLowerCase().includes(s))
        if (!match) return false
      }
      return true
    })
  }, [searchText, statusFilter, modeFilter])

  // 统计
  const stats = useMemo(() => {
    const all = mockOrders
    return {
      total: all.length,
      pendingCheck: all.filter((o) => o.status === 'pending_check').length,
      pendingSign: all.filter((o) => o.status === 'pending_sign').length,
      signed: all.filter((o) => o.status === 'signed').length,
      totalAmount: all.reduce((s, o) => s + o.totalPrice, 0),
    }
  }, [])

  const columns: ColumnsType<PurchaseOrder> = [
    {
      title: '采购单号',
      dataIndex: 'id',
      key: 'id',
      width: 160,
      fixed: 'left',
      render: (id: string) => (
        <a onClick={() => navigate(`/pc/purchase/${id}`)} style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>
          {id}
        </a>
      ),
    },
    {
      title: '采购模式',
      dataIndex: 'mode',
      key: 'mode',
      width: 100,
      render: (mode: string) => (
        <Tag color={mode === 'batch' ? 'blue' : 'default'} style={{ borderRadius: 4 }}>
          {mode === 'single' ? '单车' : '批量'}
        </Tag>
      ),
    },
    {
      title: '车辆信息',
      key: 'vehicle',
      width: 280,
      render: (_: unknown, record: PurchaseOrder) => {
        const v = record.vehicles[0]
        return (
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>
              {v.plateNo}
              {record.vehicles.length > 1 && (
                <span style={{ fontSize: 11, color: '#8c8c8c', marginLeft: 6 }}>等{record.vehicles.length}台</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{v.brandModel}</div>
          </div>
        )
      },
    },
    {
      title: '卖方',
      dataIndex: 'ownerName',
      key: 'ownerName',
      width: 140,
      render: (name: string, record: PurchaseOrder) => (
        <div>
          <div style={{ fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: '#bfbfbf' }}>{record.ownerType}</div>
        </div>
      ),
    },
    {
      title: '采购总价',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      align: 'right',
      sorter: (a: PurchaseOrder, b: PurchaseOrder) => a.totalPrice - b.totalPrice,
      render: (price: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E', fontSize: 14 }}>
          {price.toFixed(2)}
          <span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColorMap[status]} style={{ borderRadius: 4 }}>
          {statusTextMap[status] || status}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      sorter: (a: PurchaseOrder, b: PurchaseOrder) => a.createTime.localeCompare(b.createTime),
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: PurchaseOrder) => (
        <Space size={4}>
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pc/purchase/${record.id}`)} />
          </Tooltip>
          <Dropdown menu={{
            items: [
              { key: 'edit', label: '编辑', icon: <EditOutlined />, disabled: record.status === 'signed' },
              { key: 'contract', label: '查看合同', icon: <FileTextOutlined />, disabled: !record.contractNo },
              { type: 'divider' },
              { key: 'delete', label: '删除', icon: <DeleteOutlined />, danger: true, disabled: record.status === 'signed' },
            ],
          }} trigger={['click']}>
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">采购单总数</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">全部采购单</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">待查验</div>
          <div className="stat-value">{stats.pendingCheck}</div>
          <div className="stat-sub">需要查验确认</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">待签约</div>
          <div className="stat-value">{stats.pendingSign}</div>
          <div className="stat-sub">等待合同签署</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">已签约</div>
          <div className="stat-value">{stats.signed}</div>
          <div className="stat-sub">签约完成</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">采购总额</div>
          <div className="stat-value">{stats.totalAmount.toFixed(1)}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>万</span></div>
          <div className="stat-sub">累计采购金额</div>
        </div>
      </div>

      {/* 表格卡片 */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <CarOutlined />
            采购单列表
            <span className="count">{filteredData.length} 条</span>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#E8352E', borderColor: '#E8352E' }}
              onClick={() => window.open('/pc/purchase/create', '_blank')}>
              新建采购
            </Button>
          </Space>
        </div>

        {/* 筛选栏 */}
        <div className="filter-bar">
          <Input
            placeholder="搜索单号/车牌/VIN/卖方"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            placeholder="采购模式"
            value={modeFilter}
            onChange={setModeFilter}
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'single', label: '单车采购' },
              { value: 'batch', label: '批量采购' },
            ]}
          />
          <Select
            placeholder="状态"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'pending_check', label: '待查验' },
              { value: 'pending_sign', label: '待签约' },
              { value: 'signed', label: '签约完成' },
              { value: 'rejected', label: '不通过' },
              { value: 'cancelled', label: '已取消' },
            ]}
          />
          <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 240 }} />
        </div>

        {/* 表格 */}
        <div className="table-card-body">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            size="middle"
            scroll={{ x: 1200 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onDoubleClick: () => navigate(`/pc/purchase/${record.id}`),
            })}
          />
        </div>
      </div>
    </div>
  )
}
