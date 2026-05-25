<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f9fafb;">
    <div style="text-align: center; padding: 40px; max-width: 500px;">
      <p style="font-size: 48px; margin: 0 0 16px;">🔧</p>
      <h1 style="font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 12px;">
        メンテナンス中
      </h1>
      <p style="font-size: 15px; color: #6b7280; margin: 0 0 16px; line-height: 1.7;">
        {{ message || 'システムメンテナンスのため一時的にサービスを停止しています。ご不便をおかけして申し訳ございません。' }}
      </p>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <p v-if="startedAt" style="font-size: 13px; color: #9ca3af; margin: 0;">
          開始予定：{{ startedAt }}
        </p>
        <p v-if="estimatedEndAt" style="font-size: 13px; color: #9ca3af; margin: 0;">
          終了予定：{{ estimatedEndAt }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router         = useRouter()
const message        = ref('')
const startedAt      = ref(null)
const estimatedEndAt = ref(null)
let   intervalId     = null

const checkStatus = async () => {
  try {
    const res = await axios.get('/api/Maintenance/status')
    console.log('Maintenance.vue checkStatus:', res.data) // ログ追加
    message.value        = res.data.message
    startedAt.value      = res.data.started_at
    estimatedEndAt.value = res.data.estimated_end_at

    if (!res.data.is_maintenance) {
      clearInterval(intervalId)
      router.push({ name: 'Landing' })
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  checkStatus()
  intervalId = setInterval(checkStatus, 30000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>