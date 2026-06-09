<template>
  <div class="chat-view">
    <div class="chat-view__sidebar">
      <h3>ルーム一覧</h3>
      <ul>
        <li
          v-for="room in rooms"
          :key="room.id"
          @click="selectRoom(room.id)"
          :class="{ active: selectedRoomId === room.id }"
        >
          {{ room.name ?? 'ダイレクトメッセージ' }}
        </li>
      </ul>
    </div>
    <div class="chat-view__main">
      <ChatRoom
        v-if="selectedRoomId"
        :room-id="selectedRoomId"
        :current-user-id="String(currentUserId)"
        :current-user-type="currentUserType"
      />
      <div v-else class="chat-view__empty">
        ルームを選択してください
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useMemberAuthStore } from '@/stores/memberAuth'
import ChatRoom from '@/components/Chat/ChatRoom.vue'

const memberAuthStore = useMemberAuthStore()
const currentUserId   = computed(() => String(memberAuthStore.member?.id ?? ''))
const currentUserType = computed(() => 'member') // Vue側はusr_usersのみ

const selectedRoomId = ref(null)
const chatStore      = useChatStore()
const rooms          = computed(() => chatStore.rooms)
const route          = useRoute()
const router         = useRouter()

const selectRoom = async (roomId) => {
  selectedRoomId.value = roomId
  router.push({ name: 'chat', params: { roomId } })
}

onMounted(async () => {
  await chatStore.fetchRooms()
  if (route.params.roomId) {
    selectedRoomId.value = Number(route.params.roomId)
  }
})
</script>

<style scoped>
.chat-view {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.chat-view__sidebar {
  width: 240px;
  border-right: 1px solid #eee;
  padding: 16px;
  overflow-y: auto;
  flex-shrink: 0;
}
.chat-view__sidebar ul {
  list-style: none;
  padding: 0;
}
.chat-view__sidebar li {
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
}
.chat-view__sidebar li.active,
.chat-view__sidebar li:hover {
  background: #f0f0f0;
}
.chat-view__main {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}
.chat-view__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #aaa;
}
</style>