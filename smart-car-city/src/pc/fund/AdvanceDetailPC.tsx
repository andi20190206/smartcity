import { useParams, useNavigate } from 'react-router-dom'
import { Button, Tag, Descriptions, Steps, Alert, Space } from 'antd'
import {
  ArrowLeftOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined,
} from '@ant-design/icons'
import { mockAdvanceRecords } from '../../shared/mock/fundMock'

const advanceStatusColorMap: Record<string, string> = {
  pending: 'warning', approving: 'processing', approved: 'success',
  rejected: 'error', withdrawn: 'default', withdraw_failed: 'error',
}
const withdrawStatusColorMap: Record<string, string> = {
  pending: 'default', processing: 'processing', success: 'success', failed: 'error',
}

function getStepStatus(record: typeof mockAdvanceRecords[0]) {
  const steps = [
    { title: '发起申请', time: record.createTime, status: 'finish' as const },
    {
      title: record.status === 'rejected' ? '审批驳回' : '审批通过',
      time: record.approveTime || '',
      status: record.approveTime ? (record.status === 'rejected' ? 'error' as const : 'finish' as const)
        : record.status === 'approving' ? 'process' as const : 'wait' as const,
    },
    {
      title: record.withdrawStatus === 'failed' ? '提现失败' : '提现完成',
      time: record.withdrawTime || '',
      status: record.withdrawTime ? (record.withdrawStatus === 'failed' ? 'error' as const : 'finish' as const)
        : record.withdrawStatus === 'processing' ? 'process' as const : 'wait' as const,
    },
  ]
  const current = steps.findIndex((s) => s.status === 'process' || s.status === 'wait')
  return { steps, current: current === -1 ? steps.length : current }
}

export default function AdvanceDetailPC() {
  const { id } = useParams()
  const navigate = useNavigate()
  const record = mockAdvanceRecords.find((r) => r.id === id)

  if (!record) {
    return (
      <div className="detail-page">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#8c8c8c' }}>未找到垫款记录</div>
      </div>
    )
  }

  const remaining = record.contractAmount - record.advancedAmount
  const { steps, current } = getStepStatus(record)

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
            <span className="order-id">{record.id}</span>
            <Tag color={advanceStatusColorMap[record.status]} style={{ borderRadius: 4, fontSize: 13 }}>{record.statusText}</Tag>
            <Tag color={withdrawStatusColorMap[record.withdrawStatus]} style={{ borderRadius: 4, fontSize: 13 }}>{record.withdrawStatusText}</Tag>
          </div>
          <div className="order-meta">
            <span>采购单: {record.purchaseOrderId}</span>
            <span>车商: {record.dealerName} · {record.storeName}</span>
            <span>创建: {record.createTime}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>申请垫款金额</div>
          <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'DM Sans', monospace", color: '#E8352E', letterSpacing: -0.5 }}>
            {record.applyAmount.toFixed(2)}
            <span style={{ fontSize: 14, fontWeight: 400, color: '#8c8c8c', marginLeft: 4 }}>万</span>
          </div>
        </div>
      </div>

      {/* 提现失败提示 */}
      {record.status === 'withdraw_failed' && record.failReason && (
        <Alert type="error" showIcon icon={<ExclamationCircleOutlined />}
          message="提现失败" description={record.failReason}
          style={{ marginBottom: 16, borderRadius: 12 }}
          action={<Button size="small" danger>重新提现</Button>}
        />
      )}

      {/* 流程进度 */}
      <div className="detail-section">
        <div className="detail-section-title"><ClockCircleOutlined /> 流程进度</div>
        <div className="detail-section-body">
          <Steps current={current} size="small"
            items={steps.map((s) => ({
              title: s.title,
              description: s.time || '—',
              status: s.status,
            }))}
          />
        </div>
      </div>

      {/* 金额信息 */}
      <div className="detail-section">
        <div className="detail-section-title"><ExclamationCircleOutlined /> 金额信息</div>
        <div className="detail-section-body">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">采购合同金额</span>
              <span className="info-value" style={{ fontFamily: "'DM Sans', monospace" }}>{record.contractAmount.toFixed(2)} 万</span>
            </div>
            <div className="info-item">
              <span className="info-label">已垫金额</span>
              <span className="info-value" style={{ fontFamily: "'DM Sans', monospace" }}>{record.advancedAmount.toFixed(2)} 万</span>
            </div>
            <div className="info-item">
              <span className="info-label">本次申请金额</span>
              <span className="info-value" style={{ fontFamily: "'DM Sans', monospace", color: '#E8352E', fontWeight: 700 }}>{record.applyAmount.toFixed(2)} 万</span>
            </div>
            <div className="info-item">
              <span className="info-label">剩余可垫金额</span>
              <span className="info-value" style={{ fontFamily: "'DM Sans', monospace" }}>{remaining.toFixed(2)} 万</span>
            </div>
            <div className="info-item">
              <span className="info-label">资金来源</span>
              <Tag color={record.fundSource === '银行资方' ? 'blue' : 'default'} style={{ borderRadius: 4 }}>{record.fundSource}</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* 车辆信息 */}
      <div className="detail-section">
        <div className="detail-section-title"><SyncOutlined /> 车辆信息</div>
        <div className="detail-section-body">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">车牌号</span>
              <span className="info-value">{record.plateNo}</span>
            </div>
            <div className="info-item">
              <span className="info-label">VIN码</span>
              <span className="info-value" style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{record.vin}</span>
            </div>
            <div className="info-item">
              <span className="info-label">车型</span>
              <span className="info-value">{record.brandModel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 收款信息 */}
      <div className="detail-section">
        <div className="detail-section-title"><CheckCircleOutlined /> 收款信息</div>
        <div className="detail-section-body">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">卖方</span>
              <span className="info-value">{record.sellerName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">收款银行</span>
              <span className="info-value">{record.sellerBank}</span>
            </div>
            <div className="info-item">
              <span className="info-label">银行卡号</span>
              <span className="info-value" style={{ fontFamily: "'DM Sans', monospace" }}>{record.sellerCardNo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
