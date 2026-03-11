<template>
  <div class="edit-wrapper">
    <div class="edit-header">
      <h1 class="edit-title">登録情報編集</h1>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>

    <div v-else class="edit-card">
      <div class="edit-section">
        <h2 class="section-title">氏名</h2>
        <div class="edit-grid">
          <div class="field">
            <label>苗字</label>
            <input v-model="form.sei" type="text" class="edit-input" :class="{ 'input-error': errors.sei }" placeholder="山田" />
            <span v-if="errors.sei" class="error-msg">{{ errors.sei }}</span>
          </div>
          <div class="field">
            <label>名前</label>
            <input v-model="form.mei" type="text" class="edit-input" :class="{ 'input-error': errors.mei }" placeholder="太郎" />
            <span v-if="errors.mei" class="error-msg">{{ errors.mei }}</span>
          </div>
          <div class="field">
            <label>苗字カナ</label>
            <input v-model="form.sei_kana" type="text" class="edit-input" :class="{ 'input-error': errors.sei_kana }" placeholder="ヤマダ"
              @blur="form.sei_kana = toKatakana(form.sei_kana)" />
            <span v-if="errors.sei_kana" class="error-msg">{{ errors.sei_kana }}</span>
          </div>
          <div class="field">
            <label>名前カナ</label>
            <input v-model="form.mei_kana" type="text" class="edit-input" :class="{ 'input-error': errors.mei_kana }" placeholder="タロウ"
              @blur="form.mei_kana = toKatakana(form.mei_kana)" />
            <span v-if="errors.mei_kana" class="error-msg">{{ errors.mei_kana }}</span>
          </div>
        </div>
      </div>

      <div class="edit-section">
        <h2 class="section-title">基本情報</h2>
        <div class="edit-grid">
          <div class="field">
            <label>生年月日</label>
            <input v-model="form.birth_date" type="date" class="edit-input date-input" :class="{ 'input-error': errors.birth_date }" :max="today" />
            <span v-if="errors.birth_date" class="error-msg">{{ errors.birth_date }}</span>
          </div>
          <div class="field">
            <label>性別</label>
            <select v-model="form.gender" class="edit-input" :class="{ 'input-error': errors.gender }">
              <option :value="0">未回答</option>
              <option :value="1">男性</option>
              <option :value="2">女性</option>
            </select>
            <span v-if="errors.gender" class="error-msg">{{ errors.gender }}</span>
          </div>
          <div class="field">
            <label>電話番号</label>
            <input v-model="form.phone_number" type="text" class="edit-input" :class="{ 'input-error': errors.phone_number }" placeholder="09012345678"
              @blur="form.phone_number = toHalfWidthNumber(form.phone_number)" />
            <span v-if="errors.phone_number" class="error-msg">{{ errors.phone_number }}</span>
          </div>
        </div>
      </div>

      <div class="edit-section">
        <h2 class="section-title">住所</h2>
        <div class="edit-grid">
          <div class="field">
            <label>郵便番号</label>
            <input v-model="form.post_code" type="text" class="edit-input" :class="{ 'input-error': errors.post_code }" placeholder="1234567"
              @input="onPostCodeInput" maxlength="7" />
            <span v-if="errors.post_code" class="error-msg">{{ errors.post_code }}</span>
          </div>
          <div class="field">
            <label>都道府県</label>
            <input v-model="form.prefecture" type="text" class="edit-input" :class="{ 'input-error': errors.prefecture }" placeholder="東京都" />
            <span v-if="errors.prefecture" class="error-msg">{{ errors.prefecture }}</span>
          </div>
          <div class="field">
            <label>市区町村</label>
            <input v-model="form.city" type="text" class="edit-input" :class="{ 'input-error': errors.city }" placeholder="渋谷区" />
            <span v-if="errors.city" class="error-msg">{{ errors.city }}</span>
          </div>
          <div class="field">
            <label>番地</label>
            <input v-model="form.address_line1" type="text" class="edit-input" :class="{ 'input-error': errors.address_line1 }" placeholder="1-2-3" />
            <span v-if="errors.address_line1" class="error-msg">{{ errors.address_line1 }}</span>
          </div>
          <div class="field">
            <label>建物名 <span class="optional">任意</span></label>
            <input v-model="form.address_line2" type="text" class="edit-input" placeholder="〇〇マンション101" />
          </div>
        </div>
      </div>
    </div>

    <div class="edit-actions">
      <button @click="router.push('/mypage')" class="cancel-button">キャンセル</button>
      <button @click="handleSubmit" :disabled="saving" class="save-button">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(true)
const saving  = ref(false)
const today   = new Date().toISOString().split('T')[0]

const form = reactive({
  sei:           '',
  mei:           '',
  sei_kana:      '',
  mei_kana:      '',
  birth_date:    '',
  post_code:     '',
  prefecture:    '',
  city:          '',
  address_line1: '',
  address_line2: '',
  phone_number:  '',
  gender:        0,
})

const errors = reactive({})

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

async function onPostCodeInput() {
  const code = form.post_code.replace(/[^0-9]/g, '')
  form.post_code = code
  if (code.length !== 7) return
  try {
    const res = await fetch(`https://zipcloud.ibsrio.jp/api/search?zipcode=${code}`)
    const data = await res.json()
    if (data.results) {
      form.prefecture = data.results[0].address1
      form.city       = data.results[0].address2 + data.results[0].address3
    }
  } catch (e) {
    console.error(e)
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

  return Object.keys(errors).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  saving.value = true

  try {
    await axios.put('/api/EditMembers/Profile', form)
    router.push('/mypage')
  } catch (e) {
    const data = e.response?.data
    if (data?.field && data.field !== 'global') {
      errors[data.field] = data.message
    } else {
      errors.global = data?.message ?? 'エラーが発生しました'
    }
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const res = await axios.get('/api/EditMembers/Profile')
    Object.assign(form, res.data)
  } catch (e) {
    if (e.response?.status === 401) {
      router.push('/member-login')
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

* {
  box-sizing: border-box;
}

.edit-wrapper {
  position: relative;
  min-height: calc(100vh - 96px);
  padding-bottom: 100px;
}

.edit-header {
  margin-bottom: 40px;
}

.edit-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0;
}

.loading {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
  letter-spacing: 0.1em;
}

.edit-card {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.edit-section {
  border: 1px solid #222;
  border-radius: 4px;
  padding: 32px;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin: 0 0 24px;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #666;
  letter-spacing: 0.1em;
}

.optional {
  color: #555;
  font-size: 9px;
}

.edit-input {
  background: #111;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #ccc;
  outline: none;
  transition: border-color 0.2s ease;
  width: 100%;
}

.edit-input:focus {
  border-color: #dc5078;
}

.input-error {
  border-color: #ff4444;
}

.error-msg {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  color: #ff6b6b;
  letter-spacing: 0.03em;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

select.edit-input {
  cursor: pointer;
}

select.edit-input option {
  background: #111;
}

.edit-actions {
  position: fixed;
  bottom: 48px;
  right: 48px;
  display: flex;
  gap: 16px;
}

.cancel-button {
  background: transparent;
  border: 1px solid #444;
  border-radius: 50px;
  padding: 14px 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: color 0.3s ease, border-color 0.3s ease;
}

.cancel-button:hover {
  color: #fff;
  border-color: #888;
}

.save-button {
  background: transparent;
  border: 1px solid #dc5078;
  border-radius: 50px;
  padding: 14px 48px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.save-button:hover {
  background: #dc5078;
  color: #fff;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>