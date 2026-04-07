export type PurchaseStatus = 'pending_check' | 'pending_sign' | 'signed' | 'rejected' | 'cancelled'
export type PurchaseMode = 'single' | 'batch'

/** 碰撞等级选项 */
export type CollisionLevel =
  | '覆盖件、加强件和结构件均无损伤、修复'
  | '结构件、加强件无损伤、修复；覆盖件有修复'
  | '结构件无损伤、修复，加强件无切割；加强件和覆盖件有修复；安全气囊进行过事故更换'
  | '结构件发生一处或多处损伤、修复；加强件发生一处或多处切割'

/** 水泡等级选项 */
export type WaterDamageLevel = '正常' | '涉水' | '泡水'

/** 火烧等级选项 */
export type FireDamageLevel =
  | '正常'
  | '客舱外火烧熏黑碳化痕迹或火烧炙烤融化面积达到 0.3m²(含) 以上'
  | '客舱内火烧熏黑碳化痕迹或火烧炙烤融化面积达到 0.3m²(含) 以上'

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
  /** 里程表状态 */
  odometerStatus?: '正常' | '故障'
  /** 车况描述（限200字） */
  conditionDesc?: string
  collision: CollisionLevel
  waterDamage: WaterDamageLevel
  fireDamage: FireDamageLevel
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
