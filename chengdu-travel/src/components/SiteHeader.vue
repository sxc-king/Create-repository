<script setup>
// 全站固定页头：品牌 Logo + 主导航 + 成都玩法下拉 + 消息铃铛 + 用户区 + 新建旅程入口
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, logout } from '@/store/user'
import { useMessageStore, unreadCount } from '@/store/message'
import LoginModal from '@/components/LoginModal.vue'

const router = useRouter()
const route = useRoute()
// scrolled 滚动后加深背景与阴影；loginVisible 控制登录弹窗；chengduOpen 控制成都玩法下拉
const scrolled = ref(false)
const loginVisible = ref(false)
const chengduOpen = ref(false)
const userStore = useUserStore()
const msgStore = useMessageStore()

// 主导航项（桌面端展示）
const navItems = [
  { name: '我的旅程', path: '/trips' },
  { name: 'AI 旅行管家', path: '/ai' },
  { name: '灵感广场', path: '/inspiration' },
  { name: '旅游攻略', path: '/strategy' },
  { name: '订单中心', path: '/orders' }
]

// 成都玩法下拉链接
const chengduLinks = [
  { name: '酒店住宿', path: '/stay' },
  { name: '美食', path: '/food' },
  { name: '购物', path: '/shopping' },
  { name: '玩乐', path: '/play' },
  { name: '当地向导', path: '/guide' }
]

// 未读消息数，铃铛角标展示，超过 99 显示 99+
const unread = computed(() => unreadCount())

/** 判断当前路由是否命中导航项；/trips 需兼容 trip 详情与 trips 列表前缀 */
const isActive = (path) => {
  if (path === '/trips') return route.path.startsWith('/trip') || route.path.startsWith('/trips')
  return route.path === path || route.path.startsWith(path + '/')
}

/** 滚动监听：页面滚动超过 10px 切换页头背景 */
const onScroll = () => {
  scrolled.value = window.scrollY > 10
}
/** 点击页面任意处：若点击落在下拉容器外则收起成都玩法下拉 */
const onDocClick = (e) => {
  if (chengduRef.value && !chengduRef.value.contains(e.target)) chengduOpen.value = false
}
// 下拉容器引用，用于判定点击是否落在下拉内
const chengduRef = ref(null)
/** 挂载／卸载时注册与移除滚动、文档点击监听 */
onMounted(() => {
  window.addEventListener('scroll', onScroll)
  document.addEventListener('click', onDocClick)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onDocClick)
})

/** 退出登录并回到未登录态 */
const handleLogout = () => {
  logout()
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-white/80 backdrop-blur'"
  >
    <div class="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 select-none shrink-0">
        <span class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-base">🧳</span>
        <div class="leading-none">
          <span class="block text-lg font-black tracking-widest text-red-600">途伴</span>
          <span class="block text-[10px] font-semibold tracking-[0.25em] text-gray-500 uppercase mt-0.5">JourneyMate</span>
        </div>
      </router-link>

      <!-- 主导航 -->
      <nav class="hidden md:flex items-center gap-6">
        <router-link
          v-for="(item, i) in navItems"
          :key="item"
          :to="item.path"
          class="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors relative group"
          active-class="text-red-600"
        >
          {{ item.name }}
          <span
            class="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"
            :class="{ 'w-full': isActive(item.path) }"
          ></span>
        </router-link>

        <!-- 成都玩法下拉 -->
        <div ref="chengduRef" class="relative">
          <button
            class="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors flex items-center gap-1"
            @click="chengduOpen = !chengduOpen"
          >
            成都玩法
            <span class="text-[10px]">▾</span>
          </button>
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="chengduOpen"
              class="absolute top-full left-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-gray-100 py-2"
            >
              <router-link
                v-for="l in chengduLinks"
                :key="l.path"
                :to="l.path"
                class="block px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50"
                @click="chengduOpen = false"
              >
                {{ l.name }}
              </router-link>
            </div>
          </transition>
        </div>
      </nav>

      <!-- 右侧 -->
      <div class="flex items-center gap-3">
        <!-- 消息铃铛 -->
        <button
          class="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          @click="router.push('/messages')"
        >
          <span class="text-lg">🔔</span>
          <span
            v-if="unread > 0"
            class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center"
          >
            {{ unread > 99 ? '99+' : unread }}
          </span>
        </button>

        <!-- 未登录：展示登录按钮，点击唤起登录弹窗 -->
        <template v-if="!userStore.isLogin">
          <button
            class="hidden sm:block text-sm text-gray-600 hover:text-red-600 transition-colors"
            @click="loginVisible = true"
          >
            登录
          </button>
        </template>
        <!-- 已登录：头像跳转个人中心，旁边为退出按钮 -->
        <template v-else>
          <button class="flex items-center gap-2" @click="router.push('/profile')">
            <span
              class="w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold"
            >
              {{ userStore.username.charAt(0).toUpperCase() }}
            </span>
            <span class="hidden sm:block text-sm text-gray-700">{{ userStore.username }}</span>
          </button>
          <button
            class="hidden sm:block text-sm text-gray-500 hover:text-red-600 transition-colors"
            @click="handleLogout"
          >
            退出
          </button>
        </template>

        <!-- 新建旅程入口：固定主按钮，跳转新建旅程页 -->
        <button
          class="text-sm px-4 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors whitespace-nowrap"
          @click="router.push('/trips/new')"
        >
          ＋ 新建旅程
        </button>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal v-model="loginVisible" />
  </header>
</template>
