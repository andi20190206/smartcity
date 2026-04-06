export const deviceStatusMap: Record<string, { text: string; color: string }> = {
  online: { text: '在线', color: '#52c41a' },
  offline: { text: '离线', color: '#8c8c8c' },
  fault: { text: '故障', color: '#ff4d4f' },
}

export const deviceTypeMap: Record<string, { text: string; color: string }> = {
  gps: { text: 'GPS定位', color: '#1677ff' },
  camera: { text: '摄像头', color: '#722ed1' },
  rfid: { text: 'RFID标签', color: '#13c2c2' },
  pda: { text: 'PDA终端', color: '#fa8c16' },
  gate: { text: '道闸', color: '#eb2f96' },
}

export const alertStatusMap: Record<string, { text: string; color: string }> = {
  pending: { text: '待处理', color: '#ff4d4f' },
  processing: { text: '处理中', color: '#fa8c16' },
  resolved: { text: '已解决', color: '#52c41a' },
}
