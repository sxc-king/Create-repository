<script setup>
// 我的订单：按状态页签筛选订单列表，支持跳转所属旅程、确认完成与取消订单
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import { useOrderStore, orderStatusMap, orderCategoryMap, setOrderStatus } from '@/store/order'
import { getTrip } from '@/store/trip'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

// tab：当前选中的订单状态筛选页签，all 表示不过滤
const tab = ref('all')
// tabs：订单状态页签配置，key 对应订单 status 字段
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待支付' },
  { key: 'paid', label: '已支付' },
  { key: 'done', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

// orders：按当前状态 Tab 过滤后的订单列表
const orders = computed(() =>
  tab.value === 'all' ? orderStore.orders : orderStore.orders.filter((o) => o.status === tab.value)
)

/** 根据旅程 id 查旅程名称，查不到（旅程已删除）时返回空串 */
function journeyName(id) {
  return getTrip(id)?.name || ''
}

/** 把时间戳格式化为「月/日」展示 */
function fmtTime(ts) {
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

/** 订单类别码转中文类别名，查不到映射时原样返回 */
function catName(c) {
  return orderCategoryMap[c]?.name || c
}

// 进入页面时若带 focus 查询参数（指定某条订单），自动切到该订单所属的状态页签，便于定位
onMounted(() => {
  if (route.query.focus) {
    const o = orderStore.orders.find((x) => x.id === route.query.focus)
    if (o) tab.value = o.status
  }
})
</script>

<template>
  <div>
    <PageHero
      title="我的订单"
      subtitle="所有预订都在这里，兼容直接查订单的老用户习惯"
      image="/images/stay-hotel.jpg"
      badge="订单中心"
    />

    <section class="max-w-5xl mx-auto px-4 py-10">
      <!-- 订单状态筛选页签 -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="px-4 py-2 rounded-full text-sm transition-colors"
          :class="tab === t.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="tab = t.key"
        >
          {{ t.label }}
        </button>
      </div>

      <!-- 订单列表：按状态筛选后渲染，按订单状态显示可操作按钮 -->
      <div v-if="orders.length" class="space-y-3">
        <div
          v-for="o in orders"
          :key="o.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap items-center gap-4"
        >
          <span class="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0">
            {{ o.category === 'stay' ? '🛎️' : o.category === 'attraction' ? '🎫' : o.category === 'food' ? '🍜' : o.category === 'play' ? '🎡' : '🧾' }}
          </span>
          <div class="flex-1 min-w-[180px]">
            <p class="text-sm font-bold text-gray-900">{{ o.itemName }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ catName(o.category) }} · {{ o.date }} · {{ o.count }}份 · 订单号 {{ o.id }}
            </p>
            <p v-if="o.journeyId" class="text-xs text-blue-600 mt-0.5">📦 所属旅程：{{ journeyName(o.journeyId) || '（已删除）' }}</p>
          </div>
          <div class="text-right">
            <p class="text-red-600 font-bold">{{ o.amount }}</p>
            <span class="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px]" :class="orderStatusMap[o.status]?.cls">
              {{ orderStatusMap[o.status]?.label }}
            </span>
          </div>
          <div class="flex gap-2">
            <button
              v-if="o.journeyId && journeyName(o.journeyId)"
              class="text-xs px-3 h-9 rounded-full border border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600"
              @click="router.push(`/trip/${o.journeyId}`)"
            >
              所属旅程
            </button>
            <button
              v-if="o.status === 'paid'"
              class="text-xs px-3 h-9 rounded-full border border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600"
              @click="setOrderStatus(o.id, 'done')"
            >
              确认完成
            </button>
            <button
              v-if="o.status === 'pending'"
              class="text-xs px-3 h-9 rounded-full border border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600"
              @click="setOrderStatus(o.id, 'cancelled')"
            >
              取消
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态：暂无订单时引导用户去预订 -->
      <div v-else class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="text-5xl mb-3">🧾</div>
        <p class="text-gray-500">还没有订单</p>
        <p class="text-sm text-gray-400 mt-1">可在旅程时间线里点「去预订」，或在首页快速预订</p>
      </div>
    </section>
  </div>
</template>
