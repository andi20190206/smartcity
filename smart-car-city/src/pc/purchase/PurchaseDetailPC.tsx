import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, Tag, Table, Button, Space, Timeline, Empty, Image } from 'antd'
import {
  ArrowLeftOutlined,
  CarOutlined, UserOutlined, BankOutlined, FileTextOutlined,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { mockOrders } from '../../shared/mock/purchaseMock'
import type { VehicleItem } from '../../shared/types/Purchase.types'
import { vehicleDocImages, vehiclePhotoImages, idDocImages, payeeDocImages, maintenanceImages } from '../../shared/constants/docImages'
import { getCollisionShort, getCollisionColor, getWaterDamageColor, getFireDamageShort, getFireDamageColor } from '../../shared/constants/vehicleConditionOptions'

const statusColorMap: Record<string, string> = {
  pending_check: 'processing',
  pending_sign: 'warning',
  signed: 'success',
  rejected: 'error',
  cancelled: 'default',
}

export default function PurchaseDetailPC() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = useMemo(() => mockOrders.find((o) => o.id === id), [id])

  if (!order) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <Empty description="采购单不存在" />
        <Button type="link" onClick={() => navigate('/pc/purchase')}>返回列表</Button>
      </div>
    )
  }

  const vehicleColumns: ColumnsType<VehicleItem> = [
    { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo', width: 120, render: (t: string) => <span style={{ fontWeight: 600 }}>{t}</span> },
    { title: 'VIN码', dataIndex: 'vin', key: 'vin', width: 200, render: (t: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{t}</span> },
    { title: '品牌车型', dataIndex: 'brandModel', key: 'brandModel', width: 260 },
    { title: '颜色', dataIndex: 'color', key: 'color', width: 80 },
    { title: '里程(万km)', dataIndex: 'mileage', key: 'mileage', width: 100, align: 'right' as const },
    { title: '上牌日期', dataIndex: 'registerDate', key: 'registerDate', width: 120 },
    { title: '过户次数', dataIndex: 'transferCount', key: 'transferCount', width: 90, align: 'center' as const },
    {
      title: '采购价(万)',
      dataIndex: 'price',
      key: 'price',
      width: 110,
      align: 'right' as const,
      render: (p: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: '#E8352E' }}>{p.toFixed(2)}</span>,
    },
    { title: '车况', dataIndex: 'condition', key: 'condition', width: 80 },
    {
      title: '车况信息',
      key: 'inspect',
      width: 220,
      render: (_: unknown, r: VehicleItem) => (
        <Space size={4} wrap>
          <Tag color={getCollisionColor(r.collision)} style={{ fontSize: 11 }}>碰撞: {getCollisionShort(r.collision)}</Tag>
          <Tag color={getWaterDamageColor(r.waterDamage)} style={{ fontSize: 11 }}>水泡: {r.waterDamage}</Tag>
          <Tag color={getFireDamageColor(r.fireDamage)} style={{ fontSize: 11 }}>火烧: {getFireDamageShort(r.fireDamage)}</Tag>
        </Space>
      ),
    },
  ]

  const mockTimeline = [
    { time: order.createTime, label: '创建采购单', status: 'done' as const, user: '陈业务' },
    ...(order.status !== 'cancelled' ? [{ time: '2026-03-25 15:00', label: '提交审批', status: 'done' as const, user: '陈业务' }] : []),
    ...(order.status === 'pending_sign' || order.status === 'signed'
      ? [{ time: '2026-03-26 09:30', label: '审批通过', status: 'done' as const, user: '李经理' }]
      : []),
    ...(order.status === 'rejected'
      ? [{ time: '2026-03-26 10:00', label: '审批驳回', status: 'error' as const, user: '李经理' }]
      : []),
    ...(order.status === 'signed'
      ? [
          { time: '2026-03-27 14:00', label: '合同签署完成', status: 'done' as const, user: '系统' },
          { time: '2026-03-27 14:05', label: '进入垫款流程', status: 'done' as const, user: '系统' },
        ]
      : []),
    ...(order.status === 'pending_check'
      ? [{ time: '', label: '等待查验', status: 'pending' as const, user: '' }]
      : []),
    ...(order.status === 'pending_sign'
      ? [{ time: '', label: '等待签约', status: 'pending' as const, user: '' }]
      : []),
  ]

  const tabItems = [
    {
      key: 'vehicles',
      label: <span><CarOutlined /> 车辆明细 ({order.vehicles.length})</span>,
      children: (
        <div>
          <Table
            columns={vehicleColumns}
            dataSource={order.vehicles}
            rowKey="id"
            size="small"
            scroll={{ x: 1400 }}
            pagination={false}
            expandable={{
              expandedRowRender: (v: VehicleItem) => (
                <div style={{ padding: '12px 0' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>车辆照片</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
                    {([
                      ['左前45°', vehiclePhotoImages.lf45],
                      ['右后45°', vehiclePhotoImages.rb45],
                      ['仪表盘', vehiclePhotoImages.dashboard],
                      ['座椅', vehiclePhotoImages.seat],
                      ['铭牌', vehiclePhotoImages.nameplate],
                      ['发动机舱', vehiclePhotoImages.engine],
                    ] as const).map(([label, src]) => (
                      <div key={label} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', position: 'relative', cursor: 'pointer' }}>
                        <img src={src} alt={label} style={{ width: '100%', height: 80, objectFit: 'cover', display: 'block' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '10px 4px 3px', fontSize: 10, color: '#fff', textAlign: 'center' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>证件照片</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
                    {([
                      ['行驶证正本', vehicleDocImages.licenseF],
                      ['行驶证副本', vehicleDocImages.licenseB],
                      ['登记证首页', vehicleDocImages.regF],
                      ['登记证内页', vehicleDocImages.regB],
                    ] as const).map(([label, src]) => (
                      <div key={label} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', position: 'relative', cursor: 'pointer' }}>
                        <img src={src} alt={label} style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '10px 4px 3px', fontSize: 10, color: '#fff', textAlign: 'center' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  {v.maintenanceReport === '有' && (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>维保报告</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', position: 'relative', cursor: 'pointer' }}>
                          <img src={maintenanceImages.report} alt="维保报告" style={{ width: '100%', height: 90, objectFit: 'cover', display: 'block' }} />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', padding: '10px 4px 3px', fontSize: 10, color: '#fff', textAlign: 'center' }}>维保报告</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ),
              rowExpandable: () => true,
            }}
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={7} align="right">
                    <span style={{ fontWeight: 600, color: '#8c8c8c' }}>合计</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={7} align="right">
                    <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 700, color: '#E8352E', fontSize: 15 }}>
                      {order.totalPrice.toFixed(2)}
                    </span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={8} colSpan={2} />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      ),
    },
    {
      key: 'owner',
      label: <span><UserOutlined /> 卖方信息</span>,
      children: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            {[
              { label: '车主类型', value: order.ownerType },
              { label: '姓名/企业', value: order.ownerName },
              { label: '证件号码', value: order.ownerIdNo, mono: true },
              { label: '联系电话', value: order.ownerPhone },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: '14px 18px',
                borderRight: (i + 1) % 4 !== 0 ? '1px solid #f5f5f5' : 'none',
                borderBottom: '1px solid #f5f5f5',
              }}>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', fontFamily: item.mono ? "'DM Sans', monospace" : undefined, wordBreak: 'break-all' }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>车主证件照片</div>
            <Image.PreviewGroup>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {order.ownerType === '企业' ? (
                  <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', position: 'relative', width: 220 }}>
                    <Image src={idDocImages.bizLicense} alt="营业执照" width={220} height={140} style={{ objectFit: 'cover' }} />
                    <div style={{ padding: '6px 8px', fontSize: 12, color: '#8c8c8c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0' }}>
                      <span>营业执照</span>
                      <a href={idDocImages.bizLicense} download="营业执照" style={{ fontSize: 12, color: '#1677ff' }}><DownloadOutlined /> 下载</a>
                    </div>
                  </div>
                ) : ([
                  ['身份证正面', idDocImages.idFront],
                  ['身份证反面', idDocImages.idBack],
                ] as const).map(([label, src]) => (
                  <div key={label} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', width: 220 }}>
                    <Image src={src} alt={label} width={220} height={140} style={{ objectFit: 'cover' }} />
                    <div style={{ padding: '6px 8px', fontSize: 12, color: '#8c8c8c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0' }}>
                      <span>{label}</span>
                      <a href={src} download={label} style={{ fontSize: 12, color: '#1677ff' }}><DownloadOutlined /> 下载</a>
                    </div>
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        </div>
      ),
    },
    {
      key: 'payment',
      label: <span><BankOutlined /> 收款信息</span>,
      children: (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            {[
              { label: '收款人身份', value: order.payeeIdentity },
              { label: '收款人姓名', value: order.payeeName },
              { label: '开户行', value: order.payeeBank },
              { label: '银行卡号', value: order.payeeCardNo, mono: true },
              { label: '预留手机', value: order.payeePhone },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                padding: '14px 18px',
                borderRight: (i + 1) % 3 !== 0 ? '1px solid #f5f5f5' : 'none',
                borderBottom: i < arr.length - (arr.length % 3 || 3) ? '1px solid #f5f5f5' : 'none',
              }}>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', fontFamily: item.mono ? "'DM Sans', monospace" : undefined, letterSpacing: item.mono ? 0.5 : undefined }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 10 }}>收款人证件 & 银行卡照片</div>
            <Image.PreviewGroup>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {([
                  ['收款人证件正面', payeeDocImages.payeeIdFront],
                  ['收款人证件反面', payeeDocImages.payeeIdBack],
                  ['银行卡正面', payeeDocImages.bankCardFront],
                  ['银行卡反面', payeeDocImages.bankCardBack],
                ] as const).map(([label, src]) => (
                  <div key={label} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #f0f0f0', width: 220 }}>
                    <Image src={src} alt={label} width={220} height={140} style={{ objectFit: 'cover' }} />
                    <div style={{ padding: '6px 8px', fontSize: 12, color: '#8c8c8c', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0' }}>
                      <span>{label}</span>
                      <a href={src} download={label} style={{ fontSize: 12, color: '#1677ff' }}><DownloadOutlined /> 下载</a>
                    </div>
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        </div>
      ),
    },
    {
      key: 'contract',
      label: <span><FileTextOutlined /> 合同信息</span>,
      children: order.contractNo ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
          <div style={{ padding: '14px 18px', borderRight: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>合同编号</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', fontFamily: "'DM Sans', monospace" }}>{order.contractNo}</div>
          </div>
          <div style={{ padding: '14px 18px', borderRight: '1px solid #f5f5f5', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>合同类型</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{order.mode === 'single' ? '一车一合同' : '一批一合同'}</div>
          </div>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f5f5f5' }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>签署状态</div>
            <Tag color="success">已签署</Tag>
          </div>
          <div style={{ padding: '14px 18px', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>签署方</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>卖方（{order.ownerName}）、车商（陈业务）、经销公司（广州XX汽车经销有限公司）</div>
          </div>
        </div>
      ) : (
        <Empty description="暂无合同信息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    },
    {
      key: 'timeline',
      label: <span><ClockCircleOutlined /> 操作记录</span>,
      children: (
        <div style={{ padding: '8px 0', maxWidth: 500 }}>
          <Timeline
            items={mockTimeline.map((item) => ({
              color: item.status === 'done' ? 'green' : item.status === 'error' ? 'red' : 'gray',
              dot: item.status === 'done' ? <CheckCircleOutlined /> : item.status === 'error' ? <CloseCircleOutlined /> : <ClockCircleOutlined />,
              children: (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a2e' }}>{item.label}</div>
                  {item.time && <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{item.time} · {item.user}</div>}
                </div>
              ),
            }))}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="detail-page">
      {/* 头部 */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/pc/purchase')} style={{ padding: '4px 8px' }} />
            <span className="order-id">{order.id}</span>
            <Tag color={order.mode === 'batch' ? 'blue' : 'default'} style={{ borderRadius: 4 }}>
              {order.mode === 'single' ? '单车采购' : '批量采购'}
            </Tag>
            <Tag color={statusColorMap[order.status]} style={{ fontSize: 13, padding: '2px 12px', borderRadius: 6 }}>
              {order.statusText}
            </Tag>
          </div>
          <div className="order-meta">
            <span><ClockCircleOutlined /> {order.createTime}</span>
            <span><CarOutlined /> {order.vehicles.length} 台车辆</span>
            <span><UserOutlined /> 卖方：{order.ownerName}</span>
            {order.contractNo && <span><FileTextOutlined /> {order.contractNo}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>采购总价</div>
            <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 28, fontWeight: 700, color: '#E8352E', lineHeight: 1 }}>
              {order.totalPrice.toFixed(2)}
              <span style={{ fontSize: 14, fontWeight: 400, color: '#8c8c8c', marginLeft: 4 }}>万</span>
            </div>
          </div>
      </div>

      {/* Tab 内容 */}
      <div className="detail-section">
        <Tabs
          items={tabItems}
          defaultActiveKey="vehicles"
          style={{ padding: '0 20px' }}
          tabBarStyle={{ marginBottom: 0 }}
        />
      </div>
    </div>
  )
}
