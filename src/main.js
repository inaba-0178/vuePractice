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

app.mount('#app')