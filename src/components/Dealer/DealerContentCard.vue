<template>
    <div class="content-grid">
        <div
            v-for="content in contents"
            :key="content.id"
            class="content-card"
            @click="openModal(content)"
        >
            <div class="content-card__image">
                <img
                    v-if="content.imageUrl"
                    :src="content.imageUrl"
                    :alt="content.title"
                />
                <div v-else class="content-card__no-image">
                    <p>NO IMAGE</p>
                </div>
            </div>
            <div class="content-card__body">
                <div
                    v-if="content.startedAt && content.endedAt"
                    class="content-card__period"
                >
                    {{ content.startedAt }} 〜 {{ content.endedAt }}
                </div>
                <p class="content-card__title">{{ content.title }}</p>
                <p class="content-card__description">{{ content.description }}</p>
            </div>
        </div>

        <div v-if="contents.length === 0" class="content-empty">
            <p>登録されていません</p>
        </div>
    </div>

    <!-- モーダル -->
    <Teleport to="body">
        <div
            v-if="selectedContent"
            class="modal-overlay"
            @click.self="closeModal"
        >
            <div class="modal">
                <div class="modal__image">
                    <img
                        v-if="selectedContent.imageUrl"
                        :src="selectedContent.imageUrl"
                        :alt="selectedContent.title"
                    />
                    <div v-else class="modal__no-image">
                        <p>NO IMAGE</p>
                    </div>
                </div>
                <div class="modal__body">
                    <div
                        v-if="selectedContent.startedAt && selectedContent.endedAt"
                        class="modal__period"
                    >
                        {{ selectedContent.startedAt }} 〜 {{ selectedContent.endedAt }}
                    </div>
                    <p class="modal__title">{{ selectedContent.title }}</p>
                    <p class="modal__description">{{ selectedContent.description }}</p>
                    <button class="modal__close" @click="closeModal">閉じる</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
    contents: { type: Array, required: true },
})

const selectedContent = ref(null)

const openModal  = (content) => selectedContent.value = content
const closeModal = () => selectedContent.value = null
</script>

<style scoped>
.content-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.content-card {
    background: #111;
    border: 1px solid #222;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.content-card:hover {
    border-color: #444;
}

.content-card__image {
    width: 100%;
    height: 160px;
    overflow: hidden;
    background: #1a1a1a;
}

.content-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.content-card:hover .content-card__image img {
    transform: scale(1.03);
}

.content-card__no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content-card__no-image p {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #444;
    margin: 0;
}

.content-card__body {
    padding: 14px;
}

.content-card__period {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #185FA5;
    background: #E6F1FB;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 8px;
}

.content-card__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    font-weight: 300;
    color: #fff;
    margin: 0 0 6px;
}

.content-card__description {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 300;
    color: #666;
    line-height: 1.6;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.content-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 64px 0;
}

.content-empty p {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    margin: 0;
}

/* モーダル */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
}

.modal {
    background: #111;
    border: 1px solid #222;
    border-radius: 12px;
    width: 100%;
    max-width: 480px;
    overflow: hidden;
}

.modal__image {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #1a1a1a;
}

.modal__image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #1a1a1a;
}

.modal__no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal__no-image p {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #444;
    margin: 0;
}

.modal__body {
    padding: 20px;
}

.modal__period {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #185FA5;
    background: #E6F1FB;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 10px;
}

.modal__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 300;
    color: #fff;
    margin: 0 0 12px;
}

.modal__description {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #888;
    line-height: 1.8;
    margin: 0 0 20px;
    white-space: pre-line;
}

.modal__close {
    width: 100%;
    padding: 10px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease;
}

.modal__close:hover {
    border-color: #dc5078;
    color: #dc5078;
}
</style>