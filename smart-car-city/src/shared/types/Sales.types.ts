export type SalesStatus = 'draft' | 'pending_approval' | 'approving' | 'approved' | 'pending_payment' | 'paid' | 'clearing' | 'completed' | 'rejected'
export type BuyerType = '企业' | '个人' | '个体工商户'

/** 销售车辆明细 */
export interface SalesVehicleItem {
  id: string
  purchaseOrderId: string
  plateNo: string
  vin: string
  brandModel: string
  engineNo: string
  useType: string
  mileage: number
  registerDate: string
  contractPrice: number   // 采购合同价(万元)
  salesPrice: number      // 销售价(万元)
  profitLoss: number      // 盈亏 = salesPrice - contractPrice
  /** 上架信息 */
  retailPrice: number     // 零售价
  wholesalePrice?: number // 批售价
  inspectionReport?: string
  listed: boolean
}

/** 销售单（主表） */
export interface SalesOrder {
  id: string
  status: SalesStatus
  statusText: string
  createTime: string
  /** 车辆销售明细 */
  vehicles: SalesVehicleItem[]
  /** 买家信息 */
  buyerType: BuyerType
  buyerName: string
  buyerIdNo: string
  buyerPhone: string
  /** 付款人信息 */
  payerIsBuyer: boolean
  payerType?: BuyerType
  payerName?: string
  payerIdNo?: string
  payerAccountName?: string
  payerCardNo?: string
  payerBank?: string
  payerPhone?: string
  /** 个体工商户专用：银行卡类型（法人名下银行卡 / 对公账户银行卡） */
  payerBankCardType?: '法人名下银行卡' | '对公账户银行卡'
  /** 账户类型（他行个人账户/中信个人账户/他行企业账户/中信企业账户） */
  payerAccountType?: string
  /** 签名 */
  salesAdvisorSign?: boolean
  buyerSign?: boolean
  /** 附件 */
  offlineContract?: boolean
  /** 金额汇总 */
  totalContractPrice: number
  totalSalesPrice: number
  totalProfitLoss: number
  vehicleCount: number
  /** 销售顾问 */
  salesAdvisor: string
}
