import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Button, Descriptions, Table, Space, Badge, Timeline, Card } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined, EnvironmentOutlined, WarningOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons'
import {
  mockSupervisedVehicles, mockAlertRecords, mockVehicleUseRecords,
} from '../../shared/mock/inventoryMock'
import type { AlertRecord, VehicleUseRecord } from '../../shared/types/Inventory.types'

const stockStatusColorMap: Record<string, string> = {
  pending_in: 'warning', in_stock: 'success', out_stock: 'processing', transferred: 'default',
}
const supervisionStatusColorMap: Record<string, string> = {
  pending: 'warning', supervising: 'success', released: 'default',
}

export default function InventoryDetailPC() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = mockSupervisedVehicles.find((v) => v.id === id)

  if (!vehicle) {
    return (
      <div className="detail-page">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#8c8c8c' }}>车辆不存在</div>
      </div>
    )
  }

  const relatedAlerts = mockAlertRecords.filter((a) => a.plateNo === vehicle.plateNo)
  const relatedUse = mockVehicleUseRecords.filter((u) => u.plateNo === vehicle.plateNo)

  const alertColumns: ColumnsType<AlertRecord> = [
    {
      title: '告警编号', dataIndex: 'alertNo', key: 'alertNo', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    {
      title: '等级', dataIndex: 'alertLevel', key: 'alertLevel', width: 70,
      render: (v: string) => <Tag color={v === 'high' ? 'error' : v === 'medium' ? 'warning' : 'processing'} style={{ borderRadius: 4 }}>{v === 'high' ? '高' : v === 'medium' ? '中' : '低'}</Tag>,
    },
    {
      title: '状态', dataIndex: 'alertStatus', key: 'alertStatus', width: 80,
      render: (_: unknown, r: AlertRecord) => <Tag color={r.alertStatus === 'alerting' ? 'error' : r.alertStatus === 'processing' ? 'warning' : 'default'} style={{ borderRadius: 4 }}>{r.alertStatusText}</Tag>,
    },
    { title: '类型', dataIndex: 'alertType', key: 'alertType', width: 110 },
    { title: '内容', dataIndex: 'alertContent', key: 'alertContent', ellipsis: true },
    {
      title: '触发时间', dataIndex: 'triggerTime', key: 'triggerTime', width: 160,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t}</span>,
    },
  ]

  const useColumns: ColumnsType<VehicleUseRecord> = [
    {
      title: '用车单号', dataIndex: 'id', key: 'id', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span>,
    },
    {
      title: '用车类型', dataIndex: 'useType', key: 'useType', width: 100,
      render: (v: string) => <Tag color="blue" style={{ borderRadius: 4 }}>{v}</Tag>,
    },
    { title: '提车人', key: 'picker', width: 120, render: (_: unknown, r: VehicleUseRecord) => `${r.pickerName}（${r.pickerType}）` },
    {
      title: '状态', key: 'status', width: 80,
      render: (_: unknown, r: VehicleUseRecord) => {
        const cm: Record<string, string> = { using: 'processing', completed: 'success', expired: 'default', pending_approval: 'warning', rejected: 'error' }
        return <Tag color={cm[r.useStatus]} style={{ borderRadius: 4 }}>{r.useStatusText}</Tag>
      },
    },
    { title: '用车时段', dataIndex: 'useDuration', key: 'useDuration', render: (v: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{v}</span> },
  ]

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
            <span className="order-id">{vehicle.plateNo}</span>
            <Tag color={stockStatusColorMap[vehicle.stockStatus]} style={{ borderRadius: 4, fontSize: 13 }}>{vehicle.stockStatusText}</Tag>
            <Tag color={supervisionStatusColorMap[vehicle.supervisionStatus]} style={{ borderRadius: 4, fontSize: 13 }}>{vehicle.supervisionStatusText}</Tag>
            {vehicle.isScrapped && <Tag color="error">报废车</Tag>}
            {vehicle.isSpecialEntry && <Tag color="warning">特殊入库</Tag>}
          </div>
          <div className="order-meta">
            <span>{vehicle.brandModel}</span>
            <span style={{ fontFamily: "'DM Sans', monospace" }}>VIN: {vehicle.vin}</span>
            <span><EnvironmentOutlined /> {vehicle.location}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 36, fontWeight: 700, fontFamily: "'DM Sans', monospace", letterSpacing: -1,
            color: vehicle.stockDays >= 60 ? '#ff4d4f' : vehicle.stockDays >= 45 ? '#fa8c16' : '#1a1a2e',
          }}>
            {vehicle.stockDays}
            <span style={{ fontSize: 14, fontWeight: 400, color: '#8c8c8c', marginLeft: 4 }}>天库龄</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
            <Badge status={vehicle.deviceOnline === 'online' ? 'success' : 'default'} text={`设备${vehicle.deviceOnline === 'online' ? '在线' : '离线'}`} />
            <Badge status={vehicle.cameraStatus === '正常' ? 'success' : 'error'} text={`摄像头${vehicle.cameraStatus}`} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* 车辆信息 */}
        <div className="detail-section">
          <div className="detail-section-title">车辆信息</div>
          <div className="detail-section-body">
            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: '设备编号', value: vehicle.deviceNo || '未绑定' },
                { label: '监管方案', value: vehicle.supervisionPlan },
                { label: '所在仓库', value: vehicle.warehouse },
                { label: '垫款日期', value: vehicle.loanDate },
                { label: '回款状态', value: vehicle.repaymentStatus },
                { label: '车辆来源', value: vehicle.source },
              ].map((item) => (
                <div key={item.label} className="info-item">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 归属信息 */}
        <div className="detail-section">
          <div className="detail-section-title">归属信息</div>
          <div className="detail-section-body">
            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {[
                { label: '经销公司', value: vehicle.companyName },
                { label: '归属门店', value: vehicle.storeName },
                { label: '业务员', value: vehicle.salesperson },
                { label: '联系电话', value: vehicle.salespersonPhone },
              ].map((item) => (
                <div key={item.label} className="info-item">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 签注信息（仅库存金融车辆） */}
      {vehicle.source === '库存金融' && (
        <div className="detail-section">
          <div className="detail-section-title">
            签注信息
            {vehicle.registrationStatus === 'pending' && (
              <Button type="primary" size="small" style={{ marginLeft: 'auto' }}>确认签注</Button>
            )}
          </div>
          <div className="detail-section-body">
            <div className="info-grid">
              {[
                { label: '签注状态', value: vehicle.registrationStatusText || '-' },
                { label: '原车主', value: vehicle.oldOwner || '-' },
                { label: '签约时间', value: vehicle.signTime || '-' },
                { label: '签注时间', value: vehicle.registrationTime || '-' },
                { label: '垫款状态', value: vehicle.loanStatus || '-' },
                { label: '回款状态', value: vehicle.repaymentStatus },
              ].map((item) => (
                <div key={item.label} className="info-item">
                  <span className="info-label">{item.label}</span>
                  <span className="info-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 监管状态流转 */}
      <div className="detail-section">
        <div className="detail-section-title">监管状态流转</div>
        <div className="detail-section-body">
          <Timeline
            items={[
              {
                color: 'green', dot: <CheckCircleOutlined />,
                children: <><span style={{ fontWeight: 500 }}>待入库</span><span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12 }}>{vehicle.loanDate}</span></>,
              },
              ...(vehicle.stockStatus !== 'pending_in' ? [{
                color: 'green' as const, dot: <CheckCircleOutlined />,
                children: <><span style={{ fontWeight: 500 }}>入库确认</span><span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12 }}>GPS设备安装后自动入库</span></>,
              }] : []),
              ...(vehicle.supervisionStatus === 'supervising' || vehicle.supervisionStatus === 'released' ? [{
                color: vehicle.supervisionStatus === 'supervising' ? 'blue' as const : 'green' as const,
                dot: vehicle.supervisionStatus === 'supervising' ? <ClockCircleOutlined /> : <CheckCircleOutlined />,
                children: <><span style={{ fontWeight: 500 }}>监管中</span><span style={{ color: '#8c8c8c', marginLeft: 8, fontSize: 12 }}>{vehicle.supervisionPlan}</span></>,
              }] : []),
              ...(vehicle.supervisionStatus === 'released' ? [{
                color: 'green' as const, dot: <CheckCircleOutlined />,
                children: <span style={{ fontWeight: 500 }}>监管解除</span>,
              }] : []),
            ]}
          />
        </div>
      </div>

      {/* 关联告警 */}
      {relatedAlerts.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">
            关联告警
            <span style={{ marginLeft: 8, fontSize: 12, color: '#8c8c8c' }}>共 {relatedAlerts.length} 条</span>
          </div>
          <div className="table-card-body">
            <Table columns={alertColumns} dataSource={relatedAlerts} rowKey="id" size="small"
              pagination={false} scroll={{ x: 800 }}
            />
          </div>
        </div>
      )}

      {/* 关联用车 */}
      {relatedUse.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-title">
            关联用车记录
            <span style={{ marginLeft: 8, fontSize: 12, color: '#8c8c8c' }}>共 {relatedUse.length} 条</span>
          </div>
          <div className="table-card-body">
            <Table columns={useColumns} dataSource={relatedUse} rowKey="id" size="small"
              pagination={false} scroll={{ x: 800 }}
            />
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        {vehicle.stockStatus === 'pending_in' && (
          <Button type="primary" size="large">确认入库</Button>
        )}
        {vehicle.supervisionStatus === 'supervising' && (
          <>
            <Button size="large">用车申请</Button>
            {!vehicle.deviceNo && <Button type="primary" size="large">OBD绑定</Button>}
          </>
        )}
        <Button size="large">OBD绑定记录</Button>
      </div>
    </div>
  )
}
