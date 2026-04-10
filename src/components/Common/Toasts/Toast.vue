<template>
  <Transition name="toast">
    <div v-if="show" class="toast">
      <span class="toast__message">{{ message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show:     { type: Boolean, default: false },
  message:  { type: String,  required: true },
  duration: { type: Number,  default: 3000 },
})

const emit = defineEmits(['close'])

watch(() => props.show, (val) => {
  if (val) {
    setTimeout(() => emit('close'), props.duration)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 14px 24px;
  z-index: 400;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.toast__message {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #fff;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>