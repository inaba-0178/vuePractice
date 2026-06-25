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

          <!-- テキスト -->
          <div
            v-if="item.message"
            class="message__body"
            style="white-space: pre-wrap; word-break: break-word;"
          >{{ item.message }}</div>

          <!-- 画像 -->
          <div v-if="item.attachment_type === 'image'" class="message__attachment">
            <img
              :src="item.attachment_url"
              :alt="item.attachment_name"
              class="message__attachment-image"
              @click="openImage(item.attachment_url)"
            />
          </div>

          <!-- 動画 -->
          <div v-else-if="item.attachment_type === 'video'" class="message__attachment">
            <video
              :src="item.attachment_url"
              class="message__attachment-video"
              controls
              preload="metadata"
            />
          </div>

          <!-- ファイル -->
          <div v-else-if="item.attachment_type === 'file'" class="message__attachment">
            <a
              :href="item.attachment_url"
              :download="item.attachment_name"
              class="message__attachment-file"
              target="_blank"
            >
              <span class="message__attachment-file-icon">📄</span>
              <div class="message__attachment-file-info">
                <span class="message__attachment-file-name">{{ item.attachment_name }}</span>
                <span class="message__attachment-file-size">{{ formatSize(item.attachment_size) }}</span>
              </div>
            </a>
          </div>

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

    <!-- 画像拡大モーダル -->
    <div v-if="lightboxUrl" class="lightbox" @click="lightboxUrl = null">
      <img :src="lightboxUrl" class="lightbox__image" />
    </div>
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
  const lightboxUrl    = ref(null)

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

  const formatSize = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024)        return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  }

  const openImage = (url) => {
    lightboxUrl.value = url
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
  .message-wrapper--mine   { align-self: flex-end; }
  .message-wrapper--others { align-self: flex-start; }
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
  .message--mine   { align-items: flex-end; }
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
    display: inline-block;
    max-width: 100%;
    color: #000;
  }
  .message--mine .message__body {
    background: #4a90e2;
    color: white;
  }
  .message__attachment {
    margin-top: 4px;
  }
  .message__attachment-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
    display: block;
  }
  .message__attachment-video {
    max-width: 280px;
    border-radius: 8px;
    display: block;
  }
  .message__attachment-file {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f0f0f0;
    border-radius: 8px;
    padding: 8px 12px;
    text-decoration: none;
    color: #333;
    min-width: 180px;
  }
  .message--mine .message__attachment-file {
    background: rgba(255,255,255,0.2);
    color: white;
  }
  .message__attachment-file-icon { font-size: 20px; }
  .message__attachment-file-info {
    display: flex;
    flex-direction: column;
  }
  .message__attachment-file-name {
    font-size: 12px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 160px;
  }
  .message__attachment-file-size {
    font-size: 10px;
    color: #888;
  }
  .message--mine .message__attachment-file-size { color: rgba(255,255,255,0.7); }
  .message__meta {
    display: flex;
    gap: 8px;
    font-size: 11px;
    color: #aaa;
    margin-top: 4px;
  }

  /* 画像拡大 */
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.9);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .lightbox__image {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 4px;
  }
</style>