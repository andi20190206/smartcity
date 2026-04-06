import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, DatePicker, Space, Tooltip, Badge } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, ExportOutlined, ReloadOutlined,
  EyeOutlined, ArrowUpOutlined, ArrowDownOutlined,
  FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined,
  SyncOutlined, ClockCircleOutlined,
} from '@ant-design/icons'
import { mockSettlementOrders } from '../../shared/mock/settlementMock'
import type { SettlementOrder } from '../../shared/types/Settlement.types'

const { RangePicker } = DatePicker

const statusColorMap: Record<string, string> = {
  pending: 'warning',
  processing: 'processing',
  completed: 'success',
  failed: 'error',
}

const statusTextMap: Record<string, string> = {
  pending: '待清分',
  processing: '清分中',
  completed: '清分完成',
  failed: '清分失败',
}

const statusIconMap: Record<string, React.ReactNode> = {
  pending: <ClockCircleOutlined />,
  processing: <SyncOutlined spin />,
  completed: <CheckCircleOutlined />,
  failed: <CloseCircleOutlined />,
}

export default function SettlementListPC() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  const filteredData = useMemo(() => {
    return mockSettlementOrders.filter((o) => {
      if (statusFilter && o.status !== statusFilter) return false
      if (searchText) {
        const s = searchText.toLowerCase()
        const match = o.id.toLowerCase().includes(s)
          || o.salesOrderId.toLowerCase().includes(s)
          || o.dealerName.toLowerCase().includes(s)
          || o.companyName.toLowerCase().includes(s)
          || o.vehicles.some((v) => v.plateNo.includes(s) || v.vin.toLowerCase().includes(s))
        if (!match) return false
      }
      return true
    })
  }, [searchText, statusFilter])

  const stats = useMemo(() => {
    const all = mockSettlementOrders
    return {
      total: all.length,
      pending: all.filter((o) => o.status === 'pending').length,
      processing: all.filter((o) => o.status === 'processing').length,
      completed: all.filter((o) => o.status === 'completed').length,
      failed: all.filter((o) => o.status === 'failed').length,
      totalAmount: all.filter((o) => o.status === 'completed').reduce((s, o) => s + o.totalSalesAmount, 0),
    }
  }, [])

  const columns: ColumnsType<SettlementOrder> = [
    {
      title: '清分单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
      render: (id: string) => (
        <a onClick={() => navigate(`/pc/settlement/${id}`)} style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>
          {id}
        </a>
      ),
    },
    {
      title: '关联销售单',
      dataIndex: 'salesOrderId',
      key: 'salesOrderId',
      width: 150,
      render: (id: string) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12, color: '#8c8c8c' }}>{id}</span>
      ),
    },
    {
      title: '车辆信息',
      key: 'vehicle',
      width: 240,
      render: (_: unknown, record: SettlementOrder) => {
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
      title: '销售总额(万)',
      dataIndex: 'totalSalesAmount',
      key: 'totalSalesAmount',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.totalSalesAmount - b.totalSalesAmount,
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E', fontSize: 14 }}>
          {v.toFixed(2)}
        </span>
      ),
    },
    {
      title: '服务费(万)',
      dataIndex: 'totalServiceFee',
      key: 'totalServiceFee',
      width: 100,
      align: 'right',
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13, color: '#8c8c8c' }}>{v.toFixed(2)}</span>
      ),
    },
    {
      title: '佣金(万)',
      dataIndex: 'totalCommission',
      key: 'totalCommission',
      width: 100,
      align: 'right',
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13, color: '#8c8c8c' }}>{v.toFixed(2)}</span>
      ),
    },
    {
      title: '经销公司车款(万)',
      dataIndex: 'totalCompanyPayment',
      key: 'totalCompanyPayment',
      width: 140,
      align: 'right',
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13, fontWeight: 500 }}>{v.toFixed(2)}</span>
      ),
    },
    {
      title: '盈亏(万)',
      dataIndex: 'totalProfitLoss',
      key: 'totalProfitLoss',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.totalProfitLoss - b.totalProfitLoss,
      render: (val: number) => (
        <span style={{
          fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13,
          color: val >= 0 ? '#52c41a' : '#ff4d4f',
          display: 'inline-flex', alignItems: 'center', gap: 2,
        }}>
          {val >= 0 ? <ArrowUpOutlined style={{ fontSize: 10 }} /> : <ArrowDownOutlined style={{ fontSize: 10 }} />}
          {val >= 0 ? '+' : ''}{val.toFixed(2)}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <Tag icon={statusIconMap[status]} color={statusColorMap[status]} style={{ borderRadius: 4 }}>
          {statusTextMap[status] || status}
        </Tag>
      ),
    },
    {
      title: '四路到账',
      key: 'fourWay',
      width: 130,
      render: (_: unknown, record: SettlementOrder) => {
        const fw = record.fourWayStatus
        const items = [
          { label: '平台', status: fw.platformFee },
          { label: '车商', status: fw.dealerCommission },
          { label: '经销', status: fw.companyPayment },
        ]
        if (fw.bankInterest !== 'none') items.push({ label: '银行', status: fw.bankInterest })
        return (
          <div style={{ display: 'flex', gap: 4 }}>
            {items.map((item) => (
              <Tooltip key={item.label} title={`${item.label}: ${item.status === 'success' ? '已到账' : item.status === 'failed' ? '失败' : '待到账'}`}>
                <Badge
                  status={item.status === 'success' ? 'success' : item.status === 'failed' ? 'error' : 'default'}
                  text={<span style={{ fontSize: 11 }}>{item.label}</span>}
                />
              </Tooltip>
            ))}
          </div>
        )
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      sorter: (a, b) => a.createTime.localeCompare(b.createTime),
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_: unknown, record: SettlementOrder) => (
        <Tooltip title="查看详情">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pc/settlement/${record.id}`)} />
        </Tooltip>
      ),
    },
  ]

  return (
    <div>
      {/* Stats */}
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">清分单总数</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">全部清分单</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">待清分</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-sub">等待系统执行</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">清分中</div>
          <div className="stat-value">{stats.processing}</div>
          <div className="stat-sub">正在执行清分</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">已完成</div>
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-sub">四路到账完成</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">已清分总额</div>
          <div className="stat-value">{stats.totalAmount.toFixed(1)}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>万</span></div>
          <div className="stat-sub">累计清分金额</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <FileTextOutlined />
            清分结算列表
            <span className="count">{filteredData.length} 条</span>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>

        <div className="filter-bar">
          <Input
            placeholder="搜索单号/销售单号/车牌/VIN/车商"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="清分状态"
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
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onDoubleClick: () => navigate(`/pc/settlement/${record.id}`),
            })}
          />
        </div>
      </div>
    </div>
  )
}
