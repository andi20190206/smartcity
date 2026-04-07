import type { MessageRecord } from '../types/Message.types'

export const mockMessages: MessageRecord[] = [
  {
    id: 'MSG001', type: 'approval', typeText: '审批通知',
    title: '采购审批已通过',
    content: '您提交的采购单 CG-2026031001（粤A·12345 别克英朗）已通过审批，请及时跟进后续流程。',
    status: 'unread', bizId: 'AP-20260328-001', bizType: 'approval',
    createTime: '2026-04-07 09:30',
  },
  {
    id: 'MSG002', type: 'fund', typeText: '资金通知',
    title: '垫款已到账',
    content: '垫款单 DK-2026032803（粤A·33456 凯迪拉克 GT4）已成功提现到账，金额 17.50 万元。',
    status: 'unread', bizId: 'DK-2026032803', bizType: 'advance',
    createTime: '2026-04-07 08:15',
  },
  {
    id: 'MSG003', type: 'approval', typeText: '审批通知',
    title: '垫款审批被驳回',
    content: '您提交的垫款申请 DK-2026032806（粤A·55667 本田雅阁）已被驳回，原因：额度不足，请补充合作款项后重新申请。',
    status: 'unread', bizId: 'AP-20260328-006', bizType: 'approval',
    createTime: '2026-04-06 16:45',
  },
  {
    id: 'MSG004', type: 'alert', typeText: '预警通知',
    title: '车辆异常移动告警',
    content: '监管车辆 粤A·12345（别克英朗）触发OBD报警，偏离监管区域500米，请及时处理。',
    status: 'read', bizId: 'AL001', bizType: 'alert',
    createTime: '2026-04-06 14:20',
  },
  {
    id: 'MSG005', type: 'inventory', typeText: '库存通知',
    title: '用车申请已通过',
    content: '您的用车申请 UC-20260325-001（粤A·12345 试乘试驾）已通过审批，请按时提车。',
    status: 'read', bizId: 'UC-20260325-001', bizType: 'vehicle_use',
    createTime: '2026-04-05 11:00',
  },
  {
    id: 'MSG006', type: 'system', typeText: '系统通知',
    title: '系统维护通知',
    content: '系统将于2026年4月10日 00:00-06:00 进行升级维护，届时部分功能可能暂时不可用，请提前做好安排。',
    status: 'read',
    createTime: '2026-04-05 09:00',
  },
  {
    id: 'MSG007', type: 'fund', typeText: '资金通知',
    title: '垫款提现失败',
    content: '垫款单 DK-2026032805（湘C·11111 大众帕萨特）提现失败，原因：收款账户已注销，请联系卖方更新收款信息。',
    status: 'read', bizId: 'DK-2026032805', bizType: 'advance',
    createTime: '2026-04-04 15:30',
  },
  {
    id: 'MSG008', type: 'approval', typeText: '审批通知',
    title: '销售签约审批待处理',
    content: '有一笔新的销售签约审批需要您处理，销售单 XS-20260401-001（粤B·67890 丰田卡罗拉），请及时审批。',
    status: 'read', bizId: 'AP-20260401-001', bizType: 'approval',
    createTime: '2026-04-03 10:00',
  },
  {
    id: 'MSG009', type: 'alert', typeText: '预警通知',
    title: '摄像头故障告警',
    content: '福田仓B区3号摄像头离线超过30分钟，已通知仓库监管人员前往检查。',
    status: 'read', bizId: 'AL002', bizType: 'alert',
    createTime: '2026-04-02 14:30',
  },
  {
    id: 'MSG010', type: 'inventory', typeText: '库存通知',
    title: '用车申请被驳回',
    content: '您的用车申请 UC-20260329-004（粤A·88001 维修保养）已被驳回，请联系管理员了解详情。',
    status: 'read', bizId: 'UC-20260329-004', bizType: 'vehicle_use',
    createTime: '2026-04-01 09:15',
  },
]
