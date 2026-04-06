import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Tag, Button, Table, Descriptions, Space, Alert } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined, PrinterOutlined, EditOutlined, FileTextOutlined,
  ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined, ClockCircleOutlined,
  UserOutlined, CarOutlined, DollarOutlined, AuditOutlined,
} from '@ant-design/icons'
import { mockSalesOrders } from '../../shared/mock/salesMock'
import type { SalesVehicleItem } from '../../shared/types/Sales.types'

const statusColorMap: Record<string, string> = {
  draft: 'default', pending_approval: 'processing', approving: 'processing',
  approved: 'success', pending_payment: 'warning', paid: 'cyan',
  clearing: 'geekblue', completed: 'success', rejected: 'error',
}
const statusTextMap: Record<string, string> = {
  draft: '草稿', pending_approval: '待审批', approving: '审批中',
  approved: '审批通过', pending_payment: '待付款', paid: '已付款',
  clearing: '清分中', completed: '已完成', rejected: '已驳回',
}

export default function SalesDetailPC() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = mockSalesOrders.find((o) => o.id === id) || mockSalesOrders[0]
  const isLoss = order.totalProfitLoss < 0

  const vehicleColumns: ColumnsType<SalesVehicleItem> = [
    { title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 110, render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: 'VIN码', dataIndex: 'vin', key: 'vin', width: 190, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v}</span> },
    { title: '品牌型号', dataIndex: 'brandModel', key: 'brandModel', width: 240, ellipsis: true },
    { title: '里程(万km)', dataIndex: 'mileage', key: 'mileage', width: 100, align: 'right' },
    { title: '上牌日期', dataIndex: 'registerDate', key: 'registerDate', width: 110 },
    {
      title: '采购合同价(万)', dataIndex: 'contractPrice', key: 'contractPrice', width: 130, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", color: '#8c8c8c' }}>{v.toFixed(2)}</span>,
    },
    {
      title: '销售价(万)', dataIndex: 'salesPrice', key: 'salesPrice', width: 120, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{v.toFixed(2)}</span>,
    },
    {
      title: '盈亏(万)', dataIndex: 'profitLoss', key: 'profitLoss', width: 110, align: 'right',
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: v >= 0 ? '#52c41a' : '#ff4d4f', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          {v >= 0 ? <ArrowUpOutlined style={{ fontSize: 10 }} /> : <ArrowDownOutlined style={{ fontSize: 10 }} />}
          {v >= 0 ? '+' : ''}{v.toFixed(2)}
        </span>
      ),
    },
  ]

  const flowSteps = [
    { label: '销售签约申请', time: order.createTime, done: true },
    { label: '销售审批', done: ['approved', 'pending_payment', 'paid', 'clearing', 'completed'].includes(order.status) },
    { label: '买家付款', done: ['paid', 'clearing', 'completed'].includes(order.status) },
    { label: '清分结算', done: ['clearing', 'completed'].includes(order.status) },
    { label: '完成', done: order.status === 'completed' },
  ]

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/pc/sales')} />
            <span className="order-id">{order.id}</span>
            <Tag color={statusColorMap[order.status]} style={{ borderRadius: 4, fontSize: 13 }}>
              {statusTextMap[order.status]}
            </Tag>
            {isLoss && <Tag color="error" style={{ borderRadius: 4 }}>亏损订单</Tag>}
          </div>
          <div className="order-meta">
            <span><ClockCircleOutlined /> {order.createTime}</span>
            <span><UserOutlined /> 销售顾问：{order.salesAdvisor}</span>
            <span><CarOutlined /> {order.vehicleCount}台车辆</span>
            <span><DollarOutlined /> 销售总价：<span style={{ color: '#E8352E', fontWeight: 600 }}>{order.totalSalesPrice.toFixed(2)}万</span></span>
          </div>
        </div>
        <Space>
          {['draft', 'rejected'].includes(order.status) && <Button icon={<EditOutlined />}>编辑</Button>}
          {['approved', 'pending_payment', 'paid', 'completed'].includes(order.status) && <Button icon={<FileTextOutlined />}>查看合同</Button>}
          <Button icon={<PrinterOutlined />}>打印</Button>
        </Space>
      </div>

      {/* Loss alert */}
      {isLoss && (
        <Alert
          message={`本次销售存在亏损 ${Math.abs(order.totalProfitLoss).toFixed(2)}万元，差额将计入车商销售亏损`}
          type="error"
          showIcon
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      {/* Flow */}
      <div className="detail-section">
        <div className="detail-section-title"><AuditOutlined /> 流程进度</div>
        <div className="detail-section-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {flowSteps.map((s, i) => (
              <div key={s.label} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: s.done ? '#E8352E' : '#f0f0f0', color: s.done ? '#fff' : '#bfbfbf', fontSize: 12, fontWeight: 600,
                  }}>
                    {s.done ? <CheckCircleOutlined /> : i + 1}
                  </div>
                  <div style={{ fontSize: 12, color: s.done ? '#1a1a2e' : '#bfbfbf', fontWeight: s.done ? 500 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </div>
                  {s.time && <div style={{ fontSize: 10, color: '#bfbfbf' }}>{s.time}</div>}
                </div>
                {i < flowSteps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: s.done && flowSteps[i + 1]?.done ? '#E8352E' : '#f0f0f0', margin: '0 8px', marginBottom: 30 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle table */}
      <div className="detail-section">
        <div className="detail-section-title">
          <CarOutlined /> 车辆销售明细
          <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400, marginLeft: 8 }}>{order.vehicleCount}台</span>
        </div>
        <div style={{ padding: '0 4px' }}>
          <Table columns={vehicleColumns} dataSource={order.vehicles} rowKey="id" size="small" pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}><span style={{ fontWeight: 600 }}>合计</span></Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{order.totalContractPrice.toFixed(2)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{order.totalSalesPrice.toFixed(2)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: order.totalProfitLoss >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    {order.totalProfitLoss >= 0 ? '+' : ''}{order.totalProfitLoss.toFixed(2)}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      </div>

      {/* Buyer info */}
      <div className="detail-section">
        <div className="detail-section-title"><UserOutlined /> 买家信息</div>
        <div className="detail-section-body">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">买家类型</span>
              <span className="info-value">{order.buyerType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">{order.buyerType === '企业' ? '企业名称' : '买家姓名'}</span>
              <span className="info-value">{order.buyerName || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">证件号码</span>
              <span className="info-value">{order.buyerIdNo || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">联系电话</span>
              <span className="info-value">{order.buyerPhone || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="detail-section">
        <div className="detail-section-title"><DollarOutlined /> 付款信息</div>
        <div className="detail-section-body">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">付款人</span>
              <span className="info-value">{order.payerIsBuyer ? '与买家一致' : (order.payerName || '-')}</span>
            </div>
            {!order.payerIsBuyer && (
              <>
                <div className="info-item">
                  <span className="info-label">付款人类型</span>
                  <span className="info-value">{order.payerType || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">证件号码</span>
                  <span className="info-value">{order.payerIdNo || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">银行卡号</span>
                  <span className="info-value">{order.payerCardNo || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">开户行</span>
                  <span className="info-value">{order.payerBank || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">预留手机</span>
                  <span className="info-value">{order.payerPhone || '-'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="detail-section">
        <div className="detail-section-title"><FileTextOutlined /> 签名 & 附件</div>
        <div className="detail-section-body">
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>销售顾问签名</div>
              <div style={{ height: 100, background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {order.salesAdvisorSign ? (
                  <svg width="180" height="60" viewBox="0 0 180 60"><path d="M10 50 Q40 10 60 35 T100 20 T150 40 T170 15" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                ) : <span style={{ color: '#bfbfbf' }}>未签名</span>}
                <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 11, color: '#bfbfbf' }}>{order.salesAdvisor}</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>买家签名</div>
              <div style={{ height: 100, background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {order.buyerSign ? (
                  <svg width="160" height="60" viewBox="0 0 160 60"><path d="M15 45 Q35 5 55 30 T95 15 T135 35" stroke="#333" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
                ) : <span style={{ color: '#bfbfbf' }}>未签名</span>}
                <div style={{ position: 'absolute', bottom: 6, right: 10, fontSize: 11, color: '#bfbfbf' }}>{order.buyerName}</div>
              </div>
            </div>
          </div>
          {order.offlineContract && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileTextOutlined style={{ color: '#8c8c8c' }} />
              <span style={{ fontSize: 13, color: '#1a1a2e' }}>线下合同已上传</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
