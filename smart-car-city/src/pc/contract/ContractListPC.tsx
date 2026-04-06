import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, DatePicker, Space, Tooltip, Dropdown, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, ExportOutlined, ReloadOutlined,
  EyeOutlined, DownloadOutlined, MoreOutlined,
  FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined,
  PaperClipOutlined,
} from '@ant-design/icons'
import { mockContracts } from '../../shared/mock/contractMock'
import type { Contract } from '../../shared/types/Contract.types'

const { RangePicker } = DatePicker

const statusColorMap: Record<string, string> = {
  pending_sign: 'warning',
  signing: 'processing',
  signed: 'success',
  archived: 'default',
}
const statusTextMap: Record<string, string> = {
  pending_sign: '待签署',
  signing: '签署中',
  signed: '已签署',
  archived: '已归档',
}
const typeColorMap: Record<string, string> = {
  '采购合同': 'blue',
  '销售合同': 'green',
  '批售合同': 'orange',
}

export default function ContractListPC() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)

  const filteredData = useMemo(() => {
    return mockContracts.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false
      if (typeFilter && c.contractType !== typeFilter) return false
      if (searchText) {
        const s = searchText.toLowerCase()
        const match = c.id.toLowerCase().includes(s)
          || c.bizOrderId.toLowerCase().includes(s)
          || c.dealerCompany.includes(s)
          || c.parties.some((p) => p.name.includes(s))
          || c.vehicles.some((v) => v.plateNo.includes(s) || v.vin.toLowerCase().includes(s))
        if (!match) return false
      }
      return true
    })
  }, [searchText, statusFilter, typeFilter])

  const stats = useMemo(() => {
    const all = mockContracts
    return {
      total: all.length,
      pendingSign: all.filter((c) => c.status === 'pending_sign').length,
      signing: all.filter((c) => c.status === 'signing').length,
      signed: all.filter((c) => c.status === 'signed').length,
      archived: all.filter((c) => c.status === 'archived').length,
    }
  }, [])

  const columns: ColumnsType<Contract> = [
    {
      title: '合同号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
      render: (id: string) => (
        <a onClick={() => navigate(`/pc/contract/${id}`)} style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>
          {id}
        </a>
      ),
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      key: 'contractType',
      width: 100,
      render: (type: string) => <Tag color={typeColorMap[type]}>{type}</Tag>,
    },
    {
      title: '车辆信息',
      key: 'vehicle',
      width: 240,
      render: (_: unknown, record: Contract) => {
        const v = record.vehicles[0]
        return (
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>
              {v.plateNo}
              {record.vehicleCount > 1 && <span style={{ fontSize: 11, color: '#8c8c8c', marginLeft: 6 }}>等{record.vehicleCount}台</span>}
            </div>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{v.brandModel}</div>
          </div>
        )
      },
    },
    {
      title: '合同金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 110,
      align: 'right',
      sorter: (a: Contract, b: Contract) => a.totalAmount - b.totalAmount,
      render: (amount: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E', fontSize: 14 }}>
          {amount.toFixed(2)}<span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
        </span>
      ),
    },
    {
      title: '签署进度',
      key: 'signProgress',
      width: 140,
      render: (_: unknown, record: Contract) => {
        const signed = record.parties.filter((p) => p.signed).length
        const total = record.parties.length
        const pct = Math.round((signed / total) * 100)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Progress percent={pct} size="small" style={{ flex: 1, margin: 0 }}
              strokeColor={pct === 100 ? '#52c41a' : '#E8352E'}
              format={() => `${signed}/${total}`} />
          </div>
        )
      },
    },
    {
      title: '关联单号',
      dataIndex: 'bizOrderId',
      key: 'bizOrderId',
      width: 140,
      render: (id: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12, color: '#8c8c8c' }}>{id}</span>,
    },
    {
      title: '经销公司',
      dataIndex: 'dealerCompany',
      key: 'dealerCompany',
      width: 180,
      ellipsis: true,
      render: (name: string) => <span style={{ fontSize: 13 }}>{name}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
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
      width: 150,
      sorter: (a: Contract, b: Contract) => a.createTime.localeCompare(b.createTime),
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_: unknown, record: Contract) => (
        <Space size={4}>
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pc/contract/${record.id}`)} />
          </Tooltip>
          <Dropdown menu={{
            items: [
              { key: 'download', label: '下载合同', icon: <DownloadOutlined />, disabled: !record.hasAttachment },
              { key: 'preview', label: '预览合同', icon: <FileTextOutlined /> },
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
          <div className="stat-label">合同总数</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">全部合同</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">待签署</div>
          <div className="stat-value">{stats.pendingSign}</div>
          <div className="stat-sub">等待发起签署</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">签署中</div>
          <div className="stat-value">{stats.signing}</div>
          <div className="stat-sub">部分签署完成</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">已签署</div>
          <div className="stat-value">{stats.signed}</div>
          <div className="stat-sub">全部签署完成</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">已归档</div>
          <div className="stat-value">{stats.archived}</div>
          <div className="stat-sub">归档存储</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <FileTextOutlined />
            合同列表
            <span className="count">{filteredData.length} 条</span>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>

        <div className="filter-bar">
          <Input
            placeholder="搜索合同号/业务单号/车牌/签约方"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            placeholder="合同状态"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{ width: 130 }}
            options={Object.entries(statusTextMap).map(([value, label]) => ({ value, label }))}
          />
          <Select
            placeholder="合同类型"
            value={typeFilter}
            onChange={setTypeFilter}
            allowClear
            style={{ width: 130 }}
            options={[
              { value: '采购合同', label: '采购合同' },
              { value: '销售合同', label: '销售合同' },
              { value: '批售合同', label: '批售合同' },
            ]}
          />
          <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 240 }} />
        </div>

        <div className="table-card-body">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            size="middle"
            scroll={{ x: 1500 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onDoubleClick: () => navigate(`/pc/contract/${record.id}`),
            })}
          />
        </div>
      </div>
    </div>
  )
}
