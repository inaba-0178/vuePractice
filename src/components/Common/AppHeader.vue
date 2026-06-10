<template>
    <header class="header-nav">
        <div class="header-nav__logo">AUTO SEARCH</div>
        <nav class="header-nav__links">
            <router-link :to="{ name: 'Landing' }" class="nav-link">中古車</router-link>
            <router-link :to="{ name: 'DealerList' }" class="nav-link">中古車販売店</router-link>

            <template v-if="memberAuth.isLoggedIn">
                <router-link :to="{ name: 'chat' }" class="nav-link">チャット</router-link>

                <!-- ベル通知 -->
                <div class="nav-bell" @click.stop="toggleBell" ref="bellRef">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <span v-if="notifications.total > 0" class="nav-bell__badge">
                        {{ notifications.total > 99 ? '99+' : notifications.total }}
                    </span>

                    <!-- ドロップダウン -->
                    <div v-if="showBell" class="nav-bell__dropdown">
                        <p class="nav-bell__dropdown-title">通知</p>

                        <div
                            v-if="notifications.chat_invites > 0"
                            class="nav-bell__item"
                            @click="goTo('chat-invite-list')"
                        >
                            <span class="nav-bell__item-icon">📨</span>
                            <div>
                                <p class="nav-bell__item-text">チャット招待</p>
                                <p class="nav-bell__item-count">{{ notifications.chat_invites }}件の未承認招待</p>
                            </div>
                        </div>

                        <div
                            v-if="notifications.unread_messages > 0"
                            class="nav-bell__item"
                            @click="goTo('chat')"
                        >
                            <span class="nav-bell__item-icon">💬</span>
                            <div>
                                <p class="nav-bell__item-text">未読メッセージ</p>
                                <p class="nav-bell__item-count">{{ notifications.unread_messages }}件の未読</p>
                            </div>
                        </div>

                        <div v-if="notifications.total === 0" class="nav-bell__empty">
                            通知はありません
                        </div>
                    </div>
                </div>

                <!-- ユーザーメニュー -->
                <div class="nav-user" @click.stop="showUserMenu = !showUserMenu" ref="userMenuRef">
                    <div class="nav-avatar">
                        <img
                            v-if="memberAuth.member?.avatarUrl"
                            :src="memberAuth.member.avatarUrl"
                            class="nav-avatar__img"
                        />
                        <div v-else class="nav-avatar__text">
                            {{ memberAuth.member?.nickname?.[0] ?? memberAuth.member?.sei?.[0] }}
                        </div>
                    </div>
                    <span class="nav-user__name">{{ memberAuth.member?.nickname ?? memberAuth.member?.sei }}さん</span>

                    <!-- ドロップダウン -->
                    <div v-if="showUserMenu" class="nav-user__dropdown">
                        <div class="nav-user__dropdown-header">
                            <div class="nav-avatar nav-avatar--lg">
                                <img
                                    v-if="memberAuth.member?.avatarUrl"
                                    :src="memberAuth.member.avatarUrl"
                                    class="nav-avatar__img"
                                />
                                <div v-else class="nav-avatar__text">
                                    {{ memberAuth.member?.nickname?.[0] ?? memberAuth.member?.sei?.[0] }}
                                </div>
                            </div>
                            <div>
                                <p class="nav-user__dropdown-name">{{ memberAuth.member?.nickname ?? memberAuth.member?.sei }}</p>
                                <p class="nav-user__dropdown-email">{{ memberAuth.member?.email }}</p>
                            </div>
                        </div>
                        <div class="nav-user__dropdown-divider"></div>
                        <router-link
                            :to="{ path: '/mypage' }"
                            class="nav-user__dropdown-item"
                            @click="showUserMenu = false"
                        >マイページ</router-link>
                        <div class="nav-user__dropdown-divider"></div>
                        <button
                            class="nav-user__dropdown-item nav-user__dropdown-item--logout"
                            @click="handleLogout"
                        >ログアウト</button>
                    </div>
                </div>
            </template>

            <template v-else>
                <router-link :to="{ name: 'member-login' }" class="nav-link nav-link--cta">ログイン</router-link>
            </template>
        </nav>
    </header>
</template>

<script setup>
import { useAuthStore }       from '@/stores/auth'
import { useMemberAuthStore } from '@/stores/memberAuth'
import { useRouter }          from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'

const auth       = useAuthStore()
const memberAuth = useMemberAuthStore()
const router     = useRouter()

const showUserMenu  = ref(false)
const showBell      = ref(false)
const userMenuRef   = ref(null)
const bellRef       = ref(null)
const notifications = ref({ chat_invites: 0, unread_messages: 0, total: 0 })

let pollTimer = null

const fetchNotifications = async () => {
    if (!memberAuth.isLoggedIn) return
    try {
        const { data } = await axios.get('/api/notifications/summary')
        notifications.value = data
    } catch (e) {
        // エラーは無視
    }
}

const toggleBell = () => {
    showBell.value = !showBell.value
    showUserMenu.value = false
    if (showBell.value) fetchNotifications()
}

const goTo = (name) => {
    showBell.value = false
    router.push({ name })
}

// 外側クリックで閉じる
const handleClickOutside = (e) => {
    if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
        showUserMenu.value = false
    }
    if (bellRef.value && !bellRef.value.contains(e.target)) {
        showBell.value = false
    }
}

const handleLogout = async () => {
    await memberAuth.logout()
    router.push({ name: 'Landing' })
}

// ログイン状態が変わったら通知をフェッチ・ポーリング開始
watch(() => memberAuth.isLoggedIn, (isLoggedIn) => {
    if (isLoggedIn) {
        fetchNotifications()
        pollTimer = setInterval(fetchNotifications, 60000) // 1分ごとに更新
    } else {
        clearInterval(pollTimer)
        notifications.value = { chat_invites: 0, unread_messages: 0, total: 0 }
    }
}, { immediate: true })

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    clearInterval(pollTimer)
})
</script>

<style scoped>
.header-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #0a0a0a;
    border-bottom: 1px solid #222;
    padding: 0 40px;
    height: 60px;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-nav__logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 300;
    color: #fff;
    letter-spacing: 0.1em;
    cursor: pointer;
}

.header-nav__links {
    display: flex;
    align-items: center;
    gap: 32px;
}

.nav-link {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: #888;
    text-decoration: none;
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
}

.nav-link:hover { color: #fff; }

.nav-link--cta {
    color: #dc5078;
    border: 1px solid #dc5078;
    padding: 6px 16px;
    border-radius: 4px;
    transition: background 0.2s ease, color 0.2s ease;
}

.nav-link--cta:hover {
    background: #dc5078;
    color: #fff;
}

/* ベル */
.nav-bell {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.nav-bell svg {
    transition: stroke 0.2s ease;
}

.nav-bell:hover svg {
    stroke: #fff;
}

.nav-bell__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #dc5078;
    color: white;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 500;
    font-family: 'Montserrat', sans-serif;
}

.nav-bell__dropdown {
    position: absolute;
    top: calc(100% + 16px);
    right: -8px;
    width: 260px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    overflow: hidden;
    z-index: 200;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.nav-bell__dropdown-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #666;
    padding: 12px 16px 8px;
    margin: 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.nav-bell__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.2s ease;
    border-top: 1px solid #222;
}

.nav-bell__item:hover {
    background: #222;
}

.nav-bell__item-icon {
    font-size: 18px;
    flex-shrink: 0;
}

.nav-bell__item-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #fff;
    margin: 0 0 2px;
}

.nav-bell__item-count {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #dc5078;
    margin: 0;
}

.nav-bell__empty {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #666;
    padding: 16px;
    text-align: center;
    border-top: 1px solid #222;
}

/* ユーザーメニュー（既存のまま） */
.nav-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: #dc5078;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-avatar__img { width: 100%; height: 100%; object-fit: cover; }

.nav-avatar__text {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
}

.nav-user {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.nav-user__name {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #fff;
}

.nav-user__dropdown {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: 240px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    overflow: hidden;
    z-index: 200;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.nav-user__dropdown-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
}

.nav-avatar--lg { width: 40px; height: 40px; font-size: 16px; }

.nav-user__dropdown-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    margin: 0 0 2px;
}

.nav-user__dropdown-email {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #666;
    margin: 0;
}

.nav-user__dropdown-divider { height: 1px; background: #333; }

.nav-user__dropdown-item {
    display: block;
    width: 100%;
    padding: 12px 16px;
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #888;
    text-decoration: none;
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

.nav-user__dropdown-item:hover { background: #222; color: #fff; }

.nav-user__dropdown-item--logout { color: #dc5078; }

.nav-user__dropdown-item--logout:hover { background: #222; color: #dc5078; }
</style>