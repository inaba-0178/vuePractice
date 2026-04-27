<template>
    <div class="dealer-wrapper">

        <main v-if="loading">
            <div class="dealer-loading">
                <p>読み込み中...</p>
            </div>
        </main>

        <main v-else-if="dealer">
            <!-- ヒーロー：メイン画像 -->
            <section class="dealer-hero">
                <div class="dealer-hero__img" :style="{ backgroundImage: `url(${mainImage})` }"></div>
                <div class="dealer-hero__inner">
                    <p class="dealer-hero__label">DEALER INFORMATION</p>
                    <h1 class="dealer-hero__name">{{ dealer.name }}</h1>
                    <p class="dealer-hero__type">{{ dealerTypeLabel }}</p>
                </div>
            </section>

            <!-- タブナビ -->
            <nav class="dealer-tab">
                <ul class="dealer-tab__list">
                    <li
                        v-for="tab in tabs"
                        :key="tab.key"
                        class="dealer-tab__item"
                        :class="{ 'dealer-tab__item--active': activeTab === tab.key }"
                        @click="changeTab(tab.key)"
                    >
                        {{ tab.label }}
                    </li>
                </ul>
            </nav>

            <!-- タブコンテンツ -->
            <div class="dealer-content">
                <DealerTabTop
                    v-if="activeTab === 'top'"
                    :dealer="dealer"
                    :images="images"
                    :dealerTypeLabel="dealerTypeLabel"
                    :regularHolidayLabel="regularHolidayLabel"
                />
                <DealerTabAccess
                    v-else-if="activeTab === 'access'"
                    :dealer="dealer"
                />
                <DealerTabCars
                    v-else-if="activeTab === 'cars'"
                    :dealerId="dealerId"
                />
                <DealerTabStaff
                    v-else-if="activeTab === 'staff'"
                    :dealerId="dealerId"
                />
                <DealerTabService
                    v-else-if="activeTab === 'service'"
                    :dealerId="dealerId"
                />
                <DealerTabEvent
                    v-else-if="activeTab === 'event'"
                    :dealerId="dealerId"
                />
                <DealerTabWarranty
                    v-else-if="activeTab === 'warranty'"
                    :dealerId="dealerId"
                />
                <DealerTabReview
                    v-else-if="activeTab === 'review'"
                    :dealerId="dealerId"
                />
                <DealerTabRelated
                    v-else-if="activeTab === 'related'"
                    :dealerId="dealerId"
                />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import DealerTabTop      from '@/views/Dealer/tabs/DealerTabTop.vue'
import DealerTabAccess   from '@/views/Dealer/tabs/DealerTabAccess.vue'
import DealerTabCars     from '@/views/Dealer/tabs/DealerTabCars.vue'
import DealerTabStaff    from '@/views/Dealer/tabs/DealerTabStaff.vue'
import DealerTabService  from '@/views/Dealer/tabs/DealerTabService.vue'
import DealerTabEvent    from '@/views/Dealer/tabs/DealerTabEvent.vue'
import DealerTabWarranty from '@/views/Dealer/tabs/DealerTabWarranty.vue'
import DealerTabReview   from '@/views/Dealer/tabs/DealerTabReview.vue'
import DealerTabRelated  from '@/views/Dealer/tabs/DealerTabRelated.vue'

const route    = useRoute()
const router   = useRouter()
const dealerId = Number(route.params.id)

const activeTab = ref(route.query.tab || 'top')
const loading   = ref(false)
const dealer    = ref(null)
const images    = ref([])

const tabs = [
    { key: 'top',      label: 'お店TOP' },
    { key: 'access',   label: '地図＆アクセス' },
    { key: 'cars',     label: '在庫一覧' },
    { key: 'staff',    label: 'スタッフ紹介' },
    { key: 'service',  label: '各種サービス' },
    { key: 'event',    label: 'フェア＆イベント' },
    { key: 'warranty', label: '保証' },
    { key: 'review',   label: 'お店のクチコミ' },
    { key: 'related',  label: '系列店・提携店一覧' },
]

const fetchDealerInfo = async () => {
    loading.value = true
    try {
        const { data } = await axios.get('/api/SelectDealerInfoData', {
            params: { dealerId }
        })
        dealer.value = data.dealerData
        images.value = data.dealerImages
    } catch (error) {
        console.error('API Error:', error)
    } finally {
        loading.value = false
    }
}

const mainImage = computed(() => {
    const main = images.value.find(img => img.isMain)
    return main?.imageUrl ?? ''
})

const dealerTypeMap = {
    new_car:  '新車',
    used_car: '中古車',
    both:     '新車・中古車',
}

const dealerTypeLabel = computed(() => dealerTypeMap[dealer.value?.dealerType] ?? '')

const regularHolidayLabel = computed(() => {
    if (!dealer.value?.regularHolidayDays) return '-'
    const suffix = dealer.value.regularHolidayExceptHoliday ? '（祝日除く）' : ''
    return dealer.value.regularHolidayDays + suffix
})

// タブ切り替え時にURLを更新
const changeTab = (key) => {
    activeTab.value = key
    router.replace({
        query: { ...route.query, tab: key }
    })
}

onMounted(() => {
    fetchDealerInfo()
})
</script>

<style scoped>
.dealer-hero {
    position: relative;
    height: 420px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
}

.dealer-hero__img {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.5);
}

.dealer-hero__inner {
    position: relative;
    z-index: 1;
    padding: 40px;
}

.dealer-hero__label {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 400;
    color: #dc5078;
    letter-spacing: 0.2em;
    margin: 0 0 8px;
}

.dealer-hero__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px;
    font-weight: 300;
    color: #fff;
    letter-spacing: 0.05em;
    margin: 0 0 8px;
}

.dealer-hero__type {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #888;
    letter-spacing: 0.1em;
    margin: 0;
}

/* タブナビ */
.dealer-tab {
    border-bottom: 1px solid #222;
    position: sticky;
    top: 0;
    background: #0a0a0a;
    z-index: 10;
}

.dealer-tab__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0 40px;
    overflow-x: auto;
}

.dealer-tab__item {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: #666;
    letter-spacing: 0.1em;
    padding: 16px 20px;
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
}

.dealer-tab__item:hover {
    color: #ccc;
}

.dealer-tab__item--active {
    color: #dc5078;
    border-bottom-color: #dc5078;
}

.dealer-content {
    min-height: 60vh;
}

.dealer-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60vh;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
}
</style>