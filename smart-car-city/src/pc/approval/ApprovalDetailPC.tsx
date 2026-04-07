import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Button, Steps, Descriptions, Input, Space, Modal, Timeline, Empty, Select, message, Table, Alert, Tooltip, Tabs } from 'antd'
import {
  ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, FileTextOutlined,
  UserOutlined, BankOutlined, CarOutlined, SwapOutlined,
  DollarOutlined, InfoCircleOutlined, WarningOutlined, PictureOutlined,
} from '@ant-design/icons'
import { mockApprovals } from '../../shared/mock/approvalMock'
import { mockOrders } from '../../shared/mock/purchaseMock'
import { approvalTypeText } from '../../shared/constants/approvalStatusMap'
import type { VehiclePricingInfo } from '../../shared/types/Approval.types'
import { vehicleDocImages, vehiclePhotoImages, maintenanceImages } from '../../shared/constants/docImages'

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
  const linkedOrder = record.type === 'purchase' ? mockOrders.find((o) => o.id === record.bizOrderId) : null

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
                let path = ''
                if (bid.startsWith('CG-')) path = `/pc/purchase/${bid}`
                else if (bid.startsWith('DK-')) path = `/pc/fund/advance/${bid}`
                else if (bid.startsWith('XS-')) path = `/pc/sales/${bid}`
                else if (bid.startsWith('HT-')) path = `/pc/contract/${bid}`
                if (path) window.open(`${window.location.origin}${window.location.pathname}#${path}`, '_blank')
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

      {/* 采购审批：门店授信额度（摘要下方） */}
      {record.type === 'purchase' && record.dealerCredit && (
        <div className="detail-section">
          <div className="detail-section-title"><BankOutlined /> 门店授信额度</div>
          <div className="detail-section-body">
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              {[
                { label: '最大额度', value: record.dealerCredit.maxQuota, color: '#1a1a2e', bg: '#f5f5f5' },
                { label: '在途额度', value: record.dealerCredit.inTransitQuota, color: '#fa8c16', bg: '#fff7e6' },
                { label: '可用额度', value: record.dealerCredit.availableQuota, color: record.dealerCredit.availableQuota < 0 ? '#ff4d4f' : '#52c41a', bg: record.dealerCredit.availableQuota < 0 ? '#fff2f0' : '#f6ffed' },
                { label: '可申请额度', value: record.dealerCredit.applyableQuota, color: record.dealerCredit.applyableQuota < 0 ? '#ff4d4f' : '#1890ff', bg: record.dealerCredit.applyableQuota < 0 ? '#fff2f0' : '#e6f7ff' },
              ].map((item) => (
                <div key={item.label} style={{ flex: 1, padding: '14px 16px', borderRadius: 10, background: item.bg, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Sans', monospace", color: item.color }}>{item.value.toFixed(2)}<span style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c' }}>万</span></div>
                </div>
              ))}
            </div>
            {record.dealerCredit.applyableQuota < 0 && (
              <Alert type="error" showIcon icon={<WarningOutlined />} message="额度预警：可申请额度为负数，请谨慎审批" style={{ borderRadius: 8 }} />
            )}
          </div>
        </div>
      )}

      {/* 采购审批：Tab 布局 */}
      {record.type === 'purchase' && (
        <div className="detail-section">
          <Tabs defaultActiveKey="pricing" style={{ padding: '0 20px' }} items={[
            ...(record.vehiclePricingList && record.vehiclePricingList.length > 0 ? [{
              key: 'pricing',
              label: <span><DollarOutlined /> 车辆定价</span>,
              children: (
                <div>
                  {record.vehiclePricingList!.some((v: VehiclePricingInfo) => v.pricingStatus === 'no_price') && (
                    <Alert type="warning" showIcon icon={<InfoCircleOutlined />} message="部分车辆暂无建议采购价" description="定价接口未返回部分车型的建议价格，请审批人结合市场行情自行评估" style={{ marginBottom: 12, borderRadius: 8 }} />
                  )}
                  <Table dataSource={record.vehiclePricingList} rowKey="vin" pagination={false} size="middle"
                    columns={[
                      { title: '车牌号', dataIndex: 'plateNo', width: 110, render: (t: string) => <span style={{ fontWeight: 500 }}>{t}</span> },
                      { title: '车型', dataIndex: 'brandModel', ellipsis: true },
                      { title: '采购价（万）', dataIndex: 'purchasePrice', width: 110, align: 'right' as const, render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700 }}>{v.toFixed(2)}</span> },
                      { title: '建议采购价（万）', dataIndex: 'suggestedPrice', width: 140, align: 'right' as const, render: (_: number | null, r: VehiclePricingInfo) => r.pricingStatus === 'no_price' || r.suggestedPrice === null ? <Tooltip title="定价接口未返回"><Tag color="warning">暂无</Tag></Tooltip> : <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#1890ff' }}>{r.suggestedPrice.toFixed(2)}</span> },
                      { title: '偏差率', dataIndex: 'deviationRate', width: 110, align: 'center' as const, render: (_: number | undefined, r: VehiclePricingInfo) => r.pricingStatus === 'no_price' || r.deviationRate === undefined ? <span style={{ color: '#bfbfbf' }}>—</span> : <Tag color={r.deviationRate < -10 ? 'error' : r.deviationRate < 0 ? 'success' : 'warning'}>{r.deviationRate > 0 ? '+' : ''}{r.deviationRate.toFixed(2)}%</Tag> },
                    ]}
                  />
                </div>
              ),
            }] : []),
            ...(linkedOrder ? [{
              key: 'vehicles',
              label: <span><CarOutlined /> 车辆明细</span>,
              children: (
                <div>
                  {linkedOrder.vehicles.map((v, vi) => (
                    <div key={v.id} style={{ marginBottom: vi < linkedOrder.vehicles.length - 1 ? 16 : 0, border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0', fontWeight: 600, fontSize: 13 }}>
                        {v.plateNo} <span style={{ fontWeight: 400, color: '#8c8c8c', marginLeft: 8 }}>{v.brandModel}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                        {[
                          { label: 'VIN码', value: v.vin, mono: true },
                          { label: '颜色', value: v.color },
                          { label: '里程', value: `${v.mileage}万km` },
                          { label: '上牌日期', value: v.registerDate },
                          { label: '年检有效期', value: v.annualInspection },
                          { label: '过户次数', value: `${v.transferCount}次` },
                          { label: '采购价', value: `${v.price.toFixed(2)}万`, highlight: true },
                          { label: '车况', value: v.condition },
                          { label: '碰撞', value: v.collision },
                          { label: '水泡', value: v.waterDamage },
                          { label: '火烧', value: v.fireDamage },
                          { label: '维保报告', value: v.maintenanceReport },
                        ].map((item) => (
                          <div key={item.label} style={{ padding: '10px 16px', borderBottom: '1px solid #f5f5f5', borderRight: '1px solid #f5f5f5' }}>
                            <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4 }}>{item.label}</div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: item.highlight ? '#E8352E' : '#1a1a2e', fontFamily: item.mono ? "'DM Sans', monospace" : undefined, wordBreak: 'break-all' }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            }] : []),
            ...(linkedOrder ? [{
              key: 'seller',
              label: <span><UserOutlined /> 卖方信息</span>,
              children: (
                <div>
                  <Descriptions column={4} size="small" labelStyle={{ color: '#8c8c8c', fontSize: 13 }} contentStyle={{ fontSize: 13 }}>
                    <Descriptions.Item label="车主类型">{linkedOrder.ownerType}</Descriptions.Item>
                    <Descriptions.Item label="姓名/企业">{linkedOrder.ownerName}</Descriptions.Item>
                    <Descriptions.Item label="证件号码"><span style={{ fontFamily: "'DM Sans', monospace" }}>{linkedOrder.ownerIdNo}</span></Descriptions.Item>
                    <Descriptions.Item label="联系电话">{linkedOrder.ownerPhone}</Descriptions.Item>
                    <Descriptions.Item label="收款人身份">{linkedOrder.payeeIdentity}</Descriptions.Item>
                    <Descriptions.Item label="收款人">{linkedOrder.payeeName}</Descriptions.Item>
                    <Descriptions.Item label="开户行">{linkedOrder.payeeBank}</Descriptions.Item>
                    <Descriptions.Item label="银行卡号"><span style={{ fontFamily: "'DM Sans', monospace" }}>{linkedOrder.payeeCardNo}</span></Descriptions.Item>
                  </Descriptions>
                </div>
              ),
            }] : []),
            {
              key: 'maintenance',
              label: '维保查询',
              children: (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[
                    { title: '维保记录', btn: '查询维保' },
                    { title: '出险记录', btn: '查询出险' },
                    { title: '电池评估', btn: '查询电池' },
                  ].map((item) => (
                    <div key={item.title} style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{item.title}</div>
                      <div style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 12 }}>无查询结果</div>
                      <Button size="small" type="link">{item.btn}</Button>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: 'photos',
              label: <span><PictureOutlined /> 证件照片</span>,
              children: (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>行驶证 & 登记证</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                    {(['行驶证正本', '行驶证副本', '登记证首页', '登记证内页'] as const).map((label, i) => {
                      const srcs = [vehicleDocImages.licenseF, vehicleDocImages.licenseB, vehicleDocImages.regF, vehicleDocImages.regB]
                      return (
                        <div key={label} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', position: 'relative' }}>
                          <img src={srcs[i]} alt={label} style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '12px 6px 4px', fontSize: 11, color: '#fff', textAlign: 'center' }}>{label}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>车辆图片</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                    {([['左前45°', vehiclePhotoImages.lf45], ['右后45°', vehiclePhotoImages.rb45], ['仪表盘', vehiclePhotoImages.dashboard], ['座椅', vehiclePhotoImages.seat], ['铭牌', vehiclePhotoImages.nameplate], ['发动机舱', vehiclePhotoImages.engine]] as const).map(([label, src]) => (
                      <div key={label} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', position: 'relative' }}>
                        <img src={src} alt={label} style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '10px 4px 3px', fontSize: 10, color: '#fff', textAlign: 'center' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              key: 'flow',
              label: '审批流程',
              children: (
                <div>
                  <Steps current={stepCurrent} status={record.status === 'rejected' ? 'error' : undefined} style={{ marginBottom: 24 }}
                    items={record.nodes.map((n) => ({
                      title: n.nodeName,
                      description: <div style={{ fontSize: 12 }}><div style={{ color: '#8c8c8c' }}>{n.approverName}（{n.approverRole}）</div>{n.opinion && <div style={{ color: n.status === 'rejected' ? '#ff4d4f' : '#52c41a', marginTop: 4 }}>意见: {n.opinion}</div>}{n.time && <div style={{ color: '#bfbfbf', marginTop: 2 }}>{n.time}</div>}</div>,
                    }))}
                  />
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>审批记录</div>
                  <Timeline items={[
                    { color: 'blue' as const, children: <div><div style={{ fontWeight: 500 }}>{record.applicant} 提交审批申请</div><div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.createTime}</div></div> },
                    ...record.nodes.filter((n) => n.status !== 'pending').map((n) => ({
                      color: (n.status === 'approved' ? 'green' : 'red') as 'green' | 'red',
                      children: <div><div style={{ fontWeight: 500 }}>{n.approverName} {n.status === 'approved' ? '审批通过' : '审批驳回'} <Tag color={n.status === 'approved' ? 'success' : 'error'} style={{ marginLeft: 8, borderRadius: 4 }}>{n.nodeName}</Tag></div>{n.opinion && <div style={{ fontSize: 13, color: '#595959', marginTop: 4 }}>意见: {n.opinion}</div>}<div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{n.time}</div></div>,
                    })),
                    ...(record.nodes.some((n) => n.status === 'pending') ? [{ color: 'gray' as const, children: <div style={{ color: '#bfbfbf' }}>等待 {record.nodes.find((n) => n.status === 'pending')?.approverName} 审批...</div> }] : []),
                  ]} />
                </div>
              ),
            },
          ]} />
        </div>
      )}

      {/* 非采购审批：垫款详情 + 审批流程 + 记录 */}
      {record.type !== 'purchase' && (
        <>
          {/* 垫款审批专用 */}
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
                      <Descriptions.Item label="合同价"><span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>{record.advanceDetail.contractPrice.toLocaleString()}元</span></Descriptions.Item>
                      <Descriptions.Item label="申请垫款"><span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 16 }}>{record.advanceDetail.applyAdvance.toLocaleString()}元</span></Descriptions.Item>
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
                  {record.advanceDetail.availableDeposit < 0 && <Alert type="error" showIcon icon={<WarningOutlined />} message="本次申请已超实缴合作款项" style={{ marginBottom: 12, borderRadius: 8 }} />}
                  <Alert type="info" showIcon icon={<InfoCircleOutlined />} style={{ borderRadius: 8 }} message="额度说明"
                    description={<div style={{ fontSize: 12, lineHeight: 2 }}><div>待审批垫款：门店所有待审批垫款汇总求和</div><div>可用额度：最大额度 - 未销售回款车辆的累计在途金额 - 待审批垫款</div><div>可用合作款项：合作款项 - 未签注车辆的累计在途金额 - 待审批垫款</div><div>可申请额度：≤ 可用额度</div></div>} />
                </div>
              </div>
            </>
          )}
          {/* 审批流程 */}
          <div className="detail-section">
            <div className="detail-section-title"><CarOutlined /> 审批流程</div>
            <div className="detail-section-body">
              <Steps current={stepCurrent} status={record.status === 'rejected' ? 'error' : undefined}
                items={record.nodes.map((n) => ({ title: n.nodeName, description: <div style={{ fontSize: 12 }}><div style={{ color: '#8c8c8c' }}>{n.approverName}（{n.approverRole}）</div>{n.opinion && <div style={{ color: n.status === 'rejected' ? '#ff4d4f' : '#52c41a', marginTop: 4 }}>意见: {n.opinion}</div>}{n.time && <div style={{ color: '#bfbfbf', marginTop: 2 }}>{n.time}</div>}</div> }))}
                style={{ padding: '8px 0' }} />
            </div>
          </div>
          <div className="detail-section">
            <div className="detail-section-title"><ClockCircleOutlined /> 审批记录</div>
            <div className="detail-section-body">
              <Timeline items={[
                { color: 'blue' as const, children: <div><div style={{ fontWeight: 500 }}>{record.applicant} 提交审批申请</div><div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.createTime}</div></div> },
                ...record.nodes.filter((n) => n.status !== 'pending').map((n) => ({ color: (n.status === 'approved' ? 'green' : 'red') as 'green' | 'red', children: <div><div style={{ fontWeight: 500 }}>{n.approverName} {n.status === 'approved' ? '审批通过' : '审批驳回'} <Tag color={n.status === 'approved' ? 'success' : 'error'} style={{ marginLeft: 8, borderRadius: 4 }}>{n.nodeName}</Tag></div>{n.opinion && <div style={{ fontSize: 13, color: '#595959', marginTop: 4 }}>意见: {n.opinion}</div>}<div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{n.time}</div></div> })),
                ...(record.nodes.some((n) => n.status === 'pending') ? [{ color: 'gray' as const, children: <div style={{ color: '#bfbfbf' }}>等待 {record.nodes.find((n) => n.status === 'pending')?.approverName} 审批...</div> }] : []),
              ]} />
            </div>
          </div>
        </>
      )}

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