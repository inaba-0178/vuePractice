<template>
    <Teleport to="body">
        <div v-if="show" class="inquiry-overlay" @click.self="$emit('close')">
            <div class="inquiry-modal">

                <!-- ヘッダー -->
                <div class="inquiry-modal__header">
                    <h2 class="inquiry-modal__title">在庫確認・見積依頼</h2>
                    <button class="inquiry-modal__close" @click="$emit('close')">✕</button>
                </div>

                <!-- 送信完了 -->
                <div v-if="success" class="inquiry-modal__body">
                    <div class="inquiry-complete">
                        <p class="inquiry-complete__icon">✅</p>
                        <p class="inquiry-complete__title">送信が完了しました</p>
                        <p class="inquiry-complete__text">
                            お問い合わせありがとうございます。<br>
                            ディーラーより順次ご連絡いたします。
                        </p>
                        <button class="inquiry-btn inquiry-btn--primary" @click="$emit('close')">
                            閉じる
                        </button>
                    </div>
                </div>

                <!-- フォーム -->
                <div v-else class="inquiry-modal__body">

                    <!-- エラー表示 -->
                    <div v-if="error" class="inquiry-error">
                        {{ error }}
                    </div>

                    <!-- 問い合わせ種別 -->
                    <div class="inquiry-field">
                        <label class="inquiry-field__label">
                            お問い合わせ種別
                            <span class="inquiry-field__required">必須</span>
                        </label>
                        <div class="inquiry-type-grid">
                            <button
                                v-for="type in inquiryTypes"
                                :key="type.value"
                                class="inquiry-type-btn"
                                :class="{ 'is-active': form.inquiry_type === type.value }"
                                @click="form.inquiry_type = type.value"
                            >
                                {{ type.label }}
                            </button>
                        </div>
                        <p v-if="errors.inquiry_type" class="inquiry-field__error">{{ errors.inquiry_type }}</p>
                    </div>

                    <!-- 自由入力 -->
                    <div class="inquiry-field">
                        <label class="inquiry-field__label">
                            お問い合わせ内容
                            <span class="inquiry-field__optional">任意</span>
                        </label>
                        <textarea
                            v-model="form.message"
                            class="inquiry-textarea"
                            placeholder="ご質問・ご要望があればご記入ください"
                            rows="4"
                        ></textarea>
                    </div>

                    <!-- 未ログイン時：問い合わせ者情報 -->
                    <!-- 未ログイン時 -->
                    <template v-if="!isLoggedIn">
                        <div class="inquiry-divider">
                            <span>お客様情報をご入力ください</span>
                        </div>
                        <InquiryFormFields :form="form" :errors="errors" :required="true" />
                    </template>

                    <!-- ログイン済みの場合 -->
                    <div v-else>
                        <div class="inquiry-member-info">
                            <div class="inquiry-member-info__row">
                                <p class="inquiry-member-info__text">
                                    会員情報で送信します：{{ memberAuthStore.member?.name }}
                                </p>
                                <button
                                    class="inquiry-member-info__toggle"
                                    @click="useAlternateInfo = !useAlternateInfo"
                                >
                                    {{ useAlternateInfo ? '▲ 閉じる' : '別の情報で送信する ▼' }}
                                </button>
                            </div>
                        </div>

                        <!-- 別情報入力フォーム -->
                        <!-- ログイン済み別情報入力時 -->
                        <template v-if="useAlternateInfo">
                            <InquiryFormFields :form="form" :errors="errors" :required="false" />
                        </template>
                    </div>

                    <!-- 送信ボタン -->
                    <button
                        class="inquiry-btn inquiry-btn--primary"
                        :disabled="!canSubmit || loading"
                        @click="handleSubmit"
                    >
                        {{ loading ? '送信中...' : 'お問い合わせを送信する' }}
                    </button>
                </div>

            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMemberAuthStore } from '@/stores/memberAuth'
import { useInquiry } from '@/components/Inquiry/useInquiry'
import InquiryFormFields from '@/components/Inquiry/InquiryFormFields.vue'

const props = defineProps({
    show:     { type: Boolean, required: true },
    carId:    { type: Number,  required: true },
    dealerId: { type: Number,  required: true },
})

const emit = defineEmits(['close'])

const memberAuthStore  = useMemberAuthStore()
const isLoggedIn       = computed(() => memberAuthStore.isLoggedIn)
const useAlternateInfo = ref(false)

const { loading, error, success, submit, reset } = useInquiry()

const inquiryTypes = [
    { value: 'stock_check',     label: '在庫確認' },
    { value: 'estimate',        label: '見積依頼' },
    { value: 'condition_check', label: '車両状態確認' },
    { value: 'other',           label: 'その他' },
]

const initialForm = () => ({
    inquiry_type: '',
    message:      '',
    name:         '',
    nickname:     '',
    email:        '',
    phone:        '',
    postal_code:  '',
    address:      '',
})

const form   = ref(initialForm())
const errors = ref({})

/**
 * Vue側バリデーション
 * API送信前にフロントでチェックする（二重バリデーション）
 */
const validate = () => {
    const e = {}

    if (!form.value.inquiry_type) {
        e.inquiry_type = 'お問い合わせ種別を選択してください。'
    }

    if (!isLoggedIn.value) {
        // 名前またはニックネームどちらか必須
        if (!form.value.name.trim() && !form.value.nickname.trim()) {
            e.name_or_nickname = 'お名前またはニックネームのどちらかを入力してください。'
        }
        // 郵便番号必須
        if (!form.value.postal_code.trim()) {
            e.postal_code = '郵便番号を入力してください。'
        } else if (!/^\d{7}$/.test(form.value.postal_code.replace(/-/g, ''))) {
            e.postal_code = '郵便番号は7桁の数字で入力してください。'
        }
        // メールor電話どちらか必須
        if (!form.value.email.trim() && !form.value.phone.trim()) {
            e.contact = 'メールアドレスまたは電話番号のどちらかを入力してください。'
        }
    }

    errors.value = e
    return Object.keys(e).length === 0
}

/** 送信可能かどうかの判定 */
const canSubmit = computed(() => {
    if (!form.value.inquiry_type) return false

    if (!isLoggedIn.value) {
        // 名前またはニックネームどちらか必須
        if (!form.value.name.trim() && !form.value.nickname.trim()) return false
        // 郵便番号必須
        if (!form.value.postal_code.trim()) return false
        // メールor電話どちらか必須
        if (!form.value.email.trim() && !form.value.phone.trim()) return false
    }

    return true
})

/** 送信処理 */
const handleSubmit = async () => {
    // Vue側バリデーション
    if (!validate()) return

    const payload = {
        dealer_id:    props.dealerId,
        car_id:       props.carId,
        inquiry_type: form.value.inquiry_type,
        message:      form.value.message || null,
    }

    // 未ログイン または 別情報で送信する場合
    if (!isLoggedIn.value || useAlternateInfo.value) {
        payload.name        = form.value.name        || null
        payload.nickname    = form.value.nickname    || null
        payload.email       = form.value.email       || null
        payload.phone       = form.value.phone       || null
        payload.postal_code = form.value.postal_code || null
        payload.address     = form.value.address     || null
    }

    await submit(payload)
}

/** モーダルを閉じるときにフォームをリセット */
watch(() => props.show, (val) => {
    if (!val) {
        form.value             = initialForm()
        errors.value           = {}
        useAlternateInfo.value = false
        reset()
    }
})
</script>

<style scoped>
.inquiry-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.inquiry-modal {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    width: 90%;
    max-width: 520px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

/* ヘッダー */
.inquiry-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #2a2a2a;
    flex-shrink: 0;
}
.inquiry-modal__title {
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
    letter-spacing: 0.05em;
}
.inquiry-modal__close {
    background: none;
    border: none;
    color: #666;
    font-size: 1rem;
    cursor: pointer;
    padding: 4px;
    transition: color 0.15s;
}
.inquiry-modal__close:hover { color: #dc5078; }

/* ボディ */
.inquiry-modal__body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

/* エラー */
.inquiry-error {
    background: rgba(220, 80, 120, 0.1);
    border: 1px solid rgba(220, 80, 120, 0.3);
    border-radius: 6px;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: #dc5078;
}

/* フィールド */
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

/* 種別ボタン */
.inquiry-type-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}
.inquiry-type-btn {
    padding: 0.75rem;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    background: #111;
    color: #888;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
}
.inquiry-type-btn:hover     { border-color: #dc5078; color: #dc5078; }
.inquiry-type-btn.is-active {
    border-color: #dc5078;
    background: rgba(220, 80, 120, 0.1);
    color: #dc5078;
}

/* 入力フィールド */
.inquiry-input,
.inquiry-textarea {
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
.inquiry-input:focus,
.inquiry-textarea:focus  { border-color: #dc5078; }
.inquiry-input.is-error  { border-color: #dc5078; }
.inquiry-textarea         { resize: vertical; min-height: 100px; }

/* 区切り線 */
.inquiry-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #444;
    font-size: 0.75rem;
}
.inquiry-divider::before,
.inquiry-divider::after {
    content: '';
    flex: 1;
    border-top: 1px solid #2a2a2a;
}

/* 会員情報表示 */
.inquiry-member-info {
    background: rgba(255,255,255,0.03);
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 0.75rem 1rem;
}
.inquiry-member-info__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}
.inquiry-member-info__text {
    font-size: 0.8rem;
    color: #666;
    margin: 0;
}
.inquiry-member-info__toggle {
    background: none;
    border: 1px solid #444;
    border-radius: 4px;
    color: #888;
    font-size: 0.75rem;
    padding: 4px 8px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    flex-shrink: 0;
}
.inquiry-member-info__toggle:hover {
    border-color: #dc5078;
    color: #dc5078;
}

/* 送信ボタン */
.inquiry-btn {
    padding: 0.875rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    letter-spacing: 0.05em;
}
.inquiry-btn--primary {
    background: #dc5078;
    color: #fff;
}
.inquiry-btn--primary:hover    { background: #c44068; }
.inquiry-btn--primary:disabled {
    background: #333;
    color: #555;
    cursor: not-allowed;
}

/* 送信完了 */
.inquiry-complete {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
    text-align: center;
}
.inquiry-complete__icon  { font-size: 3rem; margin: 0; }
.inquiry-complete__title {
    font-size: 1.1rem;
    font-weight: 500;
    color: #fff;
    margin: 0;
}
.inquiry-complete__text {
    font-size: 0.875rem;
    color: #888;
    line-height: 1.7;
    margin: 0;
}
</style>