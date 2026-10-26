<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { navItems } from '@/data'
import { useUserStore, logout } from '@/store/user'
import LoginModal from '@/components/LoginModal.vue'

const router = useRouter()
const route = useRoute()
const scrolled = ref(false)
const loginVisible = ref(false)
const userStore = useUserStore()

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const onScroll = () => {
  scrolled.value = window.scrollY > 10
}
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

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
      <router-link to="/" class="flex items-baseline gap-2 select-none">
        <span class="text-2xl font-black tracking-widest text-red-600">成都</span>
        <span class="text-sm font-semibold tracking-[0.3em] text-gray-600 uppercase">CHENGDU</span>
      </router-link>

      <!-- 导航菜单 -->
      <nav class="hidden md:flex items-center gap-7">
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
      </nav>

      <!-- 右侧：登录状态 -->
      <div class="flex items-center gap-3">
        <template v-if="!userStore.isLogin">
          <button
            class="hidden sm:block text-sm text-gray-600 hover:text-red-600 transition-colors"
            @click="loginVisible = true"
          >
            登录
          </button>
        </template>
        <template v-else>
          <div class="flex items-center gap-2">
            <span
              class="w-7 h-7 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold"
            >
              {{ userStore.username.charAt(0).toUpperCase() }}
            </span>
            <span class="text-sm text-gray-700">{{ userStore.username }}</span>
          </div>
          <button
            class="hidden sm:block text-sm text-gray-500 hover:text-red-600 transition-colors"
            @click="handleLogout"
          >
            退出
          </button>
        </template>
        <button
          class="text-sm px-4 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          @click="router.push('/stay')"
        >
          立即预订
        </button>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal v-model="loginVisible" />
  </header>
</template>
