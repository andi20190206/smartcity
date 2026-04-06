import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tabs, Tag, Table, Button, Space, Empty, Descriptions, Timeline } from 'antd'
import {
  ArrowLeftOutlined, BankOutlined, ShopOutlined, UserOutlined,
  ClockCircleOutlined, CheckCircleOutlined, PhoneOutlined,
  EnvironmentOutlined, SafetyCertificateOutlined, WalletOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { mockCompanies, mockStores, mockDealers } from '../../shared/mock/tenantMock'
import { tenantStatusColorMap, tenantStatusTextMap } from '../../shared/constants/tenantStatusMap'
import type { Store, Dealer } from '../../shared/types/Tenant.types'

export default function TenantDetailPC() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const company = useMemo(() => mockCompanies.find((c) => c.id === id), [id])
  const stores = useMemo(() => mockStores.filter((s) => s.companyId === id), [id])
  const dealers = useMemo(() => mockDealers.filter((d) => d.companyId === id), [id])

  if (!company) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <Empty description="经销公司不存在" />
        <Button type="link" onClick={() => navigate('/pc/tenant')}>返回列表</Button>
      </div>
    )
  }

  const storeColumns: ColumnsType<Store> = [
    { title: '门店编号', dataIndex: 'id', key: 'id', width: 100, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span> },
    { title: '门店名称', dataIndex: 'name', key: 'name', width: 160, render: (n: string) => <span style={{ fontWeight: 500 }}>{n}</span> },
    { title: '门店地址', dataIndex: 'address', key: 'address', width: 300, ellipsis: true },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 100 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (p: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13 }}>{p}</span> },
    { title: '关联仓库', dataIndex: 'warehouseName', key: 'warehouseName', width: 120 },
    { title: '车商数', dataIndex: 'dealerCount', key: 'dealerCount', width: 80, align: 'center', render: (n: number) => <span style={{ color: '#52c41a', fontWeight: 600 }}>{n}</span> },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span> },
  ]

  const dealerColumns: ColumnsType<Dealer> = [
    { title: '车商编号', dataIndex: 'id', key: 'id', width: 100, render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, fontSize: 13 }}>{v}</span> },
    { title: '车商名称', dataIndex: 'name', key: 'name', width: 150, render: (n: string) => <span style={{ fontWeight: 500 }}>{n}</span> },
    { title: '所属门店', dataIndex: 'storeName', key: 'storeName', width: 120 },
    { title: '联系人', dataIndex: 'contact', key: 'contact', width: 90 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130, render: (p: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 13 }}>{p}</span> },
    {
      title: '合作款余额(万)', dataIndex: 'depositBalance', key: 'depositBalance', width: 120, align: 'right',
      render: (v: number) => <span style={{ fontFamily: "'DM Sans', monospace", fontWeight: 600, color: v > 0 ? '#52c41a' : '#bfbfbf' }}>{v.toFixed(1)}</span>,
    },
    {
      title: '额度信息', key: 'quota', width: 200,
      render: (_: unknown, r: Dealer) => (
        <div style={{ fontSize: 12 }}>
          <span>最大 <b style={{ color: '#1a1a2e' }}>{r.maxQuota}</b></span>
          <span style={{ color: '#bfbfbf', margin: '0 6px' }}>|</span>
          <span>可用 <b style={{ color: '#52c41a' }}>{r.availableQuota}</b></span>
        </div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => <Tag color={tenantStatusColorMap[s]} style={{ borderRadius: 4 }}>{tenantStatusTextMap[s]}</Tag>,
    },
    { title: '挂靠时间', dataIndex: 'createTime', key: 'createTime', width: 160, render: (t: string) => <span style={{ fontSize: 13, color: '#8c8c8c' }}>{t}</span> },
  ]

  const mockTimeline = [
    { time: company.createTime, label: '提交入驻申请', status: 'done' as const, user: company.contact },
    { time: '2026-01-16 09:00', label: '平台审核通过', status: 'done' as const, user: '平台管理员' },
    { time: '2026-01-16 09:05', label: '开通钱包账户', status: 'done' as const, user: '系统' },
    ...(company.status === 'active' ? [{ time: '2026-01-16 10:00', label: '租户启用', status: 'done' as const, user: '系统' }] : []),
    ...(company.status === 'suspended' ? [{ time: '2026-03-01 10:00', label: '租户停用', status: 'error' as const, user: '平台管理员' }] : []),
  ]

  const tabItems = [
    {
      key: 'info',
      label: <span><BankOutlined /> 基本信息</span>,
      children: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid #f0f0f0', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            {[
              { label: '公司名称', value: company.name },
              { label: '统一社会信用代码', value: company.creditCode, mono: true },
              { label: '联系人', value: company.contact },
              { label: '联系电话', value: company.phone, mono: true },
              { label: '经营地址', value: company.address, span: 2 },
              { label: '钱包账户', value: company.walletAccount || '未开通', mono: true },
              { label: '入驻时间', value: company.createTime },
              { label: '门店数量', value: `${company.storeCount} 家` },
              { label: '车商数量', value: `${company.dealerCount} 人` },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: '14px 18px',
                borderRight: '1px solid #f5f5f5',
                borderBottom: '1px solid #f5f5f5',
                ...(item.span === 2 ? { gridColumn: 'span 2' } : {}),
              }}>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', fontFamily: item.mono ? "'DM Sans', monospace" : undefined, wordBreak: 'break-all' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      key: 'stores',
      label: <span><ShopOutlined /> 下属门店 ({stores.length})</span>,
      children: (
        <Table columns={storeColumns} dataSource={stores} rowKey="id" size="small" scroll={{ x: 1100 }} pagination={false} />
      ),
    },
    {
      key: 'dealers',
      label: <span><UserOutlined /> 下属车商 ({dealers.length})</span>,
      children: (
        <Table columns={dealerColumns} dataSource={dealers} rowKey="id" size="small" scroll={{ x: 1200 }} pagination={false} />
      ),
    },
    {
      key: 'timeline',
      label: <span><ClockCircleOutlined /> 操作记录</span>,
      children: (
        <div style={{ padding: '8px 0', maxWidth: 500 }}>
          <Timeline
            items={mockTimeline.map((item) => ({
              color: item.status === 'done' ? 'green' : 'red',
              dot: item.status === 'done' ? <CheckCircleOutlined /> : <ClockCircleOutlined />,
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
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/pc/tenant')} style={{ padding: '4px 8px' }} />
            <span className="order-id">{company.id}</span>
            <Tag color={tenantStatusColorMap[company.status]} style={{ fontSize: 13, padding: '2px 12px', borderRadius: 6 }}>
              {tenantStatusTextMap[company.status]}
            </Tag>
          </div>
          <div className="order-meta">
            <span><BankOutlined /> {company.name}</span>
            <span><PhoneOutlined /> {company.contact} {company.phone}</span>
            <span><EnvironmentOutlined /> {company.address}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>门店</div>
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 28, fontWeight: 700, color: '#1677ff', lineHeight: 1 }}>{company.storeCount}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>车商</div>
              <div style={{ fontFamily: "'DM Sans', monospace", fontSize: 28, fontWeight: 700, color: '#52c41a', lineHeight: 1 }}>{company.dealerCount}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <Tabs items={tabItems} defaultActiveKey="info" style={{ padding: '0 20px' }} tabBarStyle={{ marginBottom: 0 }} />
      </div>
    </div>
  )
}
