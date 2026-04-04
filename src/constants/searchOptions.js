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
  { value: 'cd',  label: 'CDあり' },
  { value: 'dvd', label: 'DVDあり' },
]

export const NAVI_OPTIONS = [
  { value: 'navi', label: 'カーナビあり' },
  { value: 'tv',   label: 'TVあり' },
]

export const ENGINE_TYPE_OPTIONS = [
  { value: 'gasoline', label: 'ガソリン（レギュラー/ハイオク）' },
  { value: 'diesel',   label: 'ディーゼル（軽油）' },
  { value: 'hybrid',   label: 'ハイブリッド' },
  { value: 'electric', label: '電気自動車（EV）' },
  { value: 'phev',     label: 'PHEV' },
  { value: 'other',    label: 'その他' },
]
