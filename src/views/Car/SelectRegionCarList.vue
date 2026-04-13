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

      <CarCard
        v-for="car in carList"
        :key="car.id"
        :car="car"
        :is-favorite="favorites.includes(car.id)"
        :show-favorite-btn="true"
        @click="goToDetail"
        @toggle-favorite="toggleFavorite"
      />

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
import CarCard from '@/components/Common/CarCard.vue'

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
const regionIds    = route.query.regionIds

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
    const res = await axios.get('/api/SelectRegionCarList', {
      params: {
        regionIds:  regionIds,
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