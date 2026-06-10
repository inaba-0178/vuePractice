<template>
  <div class="invite-list-wrapper">
    <div class="invite-list-card">
      <div class="invite-list-card__inner">
        <h1 class="invite-list-title">チャット招待一覧</h1>

        <!-- ローディング -->
        <div v-if="loading" class="invite-list-state">
          <p class="invite-list-state__text">読み込み中...</p>
        </div>

        <!-- 招待なし -->
        <div v-else-if="invites.length === 0" class="invite-list-state">
          <p class="invite-list-state__text">未承認の招待はありません</p>
          <router-link :to="{ name: 'Landing' }" class="invite-btn invite-btn--gray">
            トップへ戻る
          </router-link>
        </div>

        <!-- 招待一覧 -->
        <div v-else class="invite-list">
          <div
            v-for="invite in invites"
            :key="invite.room_id"
            class="invite-item"
          >
            <div class="invite-item__info">
              <p class="invite-item__name">{{ invite.room_name }}</p>
              <p class="invite-item__meta">招待日時：{{ invite.invited_at }}</p>
              <p class="invite-item__meta">有効期限：{{ invite.expired_at }}</p>
            </div>
            <div class="invite-item__actions">
              <button
                class="invite-btn invite-btn--primary"
                :disabled="processing === invite.room_id"
                @click="handleApprove(invite.room_id)"
              >
                {{ processing === invite.room_id ? '処理中...' : '参加する' }}
              </button>
              <button
                class="invite-btn invite-btn--danger"
                :disabled="processing === invite.room_id"
                @click="handleReject(invite.room_id)"
              >
                断る
              </button>
            </div>
          </div>
        </div>

        <p v-if="error" class="invite-list-error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter }      from 'vue-router'
import axios              from 'axios'

const router     = useRouter()
const loading    = ref(true)
const processing = ref(null)
const error      = ref('')
const invites    = ref([])

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/invites/pending')
    invites.value = data
  } catch (e) {
    error.value = '招待情報の取得に失敗しました'
  } finally {
    loading.value = false
  }
})

async function handleApprove(roomId) {
  processing.value = roomId
  try {
    await axios.post(`/api/rooms/${roomId}/invite/approve`)
    router.push({ name: 'chat', params: { roomId } })
  } catch (e) {
    error.value = e.response?.data?.message ?? 'エラーが発生しました'
    processing.value = null
  }
}

async function handleReject(roomId) {
  processing.value = roomId
  try {
    await axios.post(`/api/rooms/${roomId}/invite/reject`)
    invites.value = invites.value.filter(i => i.room_id !== roomId)
  } catch (e) {
    error.value = e.response?.data?.message ?? 'エラーが発生しました'
  } finally {
    processing.value = null
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.invite-list-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #888;
}

.invite-list-card {
  background: #0a0a0a;
  border-radius: 4px;
  width: 500px;
  padding: 56px 48px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;
}

.invite-list-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220,80,120,0.4), transparent);
}

.invite-list-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 300;
  color: #fff;
  text-align: center;
  letter-spacing: 0.1em;
  margin: 0 0 32px;
}

.invite-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.invite-item {
  background: #1a1a1a;
  border: 0.5px solid #333;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.invite-item__name {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin: 0 0 6px;
}

.invite-item__meta {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #666;
  margin: 0 0 2px;
}

.invite-item__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.invite-btn {
  border-radius: 50px;
  padding: 8px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s ease;
  text-align: center;
  text-decoration: none;
  display: block;
  white-space: nowrap;
}

.invite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.invite-btn--primary {
  background: #185FA5;
  color: white;
}

.invite-btn--primary:hover:not(:disabled) { opacity: 0.85; }

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
  margin-top: 16px;
  width: 100%;
}

.invite-list-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.invite-list-state__text {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #888;
  text-align: center;
  margin: 0;
}

.invite-list-error {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #ff6b6b;
  text-align: center;
  margin: 16px 0 0;
}
</style>