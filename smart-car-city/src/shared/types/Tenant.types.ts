/** 经销公司（租户） */
export interface DealerCompany {
  id: string
  name: string
  creditCode: string
  contact: string
  phone: string
  address: string
  licenseUrl: string
  walletAccount: string
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  statusText: string
  storeCount: number
  dealerCount: number
  createTime: string
}

/** 门店（属于经销公司，与车商是平级关系） */
export interface Store {
  id: string
  name: string
  companyId: string
  companyName: string
  address: string
  contact: string
  phone: string
  warehouseName: string
  createTime: string
}

/** 车商（直接挂靠在经销公司下，系统分配门店身份） */
export interface Dealer {
  id: string
  name: string
  accountName: string
  companyId: string
  companyName: string
  /** 系统分配的门店身份 */
  assignedStoreName: string
  contact: string
  phone: string
  depositBalance: number
  maxQuota: number
  availableQuota: number
  applyQuota: number
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  statusText: string
  createTime: string
}
