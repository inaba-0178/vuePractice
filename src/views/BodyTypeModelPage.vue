<template>
    <div class="bodytype-wrapper">
        <AppHeader />

        <main>
            <!-- ローディング -->
            <div v-if="loading" class="loading-overlay">
                <div class="spinner"></div>
                <p class="loading-text">読み込み中...</p>
            </div>

            <template v-else>
                <section class="hero">
                    <div class="hero__inner">
                        <p class="hero__label">BODY TYPE / CAR MODEL</p>
                        <h1 class="hero__title">{{ displayName || name }}</h1>
                        <p class="hero__sub">{{ displayName || name }}の中古車をメーカー別に検索できます</p>
                    </div>
                    <div class="hero__bg" :style="{ backgroundImage: 'url(/hero-bg.jpg)' }"></div>
                </section>

                <section class="search-section">
                    <div class="section-header">
                        <p class="section-label">CAR MODEL LIST</p>
                        <h2 class="section-title">
                            {{ displayName || name }}の車種
                            <span class="section-count">({{ carSeriesData.length }})</span>
                        </h2>
                    </div>

                    <!-- タブメニュー -->
                    <div class="tab-scroll">
                        <ul class="tab-list">
                            <li
                                v-for="group in manufacturerGroups"
                                :key="group.id"
                                class="tab-list__item"
                            >
                                <a
                                    :href="`#mfg-${group.id}`"
                                    class="tab-list__link"
                                >
                                    {{ group.displayName }}
                                    <span class="tab-list__count">({{ group.items.length }})</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- 車種一覧 -->
                    <div class="car-list">
                        <div
                            v-for="group in manufacturerGroups"
                            :key="'mfg-' + group.id"
                            class="car-group"
                        >
                            <div :id="`mfg-${group.id}`" class="car-group__header">
                                <h2 class="car-group__title">{{ group.displayName }}</h2>
                            </div>

                            <div
                                v-for="(chunk, chunkIndex) in chunkArray(group.items, ITEMS_PER_ROW)"
                                :key="`mfg-${group.id}-${chunkIndex}`"
                                class="car-group__row"
                            >
                                <div
                                    v-for="item in chunk"
                                    :key="item.seriesId"
                                    class="car-item"
                                >
                                    <a
                                        :data-id="`main_${item.seriesName}_nn`"
                                        :href="`/catalog/${item.seriesId}/${item.seriesName.toLowerCase()}/`"
                                        class="car-item__image-link"
                                    >
                                        <img
                                            class="car-item__image"
                                            :src="getCarImage(item.seriesId)"
                                            width="180"
                                            height="135"
                                            :alt="`${item.seriesName}の中古車`"
                                            loading="lazy"
                                            @error="handleImageError"
                                        >
                                    </a>
                                    <div class="car-item__body">
                                        <input
                                            type="checkbox"
                                            name="CARC[]"
                                            :id="`car${item.seriesId}_nn`"
                                            :value="item.seriesId"
                                            class="car-item__checkbox"
                                            tabindex="1"
                                        >
                                        <label
                                            :for="`car${item.seriesId}_nn`"
                                            class="car-item__label"
                                        >
                                            <a
                                                :data-id="`main_${item.seriesName}_nn`"
                                                href=""
                                                class="car-item__name"
                                            >
                                                {{ item.seriesName }}
                                                <span class="car-item__count">({{ item.manufacturerId }})</span>
                                            </a>
                                        </label>
                                        <a
                                            :href="`/catalog/${item.seriesId}/${item.seriesName.toLowerCase()}/`"
                                            class="car-item__catalog"
                                        >
                                            カタログ
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </template>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import '@/assets/components.css'
import AppHeader from '@/components/Common/AppHeader.vue'

const route = useRoute()
const name  = route.params.Name

const displayName       = ref('')
const bodyTypeData      = ref([])
const carSeriesData     = ref([])
const featuredBrandLists = ref([])
const loading           = ref(false)
const manufacturerGroups = ref([])
const ITEMS_PER_ROW     = ref(3)

const NO_IMAGE_URL    = ''
const imageErrorFlags = ref(new Set())

const fetchbodyTypeData = async () => {
    try {
        const { data } = await axios.get('http://laravel11practice.local:81/api/BodyTypeInfo', {
            params: { bodyTypeName: name },
        })
        const bodyTypeInfo = data.data.BodyTypeInfo
        bodyTypeData.value = Array.isArray(bodyTypeInfo)
            ? bodyTypeInfo.map(item => ({ name: item.name, code: item.code }))
            : bodyTypeInfo ? [{ name: bodyTypeInfo.name, code: bodyTypeInfo.code }] : []
        if (bodyTypeData.value.length > 0) {
            displayName.value = bodyTypeData.value[0].name
        }
    } catch (error) {
        console.error('BodyTypeInfo API Error:', error)
        bodyTypeData.value = []
    }
}

const fetchCarSeriesByBodyType = async () => {
    try {
        const { data } = await axios.get('http://laravel11practice.local:81/api/SelectBodyTypeLists', {
            params: { bodyTypeName: name },
            headers: {
                'Authorization': 'Bearer token',
                'Content-Type': 'application/json'
            },
        })
        carSeriesData.value = (data.data.BodyTypeCarList || []).map(car => ({
            seriesId:       car.seriesId,
            seriesName:     car.seriesName,
            manufacturerId: car.manufacturerId,
            imageFilePath:  car.imageFilePath || null
        }))
    } catch (error) {
        console.error('CarSeries API Error:', error)
        carSeriesData.value = []
    }
}

const getUniqueManufacturerIds = () => {
    return carSeriesData.value
        .map(car => car.manufacturerId)
        .filter(id => id != null && id !== '')
        .filter((id, index, self) => self.indexOf(id) === index)
}

const fetchManufacturersByIds = async (manufacturerIds) => {
    if (manufacturerIds.length === 0) return

    try {
        const numericIds = manufacturerIds.map(id => parseInt(id, 10)).filter(id => id > 0 && !isNaN(id))
        const params     = new URLSearchParams()
        numericIds.forEach(id => params.append('ManufacturerIds[]', id))

        const { data } = await axios.get('http://laravel11practice.local:81/api/Manufacturers', {
            params: params,
            headers: {
                'Authorization': 'Bearer token',
                'Content-Type': 'application/json'
            },
        })
        featuredBrandLists.value = (data.data?.ManufacturerList || []).map(manufacturer => ({
            id:           manufacturer.id,
            name:         manufacturer.name,
            displayName:  manufacturer.displayName,
            sortOrder:    manufacturer.sortOrder || 999,
            code:         manufacturer.code,
            imageFilePath: manufacturer.imageFilePath || NO_IMAGE_URL,
            imageAltText: manufacturer.displayName
        }))
        createManufacturerGroups()
    } catch (error) {
        console.error('Manufacturers API Error:', error.response?.data || error.message)
        featuredBrandLists.value = []
    }
}

const createManufacturerGroups = () => {
    const groups        = {}
    const manufacturerMap = {}

    featuredBrandLists.value.forEach(mfg => {
        manufacturerMap[mfg.id] = mfg.displayName || mfg.name || `メーカー${mfg.id}`
    })

    carSeriesData.value.forEach(car => {
        const mfgId = car.manufacturerId
        if (!groups[mfgId]) {
            const name = manufacturerMap[mfgId] || `メーカー${mfgId}`
            groups[mfgId] = {
                id:          mfgId,
                name:        name,
                displayName: name,
                items:       []
            }
        }
        groups[mfgId].items.push(car)
    })

    manufacturerGroups.value = Object.values(groups)
        .sort((a, b) => {
            const sortA = featuredBrandLists.value.find(m => m.id == a.id)?.sortOrder || 999
            const sortB = featuredBrandLists.value.find(m => m.id == b.id)?.sortOrder || 999
            return sortA - sortB
        })
        .filter(group => group.items.length > 0)
}

const chunkArray = (arr, size) => {
    const result = []
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
    }
    return result
}

const getCarImage = (seriesId) => {
    if (imageErrorFlags.value.has(seriesId)) return NO_IMAGE_URL
    const car = carSeriesData.value.find(c => c.seriesId === seriesId)
    if (car?.imageFilePath) return car.imageFilePath
    return NO_IMAGE_URL
}

const handleImageError = (event) => {
    if (event.target.src.includes('no-image.svg')) return
    const seriesId = event.target
        .closest('.car-item')
        ?.querySelector('input[name="CARC[]"]')?.value
    if (seriesId) {
        imageErrorFlags.value.add(parseInt(seriesId))
    }
    event.target.src = NO_IMAGE_URL
}

const initData = async () => {
    loading.value = true
    try {
        await fetchbodyTypeData()
        await fetchCarSeriesByBodyType()
        const manufacturerIds = getUniqueManufacturerIds()
        await fetchManufacturersByIds(manufacturerIds)
    } finally {
        loading.value = false
    }
}

onMounted(initData)
</script>
<style scoped>
.car-group__row {
    display: grid;
    grid-template-columns: repeat(v-bind(ITEMS_PER_ROW), 1fr);
    gap: 16px;
    margin-bottom: 16px;
}
</style>