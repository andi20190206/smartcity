export const purchaseStatusTabs = [
  { key: 'pending_check', title: '待查验' },
  { key: 'pending_sign', title: '待签约' },
  { key: 'signed', title: '签约完成' },
  { key: 'rejected', title: '不通过' },
  { key: 'cancelled', title: '签约取消' },
]

export const purchaseStatusTagColor: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
  pending_check: 'warning',
  pending_sign: 'primary',
  signed: 'success',
  rejected: 'danger',
  cancelled: 'default',
}
