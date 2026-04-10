/**
 * 価格を万円単位で表示（小数点1桁）
 * 例: 70200 → "7.0万円"
 */
export const formatPrice = (price) =>
  price ? (Number(price) / 10000).toFixed(1) + '万円' : '-'

/**
 * 走行距離をフォーマット
 * 例: 10000 → "10,000"
 */
export const formatMileage = (mileage) =>
  mileage ? Number(mileage).toLocaleString() : '-'

/**
 * 修復歴をフォーマット
 */
export const formatRepairHistory = (val) =>
  ({ none: 'なし', minor: '軽微あり', major: 'あり', unknown: '不明' }[val] ?? val ?? '-')

/**
 * 車検状態をフォーマット
 */
export const formatInspection = (status, expireDate) => {
  if (status === 'none') return '車検なし'
  if (status === 'new_car') return '新車'
  if (expireDate) return expireDate
  return '車検整備付'
}

/**
 * ハンドルをフォーマット
 */
export const formatSteering = (val) =>
  ({ right: '右ハンドル', left: '左ハンドル' }[val] ?? val ?? '-')

/**
 * 燃料タイプをフォーマット
 */
export const formatFuelType = (val) =>
  ({
    gasoline: 'ガソリン',
    diesel:   'ディーゼル',
    hybrid:   'ハイブリッド',
    electric: '電気自動車',
    phev:     'PHEV',
    other:    'その他',
  }[val] ?? val ?? '-')

/**
 * スライドドアをフォーマット
 */
export const formatSlideDoor = (val) =>
  ({
    none:         'なし',
    right_only:   '片側（右）',
    left_power:   '片側（左）',
    both_manual:  '両側（手動）',
    both_power:   '両側（電動）',
  }[val] ?? val ?? '-')