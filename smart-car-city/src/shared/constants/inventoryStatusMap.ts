export const stockStatusTabs = [
  { key: 'all', title: '全部' },
  { key: 'pending_in', title: '待入库' },
  { key: 'in_stock', title: '在库' },
  { key: 'out_stock', title: '出库' },
  { key: 'transferred', title: '已转移' },
]

export const supervisionStatusTabs = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待监管' },
  { key: 'supervising', title: '监管中' },
  { key: 'released', title: '监管解除' },
]

export const stockStatusTagColor: Record<string, { bg: string; color: string }> = {
  pending_in: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  in_stock: { bg: 'var(--green-bg)', color: 'var(--green)' },
  out_stock: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  transferred: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
}

export const supervisionStatusTagColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  supervising: { bg: 'var(--green-bg)', color: 'var(--green)' },
  released: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
}

export const alertLevelTagColor: Record<string, { bg: string; color: string }> = {
  high: { bg: 'var(--red-bg)', color: 'var(--red)' },
  medium: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  low: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
}

export const alertStatusTagColor: Record<string, { bg: string; color: string }> = {
  alerting: { bg: 'var(--red-bg)', color: 'var(--red)' },
  ended: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
  processing: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
}

export const vehicleUseStatusTagColor: Record<string, { bg: string; color: string }> = {
  using: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  completed: { bg: 'var(--green-bg)', color: 'var(--green)' },
  expired: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
  pending_approval: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  rejected: { bg: 'var(--red-bg)', color: 'var(--red)' },
}
