<template>
  <div class="car-list-wrapper">
    <div class="car-list-header">
      <h1 class="car-list-title">車両一覧</h1>
      <p class="car-list-description">選択したエリアの車両を表示しています。</p>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>

    <template v-else>
      <div class="car-list-meta">
        <span class="car-list-count">全 {{ totalCount }} 件</span>
      </div>

      <div class="car-list">
        <div
          v-for="car in carList"
          :key="car.id"
          class="car-item"
        >
          <!-- 左：画像 -->
          <div class="car-item__image">
            <img
              v-if="car.mainImageUrl"
              :src="car.mainImageUrl"
              :alt="`車両ID:${car.id}`"
            />
            <div v-else class="car-item__no-image">NO IMAGE</div>
          </div>

          <!-- 右：情報 -->
          <div class="car-item__body">
            <div class="car-item__price-area">
              <div class="car-item__price">
                {{ formatPrice(car.price) }}<span class="car-item__price-unit">万円</span>
              </div>
            </div>

            <div class="car-item__specs">
              <div class="car-item__spec">
                <span class="car-item__spec-label">年式</span>
                <span class="car-item__spec-value">{{ car.modelYear }}年</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">走行距離</span>
                <span class="car-item__spec-value">{{ formatMileage(car.mileage) }}km</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">色</span>
                <span class="car-item__spec-value">{{ car.color }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">ミッション</span>
                <span class="car-item__spec-value">{{ car.transmission }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">燃料</span>
                <span class="car-item__spec-value">{{ car.fuelType }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">修復歴</span>
                <span class="car-item__spec-value">{{ car.repairHistory }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ページネーション -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="pagination__btn"
        >
          最初
        </button>
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination__btn"
        >
          前へ
        </button>

        <button
          v-for="page in displayPages"
          :key="page"
          @click="goToPage(page)"
          class="pagination__btn pagination__btn--page"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination__btn"
        >
          次へ
        </button>
        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="pagination__btn"
        >
          最後
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route  = useRoute()

const carList     = ref([])
const totalCount  = ref(0)
const loading     = ref(true)
const currentPage = ref(1)
const limit       = 10

const seriesId  = route.query.seriesId
const regionIds = route.query.regionIds
  ? route.query.regionIds.split(',').map(Number)
  : []

const totalPages = computed(() => Math.ceil(totalCount.value / limit))

const displayPages = computed(() => {
  const half  = 5
  let start   = currentPage.value - half + 1
  let end     = currentPage.value + half

  if (start < 1) {
    start = 1
    end   = Math.min(10, totalPages.value)
  }
  if (end > totalPages.value) {
    end   = totalPages.value
    start = Math.max(1, end - 9)
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const fetchCarList = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * limit
    const res = await axios.get('/api/SelectAreaCarList', {
      params: {
        seriesId:  Number(seriesId),
        regionIds: regionIds,
        offset:    offset,
        limit:     limit,
      },
      paramsSerializer: (params) => {
        const query = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query.append(key, value.join(','))
          } else {
            query.append(key, value)
          }
        })
        return query.toString()
      }
    })
    carList.value    = res.data.carList
    totalCount.value = res.data.totalCount
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const formatPrice = (price) => {
  return Math.floor(Number(price) / 10000)
}

const formatMileage = (mileage) => {
  return mileage.toLocaleString()
}

watch(currentPage, () => {
  fetchCarList()
})

onMounted(() => {
  fetchCarList()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.car-list-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 48px;
  padding-bottom: 120px;
}

.car-list-header {
  margin-bottom: 40px;
}

.car-list-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0 0 8px;
}

.car-list-description {
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

.car-list-meta {
  margin-bottom: 24px;
}

.car-list-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: #666;
  letter-spacing: 0.05em;
}

.car-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
}

.car-item {
  display: flex;
  border: 1px solid #222;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.car-item:hover {
  border-color: #444;
}

.car-item__image {
  width: 280px;
  min-width: 280px;
  aspect-ratio: 4/3;
  background: #111;
  overflow: hidden;
}

.car-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-item__no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #444;
  letter-spacing: 0.1em;
}

.car-item__body {
  flex: 1;
  padding: 24px 32px;
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.car-item__price-area {
  min-width: 160px;
}

.car-item__price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 400;
  color: #dc5078;
  letter-spacing: 0.05em;
  line-height: 1;
}

.car-item__price-unit {
  font-size: 16px;
  font-weight: 300;
  margin-left: 4px;
}

.car-item__specs {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 24px;
}

.car-item__spec {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 12px;
  border-bottom: 1px solid #1a1a1a;
}

.car-item__spec-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #666;
  letter-spacing: 0.1em;
}

.car-item__spec-value {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #ccc;
  letter-spacing: 0.05em;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination__btn {
  background: transparent;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #666;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.pagination__btn:hover:not(:disabled) {
  border-color: #dc5078;
  color: #dc5078;
}

.pagination__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination__btn--page.active {
  border-color: #dc5078;
  color: #dc5078;
}
</style>