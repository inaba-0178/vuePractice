<template>
  <div class="car-list-wrapper">
    <div class="car-list-header">
      <h1 class="car-list-title">車両一覧</h1>
      <p class="car-list-description">選択したエリアの車両を表示しています。</p>
    </div>

    <CarSearchFilter @search="onSearch" />

    <div v-if="loading" class="loading">読み込み中...</div>

    <template v-else>
      <div class="car-list-meta">
        <span class="car-list-count">全 {{ totalCount }} 件</span>
      </div>

      <CarSortBar 
        @sort="onSort"
        :activeKey="sortKey"
        :activeOrder="sortOrder"
      />

      <div class="car-list">
        <div
          v-for="car in carList"
          :key="car.id"
          class="car-item"
          @click="goToDetail(car.id)"
        >
          <div class="car-item__image">
            <span v-if="car.isNew" class="car-item__tag-new">新着</span>
            <button
              class="car-item__fav"
              :class="{ 'is-active': favorites.includes(car.id) }"
              @click.stop="toggleFavorite(car.id)"
            >
              {{ favorites.includes(car.id) ? '♥' : '♡' }}
            </button>
            <img v-if="car.mainImageUrl" :src="imageBaseUrl + car.mainImageUrl" :alt="`車両ID:${car.id}`" />
            <div v-else class="car-item__no-image">NO IMAGE</div>
          </div>

          <div class="car-item__body">
            <div class="car-item__price-row">
              <div>
                <span class="car-item__price">{{ formatPrice(car.price) }}</span>
                <span class="car-item__price-unit">万円</span>
                <span class="car-item__price-label">（支払総額）</span>
              </div>
              <div class="car-item__price-sub">車体 {{ formatPrice(car.price) }}万円</div>
            </div>

            <div class="car-item__specs">
              <div class="car-item__spec">
                <span class="car-item__spec-label">年式</span>
                <span class="car-item__spec-value">{{ car.modelYear ? `${car.modelYear}年` : '-' }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">走行距離</span>
                <span class="car-item__spec-value">{{ formatMileage(car.mileage) }}km</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">修復歴</span>
                <span class="car-item__spec-value">{{ formatRepairHistory(car.repairHistory) }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">車検</span>
                <span class="car-item__spec-value">{{ formatInspection(car.inspectionStatus, car.inspectionExpireDate) }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">ミッション</span>
                <span class="car-item__spec-value">{{ car.transmission || '-' }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">排気量</span>
                <span class="car-item__spec-value">{{ car.displacement ? `${car.displacement}cc` : '-' }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">ボディタイプ</span>
                <span class="car-item__spec-value">{{ car.bodyTypeName || '-' }}</span>
              </div>
              <div class="car-item__spec">
                <span class="car-item__spec-label">色</span>
                <span class="car-item__spec-value">{{ car.color || '-' }}</span>
              </div>
            </div>

            <div class="car-item__bottom">
              <div class="car-item__dealer">
                <span class="car-item__dealer-name">{{ car.dealerName }}</span>
                <div class="car-item__dealer-meta">
                  <span class="car-item__dealer-region">{{ car.dealerCity }}</span>
                  <div v-if="car.dealerRating" class="car-item__rating">
                    <span class="car-item__rating-star">★</span>
                    <span class="car-item__rating-val">{{ car.dealerRating }}</span>
                    <span class="car-item__rating-count">（{{ car.dealerReviewCount }}件）</span>
                  </div>
                </div>
              </div>
              <button class="car-item__btn-inquiry" @click.stop>在庫確認・見積依頼</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button @click="goToPage(1)" :disabled="currentPage === 1" class="pagination__btn">最初</button>
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination__btn">前へ</button>
        <button
          v-for="page in displayPages"
          :key="page"
          @click="goToPage(page)"
          class="pagination__btn pagination__btn--page"
          :class="{ active: page === currentPage }"
        >{{ page }}</button>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination__btn">次へ</button>
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="pagination__btn">最後</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import CarSearchFilter from '@/components/Common/CarSearchFilter.vue'
import CarSortBar from '@/components/Common/CarSortBar.vue'

const router = useRouter()
const route  = useRoute()

const carList      = ref([])
const totalCount   = ref(0)
const loading      = ref(true)
const currentPage  = ref(1)
const limit        = 10
const sortKey      = ref('')
const sortOrder    = ref('')
const searchParams = ref({})
const favorites    = ref([])
const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL

const seriesId  = route.query.seriesId
const regionIds = route.query.regionIds
  ? route.query.regionIds.split(',').map(Number)
  : []

const totalPages = computed(() => Math.ceil(totalCount.value / limit))

const displayPages = computed(() => {
  const half = 5
  let start  = currentPage.value - half + 1
  let end    = currentPage.value + half
  if (start < 1) { start = 1; end = Math.min(10, totalPages.value) }
  if (end > totalPages.value) { end = totalPages.value; start = Math.max(1, end - 9) }
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)
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
        sortKey:   sortKey.value,
        sortOrder: sortOrder.value,
        ...searchParams.value,
      },
      paramsSerializer: (params) => {
        const query = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            if (value.length > 0) query.append(key, value.join(','))
          } else if (value !== '' && value !== null && value !== undefined) {
            query.append(key, value)
          }
        })
        return query.toString()
      }
    })
    carList.value    = res.data.carList
    console.log(carList.value);
    totalCount.value = res.data.totalCount
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const goToPage    = (page) => { if (page < 1 || page > totalPages.value) return; currentPage.value = page }
const goToDetail  = (id)   => router.push({ path: `/cars/${id}` })
const toggleFavorite = (id) => {
  const idx = favorites.value.indexOf(id)
  idx === -1 ? favorites.value.push(id) : favorites.value.splice(idx, 1)
}
const onSearch = (params) => { searchParams.value = params; currentPage.value = 1; fetchCarList() }
const onSort   = ({ key, order }) => { sortKey.value = key; sortOrder.value = order; currentPage.value = 1; fetchCarList() }

const formatPrice         = (price) => Math.floor(Number(price) / 10000)
const formatMileage       = (mileage) => mileage ? mileage.toLocaleString() : '-'
const formatRepairHistory = (val) => ({ none: 'なし', minor: '軽微あり', major: 'あり', unknown: '不明' }[val] ?? val)
const formatInspection    = (status, expireDate) => {
  if (status === 'none') return '車検なし'
  if (status === 'new_car') return '新車'
  if (expireDate) return expireDate
  return '車検整備付'
}

watch(currentPage, () => fetchCarList())
onMounted(() => fetchCarList())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.car-list-wrapper {
  min-height: 100vh;
  background: #0a0a0a;
  padding: 48px;
  padding-bottom: 120px;
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 16px;
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
  gap: 12px;
  margin-bottom: 48px;
}

.car-item {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
}
.car-item:hover {
  border-color: #444;
}

.car-item__image {
  width: 220px;
  min-width: 220px;
  background: #222;
  display: flex;
  align-items:center;
  justify-content: center;
  border-right: 1px solid #2a2a2a;
  position: relative;
}
.car-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.car-item__no-image {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #444;
  letter-spacing: 0.1em;
}

.car-item__tag-new {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(220, 80, 120, 0.15);
  color: #dc5078;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid rgba(220, 80, 120, 0.3);
}

.car-item__fav {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: 1px solid #333;
  border-radius: 50%;
  background: #0d0d0d;
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.car-item__fav.is-active {
  background: rgba(220, 80, 120, 0.15);
  border-color: #dc5078;
  color: #dc5078;
}
.car-item__fav:hover {
  border-color: #dc5078;
  color: #dc5078;
}

.car-item__body {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.car-item__price-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}
.car-item__price {
  font-family: 'Cormorant Garamond',serif;
  font-size: 32px;
  font-weight: 400;
  color: #dc5078;
  letter-spacing: 0.05em;
  line-height: 1;
}
.car-item__price-unit {
  font-family: 'Cormorant Garamond',serif;
  font-size: 14px;
  color: #dc5078;
  margin-left: 2px;
}
.car-item__price-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  color: #666;
  margin-left: 4px;
}
.car-item__price-sub {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
}

.car-item__specs {
  display: grid;
  grid-template-columns: repeat(4, 160px);  /* ← 固定幅 */
  gap: 8px 16px;
  border-top: 1px solid #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  padding: 10px 0;
}
.car-item__spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.car-item__spec-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #888;
  letter-spacing: 0.08em;
}
.car-item__spec-value {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
  letter-spacing: 0.03em;
}

.car-item__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.car-item__dealer {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.car-item__dealer-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
}
.car-item__dealer-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
.car-item__dealer-region {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
}
.car-item__rating {
  display: flex;
  align-items: center;
  gap: 3px;
}
.car-item__rating-star {
  font-size: 12px;
  color: #f59e0b;
}
.car-item__rating-val {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
}
.car-item__rating-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
}

.car-item__btn-inquiry {
  padding: 8px 16px;
  border-radius: 3px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #dc5078;
  background: #dc5078;
  color: #fff;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.05em;
  transition: background 0.15s;
}
.car-item__btn-inquiry:hover {
  background: #c44068;
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