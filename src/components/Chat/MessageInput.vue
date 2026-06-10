<template>
  <div class="message-input">
    <!-- 添付ファイルプレビュー -->
    <div v-if="attachments.length > 0" class="message-input__previews">
      <div
        v-for="(file, index) in attachments"
        :key="index"
        class="preview-item"
      >
        <!-- 画像プレビュー -->
        <img
          v-if="isImage(file)"
          :src="getPreviewUrl(file)"
          class="preview-item__image"
        />
        <!-- 動画プレビュー -->
        <video
          v-else-if="isVideo(file)"
          :src="getPreviewUrl(file)"
          class="preview-item__video"
          controls
        />
        <!-- ファイル -->
        <div v-else class="preview-item__file">
          <span class="preview-item__file-icon">📄</span>
          <span class="preview-item__file-name">{{ file.name }}</span>
        </div>
        <button class="preview-item__remove" @click="removeAttachment(index)">×</button>
      </div>
    </div>

    <div class="message-input__row">
      <!-- 添付ボタン -->
      <button class="message-input__attach" @click="triggerFileInput" title="ファイルを添付">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
        </svg>
      </button>

      <!-- 非表示ファイル入力 -->
      <input
        ref="fileInputRef"
        type="file"
        multiple
        :accept="acceptTypes"
        style="display: none"
        @change="handleFileChange"
      />

      <textarea
        v-model="inputMessage"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.ctrl.enter="handleNewLine"
        @input="handleTyping"
        placeholder="メッセージを入力... (Enterで送信 / Ctrl+Enterで改行)"
        rows="2"
      />

      <button
        @click="handleSend"
        :disabled="!canSend"
      >
        送信
      </button>
    </div>

    <p v-if="error" class="message-input__error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AttachmentLimits } from '@/constants/AttachmentLimits'

const emit = defineEmits(['send', 'typing'])

const inputMessage = ref('')
const attachments  = ref([])
const fileInputRef = ref(null)
const error        = ref('')
let typingTimer    = null

const acceptTypes = [
  ...AttachmentLimits.IMAGE_TYPES,
  ...AttachmentLimits.VIDEO_TYPES,
  ...AttachmentLimits.FILE_TYPES,
].map(ext => `.${ext}`).join(',')

const canSend = computed(() => {
  return inputMessage.value.trim() || attachments.value.length > 0
})

const isImage = (file) => {
  return AttachmentLimits.IMAGE_TYPES.includes(
    file.name.split('.').pop().toLowerCase()
  )
}

const isVideo = (file) => {
  return AttachmentLimits.VIDEO_TYPES.includes(
    file.name.split('.').pop().toLowerCase()
  )
}

const getPreviewUrl = (file) => URL.createObjectURL(file)

const triggerFileInput = () => {
  fileInputRef.value.click()
}

const handleFileChange = (e) => {
  error.value = ''
  const files = Array.from(e.target.files)

  if (attachments.value.length + files.length > AttachmentLimits.MAX_FILES) {
    error.value = `一度に送信できるファイルは${AttachmentLimits.MAX_FILES}件までです`
    return
  }

  for (const file of files) {
    const ext     = file.name.split('.').pop().toLowerCase()
    const maxSize = AttachmentLimits.getMaxSize(ext)

    if (!AttachmentLimits.allTypes().includes(ext)) {
      error.value = `${file.name} は対応していないファイル形式です`
      return
    }

    if (file.size > maxSize) {
      const maxMB = maxSize / 1024 / 1024
      error.value = `${file.name} のサイズが上限（${maxMB}MB）を超えています`
      return
    }

    attachments.value.push(file)
  }

  // 同じファイルを再選択できるようにリセット
  e.target.value = ''
}

const removeAttachment = (index) => {
  attachments.value.splice(index, 1)
  error.value = ''
}

const handleNewLine = () => {
  inputMessage.value += '\n'
}

const handleSend = () => {
  if (!canSend.value) return

  emit('send', {
    message:     inputMessage.value,
    attachments: attachments.value,
  })

  inputMessage.value = ''
  attachments.value  = []
  error.value        = ''
  emit('typing', false)
}

const handleTyping = () => {
  emit('typing', true)
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    emit('typing', false)
  }, 2000)
}
</script>

<style scoped>
.message-input {
  border-top: 1px solid #eee;
  padding: 8px 16px 12px;
}

.message-input__previews {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.preview-item__image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  display: block;
}

.preview-item__video {
  width: 120px;
  height: 80px;
  object-fit: cover;
  display: block;
}

.preview-item__file {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  padding: 8px;
  background: #f5f5f5;
}

.preview-item__file-icon {
  font-size: 24px;
}

.preview-item__file-name {
  font-size: 10px;
  color: #666;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.preview-item__remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.message-input__row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-input__attach {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #888;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: color 0.2s ease, background 0.2s ease;
  flex-shrink: 0;
}

.message-input__attach:hover {
  color: #4a90e2;
  background: #f0f0f0;
}

textarea {
  flex: 1;
  resize: none;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

button[type="button"],
button:not(.message-input__attach):not(.preview-item__remove) {
  padding: 8px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-input__error {
  font-size: 12px;
  color: #e24b4b;
  margin: 6px 0 0;
}
</style>