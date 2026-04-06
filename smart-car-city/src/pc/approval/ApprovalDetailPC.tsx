import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Button, Steps, Descriptions, Input, Space, Modal, Timeline, Empty, Select, message } from 'antd'
import {
  ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, FileTextOutlined,
  UserOutlined, BankOutlined, CarOutlined, SwapOutlined,
} from '@ant-design/icons'
import { mockApprovals } from '../../shared/mock/approvalMock'
import { approvalTypeText } from '../../shared/constants/approvalStatusMap'

const { TextArea } = Input

const statusColorMap: Record<string, string> = {
  pending: 'warning', approving: 'processing', approved: 'success', rejected: 'error',
}
const statusTextMap: Record<string, string> = {
  pending: '待审批', approving: '审批中', approved: '已通过', rejected: '已驳回',
}
const typeColorMap: Record<string, string> = {
  purchase: 'blue', advance: 'orange', listing: 'purple',
  sales_sign: 'green', supervision_release: 'cyan', vehicle_use: 'geekblue',
  deposit_change: 'red', alarm_handle: 'volcano', wholesale: 'default',
}

const transferCandidates = [
  { id: 'u1', name: '陈经理', role: '经销公司管理员', company: '广州天河旗舰店' },
  { id: 'u2', name: '王总', role: '经销公司管理员', company: '深圳福田精品店' },
  { id: 'u3', name: '刘主管', role: '平台审批员', company: '平台' },
  { id: 'u4', name: '赵财务', role: '财务主管', company: '广州天河旗舰店' },
]

export default function ApprovalDetailPC() {
  const { id } = useParams()
  const navigate = useNavigate()
  const record = mockApprovals.find((r) => r.id === id)
  const [approveModal, setApproveModal] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [transferModal, setTransferModal] = useState(false)
  const [opinion, setOpinion] = useState('')
  const [transferTo, setTransferTo] = useState<string | undefined>(undefined)
  const [transferReason, setTransferReason] = useState('')

  if (!record) {
    return (
      <div className="detail-page">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>返回</Button>
        <Empty description="未找到审批记录" />
      </div>
    )
  }

  const isPending = record.status === 'pending' || record.status === 'approving'
  const currentStep = record.nodes.findIndex((n) => n.status === 'pending')
  const stepCurrent = currentStep === -1 ? record.nodes.length : currentStep

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
            <span className="order-id">{record.id}</span>
            <Tag color={typeColorMap[record.type]} style={{ borderRadius: 4 }}>{record.typeText}</Tag>
            <Tag color={statusColorMap[record.status]} style={{ borderRadius: 4 }}>{record.statusText}</Tag>
          </div>
          <div className="order-meta">
            <span><UserOutlined /> {record.applicant}（{record.applicantRole}）</span>
            <span><BankOutlined /> {record.dealerCompany}</span>
            <span><ClockCircleOutlined /> {record.createTime}</span>
          </div>
        </div>
        {isPending && (
          <Space>
            <Button size="large" danger onClick={() => setRejectModal(true)}>驳回</Button>
            <Button size="large" icon={<SwapOutlined />} onClick={() => setTransferModal(true)}>转交</Button>
            <Button size="large" type="primary" onClick={() => setApproveModal(true)}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}>通过</Button>
          </Space>
        )}
      </div>

      {/* 驳回理由 */}
      {record.status === 'rejected' && (() => {
        const rejectNode = record.nodes.find((n) => n.status === 'rejected')
        return rejectNode?.opinion ? (
          <div style={{
            background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 12,
            padding: '14px 20px', marginBottom: 16,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 16, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#ff4d4f', marginBottom: 4 }}>审批已驳回</div>
              <div style={{ fontSize: 13, color: '#595959' }}>驳回人: {rejectNode.approverName}（{rejectNode.approverRole}）</div>
              <div style={{ fontSize: 13, color: '#ff4d4f', marginTop: 4 }}>驳回理由: {rejectNode.opinion}</div>
              {rejectNode.time && <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>{rejectNode.time}</div>}
            </div>
          </div>
        ) : null
      })()}

      {/* 审批摘要 */}
      <div className="detail-section">
        <div className="detail-section-title"><FileTextOutlined /> 审批摘要</div>
        <div className="detail-section-body">
          <div style={{ fontSize: 15, fontWeight: 500, color: '#1a1a2e', marginBottom: 12 }}>{record.summary}</div>
          <Descriptions column={3} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 13 }} contentStyle={{ fontSize: 13 }}>
            <Descriptions.Item label="审批单号">{record.id}</Descriptions.Item>
            <Descriptions.Item label="关联单号">{record.bizOrderId}</Descriptions.Item>
            <Descriptions.Item label="审批类型">{approvalTypeText[record.type]}</Descriptions.Item>
            <Descriptions.Item label="申请人">{record.applicant}（{record.applicantRole}）</Descriptions.Item>
            <Descriptions.Item label="经销公司">{record.dealerCompany}</Descriptions.Item>
            {record.amount !== undefined && (
              <Descriptions.Item label="涉及金额">
                <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>
                  {record.amount.toFixed(2)}
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
                </span>
              </Descriptions.Item>
            )}
            {record.plateNo && <Descriptions.Item label="车牌号">{record.plateNo}</Descriptions.Item>}
            {record.brandModel && <Descriptions.Item label="车型">{record.brandModel}</Descriptions.Item>}
          </Descriptions>
        </div>
      </div>

      {/* 审批流程 */}
      <div className="detail-section">
        <div className="detail-section-title"><CarOutlined /> 审批流程</div>
        <div className="detail-section-body">
          <Steps
            current={stepCurrent}
            status={record.status === 'rejected' ? 'error' : undefined}
            items={record.nodes.map((n) => ({
              title: n.nodeName,
              description: (
                <div style={{ fontSize: 12 }}>
                  <div style={{ color: '#8c8c8c' }}>{n.approverName}（{n.approverRole}）</div>
                  {n.opinion && <div style={{ color: n.status === 'rejected' ? '#ff4d4f' : '#52c41a', marginTop: 4 }}>意见: {n.opinion}</div>}
                  {n.time && <div style={{ color: '#bfbfbf', marginTop: 2 }}>{n.time}</div>}
                </div>
              ),
            }))}
            style={{ padding: '8px 0' }}
          />
        </div>
      </div>

      {/* 审批记录时间线 */}
      <div className="detail-section">
        <div className="detail-section-title"><ClockCircleOutlined /> 审批记录</div>
        <div className="detail-section-body">
          <Timeline
            items={[
              {
                color: 'blue',
                children: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{record.applicant} 提交审批申请</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.createTime}</div>
                  </div>
                ),
              },
              ...record.nodes
                .filter((n) => n.status !== 'pending')
                .map((n) => ({
                  color: n.status === 'approved' ? 'green' as const : 'red' as const,
                  children: (
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {n.approverName} {n.status === 'approved' ? '审批通过' : '审批驳回'}
                        <Tag color={n.status === 'approved' ? 'success' : 'error'} style={{ marginLeft: 8, borderRadius: 4 }}>
                          {n.nodeName}
                        </Tag>
                      </div>
                      {n.opinion && <div style={{ fontSize: 13, color: '#595959', marginTop: 4 }}>意见: {n.opinion}</div>}
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{n.time}</div>
                    </div>
                  ),
                })),
              ...(record.nodes.some((n) => n.status === 'pending') ? [{
                color: 'gray' as const,
                children: (
                  <div style={{ color: '#bfbfbf' }}>
                    等待 {record.nodes.find((n) => n.status === 'pending')?.approverName} 审批...
                  </div>
                ),
              }] : []),
            ]}
          />
        </div>
      </div>

      {/* 通过弹窗 */}
      <Modal title="审批通过" open={approveModal} onCancel={() => { setApproveModal(false); setOpinion('') }}
        onOk={() => { message.success(`已通过: ${record.id}`); setApproveModal(false); setOpinion('') }}
        okText="确认通过" okButtonProps={{ style: { background: '#52c41a', borderColor: '#52c41a' } }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: '#8c8c8c' }}>审批单: {record.id}</div>
        <TextArea rows={3} placeholder="请输入审批意见（选填）" value={opinion} onChange={(e) => setOpinion(e.target.value)} />
      </Modal>

      {/* 驳回弹窗 */}
      <Modal title="审批驳回" open={rejectModal} onCancel={() => { setRejectModal(false); setOpinion('') }}
        onOk={() => { message.error(`已驳回: ${record.id}`); setRejectModal(false); setOpinion('') }}
        okText="确认驳回" okButtonProps={{ danger: true }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: '#8c8c8c' }}>审批单: {record.id}</div>
        <TextArea rows={3} placeholder="请输入驳回原因（必填）" value={opinion} onChange={(e) => setOpinion(e.target.value)} />
      </Modal>

      {/* 转交弹窗 */}
      <Modal
        title={<span><SwapOutlined style={{ marginRight: 8 }} />转交审批</span>}
        open={transferModal}
        onCancel={() => { setTransferModal(false); setTransferTo(undefined); setTransferReason('') }}
        onOk={() => {
          const target = transferCandidates.find((c) => c.id === transferTo)
          message.success(`已将审批转交给 ${target?.name}`)
          setTransferModal(false)
          setTransferTo(undefined)
          setTransferReason('')
        }}
        okText="确认转交"
        okButtonProps={{ disabled: !transferTo }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 4 }}>审批单: {record.id}</div>
          <div style={{ fontSize: 13, color: '#1a1a2e' }}>{record.summary}</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>选择转交人</div>
          <Select
            placeholder="请选择转交人"
            value={transferTo}
            onChange={setTransferTo}
            style={{ width: '100%' }}
            options={transferCandidates.map((c) => ({
              value: c.id,
              label: `${c.name}（${c.role}）- ${c.company}`,
            }))}
          />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>转交说明</div>
          <TextArea rows={3} placeholder="请输入转交说明（选填）" value={transferReason} onChange={(e) => setTransferReason(e.target.value)} />
        </div>
      </Modal>
    </div>
  )
}