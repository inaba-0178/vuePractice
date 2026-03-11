<template>
  <div>
    <button @click="showModal = true">モーダルを開く</button>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="register-modal">
          <p class="register-modal-text">登録が完了しました。</p>
          <button @click="showModal = false">OK</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const showModal = ref(false)
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal {
  background: #0a0a0a;
  border-radius: 4px;
  padding: 48px 56px;
  text-align: center;
  color: #fff;
}
.register-modal {
  background: #0a0a0a;
  border-radius: 4px;
  padding: 48px 56px;
  text-align: center;
  color: #fff;
}
</style>