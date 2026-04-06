/** 配置中心类型定义 */

/** 配置级别 */
export type ConfigLevel = 'platform' | 'dealer_company' | 'store'

/** 配置项值类型 */
export type ConfigValueType = 'select' | 'multi_select' | 'number' | 'percentage' | 'toggle' | 'threshold'

/** 单个配置项 */
export interface ConfigItem {
  id: string
  /** 配置项名称 */
  name: string
  /** 配置项 key */
  key: string
  /** 分组 */
  group: string
  /** 说明 */
  description: string
  /** 建议粒度 */
  level: ConfigLevel
  /** 值类型 */
  valueType: ConfigValueType
  /** 当前值 */
  value: string | number | boolean | string[]
  /** 默认值 */
  defaultValue: string | number | boolean | string[]
  /** 可选项（select / multi_select） */
  options?: { label: string; value: string }[]
  /** 数值范围 */
  range?: { min: number; max: number; step: number; unit: string }
  /** 是否被经销公司覆盖 */
  overridden?: boolean
}

/** 配置变更记录 */
export interface ConfigChangeLog {
  id: string
  configKey: string
  configName: string
  oldValue: string
  newValue: string
  operator: string
  operatorRole: string
  level: ConfigLevel
  companyName?: string
  changeTime: string
}

/** 经销公司配置覆盖 */
export interface CompanyConfigOverride {
  companyId: string
  companyName: string
  overrideCount: number
  lastUpdateTime: string
}
