<template>
  <div class="invite-wrapper">
    <div class="invite-card">
      <div class="invite-card__inner">

        <!-- ローディング -->
        <div v-if="loading" class="invite-state">
          <p class="invite-state__text">読み込み中...</p>
        </div>

        <!-- エラー -->
        <div v-else-if="error" class="invite-state">
          <p class="invite-state__text invite-state__text--error">{{ error }}</p>
          <router-link to="/" class="invite-btn invite-btn--gray">トップへ戻る</router-link>
        </div>

        <!-- 招待確認 -->
        <div v-else-if="invite">
          <h1 class="invite-title">チャットへの招待</h1>
          <p class="invite-subtitle">以下のチャットルームへの参加招待が届いています。</p>

          <div class="invite-room">
            <p class="invite-room__name">{{ invite.room_name }}</p>
            <p class="invite-room__meta">招待日時：{{ invite.invited_at }}</p>
            <p class="invite-room__meta">有効期限：{{ invite.expired_at }}</p>
          </div>

          <div class="invite-actions">
            <button
              class="invite-btn invite-btn--primary"
              :disabled="processing"
              @click="handleApprove"
            >
              {{ processing ? '処理中...' : '参加する' }}
            </button>
            <button
              class="invite-btn invite-btn--danger"
              :disabled="processing"
              @click="handleReject"
            >
              断る
            </button>
          </div>
        </div>

        <!-- 招待なし -->
        <div v-else class="invite-state">
          <p class="invite-state__text">招待が見つかりません。</p>
          <router-link to="/" class="invite-btn invite-btn--gray">トップへ戻る</router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route      = useRoute()
const router     = useRouter()
const roomId     = Number(route.query.room)
const loading    = ref(true)
const processing = ref(false)
const error      = ref('')
const invite     = ref(null)

onMounted(async () => {
  if (!roomId) {
    error.value = '招待情報が見つかりません'
    loading.value = false
    return
  }

  try {
    const { data } = await axios.get('/api/invites/pending')
    invite.value = data.find(i => i.room_id === roomId) ?? null
  } catch (e) {
    error.value = '招待情報の取得に失敗しました'
  } finally {
    loading.value = false
  }
})

async function handleApprove() {
  processing.value = true
  try {
    await axios.post(`/api/rooms/${roomId}/invite/approve`)
    router.push({ name: 'chat', params: { roomId } })
  } catch (e) {
    error.value = e.response?.data?.message ?? 'エラーが発生しました'
  } finally {
    processing.value = false
  }
}

async function handleReject() {
  processing.value = true
  try {
    await axios.post(`/api/rooms/${roomId}/invite/reject`)
    router.push({ name: 'Landing' })
  } catch (e) {
    error.value = e.response?.data?.message ?? 'エラーが発生しました'
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.invite-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #888;
}

.invite-card {
  background: #0a0a0a;
  border-radius: 4px;
  width: 460px;
  padding: 56px 48px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;
}

.invite-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220,80,120,0.4), transparent);
}

.invite-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px;
  font-weight: 300;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.1em;
  margin: 0 0 12px;
}

.invite-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #888;
  text-align: center;
  line-height: 1.7;
  margin: 0 0 32px;
}

.invite-room {
  background: #1a1a1a;
  border: 0.5px solid #333;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 32px;
}

.invite-room__name {
  font-family: 'Montserrat', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 8px;
}

.invite-room__meta {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #666;
  margin: 0 0 4px;
}

.invite-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.invite-btn {
  width: 100%;
  border-radius: 50px;
  padding: 14px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1em;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s ease;
  text-align: center;
  text-decoration: none;
  display: block;
}

.invite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.invite-btn--primary {
  background: #185FA5;
  color: white;
}

.invite-btn--primary:hover:not(:disabled) {
  opacity: 0.85;
}

.invite-btn--danger {
  background: transparent;
  color: #dc5078;
  border: 1px solid #dc5078;
}

.invite-btn--danger:hover:not(:disabled) {
  background: #dc5078;
  color: white;
}

.invite-btn--gray {
  background: transparent;
  color: #888;
  border: 1px solid #444;
}

.invite-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.invite-state__text {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #888;
  text-align: center;
  margin: 0;
}

.invite-state__text--error {
  color: #ff6b6b;
}
</style>