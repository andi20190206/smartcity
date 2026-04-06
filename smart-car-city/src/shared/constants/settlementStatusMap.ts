export const settlementStatusTabs = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待清分' },
  { key: 'processing', title: '清分中' },
  { key: 'completed', title: '清分完成' },
  { key: 'failed', title: '清分失败' },
]

export const settlementStatusTagColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  processing: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  completed: { bg: 'var(--green-bg)', color: 'var(--green)' },
  failed: { bg: 'var(--red-bg)', color: 'var(--red)' },
}
