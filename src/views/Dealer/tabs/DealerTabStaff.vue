<template>
    <div>
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">STAFF</p>
                <h2 class="section-title">スタッフ紹介</h2>
            </div>

            <div v-if="loading" class="staff__loading">
                読み込み中...
            </div>

            <template v-else>
                <div v-if="staffs.length > 0" class="staff__grid">
                    <div
                        v-for="staff in staffs"
                        :key="staff.id"
                        class="staff__card"
                    >
                        <div class="staff__image">
                            <img
                                v-if="staff.imageUrl"
                                :src="staff.imageUrl"
                                :alt="staff.name"
                            />
                            <div v-else class="staff__no-image">
                                <p>NO IMAGE</p>
                            </div>
                        </div>
                        <div class="staff__info">
                            <p class="staff__position" v-if="staff.position">{{ staff.position }}</p>
                            <p class="staff__name">{{ staff.name }}</p>
                            <p class="staff__comment" v-if="staff.comment">{{ staff.comment }}</p>
                        </div>
                    </div>
                </div>

                <div v-else class="staff__empty">
                    <p>スタッフ情報が登録されていません</p>
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

const staffs  = ref([])
const loading = ref(false)

const fetchStaffs = async () => {
    loading.value = true
    try {
        const { data } = await axios.get('/api/SelectDealerStaffData', {
            params: { dealerId: props.dealerId }
        })
        staffs.value = data.staffs
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchStaffs())
</script>

<style scoped>
.tab-section {
    padding: 64px 40px;
}

.staff__loading,
.staff__empty {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    text-align: center;
    padding: 64px 0;
}

.staff__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
}

.staff__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.staff__image {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #222;
}

.staff__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.staff__no-image {
    width: 100%;
    height: 100%;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
}

.staff__no-image p {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #444;
    margin: 0;
}

.staff__info {
    text-align: center;
}

.staff__position {
    font-family: 'Montserrat', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #dc5078;
    letter-spacing: 0.1em;
    margin: 0 0 6px;
}

.staff__name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: #fff;
    letter-spacing: 0.05em;
    margin: 0 0 10px;
}

.staff__comment {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #fff;
    line-height: 1.8;
    margin: 0;
}
</style>