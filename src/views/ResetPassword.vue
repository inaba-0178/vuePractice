<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-card__inner">
        <h1 class="login-title">NEW PASSWORD</h1>
        <p class="login-subtitle">新しいパスワードを入力してください。<br>パスワードは12文字以上で設定してください。</p>

        <div class="login-form">
          <div class="input-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="新しいパスワード"
              class="login-input"
              :class="{ 'login-input--error': error }"
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

          <div class="input-wrapper">
            <input
              v-model="passwordConfirmation"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              placeholder="新しいパスワード（確認）"
              class="login-input"
              :class="{ 'login-input--error': error }"
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

          <p v-if="error" class="login-error">{{ error }}</p>
          <p v-if="success" class="login-success">{{ success }}</p>

          <button @click="handleSubmit" class="login-button" :disabled="loading">
            {{ loading ? '変更中...' : 'パスワードを変更する' }}
          </button>
          <router-link to="/member-login" class="back-link">ログインページに戻る</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route                    = useRoute()
const router                   = useRouter()
const password                 = ref('')
const passwordConfirmation     = ref('')
const error                    = ref('')
const success                  = ref('')
const loading                  = ref(false)
const token                    = ref('')
const email                    = ref('')
const showPassword             = ref(false)
const showPasswordConfirmation = ref(false)

onMounted(() => {
  token.value = route.query.token ?? ''
  email.value = route.query.email ?? ''

  if (!token.value || !email.value) {
    error.value = '無効なURLです'
  }
})

async function handleSubmit() {
  error.value   = ''
  success.value = ''

  if (password.value !== passwordConfirmation.value) {
    error.value = 'パスワードが一致しません'
    return
  }

  if (password.value.length < 12) {
    error.value = 'パスワードは12文字以上で入力してください'
    return
  }

  loading.value = true

  try {
    await axios.post('/api/Password/reset', {
      token:                 token.value,
      email:                 email.value,
      password:              password.value,
      password_confirmation: passwordConfirmation.value,
    })
    success.value = 'パスワードを変更しました'
    setTimeout(() => router.push('/member-login'), 2000)
  } catch (e) {
    error.value = e.response?.data?.message ?? 'エラーが発生しました'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #888;
}

.login-card {
  background: #0a0a0a;
  border-radius: 4px;
  width: 420px;
  padding: 56px 48px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220, 80, 120, 0.4), transparent);
}

.login-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 300;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  margin: 0 0 12px;
}

.login-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #888;
  text-align: center;
  line-height: 1.7;
  margin: 0 0 40px;
  letter-spacing: 0.02em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-wrapper {
  position: relative;
}

.login-input {
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 50px;
  padding: 14px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: linear-gradient(#0a0a0a, #0a0a0a) padding-box,
              linear-gradient(135deg, #dc5078, #8b2fc9) border-box;
}

.login-input::placeholder {
  color: #666;
}

.login-input:focus {
  box-shadow: 0 0 20px rgba(220, 80, 120, 0.15);
  background: linear-gradient(#111, #111) padding-box,
              linear-gradient(135deg, #ff6090, #aa4fe9) border-box;
}

.login-input--error {
  background: linear-gradient(#0a0a0a, #0a0a0a) padding-box,
              linear-gradient(135deg, #ff4444, #aa2222) border-box;
}

.login-error {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #ff6b6b;
  text-align: center;
  margin: 0;
  letter-spacing: 0.03em;
  animation: fadeIn 0.3s ease;
}

.login-success {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #6bffb8;
  text-align: center;
  margin: 0;
  letter-spacing: 0.03em;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.login-button {
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
  margin-top: 8px;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
}

.login-button:hover {
  background: #ffffff;
  color: #0a0a0a;
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
}

.login-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-button:active {
  transform: scale(0.98);
}

.back-link {
  display: block;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #888;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #aaa;
}

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

.toggle-password:hover {
  color: #aaa;
}

.toggle-password svg {
  width: 16px;
  height: 16px;
}
</style>