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

/** 门店 */
export interface Store {
  id: string
  name: string
  companyId: string
  companyName: string
  address: string
  contact: string
  phone: string
  warehouseName: string
  dealerCount: number
  createTime: string
}

/** 车商 */
export interface Dealer {
  id: string
  name: string
  accountName: string
  companyId: string
  companyName: string
  storeId: string
  storeName: string
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
