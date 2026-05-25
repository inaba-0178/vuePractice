<template>
  <div class="search-filter">
    <!-- 検索パネル：常時表示 -->
    <div class="search-filter__panel is-open">
      <div class="search-filter__body">

        <!-- 基本条件 -->
        <div class="search-filter__section">

          <!-- 行1：メーカー・車名 / モデル・グレード / 年式 / ミッション -->
          <div class="search-filter__row">
            <div class="search-filter__field">
              <label class="search-filter__label">メーカー・車名</label>
              <input
                v-model="form.makerName"
                type="text"
                class="search-filter__input"
                placeholder="例：トヨタ"
              />
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">モデル・グレード</label>
              <input
                v-model="form.modelGrade"
                type="text"
                class="search-filter__input"
                placeholder="選択する"
              />
            </div>
            <div class="search-filter__field search-filter__field--range">
              <label class="search-filter__label">年式</label>
              <div class="search-filter__range">
                <select v-model="form.yearFrom" class="search-filter__select">
                  <option value="">下限なし</option>
                  <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                </select>
                <span class="search-filter__range-sep">〜</span>
                <select v-model="form.yearTo" class="search-filter__select">
                  <option value="">上限なし</option>
                  <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
                </select>
              </div>
              <p v-if="yearError" class="search-filter__error">{{ yearError }}</p>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">ミッション</label>
              <div class="search-filter__checkboxes">
                <label class="search-filter__checkbox-label">
                  <input type="checkbox" v-model="form.transmission" value="AT/CVT" class="search-filter__checkbox" />
                  <span>AT/CVT</span>
                </label>
                <label class="search-filter__checkbox-label">
                  <input type="checkbox" v-model="form.transmission" value="MT" class="search-filter__checkbox" />
                  <span>MT</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 行2：地域 / 市区町村 / 走行距離 -->
          <div class="search-filter__row">
            <div class="search-filter__field">
              <label class="search-filter__label">地域</label>
              <input
                v-model="form.region"
                type="text"
                class="search-filter__input"
                placeholder="選択する"
              />
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">市区町村</label>
              <input
                v-model="form.city"
                type="text"
                class="search-filter__input"
                placeholder="選択する"
              />
            </div>
            <div class="search-filter__field search-filter__field--range">
              <label class="search-filter__label">走行距離</label>
              <div class="search-filter__range">
                <select v-model="form.mileageFrom" class="search-filter__select">
                    <option value="">下限なし</option>
                    <option v-for="m in MIN_MILEAGE_OPTIONS" :key="m.value" :value="m.value">
                        {{ m.label }}
                    </option>
                </select>
                <span class="search-filter__range-sep">〜</span>
                <select v-model="form.mileageTo" class="search-filter__select">
                    <option value="">上限なし</option>
                    <option v-for="m in MAX_MILEAGE_OPTIONS" :key="m.value" :value="m.value">
                        {{ m.label }}
                    </option>
                </select>
              </div>
              <p v-if="mileageError" class="search-filter__error">{{ mileageError }}</p>
            </div>
            <div class="search-filter__field"></div>
          </div>

          <!-- 行3：価格スライダー -->
          <div class="search-filter__row search-filter__row--price">
            <div class="search-filter__field search-filter__field--full">
              <label class="search-filter__label">価格</label>
              <HistogramSlider
                :buckets="histogram.buckets"
                :max-value="priceSliderMax"
                unit="万円"
                :from="form.priceFrom"
                :to="form.priceTo"
                @update:from="form.priceFrom = $event"
                @update:to="form.priceTo = $event"
              />
            </div>
          </div>

          <!-- 行4：ローン -->
          <div class="search-filter__row">
            <div class="search-filter__field search-filter__field--range">
              <label class="search-filter__label">ローン月々支払い価格</label>
              <div class="search-filter__range">
                <select v-model="form.loanMonthlyFrom" class="search-filter__select">
                  <option value="">下限なし</option>
                  <option v-for="l in loanMonthlyOptions" :key="l.value" :value="l.value">{{ l.label }}</option>
                </select>
                <span class="search-filter__range-sep">〜</span>
                <select v-model="form.loanMonthlyTo" class="search-filter__select">
                  <option value="">上限なし</option>
                  <option v-for="l in loanMonthlyOptions" :key="l.value" :value="l.value">{{ l.label }}</option>
                </select>
              </div>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">ローン種類</label>
              <div class="search-filter__checkboxes">
                <label class="search-filter__checkbox-label">
                  <input type="checkbox" v-model="form.loanType" value="normal" class="search-filter__checkbox" />
                  <span>通常ローン</span>
                </label>
                <label class="search-filter__checkbox-label">
                  <input type="checkbox" v-model="form.loanType" value="residual" class="search-filter__checkbox" />
                  <span>残価・据置ローン</span>
                </label>
              </div>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">ローン頭金（上限）</label>
              <select v-model="form.loanDownPayment" class="search-filter__select">
                <option value="">上限なし</option>
                <option v-for="l in loanDownOptions" :key="l.value" :value="l.value">{{ l.label }}</option>
              </select>
            </div>
            <div class="search-filter__field"></div>
          </div>

          <!-- 行5：本体色 -->
          <div class="search-filter__row">
            <div class="search-filter__field search-filter__field--full">
              <label class="search-filter__label">本体色</label>
              <div class="search-filter__colors">
                <button
                  v-for="color in colorOptions"
                  :key="color.value"
                  class="search-filter__color-btn"
                  :class="{ 'is-selected': form.colors.includes(color.value) }"
                  :style="{ background: color.hex_code }"
                  :title="color.label"
                  @click="toggleColor(color.value)"
                />
              </div>
            </div>
          </div>

          <!-- 行6：右側チェックボックス群 -->
          <div class="search-filter__row">
            <div class="search-filter__field search-filter__field--full">
              <div class="search-filter__option-checks">
                <label
                  v-for="opt in basicOptions"
                  :key="opt.value"
                  class="search-filter__option-check"
                  :class="{ 'is-highlight': opt.highlight }"
                >
                  <input type="checkbox" v-model="form.options" :value="opt.value" class="search-filter__checkbox" />
                  <span>{{ opt.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- 詳細条件トグル -->
        <div class="search-filter__detail-toggle" @click="isDetailOpen = !isDetailOpen">
          <span>{{ isDetailOpen ? '▲ 閉じる' : '▼ もっと詳細な条件を追加' }}</span>
        </div>

        <!-- 詳細条件 -->
        <div v-if="isDetailOpen" class="search-filter__detail">

          <!-- 車のタイプ -->
          <div class="search-filter__detail-section">
            <div class="search-filter__detail-section-title">車のタイプ</div>
            <div class="search-filter__checkboxes search-filter__checkboxes--grid">
              <label v-for="t in carTypeOptions" :key="t.value" class="search-filter__checkbox-label">
                <input type="checkbox" v-model="form.carTypes" :value="t.value" class="search-filter__checkbox" />
                <span>{{ t.label }}</span>
              </label>
            </div>
          </div>

          <!-- ボディタイプ / 保証 -->
          <div class="search-filter__detail-row">
            <div class="search-filter__field">
              <label class="search-filter__label">ボディタイプ</label>
              <input v-model="form.bodyType" type="text" class="search-filter__input" placeholder="選択する" />
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">保証</label>
              <select v-model="form.warranty" class="search-filter__select">
                <option value="">こだわらない</option>
                <option value="dealer">販売店保証あり</option>
                <option value="manufacturer">メーカー保証あり</option>
              </select>
            </div>
          </div>

          <!-- 排気量 / 車検残 -->
          <div class="search-filter__detail-row">
            <div class="search-filter__field search-filter__field--range">
              <label class="search-filter__label">排気量</label>
              <div class="search-filter__range">
                <select v-model="form.engineFrom" class="search-filter__select">
                  <option value="">下限なし</option>
                  <option v-for="e in MIN_ENGINE_OPTIONS" :key="e.value" :value="e.value">
                    {{ e.label }}
                  </option>
                </select>
                <span class="search-filter__range-sep">〜</span>
                <select v-model="form.engineTo" class="search-filter__select">
                  <option value="">上限なし</option>
                  <option v-for="e in MAX_ENGINE_OPTIONS" :key="e.value" :value="e.value">
                    {{ e.label }}
                  </option>
                </select>
              </div>
              <p v-if="engineError" class="search-filter__error">{{ engineError }}</p>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">車検残</label>
              <select v-model="form.inspectionRemaining" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                    v-for="r in INSPECTION_OPTIONS"
                    :key="r.value"
                    :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">エンジン種別</label>
              <select v-model="form.engineType" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                    v-for="r in ENGINE_TYPE_OPTIONS"
                    :key="r.value"
                    :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">ドア数</label>
              <select v-model="form.doorCount" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                    v-for="r in DOOR_COUNT_OPTIONS"
                    :key="r.value"
                    :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- 駆動方式 / スライドドア / ハンドル / 乗車定員 -->
          <div class="search-filter__detail-row">
            <div class="search-filter__field">
              <label class="search-filter__label">駆動方式</label>
              <select v-model="form.driveType" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                    v-for="r in DRIVE_OPTIONS"
                    :key="r.value"
                    :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">スライドドア</label>
              <select v-model="form.slideDoor" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                    v-for="r in SLIDE_DOOR_OPTIONS"
                    :key="r.value"
                    :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">ハンドル</label>
              <select v-model="form.handle" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                    v-for="r in HANDLE_OPTIONS"
                    :key="r.value"
                    :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
            <div class="search-filter__field">
                <label class="search-filter__label">乗車定員</label>
                <select v-model="form.passengerCount" class="search-filter__select">
                    <option value="">こだわらない</option>
                    <option
                      v-for="r in RidingCapacities"
                      :key="r.value"
                      :value="r.value"
                      >{{ r.label }}
                    </option>
                </select>
                </div>
          </div>

          <!-- その他チェックボックス群 -->
          <div class="search-filter__detail-row">
            <div class="search-filter__field search-filter__field--full">
              <div class="search-filter__option-checks">
                <label v-for="opt in detailOptions" :key="opt.value" class="search-filter__option-check">
                  <input type="checkbox" v-model="form.options" :value="opt.value" class="search-filter__checkbox" />
                  <span>{{ opt.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 基本装備 -->
          <div class="search-filter__detail-section">
            <div class="search-filter__detail-section-title">基本装備</div>
            <div class="search-filter__checkboxes search-filter__checkboxes--grid">
              <label v-for="eq in equipmentBasic" :key="eq.value" class="search-filter__checkbox-label">
                <input type="checkbox" v-model="form.equipment" :value="eq.value" class="search-filter__checkbox" />
                <span>{{ eq.label }}</span>
              </label>
            </div>
          </div>

          <!-- 安全性能・サポート -->
          <div class="search-filter__detail-section">
            <div class="search-filter__detail-section-title">安全性能・サポート</div>
            <div class="search-filter__checkboxes search-filter__checkboxes--grid">
              <label v-for="eq in equipmentSafety" :key="eq.value" class="search-filter__checkbox-label">
                <input type="checkbox" v-model="form.equipment" :value="eq.value" class="search-filter__checkbox" />
                <span>{{ eq.label }}</span>
              </label>
            </div>
          </div>

          <!-- 環境装備 / ドレスアップ -->
          <div class="search-filter__detail-row search-filter__detail-row--half">
            <div class="search-filter__detail-section">
              <div class="search-filter__detail-section-title">環境装備</div>
              <div class="search-filter__checkboxes search-filter__checkboxes--col2">
                <label v-for="eq in equipmentEnv" :key="eq.value" class="search-filter__checkbox-label">
                  <input type="checkbox" v-model="form.equipment" :value="eq.value" class="search-filter__checkbox" />
                  <span>{{ eq.label }}</span>
                </label>
              </div>
            </div>
            <div class="search-filter__detail-section">
              <div class="search-filter__detail-section-title">ドレスアップ（カスタム）</div>
              <div class="search-filter__checkboxes search-filter__checkboxes--col2">
                <label v-for="eq in equipmentDressup" :key="eq.value" class="search-filter__checkbox-label">
                  <input type="checkbox" v-model="form.equipment" :value="eq.value" class="search-filter__checkbox" />
                  <span>{{ eq.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- オーディオ / シート / その他 -->
          <div class="search-filter__detail-row search-filter__detail-row--three">
            <div class="search-filter__field">
              <label class="search-filter__label">オーディオ関連</label>
              <select v-model="form.audio" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                    v-for="r in AUDIO_OPTIONS"
                      :key="r.value"
                      :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">カーナビ/TV/DVD</label>
              <select v-model="form.navi" class="search-filter__select">
                <option value="">こだわらない</option>
                <option
                  v-for="r in NAVI_OPTIONS"
                    :key="r.value"
                    :value="r.value"
                    >{{ r.label }}
                </option>
              </select>
            </div>
            <div class="search-filter__field">
              <label class="search-filter__label">フリーワード</label>
              <input v-model="form.freeWord" type="text" class="search-filter__input" placeholder="キーワードを入力" />
            </div>
          </div>

          <!-- シート関連 -->
          <div class="search-filter__detail-section">
            <div class="search-filter__detail-section-title">シート関連</div>
            <div class="search-filter__checkboxes search-filter__checkboxes--grid">
              <label v-for="eq in seatOptions" :key="eq.value" class="search-filter__checkbox-label">
                <input type="checkbox" v-model="form.equipment" :value="eq.value" class="search-filter__checkbox" />
                <span>{{ eq.label }}</span>
              </label>
            </div>
          </div>

        </div>

        <!-- フッター：クリア・検索ボタン -->
        <div class="search-filter__footer">
          <button class="search-filter__btn-clear" @click="clearForm">条件をクリア</button>
          <button class="search-filter__btn-search" @click="submitSearch">
            <span class="search-filter__btn-icon">🔍</span>
            検索する
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import {
    HANDLE_OPTIONS,
    DOOR_COUNT_OPTIONS,
    SLIDE_DOOR_OPTIONS,
    DRIVE_OPTIONS,
    INSPECTION_OPTIONS,
    AUDIO_OPTIONS,
    NAVI_OPTIONS,
    ENGINE_TYPE_OPTIONS,
    MIN_MILEAGE_OPTIONS,
    MAX_MILEAGE_OPTIONS,
    MIN_ENGINE_OPTIONS,
    MAX_ENGINE_OPTIONS,
} from '@/constants/searchOptions.js'
import HistogramSlider from '@/components/Common/HistogramSlider.vue'

const emit = defineEmits(['search'])

const isDetailOpen = ref(false)
const loading      = ref(true)

// API取得データ
const colorOptions          = ref([])
const basicOptions          = ref([])
const detailOptions         = ref([])
const equipmentBasic        = ref([])
const equipmentSafety       = ref([])
const equipmentEnv          = ref([])
const equipmentDressup      = ref([])
const seatOptions           = ref([])
const engineOptions         = ref([])
const loanMonthlyOptions    = ref([])
const loanDownOptions       = ref([])
const carTypeOptions        = ref([])
const RidingCapacities      = ref([])

const fetchOptions = async () => {
  loading.value = true
  try {
    const [
      colorRes,
      basicRes,
      detailRes,
      equipBasicRes,
      equipSafetyRes,
      equipEnvRes,
      equipDressupRes,
      seatRes,
      mileageRes,
      displacementRes,
      loanMonthlyRes,
      loanDownRes,
      carTypeRes,
      RidingCapacityRes,
    ] = await Promise.all([
      axios.get('/api/SearchOptions/ColorOptions'),
      axios.get('/api/SearchOptions/BasicOptions'),
      axios.get('/api/SearchOptions/DetailOptions'),
      axios.get('/api/SearchOptions/EquipmentBasic'),
      axios.get('/api/SearchOptions/EquipmentSafety'),
      axios.get('/api/SearchOptions/EquipmentEnv'),
      axios.get('/api/SearchOptions/EquipmentDressup'),
      axios.get('/api/SearchOptions/SeatOption'),
      //axios.get('/api/Displacements'),
      axios.get('/api/SearchOptions/LoanMonthlyOption'),
      axios.get('/api/SearchOptions/LoanDownOption'),
      axios.get('/api/SearchOptions/CarTypeOption'),
      axios.get('api/RidingCapacities'),
    ])

    colorOptions.value     = colorRes.data
    basicOptions.value     = basicRes.data
    detailOptions.value    = detailRes.data
    equipmentBasic.value   = equipBasicRes.data
    equipmentSafety.value  = equipSafetyRes.data
    equipmentEnv.value     = equipEnvRes.data
    equipmentDressup.value = equipDressupRes.data
    seatOptions.value      = seatRes.data
    engineOptions.value = displacementRes.data.data.DisplacementList.map(item => ({
        value: item.id,
        label: item.name,
    }))
    RidingCapacities.value = RidingCapacityRes.data.data.RidingCapacityList.map(item => ({
        value: item.id,
        label: item.name,
    }))

    loanMonthlyOptions.value = loanMonthlyRes.data
    loanDownOptions.value    = loanDownRes.data
    carTypeOptions.value     = carTypeRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 価格のヒストグラム
const props = defineProps({
  vehicleId: { type: Number, default: null },
})
const histogram      = ref({ buckets: [], max_price: 0 })
const priceSliderMax = ref(2000)
const fetchHistogram = async () => {
  try {
    const params = {}
    if (props.vehicleId) params.vehicleId = props.vehicleId

    const res = await axios.get('/api/SearchOptions/CarPriceHistogram', { params })
    if (res.data.success) {
      histogram.value = res.data.histogram
      priceSliderMax.value = res.data.price_slider_max
      form.priceTo = res.data.price_slider_max
    }
  } catch (e) {
    console.error(e)
  }
}



onMounted(() => {
  fetchOptions()
  fetchHistogram()
})
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i)

const form = reactive({
  makerName:          '',
  modelGrade:         '',
  yearFrom:           '',
  yearTo:             '',
  region:             '',
  city:               '',
  mileageFrom:        '',
  mileageTo:          '',
  priceFrom:          0,
  priceTo:            2000,
  loanMonthlyFrom:    '',
  loanMonthlyTo:      '',
  loanType:           [],
  loanDownPayment:    '',
  colors:             [],
  options:            [],
  transmission:       [],
  carTypes:           [],
  bodyType:           '',
  warranty:           '',
  engineFrom:         '',
  engineTo:           '',
  inspectionRemaining:'',
  engineType:         '',
  doorCount:          '',
  driveType:          '',
  slideDoor:          '',
  handle:             '',
  passengerCount:     '',
  equipment:          [],
  audio:              '',
  navi:               '',
  freeWord:           '',
})

const toggleColor = (value) => {
  const idx = form.colors.indexOf(value)
  if (idx === -1) {
    form.colors.push(value)
  } else {
    form.colors.splice(idx, 1)
  }
}

const clearForm = () => {
  Object.assign(form, {
    makerName: '', modelGrade: '', yearFrom: '', yearTo: '',
    region: '', city: '', mileageFrom: '', mileageTo: '',
    priceFrom: 0, priceTo: 2000,
    loanMonthlyFrom: '', loanMonthlyTo: '', loanType: [], loanDownPayment: '',
    colors: [], options: [], transmission: [], carTypes: [],
    bodyType: '', warranty: '', engineFrom: '', engineTo: '',
    inspectionRemaining: '', engineType: '', doorCount: '',
    driveType: '', slideDoor: '', handle: '', passengerCount: '',
    equipment: [], audio: '', navi: '', freeWord: '',
  })
}

const mileageError      = ref('')
const yearError         = ref('')
const engineError       = ref('')

const submitSearch = () => {
    mileageError.value = ''
    yearError.value    = ''
    engineError.value  = ''

    if (form.mileageFrom && form.mileageTo &&
        Number(form.mileageFrom) > Number(form.mileageTo)) {
        mileageError.value = '走行距離の下限は上限より小さい値を設定してください'
        return
    }

    if (form.yearFrom && form.yearTo &&
        Number(form.yearFrom) > Number(form.yearTo)) {
        yearError.value = '年式の下限は上限より小さい値を設定してください'
        return
    }

    if (form.engineFrom && form.engineTo &&
        Number(form.engineFrom) > Number(form.engineTo)) {
        engineError.value = '排気量の下限は上限より小さい値を設定してください'
        return
    }

    // 選択された色のgroupを取得してユニークにする
    const selectedGroups = form.colors
        .map(v => colorOptions.value.find(c => c.value === v)?.group)
        .filter(Boolean)
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(',')

      // audio・naviをoptionsに追加
    const extraOptions = []
    if (form.audio) extraOptions.push(form.audio)
    if (form.navi)  extraOptions.push(form.navi)

    const allOptions = [
        ...form.options,
        ...extraOptions,
    ].filter(Boolean)

    emit('search', {
        ...form,
        colors:  selectedGroups,
        options: allOptions,
    })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

/* ===== ラッパー ===== */
.search-filter {
  margin-bottom: 32px;
  font-family: 'Montserrat', sans-serif;
}

/* ===== パネル ===== */
.search-filter__panel {
  border: 1px solid #222;
  border-radius: 4px;
  background: #0d0d0d;
}
.search-filter__body {
  padding: 24px;
}

/* ===== 行レイアウト ===== */
.search-filter__row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 24px;
  margin-bottom: 20px;
}
.search-filter__row--price {
  grid-template-columns: 1fr;
}

/* ===== フィールド ===== */
.search-filter__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.search-filter__field--full {
  grid-column: 1 / -1;
}

/* ===== ラベル ===== */
.search-filter__label {
  font-size: 11px;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.08em;
}

/* ===== インプット / セレクト ===== */
.search-filter__input,
.search-filter__select {
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 3px;
  padding: 8px 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #ccc;
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
  -webkit-appearance: none;
}
.search-filter__input:focus,
.search-filter__select:focus {
  border-color: #dc5078;
}
.search-filter__select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}

/* ===== レンジ ===== */
.search-filter__range {
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-filter__range .search-filter__select {
  flex: 1;
}
.search-filter__range-sep {
  font-size: 11px;
  color: #888;
  flex-shrink: 0;
}

/* ===== 価格スライダー ===== */
.search-filter__price-area {
  display: flex;
  align-items: center;
  gap: 16px;
}
.search-filter__price-display {
  font-size: 12px;
  font-weight: 300;
  color: #fff;
  min-width: 80px;
  white-space: nowrap;
}
.search-filter__slider-wrap {
  flex: 1;
  position: relative;
  height: 24px;
  display: flex;
  align-items: center;
}
.search-filter__slider {
  position: absolute;
  width: 100%;
  height: 4px;
  appearance: none;
  -webkit-appearance: none;
  background: #2a2a2a;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.search-filter__slider--to {
  background: transparent;
}
.search-filter__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #dc5078;
  cursor: pointer;
  border: 2px solid #0d0d0d;
}

/* ===== チェックボックス ===== */
.search-filter__checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}
.search-filter__checkboxes--grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px 16px;
}
.search-filter__checkboxes--col2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
}
.search-filter__checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 300;
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: color 0.15s;
}
.search-filter__checkbox-label:hover {
  color: #dc5078;
}
/* チェック済みラベルのハイライト */
.search-filter__checkbox-label:has(input:checked) {
  color: #dc5078;
}
.search-filter__checkbox {
  width: 13px;
  height: 13px;
  accent-color: #dc5078;
  cursor: pointer;
  flex-shrink: 0;
}

/* ===== オプションチェック（横並び多数） ===== */
.search-filter__option-checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}
.search-filter__option-check {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 300;
  color: #fff;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: color 0.15s;
}
.search-filter__option-check.is-highlight span {
  color: #dc5078;
}
.search-filter__option-check:hover span {
  color: #dc5078;
}
/* チェック済みオプションのハイライト */
.search-filter__option-check:has(input:checked) span {
  color: #dc5078;
  font-weight: 500;
}

/* ===== カラーチップ ===== */
.search-filter__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.search-filter__color-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  padding: 0;
  outline: none;
}
.search-filter__color-btn:hover {
  transform: scale(1.15);
  border-color: rgba(255, 255, 255, 0.8);
}
.search-filter__color-btn.is-selected {
  border-color: #fff;
  box-shadow: 0 0 0 2px #dc5078;
}

/* ===== 詳細条件トグル ===== */
.search-filter__detail-toggle {
  padding: 10px 0;
  font-size: 12px;
  font-weight: 400;
  color: #dc5078;
  cursor: pointer;
  letter-spacing: 0.05em;
  border-top: 1px solid #1a1a1a;
  margin-top: 4px;
}
.search-filter__detail-toggle:hover {
  color: #ff6088;
}

/* ===== 詳細セクション ===== */
.search-filter__detail {
  padding-top: 20px;
  border-top: 1px solid #1a1a1a;
  margin-top: 8px;
}
.search-filter__detail-section {
  margin-bottom: 24px;
}
.search-filter__detail-section-title {
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #1a1a1a;
}

.search-filter__detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 24px;
  margin-bottom: 20px;
}
.search-filter__detail-row--half {
  grid-template-columns: 1fr 1fr;
}
.search-filter__detail-row--three {
  grid-template-columns: repeat(3, 1fr);
}

/* ===== フッター ===== */
.search-filter__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #1a1a1a;
  margin-top: 8px;
}
.search-filter__btn-clear {
  background: transparent;
  border: 1px solid #444;
  border-radius: 3px;
  padding: 10px 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #aaa;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.search-filter__btn-clear:hover {
  border-color: #666;
  color: #fff;
}
.search-filter__btn-search {
  background: #dc5078;
  border: none;
  border-radius: 3px;
  padding: 10px 28px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 8px;
}
.search-filter__btn-search:hover {
  background: #e8607e;
  transform: translateY(-1px);
}
.search-filter__btn-search:active {
  transform: translateY(0);
}
.search-filter__btn-icon {
  font-size: 14px;
}



.search-filter__error {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #dc5078;
    margin: 4px 0 0;
    letter-spacing: 0.03em;
}
</style>