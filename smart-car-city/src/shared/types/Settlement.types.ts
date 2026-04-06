export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed'

/** 清分车辆明细 */
export interface SettlementVehicleItem {
  id: string
  vin: string
  plateNo: string
  brandModel: string
  contractPrice: number   // 采购合同价(万)
  salesPrice: number      // 销售价(万)
  profitLoss: number      // 盈亏
  serviceFee: number      // 平台服务费
  commission: number      // 车商佣金
  advanceRepay: number    // 回垫款
  profit: number          // 经销公司利润
  interest: number        // 银行利息
}

/** 四路到账状态 */
export interface FourWayStatus {
  platformFee: 'pending' | 'success' | 'failed'
  dealerCommission: 'pending' | 'success' | 'failed'
  companyPayment: 'pending' | 'success' | 'failed'
  bankInterest: 'pending' | 'success' | 'failed' | 'none'
}

/** 清分单（主表） */
export interface SettlementOrder {
  id: string
  salesOrderId: string
  status: SettlementStatus
  statusText: string
  createTime: string
  settleTime?: string
  vehicleCount: number
  totalSalesAmount: number    // 销售总额
  totalServiceFee: number     // 平台服务费合计
  totalCommission: number     // 车商佣金合计
  totalCompanyPayment: number // 经销公司车款合计
  totalInterest: number       // 银行利息合计
  totalProfitLoss: number     // 总盈亏
  vehicles: SettlementVehicleItem[]
  fourWayStatus: FourWayStatus
  dealerName: string          // 车商
  companyName: string         // 经销公司
  fundSource: '经销公司自有' | '银行出资'
  retryCount?: number
  failReason?: string
}
