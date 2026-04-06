export type ContractStatus = 'pending_sign' | 'signing' | 'signed' | 'archived'
export type ContractType = '采购合同' | '销售合同' | '批售合同'

/** 合同关联车辆 */
export interface ContractVehicleItem {
  id: string
  plateNo: string
  vin: string
  brandModel: string
  contractPrice: number // 合同价(万元)
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
}
