import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import MakerCarModelPage from '../views/MakerCarModelPage.vue'
import BodyTypeModelPage from '../views/BodyTypeModelPage.vue'
import SelectCarModelAreaPage from '../views/SelectCarModelAreaPage.vue'
import ChatView from '@/views/ChatView.vue'
import Login from '@/views/Login.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword  from '@/views/ResetPassword.vue'
import Register     from '@/views/Register.vue'
import RegisterForm from '@/views/RegisterForm.vue'

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
  { 
    path: '/select-car-model-area',
    name: 'SelectCarModelArea',
    component: SelectCarModelAreaPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat/:roomId?',
    name: 'chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword
  },
  { path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/register-form',
    name: 'register-form',
    component: RegisterForm
  },
  { path: '/modal-test', name: 'modal-test', component: () => import('@/views/ModalTest.vue') }
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