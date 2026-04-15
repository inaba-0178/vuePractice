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
import MemberLogin from '@/views/MemberLogin.vue'
import MypageLayout  from '@/views/Mypage/MypageLayout.vue'
import MypageProfile from '@/views/Mypage/MypageProfile.vue'
import MypageEdit    from '@/views/Mypage/MypageEdit.vue'
import MypageEmailChange from '@/views/Mypage/MypageEmailChange.vue'
import MypagePasswordChange from '@/views/Mypage/MypagePasswordChange.vue'
import CarAreaSelect from '@/views/Car/CarAreaSelect.vue'
import CarSelectAreaList from '@/views/Car/CarSelectAreaList.vue'
import CarDetail from '@/views/Car/CarDetail.vue'
import SelectRegionCarList from '@/views/Car/SelectRegionCarList.vue'
import MypageFavorites from '@/views/Mypage/MypageFavorites.vue'
import SelectConditionCarList from '@/views/Car/SelectConditionCarList.vue'
import DealerDetail from '@/views/Dealer/DealerDetail.vue'

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
  { path: '/modal-test', name: 'modal-test', component: () => import('@/views/ModalTest.vue') },
  {
    path: '/member-login',
    name: 'member-login',
    component: MemberLogin
  },
  { path: '/mypage', component: MypageLayout, children: [
    { 
      path: '',
      name: 'mypage',
      component: MypageProfile
    },
    {
      path: 'edit',
      name: 'mypage-edit',
      component: MypageEdit
    },
    {
      path: 'email',
      name: 'mypage-email',
      component: MypageEmailChange
    },
    {
      path: '/mypage/password-change',
      name: 'password-change',
      component: MypagePasswordChange,
    },
    {
      path: 'favorites',
      name: 'mypage-favorites',
      component: MypageFavorites,
    },
  ]},
  {
    path: '/car/area-select',
    name: 'car-area-select',
    component: CarAreaSelect
  },
  {
    path: '/car/select-area-list',
    name: 'car-select-area-list',
    component: CarSelectAreaList
  },
  {
    path: '/cars/:id',
    name: 'CarDetail',
    component: CarDetail,
  },
  {
    path: '/car/select-region-list',
    name: 'car-select-region-list',
    component: SelectRegionCarList
  },
  {
    path: '/car/select-condition-list',
    name: 'car-select-condition-list',
    component: SelectConditionCarList
  },
  {
    path: '/dealer/:id',
    name: 'DealerDetail',
    component: DealerDetail
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