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
}
