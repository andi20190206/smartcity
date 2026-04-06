import type { DeviceRecord, DeviceTransferLog, DeviceAlertRecord } from '../types/Device.types'

export const mockDevices: DeviceRecord[] = [
  {
    id: 'D001', deviceNo: 'GPS-20260301-001', deviceType: 'gps', deviceTypeText: 'GPS定位',
    status: 'online', statusText: '在线', owner: '陈伟', ownerPhone: '13800001111',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: 'LVHCV6637K50CLTS1', bindPlateNo: '粤A·12345',
    location: '广州市天河区黄埔大道西120号', lastHeartbeat: '2026-04-06 10:30:00',
    installDate: '2026-03-01', manufacturer: '合众思壮', model: 'GT-800', firmwareVersion: 'v3.2.1',
  },
  {
    id: 'D002', deviceNo: 'GPS-20260302-002', deviceType: 'gps', deviceTypeText: 'GPS定位',
    status: 'online', statusText: '在线', owner: '李明', ownerPhone: '13800002222',
    companyName: '深圳鹏程汽车经销有限公司', storeName: '福田精品店',
    bindVin: 'LGBH52E04GY654321', bindPlateNo: '粤B·67890',
    location: '深圳市福田区深南大道1001号', lastHeartbeat: '2026-04-06 10:28:00',
    installDate: '2026-03-05', manufacturer: '合众思壮', model: 'GT-800', firmwareVersion: 'v3.2.1',
  },
  {
    id: 'D003', deviceNo: 'CAM-20260310-001', deviceType: 'camera', deviceTypeText: '摄像头',
    status: 'online', statusText: '在线', owner: '王芳', ownerPhone: '13800003333',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: '', bindPlateNo: '',
    location: '天河仓A区入口', lastHeartbeat: '2026-04-06 10:32:00',
    installDate: '2026-03-10', manufacturer: '海康威视', model: 'DS-2CD2T47', firmwareVersion: 'v5.6.8',
  },
  {
    id: 'D004', deviceNo: 'GPS-20260315-003', deviceType: 'gps', deviceTypeText: 'GPS定位',
    status: 'offline', statusText: '离线', owner: '赵强', ownerPhone: '13800004444',
    companyName: '佛山顺通汽车经销有限公司', storeName: '顺德旗舰店',
    bindVin: 'WBAJB0C55JB174888', bindPlateNo: '粤E·55678',
    location: '佛山市顺德区大良街道', lastHeartbeat: '2026-04-05 18:00:00',
    installDate: '2026-03-15', manufacturer: '合众思壮', model: 'GT-800', firmwareVersion: 'v3.1.0',
  },
  {
    id: 'D005', deviceNo: 'CAM-20260312-002', deviceType: 'camera', deviceTypeText: '摄像头',
    status: 'fault', statusText: '故障', owner: '李明', ownerPhone: '13800002222',
    companyName: '深圳鹏程汽车经销有限公司', storeName: '福田精品店',
    bindVin: '', bindPlateNo: '',
    location: '福田仓B区出口', lastHeartbeat: '2026-04-04 09:15:00',
    installDate: '2026-03-12', manufacturer: '海康威视', model: 'DS-2CD2T47', firmwareVersion: 'v5.6.8',
  },
  {
    id: 'D006', deviceNo: 'RFID-20260320-001', deviceType: 'rfid', deviceTypeText: 'RFID标签',
    status: 'online', statusText: '在线', owner: '陈伟', ownerPhone: '13800001111',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: 'WBAJB0C55JB174523', bindPlateNo: '粤A·33456',
    location: '天河仓A区', lastHeartbeat: '2026-04-06 10:25:00',
    installDate: '2026-03-20', manufacturer: '远望谷', model: 'XC-RF800', firmwareVersion: 'v2.0.3',
  },
  {
    id: 'D007', deviceNo: 'GATE-20260301-001', deviceType: 'gate', deviceTypeText: '道闸',
    status: 'online', statusText: '在线', owner: '王芳', ownerPhone: '13800003333',
    companyName: '广州恒达汽车经销有限公司', storeName: '天河旗舰店',
    bindVin: '', bindPlateNo: '',
    location: '天河仓A区主入口', lastHeartbeat: '2026-04-06 10:31:00',
    installDate: '2026-03-01', manufacturer: '捷顺科技', model: 'JSDC-300', firmwareVersion: 'v4.1.0',
  },
  {
    id: 'D008', deviceNo: 'PDA-20260325-001', deviceType: 'pda', deviceTypeText: 'PDA终端',
    status: 'online', statusText: '在线', owner: '赵强', ownerPhone: '13800004444',
    companyName: '佛山顺通汽车经销有限公司', storeName: '顺德旗舰店',
    bindVin: '', bindPlateNo: '',
    location: '顺德仓库', lastHeartbeat: '2026-04-06 09:50:00',
    installDate: '2026-03-25', manufacturer: '优博讯', model: 'i6310', firmwareVersion: 'v1.5.2',
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
  { id: 'A004', deviceNo: 'GATE-20260301-001', deviceType: 'gate', alertType: '道闸异常', alertContent: '道闸抬杆后未正常落杆', alertTime: '2026-04-02 08:30:00', status: 'resolved', statusText: '已解决', handler: '王芳', resolveTime: '2026-04-02 09:00:00' },
]
