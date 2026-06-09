<template>
  <div class="message-list" ref="messageListRef">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['message', isMyMessage(message) ? 'message--mine' : 'message--others']"
      :ref="el => setMessageRef(el, message)"
    >
      <div class="message__user" v-if="!isMyMessage(message) && message.user">
        {{ message.user.name }}
      </div>
      <div class="message__body">
        {{ message.message }}
      </div>
      <div class="message__meta">
        <span class="message__time">{{ formatTime(message.created_at) }}</span>
        <span class="message__read" v-if="isMyMessage(message)">
          {{ readCount(message) > 0 ? `既読 ${readCount(message)}` : '未読' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  currentUserId: {
    type: String,  // UUIDとBIGINT両対応のためStringに変更
    required: true
  },
  currentUserType: {
    type: String,  // 'staff' or 'member'
    required: true
  }
})

const emit = defineEmits(['read'])

const messageListRef = ref(null)
const observer       = ref(null)

const isMyMessage = (message) => {
  return String(message.user_id) === String(props.currentUserId)
    && message.user_type === props.currentUserType
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

// Intersection Observer設定
function setupObserver() {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const messageId   = Number(entry.target.dataset.messageId)
        const messageType = entry.target.dataset.userType
        const message     = props.messages.find(m => m.id === messageId)

        if (
          message &&
          !isMyMessage(message) &&
          message.message_reads?.length === 0
        ) {
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
  if (observer.value) {
    observer.value.disconnect()
  }
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
.message {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}
.message--mine {
  align-self: flex-end;
  align-items: flex-end;
}
.message--others {
  align-self: flex-start;
  align-items: flex-start;
}
.message__user {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}
.message__body {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 12px;
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