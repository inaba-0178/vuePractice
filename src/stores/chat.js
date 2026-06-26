import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useChatStore = defineStore('chat', () => {
    const rooms        = ref([])
    const currentRoom  = ref(null)
    const messages     = ref([])
    const typingUsers  = ref([])

    // ルーム一覧取得
    async function fetchRooms() {
        const { data } = await axios.get('/api/rooms')
        rooms.value = data
    }

    // ルーム参加者取得
    async function fetchRoomUsers(roomId) {
        const { data } = await axios.get(`/api/rooms/${roomId}`)
        currentRoom.value = data
    }

    // ルーム選択
    async function selectRoom(roomId) {
        if (currentRoom.value) {
            window.Echo.leave(`room.${currentRoom.value.id}`)
        }

        const { data } = await axios.get(`/api/rooms/${roomId}`)
        currentRoom.value = data
        await fetchMessages(roomId)
        subscribeToRoom(roomId)

        // 未読メッセージを既読にする
        const unreadIds = messages.value
            .filter(m => m.message_reads?.length === 0)
            .map(m => m.id)

        if (unreadIds.length > 0) {
            await markAsRead(roomId, unreadIds)
        }
    }

    // メッセージ取得
    async function fetchMessages(roomId) {
        const { data } = await axios.get(`/api/rooms/${roomId}/messages`)
        messages.value = data
    }

    // メッセージ送信
    async function sendMessage(roomId, message, attachments = []) {
        if (attachments.length > 0) {
            // 添付ファイルがある場合はFormDataで送信
            const formData = new FormData()
            if (message) formData.append('message', message)
            attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file)
            })

            await axios.post(`/api/rooms/${roomId}/messages`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        } else {
            await axios.post(`/api/rooms/${roomId}/messages`, { message })
        }
    }

    // 既読送信
    async function markAsRead(roomId, messageIds) {
        await axios.post(`/api/rooms/${roomId}/messages/read`, { message_ids: messageIds })
    }

    // タイピング通知
    async function sendTyping(roomId, isTyping) {
        await axios.post(`/api/rooms/${roomId}/typing`, { is_typing: isTyping })
    }

    // WebSocket購読
    function subscribeToRoom(roomId) {
        // if (!window.Echo) {
        //     console.warn('Echo is not initialized')
        //     return
        // }
        window.Echo.private(`room.${roomId}`)
            .listen('.message.sent', (e) => {
                messages.value.push({
                    id:              e.id,
                    room_id:         e.roomId,
                    user_id:         e.userId,
                    user_type:       e.userType,
                    message:         e.message,
                    created_at:      e.createdAt,
                    user:            e.user,
                    attachment_url:  e.attachment?.attachment_url  ?? null,
                    attachment_type: e.attachment?.attachment_type ?? null,
                    attachment_name: e.attachment?.attachment_name ?? null,
                    attachment_size: e.attachment?.attachment_size ?? null,
                    message_reads:   [],
                })
                markAsRead(roomId, [e.id])
            })
            .listen('.message.read', (e) => {
                e.messageIds.forEach(messageId => {
                    const message = messages.value.find(m => m.id === messageId)
                    if (message) {
                        if (!message.message_reads) {
                            message.message_reads = []
                        }
                        const alreadyRead = message.message_reads.some(
                            r => r.user_id === e.userId && r.user_type === e.userType
                        )
                        if (!alreadyRead) {
                            message.message_reads.push({
                                user_id:   e.userId,
                                user_type: e.userType,
                            })
                        }
                    }
                })
            })
            .listenForWhisper('typing', (e) => {
                if (e.isTyping) {
                    if (!typingUsers.value.includes(e.userName)) {
                        typingUsers.value.push(e.userName)
                    }
                } else {
                    typingUsers.value = typingUsers.value.filter(u => u !== e.userName)
                }
            })
    }

    // WebSocket切断
    function leaveRoom(roomId) {
        window.Echo.leave(`room.${roomId}`)
        typingUsers.value = []
    }

    return {
        rooms,
        currentRoom,
        messages,
        typingUsers,
        fetchRooms,
        selectRoom,
        fetchMessages,
        sendMessage,
        markAsRead,
        sendTyping,
        leaveRoom,
    }
})