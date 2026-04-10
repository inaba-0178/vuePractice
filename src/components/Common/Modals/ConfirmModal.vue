<template>
  <div v-if="show" class="confirm-modal__overlay" @click.self="$emit('cancel')">
    <div class="confirm-modal">
      <div class="confirm-modal__header">
        <h2 class="confirm-modal__title">{{ title }}</h2>
      </div>
      <div class="confirm-modal__body">
        <p class="confirm-modal__message">{{ message }}</p>
      </div>
      <!-- footer部分を修正 -->
      <div class="confirm-modal__footer">
        <button
          v-if="showCancel"
          class="confirm-modal__btn-cancel"
          @click="$emit('cancel')"
        >
          {{ cancelLabel }}
        </button>
        <button class="confirm-modal__btn-confirm" @click="$emit('confirm')">
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
defineProps({
  show:         { type: Boolean, default: false },
  title:        { type: String,  required: true },
  message:      { type: String,  required: true },
  confirmLabel: { type: String,  default: '確認' },
  cancelLabel:  { type: String,  default: 'キャンセル' },
  showCancel:   { type: Boolean, default: true },
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.confirm-modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.confirm-modal {
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.confirm-modal__header {
  padding: 24px 28px 16px;
  border-bottom: 1px solid #1a1a1a;
}

.confirm-modal__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0;
}

.confirm-modal__body {
  padding: 20px 28px;
}

.confirm-modal__message {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #aaa;
  line-height: 1.8;
  margin: 0;
}

.confirm-modal__footer {
  display: flex;
  gap: 10px;
  padding: 16px 28px 24px;
  justify-content: flex-end;
}

.confirm-modal__btn-cancel {
  padding: 10px 20px;
  border: 1px solid #333;
  border-radius: 4px;
  background: transparent;
  color: #888;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.05em;
}
.confirm-modal__btn-cancel:hover {
  border-color: #555;
  color: #fff;
}

.confirm-modal__btn-confirm {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #dc5078;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: 0.05em;
}
.confirm-modal__btn-confirm:hover {
  background: #c44068;
}
</style>