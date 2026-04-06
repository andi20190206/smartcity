/** 库存状态 */
export type StockStatus = 'pending_in' | 'in_stock' | 'out_stock' | 'transferred'

/** 监管状态 */
export type SupervisionStatus = 'pending' | 'supervising' | 'released'

/** 签注状态 */
export type RegistrationStatus = 'pending' | 'registered'

/** 设备在线状态 */
export type DeviceOnlineStatus = 'online' | 'offline'

/** 告警等级 */
export type AlertLevel = 'high' | 'medium' | 'low'

/** 告警状态 */
export type AlertStatus = 'alerting' | 'ended' | 'processing'

/** 用车类型 */
export type VehicleUseType = '试乘试驾' | '展示出库' | '维修保养' | '客户看车'

/** 用车状态 */
export type VehicleUseStatus = 'using' | 'completed' | 'expired' | 'pending_approval' | 'rejected'

/** 盘点类型 */
export type InventoryCheckType = 'gps_auto' | 'manual'

/** 盘点状态 */
export type InventoryCheckStatus = 'checking' | 'finished'

/** 监管车辆 */
export interface SupervisedVehicle {
  id: string
  plateNo: string
  vin: string
  brandModel: string
  storeName: string
  salesperson: string
  salespersonPhone: string
  companyName: string
  warehouse: string
  stockStatus: StockStatus
  stockStatusText: string
  supervisionStatus: SupervisionStatus
  supervisionStatusText: string
  deviceNo: string
  deviceOnline: DeviceOnlineStatus
  location: string
  loanDate: string
  cameraStatus: '正常' | '故障'
  repaymentStatus: '待回款' | '已回款'
  isSpecialEntry: boolean
  isScrapped: boolean
  /** 库龄天数 */
  stockDays: number
  /** 监管方案 */
  supervisionPlan: string
  /** 车辆来源 */
  source: '库存金融' | '模板导入' | '接口创建'
  /** 签注状态（仅库存金融车辆） */
  registrationStatus?: RegistrationStatus
  registrationStatusText?: string
  registrationTime?: string
  signTime?: string
  oldOwner?: string
  loanStatus?: '待垫款' | '已垫款'
}

/** 用车记录 */
export interface VehicleUseRecord {
  id: string
  applicant: string
  pickerType: string
  pickerName: string
  pickerPhone: string
  pickerIdNo: string
  useType: VehicleUseType
  plateNo: string
  vin: string
  warehouse: string
  stockStatus: string
  approvalStatus: string
  deviceStatus: DeviceOnlineStatus
  applyTime: string
  useDuration: string
  location: string
  useStatus: VehicleUseStatus
  useStatusText: string
}

/** 告警记录 */
export interface AlertRecord {
  id: string
  alertNo: string
  deviceNo: string
  alertLevel: AlertLevel
  alertStatus: AlertStatus
  alertStatusText: string
  plateNo: string
  vin: string
  alertType: string
  alertContent: string
  alertLocation: string
  vehicleLocation: string
  triggerTime: string
  endTime?: string
  duration?: string
  result?: string
  remark?: string
}

/** 盘点记录 */
export interface InventoryCheckRecord {
  id: string
  warehouse: string
  totalCount: number
  checkType: InventoryCheckType
  checkTypeText: string
  checkStatus: InventoryCheckStatus
  checkStatusText: string
  checkResult: '正常' | '异常'
  checker: string
  finishTime: string
  creator: string
  createTime: string
}
