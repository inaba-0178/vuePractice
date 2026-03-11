import { createApp }    from 'vue'
import { createPinia }  from 'pinia'
import App              from './App.vue'
import router           from './router'
import axios            from 'axios'
import { useAuthStore } from './stores/auth'

axios.defaults.baseURL = 'http://laravel11practice.local:81'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// ページリロード時にトークン・Echo復元
const auth = useAuthStore()
auth.restore()

const memberToken = localStorage.getItem('member_token')
if (memberToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${memberToken}`
}

app.mount('#app')