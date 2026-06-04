<template>
  <div class="car-card" @click="$emit('click', car.id)">

    <div class="car-card__image">
      <span v-if="car.isNew" class="car-card__tag-new">新着</span>
      <button
        v-if="showFavoriteBtn"
        class="car-card__fav"
        :class="{ 'is-active': isFavorite }"
        @click.stop="$emit('toggle-favorite', car.id)"
      >
        {{ isFavorite ? '♥' : '♡' }}
      </button>
      <img v-if="car.mainImageUrl" :src="imageBaseUrl + car.mainImageUrl" :alt="`車両ID:${car.id}`" />
      <div v-else class="car-card__no-image">NO IMAGE</div>
      <span v-if="car.status === 'sold'" class="car-card__tag-sold">成約済み</span>
    </div>

    <div class="car-card__body">
      <div v-if="car.seriesName" class="car-card__name">{{ car.seriesName }}</div>

      <CarPriceBlock
        :price="Number(car.price)"
        :total-price="car.totalPrice ?? null"
        :loan-monthly="car.loanMonthly ?? null"
      />

      <div class="car-card__specs">
        <div class="car-card__spec">
          <span class="car-card__spec-label">年式</span>
          <span class="car-card__spec-value">{{ car.modelYear ? `${car.modelYear}年` : '-' }}</span>
        </div>
        <div class="car-card__spec">
          <span class="car-card__spec-label">走行距離</span>
          <span class="car-card__spec-value">{{ formatMileage(car.mileage) }}km</span>
        </div>
        <div class="car-card__spec">
          <span class="car-card__spec-label">修復歴</span>
          <span class="car-card__spec-value">{{ formatRepairHistory(car.repairHistory) }}</span>
        </div>
        <div class="car-card__spec">
          <span class="car-card__spec-label">車検</span>
          <span class="car-card__spec-value">{{ formatInspection(car.inspectionStatus, car.inspectionExpireDate) }}</span>
        </div>
        <div class="car-card__spec">
          <span class="car-card__spec-label">ミッション</span>
          <span class="car-card__spec-value">{{ car.transmission || '-' }}</span>
        </div>
        <div class="car-card__spec">
          <span class="car-card__spec-label">排気量</span>
          <span class="car-card__spec-value">{{ car.displacement ? `${car.displacement}cc` : '-' }}</span>
        </div>
        <div class="car-card__spec">
          <span class="car-card__spec-label">ボディタイプ</span>
          <span class="car-card__spec-value">{{ car.bodyTypeName || '-' }}</span>
        </div>
        <div class="car-card__spec">
          <span class="car-card__spec-label">色</span>
          <span class="car-card__spec-value">{{ car.color || '-' }}</span>
        </div>
      </div>

      <div class="car-card__bottom">
        <!-- ディーラー情報（一覧時のみ） -->
        <div v-if="car.dealerName" class="car-card__dealer">
          <span class="car-card__dealer-name">{{ car.dealerName }}</span>
          <div class="car-card__dealer-meta">
            <span class="car-card__dealer-region">{{ car.dealerCity }}</span>
            <div v-if="car.dealerRating" class="car-card__rating">
              <span class="car-card__rating-star">★</span>
              <span class="car-card__rating-val">{{ car.dealerRating }}</span>
              <span class="car-card__rating-count">（{{ car.dealerReviewCount }}件）</span>
            </div>
          </div>
        </div>

        <div class="car-card__actions">
          <!-- お気に入り解除ボタン（MyPage側からslotで渡す） -->
          <slot name="actions" />
          <button class="car-card__btn-inquiry" @click.stop="showInquiry = true">
            在庫確認・見積依頼
          </button>
        </div>
      </div>
    </div>
  </div>
  <InquiryModal
    :show="showInquiry"
    :car-id="Number(car.id)"
    :dealer-id="Number(car.dealerId)"
    @close="showInquiry = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import CarPriceBlock from '@/components/Common/CarPriceBlock.vue'
import InquiryModal from '@/components/Inquiry/InquiryModal.vue'

const props = defineProps({
  car:           { type: Object,  required: true },
  isFavorite:    { type: Boolean, default: false },
  showFavoriteBtn: { type: Boolean, default: false },
})

const emit = defineEmits(['click', 'toggle-favorite'])

const showInquiry = ref(false)

const imageBaseUrl        = import.meta.env.VITE_IMAGE_BASE_URL
const formatMileage       = (m) => m ? Number(m).toLocaleString() : '-'
const formatRepairHistory = (val) => ({ none: 'なし', minor: '軽微あり', major: 'あり', unknown: '不明' }[val] ?? val ?? '-')
const formatInspection    = (status, expireDate) => {
  if (status === 'none') return '車検なし'
  if (status === 'new_car') return '新車'
  if (expireDate) return expireDate
  return '車検整備付'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

.car-card {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
}
.car-card:hover {
  border-color: #444;
}

.car-card__image {
  width: 250px;
  min-width: 220px;
  height: 200px;        /* ← 高さ固定追加 */
  background: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #2a2a2a;
  position: relative;
  overflow: hidden;     /* ← 追加 */
}
.car-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.car-card__no-image {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #444;
  letter-spacing: 0.1em;
}

.car-card__tag-new {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(220, 80, 120, 0.15);
  color: #dc5078;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 3px;
  border: 1px solid rgba(220, 80, 120, 0.3);
}
.car-card__tag-sold {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(100, 100, 100, 0.8);
  color: #ccc;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 3px;
}

.car-card__fav {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: 1px solid #333;
  border-radius: 50%;
  background: #0d0d0d;
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}
.car-card__fav.is-active {
  background: rgba(220, 80, 120, 0.15);
  border-color: #dc5078;
  color: #dc5078;
}
.car-card__fav:hover {
  border-color: #dc5078;
  color: #dc5078;
}

.car-card__body {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.car-card__name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.05em;
}

.car-card__specs {
  display: grid;
  grid-template-columns: repeat(4, 160px);
  gap: 8px 16px;
  border-top: 1px solid #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  padding: 10px 0;
}
.car-card__spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.car-card__spec-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #888;
  letter-spacing: 0.08em;
}
.car-card__spec-value {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
  letter-spacing: 0.03em;
}

.car-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.car-card__dealer {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.car-card__dealer-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
}
.car-card__dealer-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
.car-card__dealer-region {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
}
.car-card__rating {
  display: flex;
  align-items: center;
  gap: 3px;
}
.car-card__rating-star {
  font-size: 12px;
  color: #f59e0b;
}
.car-card__rating-val {
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
}
.car-card__rating-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  color: #666;
}

.car-card__actions {
  display: flex;
  gap: 10px;
}

.car-card__btn-inquiry {
  padding: 8px 16px;
  border-radius: 3px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #dc5078;
  background: #dc5078;
  color: #fff;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.05em;
  transition: background 0.15s;
}
.car-card__btn-inquiry:hover {
  background: #c44068;
}
</style>