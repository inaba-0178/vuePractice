<template>
    <!-- 名前 -->
    <div class="inquiry-field">
        <label class="inquiry-field__label">
            お名前
            <span class="inquiry-field__required">名前orニックネームどちらか必須</span>
        </label>
        <input
            v-model="form.name"
            type="text"
            class="inquiry-input"
            :class="{ 'is-error': errors.name_or_nickname }"
            placeholder="例：山田 太郎"
        />
    </div>

    <!-- ニックネーム -->
    <div class="inquiry-field">
        <label class="inquiry-field__label">
            ニックネーム
            <span class="inquiry-field__required">名前orニックネームどちらか必須</span>
        </label>
        <input
            v-model="form.nickname"
            type="text"
            class="inquiry-input"
            :class="{ 'is-error': errors.name_or_nickname }"
            placeholder="例：カーマニア太郎"
        />
        <p v-if="errors.name_or_nickname" class="inquiry-field__error">{{ errors.name_or_nickname }}</p>
    </div>

    <!-- メールアドレス -->
    <div class="inquiry-field">
        <label class="inquiry-field__label">
            メールアドレス
            <span class="inquiry-field__required">メールor電話どちらか必須</span>
        </label>
        <input
            v-model="form.email"
            type="email"
            class="inquiry-input"
            :class="{ 'is-error': errors.contact }"
            placeholder="例：example@email.com"
        />
    </div>

    <!-- 電話番号 -->
    <div class="inquiry-field">
        <label class="inquiry-field__label">
            電話番号
            <span class="inquiry-field__required">メールor電話どちらか必須</span>
        </label>
        <input
            v-model="form.phone"
            type="tel"
            class="inquiry-input"
            :class="{ 'is-error': errors.contact }"
            placeholder="例：090-1234-5678"
        />
        <p v-if="errors.contact" class="inquiry-field__error">{{ errors.contact }}</p>
    </div>

    <!-- 郵便番号 -->
    <div class="inquiry-field">
        <label class="inquiry-field__label">
            郵便番号
            <span :class="required ? 'inquiry-field__required' : 'inquiry-field__optional'">
                {{ required ? '必須' : '任意' }}
            </span>
        </label>
        <input
            v-model="form.postal_code"
            type="text"
            class="inquiry-input"
            :class="{ 'is-error': errors.postal_code }"
            placeholder="例：1234567（ハイフンなし）"
            maxlength="7"
        />
        <p v-if="errors.postal_code" class="inquiry-field__error">{{ errors.postal_code }}</p>
    </div>

    <!-- 住所 -->
    <div class="inquiry-field">
        <label class="inquiry-field__label">
            住所
            <span class="inquiry-field__optional">任意</span>
        </label>
        <input
            v-model="form.address"
            type="text"
            class="inquiry-input"
            placeholder="例：東京都渋谷区1-1-1"
        />
    </div>
</template>

<script setup>
const props = defineProps({
    form:     { type: Object,  required: true },
    errors:   { type: Object,  required: true },
    required: { type: Boolean, default: true },
})

const emit = defineEmits(['update:form'])

const updateField = (field, value) => {
    emit('update:form', { ...props.form, [field]: value })
}
</script>
<style scoped>
.inquiry-field { display: flex; flex-direction: column; gap: 0.5rem; }
.inquiry-field__label {
    font-size: 0.8rem;
    color: #aaa;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}
.inquiry-field__required {
    font-size: 0.65rem;
    background: rgba(220, 80, 120, 0.15);
    color: #dc5078;
    padding: 1px 6px;
    border-radius: 3px;
}
.inquiry-field__optional {
    font-size: 0.65rem;
    background: rgba(255,255,255,0.05);
    color: #666;
    padding: 1px 6px;
    border-radius: 3px;
}
.inquiry-field__error {
    font-size: 0.75rem;
    color: #dc5078;
    margin: 0;
}
.inquiry-input {
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: #ccc;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
}
.inquiry-input:focus { border-color: #dc5078; }
.inquiry-input.is-error { border-color: #dc5078; }
</style>