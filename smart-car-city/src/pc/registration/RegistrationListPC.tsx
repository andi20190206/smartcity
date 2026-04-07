import { useState, useMemo } from 'react'
import { Table, Tag, Input, Select, Button, Space, Modal, Form, DatePicker, Upload, message, Image, Timeline } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined, ReloadOutlined, ExportOutlined, PlusOutlined, WarningFilled, FileTextOutlined, EyeOutlined } from '@ant-design/icons'
import { mockSupervisedVehicles } from '../../shared/mock/inventoryMock'
import type { SupervisedVehicle } from '../../shared/types/Inventory.types'
import { carImages } from '../../shared/constants/carImages'
import dayjs from 'dayjs'

interface RemarkRecord {
  id: string
  vehicleId: string
  type: string
  operator: string
  time: string
  content: string
}

interface EndorsementRecord {
  vehicleId: string
  plateNo: string
  vin: string
  endorsementDate: string
  materials: string[]
}

/* ---- mock 备注记录 ---- */
const initialRemarks: RemarkRecord[] = [
  { id: 'R001', vehicleId: 'SV001', type: '新增备注', operator: '王大锤', time: '2026-03-21 08:50:08', content: '这里是备注备注' },
  { id: 'R002', vehicleId: 'SV001', type: '新增备注', operator: '王大锤', time: '2026-03-20 08:50:08', content: '这里是备注备注' },
  { id: 'R003', vehicleId: 'SV001', type: '新增备注', operator: '王大锤', time: '2026-03-19 08:50:08', content: '新资料未提交' },
  { id: 'R004', vehicleId: 'SV001', type: '新增备注', operator: '王大锤', time: '2026-03-18 08:50:08', content: '资料不通过' },
  { id: 'R005', vehicleId: 'SV001', type: '新增备注', operator: '王大锤', time: '2026-03-17 08:50:08', content: '已联系客户，待资料提供' },
  { id: 'R006', vehicleId: 'SV002', type: '新增备注', operator: '李明', time: '2026-03-22 10:30:00', content: '客户已提交签注材料' },
  { id: 'R007', vehicleId: 'SV003', type: '新增备注', operator: '王芳', time: '2026-03-25 14:00:00', content: '等待旧车主配合过户' },
]

/* ---- mock 签注记录 ---- */
const initialEndorsements: EndorsementRecord[] = [
  { vehicleId: 'SV001', plateNo: '粤A·12345', vin: 'LVHCV6637K50CLTS1', endorsementDate: '2026-03-05', materials: carImages.slice(0, 6) },
  { vehicleId: 'SV004', plateNo: '湘C·11111', vin: 'LSVAM4187CN200001', endorsementDate: '2026-02-20', materials: carImages.slice(2, 5) },
  { vehicleId: 'SV005', plateNo: '粤A·55667', vin: 'LHGBH541XNN100002', endorsementDate: '2026-01-15', materials: carImages.slice(4, 8) },
]

export default function RegistrationListPC() {
  const [searchText, setSearchText] = useState('')
  const [regFilter, setRegFilter] = useState<string | undefined>()
  const [loanFilter, setLoanFilter] = useState<string | undefined>()

  /* ---- 备注相关 state ---- */
  const [remarkModalOpen, setRemarkModalOpen] = useState(false)
  const [remarkHistoryOpen, setRemarkHistoryOpen] = useState(false)
  const [remarkTarget, setRemarkTarget] = useState<SupervisedVehicle | null>(null)
  const [remarkText, setRemarkText] = useState('')
  const [remarks, setRemarks] = useState<RemarkRecord[]>(initialRemarks)

  /* ---- 签注相关 state ---- */
  const [endorseModalOpen, setEndorseModalOpen] = useState(false)
  const [endorseTarget, setEndorseTarget] = useState<SupervisedVehicle | null>(null)
  const [endorseDate, setEndorseDate] = useState<dayjs.Dayjs | null>(null)
  const [endorseFiles, setEndorseFiles] = useState<any[]>([])
  const [endorseRecordOpen, setEndorseRecordOpen] = useState(false)
  const [endorseRecordTarget, setEndorseRecordTarget] = useState<SupervisedVehicle | null>(null)
  const [endorsements] = useState<EndorsementRecord[]>(initialEndorsements)

  const registrationVehicles = useMemo(() => {
    return mockSupervisedVehicles.filter((v) => v.source === '库存金融')
  }, [])

  const filteredData = useMemo(() => {
    let list = registrationVehicles
    if (regFilter) list = list.filter((v) => v.registrationStatus === regFilter)
    if (loanFilter) list = list.filter((v) => v.loanStatus === loanFilter)
    if (searchText) {
      const s = searchText.toLowerCase()
      list = list.filter((v) =>
        v.plateNo.includes(s) || v.vin.toLowerCase().includes(s) || v.brandModel.includes(s) ||
        v.companyName.includes(s) || v.storeName.includes(s)
      )
    }
    return list
  }, [searchText, regFilter, loanFilter, registrationVehicles])

  const stats = useMemo(() => ({
    total: registrationVehicles.length,
    pending: registrationVehicles.filter((v) => v.registrationStatus === 'pending').length,
    registered: registrationVehicles.filter((v) => v.registrationStatus === 'registered').length,
    loaned: registrationVehicles.filter((v) => v.loanStatus === '已垫款').length,
  }), [registrationVehicles])

  /* ---- 备注操作 ---- */
  const openAddRemark = (record: SupervisedVehicle) => {
    setRemarkTarget(record)
    setRemarkText('')
    setRemarkModalOpen(true)
  }

  const handleAddRemark = () => {
    if (!remarkText.trim()) { message.warning('请输入备注内容'); return }
    const newRemark: RemarkRecord = {
      id: `R${Date.now()}`,
      vehicleId: remarkTarget!.id,
      type: '新增备注',
      operator: '韩立',
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      content: remarkText.trim(),
    }
    setRemarks((prev) => [newRemark, ...prev])
    message.success('备注添加成功')
    setRemarkModalOpen(false)
  }

  const openRemarkHistory = (record: SupervisedVehicle) => {
    setRemarkTarget(record)
    setRemarkHistoryOpen(true)
  }

  const vehicleRemarks = useMemo(() => {
    if (!remarkTarget) return []
    return remarks.filter((r) => r.vehicleId === remarkTarget.id)
  }, [remarkTarget, remarks])

  /* ---- 签注操作 ---- */
  const openEndorseConfirm = (record: SupervisedVehicle) => {
    setEndorseTarget(record)
    setEndorseDate(null)
    setEndorseFiles([])
    setEndorseModalOpen(true)
  }

  const handleEndorseConfirm = () => {
    if (!endorseDate) { message.warning('请选择签注日期'); return }
    message.success('签注确认成功')
    setEndorseModalOpen(false)
  }

  const openEndorseRecord = (record: SupervisedVehicle) => {
    setEndorseRecordTarget(record)
    setEndorseRecordOpen(true)
  }

  const currentEndorsement = useMemo(() => {
    if (!endorseRecordTarget) return null
    return endorsements.find((e) => e.vehicleId === endorseRecordTarget.id) || null
  }, [endorseRecordTarget, endorsements])

  const columns: ColumnsType<SupervisedVehicle> = [
    {
      title: 'VIN码', dataIndex: 'vin', key: 'vin', width: 180,
      render: (v: string) => <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 12 }}>{v}</span>,
    },
    { title: '车牌', dataIndex: 'plateNo', key: 'plateNo', width: 110, render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: '品牌车系', dataIndex: 'brandModel', key: 'brandModel', width: 220 },
    { title: '所属门店', dataIndex: 'storeName', key: 'storeName', width: 110 },
    { title: '经销公司', dataIndex: 'companyName', key: 'companyName', width: 180 },
    { title: '签约时间', dataIndex: 'signTime', key: 'signTime', width: 110, render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t || '-'}</span> },
    { title: '业务员', dataIndex: 'salesperson', key: 'salesperson', width: 80 },
    {
      title: '垫款状态', dataIndex: 'loanStatus', key: 'loanStatus', width: 90,
      render: (v: string) => <Tag color={v === '已垫款' ? 'green' : 'default'} style={{ borderRadius: 4 }}>{v || '-'}</Tag>,
    },
    { title: '旧车主', dataIndex: 'oldOwner', key: 'oldOwner', width: 140, render: (v: string) => <span>{v || '-'}</span> },
    {
      title: '签注状态', dataIndex: 'registrationStatus', key: 'registrationStatus', width: 90,
      render: (_: unknown, r: SupervisedVehicle) => (
        <Tag color={r.registrationStatus === 'registered' ? 'green' : 'warning'} style={{ borderRadius: 4 }}>
          {r.registrationStatusText || '-'}
        </Tag>
      ),
    },
    {
      title: '签注时间', dataIndex: 'registrationTime', key: 'registrationTime', width: 110,
      render: (t: string) => <span style={{ fontSize: 12, color: '#8c8c8c' }}>{t || '-'}</span>,
    },
    {
      title: '操作', key: 'action', width: 200, fixed: 'right',
      render: (_: unknown, r: SupervisedVehicle) => (
        <Space size={0} split={<span style={{ color: '#e8e8e8', margin: '0 2px' }}>|</span>}>
          {r.registrationStatus === 'pending' && (
            <Button type="link" size="small" onClick={() => openEndorseConfirm(r)}>确认签注</Button>
          )}
          {r.registrationStatus === 'registered' && (
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => openEndorseRecord(r)}>签注记录</Button>
          )}
          <Button type="link" size="small" onClick={() => openAddRemark(r)}>备注</Button>
          <Button type="link" size="small" icon={<FileTextOutlined />} onClick={() => openRemarkHistory(r)}>备注记录</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="stat-row">
        <div className="stat-card brand">
          <div className="stat-label">签注车辆</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">库存金融车辆</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">待签注</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-sub">等待确认签注</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">已签注</div>
          <div className="stat-value">{stats.registered}</div>
          <div className="stat-sub">签注完成</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">已垫款</div>
          <div className="stat-value">{stats.loaned}</div>
          <div className="stat-sub">垫款已发放</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="title">签注管理</div>
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        </div>
        <div className="filter-bar">
          <Input
            placeholder="搜索车牌/VIN/品牌/公司/门店"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText} onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }} allowClear
          />
          <Select placeholder="签注状态" allowClear style={{ width: 120 }}
            value={regFilter} onChange={setRegFilter}
            options={[
              { value: 'pending', label: '待签注' },
              { value: 'registered', label: '已签注' },
            ]}
          />
          <Select placeholder="垫款状态" allowClear style={{ width: 120 }}
            value={loanFilter} onChange={setLoanFilter}
            options={[
              { value: '待垫款', label: '待垫款' },
              { value: '已垫款', label: '已垫款' },
            ]}
          />
        </div>
        <div className="table-card-body">
          <Table columns={columns} dataSource={filteredData} rowKey="id" size="middle"
            scroll={{ x: 1800 }}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
          />
        </div>
      </div>

      {/* ===== 新增备注弹窗 ===== */}
      <Modal
        title={null}
        open={remarkModalOpen}
        onCancel={() => setRemarkModalOpen(false)}
        footer={null}
        width={520}
        destroyOnClose
      >
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>新增备注</div>
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, padding: '8px 12px', marginBottom: 20, fontSize: 13, color: '#ad6800' }}>
          请确认车辆信息
        </div>
        <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="VIN码">
            <Input value={remarkTarget?.vin || ''} disabled style={{ background: '#fafafa', color: '#333' }} />
          </Form.Item>
          <Form.Item label="车牌号码">
            <Input value={remarkTarget?.plateNo || ''} disabled style={{ background: '#fafafa', color: '#333' }} />
          </Form.Item>
          <Form.Item label="记录人">
            <Input value="韩立" disabled style={{ background: '#fafafa', color: '#333' }} />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea
              rows={4}
              maxLength={100}
              showCount
              placeholder="可输入事件进展情况说明，供后续查看，不超过100个汉字"
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
            />
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space>
            <Button onClick={() => setRemarkModalOpen(false)}>取 消</Button>
            <Button type="primary" onClick={handleAddRemark}>确 定</Button>
          </Space>
        </div>
      </Modal>

      {/* ===== 备注记录弹窗 ===== */}
      <Modal
        title={null}
        open={remarkHistoryOpen}
        onCancel={() => setRemarkHistoryOpen(false)}
        footer={null}
        width={620}
        destroyOnClose
      >
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>备注记录</div>
        {vehicleRemarks.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#bfbfbf', padding: '40px 0' }}>暂无备注记录</div>
        ) : (
          <>
            <Timeline
              items={vehicleRemarks.map((r) => ({
                color: 'blue',
                children: (
                  <div style={{ display: 'flex', gap: 24, fontSize: 13, lineHeight: '22px' }}>
                    <span style={{ color: '#1677ff', fontWeight: 500, whiteSpace: 'nowrap' }}>{r.type}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>{r.operator}</span>
                    <span style={{ color: '#8c8c8c', whiteSpace: 'nowrap' }}>{r.time}</span>
                    <span style={{ flex: 1 }}>{r.content}</span>
                  </div>
                ),
              }))}
            />
            <div style={{ display: 'flex', gap: 48, fontSize: 12, color: '#bfbfbf', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
              <span>操作类型</span><span>操作人</span><span>操作时间</span><span>操作内容</span>
            </div>
          </>
        )}
      </Modal>

      {/* ===== 确认已签注弹窗 ===== */}
      <Modal
        title={null}
        open={endorseModalOpen}
        onCancel={() => setEndorseModalOpen(false)}
        footer={null}
        width={520}
        destroyOnClose
      >
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>确认已签注</div>
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 6, padding: '8px 12px', marginBottom: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <WarningFilled style={{ color: '#faad14' }} />
          <span style={{ color: '#ad6800' }}>务必确认车辆，谨慎操作，签注状态一旦改变后无法撤回</span>
        </div>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 17 }}>
          <Form.Item label="车牌">
            <Input value={endorseTarget?.plateNo || ''} disabled suffix={<span style={{ fontSize: 12, color: '#bfbfbf' }}>不支持修改</span>} style={{ background: '#fafafa', color: '#333' }} />
          </Form.Item>
          <Form.Item label="VIN码">
            <Input value={endorseTarget?.vin || ''} disabled suffix={<span style={{ fontSize: 12, color: '#bfbfbf' }}>不支持修改</span>} style={{ background: '#fafafa', color: '#333' }} />
          </Form.Item>
          <Form.Item label={<span><span style={{ color: '#ff4d4f' }}>*</span>签注日期</span>}>
            <DatePicker
              style={{ width: '100%' }}
              value={endorseDate}
              onChange={setEndorseDate}
              placeholder="请选择签注日期"
            />
          </Form.Item>
          <Form.Item label={
            <div style={{ lineHeight: '20px' }}>
              <div><span style={{ color: '#ff4d4f' }}>*</span>签注材料：</div>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>(1~20张)</div>
              <div style={{ fontSize: 11, color: '#8c8c8c' }}>支持多张同时上传</div>
            </div>
          }>
            <Upload
              listType="picture-card"
              fileList={endorseFiles}
              onChange={({ fileList }) => setEndorseFiles(fileList)}
              beforeUpload={() => false}
              maxCount={20}
              accept="image/*"
            >
              {endorseFiles.length < 20 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8, fontSize: 12 }}>点击上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space>
            <Button onClick={() => setEndorseModalOpen(false)}>取 消</Button>
            <Button type="primary" onClick={handleEndorseConfirm}>确 定</Button>
          </Space>
        </div>
      </Modal>

      {/* ===== 签注记录弹窗 ===== */}
      <Modal
        title={null}
        open={endorseRecordOpen}
        onCancel={() => setEndorseRecordOpen(false)}
        footer={null}
        width={560}
        destroyOnClose
      >
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>签注记录</div>
        {currentEndorsement ? (
          <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 18 }}>
            <Form.Item label="车牌">
              <Input value={currentEndorsement.plateNo} disabled suffix={<span style={{ fontSize: 12, color: '#bfbfbf' }}>不支持修改</span>} style={{ background: '#fafafa', color: '#333' }} />
            </Form.Item>
            <Form.Item label="VIN码">
              <Input value={currentEndorsement.vin} disabled suffix={<span style={{ fontSize: 12, color: '#bfbfbf' }}>不支持修改</span>} style={{ background: '#fafafa', color: '#333' }} />
            </Form.Item>
            <Form.Item label="签注日期">
              <Input value={currentEndorsement.endorsementDate} disabled style={{ background: '#fafafa', color: '#333' }} />
            </Form.Item>
            <Form.Item label="签注材料">
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>点击可查看大图</div>
              <Image.PreviewGroup>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {currentEndorsement.materials.map((url, i) => (
                    <Image
                      key={i}
                      src={url}
                      width={72}
                      height={72}
                      style={{ borderRadius: 6, objectFit: 'cover', cursor: 'pointer' }}
                      alt={`签注材料${i + 1}`}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ textAlign: 'center', color: '#bfbfbf', padding: '40px 0' }}>暂无签注记录</div>
        )}
      </Modal>
    </div>
  )
}
