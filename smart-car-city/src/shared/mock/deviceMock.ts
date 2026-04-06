import type { DeviceRecord, DeviceTransferLog, DeviceAlertRecord } from '../types/Device.types'

export const mockDevices: DeviceRecord[] = [
  // === 摄像头（绑定仓库） ===
  {
    id: 'D003', deviceNo: 'CAM-20260310-001', deviceType: 'camera', deviceTypeText: '摄像头',
    status: 'online', statusText: '在线', owner: '王芳', ownerPhone: '13800003333',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: '', bindPlateNo: '', bindWarehouse: '天河仓A区', installPosition: '入口', resolution: '4K',
    location: '天河仓A区入口', lastHeartbeat: '2026-04-06 10:32:00',
    installDate: '2026-03-10', manufacturer: '海康威视', model: 'DS-2CD2T47', firmwareVersion: 'v5.6.8',
  },
  {
    id: 'D005', deviceNo: 'CAM-20260312-002', deviceType: 'camera', deviceTypeText: '摄像头',
    status: 'fault', statusText: '故障', owner: '李明', ownerPhone: '13800002222',
    companyName: '深圳鹏程汽车经销有限公司', storeName: '福田精品店',
    bindVin: '', bindPlateNo: '', bindWarehouse: '福田仓B区', installPosition: '出口', resolution: '1080P',
    location: '福田仓B区出口', lastHeartbeat: '2026-04-04 09:15:00',
    installDate: '2026-03-12', manufacturer: '海康威视', model: 'DS-2CD2T47', firmwareVersion: 'v5.6.8',
  },
  {
    id: 'D009', deviceNo: 'CAM-20260315-003', deviceType: 'camera', deviceTypeText: '摄像头',
    status: 'online', statusText: '在线', owner: '王芳', ownerPhone: '13800003333',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: '', bindPlateNo: '', bindWarehouse: '天河仓A区', installPosition: '内部', resolution: '1080P',
    location: '天河仓A区内部通道', lastHeartbeat: '2026-04-06 10:30:00',
    installDate: '2026-03-15', manufacturer: '大华股份', model: 'DH-IPC-HFW5442T', firmwareVersion: 'v3.1.0',
  },
  {
    id: 'D010', deviceNo: 'CAM-20260318-004', deviceType: 'camera', deviceTypeText: '摄像头',
    status: 'online', statusText: '在线', owner: '赵强', ownerPhone: '13800004444',
    companyName: '佛山顺通汽车经销有限公司', storeName: '顺德旗舰店',
    bindVin: '', bindPlateNo: '', bindWarehouse: '顺德仓库', installPosition: '入口', resolution: '4K',
    location: '顺德仓库主入口', lastHeartbeat: '2026-04-06 10:28:00',
    installDate: '2026-03-18', manufacturer: '海康威视', model: 'DS-2CD2T87', firmwareVersion: 'v5.7.2',
  },
  // === RFID（绑定车辆） ===
  {
    id: 'D006', deviceNo: 'RFID-20260320-001', deviceType: 'rfid', deviceTypeText: 'RFID标签',
    status: 'online', statusText: '在线', owner: '陈伟', ownerPhone: '13800001111',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: 'WBAJB0C55JB174523', bindPlateNo: '粤A·33456',
    bindWarehouse: '', installPosition: '', resolution: '',
    location: '天河仓A区', lastHeartbeat: '2026-04-06 10:25:00',
    installDate: '2026-03-20', manufacturer: '远望谷', model: 'XC-RF800', firmwareVersion: 'v2.0.3',
  },
  {
    id: 'D011', deviceNo: 'RFID-20260322-002', deviceType: 'rfid', deviceTypeText: 'RFID标签',
    status: 'online', statusText: '在线', owner: '李明', ownerPhone: '13800002222',
    companyName: '深圳鹏程汽车经销有限公司', storeName: '福田精品店',
    bindVin: 'LGBH52E04GY654321', bindPlateNo: '粤B·67890',
    bindWarehouse: '', installPosition: '', resolution: '',
    location: '福田仓B区', lastHeartbeat: '2026-04-06 10:20:00',
    installDate: '2026-03-22', manufacturer: '远望谷', model: 'XC-RF800', firmwareVersion: 'v2.0.3',
  },
  {
    id: 'D012', deviceNo: 'RFID-20260325-003', deviceType: 'rfid', deviceTypeText: 'RFID标签',
    status: 'offline', statusText: '离线', owner: '赵强', ownerPhone: '13800004444',
    companyName: '佛山顺通汽车经销有限公司', storeName: '顺德旗舰店',
    bindVin: '', bindPlateNo: '',
    bindWarehouse: '', installPosition: '', resolution: '',
    location: '顺德仓库', lastHeartbeat: '2026-04-05 16:00:00',
    installDate: '2026-03-25', manufacturer: '远望谷', model: 'XC-RF600', firmwareVersion: 'v1.8.1',
  },
  // === GPS定位（绑定车辆） ===
  {
    id: 'D001', deviceNo: 'GPS-20260301-001', deviceType: 'gps', deviceTypeText: 'GPS定位',
    status: 'online', statusText: '在线', owner: '陈伟', ownerPhone: '13800001111',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: 'LVHCV6637K50CLTS1', bindPlateNo: '粤A·12345',
    bindWarehouse: '', installPosition: '', resolution: '',
    location: '广州市天河区黄埔大道西120号', lastHeartbeat: '2026-04-06 10:30:00',
    installDate: '2026-03-01', manufacturer: '合众思壮', model: 'GT-800', firmwareVersion: 'v3.2.1',
  },
  {
    id: 'D002', deviceNo: 'GPS-20260302-002', deviceType: 'gps', deviceTypeText: 'GPS定位',
    status: 'online', statusText: '在线', owner: '李明', ownerPhone: '13800002222',
    companyName: '深圳鹏程汽车经销有限公司', storeName: '福田精品店',
    bindVin: 'LGBH52E04GY654321', bindPlateNo: '粤B·67890',
    bindWarehouse: '', installPosition: '', resolution: '',
    location: '深圳市福田区深南大道1001号', lastHeartbeat: '2026-04-06 10:28:00',
    installDate: '2026-03-05', manufacturer: '合众思壮', model: 'GT-800', firmwareVersion: 'v3.2.1',
  },
  {
    id: 'D004', deviceNo: 'GPS-20260315-003', deviceType: 'gps', deviceTypeText: 'GPS定位',
    status: 'offline', statusText: '离线', owner: '赵强', ownerPhone: '13800004444',
    companyName: '佛山顺通汽车经销有限公司', storeName: '顺德旗舰店',
    bindVin: 'WBAJB0C55JB174888', bindPlateNo: '粤E·55678',
    bindWarehouse: '', installPosition: '', resolution: '',
    location: '佛山市顺德区大良街道', lastHeartbeat: '2026-04-05 18:00:00',
    installDate: '2026-03-15', manufacturer: '合众思壮', model: 'GT-800', firmwareVersion: 'v3.1.0',
  },
  {
    id: 'D013', deviceNo: 'GPS-20260320-004', deviceType: 'gps', deviceTypeText: 'GPS定位',
    status: 'online', statusText: '在线', owner: '王芳', ownerPhone: '13800003333',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: 'LSVAU2A39EN123456', bindPlateNo: '粤A·88901',
    bindWarehouse: '', installPosition: '', resolution: '',
    location: '广州市天河区体育西路', lastHeartbeat: '2026-04-06 10:29:00',
    installDate: '2026-03-20', manufacturer: '合众思壮', model: 'GT-900', firmwareVersion: 'v3.3.0',
  },
]

export const mockDeviceTransferLogs: DeviceTransferLog[] = [
  { id: 'T001', deviceNo: 'GPS-20260301-001', deviceType: 'gps', fromOwner: '张三', toOwner: '陈伟', transferTime: '2026-03-15 14:00:00', operator: '管理员A', remark: '人员调岗' },
  { id: 'T002', deviceNo: 'CAM-20260312-002', deviceType: 'camera', fromOwner: '王芳', toOwner: '李明', transferTime: '2026-03-20 10:30:00', operator: '管理员B', remark: '门店调配' },
  { id: 'T003', deviceNo: 'GPS-20260315-003', deviceType: 'gps', fromOwner: '李明', toOwner: '赵强', transferTime: '2026-03-22 16:00:00', operator: '管理员A', remark: '新店配置' },
]

export const mockDeviceAlerts: DeviceAlertRecord[] = [
  { id: 'A001', deviceNo: 'GPS-20260315-003', deviceType: 'gps', alertType: '设备离线', alertContent: 'GPS设备超过12小时未上报心跳', alertTime: '2026-04-05 18:00:00', status: 'pending', statusText: '待处理', handler: '', resolveTime: '' },
  { id: 'A002', deviceNo: 'CAM-20260312-002', deviceType: 'camera', alertType: '设备故障', alertContent: '摄像头视频流中断，疑似硬件故障', alertTime: '2026-04-04 09:15:00', status: 'processing', statusText: '处理中', handler: '李明', resolveTime: '' },
  { id: 'A003', deviceNo: 'GPS-20260302-002', deviceType: 'gps', alertType: '信号弱', alertContent: 'GPS信号强度低于阈值', alertTime: '2026-04-03 15:20:00', status: 'resolved', statusText: '已解决', handler: '李明', resolveTime: '2026-04-03 17:00:00' },
  { id: 'A004', deviceNo: 'RFID-20260325-003', deviceType: 'rfid', alertType: '设备离线', alertContent: 'RFID标签超过24小时无响应', alertTime: '2026-04-05 16:00:00', status: 'pending', statusText: '待处理', handler: '', resolveTime: '' },
]
