<template>
  <div class="chat-room">
    <div class="chat-room__header">
      <h2>{{ room?.name ?? 'チャット' }}</h2>
    </div>
    <div class="chat-room__messages">
      <MessageList
        :messages="messages"
        :current-user-id="currentUserId"
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
import { computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import TypingIndicator from './TypingIndicator.vue'

const props = defineProps({
  roomId: {
    type: Number,
    required: true
  },
  currentUserId: {
    type: Number,
    required: true
  }
})

const chatStore = useChatStore()
const room = computed(() => chatStore.currentRoom)
const messages = computed(() => chatStore.messages)
const typingUsers = computed(() => chatStore.typingUsers)

const handleSend = async (message) => {
  await chatStore.sendMessage(props.roomId, message)
}

const handleRead = async (messageId) => {
  await chatStore.markAsRead(props.roomId, [messageId])
}

const handleTyping = async (isTyping) => {
  await chatStore.sendTyping(props.roomId, isTyping)
}

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
}
.chat-room__header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.chat-room__messages {
  flex: 1;
  overflow: hidden;
}
</style>