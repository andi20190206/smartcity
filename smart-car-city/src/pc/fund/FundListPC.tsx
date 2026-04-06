import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Tag, Input, Select, Button, Space, Tooltip, Tabs, Modal, Descriptions, Badge } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  SearchOutlined, ReloadOutlined, ExportOutlined, EyeOutlined,
  DollarOutlined, WarningOutlined, BankOutlined,
} from '@ant-design/icons'
import { mockDealerQuotas, mockAdvanceRecords, mockDepositChanges } from '../../shared/mock/fundMock'
import type { DealerQuota, AdvanceRecord, DepositChangeRecord } from '../../shared/types/Fund.types'

const advanceStatusColorMap: Record<string, string> = {
  pending: 'warning',
  approving: 'processing',
  approved: 'success',
  rejected: 'error',
  withdrawn: 'default',
  withdraw_failed: 'error',
}

const withdrawStatusColorMap: Record<string, string> = {
  pending: 'default',
  processing: 'processing',
  success: 'success',
  failed: 'error',
}

export default function FundListPC() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('quota')
  const [searchText, setSearchText] = useState('')
  const [detailModal, setDetailModal] = useState<DealerQuota | null>(null)

  // 统计
  const stats = useMemo(() => {
    const totalDeposit = mockDealerQuotas.reduce((s, q) => s + q.deposit, 0)
    const totalInTransit = mockDealerQuotas.reduce((s, q) => s + q.inTransitQuota, 0)
    const negativeCount = mockDealerQuotas.filter((q) => q.applyableQuota < 0).length
    const pendingAdvance = mockAdvanceRecords.filter((r) => r.status === 'pending' || r.status === 'approving').length
    return { totalDeposit, totalInTransit, negativeCount, pendingAdvance, dealerCount: mockDealerQuotas.length }
  }, [])

  // 车商额度表格列
  const quotaColumns: ColumnsType<DealerQuota> = [
    {
      title: '账户ID', dataIndex: 'id', key: 'id', width: 100, fixed: 'left',
      render: (id: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{id}</span>,
    },
    {
      title: '车商', key: 'dealer', width: 160,
      render: (_: unknown, r: DealerQuota) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{r.dealerName}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.storeName}</div>
        </div>
      ),
    },
    {
      title: '合作款项', dataIndex: 'deposit', key: 'deposit', width: 110, align: 'right',
      sorter: (a, b) => a.deposit - b.deposit,
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{v.toFixed(2)}<span style={{ fontSize: 11, color: '#8c8c8c', marginLeft: 2 }}>万</span></span>,
    },
    {
      title: '已用合作款项', dataIndex: 'usedDeposit', key: 'usedDeposit', width: 120, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace" }}>{v.toFixed(2)}</span>,
    },
    {
      title: '可用合作款项', dataIndex: 'availableDeposit', key: 'availableDeposit', width: 120, align: 'right',
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: v < 0 ? '#ff4d4f' : '#1a1a2e' }}>
          {v.toFixed(2)}
        </span>
      ),
    },
    {
      title: '最大额度', dataIndex: 'maxQuota', key: 'maxQuota', width: 110, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace" }}>{v.toFixed(2)}</span>,
    },
    {
      title: '在途额度', dataIndex: 'inTransitQuota', key: 'inTransitQuota', width: 110, align: 'right',
      sorter: (a, b) => a.inTransitQuota - b.inTransitQuota,
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", color: '#fa8c16' }}>{v.toFixed(2)}</span>,
    },
    {
      title: '可用额度', dataIndex: 'availableQuota', key: 'availableQuota', width: 110, align: 'right',
      sorter: (a, b) => a.availableQuota - b.availableQuota,
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: v < 0 ? '#ff4d4f' : '#52c41a' }}>
          {v.toFixed(2)}
        </span>
      ),
    },
    {
      title: '可申请额度', dataIndex: 'applyableQuota', key: 'applyableQuota', width: 120, align: 'right',
      sorter: (a, b) => a.applyableQuota - b.applyableQuota,
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, fontSize: 14, color: v < 0 ? '#ff4d4f' : '#E8352E' }}>
          {v.toFixed(2)}
          {v < 0 && <WarningOutlined style={{ marginLeft: 4, fontSize: 12 }} />}
        </span>
      ),
    },
    {
      title: '最后变化', dataIndex: 'lastChangeTime', key: 'lastChangeTime', width: 150,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作', key: 'action', width: 80, fixed: 'right',
      render: (_: unknown, r: DealerQuota) => (
        <Tooltip title="查看明细">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => setDetailModal(r)} />
        </Tooltip>
      ),
    },
  ]

  // 垫款记录表格列
  const advanceColumns: ColumnsType<AdvanceRecord> = [
    {
      title: '垫款单号', dataIndex: 'id', key: 'id', width: 160, fixed: 'left',
      render: (id: string) => (
        <a onClick={() => navigate(`/pc/fund/advance/${id}`)} style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{id}</a>
      ),
    },
    {
      title: '采购单号', dataIndex: 'purchaseOrderId', key: 'purchaseOrderId', width: 150,
      render: (id: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12, color: '#8c8c8c' }}>{id}</span>,
    },
    {
      title: '车辆', key: 'vehicle', width: 220,
      render: (_: unknown, r: AdvanceRecord) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{r.plateNo}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.brandModel}</div>
        </div>
      ),
    },
    {
      title: '合同金额', dataIndex: 'contractAmount', key: 'contractAmount', width: 100, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace" }}>{v.toFixed(2)}</span>,
    },
    {
      title: '申请金额', dataIndex: 'applyAmount', key: 'applyAmount', width: 110, align: 'right',
      sorter: (a, b) => a.applyAmount - b.applyAmount,
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E', fontSize: 14 }}>
          {v.toFixed(2)}<span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
        </span>
      ),
    },
    {
      title: '垫款状态', dataIndex: 'status', key: 'status', width: 100,
      render: (status: string, r: AdvanceRecord) => (
        <Tag color={advanceStatusColorMap[status]} style={{ borderRadius: 4 }}>{r.statusText}</Tag>
      ),
    },
    {
      title: '提现状态', dataIndex: 'withdrawStatus', key: 'withdrawStatus', width: 100,
      render: (status: string, r: AdvanceRecord) => (
        <Tag color={withdrawStatusColorMap[status]} style={{ borderRadius: 4 }}>{r.withdrawStatusText}</Tag>
      ),
    },
    {
      title: '卖方', dataIndex: 'sellerName', key: 'sellerName', width: 160,
      render: (name: string) => <span style={{ fontSize: 13 }}>{name}</span>,
    },
    {
      title: '车商', key: 'dealer', width: 140,
      render: (_: unknown, r: AdvanceRecord) => (
        <div>
          <div style={{ fontSize: 13 }}>{r.dealerName}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.storeName}</div>
        </div>
      ),
    },
    {
      title: '资金来源', dataIndex: 'fundSource', key: 'fundSource', width: 130,
      render: (v: string) => <Tag color={v === '银行资方' ? 'blue' : 'default'} style={{ borderRadius: 4 }}>{v}</Tag>,
    },
    {
      title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160,
      sorter: (a, b) => a.createTime.localeCompare(b.createTime),
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
    {
      title: '操作', key: 'action', width: 80, fixed: 'right',
      render: (_: unknown, r: AdvanceRecord) => (
        <Tooltip title="查看详情">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/pc/fund/advance/${r.id}`)} />
        </Tooltip>
      ),
    },
  ]

  // 合作款项变动表格列
  const depositColumns: ColumnsType<DepositChangeRecord> = [
    {
      title: '变动ID', dataIndex: 'id', key: 'id', width: 100,
      render: (id: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{id}</span>,
    },
    {
      title: '车商', key: 'dealer', width: 160,
      render: (_: unknown, r: DepositChangeRecord) => (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{r.dealerName}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{r.storeName}</div>
        </div>
      ),
    },
    {
      title: '变动类型', dataIndex: 'changeType', key: 'changeType', width: 130,
      render: (v: string) => <Tag style={{ borderRadius: 4 }}>{v}</Tag>,
    },
    {
      title: '变动方向', dataIndex: 'direction', key: 'direction', width: 100,
      render: (v: string) => (
        <Tag color={v === 'increase' ? 'green' : 'red'} style={{ borderRadius: 4 }}>
          {v === 'increase' ? '增加' : '扣减'}
        </Tag>
      ),
    },
    {
      title: '金额', dataIndex: 'amount', key: 'amount', width: 110, align: 'right',
      render: (v: number, r: DepositChangeRecord) => (
        <span style={{
          fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 14,
          color: r.direction === 'increase' ? '#52c41a' : '#ff4d4f',
        }}>
          {r.direction === 'increase' ? '+' : '-'}{v.toFixed(2)}
          <span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
        </span>
      ),
    },
    {
      title: '原因', dataIndex: 'reason', key: 'reason', width: 120,
    },
    {
      title: '审核状态', dataIndex: 'auditStatus', key: 'auditStatus', width: 100,
      render: (status: string, r: DepositChangeRecord) => (
        <Badge status={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'processing'} text={r.auditStatusText} />
      ),
    },
    {
      title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
  ]

  const filteredQuotas = useMemo(() => {
    if (!searchText) return mockDealerQuotas
    const s = searchText.toLowerCase()
    return mockDealerQuotas.filter((q) => q.dealerName.toLowerCase().includes(s) || q.storeName.toLowerCase().includes(s) || q.id.toLowerCase().includes(s))
  }, [searchText])

  const filteredAdvances = useMemo(() => {
    if (!searchText) return mockAdvanceRecords
    const s = searchText.toLowerCase()
    return mockAdvanceRecords.filter((r) =>
      r.id.toLowerCase().includes(s) || r.plateNo.includes(s) || r.sellerName.includes(s) || r.dealerName.includes(s)
    )
  }, [searchText])

  return (
    <div>
      {/* 统计卡片 */}
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">车商总数</div>
          <div className="stat-value">{stats.dealerCount}</div>
          <div className="stat-sub">有额度的车商</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">合作款项总额</div>
          <div className="stat-value">{stats.totalDeposit.toFixed(0)}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>万</span></div>
          <div className="stat-sub">全部车商合计</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">在途额度总额</div>
          <div className="stat-value">{stats.totalInTransit.toFixed(1)}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 2 }}>万</span></div>
          <div className="stat-sub">已垫款未签注</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">待审批垫款</div>
          <div className="stat-value">{stats.pendingAdvance}</div>
          <div className="stat-sub">需要审批处理</div>
        </div>
        <div className="stat-card" style={{ position: 'relative' }}>
          {stats.negativeCount > 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#ff4d4f' }} />}
          <div className="stat-label">额度预警</div>
          <div className="stat-value" style={{ color: stats.negativeCount > 0 ? '#ff4d4f' : '#8c8c8c' }}>{stats.negativeCount}</div>
          <div className="stat-sub">可申请额度为负</div>
        </div>
      </div>

      {/* 表格卡片 */}
      <div className="table-card">
        <div className="table-card-header">
          <div className="title">
            <DollarOutlined />
            资金管理
          </div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ padding: '0 20px' }}
          items={[
            { key: 'quota', label: '车商额度' },
            { key: 'advance', label: '垫款记录' },
            { key: 'deposit', label: '款项变动' },
          ]}
        />

        {/* 筛选栏 */}
        <div className="filter-bar">
          <Input
            placeholder={activeTab === 'quota' ? '搜索车商/门店' : '搜索单号/车牌/卖方/车商'}
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
          {activeTab === 'advance' && (
            <>
              <Select placeholder="垫款状态" allowClear style={{ width: 120 }}
                options={[
                  { value: 'pending', label: '待审批' },
                  { value: 'approving', label: '审批中' },
                  { value: 'approved', label: '已通过' },
                  { value: 'rejected', label: '已驳回' },
                  { value: 'withdrawn', label: '已提现' },
                  { value: 'withdraw_failed', label: '提现失败' },
                ]}
              />
              <Select placeholder="资金来源" allowClear style={{ width: 140 }}
                options={[
                  { value: 'self', label: '经销公司自有资金' },
                  { value: 'bank', label: '银行资方' },
                ]}
              />
            </>
          )}
        </div>

        {/* 表格 */}
        <div className="table-card-body">
          {activeTab === 'quota' && (
            <Table columns={quotaColumns} dataSource={filteredQuotas} rowKey="id" size="middle"
              scroll={{ x: 1400 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
              rowClassName={(r) => r.applyableQuota < 0 ? 'row-warning' : ''}
            />
          )}
          {activeTab === 'advance' && (
            <Table columns={advanceColumns} dataSource={filteredAdvances} rowKey="id" size="middle"
              scroll={{ x: 1800 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            />
          )}
          {activeTab === 'deposit' && (
            <Table columns={depositColumns} dataSource={mockDepositChanges} rowKey="id" size="middle"
              scroll={{ x: 1100 }}
              pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
            />
          )}
        </div>
      </div>

      {/* 车商额度详情弹窗 */}
      <Modal title="车商额度详情" open={!!detailModal} onCancel={() => setDetailModal(null)} footer={null} width={640}>
        {detailModal && (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="账户ID">{detailModal.id}</Descriptions.Item>
            <Descriptions.Item label="车商">{detailModal.dealerName}</Descriptions.Item>
            <Descriptions.Item label="门店">{detailModal.storeName}</Descriptions.Item>
            <Descriptions.Item label="代经销合作款项">
              <span style={{ fontWeight: 600 }}>{detailModal.deposit.toFixed(2)} 万</span>
            </Descriptions.Item>
            <Descriptions.Item label="已用合作款项">{detailModal.usedDeposit.toFixed(2)} 万</Descriptions.Item>
            <Descriptions.Item label="可用合作款项">
              <span style={{ color: detailModal.availableDeposit < 0 ? '#ff4d4f' : undefined, fontWeight: 600 }}>
                {detailModal.availableDeposit.toFixed(2)} 万
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="最大额度">{detailModal.maxQuota.toFixed(2)} 万</Descriptions.Item>
            <Descriptions.Item label="在途额度">
              <span style={{ color: '#fa8c16' }}>{detailModal.inTransitQuota.toFixed(2)} 万</span>
            </Descriptions.Item>
            <Descriptions.Item label="可用额度">
              <span style={{ color: detailModal.availableQuota < 0 ? '#ff4d4f' : '#52c41a', fontWeight: 600 }}>
                {detailModal.availableQuota.toFixed(2)} 万
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="可申请额度">
              <span style={{ color: detailModal.applyableQuota < 0 ? '#ff4d4f' : '#E8352E', fontWeight: 700, fontSize: 16 }}>
                {detailModal.applyableQuota.toFixed(2)} 万
                {detailModal.applyableQuota < 0 && <WarningOutlined style={{ marginLeft: 4 }} />}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="最后变化时间">{detailModal.lastChangeTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
