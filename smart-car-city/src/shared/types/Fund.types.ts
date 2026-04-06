/** 垫款状态 */
export type AdvanceStatus = 'pending' | 'approving' | 'approved' | 'rejected' | 'withdrawn' | 'withdraw_failed'

/** 提现状态 */
export type WithdrawStatus = 'pending' | 'processing' | 'success' | 'failed'

/** 合作款项变动方向 */
export type DepositChangeDirection = 'increase' | 'decrease'

/** 合作款项变动审核状态 */
export type DepositChangeAuditStatus = 'pending' | 'approved' | 'rejected'

/** 车商额度信息 */
export interface DealerQuota {
  id: string
  dealerName: string
  storeName: string
  /** 代经销合作款项（保证金余额） */
  deposit: number
  /** 已用合作款项 */
  usedDeposit: number
  /** 可用合作款项 */
  availableDeposit: number
  /** 最大额度 = 合作款项 ÷ 30 × 100 */
  maxQuota: number
  /** 在途额度（已垫款未签注） */
  inTransitQuota: number
  /** 可用额度 = 最大额度 - 在途额度 */
  availableQuota: number
  /** 可申请额度 = Min(可用合作款项额度, 可用额度) */
  applyableQuota: number
  lastChangeTime: string
}

/** 垫款记录 */
export interface AdvanceRecord {
  id: string
  /** 关联采购单号 */
  purchaseOrderId: string
  /** 车辆信息 */
  plateNo: string
  brandModel: string
  vin: string
  /** 采购合同金额（万） */
  contractAmount: number
  /** 已垫金额（万） */
  advancedAmount: number
  /** 本次申请金额（万） */
  applyAmount: number
  /** 垫款状态 */
  status: AdvanceStatus
  statusText: string
  /** 提现状态 */
  withdrawStatus: WithdrawStatus
  withdrawStatusText: string
  /** 卖方信息 */
  sellerName: string
  sellerBank: string
  sellerCardNo: string
  /** 资金来源 */
  fundSource: '经销公司自有资金' | '银行资方'
  /** 车商 */
  dealerName: string
  storeName: string
  createTime: string
  approveTime?: string
  withdrawTime?: string
  /** 失败原因 */
  failReason?: string
}

/** 合作款项变动记录 */
export interface DepositChangeRecord {
  id: string
  dealerName: string
  storeName: string
  /** 变动类型 */
  changeType: '线下合作款项' | '钱包合作款项'
  /** 变动方向 */
  direction: DepositChangeDirection
  /** 变动金额（万） */
  amount: number
  /** 变动原因 */
  reason: string
  /** 凭证图片 */
  vouchers: string[]
  /** 审核状态 */
  auditStatus: DepositChangeAuditStatus
  auditStatusText: string
  createTime: string
  auditTime?: string
  auditRemark?: string
}

/** 在途额度明细 */
export interface InTransitDetail {
  vehicleId: string
  plateNo: string
  brandModel: string
  advanceAmount: number
  advanceDate: string
  /** 是否已签注 */
  registered: boolean
}
