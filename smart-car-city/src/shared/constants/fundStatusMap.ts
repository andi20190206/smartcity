export const advanceStatusTabs = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待审批' },
  { key: 'approving', title: '审批中' },
  { key: 'approved', title: '已通过' },
  { key: 'rejected', title: '已驳回' },
  { key: 'withdrawn', title: '已提现' },
  { key: 'withdraw_failed', title: '提现失败' },
]

export const advanceStatusTagColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  approving: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  approved: { bg: 'var(--green-bg)', color: 'var(--green)' },
  rejected: { bg: 'var(--red-bg)', color: 'var(--red)' },
  withdrawn: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-1)' },
  withdraw_failed: { bg: 'var(--red-bg)', color: 'var(--red)' },
}

export const withdrawStatusTagColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-2)' },
  processing: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  success: { bg: 'var(--green-bg)', color: 'var(--green)' },
  failed: { bg: 'var(--red-bg)', color: 'var(--red)' },
}

export const depositAuditStatusColor: Record<string, string> = {
  pending: 'processing',
  approved: 'success',
  rejected: 'error',
}
