import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Table, Tag, Modal, Input, Select, Space, Switch, message, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  SettingOutlined, NodeIndexOutlined, UserOutlined,
} from '@ant-design/icons'
import { approvalTypeText } from '../../shared/constants/approvalStatusMap'

interface ApprovalFlowNode {
  nodeIndex: number
  nodeName: string
  approverType: 'role' | 'user'
  approverRole?: string
  approverName?: string
}

interface ApprovalFlowConfig {
  id: string
  type: string
  typeName: string
  dealerCompany: string
  enabled: boolean
  nodes: ApprovalFlowNode[]
  createTime: string
  updateTime: string
}

const mockFlowConfigs: ApprovalFlowConfig[] = [
  {
    id: 'FC001', type: 'purchase', typeName: '采购审批', dealerCompany: '广州天河旗舰店', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '经销公司审批', approverType: 'role', approverRole: '经销公司管理员' },
      { nodeIndex: 2, nodeName: '平台复核', approverType: 'role', approverRole: '平台审批员' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-20 14:30',
  },
  {
    id: 'FC002', type: 'advance', typeName: '垫款审批', dealerCompany: '广州天河旗舰店', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '经销公司审批', approverType: 'role', approverRole: '经销公司管理员' },
      { nodeIndex: 2, nodeName: '资方审批', approverType: 'role', approverRole: '资方审批员' },
      { nodeIndex: 3, nodeName: '平台复核', approverType: 'role', approverRole: '平台审批员' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-20 14:30',
  },
  {
    id: 'FC003', type: 'sales_sign', typeName: '销售签约审批', dealerCompany: '广州天河旗舰店', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '经销公司审批', approverType: 'role', approverRole: '经销公司管理员' },
      { nodeIndex: 2, nodeName: '平台复核', approverType: 'role', approverRole: '平台审批员' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-22 09:00',
  },
  {
    id: 'FC004', type: 'supervision_release', typeName: '监管解除审批', dealerCompany: '广州天河旗舰店', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '经销公司审批', approverType: 'role', approverRole: '经销公司管理员' },
      { nodeIndex: 2, nodeName: '平台确认', approverType: 'user', approverName: '系统自动' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-18 16:00',
  },
  {
    id: 'FC005', type: 'vehicle_use', typeName: '用车审批', dealerCompany: '广州天河旗舰店', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '经销公司审批', approverType: 'role', approverRole: '经销公司管理员' },
      { nodeIndex: 2, nodeName: '资方确认', approverType: 'role', approverRole: '资方审批员' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-15 11:00',
  },
  {
    id: 'FC006', type: 'deposit_change', typeName: '款项变动审核', dealerCompany: '全部经销公司（平台默认）', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '平台审核', approverType: 'role', approverRole: '平台审批员' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-01 10:00',
  },
  {
    id: 'FC007', type: 'alarm_handle', typeName: '告警处理审批', dealerCompany: '全部经销公司（平台默认）', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '平台处理', approverType: 'role', approverRole: '平台审批员' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-01 10:00',
  },
  {
    id: 'FC008', type: 'listing', typeName: '上架审批', dealerCompany: '广州天河旗舰店', enabled: false,
    nodes: [
      { nodeIndex: 1, nodeName: '经销公司审批', approverType: 'role', approverRole: '经销公司管理员' },
    ],
    createTime: '2026-03-01 10:00', updateTime: '2026-03-01 10:00',
  },
  {
    id: 'FC009', type: 'purchase', typeName: '采购审批', dealerCompany: '深圳福田精品店', enabled: true,
    nodes: [
      { nodeIndex: 1, nodeName: '经销公司审批', approverType: 'user', approverName: '王总' },
      { nodeIndex: 2, nodeName: '平台复核', approverType: 'role', approverRole: '平台审批员' },
    ],
    createTime: '2026-03-05 10:00', updateTime: '2026-03-25 09:00',
  },
]

const typeColorMap: Record<string, string> = {
  purchase: 'blue', advance: 'orange', listing: 'purple',
  sales_sign: 'green', supervision_release: 'cyan', vehicle_use: 'geekblue',
  deposit_change: 'red', alarm_handle: 'volcano', wholesale: 'default',
}

const roleOptions = [
  { value: '经销公司管理员', label: '经销公司管理员' },
  { value: '平台审批员', label: '平台审批员' },
  { value: '资方审批员', label: '资方审批员' },
  { value: '财务主管', label: '财务主管' },
]

export default function ApprovalConfigPC() {
  const navigate = useNavigate()
  const [configs] = useState(mockFlowConfigs)
  const [editModal, setEditModal] = useState(false)
  const [editingConfig, setEditingConfig] = useState<ApprovalFlowConfig | null>(null)
  const [editNodes, setEditNodes] = useState<ApprovalFlowNode[]>([])
  const [companyFilter, setCompanyFilter] = useState<string | undefined>(undefined)
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)

  const companies = [...new Set(configs.map((c) => c.dealerCompany))]

  const filteredConfigs = configs.filter((c) => {
    if (companyFilter && c.dealerCompany !== companyFilter) return false
    if (typeFilter && c.type !== typeFilter) return false
    return true
  })

  const openEdit = (config: ApprovalFlowConfig) => {
    setEditingConfig(config)
    setEditNodes([...config.nodes])
    setEditModal(true)
  }

  const addNode = () => {
    setEditNodes([...editNodes, {
      nodeIndex: editNodes.length + 1,
      nodeName: '',
      approverType: 'role',
      approverRole: undefined,
    }])
  }

  const removeNode = (index: number) => {
    const newNodes = editNodes.filter((_, i) => i !== index).map((n, i) => ({ ...n, nodeIndex: i + 1 }))
    setEditNodes(newNodes)
  }

  const updateNode = (index: number, field: string, value: string) => {
    const newNodes = [...editNodes]
    newNodes[index] = { ...newNodes[index], [field]: value }
    setEditNodes(newNodes)
  }

  const handleSave = () => {
    message.success('审批流配置已保存')
    setEditModal(false)
    setEditingConfig(null)
    setEditNodes([])
  }

  const columns: ColumnsType<ApprovalFlowConfig> = [
    {
      title: '审批类型',
      dataIndex: 'typeName',
      key: 'typeName',
      width: 130,
      render: (name: string, record: ApprovalFlowConfig) => (
        <Tag color={typeColorMap[record.type]} style={{ borderRadius: 4 }}>{name}</Tag>
      ),
    },
    {
      title: '适用经销公司',
      dataIndex: 'dealerCompany',
      key: 'dealerCompany',
      width: 200,
      render: (company: string) => (
        <span style={{ fontSize: 13 }}>{company}</span>
      ),
    },
    {
      title: '审批节点',
      key: 'nodes',
      width: 400,
      render: (_: unknown, record: ApprovalFlowConfig) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {record.nodes.map((node, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: 6,
                background: '#f5f5f5', border: '1px solid #f0f0f0',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#e6f4ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 600, color: '#1677ff', border: '1px solid #91caff',
                }}>
                  {node.nodeIndex}
                </div>
                <span style={{ fontSize: 12, color: '#1a1a2e' }}>{node.nodeName}</span>
                <span style={{ fontSize: 11, color: '#8c8c8c' }}>
                  ({node.approverType === 'role' ? node.approverRole : node.approverName})
                </span>
              </div>
              {i < record.nodes.length - 1 && (
                <span style={{ fontSize: 12, color: '#d9d9d9' }}>→</span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'} style={{ borderRadius: 4 }}>
          {enabled ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: ApprovalFlowConfig) => (
        <Space size={6}>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除此审批流配置？" onConfirm={() => message.success('已删除')}>
            <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="detail-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pc/approval')}>返回审批列表</Button>
            <span className="order-id" style={{ fontSize: 20 }}>审批流配置</span>
          </div>
          <div className="order-meta">
            <span><SettingOutlined /> 配置各审批类型的审批节点和审批人</span>
            <span><NodeIndexOutlined /> 支持按经销公司独立配置</span>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large"
          onClick={() => {
            setEditingConfig(null)
            setEditNodes([{ nodeIndex: 1, nodeName: '', approverType: 'role', approverRole: undefined }])
            setEditModal(true)
          }}>
          新增审批流
        </Button>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <SettingOutlined />
            审批流配置列表
            <span className="count">{filteredConfigs.length} 条</span>
          </div>
        </div>

        <div className="filter-bar">
          <Select
            placeholder="经销公司"
            value={companyFilter}
            onChange={setCompanyFilter}
            allowClear
            style={{ width: 200 }}
            options={companies.map((c) => ({ value: c, label: c }))}
          />
          <Select
            placeholder="审批类型"
            value={typeFilter}
            onChange={setTypeFilter}
            allowClear
            style={{ width: 130 }}
            options={Object.entries(approvalTypeText).map(([k, v]) => ({ value: k, label: v }))}
          />
        </div>

        <div className="table-card-body">
          <Table
            columns={columns}
            dataSource={filteredConfigs}
            rowKey="id"
            size="middle"
            pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
          />
        </div>
      </div>

      {/* 编辑审批流弹窗 */}
      <Modal
        title={editingConfig ? `编辑审批流 - ${editingConfig.typeName}` : '新增审批流'}
        open={editModal}
        onCancel={() => { setEditModal(false); setEditingConfig(null); setEditNodes([]) }}
        onOk={handleSave}
        okText="保存"
        width={680}
      >
        {!editingConfig && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>审批类型</div>
                <Select placeholder="选择审批类型" style={{ width: '100%' }}
                  options={Object.entries(approvalTypeText).map(([k, v]) => ({ value: k, label: v }))} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>适用经销公司</div>
                <Select placeholder="选择经销公司" style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: '全部经销公司（平台默认）' },
                    { value: '广州天河旗舰店', label: '广州天河旗舰店' },
                    { value: '深圳福田精品店', label: '深圳福田精品店' },
                    { value: '佛山南海店', label: '佛山南海店' },
                  ]} />
              </div>
            </div>
          </div>
        )}

        {editingConfig && (
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Tag color={typeColorMap[editingConfig.type]} style={{ borderRadius: 4 }}>{editingConfig.typeName}</Tag>
              <span style={{ fontSize: 13, color: '#8c8c8c', marginLeft: 8 }}>{editingConfig.dealerCompany}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13 }}>启用</span>
              <Switch defaultChecked={editingConfig.enabled} />
            </div>
          </div>
        )}

        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <NodeIndexOutlined /> 审批节点配置
        </div>

        {editNodes.map((node, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12,
            padding: '12px', borderRadius: 8, background: '#fafafa', border: '1px solid #f0f0f0',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: '#e6f4ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600, color: '#1677ff', border: '1px solid #91caff',
              flexShrink: 0, marginTop: 4,
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Input
                placeholder="节点名称"
                value={node.nodeName}
                onChange={(e) => updateNode(i, 'nodeName', e.target.value)}
                style={{ width: 150 }}
              />
              <Select
                value={node.approverType}
                onChange={(v) => updateNode(i, 'approverType', v)}
                style={{ width: 120 }}
                options={[
                  { value: 'role', label: '按角色' },
                  { value: 'user', label: '指定人员' },
                ]}
              />
              {node.approverType === 'role' ? (
                <Select
                  placeholder="选择角色"
                  value={node.approverRole}
                  onChange={(v) => updateNode(i, 'approverRole', v)}
                  style={{ width: 160 }}
                  options={roleOptions}
                />
              ) : (
                <Input
                  placeholder="审批人姓名"
                  value={node.approverName}
                  onChange={(e) => updateNode(i, 'approverName', e.target.value)}
                  prefix={<UserOutlined />}
                  style={{ width: 160 }}
                />
              )}
            </div>
            {editNodes.length > 1 && (
              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeNode(i)}
                style={{ marginTop: 4 }} />
            )}
          </div>
        ))}

        <Button type="dashed" block icon={<PlusOutlined />} onClick={addNode}
          style={{ marginTop: 4 }}>
          添加审批节点
        </Button>

        {/* 流程预览 */}
        {editNodes.length > 0 && (
          <div style={{ marginTop: 16, padding: '12px', borderRadius: 8, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#52c41a', marginBottom: 8 }}>流程预览</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <div style={{ padding: '4px 10px', borderRadius: 6, background: '#e6f4ff', border: '1px solid #91caff', fontSize: 12, color: '#1677ff' }}>
                申请人提交
              </div>
              {editNodes.map((node, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#d9d9d9' }}>→</span>
                  <div style={{ padding: '4px 10px', borderRadius: 6, background: '#fff', border: '1px solid #f0f0f0', fontSize: 12 }}>
                    {node.nodeName || `节点${i + 1}`}
                    <span style={{ color: '#8c8c8c', marginLeft: 4 }}>
                      ({node.approverType === 'role' ? (node.approverRole || '未选择') : (node.approverName || '未填写')})
                    </span>
                  </div>
                </div>
              ))}
              <span style={{ color: '#d9d9d9' }}>→</span>
              <div style={{ padding: '4px 10px', borderRadius: 6, background: '#f6ffed', border: '1px solid #b7eb8f', fontSize: 12, color: '#52c41a' }}>
                审批完成
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}