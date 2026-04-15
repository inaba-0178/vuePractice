<template>
    <div>
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">ACCESS</p>
                <h2 class="section-title">地図＆アクセス</h2>
            </div>
            <div class="dealer-access">
                <div class="dealer-access__map">
                    <iframe
                        v-if="dealer.latitude && dealer.longitude"
                        :src="`https://maps.google.com/maps?q=${dealer.latitude},${dealer.longitude}&z=15&output=embed`"
                        width="100%"
                        height="400"
                        style="border: none; border-radius: 4px;"
                        allowfullscreen
                        loading="lazy"
                    ></iframe>
                    <div v-else class="dealer-access__no-map">
                        <p>地図情報がありません</p>
                    </div>
                </div>
                <div class="dealer-access__info">
                    <table class="dealer-info__table">
                        <tbody>
                            <tr>
                                <th>住所</th>
                                <td>〒{{ dealer.postalCode }}<br>{{ dealer.region }}{{ dealer.city }}{{ dealer.address_detail }}</td>
                            </tr>
                            <tr>
                                <th>電話番号</th>
                                <td>{{ dealer.phone ?? '-' }}</td>
                            </tr>
                            <tr>
                                <th>営業時間</th>
                                <td>{{ dealer.businessHoursFrom }}〜{{ dealer.businessHoursTo }}</td>
                            </tr>
                            <tr>
                                <th>定休日</th>
                                <td>{{ regularHolidayLabel }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    dealer: { type: Object, required: true },
})

const regularHolidayLabel = computed(() => {
    if (!props.dealer.regularHolidayDays) return '-'
    const suffix = props.dealer.regularHolidayExceptHoliday ? '（祝日除く）' : ''
    return props.dealer.regularHolidayDays + suffix
})
</script>

<style scoped>
.tab-section {
    padding: 64px 40px;
}

.dealer-access {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 40px;
    align-items: start;
}

.dealer-access__no-map {
    height: 400px;
    background: #111;
    border: 1px solid #222;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dealer-access__no-map p {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
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
    width: 100px;
    white-space: nowrap;
}

.dealer-info__table td {
    color: #ccc;
}
</style>