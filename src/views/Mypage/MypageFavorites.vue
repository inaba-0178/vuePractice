<template>
  <div class="favorites-wrapper">
    <div class="favorites-header">
      <h1 class="favorites-title">お気に入り</h1>
    </div>

    <div v-if="loading" class="loading">読み込み中...</div>

    <template v-else>
      <div v-if="favorites.length === 0" class="favorites-empty">
        お気に入りに登録された車両はありません。
      </div>

      <div v-else class="favorites-list">
        <CarCard
          v-for="car in favorites"
          :key="car.id"
          :car="car"
          @click="goToDetail"
        >
          <template #actions>
            <button class="btn-remove" @click.stop="onClickRemove(car.id)">
              お気に入り解除
            </button>
          </template>
        </CarCard>
        
      </div>
    </template>

    <!-- モーダル　ループの外に移動 -->
    <ConfirmModal
      :show="showConfirmModal"
      :title="modalTitle"
      :message="modalMessage"
      :confirmLabel="isConfirming ? '解除する' : 'OK'"
      :cancelLabel="'キャンセル'"
      :showCancel="isConfirming"
      @confirm="isConfirming ? removeFavorite() : showConfirmModal = false"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ConfirmModal from '@/components/Common/Modals/ConfirmModal.vue'
import CarCard from '@/components/Common/CarCard.vue'
import Toast from '@/components/Common/Toasts/Toast.vue'

const router            = useRouter()
const favorites         = ref([])
const loading           = ref(true)
const showConfirmModal  = ref(false)
const showToast         = ref(false)
const selectedCarId     = ref(null)

const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL

const fetchFavorites = async () => {
  loading.value = true
  try {
    // お気に入りcar_id一覧取得
    const favRes = await axios.get('/api/Favorites')
    if (!favRes.data.success || favRes.data.favorites.length === 0) {
      favorites.value = []
      return
    }

    // car_idをまとめて車両情報取得
    const carIds = favRes.data.favorites.map(f => f.car_id).join(',')
    const carRes = await axios.get('/api/FavoriteCars', {
      params: { carIds }
    })

    if (carRes.data.success) {
      favorites.value = carRes.data.cars
      console.log(favorites.value);
  console.log('total_price sample:', favorites.value[0]?.total_price)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const modalTitle    = ref('お気に入りの解除')
const modalMessage  = ref('お気に入りを解除しますか？')
const isConfirming  = ref(true)

const onClickRemove = (carId) => {
  selectedCarId.value = carId
  modalTitle.value    = 'お気に入りの解除'
  modalMessage.value  = 'お気に入りを解除しますか？'
  isConfirming.value  = true
  showConfirmModal.value = true
}

const removeFavorite = async () => {
  try {
    const res = await axios.patch('/api/Favorites/toggle', null, {
      params: { carId: selectedCarId.value }
    })
    if (res.data.success && !res.data.is_favorite) {
      favorites.value = favorites.value.filter(f => f.id !== selectedCarId.value)
      modalTitle.value   = '解除完了'
      modalMessage.value = 'お気に入りを解除しました。'
      isConfirming.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    selectedCarId.value = null
  }
}

const goToDetail = (carId) => router.push({ path: `/cars/${carId}` })

const formatPrice         = (price) => price ? Math.floor(Number(price) / 10000) : '-'
const formatMileage       = (mileage) => mileage ? mileage.toLocaleString() : '-'
const formatRepairHistory = (val) => ({ none: 'なし', minor: '軽微あり', major: 'あり', unknown: '不明' }[val] ?? val ?? '-')

onMounted(() => {
    console.log('onMounted called')
    fetchFavorites()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.favorites-wrapper {
  min-height: calc(100vh - 96px);
}

.favorites-header {
  margin-bottom: 40px;
}

.favorites-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0;
}

.loading {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
}

.favorites-empty {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  color: #666;
  text-align: center;
  padding: 48px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  transition: border-color 0.2s ease;
}
.favorite-item:hover {
  border-color: #444;
}

.favorite-item__image {
  width: 220px;
  min-width: 220px;
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #2a2a2a;
  position: relative;
}
.favorite-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.favorite-item__no-image {
  font-size: 11px;
  color: #444;
  letter-spacing: 0.1em;
}
.favorite-item__tag-sold {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(100, 100, 100, 0.8);
  color: #ccc;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
}

.favorite-item__body {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.favorite-item__name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.05em;
}
.favorite-item__grade {
  font-size: 12px;
  color: #666;
}

.favorite-item__price-label {
  font-size: 10px;
  color: #888;
  margin-right: 4px;
}

.favorite-item__price-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.favorite-item__price-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.favorite-item__price-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.favorite-item__price-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.favorite-item__price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 400;
  color: #dc5078;
}

.favorite-item__price-unit {
  font-size: 14px;
  color: #dc5078;
}

.favorite-item__price-divider {
  width: 1px;
  height: 36px;
  background: #333;
}

.favorite-item__base-price-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.favorite-item__base-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 300;
  color: #fff;
}

.favorite-item__base-price-unit {
  font-size: 12px;
  color: #fff;
}

.favorite-item__base-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.favorite-item__base-price-label {
  font-size: 10px;
  color: #666;
}

.favorite-item__specs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  padding: 10px 0;
}
.favorite-item__spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.favorite-item__spec-label {
  font-size: 10px;
  color: #666;
}
.favorite-item__spec-value {
  font-size: 12px;
  font-weight: 500;
  color: #ccc;
}

.favorite-item__actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.favorite-item__btn-remove {
  padding: 8px 16px;
  border-radius: 3px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #444;
  background: transparent;
  color: #888;
  transition: all 0.15s;
}
.favorite-item__btn-remove:hover {
  border-color: #dc5078;
  color: #dc5078;
}

.favorite-item__btn-inquiry {
  padding: 8px 16px;
  border-radius: 3px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  cursor: pointer;
  border: none;
  background: #dc5078;
  color: #fff;
  transition: background 0.15s;
}
.favorite-item__btn-inquiry:hover {
  background: #c44068;
}
.favorite-item__loan-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.favorite-item__loan-label {
  font-size: 10px;
  color: #888;
  border: 1px solid #444;
  padding: 2px 6px;
  border-radius: 3px;
}

.favorite-item__loan-monthly {
  font-size: 13px;
  color: #ccc;
}
</style>