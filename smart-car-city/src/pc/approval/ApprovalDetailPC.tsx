import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Button, Steps, Descriptions, Input, Space, Modal, Timeline, Empty, Select, message, Table, Alert, Tooltip } from 'antd'
import {
  ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, FileTextOutlined,
  UserOutlined, BankOutlined, CarOutlined, SwapOutlined,
  DollarOutlined, InfoCircleOutlined, WarningOutlined,
} from '@ant-design/icons'
import { mockApprovals } from '../../shared/mock/approvalMock'
import { approvalTypeText } from '../../shared/constants/approvalStatusMap'
import type { VehiclePricingInfo } from '../../shared/types/Approval.types'

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
          <Descriptions column={3} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 13 }} contentStyle={{ fontSize: 13 }}>
            <Descriptions.Item label="审批单号">{record.id}</Descriptions.Item>
            <Descriptions.Item label="关联单号">
              <a onClick={() => {
                const bid = record.bizOrderId
                if (bid.startsWith('CG-')) navigate(`/pc/purchase/${bid}`)
                else if (bid.startsWith('DK-')) navigate(`/pc/fund/advance/${bid}`)
                else if (bid.startsWith('XS-')) navigate(`/pc/sales/${bid}`)
                else if (bid.startsWith('HT-')) navigate(`/pc/contract/${bid}`)
              }} style={{ color: '#1677ff', cursor: 'pointer', textDecoration: 'underline' }}>
                {record.bizOrderId}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="审批类型">{approvalTypeText[record.type]}</Descriptions.Item>
            <Descriptions.Item label="申请人">{record.applicant}（{record.applicantRole}）</Descriptions.Item>
            <Descriptions.Item label="经销公司">{record.dealerCompany}</Descriptions.Item>
            {record.type === 'purchase' && record.amount !== undefined && (
              <Descriptions.Item label="采购金额">
                <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>
                  {record.amount.toFixed(2)}
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
                </span>
              </Descriptions.Item>
            )}
            {record.type !== 'purchase' && record.amount !== undefined && (
              <Descriptions.Item label="涉及金额">
                <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>
                  {record.amount.toFixed(2)}
                  <span style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
                </span>
              </Descriptions.Item>
            )}
            {record.type === 'purchase' && record.purchaseMode && (
              <Descriptions.Item label="采购类型">
                <Tag color={record.purchaseMode === 'batch' ? 'blue' : 'green'} style={{ borderRadius: 4 }}>
                  {record.purchaseMode === 'batch' ? `批量采购（${record.vehiclePricingList?.length || 0}台）` : `单台采购 ${record.plateNo || ''}`}
                </Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </div>

      {/* 垫款审批专用：车辆信息 + 金额 + 收款人 + 额度 */}
      {record.type === 'advance' && record.advanceDetail && (
        <>
          <div className="detail-section">
            <div className="detail-section-title"><CarOutlined /> 车辆信息</div>
            <div className="detail-section-body">
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>{record.advanceDetail.brandModel}</div>
                <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 4 }}>{record.advanceDetail.registerDate} | {record.advanceDetail.condition}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#E8352E' }}>{record.advanceDetail.plateNo}</div>
              </div>
              <Descriptions column={4} size="small" bordered labelStyle={{ color: '#8c8c8c', fontSize: 12, textAlign: 'center' }} contentStyle={{ fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
                <Descriptions.Item label="车辆状态">{record.advanceDetail.vehicleStatus}</Descriptions.Item>
                <Descriptions.Item label="在门店库">{record.advanceDetail.warehouseInfo}</Descriptions.Item>
                <Descriptions.Item label="过户状态">{record.advanceDetail.transferStatus}</Descriptions.Item>
                <Descriptions.Item label="车款">{record.advanceDetail.paymentType}</Descriptions.Item>
              </Descriptions>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="detail-section">
              <div className="detail-section-title"><DollarOutlined /> 金额信息</div>
              <div className="detail-section-body">
                <Descriptions column={1} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 13 }} contentStyle={{ fontSize: 14 }}>
                  <Descriptions.Item label="合同价">
                    <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>{record.advanceDetail.contractPrice.toLocaleString()}元</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="申请垫款">
                    <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>{record.advanceDetail.applyAdvance.toLocaleString()}元</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="成交价">{record.advanceDetail.dealPrice.toLocaleString()}元</Descriptions.Item>
                </Descriptions>
              </div>
            </div>

            <div className="detail-section">
              <div className="detail-section-title"><UserOutlined /> 收款人信息</div>
              <div className="detail-section-body">
                <Descriptions column={1} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 13 }} contentStyle={{ fontSize: 13 }}>
                  <Descriptions.Item label="收款人">{record.advanceDetail.sellerName}</Descriptions.Item>
                  <Descriptions.Item label="开户行">{record.advanceDetail.sellerBank}</Descriptions.Item>
                  <Descriptions.Item label="银行卡号"><span style={{ fontFamily: "'DM Sans', monospace" }}>{record.advanceDetail.sellerCardNo}</span></Descriptions.Item>
                  {record.advanceDetail.sellerPhone && <Descriptions.Item label="手机号">{record.advanceDetail.sellerPhone}</Descriptions.Item>}
                </Descriptions>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <div className="detail-section-title"><BankOutlined /> 门店额度信息</div>
            <div className="detail-section-body">
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {[
                  { label: '待审批垫款', value: record.advanceDetail.pendingAdvance, color: '#fa8c16', bg: '#fff7e6' },
                  { label: '可申请额度', value: record.advanceDetail.applyableQuota, color: '#1890ff', bg: '#e6f7ff' },
                  { label: '可用合作款项', value: record.advanceDetail.availableDeposit, color: record.advanceDetail.availableDeposit < 0 ? '#ff4d4f' : '#52c41a', bg: record.advanceDetail.availableDeposit < 0 ? '#fff2f0' : '#f6ffed' },
                  { label: '可用额度', value: record.advanceDetail.availableQuota, color: '#1a1a2e', bg: '#f5f5f5' },
                ].map((item) => (
                  <div key={item.label} style={{ flex: 1, padding: '14px 12px', borderRadius: 10, background: item.bg, textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Sans', monospace", color: item.color }}>{item.value.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c' }}>元</span></div>
                  </div>
                ))}
              </div>
              {record.advanceDetail.availableDeposit < 0 && (
                <Alert type="error" showIcon icon={<WarningOutlined />} message="本次申请已超实缴合作款项" style={{ marginBottom: 12, borderRadius: 8 }} />
              )}
              <Alert type="info" showIcon icon={<InfoCircleOutlined />} style={{ borderRadius: 8 }}
                message="额度说明"
                description={
                  <div style={{ fontSize: 12, lineHeight: 2 }}>
                    <div>待审批垫款：门店所有待审批垫款汇总求和</div>
                    <div>可用额度：最大额度 - 未销售回款车辆的累计在途金额 - 待审批垫款</div>
                    <div>可用合作款项：合作款项 - 未签注车辆的累计在途金额 - 待审批垫款</div>
                    <div>可申请额度：≤ 可用额度</div>
                  </div>
                }
              />
            </div>
          </div>
        </>
      )}

      {/* 车辆定价信息 - 仅采购审批，紧跟审批摘要 */}
      {record.type === 'purchase' && record.vehiclePricingList && record.vehiclePricingList.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">
            <DollarOutlined /> 车辆定价信息
            {record.vehiclePricingList.length > 1 && (
              <Tag color="blue" style={{ marginLeft: 8, borderRadius: 4 }}>共{record.vehiclePricingList.length}台</Tag>
            )}
          </div>
          <div className="detail-section-body">
            {record.vehiclePricingList.some((v: VehiclePricingInfo) => v.pricingStatus === 'no_price') && (
              <Alert
                type="warning"
                showIcon
                icon={<InfoCircleOutlined />}
                message="部分车辆暂无建议采购价"
                description="定价接口未返回部分车型的建议价格，请审批人结合市场行情自行评估采购价格合理性"
                style={{ marginBottom: 16, borderRadius: 8 }}
              />
            )}
            <Table
              dataSource={record.vehiclePricingList}
              rowKey="vin"
              pagination={false}
              size="middle"
              columns={[
                {
                  title: '车牌号',
                  dataIndex: 'plateNo',
                  width: 110,
                  render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
                },
                {
                  title: '车型',
                  dataIndex: 'brandModel',
                  ellipsis: true,
                },
                {
                  title: '采购价（万）',
                  dataIndex: 'purchasePrice',
                  width: 120,
                  align: 'right' as const,
                  render: (val: number) => (
                    <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, fontSize: 15 }}>
                      {val.toFixed(2)}
                    </span>
                  ),
                },
                {
                  title: '建议采购价（万）',
                  dataIndex: 'suggestedPrice',
                  width: 150,
                  align: 'right' as const,
                  render: (_: number | null, row: VehiclePricingInfo) => {
                    if (row.pricingStatus === 'no_price' || row.suggestedPrice === null) {
                      return (
                        <Tooltip title="定价接口未返回该车型建议价，请自行评估">
                          <Tag color="warning" style={{ borderRadius: 4 }}>暂无定价</Tag>
                        </Tooltip>
                      )
                    }
                    return (
                      <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, fontSize: 15, color: '#1890ff' }}>
                        {row.suggestedPrice.toFixed(2)}
                      </span>
                    )
                  },
                },
                {
                  title: '偏差率',
                  dataIndex: 'deviationRate',
                  width: 130,
                  align: 'center' as const,
                  render: (_: number | undefined, row: VehiclePricingInfo) => {
                    if (row.pricingStatus === 'no_price' || row.deviationRate === undefined) {
                      return <span style={{ color: '#bfbfbf' }}>—</span>
                    }
                    return (
                      <Tag color={row.deviationRate < -10 ? 'error' : row.deviationRate < 0 ? 'success' : 'warning'} style={{ borderRadius: 4 }}>
                        {row.deviationRate > 0 ? '+' : ''}{row.deviationRate.toFixed(2)}%
                      </Tag>
                    )
                  },
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* 门店授信额度 - 仅采购审批 */}
      {record.type === 'purchase' && record.dealerCredit && (
        <div className="detail-section">
          <div className="detail-section-title"><BankOutlined /> 门店授信额度</div>
          <div className="detail-section-body">
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              {[
                { label: '最大额度', value: record.dealerCredit.maxQuota, color: '#1a1a2e', bg: '#f5f5f5' },
                { label: '在途额度', value: record.dealerCredit.inTransitQuota, color: '#fa8c16', bg: '#fff7e6' },
                { label: '可用额度', value: record.dealerCredit.availableQuota, color: record.dealerCredit.availableQuota < 0 ? '#ff4d4f' : '#52c41a', bg: record.dealerCredit.availableQuota < 0 ? '#fff2f0' : '#f6ffed' },
                { label: '可申请额度', value: record.dealerCredit.applyableQuota, color: record.dealerCredit.applyableQuota < 0 ? '#ff4d4f' : '#1890ff', bg: record.dealerCredit.applyableQuota < 0 ? '#fff2f0' : '#e6f7ff' },
              ].map((item) => (
                <div key={item.label} style={{
                  flex: 1, padding: '16px 20px', borderRadius: 12, background: item.bg,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Sans', monospace", color: item.color }}>
                    {item.value.toFixed(2)}
                    <span style={{ fontSize: 13, fontWeight: 400, color: '#8c8c8c', marginLeft: 2 }}>万</span>
                  </div>
                </div>
              ))}
            </div>
            <Descriptions column={2} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 13 }} contentStyle={{ fontSize: 13 }}>
              <Descriptions.Item label="门店名称">{record.dealerCredit.storeName}</Descriptions.Item>
              <Descriptions.Item label="本次采购占用">
                <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#1890ff' }}>
                  {record.dealerCredit.currentPurchaseAmount.toFixed(2)}万
                </span>
              </Descriptions.Item>
            </Descriptions>
            {record.dealerCredit.applyableQuota < 0 && (
              <Alert
                type="error"
                showIcon
                icon={<WarningOutlined />}
                message="额度预警"
                description="可申请额度为负数，请谨慎审批"
                style={{ marginTop: 12, borderRadius: 8 }}
              />
            )}
          </div>
        </div>
      )}

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