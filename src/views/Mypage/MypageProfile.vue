<template>
  <div class="profile-wrapper">
    <div class="profile-header">
      <h1 class="profile-title">登録情報</h1>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>

    <div v-else class="profile-card">
      <div class="profile-section">
        <h2 class="section-title">氏名</h2>
        <div class="profile-grid">
          <div class="profile-item">
            <span class="profile-label">苗字</span>
            <span class="profile-value">{{ member.sei }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">名前</span>
            <span class="profile-value">{{ member.mei }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">苗字カナ</span>
            <span class="profile-value">{{ member.sei_kana }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">名前カナ</span>
            <span class="profile-value">{{ member.mei_kana }}</span>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h2 class="section-title">基本情報</h2>
        <div class="profile-grid">
          <div class="profile-item">
            <span class="profile-label">生年月日</span>
            <span class="profile-value">{{ member.birth_date }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">性別</span>
            <span class="profile-value">{{ genderLabel }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">電話番号</span>
            <span class="profile-value">{{ member.phone_number }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">メールアドレス</span>
            <span class="profile-value">{{ member.email }}</span>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h2 class="section-title">住所</h2>
        <div class="profile-grid">
          <div class="profile-item">
            <span class="profile-label">郵便番号</span>
            <span class="profile-value">{{ member.post_code }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">都道府県</span>
            <span class="profile-value">{{ member.prefecture }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">市区町村</span>
            <span class="profile-value">{{ member.city }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-label">番地</span>
            <span class="profile-value">{{ member.address_line1 }}</span>
          </div>
          <div class="profile-item" v-if="member.address_line2">
            <span class="profile-label">建物名</span>
            <span class="profile-value">{{ member.address_line2 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-actions">
      <button @click="router.push('/mypage/edit')" class="edit-button">編集</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const member  = ref({})
const loading = ref(true)

const genderLabel = computed(() => {
  const map = { 0: '未回答', 1: '男性', 2: '女性' }
  return map[member.value.gender] ?? '未回答'
})

onMounted(async () => {
  try {
    const res = await axios.get('/api/EditMembers/Profile')
    member.value = res.data
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

.profile-wrapper {
  position: relative;
  min-height: calc(100vh - 96px);
}

.profile-header {
  margin-bottom: 40px;
}

.profile-title {
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

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.profile-section {
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

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #666;
  letter-spacing: 0.1em;
}

.profile-value {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
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
</style>