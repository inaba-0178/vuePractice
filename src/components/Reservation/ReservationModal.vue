<template>
  <div class="reservation-modal__overlay" @click.self="$emit('close')">
    <div class="reservation-modal">
      <!-- ヘッダー -->
      <div class="reservation-modal__header">
        <h3 class="reservation-modal__title">
          {{ selectedTypeName }} ー {{ selectedDate }}
        </h3>
        <button class="reservation-modal__close" @click="$emit('close')">✕</button>
      </div>

      <div class="reservation-modal__body">

        <!-- 時間選択 -->
        <div class="reservation-modal__section">
          <label class="reservation-modal__label">時間を選択してください</label>
          <div class="reservation-modal__times">
            <button
                v-for="schedule in schedules"
                :key="schedule.id"
                class="reservation-modal__time-btn"
                :class="{
                    'is-active':   selectedScheduleId === schedule.id,
                    'is-disabled': isPastTime(schedule),
                }"
                :disabled="isPastTime(schedule)"
                @click="!isPastTime(schedule) && (selectedScheduleId = schedule.id) && (selectedMaxReservations = schedule.maxReservations)"
                >
                {{ schedule.timeFrom.slice(0, 5) }} 〜 {{ schedule.timeTo.slice(0, 5) }}
            </button>
          </div>
          <p v-if="schedules.length === 0" class="reservation-modal__no-time">
            この日は予約可能な時間がありません。
          </p>
        </div>

        <!-- 備考 -->
        <div class="reservation-modal__section">
          <label class="reservation-modal__label">備考（任意）</label>
          <textarea
            v-model="form.memo"
            class="reservation-modal__textarea"
            placeholder="ご質問・ご要望などがあればお書きください"
            rows="3"
          />
        </div>

        <!-- ゲスト情報（未ログイン時のみ） -->
        <template v-if="!isLoggedIn">
          <div class="reservation-modal__divider" />

          <div class="reservation-modal__section">
            <label class="reservation-modal__label">お名前</label>
            <input
              v-model="form.guestName"
              type="text"
              class="reservation-modal__input"
              placeholder="例：山田 太郎"
            />
          </div>

          <div class="reservation-modal__section">
            <label class="reservation-modal__label">
              電話番号またはメールアドレス
              <span class="reservation-modal__required">※どちらか必須</span>
            </label>
            <input
              v-model="form.guestPhone"
              type="tel"
              class="reservation-modal__input"
              placeholder="電話番号（例：090-0000-0000）"
            />
            <input
              v-model="form.guestEmail"
              type="email"
              class="reservation-modal__input"
              placeholder="メールアドレス（例：example@mail.com）"
              style="margin-top: 8px;"
            />
          </div>

          <div class="reservation-modal__section">
            <label class="reservation-modal__label">住所（任意）</label>
            <input
              v-model="form.guestAddress"
              type="text"
              class="reservation-modal__input"
              placeholder="例：東京都渋谷区..."
            />
          </div>

          <div class="reservation-modal__divider" />

          <!-- 会員・新規登録リンク -->
          <div class="reservation-modal__member-links">
            <router-link to="/member/login" class="reservation-modal__member-link">
              会員の方はこちら →
            </router-link>
            <router-link to="/register" class="reservation-modal__member-link">
              新規会員登録はこちら →
            </router-link>
          </div>
        </template>

        <!-- 同意チェック -->
        <div class="reservation-modal__agree">
            <input
                type="checkbox"
                id="agreed-terms"
                v-model="agreedTerms"
                class="reservation-modal__agree-checkbox"
            />
            <label for="agreed-terms" class="reservation-modal__agree-label">
                上記及び
                <a href="/terms" target="_blank" class="reservation-modal__agree-link">利用規約</a>
                及び
                <a href="/privacy" target="_blank" class="reservation-modal__agree-link">個人情報の取扱について</a>
                に同意する
            </label>
        </div>

        <!-- エラーメッセージ -->
        <p v-if="errorMsg" class="reservation-modal__error">{{ errorMsg }}</p>

        <!-- 予約するボタン -->
        <button
          class="reservation-modal__btn-submit"
          :class="{ 'is-disabled': !canSubmit }"
          :disabled="!canSubmit || submitting"
          @click="submit"
        >
          {{ submitting ? '送信中...' : '予約する' }}
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
// import { useStore } from 'vuex'

const props = defineProps({
  dealerId:         { type: Number,  required: true },
  carId:            { type: Number,  required: true },
  selectedDate:     { type: String,  required: true },
  selectedTypeId:   { type: Number,  required: true },
  selectedTypeName: { type: String,  required: true },
  schedules:        { type: Array,   default: () => [] },
})

const emit = defineEmits(['close', 'success', 'error'])

//const store = useStore()

const isLoggedIn = computed(() => !!localStorage.getItem('member_token'))
const selectedScheduleId     = ref(null)
const selectedMaxReservations = ref(1)
const agreedTerms            = ref(false)
const submitting             = ref(false)
const errorMsg               = ref('')

const form = ref({
  memo:         '',
  guestName:    '',
  guestPhone:   '',
  guestEmail:   '',
  guestAddress: '',
})

const canSubmit = computed(() => {
  if (!agreedTerms.value) return false
  if (!selectedScheduleId.value) return false
  if (!isLoggedIn.value) {
    if (!form.value.guestPhone && !form.value.guestEmail) return false
  }
  return true
})

const isPastTime = (schedule) => {
  const now      = new Date()
  const dateTime = new Date(`${props.selectedDate} ${schedule.timeFrom}`)
  return dateTime < now
}

const submit = async () => {
  if (!canSubmit.value) return

  submitting.value = true
  errorMsg.value   = ''

  try {
    const payload = {
      dealer_id:           props.dealerId,
      car_id:              props.carId,
      reservation_type_id: props.selectedTypeId,
      schedule_id:         selectedScheduleId.value,
      max_reservations:    selectedMaxReservations.value,
      memo:                form.value.memo || null,
      agreed_terms:        true,
      guest_name:          form.value.guestName || null,
      guest_phone:         form.value.guestPhone || null,
      guest_email:         form.value.guestEmail || null,
      guest_address:       form.value.guestAddress || null,
    }

    await axios.post('/api/Reservations', payload)

    emit('success', '仮予約を受け付けました。\n担当のものが内容を確認後、ご連絡いたします。\nしばらくお待ちください。')

  } catch (e) {
    const message = e.response?.data?.message ?? '大変申し訳ございません。予約できませんでした。'
    emit('error', message)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap');

.reservation-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  padding: 20px;
}

.reservation-modal {
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  font-family: 'Montserrat', sans-serif;
}

/* ===== ヘッダー ===== */
.reservation-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #1a1a1a;
}

.reservation-modal__title {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0;
  letter-spacing: 0.05em;
}

.reservation-modal__close {
  background: transparent;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.15s;
}
.reservation-modal__close:hover { color: #fff; }

/* ===== ボディ ===== */
.reservation-modal__body { padding: 24px; }

.reservation-modal__section { margin-bottom: 20px; }

.reservation-modal__label {
  display: block;
  font-size: 11px;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.reservation-modal__required {
  font-size: 10px;
  color: #dc5078;
  margin-left: 6px;
}

/* ===== 時間ボタン ===== */
.reservation-modal__times {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reservation-modal__time-btn {
  padding: 8px 16px;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  background: #111;
  color: #888;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.reservation-modal__time-btn:hover { border-color: #dc5078; color: #dc5078; }
.reservation-modal__time-btn.is-active {
  background: #dc5078;
  border-color: #dc5078;
  color: #fff;
}

.reservation-modal__no-time {
  font-size: 12px;
  color: #555;
}

/* ===== 入力 ===== */
.reservation-modal__input,
.reservation-modal__textarea {
  width: 100%;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 3px;
  padding: 10px 12px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #ccc;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.reservation-modal__input:focus,
.reservation-modal__textarea:focus { border-color: #dc5078; }
.reservation-modal__textarea { resize: vertical; }

/* ===== 区切り線 ===== */
.reservation-modal__divider {
  border: none;
  border-top: 1px solid #1a1a1a;
  margin: 20px 0;
}

/* ===== 会員リンク ===== */
.reservation-modal__member-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.reservation-modal__member-link {
  font-size: 12px;
  color: #dc5078;
  text-decoration: none;
  letter-spacing: 0.03em;
  transition: color 0.15s;
}
.reservation-modal__member-link:hover { color: #ff6088; }

/* ===== 同意チェック ===== */
.reservation-modal__agree {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;
  padding: 16px;
  background: #111;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
}

.reservation-modal__agree-label {
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  line-height: 1.6;
}

.reservation-modal__agree-checkbox {
  all: revert !important;  /* ← グローバルCSSをリセット */
  width: 16px !important;
  height: 16px !important;
  accent-color: #dc5078;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.reservation-modal__agree-link {
  color: #dc5078;
  text-decoration: underline;
}

/* ===== エラー ===== */
.reservation-modal__error {
  font-size: 12px;
  color: #dc5078;
  margin-bottom: 16px;
  padding: 10px 12px;
  background: rgba(220, 80, 120, 0.1);
  border: 1px solid rgba(220, 80, 120, 0.3);
  border-radius: 4px;
}

/* ===== 予約するボタン ===== */
.reservation-modal__btn-submit {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 4px;
  background: #dc5078;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background 0.15s;
}
.reservation-modal__btn-submit:hover { background: #c44068; }
.reservation-modal__btn-submit.is-disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
}

.reservation-modal__time-btn.is-disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #1a1a1a;
  color: #444;
}
</style>