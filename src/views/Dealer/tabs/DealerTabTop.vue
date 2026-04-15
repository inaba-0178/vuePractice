<template>
    <div>
        <!-- 基本情報 -->
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">SHOP INFO</p>
                <h2 class="section-title">店舗情報</h2>
            </div>
            <div class="dealer-info">
                <table class="dealer-info__table">
                    <tbody>
                        <tr>
                            <th>住所</th>
                            <td>〒{{ dealer.postal_code }} {{ dealer.region }}{{ dealer.city }}{{ dealer.address_detail }}</td>
                        </tr>
                        <tr>
                            <th>電話番号</th>
                            <td>{{ dealer.phone ?? '-' }}</td>
                        </tr>
                        <tr>
                            <th>メール</th>
                            <td>{{ dealer.email ?? '-' }}</td>
                        </tr>
                        <tr>
                            <th>ホームページ</th>
                            <td>
                                <a :href="dealer.website_url" target="_blank" class="dealer-info__link" v-if="dealer.website_url">
                                    {{ dealer.website_url }}
                                </a>
                                <span v-else>-</span>
                            </td>
                        </tr>
                        <tr>
                            <th>営業時間</th>
                            <td>{{ dealer.business_hours_from }}〜{{ dealer.business_hours_to }}</td>
                        </tr>
                        <tr>
                            <th>定休日</th>
                            <td>{{ regularHolidayLabel }}</td>
                        </tr>
                        <tr>
                            <th>ディーラー種別</th>
                            <td>{{ dealerTypeLabel }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- インフォメーション -->
        <section class="tab-section" v-if="dealer.free_text">
            <div class="section-header">
                <p class="section-label">INFORMATION</p>
                <h2 class="section-title">お店からのインフォメーション</h2>
            </div>
            <div class="dealer-info-text">
                <p>{{ dealer.freeText }}</p>
            </div>
        </section>

        <!-- クチコミ評価 -->
        <section class="tab-section" v-if="dealer.reviewRating">
            <div class="section-header">
                <p class="section-label">REVIEW</p>
                <h2 class="section-title">クチコミ評価</h2>
            </div>
            <div class="dealer-rating">
                <div class="dealer-rating__total">
                    <span class="dealer-rating__label">クチコミ総合評価：</span>
                    <span class="dealer-rating__stars">
                        <span
                            v-for="i in 5"
                            :key="i"
                            class="dealer-rating__star"
                            :class="i <= Math.round(dealer.reviewRating) ? 'dealer-rating__star--filled' : ''"
                        >★</span>
                    </span>
                    <span class="dealer-rating__score">{{ dealer.reviewRating }}</span>
                    <span class="dealer-rating__label">点</span>
                    <span class="dealer-rating__count">（投稿数{{ dealer.reviewCount }}件）</span>
                </div>
                <div class="dealer-rating__detail">
                    <span>接客：<strong>-</strong></span>
                    <span>雰囲気：<strong>-</strong></span>
                    <span>アフター：<strong>-</strong></span>
                    <span>品質：<strong>-</strong></span>
                </div>
            </div>
        </section>

        <!-- ダイジェスト -->
        <section class="tab-section" v-if="digestImages.length > 0">
            <div class="section-header">
                <p class="section-label">DIGEST</p>
                <h2 class="section-title">お店紹介ダイジェスト</h2>
            </div>
            <div class="dealer-digest">
                <div
                    v-for="image in digestImages"
                    :key="image.id"
                    class="dealer-digest__item"
                >
                    <div class="dealer-digest__img">
                        <img :src="image.imageUrl" :alt="image.altText" />
                    </div>
                    <p class="dealer-digest__caption" v-if="image.caption">{{ image.caption }}</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    dealer:             { type: Object,  required: true },
    images:             { type: Array,   required: true },
    dealerTypeLabel:    { type: String,  required: true },
    regularHolidayLabel:{ type: String,  required: true },
})

const digestImages = computed(() => props.images.filter(img => !img.isMain))
</script>

<style scoped>
.tab-section {
    padding: 64px 40px;
    border-bottom: 1px solid #222;
}

.dealer-info {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 40px;
    align-items: start;
}

.dealer-info__table {
    width: 100%;
    border-collapse: collapse;
}

.dealer-info__table th,
.dealer-info__table td {
    padding: 14px 16px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    border-bottom: 1px solid #222;
    text-align: left;
    vertical-align: top;
}

.dealer-info__table th {
    color: #888;
    width: 120px;
    white-space: nowrap;
}

.dealer-info__table td {
    color: #ccc;
}

.dealer-info__link {
    color: #dc5078;
    text-decoration: none;
    transition: opacity 0.2s;
}

.dealer-info__link:hover {
    opacity: 0.7;
}

.dealer-rating {
    border: 1px solid #222;
    border-radius: 4px;
    padding: 24px;
    text-align: center;
}

.dealer-rating__label {
    font-family: 'Montserrat', sans-serif;
    font-size: 10px;
    font-weight: 400;
    color: #dc5078;
    letter-spacing: 0.1em;
    margin: 0 0 12px;
}

.dealer-rating__score {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 300;
    color: #fff;
    margin: 0 0 4px;
}

.dealer-rating__count {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 300;
    color: #666;
    margin: 0;
}

.dealer-info-text {
    border: 1px solid #222;
    border-radius: 4px;
    padding: 32px;
}

.dealer-info-text p {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #888;
    line-height: 2;
    margin: 0;
    white-space: pre-line;
}

.dealer-digest {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.dealer-digest__img {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: 4px;
    margin-bottom: 12px;
}

.dealer-digest__img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.dealer-digest__item:hover .dealer-digest__img img {
    transform: scale(1.03);
}

.dealer-digest__caption {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #fff;
    line-height: 1.7;
    margin: 0;
}

.dealer-rating {
    border: 1px solid #222;
    border-radius: 4px;
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.dealer-rating__total {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dealer-rating__label {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #888;
}

.dealer-rating__stars {
    display: flex;
    gap: 2px;
}

.dealer-rating__star {
    font-size: 20px;
    color: #333;
}

.dealer-rating__star--filled {
    color: #f97316;
}

.dealer-rating__score {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 300;
    color: #fff;
}

.dealer-rating__count {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #666;
}

.dealer-rating__detail {
    display: flex;
    gap: 24px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #888;
}

.dealer-rating__detail strong {
    color: #fff;
    font-weight: 400;
}
</style>