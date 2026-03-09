<template>
    <div class="container landing-page">
        <header class="header-nav">
            <a href="#">中古車</a>
            <a href="#">輸入車</a>
            <a href="#">中古車販売店</a>
            <template v-if="auth.isLoggedIn">
                <router-link :to="{ name: 'chat' }">チャット</router-link>
                <a href="#" @click.prevent="handleLogout">ログアウト</a>
            </template>
            <template v-else>
                <router-link :to="{ name: 'login' }">ログイン</router-link>
            </template>
        </header>

        <main>
            <section class="hero">
                <h1>ランディングページのタイトル</h1>
                <p>サイトの内容や情報を伝え、続きへ誘導したくさせるサブ説明文...</p>
                <div class="hero-image" :style="{ backgroundImage: 'url(/hero-bg.jpg)' }"></div>
            </section>

            <section class="search-section">
                <h2 class="title3">中古車を探す</h2>
                <h3 class="title5">メーカーから探す</h3>

                <div class="makerNav">
                    <div class="makerNav__bar">
                        <div class="makerNav__head">
                            <a href="" class="makerNav__anchor makerNav__anchor--head">
                                <p class="makerNav__title">国産<br>中古車</p>
                                <div class="makerNav__all">
                                    <p class="makerNav__allText">すべて見る</p>
                                </div>
                            </a>
                        </div>

                        <ul class="makerNav__list">
                            <li v-for="brand in japaneseBrands" :key="brand.code" class="makerNav__item">
                                <!-- router-linkを使った方法 -->
                                <router-link 
                                    :to="{ 
                                        name: 'MakerCarModel', 
                                        params: { 
                                            manufacturerName: brand.name 
                                        } 
                                    }"
                                    :title="brand.name" 
                                    class="makerNav__anchor"
                                >
                                    <div class="makerNav__frame">
                                        <i class="makerNav__icon makerImg" :style="{ '--icon-image': `url(${brand.imageFilePath})` }"></i>
                                    </div>
                                    <p class="makerNav__name">{{ brand.displayName }}</p>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <div class="makerNav__bar">
                        <div class="makerNav__head">
                            <a href="" class="makerNav__anchor makerNav__anchor--head">
                                <p class="makerNav__title">輸入<br>中古車</p>
                                <div class="makerNav__all">
                                    <p class="makerNav__allText">すべて見る</p>
                                </div>
                            </a>
                        </div>

                        <ul class="makerNav__list">
                            <li v-for="brand in abroadBrands" :key="brand.code" class="makerNav__item">
                                <router-link 
                                    :to="{ 
                                        name: 'MakerCarModel', 
                                        params: { 
                                            manufacturerCode: brand.code,
                                            manufacturerName: brand.name 
                                        } 
                                    }"
                                    :title="brand.name" 
                                    class="makerNav__anchor"
                                >
                                    <div class="makerNav__frame">
                                        <i class="makerNav__icon makerImg" :style="{ '--icon-image': `url(${brand.imageFilePath})` }"></i>
                                    </div>
                                    <p class="makerNav__name">{{ brand.displayName }}</p>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="search-section">
                <h2>ボディタイプから検索</h2>
                <div class="searchPatternWrap">
                    <ul class="searchPatternWrap__item">
                        <li
                            v-for="brand in bodyTypes1"
                            :key="brand.name"
                            :style="{ backgroundImage: `url(${brand.iconImage})` }"
                        >
                            <router-link
                                :to="{
                                    name: 'BodyTypeModel',
                                    params: {
                                        Name: brand.code
                                    }
                                }"
                                class="shashuBodyType type_car"
                            >
                                {{ brand.name }}
                            </router-link>
                        </li>
                    </ul>

                    <ul class="searchPatternWrap__item">
                        <li
                            v-for="brand in bodyTypes2"
                            :key="brand.name"
                            :style="{ backgroundImage: `url(${brand.iconImage})` }"
                        >
                            <router-link
                                :to="{
                                    name: 'BodyTypeModel',
                                    params: {
                                        Name: brand.name
                                    }
                                }"
                                class="shashuBodyType type_car"
                            >
                                {{ brand.name }}
                            </router-link>
                        </li>
                    </ul>
                </div>
            </section>
            
            <div class="searchPattern__area">
                <section>
                    <br />
                    <h3 class="title5">都道府県から探す</h3>

                    <div class="searchPatternWrap searchPatternWrap--area">

                        <div class="searchArea">
                            <dl class="searchArea__list" v-for="region in leftRegions" :key="region.name">
                                    <dt>
                                        <a href="">{{region.name}}</a>
                                    </dt>
                                    <dd v-for="pref in region.prefectures">
                                        <a href="">{{pref.name}}</a>
                                    </dd>
                            </dl>
                        </div>

                        <div class="searchPatternArea">
                            <dl class="searchArea__list" v-for="region in rightRegions" :key="region.name">
                                    <dt>
                                        <a href="">{{region.name}}</a>
                                    </dt>
                                    <dd v-for="pref in region.prefectures">
                                        <a href="">{{pref.name}}</a>
                                    </dd>
                            </dl>
                        </div>
                    </div>
                </section>
            </div>

            <div class="searchPattern__choosy">
                <section>
                    <h3 class="title5">こだわり条件から探す</h3>

                    <ul class="searchPatternWrap searchPatternWrap--choosy">
                        <li class="searchPatternWrap__list">
                            <dl>
                                <dt>価格から探す</dt>
                                <dd  v-for="price in priceList">
                                    <a href="">{{ price.name }}</a>
                                </dd>
                            </dl>
                        </li>
                        <li class="searchPatternWrap__list">
                            <dl>
                                <dt>走行距離から探す</dt>
                                <dd  v-for="mileage in mileageList">
                                    <a href="">{{ mileage.name }}</a>
                                </dd>
                            </dl>
                        </li>
                        <li class="searchPatternWrap__list">
                            <dl>
                                <dt>乗車定員から探す</dt>
                                <dd  v-for="ridingCapacity in ridingCapacityList">
                                    <a href="">{{ ridingCapacity.name }}</a>
                                </dd>
                            </dl>
                        </li>
                        <li class="searchPatternWrap__list">
                            <dl>
                                <dt>排気量から探す</dt>
                                <dd  v-for="displacement in displacementList">
                                    <a href="">{{ displacement.name }}</a>
                                </dd>
                            </dl>
                        </li>
                    </ul>
                </section>
            </div>
            <section class="search-section">
                <div class="searchArea">
                    
                </div>
            </section>
            <!-- 他のセクションも同様 -->
        </main>
    </div>
</template>

<script setup>
    import '@/assets/common.css'
    import '@/assets/landingpage.css'

    import { ref, watch, onMounted, computed } from 'vue'
    import axios from 'axios'
    import { useAuthStore } from '@/stores/auth'
    import { useRouter } from 'vue-router'

    const auth   = useAuthStore()
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
            console.log('Regions loaded:', regions.value)
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }

    // 都道府県　左側
    const leftRegions = computed(() => regions.value.slice(0, 5))
    // 都道府県　右側
    const rightRegions = computed(() => regions.value.slice(5))
    fetchRegions()

    // 価格一覧
    const priceLists = ref([])
    const priceListLoading = ref(false)

    const fetchPriceLists = async () => {
        priceListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/Prices')
            priceLists.value = data.data.PriceList.map(PriceList => ({
                name: PriceList.name,
                max_amount: PriceList.max_amount,
                is_unlimited: PriceList.is_unlimited,
            }))
            console.log('PriceList loaded:', PriceLists.value)
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }

    const priceList = computed(() => priceLists.value)
    fetchPriceLists()
    
    //走行距離一覧
    const mileageLists = ref([])
    const mileageListLoading = ref(false)

    const fetchmileageLists = async () => {
        mileageListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/Mileages')
            mileageLists.value = data.data.MileageList.map(MileageList => ({
                name: MileageList.name,
                max_amount: MileageList.max_amount,
                is_unlimited: MileageList.is_unlimited,
            }))
            console.log('MileageList loaded:', MileageLists.value)
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const mileageList = computed(() => mileageLists.value)
    fetchmileageLists()

    //排気量一覧
    const displacementLists = ref([])
    const displacementListLoading = ref(false)

    const fetchdisplacementLists = async () => {
        displacementListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/Displacements')
            displacementLists.value = data.data.DisplacementList.map(DisplacementList => ({
                name: DisplacementList.name,
                max_amount: DisplacementList.max_amount,
                is_unlimited: DisplacementList.is_unlimited,
            }))
            console.log('DisplacementList loaded:', DisplacementLists.value)
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const displacementList = computed(() => displacementLists.value)
    fetchdisplacementLists()

    //乗車定員一覧
    const ridingCapacityLists = ref([])
    const ridingCapacityListLoading = ref(false)

    const fetchRidingCapacityLists = async () => {
        ridingCapacityListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/RidingCapacities')
            ridingCapacityLists.value = data.data.RidingCapacityList.map(RidingCapacityList => ({
                name: RidingCapacityList.name,
                max_amount: RidingCapacityList.max_amount,
                is_unlimited: RidingCapacityList.is_unlimited,
            }))
            console.log('RidingCapacityList loaded:', RidingCapacityLists.value)
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const ridingCapacityList = computed(() => ridingCapacityLists.value)
    fetchRidingCapacityLists()

    //メーカー情報一覧
    const featuredBrandLists = ref([])
    const featuredBrandListLoading = ref(false)

    const fetchfeaturedBrandLists = async () => {
        featuredBrandListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/FeaturedBrands')
            featuredBrandLists.value = data.data.ManufacturerInfo.map(ManufacturerInfo => ({
                name: ManufacturerInfo.name,
                displayName: ManufacturerInfo.displayName,
                position: ManufacturerInfo.position,
                code: ManufacturerInfo.code,
                imageFilePath: ManufacturerInfo.manufacturerImageFilePath,
                imageAltText: ManufacturerInfo.manufacturerImageAltText,
            }))
            console.log('featuredBrandList loaded:', featuredBrandLists.value)
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const featuredBrandList = computed(() => featuredBrandLists.value)
    // 国産中古車欄
    const japaneseBrands = computed(() => featuredBrandLists.value.slice(0, 9))
    // 輸入中古車欄
    const abroadBrands = computed(() => featuredBrandLists.value.slice(9))
    fetchfeaturedBrandLists()
    
    //ボディタイプ情報一覧
    const featuredBodyTypeLists = ref([])
    const featuredBodyTypeListLoading = ref(false)
    const fetchFeaturedBodyTypeLists = async () => {
        featuredBodyTypeListLoading.value = true
        try {
            const { data } = await axios.get('http://laravel11practice.local:81/api/FeaturedBodyTypes')
            featuredBodyTypeLists.value = data.data.BodyTypeInfo.map(BodyTypeInfo => ({
                name: BodyTypeInfo.name,
                position: BodyTypeInfo.position,
                code: BodyTypeInfo.code,
                imageFilePath: BodyTypeInfo.bodyTypeImageFilePath,
                imageAltText: BodyTypeInfo.bodyTypeImageAltText,
            }))
            console.log('featuredBodyTypeList loaded:', featuredBodyTypeLists.value)
        } catch (error) {
            console.error('API Error:', error)
        } finally {
            loading.value = false
        }
    }
    const featuredBodyTypeList = computed(() => featuredBodyTypeLists.value)
    // ボディタイプ上段
    const bodyTypes1 = computed(() => featuredBodyTypeLists.value.slice(0, 8))
    // ボディタイプ下段
    const bodyTypes2 = computed(() => featuredBodyTypeLists.value.slice(8))
    fetchFeaturedBodyTypeLists()

</script>
