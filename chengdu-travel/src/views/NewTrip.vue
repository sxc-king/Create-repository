<script setup>
// 新建旅程页：先填写旅程基础信息，再选择「AI 帮我规划」或「空白自建行程」两种创建方式
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import { createTrip } from '@/store/trip'
import { useUserStore } from '@/store/user'
import { prefOptions } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

// tagOptions：可选出行标签（多选），id 为标签文案、icon 为展示图标
const tagOptions = [
  { id: '亲子', icon: '👶' },
  { id: '老人友好', icon: '👵' },
  { id: '徒步', icon: '⛰️' },
  { id: '摄影', icon: '📷' },
  { id: '吃货', icon: '🍜' },
  { id: '慢节奏', icon: '🐢' },
  { id: '夜游', icon: '🌙' }
]

// budgetOptions：可选预算区间（单选）
const budgetOptions = ['经济', '中等', '舒适', '奢华']

// form：新建旅程表单，destination 默认成都，budget 默认中等，tags 为多选标签
const form = ref({
  name: '',
  destination: '成都',
  startDate: '',
  endDate: '',
  budget: '中等',
  tags: []
})

// err：表单校验失败时的错误文案，为空串表示校验通过
const err = ref('')

/** 切换某出行标签的选中状态（已选则移除，未选则追加） */
function toggleTag(t) {
  const i = form.value.tags.indexOf(t)
  if (i >= 0) form.value.tags.splice(i, 1)
  else form.value.tags.push(t)
}

/** 校验表单：依次检查目的地、出发日期、返程日期是否早于出发，返回错误文案，通过则返回空串 */
function validate() {
  if (!form.value.destination.trim()) return '请填写目的地'
  if (!form.value.startDate) return '请选择出发日期'
  if (form.value.endDate && form.value.startDate > form.value.endDate) return '返程日期不能早于出发日期'
  return ''
}

/** 空白自建：校验通过后创建一份只含第一天空节点的草稿旅程（source 为 blank），并跳转旅程详情页 */
function createBlank() {
  err.value = validate()
  if (err.value) return
  // 名称留空时自动按目的地生成「XX之旅」
  const name = form.value.name.trim() || `${form.value.destination}之旅`
  const trip = createTrip({
    name,
    destination: form.value.destination,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    budget: form.value.budget,
    tags: form.value.tags,
    owner: userStore.username || '游客',
    source: 'blank',
    days: [{ title: '第 1 天', nodes: [] }]
  })
  router.push(`/trip/${trip.id}`)
}

/** AI 帮我规划：校验通过后把表单参数拼到 URL 查询串，跳转 AI 管家页由其生成多版方案 */
function goAi() {
  err.value = validate()
  if (err.value) return
  const q = new URLSearchParams({
    name: form.value.name.trim() || `${form.value.destination}之旅`,
    destination: form.value.destination,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    budget: form.value.budget,
    tags: form.value.tags.join(',')
  })
  router.push(`/ai?${q.toString()}`)
}
</script>

<template>
  <div>
    <PageHero
      title="新建旅程"
      subtitle="先构思一趟旅行，再在行程里安排预订 —— 你的旅程你做主"
      image="/images/panda.jpg"
      badge="旅程中心"
    />

    <section class="max-w-3xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 class="text-xl font-bold text-gray-900 mb-1">第一步 · 旅程基础信息</h2>
        <p class="text-sm text-gray-400 mb-8">填写后，可选择「AI 帮我规划」或「空白自建行程」</p>

        <!-- 名称 -->
        <div class="mb-6">
          <label class="text-sm text-gray-600 block mb-1.5">旅程名称 <span class="text-gray-400">（可留空，自动生成）</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="例如：成都 5 日慢旅行"
            class="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm"
          />
        </div>

        <!-- 目的地 -->
        <div class="mb-6">
          <label class="text-sm text-gray-600 block mb-1.5">目的地 <span class="text-red-500">*</span></label>
          <input
            v-model="form.destination"
            type="text"
            placeholder="成都"
            class="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm"
          />
          <p class="text-xs text-gray-400 mt-1">当前演示数据支持成都目的地</p>
        </div>

        <!-- 日期 -->
        <div class="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="text-sm text-gray-600 block mb-1.5">出发日期 <span class="text-red-500">*</span></label>
            <input v-model="form.startDate" type="date" class="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-red-500 outline-none text-sm" />
          </div>
          <div>
            <label class="text-sm text-gray-600 block mb-1.5">返程日期</label>
            <input v-model="form.endDate" type="date" class="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-red-500 outline-none text-sm" />
          </div>
        </div>

        <!-- 预算 -->
        <div class="mb-6">
          <label class="text-sm text-gray-600 block mb-1.5">预算区间</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="b in budgetOptions"
              :key="b"
              class="px-5 h-11 rounded-xl border text-sm transition-colors"
              :class="form.budget === b ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              @click="form.budget = b"
            >
              {{ b }}
            </button>
          </div>
        </div>

        <!-- 标签 -->
        <div class="mb-8">
          <label class="text-sm text-gray-600 block mb-1.5">出行标签 <span class="text-gray-400">（可多选）</span></label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="t in tagOptions"
              :key="t.id"
              class="px-4 py-2 rounded-full border text-sm transition-colors"
              :class="form.tags.includes(t.id) ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              @click="toggleTag(t.id)"
            >
              {{ t.icon }} {{ t.id }}
            </button>
          </div>
        </div>

        <!-- 校验失败时展示错误提示 -->
        <p v-if="err" class="text-xs text-red-600 mb-4 bg-red-50 rounded-lg px-3 py-2">{{ err }}</p>

        <!-- 两个入口 -->
        <div class="grid sm:grid-cols-2 gap-4">
          <button
            class="h-14 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold hover:shadow-lg transition-all active:scale-[0.98]"
            @click="goAi"
          >
            ✨ AI 帮我规划
            <span class="block text-xs font-normal opacity-80 mt-0.5">输入需求，生成多版方案</span>
          </button>
          <button
            class="h-14 rounded-full border-2 border-red-600 text-red-600 font-semibold hover:bg-red-50 transition-colors active:scale-[0.98]"
            @click="createBlank"
          >
            📝 空白自建行程
            <span class="block text-xs font-normal mt-0.5 text-red-500">手动搭建你的时间线</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
