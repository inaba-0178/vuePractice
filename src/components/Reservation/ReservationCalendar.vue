<template>
  <div class="reservation-calendar">
    <h2 class="reservation-calendar__title">オンライン予約</h2>

    <div class="reservation-calendar__inner">
      <!-- 予約種別タブ -->
      <div class="reservation-calendar__tabs" v-if="reservationTypes.length > 0">
        <button
          v-for="type in reservationTypes"
          :key="type.id"
          class="reservation-calendar__tab"
          :class="{ 'is-active': selectedTypeId === type.id }"
          @click="selectType(type.id)"
        >
          {{ type.name }}
        </button>
      </div>
      <div v-else-if="!loadingTypes" class="reservation-calendar__no-types">
        現在予約受付中の種別がありません。
      </div>

      <template v-if="selectedTypeId">

        <!-- 月ナビゲーション -->
        <div class="reservation-calendar__month-nav">
          <button
            class="reservation-calendar__month-btn"
            :disabled="!canGoPrev"
            @click="prevMonth"
          >‹</button>
          <span class="reservation-calendar__month-label">
            {{ currentYear }}年{{ currentMonth }}月
          </span>
          <button
            class="reservation-calendar__month-btn"
            :disabled="!canGoNext"
            @click="nextMonth"
          >›</button>
        </div>

        <!-- カレンダーグリッド -->
        <div class="reservation-calendar__grid">
          <div
            v-for="day in DAY_LABELS"
            :key="day.label"
            class="reservation-calendar__grid-header"
            :class="{ 'is-sat': day.label === '土', 'is-sun': day.label === '日' }"
          >
            {{ day.label }}
          </div>

          <div
            v-for="n in firstDayOfMonth"
            :key="`empty-${n}`"
            class="reservation-calendar__grid-cell is-empty"
          />

          <div
            v-for="day in daysInMonth"
            :key="day.date"
            class="reservation-calendar__grid-cell"
            :class="{
              'is-today':     day.isToday,
              'is-selected':  selectedDate === day.date,
              'is-available': day.isAvailable,
              'is-disabled':  day.isDisabled,
              'is-past':      day.isPast,
            }"
            @click="!day.isDisabled && !day.isPast && day.isAvailable && selectDate(day.date)"
          >
            <span class="reservation-calendar__grid-date">{{ day.day }}</span>
            <span class="reservation-calendar__grid-status" v-if="!day.isPast && !day.isDisabled">
              {{ day.isAvailable ? '○' : '−' }}
            </span>
          </div>
        </div>

        <!-- 凡例 -->
        <div class="reservation-calendar__legend">
          <span class="reservation-calendar__legend-item">
            <span class="reservation-calendar__legend-dot is-available">○</span> 予約可
          </span>
          <span class="reservation-calendar__legend-item">
            <span class="reservation-calendar__legend-dot">−</span> 予約不可
          </span>
        </div>

        <!-- 予約するボタン -->
        <button
          class="reservation-calendar__btn-reserve"
          :class="{ 'is-disabled': !selectedDate }"
          :disabled="!selectedDate"
          @click="openModal"
        >
          {{ selectedDate ? `${selectedDate} を予約する` : '日付を選択してください' }}
        </button>

      </template>
    </div>  <!-- inner ここで閉じる -->

    <!-- モーダル -->
    <ReservationModal
      v-if="showModal"
      :dealerId="dealerId"
      :carId="carId"
      :selectedDate="selectedDate"
      :selectedTypeId="selectedTypeId"
      :selectedTypeName="selectedTypeName"
      :schedules="schedulesOnSelectedDate"
      @close="showModal = false"
      @success="onSuccess"
      @error="onError"
    />

    <!-- 完了モーダル -->
    <div v-if="showSuccessModal" class="reservation-calendar__result-overlay">
      <div class="reservation-calendar__result-modal">
        <div class="reservation-calendar__result-icon">✓</div>
        <p class="reservation-calendar__result-message">{{ successMessage }}</p>
        <button class="reservation-calendar__result-btn" @click="showSuccessModal = false">OK</button>
      </div>
    </div>

    <!-- エラーモーダル -->
    <div v-if="showErrorModal" class="reservation-calendar__result-overlay">
      <div class="reservation-calendar__result-modal is-error">
        <div class="reservation-calendar__result-icon is-error">✕</div>
        <p class="reservation-calendar__result-message">{{ errorMessage }}</p>
        <button class="reservation-calendar__result-btn is-error" @click="showErrorModal = false">閉じる</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import ReservationModal from '@/components/Reservation/ReservationModal.vue'

const props = defineProps({
  dealerId: { type: Number, required: true },
  carId:    { type: Number, required: true },
})

const DAY_LABELS = [
  { label: '月' }, { label: '火' }, { label: '水' },
  { label: '木' }, { label: '金' }, { label: '土' }, { label: '日' },
]

const reservationTypes  = ref([])
const selectedTypeId    = ref(null)
const schedules         = ref([])
const selectedDate      = ref(null)
const loadingTypes      = ref(true)
const showModal         = ref(false)
const showSuccessModal  = ref(false)
const showErrorModal    = ref(false)
const successMessage    = ref('')
const errorMessage      = ref('')

// 現在表示中の年月
const today        = new Date()
const displayYear  = ref(today.getFullYear())
const displayMonth = ref(today.getMonth() + 1) // 1-12

const currentYear  = computed(() => displayYear.value)
const currentMonth = computed(() => displayMonth.value)

// 前月・次月の移動制限
const canGoPrev = computed(() => {
  if (displayYear.value > today.getFullYear()) return true
  return displayMonth.value > today.getMonth() + 1
})

const canGoNext = computed(() => {
  const maxMonth = today.getMonth() + 3 // 2ヶ月先まで
  const maxYear  = today.getFullYear() + (maxMonth > 12 ? 1 : 0)
  const adjustedMax = maxMonth > 12 ? maxMonth - 12 : maxMonth
  if (displayYear.value < maxYear) return true
  if (displayYear.value === maxYear) return displayMonth.value < adjustedMax
  return false
})

const prevMonth = () => {
  if (!canGoPrev.value) return
  if (displayMonth.value === 1) {
    displayMonth.value = 12
    displayYear.value--
  } else {
    displayMonth.value--
  }
  selectedDate.value = null
}

const nextMonth = () => {
  if (!canGoNext.value) return
  if (displayMonth.value === 12) {
    displayMonth.value = 1
    displayYear.value++
  } else {
    displayMonth.value++
  }
  selectedDate.value = null
}

// 月の1日の曜日（月曜始まり: 月=0, 日=6）
const firstDayOfMonth = computed(() => {
  const d   = new Date(displayYear.value, displayMonth.value - 1, 1)
  const day = d.getDay()
  return day === 0 ? 6 : day - 1
})

// 月の日数
const totalDays = computed(() => {
  return new Date(displayYear.value, displayMonth.value, 0).getDate()
})

// 日付セルの生成
const daysInMonth = computed(() => {
  const todayStr = formatDate(today)
  return Array.from({ length: totalDays.value }, (_, i) => {
    const day    = i + 1
    const date   = new Date(displayYear.value, displayMonth.value - 1, day)
    const dateStr = formatDate(date)
    const isPast  = dateStr < todayStr
    const isToday = dateStr === todayStr

    // スケジュールから予約可能かチェック
    const daySchedules  = schedules.value.filter(s => s.date === dateStr && !s.isFull)
    const isAvailable   = !isPast && daySchedules.length > 0

    return {
      day,
      date:        dateStr,
      isPast,
      isToday,
      isAvailable,
      isDisabled:  false,
    }
  })
})

const schedulesOnSelectedDate = computed(() => {
  if (!selectedDate.value) return []
  return schedules.value.filter(s => s.date === selectedDate.value && !s.isFull)
})

const selectedTypeName = computed(() => {
  return reservationTypes.value.find(t => t.id === selectedTypeId.value)?.name ?? ''
})

const currentMonthStr = computed(() => {
  return `${displayYear.value}-${String(displayMonth.value).padStart(2, '0')}`
})

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const selectType = async (typeId) => {
  selectedTypeId.value = typeId
  selectedDate.value   = null
  await fetchSchedules()
}

const selectDate = (date) => {
  selectedDate.value = date
}

const openModal = () => {
  if (!selectedDate.value) return
  showModal.value = true
}

const onSuccess = (message) => {
  showModal.value        = false
  successMessage.value   = message
  showSuccessModal.value = true
  selectedDate.value     = null
  fetchSchedules()
}

const onError = (message) => {
  showModal.value      = false
  errorMessage.value   = message
  showErrorModal.value = true
}

const fetchReservationTypes = async () => {
  loadingTypes.value = true
  try {
    const res = await axios.get('/api/ReservationTypes', {
      params: { dealerId: props.dealerId }
    })
    reservationTypes.value = res.data.reservationTypes ?? []
    if (reservationTypes.value.length > 0) {
      selectedTypeId.value = reservationTypes.value[0].id
      await fetchSchedules()
    }
  } catch (e) {
    console.error(e)
  } finally {
    loadingTypes.value = false
  }
}

const fetchSchedules = async () => {
  if (!selectedTypeId.value) return
  try {
    const res = await axios.get('/api/DealerSchedules', {
      params: {
        dealerId:          props.dealerId,
        reservationTypeId: selectedTypeId.value,
        month:             currentMonthStr.value,
      }
    })
    schedules.value = (res.data.schedules ?? []).map(s => ({
      ...s,
      date: s.date.substring(0, 10)
    }))
  } catch (e) {
    console.error(e)
  }
}

watch(currentMonthStr, () => fetchSchedules())

onMounted(() => fetchReservationTypes())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Montserrat:wght@300;400;500&display=swap');

.reservation-calendar {
  font-family: 'Montserrat', sans-serif;
  /*max-width: 480px;   ← 追加 */
  margin: 0 auto;    /* ← 中央寄せ */
}

.reservation-calendar__inner {
  max-width: 1000px;
  background: #111;          /* 背景色 */
  border: 1px solid #706e6e;    /* 枠線 */
  border-radius: 8px;        /* 角丸 */
  padding: 20px;
  margin: 0 auto;
}

.reservation-calendar__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0 0 24px;
  padding-left: 12px;
  border-left: 3px solid #dc5078;
}

/* ===== タブ ===== */
.reservation-calendar__tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 1px solid #1a1a1a;
}

.reservation-calendar__tab {
  padding: 10px 24px;
  border: 1px solid #2a2a2a;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  background: #333;
  color: #888;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: all 0.15s;
}
.reservation-calendar__tab:hover { color: #ccc; border-color: #444; }
.reservation-calendar__tab.is-active {
  background: #dc5078;
  border-color: #dc5078;
  color: #fff;
}

/* ===== 月ナビゲーション ===== */
.reservation-calendar__month-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0 4px;
}

.reservation-calendar__month-label {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.05em;
}

.reservation-calendar__month-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #444;
  border-radius: 50%;
  background: transparent;
  color: #888;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.reservation-calendar__month-btn:hover:not(:disabled) { border-color: #dc5078; color: #dc5078; }
.reservation-calendar__month-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ===== カレンダーグリッド ===== */
.reservation-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 12px;
}

.reservation-calendar__grid-header {
  text-align: center;
  font-size: 11px;
  font-weight: 400;
  color: #888;
  padding: 6px 0;
  letter-spacing: 0.05em;
}
.reservation-calendar__grid-header.is-sat {
    color: #5588cc;
}

.reservation-calendar__grid-header.is-sun {
    color: #cc5566;
}

.reservation-calendar__grid-cell {
  height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
  background: #2a2a2a;
  cursor: not-allowed;
  transition: all 0.15s;
  padding: 4px;
}
.reservation-calendar__grid-cell.is-empty {
  border: none;
  background: transparent;
}
.reservation-calendar__grid-cell.is-past {
  opacity: 0.3;
}
.reservation-calendar__grid-cell.is-available {
  cursor: pointer;
  border-color: #222a;
  background: #3a3a3a;
}
.reservation-calendar__grid-cell.is-available:hover {
  border-color: #dc5078;
  background: rgba(220, 80, 120, 0.08);
}
.reservation-calendar__grid-cell.is-today {
  border-color: #444;
}
.reservation-calendar__grid-cell.is-selected {
  background: #dc5078 !important;
  border-color: #dc5078 !important;
}

.reservation-calendar__grid-date {
  font-size: 12px;
  font-weight: 500;
  color: #888;
}
.reservation-calendar__grid-cell.is-available .reservation-calendar__grid-date { color: #ccc; }
.reservation-calendar__grid-cell.is-selected .reservation-calendar__grid-date { color: #fff; }
.reservation-calendar__grid-cell.is-today .reservation-calendar__grid-date { color: #dc5078; }
.reservation-calendar__grid-cell.is-selected.is-today .reservation-calendar__grid-date { color: #fff; }

.reservation-calendar__grid-status {
  font-size: 10px;
  color: #555;
}
.reservation-calendar__grid-cell.is-available .reservation-calendar__grid-status { color: #dc5078; }
.reservation-calendar__grid-cell.is-selected .reservation-calendar__grid-status { color: #fff; }

/* ===== 凡例 ===== */
.reservation-calendar__legend {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}
.reservation-calendar__legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #888;
}
.reservation-calendar__legend-dot { color: #666; }
.reservation-calendar__legend-dot.is-available { color: #dc5078; }

/* ===== 予約するボタン ===== */
.reservation-calendar__btn-reserve {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 4px;
  background: #dc5078;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background 0.15s;
}
.reservation-calendar__btn-reserve:hover { background: #c44068; }
.reservation-calendar__btn-reserve.is-disabled {
  background: #1a1a1a;
  color: #444;
  cursor: not-allowed;
  border: 1px solid #222;
}

.reservation-calendar__no-types {
  font-size: 12px;
  color: #666;
  padding: 20px 0;
}

/* ===== 結果モーダル ===== */
.reservation-calendar__result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.reservation-calendar__result-modal {
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 40px 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}
.reservation-calendar__result-modal.is-error { border-color: rgba(220, 80, 120, 0.4); }

.reservation-calendar__result-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(220, 80, 120, 0.15);
  border: 1px solid rgba(220, 80, 120, 0.4);
  color: #dc5078;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.reservation-calendar__result-icon.is-error {
  background: rgba(220, 80, 120, 0.1);
}

.reservation-calendar__result-message {
  font-size: 13px;
  color: #ccc;
  line-height: 1.8;
  margin-bottom: 24px;
  white-space: pre-line;
}

.reservation-calendar__result-btn {
  padding: 10px 40px;
  border: none;
  border-radius: 4px;
  background: #dc5078;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.reservation-calendar__result-btn:hover { background: #c44068; }
.reservation-calendar__result-btn.is-error {
  background: transparent;
  border: 1px solid #dc5078;
  color: #dc5078;
}
.reservation-calendar__result-btn.is-error:hover { background: rgba(220, 80, 120, 0.1); }
</style>