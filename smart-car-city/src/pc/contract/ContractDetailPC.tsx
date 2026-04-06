import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Tag, Button, Table, Space, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined, DownloadOutlined, PrinterOutlined, FileTextOutlined,
  CheckCircleOutlined, ClockCircleOutlined, UserOutlined, CarOutlined,
  AuditOutlined, PaperClipOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons'
import { mockContracts } from '../../shared/mock/contractMock'
import type { ContractVehicleItem, ContractParty } from '../../shared/types/Contract.types'

const statusColorMap: Record<string, string> = {
  pending_sign: 'warning', signing: 'processing', signed: 'success', archived: 'default',
}
const statusTextMap: Record<string, string> = {
  pending_sign: '待签署', signing: '签署中', signed: '已签署', archived: '已归档',
}
const typeColorMap: Record<string, string> = {
  '采购合同': 'blue', '销售合同': 'green', '批售合同': 'orange',
}

export default function ContractDetailPC() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const contract = mockContracts.find((c) => c.id === id) || mockContracts[0]
  const signedCount = contract.parties.filter((p) => p.signed).length
  const signPct = Math.round((signedCount / contract.parties.length) * 100)

  const vehicleColumns: ColumnsType<ContractVehicleItem> = [
    { title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 110, render: (v: string) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { title: 'VIN码', dataIndex: 'vin', key: 'vin', width: 200, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v}</span> },
    { title: '品牌型号', dataIndex: 'brandModel', key: 'brandModel', width: 280, ellipsis: true },
    {
      title: '合同价(万)', dataIndex: 'contractPrice', key: 'contractPrice', width: 120, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{v.toFixed(2)}</span>,
    },
  ]

  const partyColumns: ColumnsType<ContractParty> = [
    { title: '角色', dataIndex: 'role', key: 'role', width: 90, render: (v: string) => <Tag>{v}</Tag> },
    { title: '名称', dataIndex: 'name', key: 'name', width: 200, render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (v: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{v || '-'}</span> },
    {
      title: '签署状态', key: 'signStatus', width: 100,
      render: (_: unknown, record: ContractParty) => record.signed
        ? <Tag icon={<CheckCircleOutlined />} color="success">已签署</Tag>
        : <Tag icon={<ClockCircleOutlined />} color="warning">待签署</Tag>,
    },
    {
      title: '签署时间', dataIndex: 'signTime', key: 'signTime', width: 150,
      render: (v: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{v || '-'}</span>,
    },
    {
      title: '委托信息', key: 'delegate', width: 160,
      render: (_: unknown, record: ContractParty) => record.delegated
        ? <span style={{ fontSize: 12, color: '#fa8c16' }}>委托人：{record.delegateName}</span>
        : <span style={{ fontSize: 12, color: '#bfbfbf' }}>-</span>,
    },
  ]

  const flowSteps = [
    { label: '合同生成', done: true },
    { label: '待签署', done: ['signing', 'signed', 'archived'].includes(contract.status) },
    { label: '签署中', done: ['signed', 'archived'].includes(contract.status) },
    { label: '已签署', done: ['signed', 'archived'].includes(contract.status) },
    { label: '归档', done: contract.status === 'archived' },
  ]

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/pc/contract')} />
            <span className="order-id">{contract.id}</span>
            <Tag color={typeColorMap[contract.contractType]} style={{ borderRadius: 4, fontSize: 13 }}>{contract.contractType}</Tag>
            <Tag color={statusColorMap[contract.status]} style={{ borderRadius: 4, fontSize: 13 }}>{statusTextMap[contract.status]}</Tag>
          </div>
          <div className="order-meta">
            <span><ClockCircleOutlined /> {contract.createTime}</span>
            <span><CarOutlined /> {contract.vehicleCount}台车辆</span>
            <span><FileTextOutlined /> 关联：{contract.bizOrderId}</span>
            <span style={{ color: '#E8352E', fontWeight: 600 }}>合同金额：{contract.totalAmount.toFixed(2)}万</span>
          </div>
        </div>
        <Space>
          {contract.hasAttachment && <Button icon={<DownloadOutlined />}>下载合同</Button>}
          <Button icon={<PrinterOutlined />}>打印</Button>
          {contract.status === 'pending_sign' && <Button type="primary" style={{ background: '#E8352E', borderColor: '#E8352E' }}>发起签署</Button>}
          {contract.status === 'signing' && <Button type="primary" style={{ background: '#E8352E', borderColor: '#E8352E' }}>签署合同</Button>}
          {contract.status === 'signed' && <Button type="primary" style={{ background: '#E8352E', borderColor: '#E8352E' }}>归档</Button>}
        </Space>
      </div>

      {/* Flow */}
      <div className="detail-section">
        <div className="detail-section-title"><AuditOutlined /> 合同流程</div>
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
                </div>
                {i < flowSteps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: s.done && flowSteps[i + 1]?.done ? '#E8352E' : '#f0f0f0', margin: '0 8px', marginBottom: 20 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sign progress */}
      <div className="detail-section">
        <div className="detail-section-title">
          <SafetyCertificateOutlined /> 签署进度
          <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400, marginLeft: 8 }}>{signedCount}/{contract.parties.length} 方已签署</span>
          <Progress percent={signPct} size="small" style={{ width: 120, marginLeft: 12, display: 'inline-flex' }}
            strokeColor={signPct === 100 ? '#52c41a' : '#E8352E'} />
        </div>
        <div style={{ padding: '0 4px' }}>
          <Table columns={partyColumns} dataSource={contract.parties} rowKey={(_, i) => String(i)} size="small" pagination={false} />
        </div>
      </div>

      {/* Vehicle table */}
      <div className="detail-section">
        <div className="detail-section-title">
          <CarOutlined /> 车辆清单
          <span style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 400, marginLeft: 8 }}>{contract.vehicleCount}台</span>
        </div>
        <div style={{ padding: '0 4px' }}>
          <Table columns={vehicleColumns} dataSource={contract.vehicles} rowKey="id" size="small" pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}><span style={{ fontWeight: 600 }}>合计</span></Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="right">
                  <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{contract.totalAmount.toFixed(2)}</span>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
      </div>

      {/* Contract info */}
      <div className="detail-section">
        <div className="detail-section-title"><FileTextOutlined /> 合同信息</div>
        <div className="detail-section-body">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">合同号</span>
              <span className="info-value">{contract.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">合同类型</span>
              <span className="info-value">{contract.contractType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">经销公司</span>
              <span className="info-value">{contract.dealerCompany}</span>
            </div>
            <div className="info-item">
              <span className="info-label">关联业务单号</span>
              <span className="info-value">{contract.bizOrderId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">创建时间</span>
              <span className="info-value">{contract.createTime}</span>
            </div>
            <div className="info-item">
              <span className="info-label">签署完成时间</span>
              <span className="info-value">{contract.signTime || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="detail-section">
        <div className="detail-section-title"><PaperClipOutlined /> 合同附件</div>
        <div className="detail-section-body">
          {contract.hasAttachment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                <FileTextOutlined style={{ color: '#8c8c8c' }} />
                <span style={{ fontSize: 13, flex: 1 }}>{contract.id}_合同.pdf</span>
                <Button type="link" size="small" icon={<DownloadOutlined />}>下载</Button>
              </div>
              {contract.offlineUpload && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                  <FileTextOutlined style={{ color: '#8c8c8c' }} />
                  <span style={{ fontSize: 13, flex: 1 }}>{contract.id}_扫描件.jpg（线下上传）</span>
                  <Button type="link" size="small" icon={<DownloadOutlined />}>下载</Button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#bfbfbf', fontSize: 13 }}>暂无附件</div>
          )}
        </div>
      </div>
    </div>
  )
}
