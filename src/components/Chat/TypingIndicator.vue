<template>
  <div class="typing-indicator" v-if="typingUsers.length > 0">
    <span>{{ typingText }}</span>
    <span class="dots">
      <span>.</span><span>.</span><span>.</span>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  typingUsers: {
    type: Array,
    default: () => []
  }
})

const typingText = computed(() => {
  if (props.typingUsers.length === 1) {
    return `${props.typingUsers[0]}が入力中`
  }
  return `${props.typingUsers.length}人が入力中`
})
</script>

<style scoped>
.typing-indicator {
  padding: 4px 16px;
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}
.dots span {
  animation: blink 1.4s infinite;
}
.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}
</style>