<script setup>
// 消息中心：聚合行程通知、同行邀请、订单通知与 AI 管家消息，支持按类型筛选与标记已读
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import { useMessageStore, markRead, markAllRead, msgTypeMap } from '@/store/message'

const router = useRouter()
const msgStore = useMessageStore()
// 当前选中的消息类型标签，all 表示不过滤
const tab = ref('all')
// 可切换的消息类型集合，与 store 中消息 type 字段取值对应
const types = ['all', 'trip', 'invite', 'order', 'ai']

// 按当前标签过滤消息列表：选 all 时展示全部，否则按 type 精确匹配
const list = computed(() =>
  tab.value === 'all' ? msgStore.messages : msgStore.messages.filter((m) => m.type === tab.value)
)
// 统计各类型消息数量，用于标签上的角标展示
const counts = computed(() => {
  const c = { all: msgStore.messages.length, trip: 0, invite: 0, order: 0, ai: 0 }
  msgStore.messages.forEach((m) => (c[m.type] = (c[m.type] || 0) + 1))
  return c
})

/**
 * 打开一条消息：先把未读消息标记为已读，若消息携带跳转链接则前往对应页面
 * @param m 被点击的消息对象
 */
function open(m) {
  if (!m.read) markRead(m.id)
  if (m.link) router.push(m.link)
}

/** 将消息时间戳格式化为 月/日 时:分 的简短展示形式 */
function fmt(ts) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div>
    <!-- 栏目头图：背景大图 + 标题与副标题 -->
    <PageHero
      title="消息中心"
      subtitle="行程变更、同行邀请、订单通知、AI 管家消息，一处聚合"
      image="/images/guide.jpg"
      badge="消息中心"
    />

    <section class="max-w-3xl mx-auto px-4 py-10">
      <!-- 消息类型标签栏：左侧各类型切换按钮，右侧一键全部已读 -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in types"
            :key="t"
            class="px-4 py-2 rounded-full text-sm transition-colors"
            :class="tab === t ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            @click="tab = t"
          >
            {{ t === 'all' ? '全部' : msgTypeMap[t]?.label }}（{{ counts[t] }}）
          </button>
        </div>
        <button
          class="text-xs text-red-600 hover:text-red-700"
          @click="markAllRead()"
        >
          全部标记已读
        </button>
      </div>

      <!-- 消息列表：未读消息左侧高亮并带红点，点击进入消息详情跳转 -->
      <div v-if="list.length" class="space-y-3">
        <div
          v-for="m in list"
          :key="m.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-all"
          :class="m.read ? '' : 'border-l-4 border-l-red-600'"
          @click="open(m)"
        >
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0">
              {{ msgTypeMap[m.type]?.icon || '📌' }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-bold text-gray-900">{{ m.title }}</p>
                <span v-if="!m.read" class="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{{ m.content }}</p>
              <p class="text-[11px] text-gray-400 mt-1">{{ msgTypeMap[m.type]?.label }} · {{ fmt(m.time) }}</p>
            </div>
            <span class="text-gray-300">›</span>
          </div>
        </div>
      </div>
      <!-- 空状态：当前分类下没有任何消息时展示 -->
      <div v-else class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
        <div class="text-5xl mb-3">🔕</div>
        <p class="text-gray-500">暂无消息</p>
      </div>
    </section>
  </div>
</template>
