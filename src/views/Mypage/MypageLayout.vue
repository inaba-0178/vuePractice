<template>
  <div class="mypage-wrapper">
    <aside class="sidebar">
      <div class="sidebar__logo">MYPAGE</div>
      <nav class="sidebar__nav">
        <router-link to="/mypage" class="sidebar__item" :class="{ active: $route.path === '/mypage' || $route.path === '/mypage/edit' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          登録情報
        </router-link>
        <router-link to="/mypage/email" class="sidebar__item" :class="{ active: $route.path === '/mypage' || $route.path === '/mypage/email' }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          メールアドレス変更
        </router-link>
      </nav>
      <button @click="handleLogout" class="sidebar__logout">ログアウト</button>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

async function handleLogout() {
  try {
    await axios.post('/api/MemberAuth/logout')
  } finally {
    localStorage.removeItem('member_token')
    delete axios.defaults.headers.common['Authorization']
    router.push('/member-login')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500&display=swap');

* {
  box-sizing: border-box;
}

.mypage-wrapper {
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
}

.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #111;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  padding: 32px 0;
  position: fixed;
  top: 0;
  left: 0;
}

.sidebar__logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px;
  font-weight: 300;
  color: #fff;
  letter-spacing: 0.2em;
  padding: 0 24px 32px;
  border-bottom: 1px solid #222;
  margin-bottom: 24px;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #888;
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.2s ease, background 0.2s ease;
}

.sidebar__item:hover {
  color: #fff;
  background: #1a1a1a;
}

.sidebar__item.active {
  color: #fff;
  background: #1a1a1a;
  border-left: 2px solid #dc5078;
}

.sidebar__logout {
  margin: 0 16px;
  padding: 10px;
  background: transparent;
  border: 1px solid #333;
  border-radius: 4px;
  color: #666;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.sidebar__logout:hover {
  color: #fff;
  border-color: #666;
}

.main-content {
  margin-left: 240px;
  flex: 1;
  padding: 48px;
  color: #ccc;
}
</style>