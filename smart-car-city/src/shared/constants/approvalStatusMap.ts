export const approvalStatusTabs = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待我审批' },
  { key: 'approving', title: '审批中' },
  { key: 'approved', title: '已通过' },
  { key: 'rejected', title: '已驳回' },
]

export const approvalStatusTagColor: Record<string, { bg: string; color: string }> = {
  pending: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  approving: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  approved: { bg: 'var(--green-bg)', color: 'var(--green)' },
  rejected: { bg: 'var(--red-bg)', color: 'var(--red)' },
}

export const approvalTypeTagColor: Record<string, { bg: string; color: string }> = {
  purchase: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  advance: { bg: 'var(--orange-bg)', color: 'var(--orange)' },
  listing: { bg: 'rgba(175,82,222,0.08)', color: '#AF52DE' },
  sales_sign: { bg: 'var(--green-bg)', color: 'var(--green)' },
  supervision_release: { bg: 'rgba(0,122,255,0.08)', color: '#007AFF' },
  vehicle_use: { bg: 'rgba(88,86,214,0.08)', color: '#5856D6' },
  deposit_change: { bg: 'var(--red-bg)', color: 'var(--red)' },
  alarm_handle: { bg: 'rgba(255,59,48,0.08)', color: '#FF3B30' },
  wholesale: { bg: 'rgba(0,0,0,0.04)', color: 'var(--text-1)' },
}

export const approvalTypeText: Record<string, string> = {
  purchase: '采购审批',
  advance: '垫款审批',
  listing: '上架审批',
  sales_sign: '销售签约',
  supervision_release: '监管解除',
  vehicle_use: '用车审批',
  deposit_change: '款项变动',
  alarm_handle: '告警处理',
  wholesale: '批售审批',
}
