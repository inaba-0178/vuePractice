<template>
    <div class="histogram-slider">
        <div class="histogram-slider__wrap">
            <!-- ヒストグラム（背景） -->
            <div class="histogram-slider__graph">
            <div
                v-for="bucket in buckets"
                :key="bucket.range_start"
                class="histogram-slider__bar-wrap"
                :style="{
                position: 'absolute',
                left: `${(bucket.range_start / maxValue) * 100}%`,
                width: `${(step / maxValue) * 100}%`,
                }"
            >
                <div
                class="histogram-slider__bar"
                :class="{ 'is-active': isActive(bucket) }"
                :style="{ height: `${barHeight(bucket)}%` }"
                />
            </div>
            </div>

            <!-- スライダー -->
            <div class="histogram-slider__slider-wrap">
            <input
                type="range"
                class="histogram-slider__range histogram-slider__range--from"
                :min="0"
                :max="maxValue"
                :step="step"
                :value="from"
                @input="onFromInput"
            />
            <input
                type="range"
                class="histogram-slider__range histogram-slider__range--to"
                :min="0"
                :max="maxValue"
                :step="step"
                :value="to"
                @input="onToInput"
            />
            </div>
        </div>

        <!-- 表示ラベル -->
        <div class="histogram-slider__labels">
            <span class="histogram-slider__label">
            {{ from ? `${from}${unit}` : '下限なし' }}
            </span>
            <span class="histogram-slider__label">
            {{ to >= maxValue ? '上限なし' : `${to}${unit}` }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  buckets:  { type: Array,  required: true },
  maxValue: { type: Number, required: true },
  unit:     { type: String, required: true },
  from:     { type: Number, default: 0 },
  to:       { type: Number, default: 0 },
})

const emit = defineEmits(['update:from', 'update:to'])

// bucketsからstepを算出
const step = computed(() => {
  if (!props.buckets.length) return 1
  return props.buckets[0].range_end - props.buckets[0].range_start
})

// バーの高さを最大件数に対する割合で算出
const maxCount = computed(() => Math.max(...props.buckets.map(b => b.count)))

const barHeight = (bucket) => {
  if (maxCount.value === 0) return 0
  return (bucket.count / maxCount.value) * 100
}

// 選択範囲内かどうか
const isActive = (bucket) => {
  const from = props.from ?? 0
  const to   = props.to ?? props.maxValue
  return bucket.range_start >= from && bucket.range_end <= to
}

const onFromInput = (e) => {
  const val = Number(e.target.value)
  if (val >= props.to) return
  emit('update:from', val)
}

const onToInput = (e) => {
  const val = Number(e.target.value)
  if (val <= props.from) return
  emit('update:to', val)
}
</script>

<style scoped>
.histogram-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.histogram-slider__wrap {
  position: relative;
  height: 54px;
}

/* ヒストグラム */
.histogram-slider__graph {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  height: 40px;
}

.histogram-slider__bar-wrap {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.histogram-slider__bar {
  width: 100%;
  background: #3a3a3a;
  border-radius: 2px 2px 0 0;
  transition: background 0.15s;
  min-height: 2px;
}

.histogram-slider__bar.is-active {
  background: #888;
}

/* スライダー */
.histogram-slider__slider-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 24px;
  display: flex;
  align-items: center;
}

.histogram-slider__range {
  position: absolute;
  width: 100%;
  height: 4px;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
  pointer-events: none;
}

.histogram-slider__range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #dc5078;
  cursor: pointer;
  border: 2px solid #0d0d0d;
  pointer-events: all;
  box-shadow: 0 1px 4px rgba(0,0,0,0.4);
}

.histogram-slider__range--from { z-index: 2; }
.histogram-slider__range--to   { z-index: 1; }

/* ラベル */
.histogram-slider__labels {
  display: flex;
  justify-content: space-between;
}

.histogram-slider__label {
  font-size: 12px;
  font-weight: 300;
  color: #fff;
  white-space: nowrap;
}
</style>