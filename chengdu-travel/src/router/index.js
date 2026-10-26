import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/stay',
    name: 'Stay',
    component: () => import('@/views/StayPage.vue'),
    meta: { title: '住宿' }
  },
  {
    path: '/food',
    name: 'Food',
    component: () => import('@/views/FoodPage.vue'),
    meta: { title: '美食' }
  },
  {
    path: '/shopping',
    name: 'Shopping',
    component: () => import('@/views/ShoppingPage.vue'),
    meta: { title: '购物' }
  },
  {
    path: '/play',
    name: 'Play',
    component: () => import('@/views/PlayPage.vue'),
    meta: { title: '玩乐' }
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('@/views/GuidePage.vue'),
    meta: { title: '当地向导' }
  },
  {
    path: '/strategy',
    name: 'Strategy',
    component: () => import('@/views/StrategyPage.vue'),
    meta: { title: '旅游攻略' }
  },
  {
    path: '/attraction/:id',
    name: 'AttractionDetail',
    component: () => import('@/views/AttractionDetail.vue'),
    meta: { title: '景点详情' }
  },
  {
    path: '/strategy/:id',
    name: 'StrategyDetail',
    component: () => import('@/views/StrategyDetail.vue'),
    meta: { title: '攻略详情' }
  },
  {
    path: '/note/:id',
    name: 'NoteDetail',
    component: () => import('@/views/NoteDetail.vue'),
    meta: { title: '笔记详情' }
  },
  {
    path: '/order/:category/:id',
    name: 'Order',
    component: () => import('@/views/OrderPage.vue'),
    meta: { title: '订购支付' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} - 成都 CHENGDU`
    : '成都 CHENGDU · 本地文旅景点推荐'
})

export default router
