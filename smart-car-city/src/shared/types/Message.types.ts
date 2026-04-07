/** 消息类型 */
export type MessageType = 'approval' | 'fund' | 'inventory' | 'system' | 'alert'

/** 消息状态 */
export type MessageStatus = 'unread' | 'read'

/** 消息记录 */
export interface MessageRecord {
  id: string
  type: MessageType
  typeText: string
  title: string
  content: string
  status: MessageStatus
  bizId?: string
  bizType?: string
  createTime: string
}
