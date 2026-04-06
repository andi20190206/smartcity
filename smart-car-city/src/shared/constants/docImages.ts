/** 生成证件类 mock 占位图（SVG data URI） */
const makeSvg = (title: string, sub: string, bg: string, accent: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect fill="${bg}" width="400" height="260" rx="12"/><rect x="16" y="16" width="368" height="228" fill="#fff" rx="6" opacity="0.85"/><text x="200" y="60" text-anchor="middle" fill="${accent}" font-size="14" font-weight="bold" font-family="sans-serif">${title}</text><text x="200" y="90" text-anchor="middle" fill="#999" font-size="11" font-family="sans-serif">${sub}</text><rect x="40" y="110" width="140" height="10" rx="3" fill="#e8e8e8"/><rect x="40" y="130" width="200" height="10" rx="3" fill="#e8e8e8"/><rect x="40" y="150" width="160" height="10" rx="3" fill="#e8e8e8"/><rect x="40" y="170" width="180" height="10" rx="3" fill="#e8e8e8"/><rect x="40" y="190" width="120" height="10" rx="3" fill="#e8e8e8"/><rect x="280" y="110" width="80" height="100" rx="4" fill="#f0f0f0"/><text x="320" y="165" text-anchor="middle" fill="#ccc" font-size="10" font-family="sans-serif">照片</text></svg>`)}`

/** 车辆证件图片 */
export const vehicleDocImages = {
  licenseF: makeSvg('机动车行驶证', '正本', '#E8F5E9', '#2E7D32'),
  licenseB: makeSvg('机动车行驶证', '副本', '#E8F5E9', '#2E7D32'),
  regF: makeSvg('机动车登记证书', '首页', '#FFF3E0', '#E65100'),
  regB: makeSvg('机动车登记证书', '内页', '#FFF3E0', '#E65100'),
}

/** 车辆照片（使用 Unsplash 真实图） */
export const vehiclePhotoImages = {
  lf45: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=300&h=300&fit=crop',
  rb45: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=300&fit=crop',
  dashboard: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=300&fit=crop',
  seat: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=300&h=300&fit=crop',
  nameplate: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=300&h=300&fit=crop',
  engine: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300&h=300&fit=crop',
}

/** 身份证件图片 */
export const idDocImages = {
  idFront: makeSvg('居民身份证', '正面（人像面）', '#E3F2FD', '#1565C0'),
  idBack: makeSvg('居民身份证', '反面（国徽面）', '#E3F2FD', '#1565C0'),
  bizLicense: makeSvg('营业执照', '统一社会信用代码', '#FCE4EC', '#C62828'),
}

/** 收款人证件 & 银行卡图片 */
export const payeeDocImages = {
  payeeIdFront: makeSvg('收款人证件', '正面', '#F3E5F5', '#6A1B9A'),
  payeeIdBack: makeSvg('收款人证件', '反面', '#F3E5F5', '#6A1B9A'),
  bankCardFront: makeSvg('银行卡', '正面', '#E0F2F1', '#00695C'),
  bankCardBack: makeSvg('银行卡', '反面', '#E0F2F1', '#00695C'),
}

/** 维保报告图片 */
export const maintenanceImages = {
  report: makeSvg('维保报告', '第三方检测机构出具', '#FFF8E1', '#F57F17'),
}
