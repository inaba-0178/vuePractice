<template>
  <div class="register-wrapper">
    <div class="register-card">
      <h1 class="register-title">REGISTER</h1>
      <p class="register-subtitle">必要事項をご入力の上、会員登録を完了してください。</p>

      <div class="register-grid">
        <!-- 苗字・名前 -->
        <div class="field">
          <label>苗字</label>
          <input v-model="form.sei" type="text" placeholder="山田" class="register-input" :class="{ 'input-error': errors.sei }" />
          <span v-if="errors.sei" class="error-msg">{{ errors.sei }}</span>
        </div>
        <div class="field">
          <label>名前</label>
          <input v-model="form.mei" type="text" placeholder="太郎" class="register-input" :class="{ 'input-error': errors.mei }" />
          <span v-if="errors.mei" class="error-msg">{{ errors.mei }}</span>
        </div>

        <!-- 苗字カナ・名前カナ -->
        <div class="field">
          <label>苗字（カナ）</label>
          <input v-model="form.sei_kana" @blur="form.sei_kana = toKatakana(form.sei_kana)" type="text" placeholder="ヤマダ" class="register-input" :class="{ 'input-error': errors.sei_kana }" />
          <span v-if="errors.sei_kana" class="error-msg">{{ errors.sei_kana }}</span>
        </div>
        <div class="field">
          <label>名前（カナ）</label>
          <input v-model="form.mei_kana" @blur="form.mei_kana = toKatakana(form.mei_kana)" type="text" placeholder="タロウ" class="register-input" :class="{ 'input-error': errors.mei_kana }" />
          <span v-if="errors.mei_kana" class="error-msg">{{ errors.mei_kana }}</span>
        </div>

        <!-- 生年月日 -->
        <div class="field full">
          <label>生年月日</label>
          <input
            v-model="form.birth_date"
            type="date"
            class="register-input date-input"
            :class="{ 'input-error': errors.birth_date }"
            :max="today"
          />
          <span v-if="errors.birth_date" class="error-msg">{{ errors.birth_date }}</span>
        </div>

        <!-- 性別 -->
        <div class="field full">
          <label>性別</label>
          <select v-model="form.gender" class="register-input" :class="{ 'input-error': errors.gender }">
            <option value="0">未回答</option>
            <option value="1">男性</option>
            <option value="2">女性</option>
          </select>
          <span v-if="errors.gender" class="error-msg">{{ errors.gender }}</span>
        </div>

        <!-- 郵便番号 -->
        <div class="field full">
          <label>郵便番号</label>
          <input
            v-model="form.post_code"
            type="text"
            placeholder="1234567"
            maxlength="7"
            class="register-input"
            :class="{ 'input-error': errors.post_code }"
            @input="fetchAddress"
          />
          <span v-if="errors.post_code" class="error-msg">{{ errors.post_code }}</span>
        </div>

        <!-- 都道府県 -->
        <div class="field full">
          <label>都道府県</label>
          <input v-model="form.prefecture" type="text" placeholder="東京都" class="register-input" :class="{ 'input-error': errors.prefecture }" />
          <span v-if="errors.prefecture" class="error-msg">{{ errors.prefecture }}</span>
        </div>

        <!-- 市区町村 -->
        <div class="field full">
          <label>市区町村</label>
          <input v-model="form.city" type="text" placeholder="渋谷区道玄坂" class="register-input" :class="{ 'input-error': errors.city }" />
          <span v-if="errors.city" class="error-msg">{{ errors.city }}</span>
        </div>

        <!-- 番地 -->
        <div class="field full">
          <label>番地</label>
          <input v-model="form.address_line1" type="text" placeholder="1-2-3" class="register-input" :class="{ 'input-error': errors.address_line1 }" />
          <span v-if="errors.address_line1" class="error-msg">{{ errors.address_line1 }}</span>
        </div>

        <!-- 建物名 -->
        <div class="field full">
          <label>建物名・部屋番号 <span class="optional">任意</span></label>
          <input v-model="form.address_line2" type="text" placeholder="〇〇マンション 101号室" class="register-input" />
        </div>

        <!-- 電話番号 -->
        <div class="field full">
          <label>電話番号</label>
          <input v-model="form.phone_number" @blur="form.phone_number = toHalfWidthNumber(form.phone_number)" type="text" placeholder="09012345678" maxlength="13" class="register-input" :class="{ 'input-error': errors.phone_number }" />
          <span v-if="errors.phone_number" class="error-msg">{{ errors.phone_number }}</span>
        </div>

        <!-- パスワード -->
        <div class="field full">
          <label>パスワード</label>
          <div class="input-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="12文字以上"
              class="register-input"
              :class="{ 'input-error': errors.password }"
            />
            <button class="toggle-password" @click="showPassword = !showPassword" type="button">
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>

        <!-- パスワード確認 -->
        <div class="field full">
          <label>パスワード（確認）</label>
          <div class="input-wrapper">
            <input
              v-model="form.password_confirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              placeholder="もう一度入力してください"
              class="register-input"
              :class="{ 'input-error': errors.password_confirmation }"
            />
            <button class="toggle-password" @click="showPasswordConfirmation = !showPasswordConfirmation" type="button">
              <svg v-if="showPasswordConfirmation" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password_confirmation" class="error-msg">{{ errors.password_confirmation }}</span>
        </div>
      </div>

      <p v-if="globalError" class="global-error">{{ globalError }}</p>

      <div class="btn-wrap">
        <button @click="handleSubmit" class="register-button" :disabled="loading">
          {{ loading ? '登録中...' : '登録する' }}
        </button>
        <router-link to="/login" class="back-link">ログインページに戻る</router-link>
      </div>

    </div>
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="register-modal">
          <h2 class="register-modal-title">登録完了</h2>
          <p class="register-modal-text">会員登録が完了しました。<br>ログインページよりログインしてください。</p>
          <button @click="goToLogin" class="register-modal-button">OK</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route  = useRoute()
const router = useRouter()

const token = ref('')
const email = ref('')

const form = reactive({
  sei:                  '',
  mei:                  '',
  sei_kana:             '',
  mei_kana:             '',
  birth_date:           null,
  gender:               '0',
  post_code:            '',
  prefecture:           '',
  city:                 '',
  address_line1:        '',
  address_line2:        '',
  phone_number:         '',
  password:             '',
  password_confirmation: '',
})

const errors                  = reactive({})
const globalError             = ref('')
const loading                 = ref(false)
const showPassword            = ref(false)
const showPasswordConfirmation = ref(false)

onMounted(() => {
  token.value = route.query.token ?? ''
  email.value = route.query.email ?? ''

  if (!token.value || !email.value) {
    globalError.value = '無効なURLです'
  }
})

const displayBirthDate = ref('')

const today = new Date().toISOString().split('T')[0]

async function fetchAddress() {
  const code = form.post_code.replace(/-/g, '')
  if (code.length !== 7) return

  try {
    const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}`)
    const data = await res.json()
    if (data.results) {
      const result    = data.results[0]
      form.prefecture = result.address1
      form.city       = result.address2 + result.address3
    }
  } catch (e) {
    // 住所取得失敗時は何もしない
  }
}

function validate() {
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.sei)           errors.sei           = '苗字は必須です'
  if (!form.mei)           errors.mei           = '名前は必須です'
  if (!form.sei_kana)      errors.sei_kana      = '苗字カナは必須です'
  if (!form.mei_kana)      errors.mei_kana      = '名前カナは必須です'
  if (!form.birth_date)    errors.birth_date    = '生年月日は必須です'
  if (!form.post_code)     errors.post_code     = '郵便番号は必須です'
  if (!form.prefecture)    errors.prefecture    = '都道府県は必須です'
  if (!form.city)          errors.city          = '市区町村は必須です'
  if (!form.address_line1) errors.address_line1 = '番地は必須です'
  if (!form.phone_number)  errors.phone_number  = '電話番号は必須です'
  if (!form.password)      errors.password      = 'パスワードは必須です'

  // 形式チェック
  if (form.sei && !/^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFー々]+$/.test(form.sei)) {
    errors.sei = '苗字は日本語で入力してください'
  }
  if (form.mei && !/^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFー々]+$/.test(form.mei)) {
    errors.mei = '名前は日本語で入力してください'
  }
  if (form.sei_kana && !/^[ァ-ヶー]+$/.test(form.sei_kana)) {
    errors.sei_kana = '苗字カナは全角カタカナで入力してください'
  }
  if (form.mei_kana && !/^[ァ-ヶー]+$/.test(form.mei_kana)) {
    errors.mei_kana = '名前カナは全角カタカナで入力してください'
  }
  if (form.post_code && !/^[0-9]{7}$/.test(form.post_code)) {
    errors.post_code = '郵便番号は7桁の数字で入力してください'
  }
  if (form.phone_number && !/^[0-9]{10,11}$/.test(form.phone_number)) {
    errors.phone_number = '電話番号は10桁または11桁の数字で入力してください'
  }
  if (form.password && form.password.length < 12) {
    errors.password = 'パスワードは12文字以上で入力してください'
  }
  if (form.password && form.password_confirmation && form.password !== form.password_confirmation) {
    errors.password_confirmation = 'パスワードが一致しません'
  }

  return Object.keys(errors).length === 0
}


const showModal = ref(false)

function goToLogin() {
  router.push('/login')
}

async function handleSubmit() {
  globalError.value = ''
  if (!validate()) return

  loading.value = true

  try {
    const birthDate = form.birth_date
      ? new Date(form.birth_date).toISOString().split('T')[0]
      : ''

    await axios.post('/api/Members/register', {
      token:                 token.value,
      email:                 email.value,
      sei:                   form.sei,
      mei:                   form.mei,
      sei_kana:              form.sei_kana,
      mei_kana:              form.mei_kana,
      birth_date:            birthDate,
      gender:                parseInt(form.gender),
      post_code:             form.post_code.replace(/-/g, ''),
      prefecture:            form.prefecture,
      city:                  form.city,
      address_line1:         form.address_line1,
      address_line2:         form.address_line2 || null,
      phone_number:          form.phone_number.replace(/-/g, ''),
      password:              form.password,
      password_confirmation: form.password_confirmation,
    })
    showModal.value = true
  } catch (e) {
    const data = e.response?.data
    if (data?.field && data.field !== 'global') {
      errors[data.field] = data.message
    } else {
      globalError.value = data?.message ?? 'エラーが発生しました'
    }
  } finally {
    loading.value = false  // ← 必ずfalseに戻る
  }
}

function toKatakana(str) {
  return str.replace(/[\u3041-\u3096]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  )
}

function toHalfWidthNumber(str) {
  return str.replace(/[０-９]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  ).replace(/[^0-9]/g, '')
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.register-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #888;
  padding: 40px 0;
}

.register-card {
  background: #0a0a0a;
  border-radius: 4px;
  width: 900px;
  padding: 56px 64px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  position: relative;
  /* overflow: hidden; ← 削除 */
}

.register-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220, 80, 120, 0.4), transparent);
  border-radius: 4px 4px 0 0; /* ← 追加 */
}

.register-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 42px;
  font-weight: 300;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  margin: 0 0 12px;
}

.register-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #888;
  text-align: center;
  line-height: 1.7;
  margin: 0 0 48px;
  letter-spacing: 0.02em;
}

.register-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field.full {
  grid-column: 1 / -1;
}

label {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #888;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.optional {
  color: #555;
  font-size: 9px;
  text-transform: none;
}

.input-wrapper {
  position: relative;
}

.register-input {
  width: 100%;
  background: linear-gradient(#0a0a0a, #0a0a0a) padding-box,
              linear-gradient(135deg, #dc5078, #8b2fc9) border-box;
  border: 1px solid transparent;
  border-radius: 50px;
  padding: 12px 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
  outline: none;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease;
}

.register-input::placeholder { color: #555; }

.register-input:focus {
  box-shadow: 0 0 20px rgba(220, 80, 120, 0.15);
  background: linear-gradient(#111, #111) padding-box,
              linear-gradient(135deg, #ff6090, #aa4fe9) border-box;
}

.input-error {
  background: linear-gradient(#0a0a0a, #0a0a0a) padding-box,
              linear-gradient(135deg, #ff4444, #aa2222) border-box !important;
}

.error-msg {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  color: #ff6b6b;
  padding-left: 12px;
  letter-spacing: 0.03em;
  animation: fadeIn 0.3s ease;
}

.global-error {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #ff6b6b;
  text-align: center;
  margin-top: 24px;
  letter-spacing: 0.03em;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.btn-wrap {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.register-button {
  width: 320px;
  background: transparent;
  border: 1px solid #ffffff;
  border-radius: 50px;
  padding: 14px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.register-button:hover {
  background: #ffffff;
  color: #0a0a0a;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

.register-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.register-button:active {
  transform: scale(0.98);
}

.back-link {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #888;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.back-link:hover { color: #aaa; }

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.toggle-password:hover { color: #aaa; }

.toggle-password svg {
  width: 16px;
  height: 16px;
}

select.register-input option {
  background: #1a1a1a;
  color: #ccc;
}

/* VueDatePicker カスタマイズ */
:deep(.dp__input) {
  background: linear-gradient(#0a0a0a, #0a0a0a) padding-box,
              linear-gradient(135deg, #dc5078, #8b2fc9) border-box;
  border: 1px solid transparent;
  border-radius: 50px;
  padding: 12px 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
}

:deep(.dp__input::placeholder) { color: #555; }

:deep(.dp__input:focus) {
  box-shadow: 0 0 20px rgba(220, 80, 120, 0.15);
  background: linear-gradient(#111, #111) padding-box,
              linear-gradient(135deg, #ff6090, #aa4fe9) border-box;
}

:deep(.dp__theme_dark) {
  --dp-background-color: #111;
  --dp-text-color: #ccc;
  --dp-hover-color: #1a1a1a;
  --dp-hover-text-color: #fff;
  --dp-hover-icon-color: #ccc;
  --dp-primary-color: #dc5078;
  --dp-primary-text-color: #fff;
  --dp-border-color: transparent;
  --dp-border-color-hover: #dc5078;
}

/* scopedなし */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: #0a0a0a;
  border-radius: 4px;
  padding: 48px 56px;
  text-align: center;
  position: relative;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}

.modal::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220, 80, 120, 0.4), transparent);
}

.modal-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
  margin-bottom: 32px;
}

.modal-button {
  width: 160px;
  background: transparent;
  border: 1px solid #ffffff;
  border-radius: 50px;
  padding: 12px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.modal-button:hover {
  background: #ffffff;
  color: #0a0a0a;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

/* モーダル用グローバルCSS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.register-modal {
  background: #0a0a0a;
  border-radius: 4px;
  width: 480px;
  padding: 48px 56px;
  text-align: center;
  position: relative;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}

.register-modal::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220, 80, 120, 0.4), transparent);
}

.register-modal-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.register-modal-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #888;
  line-height: 1.7;
  letter-spacing: 0.03em;
  margin-bottom: 40px;
}

.register-modal-button {
  width: 100%;
  background: transparent;
  border: 1px solid #ffffff;
  border-radius: 50px;
  padding: 14px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.register-modal-button:hover {
  background: #ffffff;
  color: #0a0a0a;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}
</style>