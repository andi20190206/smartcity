export const salesStatusTabs = [
  { key: 'all', title: '全部' },
  { key: 'draft', title: '草稿' },
  { key: 'pending_approval', title: '待审批' },
  { key: 'approving', title: '审批中' },
  { key: 'approved', title: '审批通过' },
  { key: 'pending_payment', title: '待付款' },
  { key: 'paid', title: '已付款' },
  { key: 'completed', title: '已完成' },
  { key: 'rejected', title: '已驳回' },
]

export const salesStatusTagColor: Record<string, { bg: string; color: string }> = {
  draft: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
  pending_approval: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  approving: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  approved: { bg: 'var(--green-bg)', color: 'var(--green)' },
  pending_payment: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  paid: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  clearing: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  completed: { bg: 'var(--green-bg)', color: 'var(--green)' },
  rejected: { bg: 'var(--red-bg)', color: 'var(--red)' },
}
