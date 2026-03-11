<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-card__inner">
        <h1 class="login-title">REGISTER</h1>
        <p class="login-subtitle">ご登録のメールアドレスを入力してください。<br>確認メールをお送りします。</p>

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

          <p v-if="error" class="login-error">{{ error }}</p>
          <p v-if="success" class="login-success">{{ success }}</p>

          <button @click="handleSubmit" class="login-button" :disabled="loading">
            {{ loading ? '送信中...' : '確認メールを送信する' }}
          </button>
          <router-link to="/login" class="back-link">ログインページに戻る</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email   = ref('')
const error   = ref('')
const success = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value   = ''
  success.value = ''
  loading.value = true

  try {
    await axios.post('/api/Members/provisional', { email: email.value })
    success.value = '確認メールを送信しました。メールをご確認ください。'
    email.value   = ''
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
</style>