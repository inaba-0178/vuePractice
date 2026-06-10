<template>
  <div class="chat-room">
    <!-- 参加者セクション（非表示・モーダルに移動） -->

    <!-- ヘッダー -->
    <div class="chat-room__header">
      <h2>{{ room?.name ?? 'チャット' }}</h2>
      <button class="chat-room__members-btn" @click="showMembers = true">
        ルーム内ユーザー
      </button>
    </div>

    <!-- 参加者モーダル -->
    <div v-if="showMembers" class="modal-overlay" @click.self="showMembers = false">
      <div class="modal">
        <h3 class="modal__title">ルーム内ユーザー</h3>
        <div class="modal__list">
          <div
            v-for="roomUser in room?.room_users?.filter(u => u.status === 'approved')"
            :key="roomUser.user_id"
            class="modal__user"
          >
            <div
              class="modal__icon"
              :style="{ background: getIconColor(roomUser.user_type) }"
            >
              {{ roomUser.name?.charAt(0) ?? '?' }}
            </div>
            <div class="modal__info">
              <span class="modal__name">{{ roomUser.name }}</span>
              <span
                class="modal__type"
                :class="'modal__type--' + roomUser.user_type"
              >
                {{ roomUser.user_type === 'staff' ? 'ディーラー担当' : 'ユーザー' }}
              </span>
            </div>
          </div>
        </div>
        <button class="modal__close" @click="showMembers = false">閉じる</button>
      </div>
    </div>

    <div class="chat-room__messages">
      <MessageList
        :messages="messages"
        :current-user-id="String(currentUserId)"
        :current-user-type="currentUserType"
        @read="handleRead"
      />
    </div>
    <TypingIndicator :typing-users="typingUsers" />
    <MessageInput
      @send="handleSend"
      @typing="handleTyping"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import TypingIndicator from './TypingIndicator.vue'

const props = defineProps({
  roomId:          { type: Number, required: true },
  currentUserId:   { type: String, required: true },
  currentUserType: { type: String, required: true }
})

const chatStore    = useChatStore()
const room         = computed(() => chatStore.currentRoom)
const messages     = computed(() => chatStore.messages)
const typingUsers  = computed(() => chatStore.typingUsers)
const showMembers  = ref(false)

const getIconColor = (userType) => {
  return userType === 'staff' ? '#185FA5' : '#dc5078'
}

const handleSend = async ({ message, attachments }) => {
  await chatStore.sendMessage(props.roomId, message, attachments)
}

const handleRead   = async (messageId) => await chatStore.markAsRead(props.roomId, [messageId])
const handleTyping = async (isTyping)  => await chatStore.sendTyping(props.roomId, isTyping)

onMounted(async () => {
  await chatStore.selectRoom(props.roomId)
})

onUnmounted(() => {
  chatStore.leaveRoom(props.roomId)
})
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.chat-room__header {
  padding: 16px;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chat-room__header h2 {
  margin: 0;
  font-size: 16px;
}
.chat-room__members-btn {
  background: #185FA5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  cursor: pointer;
}
.chat-room__members-btn:hover {
  background: #1a6fc4;
}
.chat-room__messages {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* モーダル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal__title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px;
}
.modal__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}
.modal__user {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f9fafb;
  border: 0.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
}
.modal__icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}
.modal__info {
  display: flex;
  flex-direction: column;
}
.modal__name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
}
.modal__type {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  margin-top: 2px;
  display: inline-block;
}
.modal__type--staff {
  background: #eff6ff;
  color: #1d4ed8;
}
.modal__type--member {
  background: #fdf2f8;
  color: #be185d;
}
.modal__close {
  width: 100%;
  padding: 8px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}
.modal__close:hover {
  background: #e5e7eb;
}
</style>