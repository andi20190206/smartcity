import { useState, useMemo } from 'react'
import { Table, Tag, Input, Select, Button, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons'
import { mockSupervisedVehicles } from '../../shared/mock/inventoryMock'
import type { SupervisedVehicle } from '../../shared/types/Inventory.types'

export default function RegistrationListPC() {
  const [searchText, setSearchText] = useState('')
  const [regFilter, setRegFilter] = useState<string | undefined>()
  const [loanFilter, setLoanFilter] = useState<string | undefined>()

  const registrationVehicles = useMemo(() => {
    return mockSupervisedVehicles.filter((v) => v.source === '库存金融')
  }, [])

  const filteredData = useMemo(() => {
    let list = registrationVehicles
    if (regFilter) list = list.filter((v) => v.registrationStatus === regFilter)
    if (loanFilter) list = list.filter((v) => v.loanStatus === loanFilter)
    if (searchText) {
      const s = searchText.toLowerCase()
      list = list.filter((v) =>
        v.plateNo.includes(s) || v.vin.toLowerCase().includes(s) || v.brandModel.includes(s) ||
        v.companyName.includes(s) || v.storeName.includes(s)
      )
    }
    return list
  }, [searchText, regFilter, loanFilter, registrationVehicles])

  const stats = useMemo(() => ({
    total: registrationVehicles.length,
    pending: registrationVehicles.filter((v) => v.registrationStatus === 'pending').length,
    registered: registrationVehicles.filter((v) => v.registrationStatus === 'registered').length,
    loaned: registrationVehicles.filter((v) => v.loanStatus === '已垫款').length,
  }), [registrationVehicles])

  const columns: ColumnsType<SupervisedVehicle> = [
    {
      title: 'VIN码', dataIndex: 'vin', key: 'vin', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v}</span>,
    },
    { title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 110, render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: '品牌车系', dataIndex: 'brandModel', key: 'brandModel', width: 220 },
    { title: '所属门店', dataIndex: 'storeName', key: 'storeName', width: 110 },
    { title: '经销公司', dataIndex: 'companyName', key: 'companyName', width: 180 },
    { title: '签约时间', dataIndex: 'signTime', key: 'signTime', width: 110, render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t || '-'}</span> },
    { title: '业务员', dataIndex: 'salesperson', key: 'salesperson', width: 80 },
    {
      title: '垫款状态', dataIndex: 'loanStatus', key: 'loanStatus', width: 90,
      render: (v: string) => <Tag color={v === '已垫款' ? 'green' : 'default'} style={{ borderRadius: 4 }}>{v || '-'}</Tag>,
    },
    { title: '旧车主', dataIndex: 'oldOwner', key: 'oldOwner', width: 140, render: (v: string) => <span>{v || '-'}</span> },
    {
      title: '签注状态', dataIndex: 'registrationStatus', key: 'registrationStatus', width: 90,
      render: (_: unknown, r: SupervisedVehicle) => (
        <Tag color={r.registrationStatus === 'registered' ? 'green' : 'warning'} style={{ borderRadius: 4 }}>
          {r.registrationStatusText || '-'}
        </Tag>
      ),
    },
    {
      title: '签注时间', dataIndex: 'registrationTime', key: 'registrationTime', width: 110,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t || '-'}</span>,
    },
    {
      title: '操作', key: 'action', width: 120, fixed: 'right',
      render: (_: unknown, r: SupervisedVehicle) => (
        <Space>
          {r.registrationStatus === 'pending' && (
            <Button type="link" size="small">确认签注</Button>
          )}
          <Button type="text" size="small">备注</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">签注车辆</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">库存金融车辆</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">待签注</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-sub">等待确认签注</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">已签注</div>
          <div className="stat-value">{stats.registered}</div>
          <div className="stat-sub">签注完成</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">已垫款</div>
          <div className="stat-value">{stats.loaned}</div>
          <div className="stat-sub">垫款已发放</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="title">签注管理</div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>
        <div className="filter-bar">
          <Input
            placeholder="搜索车牌/VIN/品牌/公司/门店"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText} onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }} allowClear
          />
          <Select placeholder="签注状态" allowClear style={{ width: 120 }}
            value={regFilter} onChange={setRegFilter}
            options={[
              { value: 'pending', label: '待签注' },
              { value: 'registered', label: '已签注' },
            ]}
          />
          <Select placeholder="垫款状态" allowClear style={{ width: 120 }}
            value={loanFilter} onChange={setLoanFilter}
            options={[
              { value: '待垫款', label: '待垫款' },
              { value: '已垫款', label: '已垫款' },
            ]}
          />
        </div>
        <div className="table-card-body">
          <Table columns={columns} dataSource={filteredData} rowKey="id" size="middle"
            scroll={{ x: 1600 }}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
          />
        </div>
      </div>
    </div>
  )
}
