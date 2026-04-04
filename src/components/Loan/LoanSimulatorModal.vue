<template>
  <div v-if="show" class="loan-simulator__overlay" @click.self="$emit('close')">
    <div class="loan-simulator__modal">

      <!-- ヘッダー -->
      <div class="loan-simulator__header">
        <h2 class="loan-simulator__title">ローンシミュレーター</h2>
        <button class="loan-simulator__close" @click="$emit('close')">×</button>
      </div>

      <div class="loan-simulator__body">

        <!-- ローン種類 -->
        <div class="loan-simulator__section" v-if="enableResidual">
          <h3 class="loan-simulator__section-title">ローン種類</h3>
          <div class="loan-simulator__radio-group">
            <label class="loan-simulator__radio">
              <input type="radio" v-model="loanType" value="standard" />
              <span>通常ローン</span>
            </label>
            <label class="loan-simulator__radio">
              <input type="radio" v-model="loanType" value="residual" />
              <span>残価設定ローン</span>
            </label>
          </div>
        </div>

        <!-- 借入額 -->
        <div class="loan-simulator__section">
          <h3 class="loan-simulator__section-title">借入額</h3>
          <div class="loan-simulator__slider-row">
            <span class="loan-simulator__label">物件価格</span>
            <div class="loan-simulator__input-wrap">
              <input type="number" v-model.number="principal" class="loan-simulator__input" />
              <span class="loan-simulator__unit">万円</span>
            </div>
            <input type="range" v-model.number="principal" :min="0" :max="priceInMan" class="loan-simulator__range" />
          </div>
        </div>

        <!-- 頭金 -->
        <div class="loan-simulator__section">
          <h3 class="loan-simulator__section-title">頭金</h3>
          <div class="loan-simulator__slider-row">
            <span class="loan-simulator__label">頭金</span>
            <div class="loan-simulator__input-wrap">
              <input type="number" v-model.number="downPayment" class="loan-simulator__input" />
              <span class="loan-simulator__unit">万円</span>
            </div>
            <input type="range" v-model.number="downPayment" :min="0" :max="principal" class="loan-simulator__range" />
          </div>
        </div>

        <!-- 残価（残価設定ローンのみ） -->
        <div class="loan-simulator__section" v-if="loanType === 'residual' && enableResidual">
          <h3 class="loan-simulator__section-title">残価</h3>
          <div class="loan-simulator__slider-row">
            <span class="loan-simulator__label">残価</span>
            <div class="loan-simulator__input-wrap">
              <input type="number" v-model.number="residualValue" class="loan-simulator__input" />
              <span class="loan-simulator__unit">万円</span>
            </div>
            <input type="range" v-model.number="residualValue" :min="0" :max="principal" class="loan-simulator__range" />
          </div>
        </div>

        <!-- 支払回数・金利・ボーナス -->
        <div class="loan-simulator__section">
          <h3 class="loan-simulator__section-title">支払回数・金利・ボーナス払い</h3>

          <div class="loan-simulator__slider-row">
            <span class="loan-simulator__label">支払回数</span>
            <div class="loan-simulator__input-wrap">
              <input type="number" v-model.number="months" class="loan-simulator__input" :min="minMonths" :max="maxMonths" />
              <span class="loan-simulator__unit">回</span>
            </div>
            <input type="range" v-model.number="months" :min="minMonths" :max="maxMonths" class="loan-simulator__range" />
          </div>
          <p class="loan-simulator__note">返済期間 {{ (months / MONTHS_PER_YEAR).toFixed(1) }} 年</p>

          <div class="loan-simulator__slider-row">
            <span class="loan-simulator__label">金利</span>
            <div class="loan-simulator__input-wrap">
              <input type="number" v-model.number="interestRate" class="loan-simulator__input" step="0.01" />
              <span class="loan-simulator__unit">%</span>
            </div>
            <input type="range" v-model.number="interestRate" min="0.1" max="20" step="0.01" class="loan-simulator__range" />
          </div>
          <p class="loan-simulator__note loan-simulator__note--warning">※金利は参考値です。実店舗での金利は異なる場合がありますのでご注意ください。</p>

          <div class="loan-simulator__slider-row">
            <span class="loan-simulator__label">ボーナス月加算額</span>
            <div class="loan-simulator__input-wrap">
              <input type="number" v-model.number="bonusAmount" class="loan-simulator__input" />
              <span class="loan-simulator__unit">万円/回</span>
            </div>
            <input type="range" v-model.number="bonusAmount" :min="0" :max="Math.floor(principal * 0.5)" class="loan-simulator__range" />
          </div>
          <p class="loan-simulator__note">※ボーナスは支払額の50%が上限です。</p>
        </div>

        <!-- シミュレーション結果 -->
        <div class="loan-simulator__result">
          <div class="loan-simulator__result-header">
            {{ loanType === 'standard' ? '通常ローン' : '残価設定ローン' }}・支払総額で計算
          </div>
          <div class="loan-simulator__result-body">
            <div class="loan-simulator__result-left">
              <span class="loan-simulator__result-label">月々の支払額</span>
              <span class="loan-simulator__result-amount">
                {{ (monthlyPayment / MAN_EN).toFixed(1) }}<em>万円</em>
              </span>
            </div>
            <div class="loan-simulator__result-right">
              <div class="loan-simulator__result-row">
                <span>割賦販売価格：</span>
                <span>{{ (totalPayment / MAN_EN).toFixed(1) }}万円</span>
              </div>
              <div class="loan-simulator__result-row">
                <span>利息分：</span>
                <span>{{ (interestTotal / MAN_EN).toFixed(1) }}万円</span>
              </div>
              <div class="loan-simulator__result-row">
                <span>支払回数：</span>
                <span>{{ months }}回</span>
              </div>
            </div>
          </div>
          <p class="loan-simulator__result-note">※シミュレーション結果は入力された条件で算出した概算金額となります。</p>
          <p class="loan-simulator__result-note">※詳しくは、各販売店までお問い合わせください。</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue'

    const props = defineProps({
    show:                { type: Boolean, default: false },
    price:               { type: Number, required: true },
    interestRateDefault: { type: Number, required: true },
    monthsOptions:       { type: Array, required: true },
    })

    defineEmits(['close'])

    // ローン計算定数
    const MONTHS_PER_YEAR = 12
    const MAN_EN          = 10000

    // 残価設定ローンの有効化フラグ（env管理）
    const enableResidual = ref(import.meta.env.VITE_ENABLE_RESIDUAL_LOAN === 'true')

    const loanType      = ref('standard')
    const downPayment   = ref(0)
    const residualValue = ref(0)
    const interestRate  = ref(props.interestRateDefault)
    const bonusAmount   = ref(0)

    const minMonths = computed(() => Math.min(...props.monthsOptions))
    const maxMonths = computed(() => Math.max(...props.monthsOptions))
    const priceInMan = computed(() => Math.floor(props.price / MAN_EN))

    // propsから直接計算して初期化
    const principal = ref(Math.floor(props.price / MAN_EN))
    const months    = ref(Math.max(...props.monthsOptions))

    // 月額計算
    const monthlyPayment = computed(() => {
    const residual = loanType.value === 'residual' ? residualValue.value : 0
    const p = (principal.value - downPayment.value - residual) * MAN_EN
    if (p <= 0 || months.value <= 0) return 0

    const r = interestRate.value / 100 / MONTHS_PER_YEAR
    let monthly = r === 0
        ? p / months.value
        : p * r * Math.pow(1 + r, months.value) / (Math.pow(1 + r, months.value) - 1)

    monthly -= (bonusAmount.value * MAN_EN * 2) / months.value

    return Math.ceil(Math.max(0, monthly))
    })

    const totalPayment  = computed(() => monthlyPayment.value * months.value + downPayment.value * MAN_EN)
    const interestTotal = computed(() => totalPayment.value - principal.value * MAN_EN)

    // propsのprice変更時に追従
    watch(() => props.price, (val) => {
    principal.value = Math.floor(val / MAN_EN)
    })

    // モーダルを開くたびに初期化
    watch(() => props.show, (val) => {
    if (val) {
        principal.value    = Math.floor(props.price / MAN_EN)
        months.value       = Math.max(...props.monthsOptions)
        interestRate.value = props.interestRateDefault
        downPayment.value  = 0
        residualValue.value = 0
        bonusAmount.value  = 0
        loanType.value     = 'standard'
    }
    })
</script>

<style scoped>
.loan-simulator__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.loan-simulator__modal {
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
}

.loan-simulator__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #1a1a1a;
  position: sticky;
  top: 0;
  background: #0d0d0d;
  z-index: 1;
}

.loan-simulator__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.1em;
  margin: 0;
}

.loan-simulator__close {
  background: transparent;
  border: 1px solid #333;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: #888;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.loan-simulator__close:hover { border-color: #dc5078; color: #dc5078; }

.loan-simulator__body { padding: 24px 28px; }

.loan-simulator__section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #1a1a1a;
}
.loan-simulator__section:last-child { border-bottom: none; }

.loan-simulator__section-title {
  font-size: 13px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.08em;
  margin: 0 0 16px;
}

.loan-simulator__radio-group {
  display: flex;
  gap: 24px;
}
.loan-simulator__radio {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #ccc;
  cursor: pointer;
}
.loan-simulator__radio input { accent-color: #dc5078; }

.loan-simulator__slider-row {
  display: grid;
  grid-template-columns: 140px 140px 1fr;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.loan-simulator__label { font-size: 13px; font-weight: 500; color: #ccc; }

.loan-simulator__input-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}
.loan-simulator__input {
  width: 90px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  text-align: right;
  outline: none;
}
.loan-simulator__input:focus { border-color: #dc5078; }
.loan-simulator__unit { font-size: 12px; color: #666; white-space: nowrap; }

.loan-simulator__range {
  width: 100%;
  accent-color: #dc5078;
  cursor: pointer;
}

.loan-simulator__note {
  font-size: 11px;
  color: #555;
  margin: 0 0 12px;
}
.loan-simulator__note--warning { color: #dc5078; }

/* 結果 */
.loan-simulator__result {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 20px 24px;
}
.loan-simulator__result-header {
  font-size: 12px;
  font-weight: 500;
  color: #dc5078;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}
.loan-simulator__result-body {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 16px;
}
.loan-simulator__result-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.loan-simulator__result-label { font-size: 11px; color: #666; }
.loan-simulator__result-amount {
  font-family: 'Cormorant Garamond', serif;
  font-size: 48px;
  font-weight: 400;
  color: #dc5078;
  line-height: 1;
}
.loan-simulator__result-amount em {
  font-style: normal;
  font-size: 16px;
  margin-left: 2px;
}
.loan-simulator__result-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.loan-simulator__result-row {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #aaa;
}
.loan-simulator__result-note {
  font-size: 11px;
  color: #555;
  margin: 4px 0 0;
}
</style>