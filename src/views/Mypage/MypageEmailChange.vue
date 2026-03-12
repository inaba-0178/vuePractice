<template>
  <div class="email-wrapper">
    <div class="email-header">
      <h1 class="email-title">メールアドレス変更</h1>
    </div>

    <div class="email-card">
      <div class="email-section">
        <h2 class="section-title">現在のメールアドレス</h2>
        <div class="profile-grid">
          <div class="profile-item">
            <span class="profile-label">メールアドレス</span>
            <span class="profile-value">{{ maskedCurrentEmail }}</span>
          </div>
        </div>
      </div>

      <div class="email-section">
        <h2 class="section-title">メールアドレス変更</h2>
        <div class="form-grid">
          <div class="form-item">
            <label class="form-label">現在のメールアドレス</label>
            <input
              v-model="currentEmailInput"
              type="email"
              class="form-input"
              placeholder="現在のメールアドレスを入力"
              :disabled="loading"
            />
          </div>
          <div class="form-item">
            <label class="form-label">新しいメールアドレス</label>
            <input
              v-model="newEmail"
              type="email"
              class="form-input"
              placeholder="new@example.com"
              :disabled="loading"
            />
          </div>
          <div class="form-item">
            <label class="form-label">新しいメールアドレス（確認）</label>
            <input
              v-model="newEmailConfirm"
              type="email"
              class="form-input"
              placeholder="new@example.com"
              :disabled="loading"
            />
          </div>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- 完了モーダル -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p class="modal-message">メールアドレスを変更しました。</p>
        <button @click="handleModalClose" class="modal-button">OK</button>
      </div>
    </div>

    <div class="profile-actions">
      <button
        @click="submitUpdate"
        :disabled="loading"
        class="edit-button"
      >
        {{ loading ? '変更中...' : '変更する' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const currentEmailInput = ref('')
const newEmail          = ref('')
const newEmailConfirm   = ref('')
const errorMessage      = ref('')
const loading           = ref(false)
const currentEmail      = ref('')
const showModal         = ref(false)

onMounted(async () => {
  try {
    const res = await axios.get('/api/EditMembers/Profile')
    currentEmail.value = res.data.data.email
  } catch (e) {
    if (e.response?.status === 401) {
      router.push('/member-login')
    }
  }
})

const maskedCurrentEmail = computed(() => {
  const [local, domain] = currentEmail.value.split('@')
  if (!domain) return currentEmail.value
  const masked = local.slice(0, 2) + '****'
  return `${masked}@${domain}`
})

const submitUpdate = async () => {
  errorMessage.value = ''

  if (!currentEmailInput.value) {
    errorMessage.value = '現在のメールアドレスを入力してください。'
    return
  }
  if (!newEmail.value) {
    errorMessage.value = '新しいメールアドレスを入力してください。'
    return
  }
  if (newEmail.value !== newEmailConfirm.value) {
    errorMessage.value = '新しいメールアドレスが一致しません。'
    return
  }

  loading.value = true
  try {
    await axios.post('/api/EmailChange', {
      current_email: currentEmailInput.value,
      new_email:     newEmail.value,
    })
    showModal.value = true
  } catch (e) {
    errorMessage.value = e.response?.data?.message ?? '変更に失敗しました。しばらくしてから再試行してください。'
  } finally {
    loading.value = false
  }
}

const handleModalClose = () => {
  showModal.value        = false
  currentEmail.value     = newEmail.value
  currentEmailInput.value = ''
  newEmail.value         = ''
  newEmailConfirm.value  = ''
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.email-wrapper {
  position: relative;
  min-height: calc(100vh - 96px);
}

.email-header {
  margin-bottom: 40px;
}

.email-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0;
}

.email-card {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.email-section {
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

.form-input {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 12px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: #dc5078;
}

.form-input:disabled {
  opacity: 0.5;
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