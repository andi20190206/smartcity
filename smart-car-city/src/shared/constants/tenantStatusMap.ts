export const tenantStatusColorMap: Record<string, string> = {
  pending: 'processing',
  active: 'success',
  suspended: 'warning',
  rejected: 'error',
}

export const tenantStatusTextMap: Record<string, string> = {
  pending: '待审核',
  active: '已启用',
  suspended: '已停用',
  rejected: '已驳回',
}
