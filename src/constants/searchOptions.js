export const HANDLE_OPTIONS = [
  { value: 'right', label: '右ハンドル' },
  { value: 'left',  label: '左ハンドル' },
]

export const DOOR_COUNT_OPTIONS = [
  { value: '2', label: '2ドア' },
  { value: '4', label: '4ドア' },
  { value: '5', label: '5ドア' },
]

export const SLIDE_DOOR_OPTIONS = [
  { value: 'right_only',   label: '片側（右）' },
  { value: 'left_power',   label: '片側（左）' },
  { value: 'both_manual',  label: '両側（手動）' },
  { value: 'both_power',   label: '両側（電動）' },
]

export const DRIVE_OPTIONS = [
  { value: '2WD', label: '2WD' },
  { value: '4WD', label: '4WD' },
  { value: 'AWD', label: 'AWD' },
  { value: 'FR',  label: 'FR' },
  { value: 'FF',  label: 'FF' },
  { value: 'MR',  label: 'MR' },
  { value: 'RR',  label: 'RR' },
]

export const INSPECTION_OPTIONS = [
  { value: '6m', label: '6ヶ月以上' },
  { value: '1y', label: '1年以上' },
  { value: '2y', label: '2年以上' },
]

export const AUDIO_OPTIONS = [
    { value: 'cd',        label: 'CDあり' },
    { value: 'dvd',       label: 'DVDあり' },
    { value: 'bluetooth', label: 'Bluetooth' },
    { value: 'usb',       label: 'USB' },
]

export const NAVI_OPTIONS = [
    { value: 'navi',    label: 'カーナビあり' },
    { value: 'tv',      label: 'TVあり' },
    { value: 'dvd_navi',label: 'DVDナビあり' },
]

export const ENGINE_TYPE_OPTIONS = [
  { value: 'gasoline', label: 'ガソリン（レギュラー/ハイオク）' },
  { value: 'diesel',   label: 'ディーゼル（軽油）' },
  { value: 'hybrid',   label: 'ハイブリッド' },
  { value: 'electric', label: '電気自動車（EV）' },
  { value: 'phev',     label: 'PHEV' },
  { value: 'other',    label: 'その他' },
]

export const MIN_MILEAGE_OPTIONS = [
    { label: '1万km以上',  value: 10000 },
    { label: '3万km以上',  value: 30000 },
    { label: '5万km以上',  value: 50000 },
    { label: '10万km以上', value: 100000 },
    { label: '15万km以上', value: 150000 },
]

export const MAX_MILEAGE_OPTIONS = [
    { label: '1万km以下',  value: 9999 },
    { label: '3万km以下',  value: 29999 },
    { label: '5万km以下',  value: 49999 },
    { label: '10万km以下', value: 99999 },
    { label: '15万km以下', value: 149999 },
]

export const MIN_ENGINE_OPTIONS = [
    { label: '800cc以上',   value: 800 },
    { label: '1,000cc以上', value: 1000 },
    { label: '1,500cc以上', value: 1500 },
    { label: '2,000cc以上', value: 2000 },
    { label: '2,500cc以上', value: 2500 },
    { label: '3,000cc以上', value: 3000 },
    { label: '4,000cc以上', value: 4000 },
]

export const MAX_ENGINE_OPTIONS = [
    { label: '800cc以下',   value: 800 },
    { label: '1,400cc以下', value: 1400 },
    { label: '1,900cc以下', value: 1900 },
    { label: '2,400cc以下', value: 2400 },
    { label: '2,900cc以下', value: 2900 },
    { label: '4,000cc以下', value: 4000 },
]