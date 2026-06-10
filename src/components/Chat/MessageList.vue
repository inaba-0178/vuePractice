<template>
  <div class="message-list" ref="messageListRef">
    <template v-for="(item, index) in messagesWithDateSeparators" :key="index">
      <!-- 日付区切り -->
      <div v-if="item.type === 'date'" class="date-separator">
        <span>{{ item.date }}</span>
      </div>

      <!-- メッセージ -->
      <div
        v-else
        :class="['message-wrapper', isMyMessage(item) ? 'message-wrapper--mine' : 'message-wrapper--others']"
        :ref="el => setMessageRef(el, item)"
      >
        <div
          v-if="!isMyMessage(item)"
          class="message__icon"
          :style="{ background: getIconColor(item.user_type) }"
        >
          {{ item.user?.name?.charAt(0) ?? '?' }}
        </div>

        <div :class="['message', isMyMessage(item) ? 'message--mine' : 'message--others']">
          <div class="message__user">{{ item.user?.name ?? '不明' }}</div>
          <div class="message__body">{{ item.message }}</div>
          <div class="message__meta">
            <span class="message__time">{{ formatTime(item.created_at) }}</span>
            <span class="message__read" v-if="isMyMessage(item)">
              {{ readCount(item) > 0 ? `既読 ${readCount(item)}` : '未読' }}
            </span>
          </div>
        </div>

        <div
          v-if="isMyMessage(item)"
          class="message__icon"
          :style="{ background: getIconColor(item.user_type) }"
        >
          {{ item.user?.name?.charAt(0) ?? '?' }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  messages:        { type: Array,  default: () => [] },
  currentUserId:   { type: String, required: true },
  currentUserType: { type: String, required: true }
})

const emit = defineEmits(['read'])

const messageListRef = ref(null)
const observer       = ref(null)

// 日付区切りを挿入したメッセージリスト
const messagesWithDateSeparators = computed(() => {
  const result = []
  let lastDate = null

  for (const message of props.messages) {
    const date = new Date(message.created_at).toLocaleDateString('ja-JP', {
      year:  'numeric',
      month: '2-digit',
      day:   '2-digit',
    })

    if (date !== lastDate) {
      result.push({ type: 'date', date })
      lastDate = date
    }

    result.push({ type: 'message', ...message })
  }

  return result
})

const isMyMessage = (message) => {
  return String(message.user_id) === String(props.currentUserId)
    && message.user_type === props.currentUserType
}

const getIconColor = (userType) => {
  return userType === 'staff' ? '#185FA5' : '#dc5078'
}

const readCount = (message) => {
  return message.message_reads?.filter(
    r => !(String(r.user_id) === String(message.user_id) && r.user_type === message.user_type)
  ).length ?? 0
}

const formatTime = (datetime) => {
  return new Date(datetime).toLocaleTimeString('ja-JP', {
    hour:   '2-digit',
    minute: '2-digit'
  })
}

function setupObserver() {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const messageId = Number(entry.target.dataset.messageId)
        const message   = props.messages.find(m => m.id === messageId)

        if (message && !isMyMessage(message) && message.message_reads?.length === 0) {
          emit('read', messageId)
          observer.value.unobserve(entry.target)
        }
      }
    })
  }, { threshold: 0.5 })
}

function setMessageRef(el, message) {
  if (el && !isMyMessage(message)) {
    el.dataset.messageId = message.id
    el.dataset.userType  = message.user_type
    if (observer.value) {
      observer.value.observe(el)
    }
  }
}

setupObserver()

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})

watch(() => props.messages.length, async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
})
</script>

<style scoped>
.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  overflow-y: auto;
  height: 100%;
}
.date-separator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}
.date-separator::before,
.date-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #333;
}
.date-separator span {
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  padding: 0 8px;
}
.message-wrapper {
  display: flex;
  gap: 8px;
  max-width: 70%;
}
.message-wrapper--mine {
  align-self: flex-end;
}
.message-wrapper--others {
  align-self: flex-start;
}
.message__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 20px;
}
.message {
  display: flex;
  flex-direction: column;
}
.message--mine  { align-items: flex-end; }
.message--others { align-items: flex-start; }
.message__user {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}
.message__body {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
}
.message--mine .message__body {
  background: #4a90e2;
  color: white;
}
.message__meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #aaa;
  margin-top: 4px;
}
</style>