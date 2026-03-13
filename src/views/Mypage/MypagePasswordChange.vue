<template>
  <div class="password-wrapper">
    <div class="password-header">
      <h1 class="password-title">パスワード変更</h1>
    </div>

    <div class="password-card">
      <div class="password-section">
        <h2 class="section-title">パスワード変更</h2>
        <div class="form-grid">

          <div class="form-item">
            <label class="form-label">現在のパスワード</label>
            <div class="input-wrapper">
              <input
                v-model="form.current_password"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="現在のパスワードを入力"
                autocomplete="current-password"
                :disabled="loading"
              />
              <button class="toggle-password" @click="showCurrentPassword = !showCurrentPassword" type="button">
                <svg v-if="showCurrentPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          </div>

          <div class="form-item">
            <label class="form-label">新しいパスワード</label>
            <div class="input-wrapper">
              <input
                v-model="form.new_password"
                :type="showNewPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="12文字以上で入力"
                autocomplete="new-password"
                :disabled="loading"
              />
              <button class="toggle-password" @click="showNewPassword = !showNewPassword" type="button">
                <svg v-if="showNewPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <span class="form-hint">12文字以上で入力してください</span>
          </div>

          <div class="form-item">
            <label class="form-label">新しいパスワード（確認）</label>
            <div class="input-wrapper">
              <input
                v-model="form.new_password_confirmation"
                :type="showNewPasswordConfirmation ? 'text' : 'password'"
                class="form-input"
                placeholder="新しいパスワードを再入力"
                autocomplete="new-password"
                :disabled="loading"
              />
              <button class="toggle-password" @click="showNewPasswordConfirmation = !showNewPasswordConfirmation" type="button">
                <svg v-if="showNewPasswordConfirmation" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          </div>

        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- 完了モーダル -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p class="modal-message">パスワードを変更しました。</p>
        <button @click="handleModalClose" class="modal-button">OK</button>
      </div>
    </div>

    <div class="profile-actions">
      <button
        @click="handleSubmit"
        :disabled="loading"
        class="edit-button"
      >
        {{ loading ? '変更中...' : '変更する' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
})

const errorMessage               = ref('')
const loading                    = ref(false)
const showModal                  = ref(false)
const showCurrentPassword        = ref(false)
const showNewPassword            = ref(false)
const showNewPasswordConfirmation = ref(false)

const handleSubmit = async () => {
  errorMessage.value = ''

  if (!form.value.current_password) {
    errorMessage.value = '現在のパスワードを入力してください。'
    return
  }
  if (!form.value.new_password) {
    errorMessage.value = '新しいパスワードを入力してください。'
    return
  }
  if (form.value.new_password !== form.value.new_password_confirmation) {
    errorMessage.value = '新しいパスワードが一致しません。'
    return
  }

  loading.value = true
  try {
    await axios.post('/api/ChangePassword', form.value)
    showModal.value = true
  } catch (e) {
    errorMessage.value = e.response?.data?.message ?? '変更に失敗しました。しばらくしてから再試行してください。'
  } finally {
    loading.value = false
  }
}

const handleModalClose = () => {
  showModal.value = false
  form.value = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.password-wrapper {
  position: relative;
  min-height: calc(100vh - 96px);
}

.password-header {
  margin-bottom: 40px;
}

.password-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0;
}

.password-card {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.password-section {
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

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #666;
  letter-spacing: 0.1em;
}

.form-hint {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #555;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 12px 40px 12px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: #dc5078;
}

.form-input:disabled {
  opacity: 0.5;
}

.toggle-password {
  position: absolute;
  right: 12px;
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

.toggle-password:hover {
  color: #aaa;
}

.toggle-password svg {
  width: 16px;
  height: 16px;
}

.error-message {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #dc5078;
  letter-spacing: 0.05em;
  margin-top: 16px;
}

.profile-actions {
  position: fixed;
  bottom: 48px;
  right: 48px;
}

.edit-button {
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

.edit-button:hover {
  background: #dc5078;
  color: #fff;
}

.edit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #111;
  border: 1px solid #222;
  border-radius: 4px;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.modal-message {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
  margin: 0;
}

.modal-button {
  background: transparent;
  border: 1px solid #dc5078;
  border-radius: 50px;
  padding: 10px 40px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.modal-button:hover {
  background: #dc5078;
  color: #fff;
}
</style>