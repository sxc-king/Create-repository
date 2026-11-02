<script setup>
// 我的旅程：按状态 Tab 筛选旅程列表，支持新建、推进状态、归档与删除，状态流转为 草稿→待出发→进行中→已结束
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import TripCard from '@/components/TripCard.vue'
import { useTripStore, nextStatus, setStatus, removeTrip, tripStatusMap } from '@/store/trip'
import { useUserStore } from '@/store/user'

const router = useRouter()
const tripStore = useTripStore()
const userStore = useUserStore()

// statusTab：当前选中的状态筛选页签，all 表示不过滤
const statusTab = ref('all')
// tabs：状态筛选页签配置，key 对应旅程 status 字段，label 为展示文案
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'ready', label: '待出发' },
  { key: 'ongoing', label: '进行中' },
  { key: 'finished', label: '已结束' }
]

// trips：按当前状态 Tab 过滤后的旅程列表（all 时返回全部，复制后返回避免外部改动原数组）
const trips = computed(() => {
  const list = statusTab.value === 'all' ? tripStore.trips : tripStore.trips.filter((t) => t.status === statusTab.value)
  return [...list]
})

// counts：各状态的旅程数量统计，用于页签上的数量角标
const counts = computed(() => {
  const c = { all: tripStore.trips.length, draft: 0, ready: 0, ongoing: 0, finished: 0 }
  tripStore.trips.forEach((t) => (c[t.status] = (c[t.status] || 0) + 1))
  return c
})

/** 跳转新建旅程页 */
function goCreate() {
  router.push('/trips/new')
}

/** 推进旅程到下一状态（草稿→待出发→进行中→已结束） */
function handleNext(id) {
  nextStatus(id)
}

/** 直接把旅程归档为已结束 */
function handleArchive(id) {
  setStatus(id, 'finished')
}

/** 删除旅程：先弹窗确认，删除后其关联订单仍保留在订单中心 */
function handleDelete(id) {
  if (confirm('确定删除这份旅程？其关联订单保留在订单中心。')) removeTrip(id)
}
</script>

<template>
  <div>
    <PageHero
      title="我的旅程"
      subtitle="以旅程为中心，把每一趟旅行都安排得明明白白"
      image="/images/hero.jpg"
      badge="旅程中心"
    />

    <section class="max-w-7xl mx-auto px-4 py-10">
      <!-- 顶部操作 -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold text-gray-900">我的旅程</h2>
          <span class="text-sm text-gray-400">{{ trips.length }} 份</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-4 h-10 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors"
            @click="router.push('/inspiration')"
          >
            灵感模板
          </button>
          <button
            class="px-5 h-10 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            @click="goCreate"
          >
            ＋ 新建旅程
          </button>
        </div>
      </div>

      <!-- 状态 Tab -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="px-4 py-2 rounded-full text-sm transition-colors"
          :class="statusTab === t.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="statusTab = t.key"
        >
          {{ t.label }}（{{ counts[t.key] }}）
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="trips.length === 0" class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="text-5xl mb-3">🧳</div>
        <p class="text-gray-500">还没有{{ statusTab === 'all' ? '' : '这类' }}旅程</p>
        <p class="text-sm text-gray-400 mt-1 mb-6">创建一份行程，或让 AI 帮你规划</p>
        <div class="flex items-center justify-center gap-3">
          <button
            class="px-5 h-10 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            @click="goCreate"
          >
            ＋ 新建旅程
          </button>
          <button
            class="px-5 h-10 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-red-500 hover:text-red-600"
            @click="router.push('/ai')"
          >
            🤖 问问 AI 管家
          </button>
        </div>
      </div>

      <!-- 旅程卡片网格 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TripCard v-for="trip in trips" :key="trip.id" :trip="trip" />
      </div>

      <!-- 状态流转说明 -->
      <div class="mt-10 bg-blue-50/60 border border-blue-100 rounded-2xl p-5 text-sm text-blue-700">
        <p class="font-semibold mb-1">📌 旅程状态流转</p>
        <p class="text-blue-600/90 leading-relaxed">
          草稿 → 待出发 → 进行中 → 已结束。进行中的旅程会自动触发 AI 随行提醒；在旅程详情页右下角工具栏可手动推进或归档。
        </p>
      </div>
    </section>
  </div>
</template>
