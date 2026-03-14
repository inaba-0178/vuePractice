<template>
  <div class="area-select-wrapper">
    <div class="area-select-header">
      <h1 class="area-select-title">エリアを選択</h1>
      <p class="area-select-description">車両を探すエリアを選択してください。</p>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>

    <div v-else class="area-table">

      <!-- 全国 -->
      <div class="area-row">
        <div class="area-left">
          <label class="checkbox-label">
            <input
              type="checkbox"
              class="checkbox"
              :checked="isAllChecked"
              :indeterminate.prop="isAllIndeterminate"
              @change="toggleAll"
            />
            <span class="area-name">全国</span>
            <span class="area-count">({{ totalCount }})</span>
          </label>
        </div>
        <div class="area-right"></div>
      </div>

      <!-- エリアごと -->
      <div
        v-for="area in areaCarData"
        :key="area.areaId"
        class="area-row"
      >
        <!-- 左：エリア名 -->
        <div class="area-left">
          <label class="checkbox-label">
            <input
              type="checkbox"
              class="checkbox"
              :checked="isAreaChecked(area)"
              :indeterminate.prop="isAreaIndeterminate(area)"
              @change="toggleArea(area)"
            />
            <span class="area-name">{{ area.areaName }}</span>
            <span class="area-count">({{ area.totalCount }})</span>
          </label>
        </div>

        <!-- 右：都道府県グリッド -->
        <div class="area-right">
          <label
            v-for="pref in area.prefectures"
            :key="pref.regionId"
            class="prefecture-item"
            :class="{
                disabled: pref.count === 0,
                selected: selectedRegionIds.includes(pref.regionId)
            }"
          >
            <input
              type="checkbox"
              class="checkbox"
              :value="pref.regionId"
              :disabled="pref.count === 0"
              v-model="selectedRegionIds"
            />
            <span class="prefecture-name">{{ pref.prefectureName }}</span>
            <span class="prefecture-count">({{ pref.count }})</span>
          </label>
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="clearSelection" class="clear-button">条件をクリア</button>
      <button
        @click="goToCarList"
        :disabled="selectedRegionIds.length === 0"
        class="submit-button"
        >
        {{ selectedTotalCount }}台 検索する
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route  = useRoute()

const areaCarData       = ref([])
const selectedRegionIds = ref([])
const loading           = ref(true)
const seriesId          = route.query.seriesId

onMounted(async () => {
  try {
    const res = await axios.get('/api/AreaCarList', {
      params: { seriesId: seriesId },
    })
    areaCarData.value = res.data.areaCarData
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const totalCount = computed(() => {
  return areaCarData.value.reduce((sum, area) => sum + area.totalCount, 0)
})

const allAvailableRegionIds = computed(() => {
  return areaCarData.value.flatMap(area =>
    area.prefectures.filter(p => p.count > 0).map(p => p.regionId)
  )
})

const isAllChecked = computed(() => {
  if (allAvailableRegionIds.value.length === 0) return false
  return allAvailableRegionIds.value.every(id => selectedRegionIds.value.includes(id))
})

const isAllIndeterminate = computed(() => {
  const checkedCount = allAvailableRegionIds.value.filter(id => selectedRegionIds.value.includes(id)).length
  return checkedCount > 0 && checkedCount < allAvailableRegionIds.value.length
})

const toggleAll = () => {
  if (isAllChecked.value) {
    selectedRegionIds.value = []
  } else {
    selectedRegionIds.value = [...allAvailableRegionIds.value]
  }
}

const isAreaChecked = (area) => {
  const availablePrefs = area.prefectures.filter(p => p.count > 0)
  if (availablePrefs.length === 0) return false
  return availablePrefs.every(p => selectedRegionIds.value.includes(p.regionId))
}

const isAreaIndeterminate = (area) => {
  const availablePrefs = area.prefectures.filter(p => p.count > 0)
  if (availablePrefs.length === 0) return false
  const checkedCount = availablePrefs.filter(p => selectedRegionIds.value.includes(p.regionId)).length
  return checkedCount > 0 && checkedCount < availablePrefs.length
}

const toggleArea = (area) => {
  const availableRegionIds = area.prefectures
    .filter(p => p.count > 0)
    .map(p => p.regionId)

  if (isAreaChecked(area)) {
    selectedRegionIds.value = selectedRegionIds.value.filter(
      id => !availableRegionIds.includes(id)
    )
  } else {
    const newIds = availableRegionIds.filter(
      id => !selectedRegionIds.value.includes(id)
    )
    selectedRegionIds.value = [...selectedRegionIds.value, ...newIds]
  }
}

const clearSelection = () => {
  selectedRegionIds.value = []
}

const goToCarList = () => {
  router.push({
    path: '/car/select-area-list',
    query: {
      seriesId:  seriesId,
      regionIds: selectedRegionIds.value.join(','),
    },
  })
}

const selectedTotalCount = computed(() => {
  return areaCarData.value.flatMap(area => area.prefectures)
    .filter(pref => selectedRegionIds.value.includes(pref.regionId))
    .reduce((sum, pref) => sum + pref.count, 0)
})

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.area-select-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 48px;
  padding-bottom: 120px;
}

.area-select-header {
  margin-bottom: 40px;
}

.area-select-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0 0 8px;
}

.area-select-description {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #666;
  letter-spacing: 0.05em;
  margin: 0;
}

.loading {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
  letter-spacing: 0.1em;
}

.area-table {
  border: 1px solid #222;
  border-radius: 4px;
  overflow: hidden;
}

.area-row {
  display: flex;
  border-bottom: 1px solid #222;
}

.area-row:last-child {
  border-bottom: none;
}

.area-left {
  width: 140px;
  min-width: 140px;
  padding: 20px 24px;
  border-right: 1px solid #222;
  background: #111;
  display: flex;
  align-items: flex-start;
}

.area-right {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
  align-content: flex-start;
}

.checkbox-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.area-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.05em;
  text-align: center;
}

.area-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #666;
  letter-spacing: 0.05em;
  text-align: center;
}

.checkbox {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #444;
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.checkbox:checked {
  background: #dc5078;
  border-color: #dc5078;
}

.checkbox:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
}

.checkbox:indeterminate {
  background: transparent;
  border-color: #dc5078;
}

.checkbox:indeterminate::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 6px;
  width: 8px;
  height: 2px;
  background: #dc5078;
}

.prefecture-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  cursor: pointer;
  width: 20%;
  transition: background 0.2s ease;
  border-radius: 2px;
}

.prefecture-item:hover:not(.disabled) {
  background: #1a1a1a;
}

.prefecture-item.disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.prefecture-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
}

.prefecture-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 300;
  color: #666;
  letter-spacing: 0.05em;
}

.actions {
  position: fixed;
  bottom: 48px;
  right: 48px;
  display: flex;
  gap: 16px;
}

.clear-button {
  background: #333;
  border: 1px solid #444;
  border-radius: 50px;
  padding: 14px 32px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.clear-button:hover {
  background: #444;
  color: #fff;
}

.submit-button {
  background: transparent;
  border: 1px solid #dc5078;
  border-radius: 50px;
  padding: 14px 48px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: #dc5078;
  color: #fff;
}

.submit-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.prefecture-item.selected {
  background: rgba(220, 80, 120, 0.1);
}

.prefecture-item.selected .prefecture-name {
  color: #dc5078;
}

.prefecture-item.selected .prefecture-count {
  color: #dc5078;
}

</style>