import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, Space, Tooltip, Tabs, Badge } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, ReloadOutlined, ExportOutlined, EyeOutlined,
  WarningOutlined, ImportOutlined,
} from '@ant-design/icons'
import {
  mockSupervisedVehicles, mockAlertRecords, mockVehicleUseRecords, mockInventoryChecks,
} from '../../shared/mock/inventoryMock'
import type {
  SupervisedVehicle, AlertRecord, VehicleUseRecord, InventoryCheckRecord,
} from '../../shared/types/Inventory.types'

const stockStatusColorMap: Record<string, string> = {
  pending_in: 'warning', in_stock: 'success', out_stock: 'processing', transferred: 'default',
}
const supervisionStatusColorMap: Record<string, string> = {
  pending: 'warning', supervising: 'success', released: 'default',
}
const alertLevelColorMap: Record<string, string> = {
  high: 'error', medium: 'warning', low: 'processing',
}
const alertStatusColorMap: Record<string, string> = {
  alerting: 'error', processing: 'warning', ended: 'default',
}

export default function InventoryListPC() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('vehicles')
  const [searchText, setSearchText] = useState('')
  const [stockFilter, setStockFilter] = useState<string | undefined>()
  const [supervisionFilter, setSupervisionFilter] = useState<string | undefined>()

  const stats = useMemo(() => {
    const total = mockSupervisedVehicles.length
    const inStock = mockSupervisedVehicles.filter((v) => v.stockStatus === 'in_stock').length
    const supervising = mockSupervisedVehicles.filter((v) => v.supervisionStatus === 'supervising').length
    const alerting = mockAlertRecords.filter((a) => a.alertStatus === 'alerting').length
    const overAge = mockSupervisedVehicles.filter((v) => v.stockDays >= 60).length
    return { total, inStock, supervising, alerting, overAge }
  }, [])

  const filteredVehicles = useMemo(() => {
    let list = mockSupervisedVehicles
    if (stockFilter) list = list.filter((v) => v.stockStatus === stockFilter)
    if (supervisionFilter) list = list.filter((v) => v.supervisionStatus === supervisionFilter)
    if (searchText) {
      const s = searchText.toLowerCase()
      list = list.filter((v) =>
        v.plateNo.includes(s) || v.vin.toLowerCase().includes(s) || v.brandModel.includes(s) ||
        v.salesperson.includes(s) || v.companyName.includes(s)
      )
    }
    return list
  }, [searchText, stockFilter, supervisionFilter])

  const vehicleColumns: ColumnsType<SupervisedVehicle> = [
    {
      title: '车牌号码', dataIndex: 'plateNo', key: 'plateNo', width: 120, fixed: 'left',
      render: (v: string, r: SupervisedVehicle) => (
        <a onClick={() => navigate(`/pc/inventory/${r.id}`)} style={{ fontWeight: 600, fontSize: 13 }}>
          {v}
          {r.isScrapped && <Tag color="error" style={{ marginLeft: 4, fontSize: 10, lineHeight: '16px' }}>报废</Tag>}
        </a>
      ),
    },
    {
      title: 'VIN码', dataIndex: 'vin', key: 'vin', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12, color: '#8c8c8c' }}>{v}</span>,
    },
    {
      title: '品牌车系', dataIndex: 'brandModel', key: 'brandModel', width: 220,
      render: (v: string) => <span style={{ fontSize: 13 }}>{v}</span>,
    },
    {
      title: '归属门店', dataIndex: 'storeName', key: 'storeName', width: 110,
    },
    {
      title: '业务员', key: 'salesperson', width: 100,
      render: (_: unknown, r: SupervisedVehicle) => (
        <div>
          <div style={{ fontSize: 13 }}>{r.salesperson}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.salespersonPhone}</div>
        </div>
      ),
    },
    {
      title: '所在仓库', dataIndex: 'warehouse', key: 'warehouse', width: 110,
    },
    {
      title: '库存状态', dataIndex: 'stockStatus', key: 'stockStatus', width: 90,
      render: (status: string, r: SupervisedVehicle) => (
        <Tag color={stockStatusColorMap[status]} style={{ borderRadius: 4 }}>{r.stockStatusText}</Tag>
      ),
    },
    {
      title: '监管状态', dataIndex: 'supervisionStatus', key: 'supervisionStatus', width: 90,
      render: (status: string, r: SupervisedVehicle) => (
        <Tag color={supervisionStatusColorMap[status]} style={{ borderRadius: 4 }}>{r.supervisionStatusText}</Tag>
      ),
    },
    {
      title: '设备', key: 'device', width: 100,
      render: (_: unknown, r: SupervisedVehicle) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Badge status={r.deviceOnline === 'online' ? 'success' : 'default'} />
          <span style={{ fontSize: 12, fontFamily: "'DM Sans', monospace" }}>{r.deviceNo || '-'}</span>
        </div>
      ),
    },
    {
      title: '库龄', dataIndex: 'stockDays', key: 'stockDays', width: 80, align: 'right',
      sorter: (a, b) => a.stockDays - b.stockDays,
      render: (v: number) => (
        <span style={{
          fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 14,
          color: v >= 60 ? '#ff4d4f' : v >= 45 ? '#fa8c16' : '#1a1a2e',
        }}>
          {v}<span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>天</span>
          {v >= 60 && <WarningOutlined style={{ marginLeft: 4, fontSize: 12, color: '#ff4d4f' }} />}
        </span>
      ),
    },
    {
      title: '监管方案', dataIndex: 'supervisionPlan', key: 'supervisionPlan', width: 110,
      render: (v: string) => <Tag style={{ borderRadius: 4 }}>{v}</Tag>,
    },
    {
      title: '回款状态', dataIndex: 'repaymentStatus', key: 'repaymentStatus', width: 90,
      render: (v: string) => (
        <Tag color={v === '已回款' ? 'green' : 'default'} style={{ borderRadius: 4 }}>{v}</Tag>
      ),
    },
    {
      title: '垫款日期', dataIndex: 'loanDate', key: 'loanDate', width: 110,
      sorter: (a, b) => a.loanDate.localeCompare(b.loanDate),
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作', key: 'action', width: 80, fixed: 'right',
      render: (_: unknown, r: SupervisedVehicle) => (
        <Tooltip title="查看详情">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pc/inventory/${r.id}`)} />
        </Tooltip>
      ),
    },
  ]

  const alertColumns: ColumnsType<AlertRecord> = [
    {
      title: '告警编号', dataIndex: 'alertNo', key: 'alertNo', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    {
      title: '告警等级', dataIndex: 'alertLevel', key: 'alertLevel', width: 90,
      render: (v: string) => (
        <Tag color={alertLevelColorMap[v]} style={{ borderRadius: 4 }}>
          {v === 'high' ? '高' : v === 'medium' ? '中' : '低'}
        </Tag>
      ),
    },
    {
      title: '告警状态', dataIndex: 'alertStatus', key: 'alertStatus', width: 90,
      render: (status: string, r: AlertRecord) => (
        <Tag color={alertStatusColorMap[status]} style={{ borderRadius: 4 }}>{r.alertStatusText}</Tag>
      ),
    },
    {
      title: '关联车牌', dataIndex: 'plateNo', key: 'plateNo', width: 110,
      render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    { title: '告警类型', dataIndex: 'alertType', key: 'alertType', width: 120 },
    {
      title: '告警内容', dataIndex: 'alertContent', key: 'alertContent', width: 260,
      ellipsis: true,
    },
    {
      title: '触发时间', dataIndex: 'triggerTime', key: 'triggerTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '处理备注', dataIndex: 'remark', key: 'remark', width: 200,
      ellipsis: true,
      render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v || '-'}</span>,
    },
  ]

  const useColumns: ColumnsType<VehicleUseRecord> = [
    {
      title: '用车单号', dataIndex: 'id', key: 'id', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 80 },
    {
      title: '提车人', key: 'picker', width: 140,
      render: (_: unknown, r: VehicleUseRecord) => (
        <div>
          <div style={{ fontSize: 13 }}>{r.pickerName}（{r.pickerType}）</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.pickerPhone}</div>
        </div>
      ),
    },
    {
      title: '用车类型', dataIndex: 'useType', key: 'useType', width: 100,
      render: (v: string) => <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag>,
    },
    {
      title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 110,
      render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    { title: '所在仓', dataIndex: 'warehouse', key: 'warehouse', width: 100 },
    {
      title: '用车状态', dataIndex: 'useStatus', key: 'useStatus', width: 90,
      render: (_: unknown, r: VehicleUseRecord) => {
        const colorMap: Record<string, string> = {
          using: 'processing', completed: 'success', expired: 'default', pending_approval: 'warning', rejected: 'error',
        }
        return <Tag color={colorMap[r.useStatus]} style={{ borderRadius: 4 }}>{r.useStatusText}</Tag>
      },
    },
    {
      title: '用车时段', dataIndex: 'useDuration', key: 'useDuration', width: 260,
      render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v}</span>,
    },
    {
      title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
  ]

  const checkColumns: ColumnsType<InventoryCheckRecord> = [
    {
      title: '盘点仓库', dataIndex: 'warehouse', key: 'warehouse', width: 120,
      render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span>,
    },
    {
      title: '盘点总数', dataIndex: 'totalCount', key: 'totalCount', width: 90, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{v}</span>,
    },
    {
      title: '盘点类型', dataIndex: 'checkType', key: 'checkType', width: 110,
      render: (_: unknown, r: InventoryCheckRecord) => <Tag style={{ borderRadius: 4 }}>{r.checkTypeText}</Tag>,
    },
    {
      title: '盘点状态', dataIndex: 'checkStatus', key: 'checkStatus', width: 90,
      render: (_: unknown, r: InventoryCheckRecord) => (
        <Tag color={r.checkStatus === 'checking' ? 'processing' : 'default'} style={{ borderRadius: 4 }}>{r.checkStatusText}</Tag>
      ),
    },
    {
      title: '盘点结果', dataIndex: 'checkResult', key: 'checkResult', width: 90,
      render: (v: string) => (
        <Tag color={v === '正常' ? 'green' : 'error'} style={{ borderRadius: 4 }}>{v}</Tag>
      ),
    },
    { title: '盘点人', dataIndex: 'checker', key: 'checker', width: 80 },
    {
      title: '完成时间', dataIndex: 'finishTime', key: 'finishTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t || '-'}</span>,
    },
    {
      title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">车辆总数</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">全部监管车辆</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">在库车辆</div>
          <div className="stat-value">{stats.inStock}</div>
          <div className="stat-sub">当前在库</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">监管中</div>
          <div className="stat-value">{stats.supervising}</div>
          <div className="stat-sub">正在监管</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">告警中</div>
          <div className="stat-value">{stats.alerting}</div>
          <div className="stat-sub">需要处理</div>
        </div>
        <div className="stat-card" style={{ position: 'relative' }}>
          {stats.overAge > 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#ff4d4f' }} />}
          <div className="stat-label">库龄预警</div>
          <div className="stat-value" style={{ color: stats.overAge > 0 ? '#ff4d4f' : '#8c8c8c' }}>{stats.overAge}</div>
          <div className="stat-sub">库龄≥60天</div>
        </div>
      </div>

      {/* 表格卡片 */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <WarningOutlined />
            库存监管
          </div>
          <Space>
            <Button icon={<ImportOutlined />}>批量导入</Button>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ padding: '0 20px' }}
          items={[
            { key: 'vehicles', label: '监管车辆' },
            { key: 'registration', label: '签注管理' },
            { key: 'alerts', label: '告警记录' },
            { key: 'use', label: '用车管理' },
            { key: 'check', label: '库存盘点' },
          ]}
        />

        {/* 筛选栏 */}
        <div className="filter-bar">
          <Input
            placeholder="搜索车牌/VIN/品牌/业务员/公司"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText} onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }} allowClear
          />
          {(activeTab === 'vehicles' || activeTab === 'registration') && (
            <>
              <Select placeholder="库存状态" allowClear style={{ width: 120 }}
                value={stockFilter} onChange={setStockFilter}
                options={[
                  { value: 'pending_in', label: '待入库' },
                  { value: 'in_stock', label: '在库' },
                  { value: 'out_stock', label: '出库' },
                  { value: 'transferred', label: '已转移' },
                ]}
              />
              <Select placeholder="监管状态" allowClear style={{ width: 120 }}
                value={supervisionFilter} onChange={setSupervisionFilter}
                options={[
                  { value: 'pending', label: '待监管' },
                  { value: 'supervising', label: '监管中' },
                  { value: 'released', label: '监管解除' },
                ]}
              />
            </>
          )}
        </div>

        {/* 表格 */}
        <div className="table-card-body">
          {activeTab === 'vehicles' && (
            <Table columns={vehicleColumns} dataSource={filteredVehicles} rowKey="id" size="middle"
              scroll={{ x: 1900 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
              rowClassName={(r) => r.stockDays >= 60 ? 'row-warning' : r.isScrapped ? 'row-warning' : ''}
            />
          )}
          {activeTab === 'registration' && (
            <Table
              columns={[
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
              ] as ColumnsType<SupervisedVehicle>}
              dataSource={filteredVehicles.filter((v) => v.source === '库存金融')}
              rowKey="id" size="middle" scroll={{ x: 1600 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            />
          )}
          {activeTab === 'alerts' && (
            <Table columns={alertColumns} dataSource={mockAlertRecords} rowKey="id" size="middle"
              scroll={{ x: 1400 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
              rowClassName={(r) => r.alertStatus === 'alerting' ? 'row-warning' : ''}
            />
          )}
          {activeTab === 'use' && (
            <Table columns={useColumns} dataSource={mockVehicleUseRecords} rowKey="id" size="middle"
              scroll={{ x: 1400 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            />
          )}
          {activeTab === 'check' && (
            <Table columns={checkColumns} dataSource={mockInventoryChecks} rowKey="id" size="middle"
              scroll={{ x: 1000 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
