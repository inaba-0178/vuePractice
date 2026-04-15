<template>
    <div>
        <section class="tab-section">
            <div class="section-header">
                <p class="section-label">COMING SOON</p>
                <h2 class="section-title">{{ title }}</h2>
            </div>
            <div class="placeholder">
                <p>準備中です</p>
            </div>
        </section>
    </div>
</template>

<script setup>
// タイトルだけ各ファイルで変更してください
// DealerTabStaff.vue   → 'スタッフ紹介'
// DealerTabService.vue → '各種サービス'
// DealerTabEvent.vue   → 'フェア＆イベント'
// DealerTabWarranty.vue→ '保証'
// DealerTabReview.vue  → 'お店のクチコミ'
// DealerTabRelated.vue → '系列店の一覧'

const title = 'スタッフ紹介'
</script>

<style scoped>
.tab-section {
    padding: 64px 40px;
}

.placeholder {
    border: 1px solid #222;
    border-radius: 4px;
    padding: 64px;
    text-align: center;
}

.placeholder p {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    margin: 0;
}
</style>