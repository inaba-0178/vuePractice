<template>
    <div>
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">REVIEW</p>
                <h2 class="section-title">お店のクチコミ</h2>
            </div>

            <div v-if="loading" class="review__loading">読み込み中...</div>

            <template v-else>
                <!-- 投稿ボタン -->
                <div class="review__header">
                    <p class="review__count">{{ totalCount }}件のクチコミ</p>
                    <button class="review__post-btn" @click="showForm = !showForm">
                        クチコミを投稿する
                    </button>
                </div>

                <!-- 投稿フォーム -->
                <div v-if="showForm" class="review__form-wrap">
                    <div class="review__form">
                        <p class="review__form-title">クチコミを投稿する</p>

                        <!-- ニックネーム -->
                        <div class="review__form-group">
                            <label class="review__form-label">ニックネーム <span class="review__required">必須</span></label>
                            <input
                                v-model="form.nickname"
                                type="text"
                                maxlength="20"
                                placeholder="例：ぐんまおじちゃん"
                                class="review__form-input"
                            />
                        </div>

                        <!-- 購入車種 -->
                        <div class="review__form-group">
                            <label class="review__form-label">購入車種</label>
                            <input
                                v-model="form.purchased_car"
                                type="text"
                                placeholder="例：トヨタ 86"
                                class="review__form-input"
                            />
                        </div>

                        <!-- 購入年月 -->
                        <div class="review__form-group">
                            <label class="review__form-label">購入年月</label>
                            <input
                                v-model="form.purchased_at"
                                type="text"
                                placeholder="例：2026/04"
                                class="review__form-input"
                            />
                        </div>

                        <!-- 総合評価 -->
                        <div class="review__form-group">
                            <label class="review__form-label">総合評価 <span class="review__required">必須</span></label>
                            <div class="review__stars">
                                <span
                                    v-for="i in 5"
                                    :key="i"
                                    class="review__star-select"
                                    :class="{ 'review__star-select--active': i <= form.rating }"
                                    @click="form.rating = i"
                                >★</span>
                            </div>
                        </div>

                        <!-- 各評価 -->
                        <div class="review__form-group">
                            <label class="review__form-label">接客</label>
                            <div class="review__stars">
                                <span
                                    v-for="i in 5"
                                    :key="i"
                                    class="review__star-select"
                                    :class="{ 'review__star-select--active': i <= form.rating_service }"
                                    @click="form.rating_service = i"
                                >★</span>
                                <span class="review__star-clear" @click="form.rating_service = 0">不明</span>
                            </div>
                        </div>

                        <div class="review__form-group">
                            <label class="review__form-label">雰囲気</label>
                            <div class="review__stars">
                                <span
                                    v-for="i in 5"
                                    :key="i"
                                    class="review__star-select"
                                    :class="{ 'review__star-select--active': i <= form.rating_atmosphere }"
                                    @click="form.rating_atmosphere = i"
                                >★</span>
                                <span class="review__star-clear" @click="form.rating_atmosphere = 0">不明</span>
                            </div>
                        </div>

                        <div class="review__form-group">
                            <label class="review__form-label">アフター</label>
                            <div class="review__stars">
                                <span
                                    v-for="i in 5"
                                    :key="i"
                                    class="review__star-select"
                                    :class="{ 'review__star-select--active': i <= form.rating_after }"
                                    @click="form.rating_after = i"
                                >★</span>
                                <span class="review__star-clear" @click="form.rating_after = 0">不明</span>
                            </div>
                        </div>

                        <div class="review__form-group">
                            <label class="review__form-label">品質</label>
                            <div class="review__stars">
                                <span
                                    v-for="i in 5"
                                    :key="i"
                                    class="review__star-select"
                                    :class="{ 'review__star-select--active': i <= form.rating_quality }"
                                    @click="form.rating_quality = i"
                                >★</span>
                                <span class="review__star-clear" @click="form.rating_quality = 0">不明</span>
                            </div>
                        </div>

                        <!-- コメント -->
                        <div class="review__form-group">
                            <label class="review__form-label">クチコミ本文 <span class="review__required">必須</span></label>
                            <textarea
                                v-model="form.comment"
                                maxlength="2000"
                                rows="6"
                                placeholder="クチコミを入力してください（2000文字以内）"
                                class="review__form-textarea"
                            ></textarea>
                            <p class="review__form-count">{{ form.comment.length }}/2000</p>
                        </div>

                        <!-- 非ログイン時のみ表示 -->
                        <template v-if="!isLoggedIn">
                            <div class="review__form-group">
                                <label class="review__form-label">氏名 <span class="review__required">必須</span></label>
                                <input
                                    v-model="form.guest_name"
                                    type="text"
                                    maxlength="20"
                                    placeholder="フルネームで入力してください"
                                    class="review__form-input"
                                />
                            </div>

                            <div class="review__form-group">
                                <label class="review__form-label">電話番号 <span class="review__required">必須</span></label>
                                <input
                                    v-model="form.guest_phone"
                                    type="tel"
                                    placeholder="例：0312349876"
                                    class="review__form-input"
                                />
                            </div>

                            <div class="review__form-group">
                                <label class="review__form-label">メールアドレス <span class="review__required">必須</span></label>
                                <input
                                    v-model="form.guest_email"
                                    type="email"
                                    class="review__form-input"
                                />
                            </div>
                        </template>

                        <p v-if="formError" class="review__form-error">{{ formError }}</p>

                        <div class="review__form-actions">
                            <button class="review__form-cancel" @click="showForm = false">キャンセル</button>
                            <button class="review__form-submit" @click="submitReview" :disabled="submitting">
                                {{ submitting ? '送信中...' : '投稿する' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- クチコミ一覧 -->
                <div v-if="reviews.length > 0" class="review__list">
                    <div v-for="review in reviews" :key="review.id" class="review__item">
                        <div class="review__item-header">
                            <div>
                                <div class="review__item-stars">
                                    <span
                                        v-for="i in 5"
                                        :key="i"
                                        class="review__star"
                                        :class="i <= review.rating ? 'review__star--filled' : ''"
                                    >★</span>
                                    <span class="review__item-rating">{{ review.rating }}点</span>
                                    <span v-if="review.ratingService" class="review__item-sub">接客：{{ review.ratingService }}</span>
                                    <span v-if="review.ratingAtmosphere" class="review__item-sub">雰囲気：{{ review.ratingAtmosphere }}</span>
                                    <span v-if="review.ratingAfter" class="review__item-sub">アフター：{{ review.ratingAfter }}</span>
                                    <span v-if="review.ratingQuality" class="review__item-sub">品質：{{ review.ratingQuality }}</span>
                                </div>
                                <p class="review__item-comment">{{ review.comment }}</p>
                                <div class="review__item-meta">
                                    <span v-if="review.nickname">{{ review.nickname }}さん</span>
                                    <span v-if="review.purchasedCar">{{ review.purchasedCar }}</span>
                                    <span v-if="review.purchasedAt">（{{ review.purchasedAt }}購入）</span>
                                </div>
                            </div>
                            <p class="review__item-date">{{ review.createdAt }}投稿</p>
                        </div>

                        <!-- 返信 -->
                        <div v-if="review.replies.length > 0" class="review__reply">
                            <div v-for="reply in review.replies" :key="reply.id">
                                <div class="review__reply-header">
                                    <span class="review__reply-label">販売店の返信</span>
                                    <span class="review__reply-date">{{ reply.createdAt }}</span>
                                </div>
                                <p class="review__reply-body">{{ reply.body }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="review__empty">
                    <p>クチコミはまだありません</p>
                </div>
            </template>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
    dealerId: { type: Number, required: true },
})

const reviews    = ref([])
const totalCount = ref(0)
const loading    = ref(false)
const showForm   = ref(false)
const submitting = ref(false)
const formError  = ref('')

// ログイン状態確認
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

const form = ref({
    nickname:          '',
    purchased_car:     '',
    purchased_at:      '',
    rating:            0,
    rating_service:    0,
    rating_atmosphere: 0,
    rating_after:      0,
    rating_quality:    0,
    comment:           '',
    guest_name:        '',
    guest_phone:       '',
    guest_email:       '',
})
const fetchReviews = async () => {
    loading.value = true
    try {
        const { data } = await axios.get('/api/SelectDealerReviewData', {
            params: { dealerId: props.dealerId }
        })
        reviews.value    = data.reviews
        totalCount.value = data.totalCount
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const validateForm = () => {
    if (!form.value.nickname) return 'ニックネームを入力してください'
    if (!form.value.rating) return '総合評価を選択してください'
    if (!form.value.comment) return 'クチコミ本文を入力してください'
    if (!isLoggedIn.value) {
        if (!form.value.guest_name) return '氏名を入力してください'
        if (!form.value.guest_phone) return '電話番号を入力してください'
        if (!form.value.guest_email) return 'メールアドレスを入力してください'
    }
    return ''
}

const submitReview = async () => {
    formError.value = validateForm()
    if (formError.value) return

    submitting.value = true
    try {
        await axios.post('/api/DealerReview/store', {
            dealer_id:         props.dealerId,
            nickname:          form.value.nickname,
            purchased_car:     form.value.purchased_car || null,
            purchased_at:      form.value.purchased_at || null,
            rating:            form.value.rating,
            rating_service:    form.value.rating_service || null,
            rating_atmosphere: form.value.rating_atmosphere || null,
            rating_after:      form.value.rating_after || null,
            rating_quality:    form.value.rating_quality || null,
            comment:           form.value.comment,
            guest_name:        !isLoggedIn.value ? form.value.guest_name : null,
            guest_phone:       !isLoggedIn.value ? form.value.guest_phone : null,
            guest_email:       !isLoggedIn.value ? form.value.guest_email : null,
        })

        showForm.value  = false
        formError.value = ''
        form.value = {
            nickname: '', purchased_car: '', purchased_at: '',
            rating: 0, rating_service: 0, rating_atmosphere: 0,
            rating_after: 0, rating_quality: 0, comment: '',
            guest_name: '', guest_phone: '', guest_email: '',
        }

        await fetchReviews()
    } catch (e) {
        formError.value = '投稿に失敗しました。もう一度お試しください。'
    } finally {
        submitting.value = false
    }
}

onMounted(() => fetchReviews())
</script>

<style scoped>
.tab-section {
    padding: 64px 40px;
}

.review__loading,
.review__empty {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    text-align: center;
    padding: 64px 0;
}

.review__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.review__count {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #888;
    margin: 0;
}

.review__post-btn {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #dc5078;
    background: transparent;
    border: 1px solid #dc5078;
    border-radius: 4px;
    padding: 8px 20px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

.review__post-btn:hover {
    background: #dc5078;
    color: #fff;
}

/* フォーム */
.review__form-wrap {
    margin-bottom: 40px;
}

.review__form {
    border: 1px solid #222;
    border-radius: 4px;
    padding: 32px;
}

.review__form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: #fff;
    margin: 0 0 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #222;
}

.review__form-group {
    margin-bottom: 20px;
}

.review__form-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #888;
    display: block;
    margin-bottom: 8px;
}

.review__required {
    color: #dc5078;
    font-size: 10px;
    margin-left: 4px;
}

.review__form-input {
    width: 100%;
    box-sizing: border-box;
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 10px 14px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #fff;
    outline: none;
    transition: border-color 0.2s ease;
}

.review__form-input:focus {
    border-color: #555;
}

.review__form-textarea {
    width: 100%;
    box-sizing: border-box;
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 10px 14px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #fff;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s ease;
}

.review__form-textarea:focus {
    border-color: #555;
}

.review__form-count {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #666;
    text-align: right;
    margin: 4px 0 0;
}

.review__stars {
    display: flex;
    align-items: center;
    gap: 4px;
}

.review__star-select {
    font-size: 24px;
    color: #333;
    cursor: pointer;
    transition: color 0.2s ease;
}

.review__star-select--active {
    color: #f97316;
}

.review__star-select:hover {
    color: #f97316;
}

.review__star-clear {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #666;
    cursor: pointer;
    margin-left: 8px;
    transition: color 0.2s ease;
}

.review__star-clear:hover {
    color: #ccc;
}

.review__form-error {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #dc5078;
    margin: 0 0 16px;
}

.review__form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #222;
}

.review__form-cancel {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #666;
    background: transparent;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 8px 20px;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.review__form-cancel:hover {
    border-color: #555;
    color: #ccc;
}

.review__form-submit {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #fff;
    background: #dc5078;
    border: none;
    border-radius: 4px;
    padding: 8px 20px;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.review__form-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* クチコミ一覧 */
.review__list {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.review__item {
    padding: 32px 0;
    border-bottom: 1px solid #222;
}

.review__item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.review__item-stars {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
    flex-wrap: wrap;
}

.review__star {
    font-size: 18px;
    color: #333;
}

.review__star--filled {
    color: #f97316;
}

.review__item-rating {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #f97316;
    margin-left: 4px;
}

.review__item-sub {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #666;
    margin-left: 8px;
}

.review__item-comment {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #ccc;
    line-height: 1.8;
    margin: 0 0 12px;
}

.review__item-meta {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #666;
    display: flex;
    gap: 8px;
}

.review__item-date {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #666;
    white-space: nowrap;
    margin: 0;
}

/* 返信 */
.review__reply {
    margin-top: 16px;
    padding: 16px 20px;
    border-left: 2px solid #333;
    background: #111;
    border-radius: 0 4px 4px 0;
}

.review__reply-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.review__reply-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #888;
    background: #222;
    padding: 2px 8px;
    border-radius: 2px;
}

.review__reply-date {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 300;
    color: #666;
}

.review__reply-body {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #888;
    line-height: 1.8;
    margin: 0;
}
</style>