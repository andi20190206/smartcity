export type PurchaseStatus = 'pending_check' | 'pending_sign' | 'signed' | 'rejected' | 'cancelled'
export type PurchaseMode = 'single' | 'batch'

/** 车辆明细（每台车） */
export interface VehicleItem {
  id: string
  plateNo: string
  vin: string
  brandModel: string
  engineNo: string
  useType: string
  mileage: number
  registerDate: string
  annualInspection: string
  color: string
  transferCount: number
  price: number
  condition: string
  collision: '正常' | '异常'
  waterDamage: '正常' | '异常'
  fireDamage: '正常' | '异常'
  maintenanceReport: '有' | '无'
  city: string
  /** 批量采购时的图片补充状态 */
  photoProgress?: number
  photoTotal?: number
  photoCompleted?: boolean
}

/** 采购单（主表） */
export interface PurchaseOrder {
  id: string
  mode: PurchaseMode
  status: PurchaseStatus
  statusText: string
  createTime: string
  /** 车辆明细列表：单车=1台，批量=N台 */
  vehicles: VehicleItem[]
  /** 卖方/车主信息（公共，同一卖方） */
  ownerName: string
  ownerType: '个人' | '企业' | '个体工商户'
  ownerIdNo: string
  ownerPhone: string
  /** 收款信息（公共） */
  payeeName: string
  payeeBank: string
  payeeCardNo: string
  payeePhone: string
  payeeIdentity: '车主' | '非车主'
  /** 合同号 */
  contractNo?: string
  /** 批量采购：总价汇总 */
  totalPrice: number
  /** 批量采购：图片补充进度 */
  photoStatus?: '未开始' | '补充中' | '已完成'
}

export interface BatchVehicle {
  id: string
  plateNo: string
  vin: string
  brandModel: string
  photoProgress: number
  photoTotal: number
  completed: boolean
}

export interface ImportRow {
  plateNo: string
  vin: string
  brandModel: string
  mileage: string
  price: string
  status: 'success' | 'error'
  errorMsg?: string
}
