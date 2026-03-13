<template>
    <div class="maker-wrapper">
        <AppHeader />

        <main>
            <section class="hero">
                <div class="hero__inner">
                    <p class="hero__label">MAKER / CAR MODEL</p>
                    <h1 class="hero__title">{{ manufacturerName }}</h1>
                    <p class="hero__sub">サイトの内容や情報を伝え、続きへ誘導したくさせるサブ説明文...</p>
                </div>
                <div class="hero__bg" :style="{ backgroundImage: 'url(/hero-bg.jpg)' }"></div>
            </section>

            <section class="search-section">
                <div class="section-header">
                    <p class="section-label">CAR MODEL LIST</p>
                    <h2 class="section-title">{{ manufacturerName }}の中古車</h2>
                </div>

                <div class="tab-scroll">
                    <ul class="tab-list">
                        <li
                            v-for="group in displayGroups"
                            :key="group.key"
                            class="tab-list__item"
                        >
                            <a
                                v-if="group.items.length > 0"
                                :href="`#${group.key}`"
                                class="tab-list__link tab-list__link--active"
                            >
                                {{ group.label }}
                            </a>
                            <span
                                v-else
                                class="tab-list__link tab-list__link--disabled"
                            >
                                {{ group.label }}
                            </span>
                        </li>
                    </ul>
                </div>

                <div class="car-list">
                    <template v-for="groupData in displayGroups" :key="groupData.key">
                        <div v-if="groupData.items.length > 0" class="car-group">
                            <div :id="groupData.key" class="car-group__header">
                                <h2 class="car-group__title">{{ groupData.label }}</h2>
                            </div>
                            <div
                                v-for="(chunk, chunkIndex) in chunkArray(groupData.items, ITEMS_PER_ROW)"
                                :key="`${groupData.key}-${chunkIndex}`"
                                class="car-group__row"
                            >
                                <div
                                    v-for="item in chunk"
                                    :key="item.seriesId"
                                    class="car-item"
                                >
                                    <a
                                        :data-id="`main_${item.seriesName}_nn`"
                                        href=""
                                        class="car-item__image-link"
                                    >
                                        <img
                                            class="car-item__image"
                                            src=""
                                            width="180"
                                            height="135"
                                            :alt="`${item.seriesName}の中古車`"
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
                                                <span class="car-item__count">({{ item.count || 0 }})</span>
                                            </a>
                                        </label>
                                        <a
                                            :href="`/catalog/${manufacturerName.toLowerCase()}/${item.seriesName.toLowerCase()}/`"
                                            class="car-item__catalog"
                                        >
                                            カタログ
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import '@/assets/components.css'
import AppHeader from '@/components/Common/AppHeader.vue'

const route            = useRoute()
const manufacturerName = route.params.manufacturerName
const ITEMS_PER_ROW = ref(3)

const groupedByInitial             = ref({})
const electManufacturerListLoading = ref(false)

const fetchEctManufacturerLists = async () => {
    electManufacturerListLoading.value = true
    try {
        const { data } = await axios.get('http://laravel11practice.local:81/api/SelectManufacturers', {
            params: {
                manufacturerName: manufacturerName,
                grouped: true
            },
            headers: {
                'Authorization': 'Bearer token',
                'Content-Type': 'application/json'
            },
        })
        groupedByInitial.value = data.data.groupedByInitial || {}
    } catch (error) {
        console.error('API Error:', error)
        console.error('Error details:', error.response)
    } finally {
        electManufacturerListLoading.value = false
    }
}

const chunkArray = (array, size) => {
    const result = []
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size))
    }
    return result
}

const displayGroups = computed(() => [
    { key: 'EN', label: '英数', items: groupedByInitial.value.EN || [] },
    { key: 'AA', label: 'ア行', items: groupedByInitial.value.AA || [] },
    { key: 'KA', label: 'カ行', items: groupedByInitial.value.KA || [] },
    { key: 'SA', label: 'サ行', items: groupedByInitial.value.SA || [] },
    { key: 'TA', label: 'タ行', items: groupedByInitial.value.TA || [] },
    { key: 'NA', label: 'ナ行', items: groupedByInitial.value.NA || [] },
    { key: 'HA', label: 'ハ行', items: groupedByInitial.value.HA || [] },
    { key: 'MA', label: 'マ行', items: groupedByInitial.value.MA || [] },
    { key: 'YA', label: 'ヤ行', items: groupedByInitial.value.YA || [] },
    { key: 'RA', label: 'ラ行', items: groupedByInitial.value.RA || [] },
    { key: 'WA', label: 'ワ行', items: groupedByInitial.value.WA || [] },
])

onMounted(() => {
    fetchEctManufacturerLists()
})
</script>

<style scoped>
.car-group__row {
    display: grid;
    grid-template-columns: repeat(v-bind(ITEMS_PER_ROW), 1fr);
    gap: 16px;
    margin-bottom: 16px;
}
</style>