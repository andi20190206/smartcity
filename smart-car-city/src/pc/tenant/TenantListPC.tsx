import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, Space, Tooltip, Tabs, Dropdown } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, PlusOutlined, ReloadOutlined, ExportOutlined,
  EyeOutlined, EditOutlined, StopOutlined, CheckCircleOutlined,
  MoreOutlined, BankOutlined, ShopOutlined, UserOutlined,
} from '@ant-design/icons'
import { mockCompanies, mockStores, mockDealers } from '../../shared/mock/tenantMock'
import { tenantStatusColorMap, tenantStatusTextMap } from '../../shared/constants/tenantStatusMap'
import type { DealerCompany, Store, Dealer } from '../../shared/types/Tenant.types'

export default function TenantListPC() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('company')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [companyFilter, setCompanyFilter] = useState<string | undefined>(undefined)

  // ===== 经销公司 =====
  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false
      if (searchText) {
        const s = searchText.toLowerCase()
        return c.name.toLowerCase().includes(s) || c.creditCode.includes(s) || c.contact.includes(s)
      }
      return true
    })
  }, [searchText, statusFilter])

  const companyStats = useMemo(() => ({
    total: mockCompanies.length,
    active: mockCompanies.filter((c) => c.status === 'active').length,
    pending: mockCompanies.filter((c) => c.status === 'pending').length,
    totalDealers: mockCompanies.reduce((s, c) => s + c.dealerCount, 0),
  }), [])

  const companyColumns: ColumnsType<DealerCompany> = [
    {
      title: '公司编号', dataIndex: 'id', key: 'id', width: 150, fixed: 'left',
      render: (id: string) => (
        <a onClick={() => navigate(`/pc/tenant/company/${id}`)} style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{id}</a>
      ),
    },
    { title: '公司名称', dataIndex: 'name', key: 'name', width: 260, render: (n: string) => <span style={{ fontWeight: 500 }}>{n}</span> },
    {
      title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200,
      render: (c: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{c}</span>,
    },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (p: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13 }}>{p}</span> },
    {
      title: '门店/车商', key: 'counts', width: 120, align: 'center',
      render: (_: unknown, r: DealerCompany) => (
        <span style={{ fontSize: 13 }}>
          <span style={{ color: '#1677ff' }}>{r.storeCount}</span>
          <span style={{ color: '#bfbfbf', margin: '0 4px' }}>/</span>
          <span style={{ color: '#52c41a' }}>{r.dealerCount}</span>
        </span>
      ),
    },
    {
      title: '钱包账户', dataIndex: 'walletAccount', key: 'walletAccount', width: 140,
      render: (w: string) => w ? <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{w}</span> : <span style={{ color: '#bfbfbf' }}>未开通</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => <Tag color={tenantStatusColorMap[s]} style={{ borderRadius: 4 }}>{tenantStatusTextMap[s]}</Tag>,
    },
    {
      title: '入驻时间', dataIndex: 'createTime', key: 'createTime', width: 160,
      sorter: (a: DealerCompany, b: DealerCompany) => a.createTime.localeCompare(b.createTime),
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作', key: 'action', width: 120, fixed: 'right',
      render: (_: unknown, record: DealerCompany) => (
        <Space size={4}>
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pc/tenant/company/${record.id}`)} />
          </Tooltip>
          <Dropdown menu={{
            items: [
              { key: 'edit', label: '编辑', icon: <EditOutlined /> },
              ...(record.status === 'active' ? [{ key: 'suspend', label: '停用', icon: <StopOutlined />, danger: true }] : []),
              ...(record.status === 'suspended' ? [{ key: 'enable', label: '启用', icon: <CheckCircleOutlined /> }] : []),
              ...(record.status === 'pending' ? [
                { key: 'approve', label: '审核通过', icon: <CheckCircleOutlined /> },
                { key: 'reject', label: '驳回', icon: <StopOutlined />, danger: true },
              ] : []),
            ],
          }} trigger={['click']}>
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  // ===== 门店 =====
  const filteredStores = useMemo(() => {
    return mockStores.filter((s) => {
      if (companyFilter && s.companyId !== companyFilter) return false
      if (searchText) {
        const q = searchText.toLowerCase()
        return s.name.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q) || s.contact.includes(q)
      }
      return true
    })
  }, [searchText, companyFilter])

  const storeColumns: ColumnsType<Store> = [
    { title: '门店编号', dataIndex: 'id', key: 'id', width: 100, render: (id: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{id}</span> },
    { title: '门店名称', dataIndex: 'name', key: 'name', width: 160, render: (n: string) => <span style={{ fontWeight: 500 }}>{n}</span> },
    { title: '所属经销公司', dataIndex: 'companyName', key: 'companyName', width: 260 },
    { title: '门店地址', dataIndex: 'address', key: 'address', width: 300, ellipsis: true },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (p: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13 }}>{p}</span> },
    { title: '关联仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '车商数', dataIndex: 'dealerCount', key: 'dealerCount', width: 80, align: 'center', render: (n: number) => <span style={{ color: '#52c41a', fontWeight: 600 }}>{n}</span> },
    {
      title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
  ]

  // ===== 车商 =====
  const filteredDealers = useMemo(() => {
    return mockDealers.filter((d) => {
      if (statusFilter && d.status !== statusFilter) return false
      if (companyFilter && d.companyId !== companyFilter) return false
      if (searchText) {
        const q = searchText.toLowerCase()
        return d.name.toLowerCase().includes(q) || d.contact.includes(q) || d.phone.includes(q)
      }
      return true
    })
  }, [searchText, statusFilter, companyFilter])

  const dealerColumns: ColumnsType<Dealer> = [
    { title: '车商编号', dataIndex: 'id', key: 'id', width: 100, render: (id: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{id}</span> },
    { title: '车商名称', dataIndex: 'name', key: 'name', width: 150, render: (n: string) => <span style={{ fontWeight: 500 }}>{n}</span> },
    { title: '所属经销公司', dataIndex: 'companyName', key: 'companyName', width: 220 },
    { title: '所属门店', dataIndex: 'storeName', key: 'storeName', width: 120 },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 90 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (p: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13 }}>{p}</span> },
    {
      title: '合作款余额(万)', dataIndex: 'depositBalance', key: 'depositBalance', width: 120, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: v > 0 ? '#52c41a' : '#bfbfbf' }}>{v.toFixed(1)}</span>,
    },
    {
      title: '额度信息', key: 'quota', width: 200,
      render: (_: unknown, r: Dealer) => (
        <div style={{ fontSize: 12 }}>
          <span>最大 <b style={{ color: '#1a1a2e' }}>{r.maxQuota}</b></span>
          <span style={{ color: '#bfbfbf', margin: '0 6px' }}>|</span>
          <span>可用 <b style={{ color: '#52c41a' }}>{r.availableQuota}</b></span>
          <span style={{ color: '#bfbfbf', margin: '0 6px' }}>|</span>
          <span>可申请 <b style={{ color: '#1677ff' }}>{r.applyQuota}</b></span>
        </div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => <Tag color={tenantStatusColorMap[s]} style={{ borderRadius: 4 }}>{tenantStatusTextMap[s]}</Tag>,
    },
    {
      title: '挂靠时间', dataIndex: 'createTime', key: 'createTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
  ]

  // 重置筛选
  const resetFilters = () => { setSearchText(''); setStatusFilter(undefined); setCompanyFilter(undefined) }

  const companyOptions = mockCompanies.filter((c) => c.status === 'active').map((c) => ({ value: c.id, label: c.name }))

  return (
    <div>
      {/* 统计卡片 */}
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">经销公司</div>
          <div className="stat-value">{companyStats.total}</div>
          <div className="stat-sub">入驻公司总数</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">已启用</div>
          <div className="stat-value">{companyStats.active}</div>
          <div className="stat-sub">正常运营中</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">待审核</div>
          <div className="stat-value">{companyStats.pending}</div>
          <div className="stat-sub">等待审核入驻</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">车商总数</div>
          <div className="stat-value">{companyStats.totalDealers}</div>
          <div className="stat-sub">全平台车商</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">门店总数</div>
          <div className="stat-value">{mockStores.length}</div>
          <div className="stat-sub">全平台门店</div>
        </div>
      </div>

      {/* 表格卡片 */}
      <div className="table-card">
        <Tabs
          activeKey={activeTab}
          onChange={(k) => { setActiveTab(k); resetFilters() }}
          style={{ padding: '0 20px' }}
          items={[
            {
              key: 'company',
              label: <span><BankOutlined /> 经销公司 ({mockCompanies.length})</span>,
              children: (
                <div>
                  <div className="table-card-header" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <div className="filter-bar" style={{ flex: 1, margin: 0 }}>
                      <Input placeholder="搜索公司名称/信用代码/联系人" prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 280 }} allowClear />
                      <Select placeholder="状态" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 120 }} options={[
                        { value: 'active', label: '已启用' }, { value: 'pending', label: '待审核' },
                        { value: 'suspended', label: '已停用' }, { value: 'rejected', label: '已驳回' },
                      ]} />
                    </div>
                    <Space>
                      <Button icon={<ReloadOutlined />} onClick={resetFilters}>重置</Button>
                      <Button icon={<ExportOutlined />}>导出</Button>
                      <Button type="primary" icon={<PlusOutlined />} style={{ background: '#E8352E', borderColor: '#E8352E' }}>新增经销公司</Button>
                    </Space>
                  </div>
                  <div className="table-card-body">
                    <Table columns={companyColumns} dataSource={filteredCompanies} rowKey="id" size="middle" scroll={{ x: 1500 }}
                      pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` }}
                      onRow={(record) => ({ style: { cursor: 'pointer' }, onDoubleClick: () => navigate(`/pc/tenant/company/${record.id}`) })}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'store',
              label: <span><ShopOutlined /> 门店管理 ({mockStores.length})</span>,
              children: (
                <div>
                  <div className="table-card-header" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <div className="filter-bar" style={{ flex: 1, margin: 0 }}>
                      <Input placeholder="搜索门店名称/联系人" prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 260 }} allowClear />
                      <Select placeholder="所属经销公司" value={companyFilter} onChange={setCompanyFilter} allowClear style={{ width: 260 }} options={companyOptions} />
                    </div>
                    <Space>
                      <Button icon={<ReloadOutlined />} onClick={resetFilters}>重置</Button>
                      <Button type="primary" icon={<PlusOutlined />} style={{ background: '#E8352E', borderColor: '#E8352E' }}>新增门店</Button>
                    </Space>
                  </div>
                  <div className="table-card-body">
                    <Table columns={storeColumns} dataSource={filteredStores} rowKey="id" size="middle" scroll={{ x: 1300 }}
                      pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` }}
                    />
                  </div>
                </div>
              ),
            },
            {
              key: 'dealer',
              label: <span><UserOutlined /> 车商管理 ({mockDealers.length})</span>,
              children: (
                <div>
                  <div className="table-card-header" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <div className="filter-bar" style={{ flex: 1, margin: 0 }}>
                      <Input placeholder="搜索车商名称/联系人/电话" prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 260 }} allowClear />
                      <Select placeholder="所属经销公司" value={companyFilter} onChange={setCompanyFilter} allowClear style={{ width: 260 }} options={companyOptions} />
                      <Select placeholder="状态" value={statusFilter} onChange={setStatusFilter} allowClear style={{ width: 120 }} options={[
                        { value: 'active', label: '已启用' }, { value: 'pending', label: '待审核' },
                        { value: 'suspended', label: '已停用' }, { value: 'rejected', label: '已驳回' },
                      ]} />
                    </div>
                    <Space>
                      <Button icon={<ReloadOutlined />} onClick={resetFilters}>重置</Button>
                      <Button icon={<ExportOutlined />}>导出</Button>
                      <Button type="primary" icon={<PlusOutlined />} style={{ background: '#E8352E', borderColor: '#E8352E' }}>新增车商</Button>
                    </Space>
                  </div>
                  <div className="table-card-body">
                    <Table columns={dealerColumns} dataSource={filteredDealers} rowKey="id" size="middle" scroll={{ x: 1500 }}
                      pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` }}
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
