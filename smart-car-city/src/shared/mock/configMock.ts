import type { ConfigItem, ConfigChangeLog, CompanyConfigOverride } from '../types/Config.types'

/** 平台级配置项 */
export const mockPlatformConfigs: ConfigItem[] = [
  {
    id: 'CFG001', name: '监管方案', key: 'supervision_scheme', group: '监管设置',
    description: '支持的监管设备方案，可组合选择',
    level: 'dealer_company', valueType: 'multi_select',
    value: ['gps', 'rfid', 'gate', 'rfid_gate', 'camera'],
    defaultValue: ['gps', 'rfid', 'gate', 'rfid_gate', 'camera'],
    options: [
      { label: 'GPS定位', value: 'gps' },
      { label: 'RFID', value: 'rfid' },
      { label: '仅道闸', value: 'gate' },
      { label: 'RFID+道闸', value: 'rfid_gate' },
      { label: '摄像头', value: 'camera' },
    ],
  },
  {
    id: 'CFG002', name: '监管解除方式', key: 'supervision_release', group: '监管设置',
    description: '车辆监管解除的触发方式',
    level: 'dealer_company', valueType: 'select',
    value: 'manual', defaultValue: 'manual',
    options: [
      { label: '手动发起审批', value: 'manual' },
      { label: '清分后自动解除', value: 'auto' },
    ],
  },
  {
    id: 'CFG003', name: '清分-服务费规则', key: 'settlement_service_fee', group: '清分结算',
    description: '平台服务费的计算方式',
    level: 'dealer_company', valueType: 'select',
    value: 'fixed', defaultValue: 'fixed',
    options: [
      { label: '固定金额', value: 'fixed' },
      { label: '合同填写金额', value: 'contract' },
    ],
  },
  {
    id: 'CFG004', name: '清分-佣金规则', key: 'settlement_commission', group: '清分结算',
    description: '车商佣金的计算方式',
    level: 'dealer_company', valueType: 'select',
    value: 'ratio', defaultValue: 'ratio',
    options: [
      { label: '固定金额', value: 'fixed' },
      { label: '按比例', value: 'ratio' },
    ],
  },
  {
    id: 'CFG005', name: '银行利息结算方式', key: 'bank_interest_method', group: '清分结算',
    description: '银行出资时利息的结算周期',
    level: 'dealer_company', valueType: 'select',
    value: 'monthly', defaultValue: 'monthly',
    options: [
      { label: '按月结算', value: 'monthly' },
      { label: '按台结算', value: 'per_vehicle' },
    ],
  },
  {
    id: 'CFG006', name: '提现方式', key: 'withdraw_method', group: '资金设置',
    description: '卖方提现的触发方式',
    level: 'dealer_company', valueType: 'select',
    value: 'auto', defaultValue: 'auto',
    options: [
      { label: '自动提现', value: 'auto' },
      { label: '人工手动', value: 'manual' },
    ],
  },
  {
    id: 'CFG007', name: '垫款触发方式', key: 'advance_trigger', group: '资金设置',
    description: '垫款流程的触发方式',
    level: 'dealer_company', valueType: 'select',
    value: 'manual', defaultValue: 'manual',
    options: [
      { label: '手动发起', value: 'manual' },
      { label: '自动进入', value: 'auto' },
    ],
  },
  {
    id: 'CFG008', name: '杠杆比', key: 'leverage_ratio', group: '额度设置',
    description: '合作款项:最大额度的比例',
    level: 'platform', valueType: 'number',
    value: 30, defaultValue: 30,
    range: { min: 10, max: 100, step: 5, unit: ':100' },
  },
  {
    id: 'CFG009', name: '存货占用比例', key: 'inventory_ratio', group: '额度设置',
    description: '存货占用计算比例',
    level: 'platform', valueType: 'percentage',
    value: 30, defaultValue: 30,
    range: { min: 10, max: 80, step: 5, unit: '%' },
  },
  {
    id: 'CFG010', name: '库龄预警阈值', key: 'age_warning_threshold', group: '库存设置',
    description: '库龄预警的天数阈值（多级）',
    level: 'platform', valueType: 'threshold',
    value: '30,45,60', defaultValue: '30,45,60',
  },
  {
    id: 'CFG011', name: '批售触发天数', key: 'wholesale_trigger_days', group: '库存设置',
    description: '库龄超过多少天触发批售流程',
    level: 'platform', valueType: 'number',
    value: 60, defaultValue: 60,
    range: { min: 30, max: 120, step: 5, unit: '天' },
  },
]

/** 经销公司配置覆盖示例 */
export const mockCompanyOverrides: CompanyConfigOverride[] = [
  { companyId: 'COM001', companyName: '鑫达汽车经销有限公司', overrideCount: 4, lastUpdateTime: '2026-03-20 14:30' },
  { companyId: 'COM002', companyName: '恒通汽车贸易集团', overrideCount: 2, lastUpdateTime: '2026-03-18 09:15' },
  { companyId: 'COM003', companyName: '华瑞汽车销售有限公司', overrideCount: 5, lastUpdateTime: '2026-03-22 16:45' },
  { companyId: 'COM004', companyName: '中驰汽车经销集团', overrideCount: 1, lastUpdateTime: '2026-03-15 11:20' },
  { companyId: 'COM005', companyName: '盛邦汽车贸易有限公司', overrideCount: 3, lastUpdateTime: '2026-03-21 10:00' },
]

/** 经销公司级配置（覆盖后的值） */
export const mockCompanyConfigs: Record<string, ConfigItem[]> = {
  COM001: [
    {
      ...mockPlatformConfigs[0],
      value: ['gps', 'rfid_gate'], overridden: true,
    },
    {
      ...mockPlatformConfigs[1],
      value: 'auto', overridden: true,
    },
    { ...mockPlatformConfigs[2], overridden: false },
    {
      ...mockPlatformConfigs[3],
      value: 'fixed', overridden: true,
    },
    { ...mockPlatformConfigs[4], overridden: false },
    {
      ...mockPlatformConfigs[5],
      value: 'manual', overridden: true,
    },
    { ...mockPlatformConfigs[6], overridden: false },
    { ...mockPlatformConfigs[7], overridden: false },
    { ...mockPlatformConfigs[8], overridden: false },
    { ...mockPlatformConfigs[9], overridden: false },
    { ...mockPlatformConfigs[10], overridden: false },
  ],
  COM003: [
    { ...mockPlatformConfigs[0], value: ['gps', 'camera'], overridden: true },
    { ...mockPlatformConfigs[1], overridden: false },
    { ...mockPlatformConfigs[2], value: 'contract', overridden: true },
    { ...mockPlatformConfigs[3], overridden: false },
    { ...mockPlatformConfigs[4], value: 'per_vehicle', overridden: true },
    { ...mockPlatformConfigs[5], overridden: false },
    { ...mockPlatformConfigs[6], value: 'auto', overridden: true },
    { ...mockPlatformConfigs[7], overridden: false },
    { ...mockPlatformConfigs[8], overridden: false },
    { ...mockPlatformConfigs[9], value: '20,40,55', overridden: true },
    { ...mockPlatformConfigs[10], overridden: false },
  ],
}

/** 配置变更日志 */
export const mockConfigChangeLogs: ConfigChangeLog[] = [
  {
    id: 'LOG001', configKey: 'supervision_scheme', configName: '监管方案',
    oldValue: 'GPS, RFID, 仅道闸, RFID+道闸, 摄像头',
    newValue: 'GPS, RFID+道闸',
    operator: '张经理', operatorRole: '经销公司管理员',
    level: 'dealer_company', companyName: '鑫达汽车经销有限公司',
    changeTime: '2026-03-20 14:30:22',
  },
  {
    id: 'LOG002', configKey: 'supervision_release', configName: '监管解除方式',
    oldValue: '手动发起审批', newValue: '清分后自动解除',
    operator: '张经理', operatorRole: '经销公司管理员',
    level: 'dealer_company', companyName: '鑫达汽车经销有限公司',
    changeTime: '2026-03-20 14:28:15',
  },
  {
    id: 'LOG003', configKey: 'leverage_ratio', configName: '杠杆比',
    oldValue: '25:100', newValue: '30:100',
    operator: '陈管理员', operatorRole: '平台管理员',
    level: 'platform',
    changeTime: '2026-03-19 10:05:33',
  },
  {
    id: 'LOG004', configKey: 'wholesale_trigger_days', configName: '批售触发天数',
    oldValue: '90天', newValue: '60天',
    operator: '陈管理员', operatorRole: '平台管理员',
    level: 'platform',
    changeTime: '2026-03-18 16:42:10',
  },
  {
    id: 'LOG005', configKey: 'settlement_service_fee', configName: '清分-服务费规则',
    oldValue: '固定金额', newValue: '合同填写金额',
    operator: '李总', operatorRole: '经销公司管理员',
    level: 'dealer_company', companyName: '华瑞汽车销售有限公司',
    changeTime: '2026-03-22 16:45:08',
  },
  {
    id: 'LOG006', configKey: 'withdraw_method', configName: '提现方式',
    oldValue: '自动提现', newValue: '人工手动',
    operator: '张经理', operatorRole: '经销公司管理员',
    level: 'dealer_company', companyName: '鑫达汽车经销有限公司',
    changeTime: '2026-03-20 14:25:00',
  },
  {
    id: 'LOG007', configKey: 'age_warning_threshold', configName: '库龄预警阈值',
    oldValue: '30, 45, 60 天', newValue: '20, 40, 55 天',
    operator: '李总', operatorRole: '经销公司管理员',
    level: 'dealer_company', companyName: '华瑞汽车销售有限公司',
    changeTime: '2026-03-22 16:40:30',
  },
  {
    id: 'LOG008', configKey: 'inventory_ratio', configName: '存货占用比例',
    oldValue: '25%', newValue: '30%',
    operator: '陈管理员', operatorRole: '平台管理员',
    level: 'platform',
    changeTime: '2026-03-17 09:30:00',
  },
]
