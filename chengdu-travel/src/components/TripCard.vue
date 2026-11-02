<script setup>
// 旅程卡片组件：在「我的旅程」等列表中展示单条旅程概览，整卡可点击跳转旅程详情页
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { tripStatusMap } from '@/store/trip'

// props：trip 为单条旅程对象，含 id、name、destination、startDate、endDate、budget、tags、status、source、days、companions、updatedAt 字段
const props = defineProps({ trip: { type: Object, required: true } })
const router = useRouter()

// nodeCount：统计整条旅程的节点总数，即各天 nodes 长度累加（days 或某天 nodes 缺失时按 0 计）
const nodeCount = computed(() =>
  (props.trip.days || []).reduce((sum, d) => sum + (d.nodes?.length || 0), 0)
)
// dayCount：旅程天数，取 days 数组长度
const dayCount = computed(() => props.trip.days?.length || 0)
// companionCount：同行人数，取 companions 数组长度
const companionCount = computed(() => props.trip.companions?.length || 0)
</script>

<template>
  <div
    class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col"
    @click="router.push(`/trip/${trip.id}`)"
  >
    <!-- 顶部分类色条 -->
    <div class="h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-orange-400"></div>
    <div class="p-5 flex-1 flex flex-col">
      <!-- 卡片头部：旅程名 + 右侧状态徽标（文案与样式取自 tripStatusMap，未知状态回退灰色默认徽标） -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-1">
          {{ trip.name }}
        </h3>
        <span
          class="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium"
          :class="tripStatusMap[trip.status]?.cls || 'bg-gray-100 text-gray-600'"
        >
          {{ tripStatusMap[trip.status]?.label || trip.status }}
        </span>
      </div>

      <p class="text-sm text-gray-500 mt-2 flex items-center gap-1">
        📍 {{ trip.destination }}
        <template v-if="trip.startDate">· {{ trip.startDate }}<template v-if="trip.endDate"> ~ {{ trip.endDate }}</template></template>
      </p>

      <!-- 标签行：预算徽标、用户自定义标签、以及来源徽标（AI生成 / 自建 / 模板复刻 / 旅程复刻） -->
      <div class="flex flex-wrap gap-1.5 mt-3">
        <span v-if="trip.budget" class="text-[11px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
          预算 {{ trip.budget }}
        </span>
        <span
          v-for="tg in trip.tags"
          :key="tg"
          class="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600"
        >
          {{ tg }}
        </span>
        <span
          class="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
        >
          {{ sourceLabel(trip.source) }}
        </span>
      </div>

      <!-- 统计 -->
      <div class="flex items-center gap-5 mt-4 text-xs text-gray-500">
        <span>{{ dayCount }} 天</span>
        <span>{{ nodeCount }} 个节点</span>
        <span>{{ companionCount }} 位同行</span>
      </div>

      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span class="text-gray-400">{{ formatTime(trip.updatedAt) }}</span>
        <span class="text-red-600 font-medium group-hover:translate-x-1 transition-transform">查看旅程 →</span>
      </div>
    </div>
  </div>
</template>

<script>
/** 旅程来源码 → 中文标签：source 取值 ai / blank / template / clone，未知值回退为「自建」 */
function sourceLabel(src) {
  return { ai: 'AI生成', blank: '自建', template: '模板复刻', clone: '旅程复刻' }[src] || '自建'
}

/** 格式化更新时间戳：仅显示「月/日 更新」，无时间戳时返回空串 */
function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} 更新`
}
</script>
