<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 品牌 -->
        <div class="md:col-span-1">
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-black tracking-widest text-red-500">成都</span>
            <span class="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">CHENGDU</span>
          </div>
          <p class="text-sm text-gray-400 mt-3 leading-relaxed">
            本地文旅景点推荐平台，带你发现成都的万千美好。
          </p>
        </div>

        <!-- 栏目 -->
        <div v-for="col in columns" :key="col.title">
          <h4 class="text-sm font-semibold text-white mb-3">{{ col.title }}</h4>
          <ul class="space-y-2">
            <li v-for="link in col.links" :key="link">
              <a href="#" class="text-sm text-gray-400 hover:text-white transition-colors">
                {{ link }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500"
      >
        <span>© {{ year }} 成都 CHENGDU · 本地文旅景点推荐网站</span>
        <span>示例数据 · 仅用于学习演示</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          title: '游玩指南',
          links: ['热门景点', '旅游攻略', '当地向导', '线路推荐']
        },
        {
          title: '服务支持',
          links: ['酒店住宿', '特色美食', '购物娱乐', '出行交通']
        },
        {
          title: '关于我们',
          links: ['平台介绍', '联系我们', '意见反馈', '隐私政策']
        }
      ]
    }
  }
}
</script>
