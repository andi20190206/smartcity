import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Tag, Button, Table, Tabs, Descriptions, Tooltip, Modal, Timeline, Radio } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined, DownloadOutlined, PrinterOutlined, FileTextOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CarOutlined,
  InfoCircleOutlined, PictureOutlined, AuditOutlined,
} from '@ant-design/icons'
import { mockContracts } from '../../shared/mock/contractMock'
import type { ContractVehicleItem } from '../../shared/types/Contract.types'

export default function ContractDetailPC() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contract = mockContracts.find((c) => c.id === id) || mockContracts[0]
  const [pricingOpen, setPricingOpen] = useState(false)
  const isPurchase = contract.contractType === '采购合同'

  const vehicleColumns: ColumnsType<ContractVehicleItem> = [
    { title: '序号', key: 'index', width: 50, align: 'center', render: (_: unknown, __: unknown, i: number) => i + 1 },
    { title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 100, render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: 'VIN', dataIndex: 'vin', key: 'vin', width: 180, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v}</span> },
    { title: '品牌型号', dataIndex: 'brandModel', key: 'brandModel', width: 200, ellipsis: true },
    { title: '投保情况', dataIndex: 'insurance', key: 'insurance', width: 80 },
    { title: '里程(万公里)', dataIndex: 'mileage', key: 'mileage', width: 100, align: 'right', render: (v: number) => v !== undefined ? <span style={{ fontFamily: "'DM Sans', monospace" }}>{v}</span> : '-' },
    { title: '上牌日期', dataIndex: 'registerDate', key: 'registerDate', width: 100, render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v || '-'}</span> },
    { title: '车辆年检有效期', dataIndex: 'annualInspection', key: 'annualInspection', width: 120, render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v || '-'}</span> },
    { title: '颜色', dataIndex: 'color', key: 'color', width: 70 },
    { title: '过户次数', dataIndex: 'transferCount', key: 'transferCount', width: 80, align: 'center' },
    {
      title: '采购价(万元)', dataIndex: 'contractPrice', key: 'contractPrice', width: 110, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{v.toFixed(2)}</span>,
    },
    { title: '车况', dataIndex: 'condition', key: 'condition', width: 60, render: (v: string) => v === '好' ? <Tag color="green">好</Tag> : <Tag color="orange">{v || '-'}</Tag> },
  ]

  // 第三方估价表格列
  const pricingColumns: ColumnsType<ContractVehicleItem> = [
    { title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 100 },
    { title: 'VIN', dataIndex: 'vin', key: 'vin', width: 180, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v}</span> },
    { title: '新车指导价', dataIndex: 'newCarGuidePrice', key: 'newCarGuidePrice', width: 100, align: 'right', render: (v: number | null) => v ? `${v.toFixed(2)}万` : '-' },
    { title: '估价', dataIndex: 'thirdPartyPrice', key: 'thirdPartyPrice', width: 90, align: 'right', render: (v: number | null) => v ? <span style={{ color: '#E8352E', fontWeight: 600 }}>{v.toFixed(2)}万</span> : <Tag color="warning">暂无</Tag> },
    { title: '车龄', dataIndex: 'vehicleAge', key: 'vehicleAge', width: 60 },
    { title: '车况里程', key: 'condMileage', width: 80, render: (_: unknown, r: ContractVehicleItem) => r.mileage !== undefined ? `${r.mileage}万` : '-' },
  ]

  // 新车指导价估价列（列表页弹窗用）
  const pricingCompareColumns: ColumnsType<ContractVehicleItem> = [
    { title: '车牌', dataIndex: 'plateNo', width: 90 },
    { title: 'VIN', dataIndex: 'vin', width: 170, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 11 }}>{v}</span> },
    { title: '新车指导价', dataIndex: 'newCarGuidePrice', width: 90, align: 'right', render: (v: number | null) => v ? `${v}万` : '-' },
    { title: '估价', dataIndex: 'thirdPartyPrice', width: 80, align: 'right', render: (v: number | null) => v ? <span style={{ fontWeight: 600 }}>{v}万</span> : '—' },
    { title: '车龄', dataIndex: 'vehicleAge', width: 50 },
    { title: '车况里程', key: 'cm', width: 70, render: (_: unknown, r: ContractVehicleItem) => r.mileage ? `${r.mileage}万` : '-' },
  ]

  // 审批流程 mock
  const approvalFlow = [
    { name: '法务审核', status: 'done' as const, user: '韩跑跑' },
    { name: '财务审核', status: 'done' as const, user: '韩跑跑' },
    { name: '总经理审批', status: contract.approvalStatus === '审批中' ? 'current' as const : 'done' as const, user: contract.approver || '-' },
    { name: '副总裁审批', status: 'pending' as const, user: '王总' },
    { name: '流程审核', status: contract.approvalStatus === '通过/不通过' ? 'done' as const : 'pending' as const, user: '系统', time: contract.approvalStatus === '通过/不通过' ? '2025-11-16 13:00:00' : undefined },
  ]

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header" style={{ background: '#E8352E', color: '#fff', borderRadius: '12px 12px 0 0', padding: '16px 24px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button type="text" icon={<ArrowLeftOutlined style={{ color: '#fff' }} />} onClick={() => navigate('/pc/contract')} style={{ color: '#fff' }} />
            <span style={{ fontSize: 16, fontWeight: 700 }}>合同详情</span>
            <span style={{ opacity: 0.7, fontSize: 13, fontFamily: "'DM Sans', monospace" }}>×</span>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{
        background: '#fff', border: '1px solid #f0f0f0', borderRadius: '0 0 12px 12px',
        padding: '16px 24px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 32px', alignItems: 'center',
      }}>
        <div><span style={{ color: '#8c8c8c', fontSize: 12 }}>采购单号：</span><span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}>{contract.id}</span></div>
        <div><span style={{ color: '#8c8c8c', fontSize: 12 }}>采购创建时间：</span><span style={{ fontSize: 13 }}>{contract.createTime}</span></div>
        <div><span style={{ color: '#8c8c8c', fontSize: 12 }}>业务员：</span><span>{contract.salesperson || '-'}</span></div>
        <div><span style={{ color: '#8c8c8c', fontSize: 12 }}>采购量：</span><span style={{ fontWeight: 600 }}>{contract.vehicleCount} 台</span></div>
        <div><span style={{ color: '#8c8c8c', fontSize: 12 }}>采购总价：</span><span style={{ fontWeight: 700, color: '#E8352E', fontFamily: "'DM Sans', monospace" }}>{contract.totalAmount.toFixed(1)}</span></div>
        {isPurchase && (
          <>
            <div>
              <span style={{ color: '#8c8c8c', fontSize: 12 }}>在途额度(万元)：</span>
              <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#fa8c16' }}>{contract.inTransitQuota}</span>
            </div>
            <div>
              <Tooltip title={
                <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                  <div>最大额度：门店可累计使用最大额度</div>
                  <div>在途额度：未销售回款车辆的累计在途金额 + 待审批垫款</div>
                  <div>可用额度：最大额度 - 在途额度</div>
                </div>
              }>
                <span style={{ color: '#8c8c8c', fontSize: 12 }}>最大额度(万元)：<InfoCircleOutlined style={{ fontSize: 11 }} /></span>
              </Tooltip>
              <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600 }}> {contract.maxQuota}</span>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="detail-section" style={{ marginBottom: 0 }}>
            <Tabs defaultActiveKey="vehicles" style={{ padding: '0 20px' }} items={[
              {
                key: 'vehicles',
                label: <span><CarOutlined /> 车辆信息</span>,
                children: (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: '#8c8c8c' }}>共 {contract.vehicles.length} 台车辆</span>
                      <Button type="link" size="small" onClick={() => setPricingOpen(true)}>平台建议采购价 ↗</Button>
                    </div>
                    <Table columns={vehicleColumns} dataSource={contract.vehicles} rowKey="id" size="small" pagination={false} scroll={{ x: 1300 }}
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={10}><span style={{ fontWeight: 600 }}>合计</span></Table.Summary.Cell>
                          <Table.Summary.Cell index={10} align="right">
                            <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E' }}>{contract.totalAmount.toFixed(2)}</span>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={11} />
                        </Table.Summary.Row>
                      )}
                    />
                  </div>
                ),
              },
              {
                key: 'owner',
                label: '车主信息',
                children: contract.ownerInfo ? (
                  <Descriptions column={2} size="small" labelStyle={{ color: '#8c8c8c', width: 120 }} style={{ padding: '8px 0' }}>
                    <Descriptions.Item label="车主类型">{contract.ownerInfo.ownerType}</Descriptions.Item>
                    <Descriptions.Item label={contract.ownerInfo.ownerType === '企业' ? '企业名称' : '车主姓名'}>{contract.ownerInfo.ownerName}</Descriptions.Item>
                    <Descriptions.Item label="证件号码">{contract.ownerInfo.idNo}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{contract.ownerInfo.phone}</Descriptions.Item>
                  </Descriptions>
                ) : <div style={{ padding: 20, color: '#bfbfbf', textAlign: 'center' }}>暂无车主信息</div>,
              },
              {
                key: 'payee',
                label: '收款信息',
                children: contract.payeeInfo ? (
                  <Descriptions column={2} size="small" labelStyle={{ color: '#8c8c8c', width: 120 }} style={{ padding: '8px 0' }}>
                    <Descriptions.Item label="收款人身份">{contract.payeeInfo.payeeIdentity}</Descriptions.Item>
                    <Descriptions.Item label="收款人姓名">{contract.payeeInfo.payeeName}</Descriptions.Item>
                    <Descriptions.Item label="收款人账号">{contract.payeeInfo.payeeIdNo}</Descriptions.Item>
                    <Descriptions.Item label="收款人手机">{contract.payeeInfo.payeePhone}</Descriptions.Item>
                    <Descriptions.Item label="开户行">{contract.payeeInfo.payeeBank}</Descriptions.Item>
                    <Descriptions.Item label="经营银行卡号">{contract.payeeInfo.payeeCardNo}</Descriptions.Item>
                  </Descriptions>
                ) : <div style={{ padding: 20, color: '#bfbfbf', textAlign: 'center' }}>暂无收款信息</div>,
              },
              {
                key: 'delivery',
                label: '交车信息',
                children: contract.deliveryInfo ? (
                  <Descriptions column={2} size="small" labelStyle={{ color: '#8c8c8c', width: 120 }} style={{ padding: '8px 0' }}>
                    <Descriptions.Item label="交车时间">{contract.deliveryInfo.deliveryDate}</Descriptions.Item>
                    <Descriptions.Item label="交车地点">{contract.deliveryInfo.deliveryLocation}</Descriptions.Item>
                  </Descriptions>
                ) : <div style={{ padding: 20, color: '#bfbfbf', textAlign: 'center' }}>暂无交车信息</div>,
              },
              {
                key: 'sign',
                label: '签名确认',
                children: (
                  <div style={{ padding: '12px 0', display: 'flex', gap: 32 }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>业务员签名：</div>
                      <div style={{ width: 120, height: 80, border: '1px dashed #d9d9d9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf' }}>
                        <PictureOutlined style={{ fontSize: 24 }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>车主/委托人签名：</div>
                      <div style={{ width: 120, height: 80, border: '1px dashed #d9d9d9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfbfbf' }}>
                        <PictureOutlined style={{ fontSize: 24 }} />
                      </div>
                    </div>
                  </div>
                ),
              },
            ]} />
          </div>

          {/* 审批资料 - 车辆照片 */}
          {isPurchase && (
            <div className="detail-section" style={{ marginTop: 16 }}>
              <div className="detail-section-title"><PictureOutlined /> 审批资料</div>
              <div className="detail-section-body">
                {contract.vehicles.map((v, idx) => (
                  <div key={v.id} style={{ marginBottom: idx < contract.vehicles.length - 1 ? 16 : 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      车辆：{v.plateNo} <span style={{ fontWeight: 400, color: '#8c8c8c', marginLeft: 8 }}>VIN：{v.vin}</span>
                      <span style={{ fontWeight: 400, color: '#8c8c8c', marginLeft: 8 }}>品牌型号：{v.brandModel}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      {['行驶证', '登记证', '身份证'].map((label) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: 80, height: 60, background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PictureOutlined style={{ fontSize: 20, color: '#d9d9d9' }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#8c8c8c' }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 审批进度 sidebar */}
        {isPurchase && (
          <div style={{ width: 260, flexShrink: 0 }}>
            <div className="detail-section" style={{ position: 'sticky', top: 80 }}>
              <div className="detail-section-title"><AuditOutlined /> 审批进度</div>
              <div className="detail-section-body" style={{ padding: '12px 16px' }}>
                <Timeline items={approvalFlow.map((step) => ({
                  color: step.status === 'done' ? 'green' : step.status === 'current' ? 'blue' : 'gray',
                  dot: step.status === 'done' ? <CheckCircleOutlined style={{ fontSize: 14 }} /> : step.status === 'current' ? <ClockCircleOutlined style={{ fontSize: 14, color: '#1677ff' }} /> : undefined,
                  children: (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: step.status === 'current' ? 600 : 400, color: step.status === 'pending' ? '#bfbfbf' : '#1a1a2e' }}>{step.name}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{step.user}</div>
                      {step.time && <div style={{ fontSize: 11, color: '#bfbfbf' }}>{step.time}</div>}
                    </div>
                  ),
                }))} />
                <Button type="link" size="small" onClick={() => setPricingOpen(true)} style={{ padding: 0, fontSize: 12 }}>
                  查看第三方平台估价 →
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 第三方平台估价弹窗 */}
      <Modal
        title="第三方平台估价"
        open={pricingOpen}
        onCancel={() => setPricingOpen(false)}
        footer={<Button type="primary" onClick={() => setPricingOpen(false)}>确定</Button>}
        width={700}
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>车辆原始信息</div>
          <Table columns={pricingCompareColumns} dataSource={contract.vehicles} rowKey="id" size="small" pagination={false} scroll={{ x: 560 }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>车辆估价信息</div>
          <Table columns={pricingColumns} dataSource={contract.vehicles} rowKey="id" size="small" pagination={false} scroll={{ x: 600 }} />
        </div>
        {contract.vehicles.some((v) => v.thirdPartyPrice === null) && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#fff7e6', border: '1px solid #ffe58f', borderRadius: 6, fontSize: 12, color: '#d48806' }}>
            <InfoCircleOutlined style={{ marginRight: 6 }} />部分车辆暂无第三方估价数据，请结合市场行情自行评估
          </div>
        )}
      </Modal>
    </div>
  )
}
