import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, DatePicker, Space, Tooltip, Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, PlusOutlined, ExportOutlined, ReloadOutlined,
  EyeOutlined, EditOutlined, DeleteOutlined, MoreOutlined,
  ShoppingCartOutlined, FileTextOutlined, ArrowUpOutlined, ArrowDownOutlined,
} from '@ant-design/icons'
import { mockSalesOrders } from '../../shared/mock/salesMock'
import type { SalesOrder } from '../../shared/types/Sales.types'

const { RangePicker } = DatePicker

const statusColorMap: Record<string, string> = {
  draft: 'default',
  pending_approval: 'processing',
  approving: 'processing',
  approved: 'success',
  pending_payment: 'warning',
  paid: 'cyan',
  clearing: 'geekblue',
  completed: 'success',
  rejected: 'error',
}

const statusTextMap: Record<string, string> = {
  draft: '草稿',
  pending_approval: '待审批',
  approving: '审批中',
  approved: '审批通过',
  pending_payment: '待付款',
  paid: '已付款',
  clearing: '清分中',
  completed: '已完成',
  rejected: '已驳回',
}

export default function SalesListPC() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  const filteredData = useMemo(() => {
    return mockSalesOrders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false
      if (searchText) {
        const s = searchText.toLowerCase()
        const match = o.id.toLowerCase().includes(s)
          || o.buyerName.toLowerCase().includes(s)
          || o.vehicles.some((v) => v.plateNo.includes(s) || v.vin.toLowerCase().includes(s))
        if (!match) return false
      }
      return true
    })
  }, [searchText, statusFilter])

  const stats = useMemo(() => {
    const all = mockSalesOrders
    return {
      total: all.length,
      pendingApproval: all.filter((o) => o.status === 'pending_approval' || o.status === 'approving').length,
      pendingPayment: all.filter((o) => o.status === 'approved' || o.status === 'pending_payment').length,
      completed: all.filter((o) => o.status === 'completed' || o.status === 'paid').length,
      totalAmount: all.reduce((s, o) => s + o.totalSalesPrice, 0),
    }
  }, [])

  const columns: ColumnsType<SalesOrder> = [
    {
      title: '销售单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
      render: (id: string) => (
        <a onClick={() => navigate(`/pc/sales/${id}`)} style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>
          {id}
        </a>
      ),
    },
    {
      title: '车辆信息',
      key: 'vehicle',
      width: 260,
      render: (_: unknown, record: SalesOrder) => {
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
      title: '买家',
      dataIndex: 'buyerName',
      key: 'buyerName',
      width: 160,
      render: (name: string, record: SalesOrder) => (
        <div>
          <div style={{ fontSize: 13 }}>{name || '-'}</div>
          <div style={{ fontSize: 11, color: '#bfbfbf' }}>{record.buyerType}</div>
        </div>
      ),
    },
    {
      title: '采购合同价',
      dataIndex: 'totalContractPrice',
      key: 'totalContractPrice',
      width: 110,
      align: 'right',
      render: (price: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13, color: '#8c8c8c' }}>
          {price.toFixed(2)}<span style={{ fontSize: 11, marginLeft: 2 }}>万</span>
        </span>
      ),
    },
    {
      title: '销售总价',
      dataIndex: 'totalSalesPrice',
      key: 'totalSalesPrice',
      width: 110,
      align: 'right',
      sorter: (a: SalesOrder, b: SalesOrder) => a.totalSalesPrice - b.totalSalesPrice,
      render: (price: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E', fontSize: 14 }}>
          {price.toFixed(2)}<span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
        </span>
      ),
    },
    {
      title: '盈亏',
      dataIndex: 'totalProfitLoss',
      key: 'totalProfitLoss',
      width: 100,
      align: 'right',
      sorter: (a: SalesOrder, b: SalesOrder) => a.totalProfitLoss - b.totalProfitLoss,
      render: (val: number) => (
        <span style={{
          fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13,
          color: val >= 0 ? '#52c41a' : '#ff4d4f',
          display: 'inline-flex', alignItems: 'center', gap: 2,
        }}>
          {val >= 0 ? <ArrowUpOutlined style={{ fontSize: 10 }} /> : <ArrowDownOutlined style={{ fontSize: 10 }} />}
          {val >= 0 ? '+' : ''}{val.toFixed(2)}万
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
      title: '销售顾问',
      dataIndex: 'salesAdvisor',
      key: 'salesAdvisor',
      width: 90,
      render: (name: string) => <span style={{ fontSize: 13 }}>{name}</span>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      sorter: (a: SalesOrder, b: SalesOrder) => a.createTime.localeCompare(b.createTime),
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: SalesOrder) => (
        <Space size={4}>
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pc/sales/${record.id}`)} />
          </Tooltip>
          <Dropdown menu={{
            items: [
              { key: 'edit', label: '编辑', icon: <EditOutlined />, disabled: !['draft', 'rejected'].includes(record.status) },
              { key: 'contract', label: '查看合同', icon: <FileTextOutlined />, disabled: !['approved', 'pending_payment', 'paid', 'completed'].includes(record.status) },
              { type: 'divider' },
              { key: 'delete', label: '删除', icon: <DeleteOutlined />, danger: true, disabled: record.status !== 'draft' },
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
      {/* Stats */}
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">销售单总数</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">全部销售单</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">待审批</div>
          <div className="stat-value">{stats.pendingApproval}</div>
          <div className="stat-sub">等待审批处理</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">待付款</div>
          <div className="stat-value">{stats.pendingPayment}</div>
          <div className="stat-sub">等待买家付款</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">已完成</div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-sub">交易完成</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">销售总额</div>
          <div className="stat-value">{stats.totalAmount.toFixed(1)}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>万</span></div>
          <div className="stat-sub">累计销售金额</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <ShoppingCartOutlined />
            销售单列表
            <span className="count">{filteredData.length} 条</span>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} style={{ background: '#E8352E', borderColor: '#E8352E' }}
              onClick={() => navigate('/pc/sales/create')}>
              新建销售
            </Button>
          </Space>
        </div>

        <div className="filter-bar">
          <Input
            placeholder="搜索单号/车牌/VIN/买家"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Select
            placeholder="状态"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 140 }}
            options={Object.entries(statusTextMap).map(([value, label]) => ({ value, label }))}
          />
          <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 240 }} />
        </div>

        <div className="table-card-body">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            size="middle"
            scroll={{ x: 1400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onDoubleClick: () => navigate(`/pc/sales/${record.id}`),
            })}
          />
        </div>
      </div>
    </div>
  )
}
