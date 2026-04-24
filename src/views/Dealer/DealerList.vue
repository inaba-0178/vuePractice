<template>
    <div class="dealer-list">
        <!-- 検索フォーム -->
        <section class="search-section">
            <div class="search-section__inner">
                <h1 class="search-section__title">中古車販売店・ディーラー検索</h1>

                <div class="search-form">
                    <div class="search-form__row">
                        <div class="search-form__field">
                            <label class="search-form__label">エリア</label>
                            <select
                                v-model="selectedAreaId"
                                class="search-form__select"
                                @change="onAreaChange"
                            >
                                <option :value="null">選択してください</option>
                                <option
                                    v-for="area in areas"
                                    :key="area.id"
                                    :value="area.id"
                                >{{ area.name }}</option>
                            </select>
                        </div>

                        <div class="search-form__field">
                            <label class="search-form__label">都道府県</label>
                            <select
                                v-model="selectedRegionId"
                                class="search-form__select"
                                :disabled="!selectedAreaId"
                            >
                                <option :value="null">選択してください</option>
                                <option
                                    v-for="region in filteredRegions"
                                    :key="region.id"
                                    :value="region.id"
                                >{{ region.name }}</option>
                            </select>
                        </div>

                        <div class="search-form__field">
                            <label class="search-form__label">販売店名</label>
                            <input
                                v-model="searchName"
                                type="text"
                                placeholder="販売店名で探す"
                                class="search-form__input"
                            />
                        </div>
                    </div>

                    <div class="search-form__actions">
                        <button class="search-form__clear" @click="clearSearch">条件クリア</button>
                        <button class="search-form__submit" @click="search">検索する</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 検索結果 -->
        <section class="result-section">
            <div class="result-section__inner">
                <div v-if="loading" class="result-section__loading">読み込み中...</div>

                <template v-else-if="searched">
                    <!-- 件数 -->
                    <div class="result-section__header">
                        <p class="result-section__count">
                            <span class="result-section__count-num">{{ totalCount }}</span>店舗
                        </p>

                        <!-- ページネーション上部 -->
                        <div class="pagination" v-if="totalPages > 1">
                            <button
                                class="pagination__btn"
                                :disabled="currentPage === 1"
                                @click="goToPage(1)"
                            >最初</button>
                            <button
                                class="pagination__btn"
                                :disabled="currentPage === 1"
                                @click="goToPage(currentPage - 1)"
                            >前へ</button>
                            <span
                                v-for="page in visiblePages"
                                :key="page"
                                class="pagination__page"
                                :class="{ 'pagination__page--active': page === currentPage }"
                                @click="goToPage(page)"
                            >{{ page }}</span>
                            <button
                                class="pagination__btn"
                                :disabled="currentPage === totalPages"
                                @click="goToPage(currentPage + 1)"
                            >次へ</button>
                            <button
                                class="pagination__btn"
                                :disabled="currentPage === totalPages"
                                @click="goToPage(totalPages)"
                            >最後</button>
                        </div>
                    </div>

                    <!-- ディーラー一覧 -->
                    <div v-if="dealers.length > 0" class="dealer-list__items">
                        <div
                            v-for="dealer in dealers"
                            :key="dealer.id"
                            class="dealer-card"
                            @click="goToDealer(dealer.id)"
                        >
                            <!-- 画像 -->
                            <div class="dealer-card__image">
                                <img
                                    v-if="dealer.imageUrl"
                                    :src="dealer.imageUrl"
                                    :alt="dealer.name"
                                />
                                <div v-else class="dealer-card__no-image">
                                    <p>NO IMAGE</p>
                                </div>
                            </div>

                            <!-- 情報 -->
                            <div class="dealer-card__info">
                                <h2 class="dealer-card__name">{{ dealer.name }}</h2>

                                <!-- 評価 -->
                                <div class="dealer-card__rating">
                                    <div class="dealer-card__stars">
                                        <span
                                            v-for="i in 5"
                                            :key="i"
                                            class="dealer-card__star"
                                            :class="i <= Math.round(dealer.reviewRating) ? 'dealer-card__star--filled' : ''"
                                        >★</span>
                                    </div>
                                    <span class="dealer-card__rating-score">{{ dealer.reviewRating ?? '-' }}</span>
                                    <span class="dealer-card__rating-count">口コミ{{ dealer.reviewCount }}件</span>
                                    <template v-if="dealer.ratingService">
                                        <span class="dealer-card__rating-sub">接客：{{ dealer.ratingService }}</span>
                                    </template>
                                    <template v-if="dealer.ratingAtmosphere">
                                        <span class="dealer-card__rating-sub">雰囲気：{{ dealer.ratingAtmosphere }}</span>
                                    </template>
                                    <template v-if="dealer.ratingAfter">
                                        <span class="dealer-card__rating-sub">アフター：{{ dealer.ratingAfter }}</span>
                                    </template>
                                    <template v-if="dealer.ratingQuality">
                                        <span class="dealer-card__rating-sub">品質：{{ dealer.ratingQuality }}</span>
                                    </template>
                                </div>

                                <!-- 詳細情報 -->
                                <div class="dealer-card__details">
                                    <div v-if="dealer.address" class="dealer-card__detail-row">
                                        <span class="dealer-card__detail-label">住所</span>
                                        <span class="dealer-card__detail-value">{{ dealer.address }}</span>
                                    </div>
                                    <div v-if="dealer.regularHolidayDays" class="dealer-card__detail-row">
                                        <span class="dealer-card__detail-label">定休日</span>
                                        <span class="dealer-card__detail-value">{{ dealer.regularHolidayDays }}</span>
                                    </div>
                                    <div v-if="dealer.businessHoursFrom && dealer.businessHoursTo" class="dealer-card__detail-row">
                                        <span class="dealer-card__detail-label">営業時間</span>
                                        <span class="dealer-card__detail-value">{{ dealer.businessHoursFrom }} 〜 {{ dealer.businessHoursTo }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 在庫台数 -->
                            <div class="dealer-card__stock">
                                <p class="dealer-card__stock-label">掲載台数</p>
                                <p class="dealer-card__stock-count">
                                    <span class="dealer-card__stock-num">{{ dealer.carCount }}</span>台
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="result-section__empty">
                        <p>該当する販売店が見つかりませんでした</p>
                    </div>

                    <!-- ページネーション下部 -->
                    <div class="pagination" v-if="totalPages > 1" style="margin-top: 32px;">
                        <button
                            class="pagination__btn"
                            :disabled="currentPage === 1"
                            @click="goToPage(1)"
                        >最初</button>
                        <button
                            class="pagination__btn"
                            :disabled="currentPage === 1"
                            @click="goToPage(currentPage - 1)"
                        >前へ</button>
                        <span
                            v-for="page in visiblePages"
                            :key="page"
                            class="pagination__page"
                            :class="{ 'pagination__page--active': page === currentPage }"
                            @click="goToPage(page)"
                        >{{ page }}</span>
                        <button
                            class="pagination__btn"
                            :disabled="currentPage === totalPages"
                            @click="goToPage(currentPage + 1)"
                        >次へ</button>
                        <button
                            class="pagination__btn"
                            :disabled="currentPage === totalPages"
                            @click="goToPage(totalPages)"
                        >最後</button>
                    </div>
                </template>

                <div v-else class="result-section__empty">
                    <p>エリアまたは都道府県を選択して検索してください</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route  = useRoute()

// マスタデータ
const areas   = ref([])
const regions = ref([])

// 検索条件
const selectedAreaId   = ref(null)
const selectedRegionId = ref(null)
const searchName       = ref('')

// 検索結果
const dealers     = ref([])
const totalCount  = ref(0)
const currentPage = ref(1)
const totalPages  = ref(0)
const loading     = ref(false)
const searched    = ref(false)

// エリアに連動した都道府県
const filteredRegions = computed(() => {
    if (!selectedAreaId.value) return []
    return regions.value.filter(r => r.area_code === selectedAreaId.value)
})

// ページネーションの表示ページ
const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, currentPage.value - 2)
    const end   = Math.min(totalPages.value, start + 4)
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

const onAreaChange = () => {
    selectedRegionId.value = null
}

const fetchMaster = async () => {
    try {
        const { data } = await axios.get('/api/regions/grouped')
        areas.value = data.data.areas.map(area => ({
            id:   area.id,
            name: area.name,
        }))
        regions.value = data.data.areas.flatMap(area =>
            area.regions.map(region => ({
                id:        region.id,
                name:      region.name,
                area_code: area.id,
            }))
        )
    } catch (e) {
        console.error(e)
    }
}

const fetchDealers = async (page = 1) => {
    loading.value = true
    try {
        const { data } = await axios.get('/api/SelectDealerList', {
            params: {
                areaId:   selectedAreaId.value,
                regionId: selectedRegionId.value,
                name:     searchName.value || null,
                page,
            }
        })
        dealers.value     = data.dealers
        totalCount.value  = data.totalCount
        currentPage.value = data.currentPage
        totalPages.value  = data.totalPages
        searched.value    = true

         // URLクエリを更新
        router.replace({
            query: {
                ...(selectedAreaId.value   && { areaId:   selectedAreaId.value }),
                ...(selectedRegionId.value && { regionId: selectedRegionId.value }),
                ...(searchName.value       && { name:     searchName.value }),
                ...(page > 1              && { page }),
            }
        })
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}


const search = () => fetchDealers(1)

const clearSearch = () => {
    selectedAreaId.value   = null
    selectedRegionId.value = null
    searchName.value       = ''
    dealers.value          = []
    totalCount.value       = 0
    searched.value         = false
    router.replace({ query: {} })
}

const goToPage = (page) => {
    currentPage.value = page
    fetchDealers(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToDealer = (id) => {
    router.push({ name: 'DealerDetail', params: { id } })
}

// URLクエリから状態を復元
const restoreFromQuery = () => {
    const { areaId, regionId, name, page } = route.query
    if (areaId)   selectedAreaId.value   = Number(areaId)
    if (regionId) selectedRegionId.value = Number(regionId)
    if (name)     searchName.value       = name
    if (areaId || regionId || name) {
        fetchDealers(page ? Number(page) : 1)
    }
}

onMounted(async () => {
    await fetchMaster()
    restoreFromQuery()
})
</script>

<style scoped>
.dealer-list {
    min-height: 100vh;
    background: #0a0a0a;
}

/* 検索フォーム */
.search-section {
    background: #111;
    border-bottom: 1px solid #222;
    padding: 40px 0;
}

.search-section__inner,
.result-section__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
}

.search-section__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    color: #fff;
    margin: 0 0 24px;
}

.search-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
}

.search-form__label {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #888;
    display: block;
    margin-bottom: 6px;
}

.search-form__select,
.search-form__input {
    width: 100%;
    height: 40px;
    padding: 0 12px;
    font-size: 13px;
    border: 1px solid #333;
    border-radius: 4px;
    background: #0a0a0a;
    color: #fff;
    outline: none;
    box-sizing: border-box;
}

.search-form__select:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.search-form__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.search-form__clear {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    background: transparent;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 10px 24px;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.search-form__clear:hover {
    border-color: #555;
    color: #ccc;
}

.search-form__submit {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #fff;
    background: #dc5078;
    border: none;
    border-radius: 4px;
    padding: 10px 32px;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.search-form__submit:hover {
    opacity: 0.8;
}

/* 検索結果 */
.result-section {
    padding: 40px 0;
}

.result-section__loading,
.result-section__empty {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    text-align: center;
    padding: 64px 0;
}

.result-section__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.result-section__count {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    color: #888;
    margin: 0;
}

.result-section__count-num {
    font-size: 32px;
    font-weight: 500;
    color: #fff;
    margin-right: 4px;
}

/* ディーラーカード */
.dealer-list__items {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.dealer-card {
    display: flex;
    gap: 0;
    border: 1px solid #222;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.dealer-card:hover {
    border-color: #444;
}

.dealer-card__image {
    width: 180px;
    min-width: 180px;
    height: 160px;
    overflow: hidden;
    background: #1a1a1a;
    flex-shrink: 0;
}

.dealer-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.dealer-card:hover .dealer-card__image img {
    transform: scale(1.03);
}

.dealer-card__no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dealer-card__no-image p {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #444;
    margin: 0;
}

.dealer-card__info {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.dealer-card__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 300;
    color: #fff;
    margin: 0;
}

.dealer-card__rating {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.dealer-card__stars {
    display: flex;
    gap: 2px;
}

.dealer-card__star {
    font-size: 16px;
    color: #333;
}

.dealer-card__star--filled {
    color: #f97316;
}

.dealer-card__rating-score {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #f97316;
}

.dealer-card__rating-count {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #666;
}

.dealer-card__rating-sub {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #666;
}

.dealer-card__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.dealer-card__detail-row {
    display: flex;
    gap: 12px;
    align-items: baseline;
}

.dealer-card__detail-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #666;
    min-width: 60px;
    flex-shrink: 0;
}

.dealer-card__detail-value {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #aaa;
}

/* 在庫台数 */
.dealer-card__stock {
    width: 140px;
    min-width: 140px;
    border-left: 1px solid #222;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    flex-shrink: 0;
}

.dealer-card__stock-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #666;
    margin: 0 0 8px;
}

.dealer-card__stock-count {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #888;
    margin: 0;
}

.dealer-card__stock-num {
    font-size: 32px;
    font-weight: 500;
    color: #fff;
    margin-right: 2px;
}

/* ページネーション */
.pagination {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pagination__btn {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #888;
    background: transparent;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 6px 12px;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.pagination__btn:hover:not(:disabled) {
    border-color: #555;
    color: #ccc;
}

.pagination__btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.pagination__page {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #888;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

.pagination__page:hover {
    background: #222;
    color: #fff;
}

.pagination__page--active {
    background: #dc5078;
    color: #fff;
}
</style>