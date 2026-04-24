<template>
    <header class="header-nav">
        <div class="header-nav__logo">AUTO SEARCH</div>
        <nav class="header-nav__links">
            <router-link :to="{ name: 'Landing' }" class="nav-link">中古車</router-link>
            <!-- <a href="#" class="nav-link">輸入車</a> -->
            <router-link :to="{ name: 'DealerList' }" class="nav-link">中古車販売店</router-link>
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
const auth   = useAuthStore()
</script>