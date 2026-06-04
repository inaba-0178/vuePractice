<template>
    <div class="maker-select-wrapper">
        <!-- ヘッダー -->
        <div class="maker-select-header">
            <h1 class="maker-select-title">メーカーから探す</h1>
            <p class="maker-select-sub">複数選択可・10メーカーまで</p>
        </div>

        <!-- ローディング -->
        <div v-if="loading" class="maker-select-loading">
            <p>読み込み中...</p>
        </div>

        <!-- メーカーグループ -->
        <div v-else class="maker-select-body">
            <div
                v-for="group in groups"
                :key="group.countryCode"
                :id="group.anchor"
                class="maker-select-group"
            >
                <div class="maker-select-group__head">
                    <span class="maker-select-group__flag">{{ group.flag }}</span>
                    <h2 class="maker-select-group__name">{{ group.label }}</h2>
                </div>
                <ul class="maker-select-list">
                    <li
                        v-for="maker in group.makers"
                        :key="maker.id"
                        class="maker-select-item"
                    >
                        <label
                            class="maker-select-label"
                            :class="{ 'maker-select-label--disabled': !selectedIds.includes(maker.id) && selectedIds.length >= 10 }"
                        >
                            <input
                                type="checkbox"
                                class="maker-select-checkbox"
                                :value="maker.id"
                                v-model="selectedIds"
                                :disabled="!selectedIds.includes(maker.id) && selectedIds.length >= 10"
                            />
                            <span class="maker-select-name">{{ maker.displayName }}</span>
                            <span class="maker-select-count">({{ maker.carCount.toLocaleString() }})</span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>

        <!-- フッター検索ボタン -->
        <div class="maker-select-footer">
            <p class="maker-select-selected">{{ selectedIds.length }}メーカー選択中</p>
            <button
                class="maker-select-btn"
                :disabled="selectedIds.length === 0"
                @click="handleSearch"
            >
                この条件で検索する
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route  = useRoute()

const groups      = ref([])
const selectedIds = ref([])
const loading     = ref(false)

const fetchGroups = async () => {
    loading.value = true
    try {
        const { data } = await axios.get('http://laravel11practice.local:81/api/Manufacturers/All')
        groups.value = data.data.groups
    } catch (error) {
        console.error('API Error:', error)
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    router.push({
        path: '/car/select-condition-list',
        query: { manufacturerIds: selectedIds.value.join(',') }
    })
}

// アンカースクロール
const scrollToAnchor = async () => {
    const hash = route.hash
    if (!hash) return
    await nextTick()
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
    await fetchGroups()
    scrollToAnchor()
})
</script>

<style scoped>
.maker-select-wrapper {
    min-height: 100vh;
    background: #0a0a0a;
    color: #fff;
    padding: 48px 80px 120px;
}

.maker-select-header {
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 1px solid #222;
}

.maker-select-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 300;
    letter-spacing: 0.1em;
    margin: 0 0 8px;
}

.maker-select-sub {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #666;
    margin: 0;
}

.maker-select-loading {
    display: flex;
    justify-content: center;
    padding: 80px 0;
    color: #666;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
}

.maker-select-group {
    margin-bottom: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid #222;
}

.maker-select-group__head {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.maker-select-group__flag {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 2px;
    padding: 2px 6px;
    letter-spacing: 0.05em;
}

.maker-select-group__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 0.1em;
    margin: 0;
    color: #dc5078;
}

.maker-select-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px 24px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.maker-select-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.maker-select-label--disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.maker-select-checkbox {
    width: 16px;
    height: 16px;
    accent-color: #dc5078;
    cursor: pointer;
    flex-shrink: 0;
}

.maker-select-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #ccc;
    letter-spacing: 0.05em;
}

.maker-select-count {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 300;
    color: #555;
    letter-spacing: 0.05em;
}

.maker-select-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 80px;
    background: rgba(10, 10, 10, 0.95);
    border-top: 1px solid #222;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
}

.maker-select-selected {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #666;
    margin: 0;
}

.maker-select-btn {
    padding: 14px 48px;
    background: #dc5078;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.maker-select-btn:hover {
    opacity: 0.8;
}

.maker-select-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
</style>