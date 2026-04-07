export type ContractStatus = 'pending_sign' | 'signing' | 'signed' | 'archived'
export type ContractType = '采购合同' | '销售合同' | '批售合同'

/** 审批状态 */
export type ContractApprovalStatus = '审批中' | '通过/不通过' | '待审批'

/** 合同关联车辆 */
export interface ContractVehicleItem {
  id: string
  plateNo: string
  vin: string
  brandModel: string
  contractPrice: number // 合同价(万元)
  /** 采购合同扩展字段 */
  insurance?: string
  mileage?: number       // 万公里
  registerDate?: string
  annualInspection?: string
  color?: string
  transferCount?: number
  condition?: string     // 车况：好/一般
  /** 第三方估价信息 */
  thirdPartyPrice?: number | null  // 第三方平台估价(万元)
  newCarGuidePrice?: number | null // 新车指导价(万元)
  vehicleAge?: string              // 车龄
}

/** 合同签署方 */
export interface ContractParty {
  role: string       // 卖方/车商/经销公司/买方
  name: string
  idNo?: string
  phone?: string
  signed: boolean
  signTime?: string
  delegated?: boolean       // 是否委托代签
  delegateName?: string     // 委托人姓名
  delegateProof?: string    // 委托证明材料
}

/** 车主信息 */
export interface ContractOwnerInfo {
  ownerType: '个人' | '企业' | '个体工商户'
  ownerName: string
  idNo: string
  phone: string
}

/** 收款信息 */
export interface ContractPayeeInfo {
  payeeIdentity: '车主' | '非车主'
  payeeName: string
  payeeIdNo: string
  payeePhone: string
  payeeBank: string
  payeeCardNo: string
}

/** 交车信息 */
export interface ContractDeliveryInfo {
  deliveryDate: string
  deliveryLocation: string
}

/** 合同（主表） */
export interface Contract {
  id: string                 // 合同号
  contractType: ContractType
  status: ContractStatus
  statusText: string
  createTime: string
  signTime?: string          // 签署完成时间
  /** 关联业务单号 */
  bizOrderId: string         // 采购单号/销售单号
  /** 签约方 */
  parties: ContractParty[]
  /** 车辆清单 */
  vehicles: ContractVehicleItem[]
  /** 金额 */
  totalAmount: number        // 合同总金额(万元)
  vehicleCount: number
  /** 附件 */
  hasAttachment: boolean     // 是否有附件(PDF/图片)
  offlineUpload: boolean     // 是否线下上传
  /** 经销公司 */
  dealerCompany: string
  /** 采购合同扩展 */
  applicant?: string         // 申请人
  storeName?: string         // 门店
  groupName?: string         // 集团
  salesperson?: string       // 业务员
  approvalStatus?: ContractApprovalStatus
  approvalNode?: string      // 审批节点
  approver?: string          // 审批人
  /** 授信额度 */
  inTransitQuota?: number    // 在途额度(万元)
  maxQuota?: number          // 最大额度(万元)
  availableQuota?: number    // 可用额度(万元)
  /** 车主/收款/交车信息 */
  ownerInfo?: ContractOwnerInfo
  payeeInfo?: ContractPayeeInfo
  deliveryInfo?: ContractDeliveryInfo
}
