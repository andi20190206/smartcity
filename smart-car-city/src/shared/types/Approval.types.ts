/** 审批类型 */
export type ApprovalType =
  | 'purchase'       // 采购审批
  | 'advance'        // 垫款审批
  | 'listing'        // 上架审批
  | 'sales_sign'     // 销售签约审批
  | 'supervision_release' // 监管解除审批
  | 'vehicle_use'    // 用车审批
  | 'deposit_change' // 合作款项变动审核
  | 'alarm_handle'   // 告警处理审批
  | 'wholesale'      // 批售审批

/** 审批状态 */
export type ApprovalStatus = 'pending' | 'approving' | 'approved' | 'rejected'

/** 审批节点记录 */
export interface ApprovalNode {
  nodeIndex: number
  nodeName: string
  approverName: string
  approverRole: string
  status: ApprovalStatus
  opinion?: string
  time?: string
}

/** 采购车辆定价信息 */
export interface VehiclePricingInfo {
  plateNo: string
  brandModel: string
  vin: string
  /** 采购价（万） */
  purchasePrice: number
  /** 建议采购价（万），定价接口返回，null 表示未获取到定价 */
  suggestedPrice: number | null
  /** 定价状态 */
  pricingStatus: 'priced' | 'no_price' | 'pending'
  /** 定价偏差率（%），仅在有建议价时计算 */
  deviationRate?: number
}

/** 门店授信额度信息 */
export interface DealerCreditInfo {
  storeName: string
  /** 最大额度（万） */
  maxQuota: number
  /** 在途额度（万） */
  inTransitQuota: number
  /** 可用额度（万） */
  availableQuota: number
  /** 可申请额度（万） */
  applyableQuota: number
  /** 本次采购占用额度（万） */
  currentPurchaseAmount: number
}

/** 审批单 */
export interface ApprovalRecord {
  id: string
  type: ApprovalType
  typeText: string
  /** 关联业务单号 */
  bizOrderId: string
  /** 摘要信息 */
  summary: string
  /** 申请人 */
  applicant: string
  applicantRole: string
  /** 经销公司 */
  dealerCompany: string
  /** 当前审批节点 */
  currentNode: number
  totalNodes: number
  currentNodeName: string
  /** 审批状态 */
  status: ApprovalStatus
  statusText: string
  /** 审批节点列表 */
  nodes: ApprovalNode[]
  /** 金额（万） */
  amount?: number
  /** 车牌号 */
  plateNo?: string
  /** 车型 */
  brandModel?: string
  createTime: string
  updateTime: string
  /** 采购审批专用：车辆定价信息列表 */
  vehiclePricingList?: VehiclePricingInfo[]
  /** 采购审批专用：门店授信额度信息 */
  dealerCredit?: DealerCreditInfo
  /** 采购审批专用：采购类型 */
  purchaseMode?: 'single' | 'batch'
  /** 垫款审批专用：垫款详情 */
  advanceDetail?: AdvanceApprovalDetail
}

/** 垫款审批详情 */
export interface AdvanceApprovalDetail {
  /** 车辆信息 */
  plateNo: string
  brandModel: string
  vin: string
  registerDate: string
  condition: string
  stockStatus: string      // 库存状态：待入库/在库等
  stockLocation: string    // 库存地点
  endorseStatus: string    // 签注状态：已签注/未签注
  /** 金额信息 */
  contractPrice: number    // 合同价（元）
  applyAdvance: number     // 申请垫款（元）
  regionTotalAdvance?: string // 区域总垫身
  /** 收款人信息 */
  sellerName: string
  sellerBank: string
  sellerCardNo: string
  sellerPhone?: string
  /** 门店额度信息 */
  pendingAdvance: number   // 待审批垫款（元）
  applyableQuota: number   // 可申请额度（元）
  availableDeposit: number // 可用合作款项（元）
  availableQuota: number   // 可用额度（元）
}
