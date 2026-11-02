<script setup>
// 首页首屏横幅组件：背景大图 + 主标语 + 搜索条 + 热门搜索下拉 + 底部数据条
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { hotSearches } from '@/details'

const router = useRouter()
// 底部数据条展示的平台统计数字（文案型，写死在组件内）
const stats = [
  { num: '8.4万+', label: '可预订景点' },
  { num: '120万+', label: '真实点评' },
  { num: '4.8', label: '综合评分' }
]

// keyword：搜索框输入词；showHot：是否展开热门搜索下拉；searchRef：搜索条容器引用（用于判定点击外部关闭）
const keyword = ref('')
const showHot = ref(false)
const searchRef = ref(null)

/** 提交搜索：输入词非空时，按关键词映射跳对应景点详情，否则回首页 */
const submitSearch = (word) => {
  const kw = (word || keyword.value).trim()
  if (!kw) return
  showHot.value = false
  keyword.value = ''
  // 简单跳转到对应内容页（景点名匹配则跳景点详情，否则回首页顶部）
  // 关键词 → 目标路由 的硬编码映射表（包含关键字即命中）
  const matched = [{ k: '大熊猫基地', to: '/attraction/5' }, { k: '武侯祠', to: '/attraction/1' }, { k: '都江堰', to: '/attraction/4' }, { k: '青城山', to: '/attraction/6' }, { k: '杜甫草堂', to: '/attraction/3' }].find(
    (m) => kw.includes(m.k)
  )
  router.push(matched ? matched.to : '/')
}

/** 点击搜索条以外的区域时，收起热门搜索下拉 */
const onDocClick = (e) => {
  if (searchRef.value && !searchRef.value.contains(e.target)) showHot.value = false
}
// 监听全局点击以实现「点击外部关闭」，组件卸载时移除监听防止内存泄漏
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <section class="relative h-[560px] overflow-hidden">
    <!-- 背景大图 -->
    <img
      src="/images/hero.jpg"
      alt="成都古街夜景"
      class="absolute inset-0 w-full h-full object-cover"
    />
    <!-- 遮罩渐变 -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/50"></div>

    <!-- 内容 -->
    <div class="relative h-full flex flex-col items-center justify-center text-white px-4">
      <p class="text-xs sm:text-sm tracking-[0.5em] uppercase mb-4 text-red-200 font-medium">
        Welcome to Chengdu
      </p>
      <h1 class="text-5xl sm:text-6xl font-black tracking-widest mb-3 drop-shadow-lg">
        成都 <span class="text-3xl sm:text-4xl font-bold tracking-[0.3em]">CHENGDU</span>
      </h1>
      <p class="text-base sm:text-lg text-white/90 mb-8 text-center leading-relaxed">
        九天开出一成都，万户千门入画图 —— 一座来了就不想走的城市
      </p>

      <!-- 搜索条 -->
      <div ref="searchRef" class="relative w-full max-w-2xl">
        <form
          class="flex items-center bg-white rounded-full shadow-2xl overflow-hidden"
          @submit.prevent="submitSearch()"
        >
          <span class="pl-5 text-gray-400">🔍</span>
          <input
            v-model="keyword"
            type="text"
            placeholder="搜索景点、美食、笔记…"
            class="flex-1 h-14 px-3 text-gray-700 placeholder-gray-400 outline-none text-sm"
            @focus="showHot = true"
          />
          <button
            type="submit"
            class="h-11 mx-2 px-8 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          >
            搜索
          </button>
        </form>

        <!-- 热门搜索下拉 -->
        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="showHot"
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl p-4 text-left"
          >
            <p class="text-xs text-gray-400 mb-3 flex items-center gap-1">
              <span>🔥</span> 热门搜索
            </p>
            <div class="flex flex-wrap gap-2">
              <!-- 前 3 个热词高亮为红色风格，其余为灰色风格；点击直接以该词提交搜索 -->
              <button
                v-for="(word, i) in hotSearches"
                :key="word"
                class="px-3 py-1.5 rounded-full text-xs transition-colors"
                :class="
                  i < 3
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                "
                @click="submitSearch(word)"
              >
                {{ word }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 底部数据条 -->
    <div class="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
      <div
        class="max-w-4xl mx-auto flex items-center justify-around py-4 text-white"
      >
        <div v-for="s in stats" :key="s.label" class="text-center">
          <div class="text-xl font-bold">{{ s.num }}</div>
          <div class="text-xs text-white/70 mt-0.5">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
