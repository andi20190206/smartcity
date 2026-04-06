import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, Space, Badge, Popover } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, ReloadOutlined, ExportOutlined,
  AuditOutlined, UserOutlined,
} from '@ant-design/icons'
import { mockApprovals } from '../../shared/mock/approvalMock'
import { approvalTypeText } from '../../shared/constants/approvalStatusMap'
import type { ApprovalRecord, ApprovalStatus } from '../../shared/types/Approval.types'

const statusColorMap: Record<string, string> = {
  pending: 'warning',
  approving: 'processing',
  approved: 'success',
  rejected: 'error',
}
const statusTextMap: Record<string, string> = {
  pending: '待审批',
  approving: '审批中',
  approved: '已通过',
  rejected: '已驳回',
}
const typeColorMap: Record<string, string> = {
  purchase: 'blue',
  advance: 'orange',
  listing: 'purple',
  sales_sign: 'green',
  supervision_release: 'cyan',
  vehicle_use: 'geekblue',
  deposit_change: 'red',
  alarm_handle: 'volcano',
  wholesale: 'default',
}

type TabKey = 'all' | ApprovalStatus

const tabItems: { key: TabKey; label: string }[] = [
  { key: 'all', label: '审批列表' },
  { key: 'pending', label: '待审批' },
  { key: 'approving', label: '审批中' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已驳回' },
]

/** 审批进度：显示当前待谁审批，hover 展示全部审批人 */
function ApprovalProgress({ record }: { record: ApprovalRecord }) {
  const pendingNode = record.nodes.find((n) => n.status === 'pending')
  const isFinished = record.status === 'approved' || record.status === 'rejected'

  const popoverContent = (
    <div style={{ minWidth: 200 }}>
      {record.nodes.map((n, i) => {
        const isDone = n.status === 'approved'
        const isRejected = n.status === 'rejected'
        const isCurrent = n.status === 'pending' && record.currentNode === n.nodeIndex
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
            borderBottom: i < record.nodes.length - 1 ? '1px solid #f5f5f5' : 'none',
            opacity: isDone && !isCurrent ? 0.5 : 1,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600,
              background: isDone ? '#f6ffed' : isRejected ? '#fff2f0' : isCurrent ? '#e6f4ff' : '#fafafa',
              color: isDone ? '#52c41a' : isRejected ? '#ff4d4f' : isCurrent ? '#1677ff' : '#bfbfbf',
              border: `1px solid ${isDone ? '#b7eb8f' : isRejected ? '#ffccc7' : isCurrent ? '#91caff' : '#f0f0f0'}`,
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: isCurrent ? 600 : 400, color: isDone && !isCurrent ? '#bfbfbf' : '#1a1a2e' }}>
                {n.nodeName}
              </div>
              <div style={{ fontSize: 11, color: isDone ? '#d9d9d9' : '#8c8c8c' }}>
                {n.approverName}（{n.approverRole}）
              </div>
            </div>
            <div>
              {isDone && <Tag color="success" style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>已通过</Tag>}
              {isRejected && <Tag color="error" style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>已驳回</Tag>}
              {isCurrent && <Tag color="processing" style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>审批中</Tag>}
              {!isDone && !isRejected && !isCurrent && <Tag style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>待处理</Tag>}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <Popover content={popoverContent} title={<span style={{ fontSize: 13, fontWeight: 600 }}>审批流程 · {record.id}</span>} placement="bottom">
      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        {isFinished ? (
          <span style={{ fontSize: 12, color: '#bfbfbf' }}>
            {record.status === 'approved' ? '全部通过' : '已驳回'}
          </span>
        ) : pendingNode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', background: '#e6f4ff', border: '1px solid #91caff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UserOutlined style={{ fontSize: 10, color: '#1677ff' }} />
            </div>
            <span style={{ fontSize: 12, color: '#1677ff', fontWeight: 500 }}>
              待 {pendingNode.approverName} 审批
            </span>
            <span style={{ fontSize: 11, color: '#d9d9d9', marginLeft: 2 }}>
              ({record.nodes.filter((n) => n.status === 'approved').length}/{record.totalNodes})
            </span>
          </div>
        ) : null}
      </div>
    </Popover>
  )
}

export default function ApprovalListPC() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [searchText, setSearchText] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined)

  const filteredData = useMemo(() => {
    return mockApprovals.filter((a) => {
      if (activeTab !== 'all' && a.status !== activeTab) return false
      if (typeFilter && a.type !== typeFilter) return false
      if (searchText) {
        const s = searchText.toLowerCase()
        return a.id.toLowerCase().includes(s) || a.bizOrderId.toLowerCase().includes(s)
          || a.summary.includes(s) || a.applicant.includes(s)
          || (a.plateNo && a.plateNo.includes(s))
      }
      return true
    })
  }, [searchText, activeTab, typeFilter])

  const stats = useMemo(() => ({
    total: mockApprovals.length,
    pending: mockApprovals.filter((a) => a.status === 'pending').length,
    approving: mockApprovals.filter((a) => a.status === 'approving').length,
    approved: mockApprovals.filter((a) => a.status === 'approved').length,
    rejected: mockApprovals.filter((a) => a.status === 'rejected').length,
  }), [])

  /** 已审批过的行灰度展示 */
  const isFinished = (record: ApprovalRecord) => record.status === 'approved' || record.status === 'rejected'

  const columns: ColumnsType<ApprovalRecord> = [
    {
      title: '审批单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
      render: (id: string, record: ApprovalRecord) => (
        <a onClick={() => navigate(`/pc/approval/${id}`)} style={{
          fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13,
          color: isFinished(record) ? '#bfbfbf' : undefined,
        }}>
          {id}
        </a>
      ),
    },
    {
      title: '审批类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string, record: ApprovalRecord) => (
        <Tag color={isFinished(record) ? 'default' : typeColorMap[type]} style={{ borderRadius: 4 }}>
          {approvalTypeText[type] || type}
        </Tag>
      ),
    },
    {
      title: '审批摘要',
      dataIndex: 'summary',
      key: 'summary',
      width: 260,
      ellipsis: true,
      render: (summary: string, record: ApprovalRecord) => (
        <div style={{ opacity: isFinished(record) ? 0.5 : 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{summary}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>关联单号: {record.bizOrderId}</div>
        </div>
      ),
    },
    {
      title: '申请人',
      key: 'applicant',
      width: 130,
      render: (_: unknown, record: ApprovalRecord) => (
        <div style={{ opacity: isFinished(record) ? 0.5 : 1 }}>
          <div style={{ fontSize: 13 }}>{record.applicant}</div>
          <div style={{ fontSize: 11, color: '#bfbfbf' }}>{record.dealerCompany}</div>
        </div>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      align: 'right',
      sorter: (a: ApprovalRecord, b: ApprovalRecord) => (a.amount || 0) - (b.amount || 0),
      render: (amount: number | undefined, record: ApprovalRecord) => amount !== undefined ? (
        <span style={{
          fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 14,
          color: isFinished(record) ? '#bfbfbf' : '#E8352E',
        }}>
          {amount.toFixed(2)}
          <span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
        </span>
      ) : <span style={{ color: '#d9d9d9' }}>—</span>,
    },
    {
      title: '审批进度',
      key: 'progress',
      width: 200,
      render: (_: unknown, record: ApprovalRecord) => <ApprovalProgress record={record} />,
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
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      sorter: (a: ApprovalRecord, b: ApprovalRecord) => a.createTime.localeCompare(b.createTime),
      render: (t: string, record: ApprovalRecord) => (
        <span style={{ fontSize: 13, color: isFinished(record) ? '#d9d9d9' : '#8c8c8c' }}>{t}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: unknown, record: ApprovalRecord) => {
        const canApprove = record.status === 'pending' || record.status === 'approving'
        const rejectNode = record.nodes.find((n) => n.status === 'rejected')
        return (
          <div>
            <Space size={6}>
              <Button size="small" onClick={() => navigate(`/pc/approval/${record.id}`)}>查看</Button>
              {canApprove && (
                <>
                  <Button size="small" type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} onClick={() => alert(`通过: ${record.id}`)}>通过</Button>
                  <Button size="small" danger onClick={() => alert(`驳回: ${record.id}`)}>驳回</Button>
                </>
              )}
            </Space>
            {record.status === 'rejected' && rejectNode?.opinion && (
              <div style={{ marginTop: 4, fontSize: 11, color: '#ff4d4f', lineHeight: 1.3, maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={rejectNode.opinion}>
                驳回: {rejectNode.opinion}
              </div>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      {/* 统计卡片 — 可点击切换 Tab */}
      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {[
          { key: 'all' as TabKey, cls: 'brand', label: '审批总数', value: stats.total, sub: '全部审批单' },
          { key: 'pending' as TabKey, cls: 'orange', label: '待审批', value: stats.pending, sub: '需要处理' },
          { key: 'approving' as TabKey, cls: 'blue', label: '审批中', value: stats.approving, sub: '流转中' },
          { key: 'approved' as TabKey, cls: 'green', label: '已通过', value: stats.approved, sub: '审批完成' },
          { key: 'rejected' as TabKey, cls: '', label: '已驳回', value: stats.rejected, sub: '审批未通过' },
        ].map((card) => (
          <div key={card.key}
            className={`stat-card ${card.cls}`}
            onClick={() => setActiveTab(card.key)}
            style={{
              cursor: 'pointer', position: 'relative',
              outline: activeTab === card.key ? '2px solid #E8352E' : 'none',
              outlineOffset: -1,
              transition: 'outline 0.15s, box-shadow 0.15s',
            }}>
            {card.key === 'rejected' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#ff4d4f' }} />}
            <div className="stat-label">{card.label}</div>
            <div className="stat-value" style={{ color: card.key === 'rejected' ? '#ff4d4f' : undefined }}>
              {card.key === 'pending' && card.value > 0
                ? <Badge count={card.value} offset={[10, 0]} size="small">{card.value}</Badge>
                : card.value}
            </div>
            <div className="stat-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab 栏 */}
      <div className="table-card">
        <div style={{
          display: 'flex', borderBottom: '1px solid #f5f5f5',
          padding: '0 20px', gap: 0,
        }}>
          {tabItems.map((tab) => (
            <div key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 18px', fontSize: 14, cursor: 'pointer',
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? '#E8352E' : '#8c8c8c',
                borderBottom: activeTab === tab.key ? '2px solid #E8352E' : '2px solid transparent',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              {tab.label}
              {tab.key === 'pending' && stats.pending > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#fff', background: '#E8352E',
                  borderRadius: 8, padding: '0 6px', lineHeight: '18px', minWidth: 18, textAlign: 'center',
                }}>{stats.pending}</span>
              )}
              {tab.key !== 'all' && tab.key !== 'pending' && (
                <span style={{ fontSize: 11, color: '#bfbfbf' }}>
                  {stats[tab.key as keyof typeof stats]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="table-card-header" style={{ borderBottom: 'none' }}>
          <div className="title">
            <AuditOutlined />
            {tabItems.find((t) => t.key === activeTab)?.label || '审批列表'}
            <span className="count">{filteredData.length} 条</span>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>

        <div className="filter-bar">
          <Input
            placeholder="搜索审批单号/业务单号/车牌/申请人"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
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
            dataSource={filteredData}
            rowKey="id"
            size="middle"
            scroll={{ x: 1400 }}
            rowClassName={(record) => isFinished(record) ? 'approval-row-finished' : ''}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onDoubleClick: () => navigate(`/pc/approval/${record.id}`),
            })}
          />
        </div>
      </div>

      {/* 已审批行灰度样式 */}
      <style>{`
        .approval-row-finished td {
          background: #fafafa !important;
        }
        .approval-row-finished:hover td {
          background: #f5f5f5 !important;
        }
      `}</style>
    </div>
  )
}
