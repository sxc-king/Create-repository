<!-- AI 旅行管家页：对话式生成差异化行程方案，支持方案切换、询价卡片预订与一键采纳为旅程草稿 -->
<script setup>
// 页面职责：基于本地规则引擎解析用户需求并产出 2 版方案，管理对话消息流与方案页签切换
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import { generatePlans, adjustHint } from '@/ai/assistant'
import { createTrip } from '@/store/trip'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 对话消息列表：role 为 user 或 ai；ai 消息可携带 plans 方案集、cards 询价卡片与 risks 风险提示
const messages = ref([])
// 底部输入框内容
const input = ref('')
// 每个方案消息当前展示第几版：key 为 planId，value 为下标，用 reactive 以便对象属性响应式更新
const planTab = reactive({})

// 快捷示例问句：点击即直接发送，降低输入门槛
const examples = [
  '国庆带老人去成都，5天，节奏慢一点，少走路',
  '带孩子去成都，3天亲子游，预算中等',
  '吃货成都3日游，慢节奏吃遍美食',
  '想去青城山徒步，成都周边2天'
]

onMounted(() => {
  // 从「新建旅程→AI帮我规划」带参进入时，自动预填并生成
  const q = route.query
  if (q.destination && q.startDate) {
    const tags = (q.tags || '').split(',').filter(Boolean)
    const reqText = `${tags.join('、')}去${q.destination}，${dayHint(q.startDate, q.endDate)}天，预算${q.budget}`
    send(reqText, true)
  } else {
    messages.value = [{ role: 'ai', text: '你好，我是你的旅行管家 🤖。告诉我你的目的地、出行时间、同行人、预算和喜好，我帮你规划行程方案。' }]
  }
})

/** 根据起止日期换算行程天数：都有则按日期差加一天，算不出来或缺一个则默认 3 天 */
function dayHint(s, e) {
  if (s && e) {
    const d = (new Date(e) - new Date(s)) / 86400000 + 1
    return isNaN(d) ? '3' : String(Math.max(1, Math.round(d)))
  }
  return '3'
}

/** 规则引擎意图识别：命中规划相关关键词（目的地/天数/预算/同行人等）才走方案生成分支 */
function detectPlan(text) {
  return /(规划|方案|行程|天|成都|目的地|预算|带|去)/.test(text || '')
}

/**
 * 发送一条消息
 * @param {string} text 指定文本时用它（如示例点击/自动预填），否则取输入框内容
 * @param {boolean} silent 为真时不把用户消息上屏（自动预填场景，只展示 AI 回复）
 */
function send(text, silent) {
  const t = (text ?? input.value).trim()
  if (!t) return
  if (!silent) {
    messages.value.push({ role: 'user', text: t })
    input.value = ''
  }
  // 命中规划意图则调用规则引擎生成方案集与询价卡片，否则给通用引导回复
  if (detectPlan(t)) {
    const res = generatePlans(t)
    const mid = {
      role: 'ai',
      text: res.hint && res.hint !== '成都' ? `已为你生成成都演示方案（暂支持成都）：` : '根据你的需求，为你生成 2 版差异化方案，可切换查看：',
      plans: res.plans,
      cards: res.cards,
      risks: res.risks,
      planId: 'p' + Date.now()
    }
    // 新方案消息默认展示第一版
    planTab[mid.planId] = 0
    messages.value.push(mid)
  } else {
    messages.value.push({ role: 'ai', text: '我可以帮你规划行程、调整节奏、推荐美食与酒店。你可以直接说，例如：国庆带老人去成都5天，慢一点。' })
  }
}

/** 采纳某版方案：把方案天数写为一条新旅程草稿，并跳转到该旅程详情页 */
function adopt(plan, planId) {
  const msg = messages.value.find((m) => m.planId === planId)
  const cards = msg?.cards || []
  const name = route.query.name || `${plan.days[0]?.nodes?.[0]?.location ? plan.days[0].nodes[0].location.split(' ')[0] : '成都'}之旅`
  const trip = createTrip({
    name: name + (plan.name.includes('休闲') ? '（休闲版）' : '（紧凑版）'),
    destination: '成都',
    startDate: route.query.startDate || '',
    endDate: route.query.endDate || '',
    budget: route.query.budget || '',
    tags: (route.query.tags || '').split(',').filter(Boolean),
    owner: userStore.username || '游客',
    source: 'ai',
    days: plan.days
  })
  // 把询价卡片中可预订的服务节点补全 category/itemId（已含）
  messages.value.push({ role: 'ai', text: `已把「${plan.name}」采纳并存入我的旅程草稿 👉 `, link: `/trip/${trip.id}` })
  router.push(`/trip/${trip.id}`)
}

/** 从询价卡片跳转到对应商品的下单页，from=ai 标记来源 */
function bookCard(card) {
  router.push(`/order/${card.category}/${card.itemId || 1}?from=ai`)
}

/** 方案左右切换：dir 取 -1 或 1，按方案总数取模实现循环翻页 */
function nextPlan(planId, dir) {
  const idx = planTab[planId] || 0
  const msg = messages.value.find((m) => m.planId === planId)
  const n = msg?.plans?.length || 1
  planTab[planId] = (idx + dir + n) % n
}
</script>

<template>
  <div>
    <PageHero
      title="AI 旅行管家"
      subtitle="告诉我你的想法，帮你把一趟旅行安排得明明白白"
      image="/images/night.jpg"
      badge="AI 管家"
    />

    <section class="max-w-5xl mx-auto px-4 py-10">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- 头部 -->
        <div class="px-5 py-3 border-b border-gray-100 flex items-center gap-2 bg-gradient-to-r from-red-50 to-transparent">
          <span class="text-lg">🤖</span>
          <span class="text-sm font-bold text-gray-900">AI 旅行管家</span>
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span class="text-xs text-gray-400">在线 · 支持多轮对话与方案生成</span>
        </div>

        <!-- 对话区 -->
        <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <!-- 消息 -->
          <div v-for="(m, i) in messages" :key="i" :class="m.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div :class="m.role === 'user'
              ? 'bg-red-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%] text-sm'
              : 'max-w-[92%]'">
              <!-- 普通文本 -->
              <div v-if="!m.plans" class="bg-gray-100 text-gray-700 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed">
                {{ m.text }}
                <a v-if="m.link" :href="m.link" class="text-red-600 font-medium ml-1">查看 →</a>
              </div>

              <!-- 方案卡片 -->
              <div v-if="m.plans" class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p class="text-sm text-gray-700 mb-3">{{ m.text }}</p>

                <!-- 风险提示 -->
                <div v-if="m.risks && m.risks.length" class="mb-3 space-y-1.5">
                  <div
                    v-for="(r, ri) in m.risks"
                    :key="ri"
                    class="flex items-start gap-2 text-xs rounded-lg px-3 py-2"
                    :class="r.type === 'warn' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'"
                  >
                    <span>{{ r.type === 'warn' ? '⚠️' : 'ℹ️' }}</span>
                    <span>{{ r.text }}<span v-if="r.suggest" class="opacity-80">（{{ r.suggest }}）</span></span>
                  </div>
                </div>

                <!-- 方案切换 -->
                <div class="flex items-center gap-2 mb-3">
                  <button class="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:border-red-500" @click="nextPlan(m.planId, -1)">‹</button>
                  <span class="text-sm font-bold text-gray-900">{{ m.plans[planTab[m.planId] || 0].name }}</span>
                  <span class="text-xs text-gray-400">{{ m.plans[planTab[m.planId] || 0].desc }}</span>
                  <button class="w-7 h-7 rounded-full border border-gray-200 text-gray-500 hover:border-red-500" @click="nextPlan(m.planId, 1)">›</button>
                </div>

                <!-- 时间线预览 -->
                <div class="space-y-2 mb-4">
                  <div v-for="(day, di) in m.plans[planTab[m.planId] || 0].days" :key="di" class="bg-white rounded-xl border border-gray-100 p-3">
                    <p class="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                      <span class="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px]">Day {{ di + 1 }}</span>
                      {{ day.title }}
                    </p>
                    <div class="space-y-1.5">
                      <div v-for="(node, ni) in day.nodes" :key="ni" class="flex items-start gap-2 text-xs">
                        <span class="mt-0.5">{{ node.type === 'service' ? '🛎️' : '📌' }}</span>
                        <div class="flex-1">
                          <p class="text-gray-800 font-medium">{{ node.name }} <span class="text-gray-400 font-normal">{{ node.time }}</span></p>
                          <p class="text-gray-400">{{ node.note }}<template v-if="node.price"> · {{ node.price }}</template></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 询价卡片 -->
                <div v-if="m.cards && m.cards.length" class="mb-4">
                  <p class="text-xs text-gray-500 mb-2">💳 可预订商品（价格实时查询，库存以供应商为准，AI 不保证有房）</p>
                  <div class="grid sm:grid-cols-2 gap-2">
                    <button
                      v-for="(c, ci) in m.cards"
                      :key="ci"
                      class="flex items-center gap-2 bg-white rounded-xl border border-gray-100 p-2 hover:border-red-500 transition-colors text-left"
                      @click="bookCard(c)"
                    >
                      <img :src="c.img" class="w-10 h-10 rounded-lg object-cover" />
                      <div class="min-w-0 flex-1">
                        <p class="text-xs font-medium text-gray-800 truncate">{{ c.itemName }}</p>
                        <p class="text-[11px] text-red-600">{{ c.price }}<template v-if="c.score"> · ★{{ c.score }}</template></p>
                      </div>
                      <span class="text-[11px] text-red-600 shrink-0">去预订→</span>
                    </button>
                  </div>
                </div>

                <!-- 操作 -->
                <div class="flex flex-wrap gap-2">
                  <button
                    class="px-4 h-9 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700"
                    @click="adopt(m.plans[planTab[m.planId] || 0], m.planId)"
                  >
                    ✅ 采纳方案，存入我的旅程草稿
                  </button>
                  <button
                    class="px-4 h-9 rounded-full border border-gray-200 text-gray-600 text-xs hover:border-red-500 hover:text-red-600"
                    @click="input = '再紧凑一点，多加点景点'"
                  >
                    继续调整
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 示例 -->
        <div class="px-5 pb-2 flex flex-wrap gap-2">
          <button
            v-for="e in examples"
            :key="e"
            class="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600 transition-colors"
            @click="send(e)"
          >
            {{ e }}
          </button>
        </div>

        <!-- 输入 -->
        <div class="p-4 border-t border-gray-100 flex items-center gap-2">
          <input
            v-model="input"
            type="text"
            placeholder="例如：国庆带老人去成都，5天，节奏慢一点"
            class="flex-1 h-12 px-4 rounded-xl bg-gray-100 outline-none text-sm placeholder-gray-400 focus:bg-white focus:ring-1 focus:ring-red-500"
            @keyup.enter="send(input)"
          />
          <button
            class="h-12 px-6 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            @click="send(input)"
          >
            发送
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
