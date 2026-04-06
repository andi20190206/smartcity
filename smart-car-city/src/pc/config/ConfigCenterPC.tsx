import { useState, useMemo } from 'react'
import {
  Tabs, Table, Tag, Select, Input, Button, Space, Card, Modal,
  Form, Switch, Slider, InputNumber, Checkbox, Tooltip, Badge, Timeline, Descriptions,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SettingOutlined, HistoryOutlined, SearchOutlined, EditOutlined,
  UndoOutlined, BankOutlined, InfoCircleOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, BuildOutlined, DollarOutlined,
  SafetyCertificateOutlined, DatabaseOutlined,
} from '@ant-design/icons'
import {
  mockPlatformConfigs, mockCompanyOverrides, mockCompanyConfigs, mockConfigChangeLogs,
} from '../../shared/mock/configMock'
import type { ConfigItem, ConfigChangeLog, CompanyConfigOverride } from '../../shared/types/Config.types'

const levelLabelMap: Record<string, { text: string; color: string }> = {
  platform: { text: '平台级', color: 'red' },
  dealer_company: { text: '经销公司级', color: 'blue' },
  store: { text: '门店级', color: 'green' },
}

const groupIconMap: Record<string, React.ReactNode> = {
  '监管设置': <SafetyCertificateOutlined />,
  '清分结算': <DollarOutlined />,
  '资金设置': <BankOutlined />,
  '额度设置': <BuildOutlined />,
  '库存设置': <DatabaseOutlined />,
}

function renderConfigValue(item: ConfigItem): React.ReactNode {
  if (item.valueType === 'multi_select' && Array.isArray(item.value)) {
    const labels = item.value.map((v) => item.options?.find((o) => o.value === v)?.label || v)
    return (
      <Space size={[4, 4]} wrap>
        {labels.map((l) => <Tag key={l} style={{ borderRadius: 4 }}>{l}</Tag>)}
      </Space>
    )
  }
  if (item.valueType === 'select') {
    return item.options?.find((o) => o.value === item.value)?.label || String(item.value)
  }
  if (item.valueType === 'percentage') return `${item.value}%`
  if (item.valueType === 'number' && item.range) return `${item.value}${item.range.unit}`
  if (item.valueType === 'threshold') return String(item.value).split(',').map((v) => `${v.trim()}天`).join(' / ')
  return String(item.value)
}

export default function ConfigCenterPC() {
  const [activeTab, setActiveTab] = useState('platform')
  const [searchText, setSearchText] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<ConfigItem | null>(null)
  const [editValue, setEditValue] = useState<any>(null)
  const [logFilter, setLogFilter] = useState<string>('all')

  // 统计
  const stats = useMemo(() => {
    const totalConfigs = mockPlatformConfigs.length
    const platformOnly = mockPlatformConfigs.filter((c) => c.level === 'platform').length
    const companyLevel = mockPlatformConfigs.filter((c) => c.level === 'dealer_company').length
    const totalOverrides = mockCompanyOverrides.reduce((s, c) => s + c.overrideCount, 0)
    return { totalConfigs, platformOnly, companyLevel, totalOverrides, companyCount: mockCompanyOverrides.length }
  }, [])

  // 平台配置按分组
  const groupedConfigs = useMemo(() => {
    const groups: Record<string, ConfigItem[]> = {}
    const filtered = searchText
      ? mockPlatformConfigs.filter((c) => c.name.includes(searchText) || c.description.includes(searchText) || c.group.includes(searchText))
      : mockPlatformConfigs
    filtered.forEach((c) => {
      if (!groups[c.group]) groups[c.group] = []
      groups[c.group].push(c)
    })
    return groups
  }, [searchText])

  // 经销公司配置
  const companyConfigs = useMemo(() => {
    if (!selectedCompany) return []
    return mockCompanyConfigs[selectedCompany] || mockPlatformConfigs.map((c) => ({ ...c, overridden: false }))
  }, [selectedCompany])

  // 变更日志
  const filteredLogs = useMemo(() => {
    if (logFilter === 'all') return mockConfigChangeLogs
    return mockConfigChangeLogs.filter((l) => l.level === logFilter)
  }, [logFilter])

  const handleEdit = (item: ConfigItem) => {
    setEditModal(item)
    setEditValue(item.value)
  }

  const handleSave = () => {
    Modal.success({ title: '保存成功', content: `配置项「${editModal?.name}」已更新` })
    setEditModal(null)
  }

  const handleReset = (item: ConfigItem) => {
    Modal.confirm({
      title: '恢复默认值',
      icon: <ExclamationCircleOutlined />,
      content: `确定将「${item.name}」恢复为平台默认值？`,
      okText: '确定恢复',
      cancelText: '取消',
      onOk: () => Modal.success({ title: '已恢复', content: `「${item.name}」已恢复为默认值` }),
    })
  }

  // 经销公司覆盖列表列
  const companyColumns: ColumnsType<CompanyConfigOverride> = [
    {
      title: '经销公司', dataIndex: 'companyName', key: 'companyName',
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '覆盖配置数', dataIndex: 'overrideCount', key: 'overrideCount', width: 120, align: 'center',
      sorter: (a, b) => a.overrideCount - b.overrideCount,
      render: (v: number) => (
        <Badge count={v} style={{ backgroundColor: v > 3 ? '#fa8c16' : '#1677ff' }} />
      ),
    },
    {
      title: '最后更新', dataIndex: 'lastUpdateTime', key: 'lastUpdateTime', width: 180,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作', key: 'action', width: 100, align: 'center',
      render: (_: unknown, r: CompanyConfigOverride) => (
        <Button type="link" size="small" onClick={() => { setSelectedCompany(r.companyId); setActiveTab('company_detail') }}>
          查看配置
        </Button>
      ),
    },
  ]

  // 变更日志列
  const logColumns: ColumnsType<ConfigChangeLog> = [
    {
      title: '时间', dataIndex: 'changeTime', key: 'changeTime', width: 170,
      render: (t: string) => <span style={{ fontSize: 12, fontFamily: "'DM Sans', monospace" }}>{t}</span>,
    },
    {
      title: '配置项', dataIndex: 'configName', key: 'configName', width: 140,
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '级别', dataIndex: 'level', key: 'level', width: 100,
      render: (level: string) => {
        const info = levelLabelMap[level]
        return <Tag color={info?.color}>{info?.text}</Tag>
      },
    },
    {
      title: '经销公司', dataIndex: 'companyName', key: 'companyName', width: 180,
      render: (name: string) => name || <span style={{ color: '#bfbfbf' }}>—</span>,
    },
    {
      title: '变更前', dataIndex: 'oldValue', key: 'oldValue', width: 180,
      render: (v: string) => <span style={{ color: '#ff4d4f', fontSize: 13 }}>{v}</span>,
    },
    {
      title: '变更后', dataIndex: 'newValue', key: 'newValue', width: 180,
      render: (v: string) => <span style={{ color: '#52c41a', fontSize: 13 }}>{v}</span>,
    },
    {
      title: '操作人', key: 'operator', width: 160,
      render: (_: unknown, r: ConfigChangeLog) => (
        <div>
          <div style={{ fontSize: 13 }}>{r.operator}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.operatorRole}</div>
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* 统计卡片 */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="stat-card brand">
          <div className="stat-label">配置项总数</div>
          <div className="stat-value">{stats.totalConfigs}</div>
          <div className="stat-sub">全部可配置项</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">平台级配置</div>
          <div className="stat-value">{stats.platformOnly}</div>
          <div className="stat-sub">仅平台可修改</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">经销公司级配置</div>
          <div className="stat-value">{stats.companyLevel}</div>
          <div className="stat-sub">可被经销公司覆盖</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">已覆盖配置</div>
          <div className="stat-value">{stats.totalOverrides}</div>
          <div className="stat-sub">经销公司自定义</div>
        </div>
        <div className="stat-card gray">
          <div className="stat-label">经销公司数</div>
          <div className="stat-value">{stats.companyCount}</div>
          <div className="stat-sub">有自定义配置</div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <SettingOutlined />
            配置中心
            <span className="count">三级继承模型</span>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => { setActiveTab(key); setSelectedCompany(null) }}
          style={{ padding: '0 20px' }}
          items={[
            { key: 'platform', label: '平台默认配置' },
            { key: 'company', label: '经销公司配置' },
            { key: 'logs', label: '变更记录' },
          ]}
        />

        {/* ===== 平台默认配置 ===== */}
        {activeTab === 'platform' && (
          <>
            <div className="filter-bar">
              <Input
                placeholder="搜索配置项名称/说明"
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                value={searchText} onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }} allowClear
              />
            </div>
            <div style={{ padding: '16px 20px' }}>
              {Object.entries(groupedConfigs).map(([group, items]) => (
                <Card
                  key={group}
                  size="small"
                  title={
                    <Space>
                      {groupIconMap[group] || <SettingOutlined />}
                      <span style={{ fontWeight: 600 }}>{group}</span>
                      <Tag style={{ borderRadius: 10, fontSize: 11 }}>{items.length} 项</Tag>
                    </Space>
                  }
                  style={{ marginBottom: 12, borderRadius: 10 }}
                  styles={{ header: { borderBottom: '1px solid #f5f5f5' } }}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 0', borderBottom: '1px solid #fafafa',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{item.name}</span>
                          <Tag color={levelLabelMap[item.level]?.color} style={{ borderRadius: 4, fontSize: 11 }}>
                            {levelLabelMap[item.level]?.text}
                          </Tag>
                          <Tooltip title={item.description}>
                            <InfoCircleOutlined style={{ color: '#bfbfbf', fontSize: 13 }} />
                          </Tooltip>
                        </div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.description}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ minWidth: 200, textAlign: 'right', fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>
                          {renderConfigValue(item)}
                        </div>
                        <Tooltip title="编辑">
                          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(item)} />
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ===== 经销公司配置列表 ===== */}
        {activeTab === 'company' && !selectedCompany && (
          <div className="table-card-body">
            <Table
              columns={companyColumns} dataSource={mockCompanyOverrides} rowKey="companyId"
              size="middle" pagination={false}
            />
          </div>
        )}

        {/* ===== 经销公司配置详情 ===== */}
        {(activeTab === 'company_detail' || (activeTab === 'company' && selectedCompany)) && selectedCompany && (
          <>
            <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
              <Space>
                <Button size="small" onClick={() => { setSelectedCompany(null); setActiveTab('company') }}>
                  ← 返回列表
                </Button>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {mockCompanyOverrides.find((c) => c.companyId === selectedCompany)?.companyName}
                </span>
              </Space>
              <Tag color="blue">经销公司级配置</Tag>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {companyConfigs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px', marginBottom: 8, borderRadius: 8,
                    background: item.overridden ? '#fff7e6' : '#fff',
                    border: `1px solid ${item.overridden ? '#ffd591' : '#f0f0f0'}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                      {item.overridden ? (
                        <Tag color="orange" style={{ borderRadius: 4, fontSize: 11 }}>已覆盖</Tag>
                      ) : (
                        <Tag style={{ borderRadius: 4, fontSize: 11, color: '#8c8c8c' }}>继承平台</Tag>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ minWidth: 200, textAlign: 'right', fontSize: 13, fontWeight: item.overridden ? 600 : 400, color: item.overridden ? '#d46b08' : '#1a1a2e' }}>
                      {renderConfigValue(item)}
                    </div>
                    {item.level === 'dealer_company' && (
                      <Space size={4}>
                        <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(item)} /></Tooltip>
                        {item.overridden && (
                          <Tooltip title="恢复默认"><Button type="text" size="small" icon={<UndoOutlined />} onClick={() => handleReset(item)} /></Tooltip>
                        )}
                      </Space>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== 变更记录 ===== */}
        {activeTab === 'logs' && (
          <>
            <div className="filter-bar">
              <Select
                value={logFilter} onChange={setLogFilter} style={{ width: 160 }}
                options={[
                  { value: 'all', label: '全部级别' },
                  { value: 'platform', label: '平台级' },
                  { value: 'dealer_company', label: '经销公司级' },
                ]}
              />
            </div>
            <div className="table-card-body">
              <Table
                columns={logColumns} dataSource={filteredLogs} rowKey="id"
                size="middle" pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
              />
            </div>
          </>
        )}
      </div>

      {/* ===== 编辑配置弹窗 ===== */}
      <Modal
        title={<Space><EditOutlined />编辑配置 — {editModal?.name}</Space>}
        open={!!editModal} onCancel={() => setEditModal(null)}
        onOk={handleSave} okText="保存" cancelText="取消" width={520}
      >
        {editModal && (
          <div style={{ padding: '16px 0' }}>
            <Descriptions column={1} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="配置项">{editModal.name}</Descriptions.Item>
              <Descriptions.Item label="说明">{editModal.description}</Descriptions.Item>
              <Descriptions.Item label="级别">
                <Tag color={levelLabelMap[editModal.level]?.color}>{levelLabelMap[editModal.level]?.text}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ background: '#fafafa', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>配置值</div>

              {editModal.valueType === 'select' && (
                <Select
                  value={editValue} onChange={setEditValue} style={{ width: '100%' }}
                  options={editModal.options}
                />
              )}

              {editModal.valueType === 'multi_select' && (
                <Checkbox.Group
                  value={editValue} onChange={setEditValue}
                  options={editModal.options?.map((o) => ({ label: o.label, value: o.value }))}
                />
              )}

              {editModal.valueType === 'number' && editModal.range && (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Slider
                    min={editModal.range.min} max={editModal.range.max} step={editModal.range.step}
                    value={editValue as number} onChange={setEditValue}
                  />
                  <InputNumber
                    value={editValue as number} onChange={setEditValue}
                    min={editModal.range.min} max={editModal.range.max} step={editModal.range.step}
                    addonAfter={editModal.range.unit} style={{ width: 200 }}
                  />
                </Space>
              )}

              {editModal.valueType === 'percentage' && editModal.range && (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Slider
                    min={editModal.range.min} max={editModal.range.max} step={editModal.range.step}
                    value={editValue as number} onChange={setEditValue}
                    tooltip={{ formatter: (v) => `${v}%` }}
                  />
                  <InputNumber
                    value={editValue as number} onChange={setEditValue}
                    min={editModal.range.min} max={editModal.range.max} step={editModal.range.step}
                    addonAfter="%" style={{ width: 200 }}
                  />
                </Space>
              )}

              {editModal.valueType === 'threshold' && (
                <Input
                  value={editValue as string} onChange={(e) => setEditValue(e.target.value)}
                  placeholder="用逗号分隔，如：30,45,60"
                />
              )}
            </div>

            <div style={{ marginTop: 12, fontSize: 12, color: '#8c8c8c', display: 'flex', alignItems: 'center', gap: 4 }}>
              <InfoCircleOutlined />
              默认值：{renderConfigValue({ ...editModal, value: editModal.defaultValue })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
