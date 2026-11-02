<script setup>
// AI 随行管家浮窗：绑定当前旅程上下文，支持对话问答与节点式行程调整
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { addNode, updateTrip } from '@/store/trip'

// props.trip：当前旅程对象（必填），作为对话上下文并接收新增节点
const props = defineProps({
  trip: { type: Object, required: true }
})
const router = useRouter()

// 对话消息列表：role 为 user 或 ai；ai 消息可附带 node（可加入行程的节点卡片）与 actions（跳转按钮组）
const messages = ref([
  { role: 'ai', text: '你好，我是你的随行旅行管家 🤖。我会跟随这份旅程，帮你查路线、调行程、做询价。你可以问我：' }
])
const input = ref('')

// 底部快捷提问语：点击即作为用户消息发送
const quickChips = [
  '帮我调整明天行程',
  '适合老人吃饭的地方',
  '看看酒店评价',
  '添加熊猫基地到 Day1',
  '安排一顿火锅'
]

/** 计算可加入的天数选项：按旅程已有天数生成 0 起始的索引数组 */
function dayOptions() {
  const n = props.trip.days?.length || 1
  return Array.from({ length: n }, (_, i) => i)
}

/** 向旅程指定天数追加活动节点，并在对话区回写一条 AI 确认消息
 *  @param name 节点名称
 *  @param dayIndex 目标天数索引，缺省落第 0 天
 *  @param node 节点扩展字段（时间／地点／备注／价格／图片）
 */
function addSuggestedNode(name, dayIndex, node = {}) {
  const target = dayIndex != null ? dayIndex : 0
  addNode(props.trip.id, target, { type: 'activity', name, ...node })
  messages.value.push({ role: 'ai', text: `已把「${name}」添加到第 ${target + 1} 天 👌 可在中间时间线里继续编辑时间、备注。` })
}

/** 发送用户消息，并按本地关键词规则匹配回复（演示规则，无真实后端） */
function handleSend(text) {
  const t = (text ?? input.value).trim()
  if (!t) return
  input.value = ''
  messages.value.push({ role: 'user', text: t })

  let reply = null
  // 识别「调整行程节奏」意图
  if (/调整|节奏|松|快/.test(t)) {
    reply = { text: '好的，我来帮你优化节奏：建议把相邻的「红墙竹影」和「春熙路」放同一天，减少来回奔波；晚餐后去「安顺廊桥」看夜景，一天更饱满。要我直接调整吗？' }
  // 识别「适老出行」意图，回复平缓选项并附带可加入行程的节点
  } else if (/老人|长辈|少走路/.test(t)) {
    reply = { text: '适合老人的选项：人民公园鹤鸣茶社（平缓）、夜游锦江（乘船不走路）、宽窄巷子（老街平路）。', node: { name: '人民公园鹤鸣茶社', note: '盖碗茶+采耳，长辈友好', price: '人均¥30', img: '/images/play-park.jpg' } }
  // 识别「酒店评价」意图，回复评价摘要并给出预订操作按钮
  } else if (/酒店评价/.test(t)) {
    reply = { text: '以下是本站该酒店的示意评价摘要（真实产品来自节点式评价库）：隔音、早餐、位置是住客最关心的三项。建议预订前在「订单中心」核对退改规则。', actions: ['去预订住宿'] }
  // 识别「大熊猫基地」意图，回复预约提示并附带景点节点
  } else if (/熊猫/.test(t)) {
    reply = { text: '大熊猫基地：开园即进看滚滚，上午最活跃，建议提前线上实名预约。', node: { name: '成都大熊猫繁育研究基地', time: '08:00', location: '熊猫大道', note: '提前3天预约，上午看宝宝', price: '¥55/人', img: '/images/panda.jpg' } }
  // 识别「美食推荐」意图，回复餐厅清单并附带就餐节点
  } else if (/火锅|吃饭|美食|吃/.test(t)) {
    reply = { text: '推荐：老码头火锅（人均¥95）、马路边边串串（人均¥65）、陈麻婆豆腐（人均¥58）。', node: { name: '老码头火锅', time: '12:00', location: '春熙路', note: '牛油红锅，本地口碑', price: '人均¥95', img: '/images/hotpot.jpg' } }
  // 识别「天气人流」意图，回复限流与闭园提醒
  } else if (/天气|人流|闭园/.test(t)) {
    reply = { text: '⚠️ 提醒：节假日大熊猫基地、武侯祠人流量大，可能临时限流；如遇景区闭园，AI 会自动给出替换方案。出发前建议查看景区官方公告。' }
  // 未命中以上意图时，回复能力说明并引导使用快捷指令
  } else {
    reply = { text: '收到。我可以帮你：① 调整行程节奏 ② 推荐适合老人/孩子的安排 ③ 添加美食或景点节点 ④ 对酒店做询价。你可以点下方快捷指令，或直接告诉我要加什么。' }
  }

  messages.value.push({ role: 'ai', text: reply.text, node: reply.node, actions: reply.actions || [] })
}

/** 把 AI 推荐的节点卡片写入用户选择的某一天 */
function addToDay(dayIndex, node) {
  addSuggestedNode(node.name, dayIndex, { time: node.time, location: node.location, note: node.note, price: node.price, img: node.img })
}
/** 跳转住宿页，from 参数标记来源于行程详情 */
function goStay() {
  router.push('/stay?from=trip')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 头部 -->
    <div class="p-4 border-b border-gray-100">
      <h3 class="text-sm font-bold text-gray-900 flex items-center gap-1.5">
        🤖 AI 随行管家
        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
      </h3>
      <p class="text-xs text-gray-400 mt-0.5">上下文已绑定当前旅程「{{ trip.name }}」</p>
    </div>

    <!-- 对话区 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3">
      <!-- 消息气泡：用户靠右红色，AI 靠左灰色 -->
      <div
        v-for="(m, i) in messages"
        :key="i"
        :class="m.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
      >
        <div
          :class="m.role === 'user'
            ? 'bg-red-600 text-white rounded-2xl rounded-br-sm px-3.5 py-2.5 max-w-[85%] text-sm'
            : 'bg-gray-100 text-gray-700 rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[85%] text-sm leading-relaxed'"
        >
          {{ m.text }}
          <!-- AI 推荐节点卡片：展示缩略图与名称价格，可选择加入某一天 -->
          <div v-if="m.node" class="mt-2 pt-2 border-t border-current/10 border-white/20">
            <div class="flex items-center gap-2">
              <img v-if="m.node.img" :src="m.node.img" class="w-9 h-9 rounded-lg object-cover" />
              <div class="min-w-0">
                <p class="text-xs font-semibold">{{ m.node.name }}</p>
                <p class="text-[11px] opacity-80">{{ m.node.price }}</p>
              </div>
            </div>
            <div class="flex gap-2 mt-2">
              <button
                v-for="d in dayOptions()"
                :key="d"
                class="text-[11px] px-2.5 py-1 rounded-full bg-white/90 text-red-600 hover:bg-white"
                @click="addToDay(d, m.node)"
              >
                加入第 {{ d + 1 }} 天
              </button>
            </div>
          </div>
          <!-- AI 推荐操作按钮：点击跳转对应业务页 -->
          <div v-if="m.actions" class="flex gap-2 mt-2 flex-wrap">
            <button
              v-for="a in m.actions"
              :key="a"
              class="text-[11px] px-3 py-1.5 rounded-full bg-white text-red-600 hover:bg-red-50"
              @click="a === '去预订住宿' ? goStay() : null"
            >
              {{ a }} →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷指令 -->
    <div class="px-4 pb-2 flex flex-wrap gap-1.5">
      <button
        v-for="c in quickChips"
        :key="c"
        class="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600 transition-colors"
        @click="handleSend(c)"
      >
        {{ c }}
      </button>
    </div>

    <!-- 输入框 -->
    <div class="p-3 border-t border-gray-100 flex items-center gap-2">
      <input
        v-model="input"
        type="text"
        placeholder="问我：调整明天行程 / 适合老人吃饭的地方…"
        class="flex-1 h-10 px-3 rounded-xl bg-gray-100 outline-none text-sm placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-red-500"
        @keyup.enter="handleSend(input)"
      />
      <button
        class="w-10 h-10 shrink-0 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
        @click="handleSend(input)"
      >
        ➤
      </button>
    </div>
  </div>
</template>
