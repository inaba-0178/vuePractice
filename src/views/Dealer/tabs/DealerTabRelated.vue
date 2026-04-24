<template>
    <div>
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">RELATED</p>
                <h2 class="section-title">系列店・提携店</h2>
            </div>

            <div v-if="loading" class="related__loading">読み込み中...</div>

            <template v-else>
                <div v-if="affiliatedStores.length > 0" class="related__list">
                    <div
                        v-for="store in affiliatedStores"
                        :key="store.id"
                        class="related__item"
                    >
                        <!-- 画像 -->
                        <div class="related__image">
                            <img
                                v-if="store.imageUrl"
                                :src="store.imageUrl"
                                :alt="store.name"
                            />
                            <div v-else class="related__no-image">
                                <p>NO IMAGE</p>
                            </div>
                        </div>

                        <!-- 情報 -->
                        <div class="related__info">
                            <div class="related__header">
                                <span
                                    class="related__badge"
                                    :class="store.type === 'affiliated' ? 'related__badge--affiliated' : 'related__badge--partner'"
                                >{{ store.typeLabel }}</span>
                                <h3 class="related__name">{{ store.name }}</h3>
                            </div>

                            <div class="related__details">
                                <div v-if="store.address" class="related__detail-row">
                                    <span class="related__detail-label">住所</span>
                                    <span class="related__detail-value">{{ store.address }}</span>
                                </div>
                                <div v-if="store.phone" class="related__detail-row">
                                    <span class="related__detail-label">電話番号</span>
                                    <span class="related__detail-value">{{ store.phone }}</span>
                                </div>
                                <div v-if="store.businessHoursFrom && store.businessHoursTo" class="related__detail-row">
                                    <span class="related__detail-label">営業時間</span>
                                    <span class="related__detail-value">{{ store.businessHoursFrom }} 〜 {{ store.businessHoursTo }}</span>
                                </div>
                                <div v-if="store.regularHolidayDays" class="related__detail-row">
                                    <span class="related__detail-label">定休日</span>
                                    <span class="related__detail-value">{{ store.regularHolidayDays }}</span>
                                </div>
                            </div>

                            <div class="related__footer">
                                <router-link
                                    :to="{ name: 'DealerDetail', params: { id: store.dealerId } }"
                                    class="related__link"
                                >
                                    詳細を見る →
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="related__empty">
                    <p>系列店・提携店はありません</p>
                </div>
            </template>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
    dealerId: { type: Number, required: true },
})

const affiliatedStores = ref([])
const loading          = ref(false)

const fetchAffiliatedStores = async () => {
    loading.value = true
    try {
        const { data } = await axios.get('/api/SelectDealerAffiliatedData', {
            params: { dealerId: props.dealerId }
        })
        affiliatedStores.value = data.affiliatedStores
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchAffiliatedStores())
</script>

<style scoped>
.tab-section {
    padding: 64px 40px;
}

.related__loading,
.related__empty {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    text-align: center;
    padding: 64px 0;
}

.related__list {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.related__item {
    display: flex;
    gap: 24px;
    border: 1px solid #222;
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s ease;
}

.related__item:hover {
    border-color: #444;
}

.related__image {
    width: 200px;
    min-width: 200px;
    height: 150px;
    overflow: hidden;
    background: #1a1a1a;
    flex-shrink: 0;
}

.related__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.related__item:hover .related__image img {
    transform: scale(1.03);
}

.related__no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.related__no-image p {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #444;
    margin: 0;
}

.related__info {
    flex: 1;
    padding: 16px 20px 16px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.related__header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.related__badge {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    flex-shrink: 0;
}

.related__badge--affiliated {
    background: #1e3a5f;
    color: #93c5fd;
}

.related__badge--partner {
    background: #14532d;
    color: #86efac;
}

.related__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: #fff;
    margin: 0;
}

.related__details {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.related__detail-row {
    display: flex;
    gap: 16px;
    align-items: baseline;
}

.related__detail-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: #666;
    min-width: 60px;
    flex-shrink: 0;
}

.related__detail-value {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #ccc;
}

.related__footer {
    margin-top: auto;
}

.related__link {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #dc5078;
    text-decoration: none;
    transition: opacity 0.2s ease;
}

.related__link:hover {
    opacity: 0.7;
}
</style>