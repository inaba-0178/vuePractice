<template>
    <div class="landing-wrapper">
        <AppHeader />

        <main>
            <!-- ヒーロー -->
            <section class="hero hero--tall">
                <div class="hero__inner">
                    <p class="hero__label">PREMIUM CAR SEARCH</p>
                    <h1 class="hero__title hero__title--large">ランディングページのタイトル</h1>
                    <p class="hero__sub">サイトの内容や情報を伝え、続きへ誘導したくさせるサブ説明文...</p>
                </div>
                <div class="hero__bg" :style="{ backgroundImage: 'url(/hero-bg.jpg)' }"></div>
            </section>

            <!-- メーカーから探す -->
            <section class="search-section">
                <div class="section-header">
                    <p class="section-label">SEARCH BY MAKER</p>
                    <h2 class="section-title">メーカーから探す</h2>
                </div>

                <div class="maker-nav">
                    <div class="maker-nav__block">
                        <div class="maker-nav__head">
                            <p class="maker-nav__head-title">国産<br>中古車</p>
                            <a href="" class="maker-nav__all">すべて見る</a>
                        </div>
                        <ul class="maker-nav__list">
                            <li v-for="brand in japaneseBrands" :key="brand.code" class="maker-nav__item">
                                <router-link
                                    :to="{ name: 'MakerCarModel', params: { manufacturerName: brand.name } }"
                                    :title="brand.name"
                                    class="maker-nav__anchor"
                                >
                                    <div class="maker-nav__frame">
                                        <i class="maker-nav__icon" :style="{ '--icon-image': `url(${brand.imageFilePath})` }"></i>
                                    </div>
                                    <p class="maker-nav__name">{{ brand.displayName }}</p>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <div class="maker-nav__block">
                        <div class="maker-nav__head">
                            <p class="maker-nav__head-title">輸入<br>中古車</p>
                            <a href="" class="maker-nav__all">すべて見る</a>
                        </div>
                        <ul class="maker-nav__list">
                            <li v-for="brand in abroadBrands" :key="brand.code" class="maker-nav__item">
                                <router-link
                                    :to="{ name: 'MakerCarModel', params: { manufacturerCode: brand.code, manufacturerName: brand.name } }"
                                    :title="brand.name"
                                    class="maker-nav__anchor"
                                >
                                    <div class="maker-nav__frame">
                                        <i class="maker-nav__icon" :style="{ '--icon-image': `url(${brand.imageFilePath})` }"></i>
                                    </div>
                                    <p class="maker-nav__name">{{ brand.displayName }}</p>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- ボディタイプから探す -->
            <section class="search-section">
                <div class="section-header">
                    <p class="section-label">SEARCH BY BODY TYPE</p>
                    <h2 class="section-title">ボディタイプから検索</h2>
                </div>
                <div class="body-type-wrap">
                    <ul class="body-type-list">
                        <li
                            v-for="brand in bodyTypesTop"
                            :key="brand.name"
                            class="body-type-item"
                            :style="{ backgroundImage: `url(${brand.imageFilePath})` }"
                        >
                            <router-link
                                :to="{ name: 'BodyTypeModel', params: { Name: brand.code } }"
                                class="body-type-link"
                            >
                                {{ brand.name }}
                            </router-link>
                        </li>
                    </ul>
                    <ul class="body-type-list">
                        <li
                            v-for="brand in bodyTypesBottom"
                            :key="brand.name"
                            class="body-type-item"
                            :style="{ backgroundImage: `url(${brand.imageFilePath})` }"
                        >
                            <router-link
                                :to="{ name: 'BodyTypeModel', params: { Name: brand.name } }"
                                class="body-type-link"
                            >
                                {{ brand.name }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </section>

            <!-- 都道府県から探す -->
            <section class="search-section">
                <div class="section-header">
                    <p class="section-label">SEARCH BY AREA</p>
                    <h2 class="section-title">都道府県から探す</h2>
                </div>
                <div class="area-wrap">
                    <div class="area-col">
                        <dl class="area-list" v-for="region in leftRegions" :key="region.name">
                            <dt class="area-list__region"><a href="">{{ region.name }}</a></dt>
                            <dd class="area-list__pref" v-for="pref in region.prefectures" :key="pref.name">
                                <a href="">{{ pref.name }}</a>
                            </dd>
                        </dl>
                    </div>
                    <div class="area-col">
                        <dl class="area-list" v-for="region in rightRegions" :key="region.name">
                            <dt class="area-list__region"><a href="">{{ region.name }}</a></dt>
                            <dd class="area-list__pref" v-for="pref in region.prefectures" :key="pref.name">
                                <a href="">{{ pref.name }}</a>
                            </dd>
                        </dl>
                    </div>
                </div>
            </section>

            <!-- こだわり条件から探す -->
            <section class="search-section">
                <div class="section-header">
                    <p class="section-label">SEARCH BY CONDITION</p>
                    <h2 class="section-title">こだわり条件から探す</h2>
                </div>
                <div class="choosy-wrap">
                    <div class="choosy-item">
                        <dl>
                            <dt class="choosy-item__title">価格から探す</dt>
                            <dd class="choosy-item__value" v-for="price in priceList" :key="price.name">
                                <a href="">{{ price.name }}</a>
                            </dd>
                        </dl>
                    </div>
                    <div class="choosy-item">
                        <dl>
                            <dt class="choosy-item__title">走行距離から探す</dt>
                            <dd class="choosy-item__value" v-for="mileage in mileageList" :key="mileage.name">
                                <a href="">{{ mileage.name }}</a>
                            </dd>
                        </dl>
                    </div>
                    <div class="choosy-item">
                        <dl>
                            <dt class="choosy-item__title">乗車定員から探す</dt>
                            <dd class="choosy-item__value" v-for="ridingCapacity in ridingCapacityList" :key="ridingCapacity.name">
                                <a href="">{{ ridingCapacity.name }}</a>
                            </dd>
                        </dl>
                    </div>
                    <div class="choosy-item">
                        <dl>
                            <dt class="choosy-item__title">排気量から探す</dt>
                            <dd class="choosy-item__value" v-for="displacement in displacementList" :key="displacement.name">
                                <a href="">{{ displacement.name }}</a>
                            </dd>
                        </dl>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
    import { ref, watch, onMounted, computed } from 'vue'
    import axios from 'axios'
    
    import { useRouter } from 'vue-router'
    import AppHeader from '@/components/Common/AppHeader.vue'

    
    const router = useRouter()

    const handleLogout = async () => {
        await auth.logout()
        router.push({ name: 'Landing' })
    }

    const regions = ref([])
    const loading = ref(false)

    const fetchRegions = async () => {
        loading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/regions/grouped')
            regions.value = data.data.areas.map(area => ({
                name: area.name.replace('地方', ''),
                url: "",
                prefectures: area.regions.map(region => ({
                    name: region.name,
                    url: region.query_param ? `/prefecture/${region.query_param}` : ""
                }))
            }))
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }

    const leftRegions  = computed(() => regions.value.slice(0, 5))
    const rightRegions = computed(() => regions.value.slice(5))
    fetchRegions()

    const priceLists          = ref([])
    const priceListLoading    = ref(false)
    const fetchPriceLists = async () => {
        priceListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/Prices')
            priceLists.value = data.data.PriceList.map(PriceList => ({
                name:         PriceList.name,
                max_amount:   PriceList.max_amount,
                is_unlimited: PriceList.is_unlimited,
            }))
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const priceList = computed(() => priceLists.value)
    fetchPriceLists()

    const mileageLists       = ref([])
    const mileageListLoading = ref(false)
    const fetchmileageLists = async () => {
        mileageListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/Mileages')
            mileageLists.value = data.data.MileageList.map(MileageList => ({
                name:         MileageList.name,
                max_amount:   MileageList.max_amount,
                is_unlimited: MileageList.is_unlimited,
            }))
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const mileageList = computed(() => mileageLists.value)
    fetchmileageLists()

    const displacementLists       = ref([])
    const displacementListLoading = ref(false)
    const fetchdisplacementLists = async () => {
        displacementListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/Displacements')
            displacementLists.value = data.data.DisplacementList.map(DisplacementList => ({
                name:         DisplacementList.name,
                max_amount:   DisplacementList.max_amount,
                is_unlimited: DisplacementList.is_unlimited,
            }))
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const displacementList = computed(() => displacementLists.value)
    fetchdisplacementLists()

    const ridingCapacityLists       = ref([])
    const ridingCapacityListLoading = ref(false)
    const fetchRidingCapacityLists = async () => {
        ridingCapacityListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/RidingCapacities')
            ridingCapacityLists.value = data.data.RidingCapacityList.map(RidingCapacityList => ({
                name:         RidingCapacityList.name,
                max_amount:   RidingCapacityList.max_amount,
                is_unlimited: RidingCapacityList.is_unlimited,
            }))
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const ridingCapacityList = computed(() => ridingCapacityLists.value)
    fetchRidingCapacityLists()

    const featuredBrandLists       = ref([])
    const featuredBrandListLoading = ref(false)
    const fetchfeaturedBrandLists = async () => {
        featuredBrandListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/FeaturedBrands')
            featuredBrandLists.value = data.data.ManufacturerInfo.map(ManufacturerInfo => ({
                name:          ManufacturerInfo.name,
                displayName:   ManufacturerInfo.displayName,
                position:      ManufacturerInfo.position,
                code:          ManufacturerInfo.code,
                imageFilePath: ManufacturerInfo.manufacturerImageFilePath,
                imageAltText:  ManufacturerInfo.manufacturerImageAltText,
            }))
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const japaneseBrands = computed(() => featuredBrandLists.value.slice(0, 9))
    const abroadBrands   = computed(() => featuredBrandLists.value.slice(9))
    fetchfeaturedBrandLists()

    const featuredBodyTypeLists       = ref([])
    const featuredBodyTypeListLoading = ref(false)
    const fetchFeaturedBodyTypeLists = async () => {
        featuredBodyTypeListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/FeaturedBodyTypes')
            featuredBodyTypeLists.value = data.data.BodyTypeInfo.map(BodyTypeInfo => ({
                name:          BodyTypeInfo.name,
                position:      BodyTypeInfo.position,
                code:          BodyTypeInfo.code,
                imageFilePath: BodyTypeInfo.bodyTypeImageFilePath,
                imageAltText:  BodyTypeInfo.bodyTypeImageAltText,
            }))
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const bodyTypesTop = computed(() => featuredBodyTypeLists.value.slice(0, 8))
    const bodyTypesBottom = computed(() => featuredBodyTypeLists.value.slice(8))
    fetchFeaturedBodyTypeLists()
</script>

<style scoped>
/* メーカーナビ */
.maker-nav {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.maker-nav__block {
    border: 1px solid #222;
    border-radius: 4px;
    padding: 32px;
}

.maker-nav__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #222;
}

.maker-nav__head-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: #fff;
    letter-spacing: 0.1em;
    margin: 0;
    line-height: 1.4;
}

.maker-nav__all {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 400;
    color: #dc5078;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: opacity 0.2s ease;
}

.maker-nav__all:hover {
    opacity: 0.7;
}

.maker-nav__list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.maker-nav__item {
    flex: 0 0 calc(11.11% - 16px);
}

.maker-nav__anchor {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: opacity 0.2s ease;
}

.maker-nav__anchor:hover {
    opacity: 0.7;
}

.maker-nav__frame {
    width: 56px;
    height: 56px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.maker-nav__icon {
    display: block;
    width: 36px;
    height: 36px;
    background-image: var(--icon-image);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.maker-nav__name {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 300;
    color: #888;
    letter-spacing: 0.05em;
    margin: 0;
    text-align: center;
}

/* ボディタイプ */
.body-type-wrap {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.body-type-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.body-type-item {
    flex: 0 0 calc(12.5% - 12px);
    border: 1px solid #222;
    border-radius: 4px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
}

.body-type-link {
    display: block;
    padding: 24px 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 400;
    color: #fff;
    text-decoration: none;
    text-align: center;
    background: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.05em;
    transition: background 0.2s ease;
}

.body-type-link:hover {
    background: rgba(220, 80, 120, 0.4);
}

/* 都道府県 */
.area-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}

.area-col {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.area-list {
    margin: 0;
    padding: 0;
}

.area-list__region {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #dc5078;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
}

.area-list__region a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s ease;
}

.area-list__region a:hover {
    opacity: 0.7;
}

.area-list__pref {
    display: inline-block;
    margin: 2px 4px 2px 0;
}

.area-list__pref a {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 300;
    color: #666;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
}

.area-list__pref a:hover {
    color: #ccc;
}

/* こだわり条件 */
.choosy-wrap {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
}

.choosy-item {
    border: 1px solid #222;
    border-radius: 4px;
    padding: 24px;
}

.choosy-item__title {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #dc5078;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #222;
}

.choosy-item__value {
    margin: 0 0 8px;
}

.choosy-item__value a {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #666;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
}

.choosy-item__value a:hover {
    color: #dc5078;
}
</style>