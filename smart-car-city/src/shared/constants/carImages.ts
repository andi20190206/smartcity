/** Unsplash 真实车辆图片，用于占位展示 */
export const carImages = [
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=300&fit=crop',
]

/** 备用图：任何图片加载失败时使用 */
const FALLBACK = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop'

/** 根据索引获取车辆图片，循环使用 */
export const getCarImage = (index: number) => carImages[index % carImages.length]

/** 小尺寸缩略图 */
export const getCarThumb = (index: number) =>
  carImages[index % carImages.length].replace('w=400&h=300', 'w=200&h=150')

/** 列表卡片用图（横向） */
export const getCarListImage = (index: number) =>
  carImages[index % carImages.length].replace('w=400&h=300', 'w=300&h=200')

/** 图片加载失败时的 fallback 处理 */
export const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.target as HTMLImageElement
  if (!img.dataset.fallback) {
    img.dataset.fallback = '1'
    img.src = FALLBACK
  }
}
