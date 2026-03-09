<template>
    <div class="container landing-page">
        <header class="header-nav">
            <a href="#">中古車</a>
            <a href="#">輸入車</a>
            <a href="#">中古車販売店</a>
        </header>

        <main>
            <!-- ローディング表示 -->
            <div v-if="loading" class="loading-overlay">
                <div class="spinner"></div>
                <p>読み込み中...</p>
            </div>

            <template v-else>
                <section class="hero">
                    <h1>{{ displayName || name }}の車種一覧</h1>
                    <p>{{ displayName || name }}の中古車をメーカ別に検索できます</p>
                    <div class="hero-image" :style="{ backgroundImage: 'url(/hero-bg.jpg)' }"></div>
                </section>

                <section class="search-section">
                    <h3 class="title5">{{ displayName || name }}の車種一覧</h3>
                    <h2>{{ displayName || name }}の車種 ({{ carSeriesData.length }})</h2>
                </section>

                <section class="search-section">
                    <!-- タブメニュー（メーカー名別） -->
                    <div class="scrollBox">
                        <ul class="scrollBox__barTab">
                            <li 
                                v-for="group in manufacturerGroups" 
                                :key="group.id"
                                class="scrollBox__barTab__list"
                            >
                                <a :href="`#mfg-${group.id}`">
                                    {{ group.displayName }} ({{ group.items.length }})
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <br />
                    <!-- 車種一覧 -->
                    <div id="carNameList_LE" class="shashuList">
                        <!-- 各メーカーごとに表示 -->
                        <div v-for="group in manufacturerGroups" :key="'mfg-'+group.id">
                            <!-- セクションタイトル -->
                            <div :id="`mfg-${group.id}`" class="shashuList__categoryTitle js-shashuList_category">
                                <h2 class="title5">
                                    {{ group.displayName }}
                                </h2>
                            </div>

                            <!-- 3つずつグループ化して表示 -->
                            <div 
                                v-for="(chunk, chunkIndex) in chunkArray(group.items, 3)" 
                                :key="`mfg-${group.id}-${chunkIndex}`" 
                                class="shashuList__category"
                            >
                                <!-- 各車種アイテム -->
                                <div 
                                    v-for="item in chunk" 
                                    :key="item.seriesId"
                                    class="shashuList__category__item"
                                >
                                      <!-- 画像追加部分 -->
                                    <a :data-id="`main_${item.seriesName}_nn`" :href="`/catalog/${item.seriesId}/${item.seriesName.toLowerCase()}/`">
                                        <img 
                                            class="js-lazy" 
                                            :src="getCarImage(item.seriesId)"
                                            width="180" 
                                            height="135" 
                                            :alt="`${item.seriesName}の中古車`"
                                            @error="handleImageError"
                                            loading="lazy"
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
                                                ({{ item.manufacturerId }})
                                            </span>
                                        </a>
                                    </label>
                                    <p><a :href="`/catalog/${item.seriesId}/${item.seriesName.toLowerCase()}/`">カタログ</a></p>
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
import '@/assets/common.css'
import '@/assets/makerCar.css'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const name = route.params.Name

// 状態管理
const displayName = ref('')
const bodyTypeData = ref([])
const carSeriesData = ref([])
const featuredBrandLists = ref([])
const loading = ref(false)
const manufacturerGroups = ref([])

// ボディタイプAPI取得
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

// 車種API取得
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
            seriesId: car.seriesId,
            seriesName: car.seriesName,
            manufacturerId: car.manufacturerId,
            imageFilePath: car.imageFilePath || null  // ★ 画像パスも保存
        }))
        console.log('CarSeries loaded:', carSeriesData.value.length, 'items')
    } catch (error) {
        console.error('CarSeries API Error:', error)
        carSeriesData.value = []
    }
}

// 車種データからユニークなmanufacturerIdを取得
const getUniqueManufacturerIds = () => {
    const ids = carSeriesData.value
        .map(car => car.manufacturerId)
        .filter(id => id != null && id !== '') 
        .filter((id, index, self) => self.indexOf(id) === index)
    console.log('Unique manufacturer IDs:', ids)
    return ids
}

// 特定のManufacturerIdsでメーカー取得
const fetchManufacturersByIds = async (manufacturerIds) => {
    if (manufacturerIds.length === 0) {
        console.log('No manufacturer IDs to fetch')
        return
    }
    
    try {
        const numericIds = manufacturerIds.map(id => parseInt(id, 10)).filter(id => id > 0 && !isNaN(id))
        
        console.log('Sending IDs as array:', numericIds)
        
        const params = new URLSearchParams()
        numericIds.forEach(id => params.append('ManufacturerIds[]', id))
        
        console.log('Query string:', params.toString())
        
        const { data } = await axios.get('http://laravel11practice.local:81/api/Manufacturers', {
            params: params,
            headers: {
                'Authorization': 'Bearer token',
                'Content-Type': 'application/json'
            },
        })
        
        featuredBrandLists.value = (data.data?.ManufacturerList || []).map(manufacturer => ({
            id: manufacturer.id,
            name: manufacturer.name,
            displayName: manufacturer.displayName,
            position: 0,
            sortOrder: manufacturer.sortOrder || 999,
            code: manufacturer.code,
            imageFilePath: manufacturer.imageFilePath || NO_IMAGE_URL,
            imageAltText: manufacturer.displayName
        }))
        console.log('Manufacturers loaded:', featuredBrandLists.value.length, 'items')
        createManufacturerGroups()
        
    } catch (error) {
        console.error('Manufacturers API Error:', error.response?.data || error.message)
        featuredBrandLists.value = []
    }
}

// メーカー別グループ化関数
const createManufacturerGroups = () => {
    const groups = {}
    
    const manufacturerMap = {}
    featuredBrandLists.value.forEach(mfg => {
        manufacturerMap[mfg.id] = mfg.displayName || mfg.name || `メーカー${mfg.id}`
    })
    
    console.log('Manufacturer map:', manufacturerMap)
    
    carSeriesData.value.forEach(car => {
        const mfgId = car.manufacturerId
        
        if (!groups[mfgId]) {
            const displayName = manufacturerMap[mfgId] || `メーカー${mfgId}`
            console.log(`Group ${mfgId}: ${displayName}`)
            
            groups[mfgId] = {
                id: mfgId,
                name: displayName,
                displayName: displayName,
                image: '',
                items: []
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
    
    console.log('Final groups:', manufacturerGroups.value.map(g => ({ id: g.id, name: g.displayName, count: g.items.length })))
}

// 3つ分割
const chunkArray = (arr, size) => {
    const result = []
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
    }
    return result
}

// データ初期化
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

// ★ No Image用のデフォルト画像パス
const NO_IMAGE_URL = ''

// ★ 画像読み込み失敗フラグを管理
const imageErrorFlags = ref(new Set())

// ★ 車種画像取得関数（修正版）
const getCarImage = (seriesId) => {
    // 既にエラーが発生している場合は直接No Imageを返す
    if (imageErrorFlags.value.has(seriesId)) {
        return NO_IMAGE_URL
    }
    
    // 実際の画像パスを試す
    const car = carSeriesData.value.find(c => c.seriesId === seriesId)
    
    // APIから画像パスが返ってくる場合
    if (car?.imageFilePath) {
        return car.imageFilePath
    }
    
    // デフォルトの画像パス（存在しない可能性が高い）
    // return `/images/cars/${seriesId}.jpg`
    
    // ★ 画像がない場合は最初からNo Imageを表示
    return NO_IMAGE_URL
}

// ★ 画像読み込みエラー時の処理（修正版）
const handleImageError = (event) => {
    // 既にNo Imageを表示している場合は何もしない（無限ループ防止）
    if (event.target.src.includes('no-image.svg')) {
        return
    }
    
    // エラーフラグを立てる
    const seriesId = event.target.closest('.shashuList__category__item')
        ?.querySelector('input[name="CARC[]"]')?.value
    
    if (seriesId) {
        imageErrorFlags.value.add(parseInt(seriesId))
    }
    
    // No Image画像に切り替え
    event.target.src = NO_IMAGE_URL
}

onMounted(initData)
</script>

<style scoped>
/* ローディングスピナー */
.loading-overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    gap: 20px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* 画像のフェードイン効果（オプション） */
.js-lazy {
    opacity: 0;
    animation: fadeIn 0.3s ease-in forwards;
}

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</style>