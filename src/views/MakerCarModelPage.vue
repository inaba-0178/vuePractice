<template>
    <div class="container landing-page">
        <header class="header-nav">
            <a href="#">中古車</a>
            <a href="#">輸入車</a>
            <a href="#">中古車販売店</a>
        </header>

        <main>
            <section class="hero">
                <h1>{{ manufacturerName }}のページ</h1>
                <p>サイトの内容や情報を伝え、続きへ誘導したくさせるサブ説明文...</p>
                <div class="hero-image" :style="{ backgroundImage: 'url(/hero-bg.jpg)' }"></div>
            </section>

            <section class="search-section">
                <h3 class="title5">メーカー・車名から中古車検索:車名一覧（{{ manufacturerName }}）</h3>
                <h2>{{ manufacturerName }}の中古車</h2>
            </section>

            <section class="search-section">
                <!-- タブメニュー -->
                <div class="scrollBox">
                    <ul class="scrollBox__barTab">
                        <li 
                            v-for="group in displayGroups" 
                            :key="group.key" 
                            class="scrollBox__barTab__list"
                        >
                            <a 
                                v-if="group.items.length > 0" 
                                :href="`#${group.key}`"
                            >
                                {{ group.label }}
                            </a>
                            <span v-else>{{ group.label }}</span>
                        </li>
                    </ul>
                </div>
                
                <br />
                <!-- 車種一覧 -->
                <div id="carNameList_LE" class="shashuList">
                    <!-- 各行ごとに表示 -->
                    <template v-for="groupData in displayGroups" :key="groupData.key">
                        <!-- データがある行だけ表示 -->
                        <div v-if="groupData.items.length > 0">
                            <!-- セクションタイトル -->
                            <div :id="groupData.key" class="shashuList__categoryTitle js-shashuList_category">
                                <h2 class="title5">{{ groupData.label }}</h2>
                            </div>

                            <!-- 3つずつグループ化して表示 -->
                            <div 
                                v-for="(chunk, chunkIndex) in chunkArray(groupData.items, 3)" 
                                :key="`${groupData.key}-${chunkIndex}`" 
                                class="shashuList__category"
                            >
                                <!-- 各車種アイテム -->
                                <div 
                                    v-for="item in chunk" 
                                    :key="item.seriesId" 
                                    class="shashuList__category__item"
                                >
                                    <a :data-id="`main_${item.seriesName}_nn`" href="">
                                        <img 
                                            class="js-lazy" 
                                            src="" 
                                            width="180" 
                                            height="135" 
                                            :alt="`${item.seriesName}の中古車`" 
                                            style="display: inline;"
                                        >
                                    </a>
                                    <input 
                                        type="checkbox" 
                                        name="CARC[]" 
                                        :id="`car${item.seriesId}_nn`" 
                                        :value="item.seriesId" 
                                        class="js-carcCheckbox" 
                                        tabindex="1"
                                    >
                                    <label :for="`car${item.seriesId}_nn`" class="label--checkbox">
                                        <a :data-id="`main_${item.seriesName}_nn`" href="">
                                            {{ item.seriesName }}
                                            <span class="subText">
                                                ({{ item.count || 0 }})
                                            </span>
                                        </a>
                                    </label>
                                    <p><a :href="`/catalog/${manufacturerName.toLowerCase()}/${item.seriesName.toLowerCase()}/`">カタログ</a></p>
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
import '@/assets/common.css'
import '@/assets/makerCar.css'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const manufacturerName = route.params.manufacturerName

// 車両一覧
const groupedByInitial = ref({})
const electManufacturerListLoading = ref(false)

const fetchEctManufacturerLists = async () => {
    electManufacturerListLoading.value = true
    try {
        const { data } = await axios.get('http://laravel11practice.local:81/api/SelectManufacturers', {
            params: {
                manufacturerName: manufacturerName,
                grouped: true  // グルーピングを要求
            },
            headers: {
                'Authorization': 'Bearer token',
                'Content-Type': 'application/json'
            },
        })
        
        // グルーピングデータを取得
        groupedByInitial.value = data.data.groupedByInitial || {}
        
        console.log('groupedByInitial loaded:', groupedByInitial.value)
    } catch (error) {
        console.error('API Error:', error)
        console.error('Error details:', error.response)
    } finally {
        electManufacturerListLoading.value = false
    }
}

// 3つずつチャンク化する関数
const chunkArray = (array, size) => {
    const result = []
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size))
    }
    return result
}

// 表示用のグループ定義（順序を保持）
const displayGroups = computed(() => {
    return [
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
    ]
})

onMounted(() => {
    fetchEctManufacturerLists()
})
</script>