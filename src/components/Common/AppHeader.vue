<template>
    <header class="header-nav">
        <div class="header-nav__logo">AUTO SEARCH</div>
            <nav class="header-nav__links">
                <a href="#" class="nav-link">中古車</a>
                <a href="#" class="nav-link">輸入車</a>
                <a href="#" class="nav-link">中古車販売店</a>
                <template v-if="auth.isLoggedIn">
                    <router-link :to="{ name: 'chat' }" class="nav-link">チャット</router-link>
                    <a href="#" @click.prevent="handleLogout" class="nav-link">ログアウト</a>
                </template>
                <template v-else>
                    <router-link :to="{ name: 'member-login' }" class="nav-link nav-link--cta">ログイン</router-link>
                </template>
            </nav>
    </header>
</template>


<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
    await auth.logout()
    router.push({ name: 'Landing' })
}
</script>