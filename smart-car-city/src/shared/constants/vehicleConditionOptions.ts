import type { CollisionLevel, WaterDamageLevel, FireDamageLevel } from '../types/Purchase.types'

/** 碰撞等级选项 */
export const collisionOptions: { value: CollisionLevel; label: string; short: string }[] = [
  { value: '覆盖件、加强件和结构件均无损伤、修复', label: '覆盖件、加强件和结构件均无损伤、修复', short: '无损伤' },
  { value: '结构件、加强件无损伤、修复；覆盖件有修复', label: '结构件、加强件无损伤、修复；覆盖件有修复', short: '覆盖件修复' },
  { value: '结构件无损伤、修复，加强件无切割；加强件和覆盖件有修复；安全气囊进行过事故更换', label: '结构件无损伤、修复，加强件无切割；加强件和覆盖件有修复；安全气囊进行过事故更换', short: '加强件修复' },
  { value: '结构件发生一处或多处损伤、修复；加强件发生一处或多处切割', label: '结构件发生一处或多处损伤、修复；加强件发生一处或多处切割', short: '结构件损伤' },
]

/** 水泡等级选项 */
export const waterDamageOptions: { value: WaterDamageLevel; label: string }[] = [
  { value: '正常', label: '正常' },
  { value: '涉水', label: '涉水' },
  { value: '泡水', label: '泡水' },
]

/** 火烧等级选项 */
export const fireDamageOptions: { value: FireDamageLevel; label: string; short: string }[] = [
  { value: '正常', label: '正常', short: '正常' },
  { value: '客舱外火烧熏黑碳化痕迹或火烧炙烤融化面积达到 0.3m²(含) 以上', label: '客舱外火烧熏黑碳化痕迹或火烧炙烤融化面积达到 0.3m²(含) 以上', short: '客舱外火烧' },
  { value: '客舱内火烧熏黑碳化痕迹或火烧炙烤融化面积达到 0.3m²(含) 以上', label: '客舱内火烧熏黑碳化痕迹或火烧炙烤融化面积达到 0.3m²(含) 以上', short: '客舱内火烧' },
]

/** 获取碰撞短标签 */
export const getCollisionShort = (v: CollisionLevel): string =>
  collisionOptions.find((o) => o.value === v)?.short ?? v

/** 获取火烧短标签 */
export const getFireDamageShort = (v: FireDamageLevel): string =>
  fireDamageOptions.find((o) => o.value === v)?.short ?? v

/** 碰撞等级对应颜色 */
export const getCollisionColor = (v: CollisionLevel): string => {
  if (v === '覆盖件、加强件和结构件均无损伤、修复') return 'green'
  if (v === '结构件、加强件无损伤、修复；覆盖件有修复') return 'orange'
  return 'red'
}

/** 水泡等级对应颜色 */
export const getWaterDamageColor = (v: WaterDamageLevel): string => {
  if (v === '正常') return 'green'
  if (v === '涉水') return 'orange'
  return 'red'
}

/** 火烧等级对应颜色 */
export const getFireDamageColor = (v: FireDamageLevel): string => {
  if (v === '正常') return 'green'
  return 'red'
}
