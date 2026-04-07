import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, DatePicker, Space, Tooltip, Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, ExportOutlined, ReloadOutlined,
  EyeOutlined, DownloadOutlined, MoreOutlined,
  FileTextOutlined, AuditOutlined,
} from '@ant-design/icons'
import { mockContracts } from '../../shared/mock/contractMock'
import type { Contract } from '../../shared/types/Contract.types'

const { RangePicker } = DatePicker

const approvalStatusColorMap: Record<string, string> = {
  '审批中': 'processing',
  '通过/不通过': 'success',
  '待审批': 'warning',
}

export default function ContractListPC() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)

  const filteredData = useMemo(() => {
    return mockContracts.filter((c) => {
      if (typeFilter && c.contractType !== typeFilter) return false
      if (statusFilter && c.approvalStatus !== statusFilter && c.status !== statusFilter) return false
      if (searchText) {
        const s = searchText.toLowerCase()
        return c.id.toLowerCase().includes(s)
          || c.bizOrderId.toLowerCase().includes(s)
          || c.dealerCompany.includes(s)
          || (c.applicant || '').includes(s)
          || (c.storeName || '').includes(s)
          || c.vehicles.some((v) => v.plateNo.includes(s) || v.vin.toLowerCase().includes(s))
      }
      return true
    })
  }, [searchText, statusFilter, typeFilter])

  const stats = useMemo(() => {
    const all = mockContracts
    return {
      total: all.length,
      purchase: all.filter((c) => c.contractType === '采购合同').length,
      sales: all.filter((c) => c.contractType === '销售合同').length,
      approving: all.filter((c) => c.approvalStatus === '审批中').length,
      pending: all.filter((c) => c.approvalStatus === '待审批').length,
    }
  }, [])

  const columns: ColumnsType<Contract> = [
    {
      title: '合同单号', dataIndex: 'id', key: 'id', width: 170, fixed: 'left',
      render: (id: string) => (
        <a onClick={() => navigate(`/pc/contract/${id}`)} style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{id}</a>
      ),
    },
    {
      title: '合同类型', dataIndex: 'contractType', key: 'contractType', width: 100,
      render: (type: string) => <Tag color={type === '采购合同' ? 'blue' : type === '销售合同' ? 'green' : 'orange'}>{type}</Tag>,
    },
    {
      title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 90,
      render: (v: string) => <span>{v || '-'}</span>,
    },
    {
      title: '门店', dataIndex: 'storeName', key: 'storeName', width: 140,
      render: (v: string) => <span style={{ fontSize: 13 }}>{v || '-'}</span>,
    },
    {
      title: '集团', dataIndex: 'groupName', key: 'groupName', width: 140,
      render: (v: string) => <span style={{ fontSize: 13 }}>{v || '-'}</span>,
    },
    {
      title: '数量(台)', dataIndex: 'vehicleCount', key: 'vehicleCount', width: 80, align: 'center',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{v}</span>,
    },
    {
      title: '采购价(万元)', dataIndex: 'totalAmount', key: 'totalAmount', width: 120, align: 'right',
      sorter: (a: Contract, b: Contract) => a.totalAmount - b.totalAmount,
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{v.toFixed(1)}</span>
      ),
    },
    {
      title: '申请时间', dataIndex: 'createTime', key: 'createTime', width: 160,
      sorter: (a: Contract, b: Contract) => a.createTime.localeCompare(b.createTime),
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '审批状态', dataIndex: 'approvalStatus', key: 'approvalStatus', width: 110,
      render: (v: string) => v ? <Tag color={approvalStatusColorMap[v]}>{v}</Tag> : <span style={{ color: '#bfbfbf' }}>-</span>,
    },
    {
      title: '审批节点', dataIndex: 'approvalNode', key: 'approvalNode', width: 120,
      render: (v: string) => <span style={{ fontSize: 13, color: '#595959' }}>{v || '-'}</span>,
    },
    {
      title: '审批人', dataIndex: 'approver', key: 'approver', width: 90,
      render: (v: string) => <span>{v || '-'}</span>,
    },
    {
      title: '操作', key: 'action', width: 140, fixed: 'right',
      render: (_: unknown, record: Contract) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => navigate(`/pc/contract/${record.id}`)}>查看详情</Button>
          {record.approvalStatus === '审批中' || record.approvalStatus === '待审批' ? (
            <Button type="link" size="small" style={{ color: '#E8352E' }}>审批</Button>
          ) : null}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">合同总数</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">全部合同</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">采购合同</div>
          <div className="stat-value">{stats.purchase}</div>
          <div className="stat-sub">采购类合同</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">销售合同</div>
          <div className="stat-value">{stats.sales}</div>
          <div className="stat-sub">销售类合同</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">审批中</div>
          <div className="stat-value">{stats.approving}</div>
          <div className="stat-sub">等待审批</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">待审批</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-sub">尚未发起</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="title"><FileTextOutlined /> 合同列表 <span className="count">{filteredData.length} 条</span></div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>
        <div className="filter-bar">
          <Input placeholder="搜索合同号/业务单号/申请人/门店/车牌" prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 300 }} allowClear />
          <Select placeholder="合同类型" value={typeFilter} onChange={setTypeFilter} allowClear style={{ width: 130 }}
            options={[{ value: '采购合同', label: '采购合同' }, { value: '销售合同', label: '销售合同' }, { value: '批售合同', label: '批售合同' }]} />
          <Select placeholder="审批状态" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 130 }}
            options={[{ value: '审批中', label: '审批中' }, { value: '通过/不通过', label: '通过/不通过' }, { value: '待审批', label: '待审批' }]} />
          <RangePicker placeholder={['开始日期', '结束日期']} style={{ width: 240 }} />
        </div>
        <div className="table-card-body">
          <Table columns={columns} dataSource={filteredData} rowKey="id" size="middle" scroll={{ x: 1600 }}
            pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` }}
            onRow={(record) => ({ style: { cursor: 'pointer' }, onDoubleClick: () => navigate(`/pc/contract/${record.id}`) })}
          />
        </div>
      </div>
    </div>
  )
}
