<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-card__inner">
        <h1 class="login-title">MEMBER LOGIN</h1>
        <p class="login-subtitle">メールアドレス、パスワードをご入力の上、「LOGIN」ボタンをクリックしてください。</p>

        <div class="login-form">
          <div class="input-wrapper">
            <input
              v-model="email"
              type="email"
              placeholder="メールアドレス"
              class="login-input"
              :class="{ 'login-input--error': error }"
            />
          </div>

          <div class="input-wrapper" style="position: relative;">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="パスワード"
              class="login-input"
              :class="{ 'login-input--error': error }"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>

          <p v-if="error" class="login-error">{{ error }}</p>

          <button @click="handleLogin" :disabled="loading" class="login-button">
            {{ loading ? 'ログイン中...' : 'LOGIN' }}
          </button>
          <router-link to="/forgot-password" class="back-link">パスワードをお忘れの方</router-link>
          <router-link to="/register" class="back-link">会員登録はこちら</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router       = useRouter()
const email        = ref('')
const password     = ref('')
const error        = ref('')
const loading      = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true

  try {
    const res = await axios.post('/api/MemberAuth/login', {
        email:    email.value,
        password: password.value,
    })

    localStorage.setItem('member_token', res.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    router.push('/mypage')

  } catch (e) {
    error.value = e.response?.data?.message ?? 'メールアドレスまたはパスワードが違います'
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
  font-size: 42px;
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
}

.toggle-password:hover {
  color: #aaa;
}

.back-link {
  color: #888;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  text-decoration: none;
}

.back-link:hover {
  color: #aaa;
}
</style>