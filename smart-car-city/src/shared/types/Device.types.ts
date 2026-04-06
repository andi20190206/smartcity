/** 设备类型 */
export type DeviceType = 'gps' | 'camera' | 'rfid' | 'pda' | 'gate'

/** 设备状态 */
export type DeviceStatus = 'online' | 'offline' | 'fault'

/** 设备记录 */
export interface DeviceRecord {
  id: string
  deviceNo: string
  deviceType: DeviceType
  deviceTypeText: string
  status: DeviceStatus
  statusText: string
  owner: string
  ownerPhone: string
  companyName: string
  storeName: string
  /** GPS/RFID 绑定车辆 */
  bindVin: string
  bindPlateNo: string
  /** 摄像头绑定仓库 */
  bindWarehouse: string
  /** 摄像头安装位置（入口/出口/内部等） */
  installPosition: string
  /** 摄像头分辨率 */
  resolution: string
  location: string
  lastHeartbeat: string
  installDate: string
  manufacturer: string
  model: string
  firmwareVersion: string
}

/** 设备转移记录 */
export interface DeviceTransferLog {
  id: string
  deviceNo: string
  deviceType: DeviceType
  fromOwner: string
  toOwner: string
  transferTime: string
  operator: string
  remark: string
}

/** 设备告警记录 */
export interface DeviceAlertRecord {
  id: string
  deviceNo: string
  deviceType: DeviceType
  alertType: string
  alertContent: string
  alertTime: string
  status: 'pending' | 'processing' | 'resolved'
  statusText: string
  handler: string
  resolveTime: string
}
