<template>
  <div class="car-price-block">
    <!-- 支払総額・車両本体価格 横並び -->
    <div class="car-price-block__row">
      <div class="car-price-block__item">
        <span class="car-price-block__label">支払総額</span>
        <div class="car-price-block__value">
          <span class="car-price-block__price">{{ formatPrice(totalPrice ?? price) }}</span>
          <span class="car-price-block__unit"></span>
        </div>
      </div>

      <div class="car-price-block__divider"></div>

      <div class="car-price-block__item">
        <span class="car-price-block__label">車両本体価格</span>
        <div class="car-price-block__base-value">
          <span class="car-price-block__base-price">{{ formatPrice(price) }}</span>
          <span class="car-price-block__base-unit"></span>
        </div>
      </div>
    </div>

    <!-- ローン表示 -->
    <div v-if="loanMonthly" class="car-price-block__loan-row">
      <span class="car-price-block__loan-label">通常ローン価格</span>
      <span class="car-price-block__loan-monthly">月々 {{ loanMonthly.toLocaleString() }}円</span>
    </div>
  </div>
</template>

<script setup>
import { formatPrice} from '@/utils/format'
const props = defineProps({
  price:       { type: Number, required: true },
  totalPrice:  { type: Number, default: null },
  loanMonthly: { type: Number, default: null },
})

</script>

<style scoped>
.car-price-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.car-price-block__row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.car-price-block__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.car-price-block__label {
  font-size: 10px;
  color: #888;
}

.car-price-block__value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.car-price-block__price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px;
  font-weight: 400;
  color: #dc5078;
}

.car-price-block__unit {
  font-size: 14px;
  color: #dc5078;
}

.car-price-block__divider {
  width: 1px;
  height: 36px;
  background: #333;
}

.car-price-block__base-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.car-price-block__base-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 300;
  color: #fff;
}

.car-price-block__base-unit {
  font-size: 12px;
  color: #fff;
}

.car-price-block__loan-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.car-price-block__loan-label {
  font-size: 10px;
  color: #888;
  border: 1px solid #444;
  padding: 2px 6px;
  border-radius: 3px;
}

.car-price-block__loan-monthly {
  font-size: 13px;
  color: #ccc;
}
</style>