import { useNavigate, useParams } from 'react-router-dom'
import { Tag, Button, Table, Space, Alert, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined, PrinterOutlined, RedoOutlined,
  ArrowUpOutlined, ArrowDownOutlined, CheckCircleOutlined,
  ClockCircleOutlined, CarOutlined, DollarOutlined, AuditOutlined,
  BankOutlined, UserOutlined, ShopOutlined, SyncOutlined,
  CloseCircleOutlined, FileTextOutlined, WarningOutlined,
} from '@ant-design/icons'
import { mockSettlementOrders } from '../../shared/mock/settlementMock'
import type { SettlementVehicleItem } from '../../shared/types/Settlement.types'

const statusColorMap: Record<string, string> = {
  pending: 'warning', processing: 'processing', completed: 'success', failed: 'error',
}
const statusTextMap: Record<string, string> = {
  pending: '待清分', processing: '清分中', completed: '清分完成', failed: '清分失败',
}

const wayStatusIcon: Record<string, React.ReactNode> = {
  success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  pending: <ClockCircleOutlined style={{ color: '#faad14' }} />,
  failed: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
  none: <span style={{ color: '#d9d9d9' }}>—</span>,
}
const wayStatusText: Record<string, string> = {
  success: '已到账', pending: '待到账', failed: '到账失败', none: '不适用',
}

export default function SettlementDetailPC() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = mockSettlementOrders.find((o) => o.id === id) || mockSettlementOrders[0]
  const isLoss = order.totalProfitLoss < 0
  const isFailed = order.status === 'failed'

  const vehicleColumns: ColumnsType<SettlementVehicleItem> = [
    { title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 110, render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: 'VIN码', dataIndex: 'vin', key: 'vin', width: 190, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v}</span> },
    { title: '品牌型号', dataIndex: 'brandModel', key: 'brandModel', width: 220, ellipsis: true },
    {
      title: '采购合同价(万)', dataIndex: 'contractPrice', key: 'contractPrice', width: 130, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", color: '#8c8c8c' }}>{v.toFixed(2)}</span>,
    },
    {
      title: '销售价(万)', dataIndex: 'salesPrice', key: 'salesPrice', width: 110, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{v.toFixed(2)}</span>,
    },
    {
      title: '盈亏(万)', dataIndex: 'profitLoss', key: 'profitLoss', width: 100, align: 'right',
      render: (v: number) => (
        <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: v >= 0 ? '#52c41a' : '#ff4d4f', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
          {v >= 0 ? <ArrowUpOutlined style={{ fontSize: 10 }} /> : <ArrowDownOutlined style={{ fontSize: 10 }} />}
          {v >= 0 ? '+' : ''}{v.toFixed(2)}
        </span>
      ),
    },
    {
      title: '服务费(万)', dataIndex: 'serviceFee', key: 'serviceFee', width: 100, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v.toFixed(2)}</span>,
    },
    {
      title: '佣金(万)', dataIndex: 'commission', key: 'commission', width: 90, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v.toFixed(2)}</span>,
    },
    {
      title: '回垫款(万)', dataIndex: 'advanceRepay', key: 'advanceRepay', width: 100, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v.toFixed(2)}</span>,
    },
    {
      title: '利息(万)', dataIndex: 'interest', key: 'interest', width: 90, align: 'right',
      render: (v: number) => v > 0
        ? <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v.toFixed(2)}</span>
        : <span style={{ color: '#d9d9d9' }}>—</span>,
    },
  ]

  const flowSteps = [
    { label: '买家付款', done: true },
    { label: '系统清分', done: ['processing', 'completed', 'failed'].includes(order.status) },
    { label: '四路到账', done: order.status === 'completed' },
    { label: '清分完成', done: order.status === 'completed' },
  ]

  const fourWayItems = [
    { label: '平台服务费', icon: <ShopOutlined />, amount: order.totalServiceFee, status: order.fourWayStatus.platformFee, receiver: '平台账户' },
    { label: '车商佣金', icon: <UserOutlined />, amount: order.totalCommission, status: order.fourWayStatus.dealerCommission, receiver: order.dealerName },
    { label: '经销公司车款', icon: <BankOutlined />, amount: order.totalCompanyPayment, status: order.fourWayStatus.companyPayment, receiver: order.companyName },
    { label: '银行利息', icon: <DollarOutlined />, amount: order.totalInterest, status: order.fourWayStatus.bankInterest, receiver: order.fundSource === '银行出资' ? '资方银行' : '不适用' },
  ]

  const completedWays = fourWayItems.filter((i) => i.status === 'success').length
  const totalWays = fourWayItems.filter((i) => i.status !== 'none').length

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/pc/settlement')} />
            <span className="order-id">{order.id}</span>
            <Tag color={statusColorMap[order.status]} style={{ borderRadius: 4, fontSize: 13 }}>
              {statusTextMap[order.status]}
            </Tag>
            {isLoss && <Tag color="error" style={{ borderRadius: 4 }}>亏损订单</Tag>}
            {order.fundSource === '银行出资' && <Tag color="blue" style={{ borderRadius: 4 }}>银行出资</Tag>}
          </div>
          <div className="order-meta">
            <span><ClockCircleOutlined /> {order.createTime}</span>
            <span><FileTextOutlined /> 销售单：{order.salesOrderId}</span>
            <span><CarOutlined /> {order.vehicleCount}台车辆</span>
            <span><DollarOutlined /> 销售总额：<span style={{ color: '#E8352E', fontWeight: 600 }}>{order.totalSalesAmount.toFixed(2)}万</span></span>
          </div>
        </div>
        <Space>
          {isFailed && <Button type="primary" danger icon={<RedoOutlined />}>重试清分</Button>}
          <Button icon={<PrinterOutlined />}>打印</Button>
        </Space>
      </div>

      {/* Failure alert */}
      {isFailed && (
        <Alert
          message={`清分失败：${order.failReason || '未知原因'}`}
          description={`已重试 ${order.retryCount || 0} 次，请联系平台运营人员处理`}
          type="error"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      {/* Loss alert */}
      {isLoss && !isFailed && (
        <Alert
          message={`本次清分存在亏损 ${Math.abs(order.totalProfitLoss).toFixed(2)}万元，差额将计入车商销售亏损`}
          type="warning"
          showIcon
          style={{ marginBottom: 16, borderRadius: 8 }}
        />
      )}

      {/* Flow */}
      <div className="detail-section">
        <div className="detail-section-title"><AuditOutlined /> 清分流程</div>
        <div className="detail-section-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {flowSteps.map((s, i) => (
              <div key={s.label} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '0 0 auto' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: s.done ? (isFailed && i >= 2 ? '#ff4d4f' : '#E8352E') : '#f0f0f0',
                    color: s.done ? '#fff' : '#bfbfbf', fontSize: 12, fontWeight: 600,
                  }}>
                    {s.done ? (isFailed && i >= 2 ? <CloseCircleOutlined /> : <CheckCircleOutlined />) : i + 1}
                  </div>
                  <div style={{ fontSize: 12, color: s.done ? '#1a1a2e' : '#bfbfbf', fontWeight: s.done ? 500 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </div>
                </div>
                {i < flowSteps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: s.done && flowSteps[i + 1]?.done ? '#E8352E' : '#f0f0f0', margin: '0 8px', marginBottom: 20 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Four-way settlement */}
      <div className="detail-section">
        <div className="detail-section-title">
          <DollarOutlined /> 四路清分到账
          <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400, marginLeft: 8 }}>
            {completedWays}/{totalWays} 路已到账
          </span>
          <div style={{ marginLeft: 'auto', width: 120 }}>
            <Progress percent={totalWays > 0 ? Math.round((completedWays / totalWays) * 100) : 0} size="small" strokeColor="#E8352E" />
          </div>
        </div>
        <div className="detail-section-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {fourWayItems.map((item) => (
              <div key={item.label} style={{
                padding: 16, borderRadius: 10, border: '1px solid #f0f0f0',
                background: item.status === 'success' ? '#f6ffed' : item.status === 'failed' ? '#fff2f0' : '#fafafa',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: item.status === 'success' ? '#52c41a' : item.status === 'failed' ? '#ff4d4f' : item.status === 'none' ? '#d9d9d9' : '#faad14',
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 16, color: '#8c8c8c' }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{item.label}</span>
                </div>
                <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 22, fontWeight: 700, color: item.status === 'none' ? '#d9d9d9' : '#1a1a2e', marginBottom: 8 }}>
                  {item.status === 'none' ? '—' : `${item.amount.toFixed(2)}万`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  {wayStatusIcon[item.status]}
                  <span style={{ color: '#8c8c8c' }}>{wayStatusText[item.status]}</span>
                </div>
                <div style={{ fontSize: 11, color: '#bfbfbf', marginTop: 4 }}>
                  接收方：{item.receiver}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vehicle detail table */}
      <div className="detail-section">
        <div className="detail-section-title">
          <CarOutlined /> 清分明细（按车辆）
          <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400, marginLeft: 8 }}>{order.vehicleCount}台</span>
        </div>
        <div style={{ padding: '0 4px' }}>
          <Table columns={vehicleColumns} dataSource={order.vehicles} rowKey="id" size="small" pagination={false}
            scroll={{ x: 1300 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}><span style={{ fontWeight: 600 }}>合计</span></Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>
                    {order.vehicles.reduce((s, v) => s + v.contractPrice, 0).toFixed(2)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>
                    {order.totalSalesAmount.toFixed(2)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: order.totalProfitLoss >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    {order.totalProfitLoss >= 0 ? '+' : ''}{order.totalProfitLoss.toFixed(2)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{order.totalServiceFee.toFixed(2)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{order.totalCommission.toFixed(2)}</span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>
                    {order.vehicles.reduce((s, v) => s + v.advanceRepay, 0).toFixed(2)}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>
                    {order.totalInterest > 0 ? order.totalInterest.toFixed(2) : '—'}
                  </span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      </div>

      {/* Settlement info */}
      <div className="detail-section">
        <div className="detail-section-title"><BankOutlined /> 结算信息</div>
        <div className="detail-section-body">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">车商</span>
              <span className="info-value">{order.dealerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">经销公司</span>
              <span className="info-value">{order.companyName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">资金来源</span>
              <span className="info-value">{order.fundSource}</span>
            </div>
            <div className="info-item">
              <span className="info-label">清分时间</span>
              <span className="info-value">{order.settleTime || '—'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">关联销售单</span>
              <span className="info-value" style={{ color: '#1677ff', cursor: 'pointer' }}
                onClick={() => navigate(`/pc/sales/${order.salesOrderId}`)}>
                {order.salesOrderId}
              </span>
            </div>
            {isFailed && (
              <>
                <div className="info-item">
                  <span className="info-label">重试次数</span>
                  <span className="info-value" style={{ color: '#ff4d4f' }}>{order.retryCount || 0} 次</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Calculation formula */}
      <div className="detail-section">
        <div className="detail-section-title"><SyncOutlined /> 清分计算公式</div>
        <div className="detail-section-body">
          <div style={{ background: '#fafafa', borderRadius: 8, padding: 16, fontFamily: "'DM Sans', monospace", fontSize: 13, lineHeight: 2 }}>
            <div>平台服务费 = 合同约定金额 → <span style={{ color: '#E8352E', fontWeight: 600 }}>{order.totalServiceFee.toFixed(2)}万</span></div>
            <div>车商佣金 = 合同约定比例 × 销售价 → <span style={{ color: '#E8352E', fontWeight: 600 }}>{order.totalCommission.toFixed(2)}万</span></div>
            {order.totalInterest > 0 && (
              <div>银行利息 = 按台结算 → <span style={{ color: '#E8352E', fontWeight: 600 }}>{order.totalInterest.toFixed(2)}万</span></div>
            )}
            <div>经销公司车款 = 销售总额 - 服务费 - 佣金{order.totalInterest > 0 ? ' - 利息' : ''} → <span style={{ color: '#E8352E', fontWeight: 600 }}>{order.totalCompanyPayment.toFixed(2)}万</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
