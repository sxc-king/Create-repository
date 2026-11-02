<script setup>
// 全站页脚组件：品牌简介 + 三栏快捷导航 + 版权信息
// year：当前年份，用于版权行自动刷新
const year = new Date().getFullYear()
// columns：页脚导航栏目配置，title 为栏目标题，links 为该栏下 name（文案）与 path（路由）列表
const columns = [
  {
    title: '旅程服务',
    links: [
      { name: '我的旅程', path: '/trips' },
      { name: '新建旅程', path: '/trips/new' },
      { name: 'AI 旅行管家', path: '/ai' },
      { name: '灵感广场', path: '/inspiration' }
    ]
  },
  {
    title: '成都玩法',
    links: [
      { name: '酒店住宿', path: '/stay' },
      { name: '特色美食', path: '/food' },
      { name: '购物娱乐', path: '/shopping' },
      { name: '当地向导', path: '/guide' }
    ]
  },
  {
    title: '服务支持',
    links: [
      { name: '旅游攻略', path: '/strategy' },
      { name: '订单中心', path: '/orders' },
      { name: '个人中心', path: '/profile' },
      { name: '消息中心', path: '/messages' }
    ]
  }
]
</script>

<template>
  <footer class="bg-gray-900 text-gray-300 mt-8">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 品牌 -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center text-base">🧳</span>
            <div>
              <span class="block text-lg font-black tracking-widest text-red-500">途伴</span>
              <span class="block text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mt-0.5">JourneyMate</span>
            </div>
          </div>
          <p class="text-sm text-gray-400 mt-3 leading-relaxed">
            以旅程为中心，做你全程随行的旅行管家。机酒门票只是旅程里的服务组件。
          </p>
        </div>

        <!-- 栏目 -->
        <div v-for="col in columns" :key="col.title">
          <h4 class="text-sm font-semibold text-white mb-3">{{ col.title }}</h4>
          <ul class="space-y-2">
            <li v-for="link in col.links" :key="link.path">
              <router-link :to="link.path" class="text-sm text-gray-400 hover:text-white transition-colors">
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500"
      >
        <span>© {{ year }} 途伴 JourneyMate · 以旅程为中心的全链路旅行服务平台</span>
        <span>示例数据 · 仅用于学习演示</span>
      </div>
    </div>
  </footer>
</template>
