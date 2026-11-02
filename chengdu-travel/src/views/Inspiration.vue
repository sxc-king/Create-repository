<script setup>
// 灵感广场：展示可一键复刻的行程模板，按分类筛选后生成属于用户自己的草稿旅程
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import { templates, templateCategories } from '@/data/templates'
import { createTrip } from '@/store/trip'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
// 当前选中的模板分类，默认展示「全部」
const active = ref('全部')
// 按当前分类过滤模板：选「全部」时返回全量模板，否则按 tag 匹配
const filtered = computed(() =>
  active.value === '全部' ? templates : templates.filter((t) => t.tag === active.value)
)

/**
 * 复刻模板：以所选模板为蓝本生成一条新的草稿旅程，再跳转到该旅程详情页
 * @param t 被复刻的模板对象，含名称、目的地、预算、标签与时间线
 */
function duplicate(t) {
  // 深拷贝模板时间线作为新旅程的日程，避免与原模板共享引用
  const trip = createTrip({
    name: t.name,
    destination: t.destination,
    startDate: '',
    endDate: '',
    budget: t.budget,
    tags: t.tags,
    owner: userStore.username || '游客',
    source: 'template',
    days: JSON.parse(JSON.stringify(t.timeline))
  })
  router.push(`/trip/${trip.id}`)
}
</script>

<template>
  <div>
    <!-- 栏目头图：背景大图 + 标题与副标题 -->
    <PageHero
      title="灵感广场"
      subtitle="看看别人好用的行程模板，一键复刻成你自己的草稿旅程"
      image="/images/guzhen.jpg"
      badge="行程模板库"
    />

    <section class="max-w-7xl mx-auto px-4 py-12">
      <!-- 分类筛选 -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="c in templateCategories"
          :key="c"
          class="px-4 py-2 rounded-full text-sm transition-colors"
          :class="active === c ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="active = c"
        >
          {{ c }}
        </button>
      </div>

      <!-- 模板卡片网格：封面、分类徽标、天数、目的地预算与复刻按钮 -->
      <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="t in filtered"
          :key="t.id"
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
        >
          <div class="relative overflow-hidden aspect-[16/9]">
            <img :src="t.cover" :alt="t.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-red-600">
              {{ t.tag }}
            </span>
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
              {{ t.days }} 天
            </span>
          </div>
          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug">
              {{ t.name }}
            </h3>
            <p class="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{{ t.intro }}</p>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center gap-1.5 text-xs text-gray-500">
                <span>📍 {{ t.destination }}</span>
                <span>· 预算{{ t.budget }}</span>
              </div>
              <button
                class="text-xs px-3.5 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                @click="duplicate(t)"
              >
                ♻️ 复刻模板
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-center text-gray-400 py-16">该分类暂无模板</p>

      <p class="text-xs text-gray-400 text-center mt-8">V1.0 模板无评论、无作者主页；复刻后生成一份全新草稿，可在旅程中自由修改与预订。</p>
    </section>
  </div>
</template>
