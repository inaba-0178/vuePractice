<template>
    <div>
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">CARS IN STOCK</p>
                <h2 class="section-title">在庫一覧</h2>
            </div>

            <CarSearchFilter @search="onSearch" />

            <div v-if="loading" class="dealer-cars__loading">
                読み込み中...
            </div>

            <template v-else>
                <p class="dealer-cars__count">全 {{ totalCount }} 台掲載中</p>

                <CarSortBar 
                    @sort="onSort"
                    :activeKey="sortKey"
                    :activeOrder="sortOrder"
                />

                <div class="dealer-cars__grid">
                    <CarCard
                        v-for="car in carList"
                        :key="car.id"
                        :car="car"
                        :show-favorite-btn="true"
                        :is-favorite="favorites.includes(car.id)"
                        @click="goToDetail"
                        @toggle-favorite="toggleFavorite"
                    />
                </div>

                <p v-if="carList.length === 0" class="dealer-cars__empty">
                    在庫情報がありません
                </p>

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
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import CarCard from '@/components/Common/CarCard.vue'
import CarSearchFilter from '@/components/Common/CarSearchFilter.vue'
import CarSortBar from '@/components/Common/CarSortBar.vue'

const props = defineProps({
    dealerId: { type: Number, required: true },
})

const router      = useRouter()
const carList     = ref([])
const totalCount  = ref(0)
const loading     = ref(false)
const currentPage = ref(1)
const favorites   = ref([])
const limit       = 10

const totalPages = computed(() => Math.ceil(totalCount.value / limit))

const displayPages = computed(() => {
    const half  = 5
    let start   = currentPage.value - half + 1
    let end     = currentPage.value + half
    if (start < 1) { start = 1; end = Math.min(10, totalPages.value) }
    if (end > totalPages.value) { end = totalPages.value; start = Math.max(1, end - 9) }
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

const fetchCarList = async () => {
    loading.value = true
    try {
        const offset  = (currentPage.value - 1) * limit
        const { data } = await axios.get('/api/SelectConditionCarList', {
            params: {
                dealerId: props.dealerId,
                offset,
                limit,
            }
        })
        carList.value    = data.carList
        totalCount.value = data.totalCount
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const goToPage       = (page) => { if (page < 1 || page > totalPages.value) return; currentPage.value = page }
const goToDetail     = (id)   => router.push({ path: `/cars/${id}` })
const toggleFavorite = (id)   => {
    const idx = favorites.value.indexOf(id)
    idx === -1 ? favorites.value.push(id) : favorites.value.splice(idx, 1)
}

watch(currentPage, () => fetchCarList())
onMounted(() => fetchCarList())
</script>

<style scoped>
.tab-section {
    padding: 64px 40px;
}

.dealer-cars__loading {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #666;
    letter-spacing: 0.1em;
}

.dealer-cars__count {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #888;
    margin: 0 0 24px;
    letter-spacing: 0.05em;
}

.dealer-cars__grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 40px;
}

.dealer-cars__empty {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    text-align: center;
    padding: 64px 0;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 40px;
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