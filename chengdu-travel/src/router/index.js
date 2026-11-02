/**
 * 路由配置：全站页面路径与视图组件的映射表
 * 采用 HTML5 history 模式；各页面组件均为路由级懒加载
 */
import { createRouter, createWebHistory } from 'vue-router'

// 页面路由表：meta.title 用于同步浏览器标签页标题
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
    path: '/trips',
    name: 'MyTrips',
    component: () => import('@/views/MyTrips.vue'),
    meta: { title: '我的旅程' }
  },
  {
    path: '/trips/new',
    name: 'NewTrip',
    component: () => import('@/views/NewTrip.vue'),
    meta: { title: '新建旅程' }
  },
  {
    path: '/trip/:id',
    name: 'TripDetail',
    component: () => import('@/views/TripDetail.vue'),
    meta: { title: '旅程详情' }
  },
  {
    path: '/ai',
    name: 'AiAssistant',
    component: () => import('@/views/AiAssistant.vue'),
    meta: { title: 'AI 旅行管家' }
  },
  {
    path: '/inspiration',
    name: 'Inspiration',
    component: () => import('@/views/Inspiration.vue'),
    meta: { title: '灵感广场' }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders.vue'),
    meta: { title: '我的订单' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { title: '个人中心' }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/Messages.vue'),
    meta: { title: '消息中心' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 创建路由实例：切换页面时默认回到顶部，有滚动位置记录则恢复原位置
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// 全局后置守卫：根据当前路由 meta.title 更新浏览器标签页标题
router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${to.meta.title} - 途伴 JourneyMate`
    : '途伴 JourneyMate · 以旅程为中心，做你全程随行的旅行管家'
})

export default router
