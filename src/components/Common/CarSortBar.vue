<template>
  <div class="sort-bar">
    <button class="sort-bar__reset" @click="resetSort">元の並び順に戻す</button>

    <div class="sort-bar__divider" />

    <div
      v-for="group in sortGroups"
      :key="group.key"
      class="sort-bar__group"
    >
      <span class="sort-bar__group-label">{{ group.label }}</span>
      <div class="sort-bar__btns">
        <button
            v-for="opt in group.options"
            :key="`${group.key}-${opt.order}`"
            class="sort-bar__btn"
            :class="{ 'is-active': props.activeKey === group.key && props.activeOrder === opt.order }"
            @click="onSort(group.key, opt.order)"
            >
            {{ opt.label }}
        </button>
      </div>
      <div class="sort-bar__divider" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['sort'])

const currentKey   = ref('')
const currentOrder = ref('')

const props = defineProps({
  activeKey:   { type: String, default: '' },
  activeOrder: { type: String, default: '' },
})

const sortGroups = [
  {
    key: 'publishedAt',
    label: '新着順',
    options: [
      { label: '新', order: 'desc' },
      { label: '古', order: 'asc' },
    ],
  },
  {
    key: 'totalPrice',
    label: '支払総額',
    options: [
      { label: '安', order: 'asc' },
      { label: '高', order: 'desc' },
    ],
  },
  {
    key: 'price',
    label: '本体価格',
    options: [
      { label: '安', order: 'asc' },
      { label: '高', order: 'desc' },
    ],
  },
  {
    key: 'modelYear',
    label: '年式',
    options: [
      { label: '新', order: 'desc' },
      { label: '古', order: 'asc' },
    ],
  },
  {
    key: 'mileage',
    label: '走行距離',
    options: [
      { label: '多', order: 'desc' },
      { label: '少', order: 'asc' },
    ],
  },
  {
    key: 'displacement',
    label: '排気量',
    options: [
      { label: '多', order: 'desc' },
      { label: '少', order: 'asc' },
    ],
  },
  {
    key: 'inspection',
    label: '車検',
    options: [
      { label: '付', order: 'asc' },
      { label: '無', order: 'desc' },
    ],
  },
  {
    key: 'repairHistory',
    label: '修復歴',
    options: [
      { label: '無', order: 'asc' },
      { label: '有', order: 'desc' },
    ],
  },
]

const onSort = (key, order) => {
  if (props.activeKey === key && props.activeOrder === order) {
    emit('sort', { key: '', order: '' })
  } else {
    emit('sort', { key, order })
  }
}

const resetSort = () => {
  currentKey.value   = ''
  currentOrder.value = ''
  emit('sort', { key: '', order: '' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap');

.sort-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 10px 16px;
  background: #0d0d0d;
  border: 1px solid #222;
  border-radius: 4px;
  margin-bottom: 16px;
  font-family: 'Montserrat', sans-serif;
}

.sort-bar__reset {
  font-size: 11px;
  font-weight: 400;
  color: #dc5078;
  cursor: pointer;
  white-space: nowrap;
  padding: 4px 10px;
  border: 1px solid #dc5078;
  border-radius: 3px;
  background: transparent;
  letter-spacing: 0.05em;
  transition: background 0.15s;
  margin-right: 8px;
  flex-shrink: 0;
}
.sort-bar__reset:hover {
  background: rgba(220, 80, 120, 0.1);
}

.sort-bar__divider {
  width: 1px;
  height: 28px;
  background: #222;
  margin: 0 6px;
  flex-shrink: 0;
}

.sort-bar__group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sort-bar__group-label {
  font-size: 10px;
  font-weight: 400;
  color: #666;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.sort-bar__btns {
  display: flex;
  gap: 2px;
}

.sort-bar__btn {
  font-size: 11px;
  font-weight: 400;
  font-family: 'Montserrat', sans-serif;
  padding: 3px 8px;
  border: 1px solid #2a2a2a;
  border-radius: 3px;
  background: transparent;
  color: #888;
  cursor: pointer;
  white-space: nowrap;
  letter-spacing: 0.05em;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.sort-bar__btn:hover {
  border-color: #444;
  color: #ccc;
}
.sort-bar__btn.is-active {
  background: #dc5078!important;
  border-color: #dc5078!important;
  color: #fff!important;
}
</style>