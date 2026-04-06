export const contractStatusTabs = [
  { key: 'all', title: '全部' },
  { key: 'pending_sign', title: '待签署' },
  { key: 'signing', title: '签署中' },
  { key: 'signed', title: '已签署' },
  { key: 'archived', title: '已归档' },
]

export const contractTypeTabs = [
  { key: 'all', title: '全部' },
  { key: '采购合同', title: '采购合同' },
  { key: '销售合同', title: '销售合同' },
  { key: '批售合同', title: '批售合同' },
]

export const contractStatusTagColor: Record<string, { bg: string; color: string }> = {
  pending_sign: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  signing: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  signed: { bg: 'var(--green-bg)', color: 'var(--green)' },
  archived: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
}

export const contractTypeTagColor: Record<string, { bg: string; color: string }> = {
  '采购合同': { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  '销售合同': { bg: 'var(--green-bg)', color: 'var(--green)' },
  '批售合同': { bg: 'var(--orange-bg)', color: 'var(--orange)' },
}
