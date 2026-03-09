import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import MakerCarModelPage from '../views/MakerCarModelPage.vue'
import BodyTypeModelPage from '../views/BodyTypeModelPage.vue'
import SelectCarModelAreaPage from '../views/SelectCarModelAreaPage.vue'
import ChatView from '@/views/ChatView.vue'
import Login from '@/views/Login.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/maker-car-model/:manufacturerName',
    name: 'MakerCarModel',
    component: MakerCarModelPage,
    props: true
  },
  {
    path: '/body-type-model/:Name',
    name: 'BodyTypeModel',
    component: BodyTypeModelPage,
    props: true
  },
  { path: '/select-car-model-area', name: 'SelectCarModelArea', component: SelectCarModelAreaPage, meta: { requiresAuth: true } },
  {
    path: '/chat/:roomId?',
    name: 'chat',
    component: ChatView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ルーターガード
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }
})

export default router