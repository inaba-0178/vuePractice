<template>
  <div>
    <h2>ログイン</h2>
    <input v-model="email"    type="email"    placeholder="メールアドレス" />
    <input v-model="password" type="password" placeholder="パスワード" />
    <button @click="handleLogin">ログイン</button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth     = useAuthStore()
const router   = useRouter()
const email    = ref('')
const password = ref('')
const error    = ref('')

async function handleLogin() {
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = 'メールアドレスまたはパスワードが違います'
  }
}
</script>