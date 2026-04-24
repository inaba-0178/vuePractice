<template>
    <div>
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">EVENT</p>
                <h2 class="section-title">フェア＆イベント</h2>
            </div>
            <div v-if="loading" class="loading">読み込み中...</div>
            <DealerContentCard v-else :contents="contents" />
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import DealerContentCard from '@/components/Dealer/DealerContentCard.vue'

const props    = defineProps({ dealerId: { type: Number, required: true } })
const contents = ref([])
const loading  = ref(false)

const fetchContents = async () => {
    loading.value = true
    try {
        const { data } = await axios.get('/api/SelectDealerContentData', {
            params: { dealerId: props.dealerId }
        })
        contents.value = data.contents.filter(c => c.category === 'event')
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchContents())
</script>

<style scoped>
.tab-section { padding: 64px 40px; }
.loading { font-family: 'Montserrat', sans-serif; font-size: 13px; color: #666; }
</style>