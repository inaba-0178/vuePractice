<template>
  <div class="message-input">
    <textarea
      v-model="inputMessage"
      @keydown.enter.exact.prevent="handleSend"
      @input="handleTyping"
      placeholder="メッセージを入力... (Enterで送信)"
      rows="2"
    />
    <button @click="handleSend" :disabled="!inputMessage.trim()">
      送信
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['send', 'typing'])

const inputMessage = ref('')
let typingTimer = null

const handleSend = () => {
  if (!inputMessage.value.trim()) return
  emit('send', inputMessage.value)
  inputMessage.value = ''
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
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #eee;
}
textarea {
  flex: 1;
  resize: none;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
button {
  padding: 8px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>