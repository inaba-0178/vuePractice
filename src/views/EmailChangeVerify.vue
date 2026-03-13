<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white rounded-lg shadow p-8 max-w-md w-full text-center">

      <!-- 処理中 -->
      <template v-if="status === 'loading'">
        <p class="text-gray-600">確認中...</p>
      </template>

      <!-- 成功 -->
      <template v-else-if="status === 'success'">
        <div class="text-green-500 text-5xl mb-4">✓</div>
        <h2 class="text-lg font-semibold mb-2">確認完了</h2>
        <p class="text-sm text-gray-600 mb-6">{{ message }}</p>
        <router-link
          to="/mypage"
          class="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          マイページへ
        </router-link>
      </template>

      <!-- エラー -->
      <template v-else-if="status === 'error'">
        <div class="text-red-400 text-5xl mb-4">✕</div>
        <h2 class="text-lg font-semibold mb-2">確認失敗</h2>
        <p class="text-sm text-red-600 mb-6">{{ message }}</p>
        <router-link
          to="/mypage"
          class="inline-block text-sm text-blue-600 hover:underline"
        >
          マイページへ戻る
        </router-link>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route   = useRoute()
const status  = ref('loading')
const message = ref('')

onMounted(async () => {
  const token = route.query.token
  const type  = route.query.type

  if (!token || !['current', 'new'].includes(type)) {
    status.value  = 'error'
    message.value = '無効なURLです。'
    return
  }

  try {
    const res = await axios.get('/api/EmailChange/verify', {
      params: { token, type },
    })
    status.value  = 'success'
    message.value = res.data.message
  } catch (e) {
    status.value  = 'error'
    message.value = e.response?.data?.message ?? '確認処理に失敗しました。'
  }
})
</script>