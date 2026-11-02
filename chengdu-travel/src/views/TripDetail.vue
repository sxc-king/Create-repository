<!-- 旅程详情页：展示与编辑单条旅程（按路由参数 id 取旅程），含三栏布局（AI 管家 / 行程时间线 / 同行与订单）与底部工具箱 -->
<script setup>
// 页面职责：读取 route.params.id 对应旅程，支持按天增删改时间线节点、邀请同行人、讨论留言，以及分享 / 复刻 / 导出 PDF 与旅程状态流转
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AICompanion from '@/components/AICompanion.vue'
import {
  getTrip, useTripStore, updateTrip, addNode, updateNode, removeNode,
  moveNode, addDay, setDayTitle, addCompanion, removeCompanion, setCompanionRole,
  addComment, duplicateTrip, shareLink, exportTripPdf, setStatus, tripStatusMap
} from '@/store/trip'
import { ordersByJourney, orderStatusMap } from '@/store/order'
import { useOrderStore } from '@/store/order'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const tripStore = useTripStore()
const orderStore = useOrderStore()

// 当前旅程：按路由参数 route.params.id 从旅程仓库取出；取不到时下方重定向回列表页
const trip = computed(() => getTrip(route.params.id))
// 该旅程关联的订单列表：先有旅程才按旅程 id 反查，避免空指针
const orders = computed(() => (trip.value ? ordersByJourney(trip.value.id) : []))
// 右侧栏当前激活的页签：companion 同行面板 / order 订单面板
const rightTab = ref('companion')

/* ---------- 节点表单 ---------- */
// 节点表单状态：open 控制显隐，dayIndex 记录挂到第几天，其余字段为节点内容
const nodeForm = ref({ open: false, dayIndex: 0, name: '', type: 'activity', time: '', location: '', note: '', price: '', img: '' })

/** 打开节点表单并指定挂到第几天（dayIndex 从 0 开始） */
function openNodeForm(dayIndex) {
  nodeForm.value = { ...nodeForm.value, open: true, dayIndex }
}

/** 保存节点：名称为空则直接忽略；提交后写回 store 并清空表单 */
function saveNode() {
  if (!nodeForm.value.name.trim()) return
  addNode(trip.value.id, nodeForm.value.dayIndex, {
    type: nodeForm.value.type,
    name: nodeForm.value.name.trim(),
    time: nodeForm.value.time,
    location: nodeForm.value.location,
    note: nodeForm.value.note,
    price: nodeForm.value.price
  })
  nodeForm.value = { open: false, dayIndex: 0, name: '', type: 'activity', time: '', location: '', note: '', price: '', img: '' }
}

/* ---------- 同行 ---------- */
// 同行邀请表单：name 昵称，role 权限（edit 可编辑 / view 仅查看 / notify 仅通知）
const compForm = ref({ name: '', role: 'view' })

/** 邀请同行人：昵称为空则忽略，写入后清空输入 */
function inviteCompanion() {
  if (!compForm.value.name.trim()) return
  addCompanion(trip.value.id, { name: compForm.value.name.trim(), role: compForm.value.role })
  compForm.value = { name: '', role: 'view' }
}

/* ---------- 评论 ---------- */
// 讨论区输入框内容
const commentText = ref('')

/** 发布一条同行讨论：自动带上当前用户名（未登录记为匿名），发送后清空输入 */
function postComment() {
  if (!commentText.value.trim()) return
  addComment(trip.value.id, { user: userStore.username || '匿名', text: commentText.value.trim() })
  commentText.value = ''
}

/* ---------- 工具箱 ---------- */
/** 分享行程：生成带有效期的分享链接并尝试复制到剪贴板，复制失败则直接弹窗展示链接 */
function doShare() {
  const link = shareLink(trip.value.id)
  navigator.clipboard?.writeText(link).then(() => alert('分享链接已复制（带有效期）：' + link)).catch(() => alert('分享链接：' + link))
}

/** 复刻行程：以当前用户为新主人复制一份，成功后跳转到新旅程详情页 */
function doDuplicate() {
  const clone = duplicateTrip(trip.value.id, userStore.username || '游客')
  if (clone) router.push(`/trip/${clone.id}`)
}

/** 去预订节点：根据节点绑定的分类与商品 id 跳到下单页，并带回旅程 id 与所在天数，便于下单后自动回写绑定 */
function goBook(node) {
  const cat = node.category || 'stay'
  const itemId = node.itemId || 1
  router.push(`/order/${cat}/${itemId}?journey=${trip.value.id}&day=${dayOf(node)}`)
}

/** 计算节点所在的天数下标：在 days 中找到首个包含该 node.id 的那一天 */
function dayOf(node) {
  return (trip.value.days || []).findIndex((d) => (d.nodes || []).some((n) => n.id === node.id))
}

/** 格式化时间戳为中文本地化的月日时分字符串（用于讨论区留言时间） */
function fmtTime(ts) {
  return new Date(ts).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// 路由参数对应的旅程不存在时，直接重定向回我的旅程列表，避免渲染空详情
if (!trip.value) {
  router.replace('/trips')
}
</script>

<template>
  <div v-if="trip" class="max-w-7xl mx-auto px-4 py-8">
    <!-- 头部 -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-black text-gray-900">{{ trip.name }}</h1>
          <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="tripStatusMap[trip.status]?.cls">{{ tripStatusMap[trip.status]?.label }}</span>
        </div>
        <p class="text-sm text-gray-500 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
          <span>📍 {{ trip.destination }}</span>
          <span v-if="trip.startDate">📅 {{ trip.startDate }}<template v-if="trip.endDate"> ~ {{ trip.endDate }}</template></span>
          <span v-if="trip.budget">💰 {{ trip.budget }}</span>
          <span>👤 {{ trip.owner || '游客' }}</span>
        </p>
      </div>
      <button
        class="px-4 h-10 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors"
        @click="router.push('/trips')"
      >
        ← 返回我的旅程
      </button>
    </div>

    <!-- 三栏布局 -->
    <div class="grid lg:grid-cols-[300px_1fr_320px] gap-5 items-start">
      <!-- 左侧：AI 随行管家（常驻） -->
      <aside class="hidden lg:block lg:sticky lg:top-24">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm h-[calc(100vh-140px)] max-h-[720px] overflow-hidden flex flex-col">
          <AICompanion :trip="trip" />
        </div>
      </aside>

      <!-- 中间：时间线 -->
      <main class="space-y-4 min-w-0">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-gray-900 flex items-center gap-2">
              <span class="w-1 h-5 bg-red-600 rounded"></span> 行程时间线
            </h2>
            <button
              class="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600"
              @click="addDay(trip.id)"
            >
              ＋ 增加一天
            </button>
          </div>

          <!-- 每一天 -->
          <div
            v-for="(day, di) in trip.days"
            :key="di"
            class="mb-5 last:mb-0"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold">Day {{ di + 1 }}</span>
              <input
                :value="day.title"
                @blur="setDayTitle(trip.id, di, $event.target.value)"
                class="flex-1 text-sm font-bold text-gray-800 bg-transparent outline-none focus:border-b focus:border-red-400"
                placeholder="给这一天起个名字"
              />
              <button
                class="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-600"
                @click="openNodeForm(di)"
              >
                ＋ 加节点
              </button>
            </div>

            <!-- 节点列表 -->
            <div v-if="day.nodes.length" class="relative border-l-2 border-red-100 ml-3 pl-5 space-y-2.5">
              <div
                v-for="node in day.nodes"
                :key="node.id"
                class="group bg-gray-50 rounded-xl p-3 flex gap-3 hover:bg-red-50/40 transition-colors"
              >
                <span class="mt-0.5 text-lg shrink-0">{{ node.type === 'service' ? '🛎️' : '📌' }}</span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm font-semibold text-gray-800">{{ node.name }}</span>
                    <span v-if="node.time" class="text-xs text-gray-400">{{ node.time }}</span>
                    <span v-if="node.price" class="text-xs text-red-600">{{ node.price }}</span>
                  </div>
                  <p v-if="node.location || node.note" class="text-xs text-gray-500 mt-1 leading-relaxed">
                    <span v-if="node.location" class="text-gray-400">{{ node.location }}</span><template v-if="node.location && node.note"> · </template>{{ node.note }}
                  </p>
                  <div class="flex items-center gap-2 mt-2 flex-wrap">
                    <button
                      v-if="node.category && node.itemId"
                      class="text-[11px] px-2.5 py-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                      @click="goBook(node)"
                    >
                      {{ node.orderId ? '查看订单' : '去预订' }}
                    </button>
                    <!-- 移动跨天 -->
                    <select
                      class="text-[11px] px-1 py-1 rounded border border-gray-200 bg-white text-gray-500 outline-none"
                      :value="di"
                      @change="moveNode(trip.id, di, node.id, Number($event.target.value))"
                    >
                      <option :value="di">移动至…</option>
                      <option v-for="(d2, j) in trip.days" :key="j" :value="j">Day {{ j + 1 }}</option>
                    </select>
                    <button class="text-[11px] px-2 py-1 rounded-full border border-gray-200 text-gray-400 hover:text-red-600" @click="removeNode(trip.id, di, node.id)">删除</button>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 bg-gray-50 rounded-xl p-3">这一天还没有安排，点「＋ 加节点」添加，或让 AI 管家帮你规划。</p>
          </div>
        </div>

        <!-- 加节点表单 -->
        <div v-if="nodeForm.open" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 mb-4 text-sm">为 Day {{ nodeForm.dayIndex + 1 }} 添加节点</h3>
          <div class="grid sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <input v-model="nodeForm.name" type="text" placeholder="节点名称（必填）" class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none text-sm" />
            </div>
            <div class="flex gap-2">
              <button class="flex-1 h-10 rounded-xl border text-sm" :class="nodeForm.type === 'activity' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 text-gray-500'" @click="nodeForm.type = 'activity'">📌 活动</button>
              <button class="flex-1 h-10 rounded-xl border text-sm" :class="nodeForm.type === 'service' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 text-gray-500'" @click="nodeForm.type = 'service'">🛎️ 服务预订</button>
            </div>
            <input v-model="nodeForm.time" type="text" placeholder="时间（如 09:00）" class="h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none text-sm" />
            <input v-model="nodeForm.location" type="text" placeholder="地点" class="h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none text-sm" />
            <input v-model="nodeForm.price" type="text" placeholder="价格（如 ¥50/人）" class="h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none text-sm" />
            <div class="sm:col-span-2">
              <input v-model="nodeForm.note" type="text" placeholder="备注" class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 outline-none text-sm" />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-4">
            <button class="px-4 h-10 rounded-full border border-gray-200 text-sm text-gray-500" @click="nodeForm.open = false">取消</button>
            <button class="px-5 h-10 rounded-full bg-red-600 text-white text-sm font-medium" @click="saveNode">保存节点</button>
          </div>
        </div>
      </main>

      <!-- 右侧：同行 & 订单 -->
      <aside class="space-y-4 lg:sticky lg:top-24">
        <!-- Tab -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="flex border-b border-gray-100">
            <button
              class="flex-1 py-3 text-sm font-medium"
              :class="rightTab === 'companion' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'"
              @click="rightTab = 'companion'"
            >
              🤝 同行（{{ trip.companions.length }}）
            </button>
            <button
              class="flex-1 py-3 text-sm font-medium"
              :class="rightTab === 'order' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'"
              @click="rightTab = 'order'"
            >
              🧾 关联订单（{{ orders.length }}）
            </button>
          </div>

          <!-- 同行面板 -->
          <div v-if="rightTab === 'companion'" class="p-4">
            <div class="flex gap-2 mb-3">
              <input v-model="compForm.name" type="text" placeholder="输入同行人昵称" class="flex-1 h-10 px-3 rounded-xl bg-gray-100 outline-none text-sm focus:bg-white focus:ring-1 focus:ring-red-500" />
              <button class="px-3 h-10 rounded-xl bg-red-600 text-white text-sm" @click="inviteCompanion">邀请</button>
            </div>
            <select v-model="compForm.role" class="w-full h-10 mb-3 px-3 rounded-xl border border-gray-200 text-sm text-gray-600 outline-none">
              <option value="edit">可编辑行程</option>
              <option value="view">仅查看行程</option>
              <option value="notify">仅接收通知</option>
            </select>

            <div v-if="trip.companions.length" class="space-y-2">
              <div v-for="c in trip.companions" :key="c.name" class="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                <span class="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0">{{ c.avatar }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-800">{{ c.name }}</p>
                  <select
                    :value="c.role"
                    class="text-[11px] mt-0.5 px-1 py-0.5 rounded border border-gray-200 bg-white text-gray-500 outline-none"
                    @change="setCompanionRole(trip.id, c.name, $event.target.value)"
                  >
                    <option value="edit">可编辑</option>
                    <option value="view">仅查看</option>
                    <option value="notify">仅通知</option>
                  </select>
                </div>
                <button class="text-gray-300 hover:text-red-600 text-xs" @click="removeCompanion(trip.id, c.name)">✕</button>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 py-2">还没有同行人，邀请家人朋友一起协同这份旅程。</p>

            <!-- 讨论区 -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <p class="text-xs font-semibold text-gray-700 mb-2">同行讨论区</p>
              <div v-if="trip.comments.length" class="space-y-2 mb-3 max-h-40 overflow-y-auto">
                <div v-for="cm in [...trip.comments].reverse()" :key="cm.id" class="bg-gray-50 rounded-xl p-2.5">
                  <p class="text-xs font-medium text-gray-700">{{ cm.user }} <span class="text-gray-400 font-normal">· {{ fmtTime(cm.time) }}</span></p>
                  <p class="text-xs text-gray-600 mt-0.5">{{ cm.text }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <input v-model="commentText" type="text" placeholder="参与讨论…" class="flex-1 h-10 px-3 rounded-xl bg-gray-100 outline-none text-sm" @keyup.enter="postComment" />
                <button class="px-3 h-10 rounded-xl bg-gray-900 text-white text-sm" @click="postComment">发送</button>
              </div>
            </div>
          </div>

          <!-- 订单面板 -->
          <div v-if="rightTab === 'order'" class="p-4">
            <div v-if="orders.length" class="space-y-2">
              <div v-for="o in orders" :key="o.id" class="bg-gray-50 rounded-xl p-3">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium text-gray-800">{{ o.itemName }}</p>
                  <span class="text-[11px] px-2 py-0.5 rounded-full" :class="orderStatusMap[o.status]?.cls">{{ orderStatusMap[o.status]?.label }}</span>
                </div>
                <p class="text-xs text-gray-400 mt-1">订单号 {{ o.id }} · {{ o.date }} · {{ o.amount }}</p>
                <button class="text-[11px] mt-2 px-2.5 py-1 rounded-full bg-red-600 text-white" @click="router.push(`/orders?focus=${o.id}`)">查看订单</button>
              </div>
            </div>
            <p v-else class="text-xs text-gray-400 py-2">本旅程还没有绑定订单。可从时间线的「去预订」按钮预订，下单后自动绑定到旅程。</p>
            <button
              class="w-full mt-3 h-11 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              @click="router.push('/stay?journey=' + trip.id)"
            >
              去预订住宿
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- 底部固定工具箱 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 z-40">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto">
        <button class="shrink-0 px-4 h-10 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700" @click="exportTripPdf(trip.id)">📄 导出 PDF</button>
        <button class="shrink-0 px-4 h-10 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-red-500 hover:text-red-600" @click="doShare">🔗 分享行程</button>
        <button class="shrink-0 px-4 h-10 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-red-500 hover:text-red-600" @click="doDuplicate">♻️ 复刻行程</button>
        <button
          class="shrink-0 px-4 h-10 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-red-500 hover:text-red-600"
          @click="setStatus(trip.id, 'finished')"
        >
          📦 归档
        </button>
        <div class="flex-1"></div>
        <span class="text-xs text-gray-400 hidden sm:block">状态流转：草稿→待出发→进行中→已结束</span>
        <!-- 推进状态按钮：按当前状态顺次流转 draft→ready→ongoing→finished；已结束后隐藏该按钮 -->
        <button
          v-if="trip.status !== 'finished'"
          class="shrink-0 px-5 h-10 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-black"
          @click="setStatus(trip.id, trip.status === 'draft' ? 'ready' : trip.status === 'ready' ? 'ongoing' : 'finished')"
        >
          推进状态 →
        </button>
      </div>
    </div>
  </div>
</template>
