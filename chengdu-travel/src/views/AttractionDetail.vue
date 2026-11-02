<!-- 景点详情页：按路由参数 id 展示景点图文详情与购票信息，支持一键购票与把该景点加入我的旅程 -->
<script setup>
// 页面职责：从路由参数解析景点 id，聚合景点列表数据与详情数据，提供加入旅程（或新建草稿）能力
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { attractions } from '@/data'
import { attractionDetails } from '@/details'
import { useTripStore, addNode, createTrip } from '@/store/trip'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const tripStore = useTripStore()
const userStore = useUserStore()
// 路由参数 id 转数字后比对
const id = computed(() => Number(route.params.id))
// 景点基础信息：按 id 查找，找不到回退取列表第一项
const attraction = computed(() => attractions.find((a) => a.id === id.value) || attractions[0])
// 景点深度详情（简介/亮点/贴士/购票信息）：按 id 取，缺失时回退到 id 为 1 的详情
const detail = computed(() => attractionDetails[id.value] || attractionDetails[1])

// 加入行程
// 「加入我的旅程」面板显隐开关
const addVisible = ref(false)
// 下拉选中的目标旅程 id；留空代表新建草稿
const pickedTrip = ref('')
// 当前用户的全部旅程，供下拉选择
const myTrips = computed(() => tripStore.trips)

/** 把当前景点作为活动节点加入旅程：未选旅程则新建草稿后跳转，选中已有旅程则追加节点并提示 */
function addToTrip() {
  if (!pickedTrip.value) {
    // 未选择旅程，新建一份草稿
    const t = createTrip({
      name: `${attraction.value.name}之旅`,
      destination: '成都',
      tags: [attraction.value.tag],
      owner: userStore.username || '游客',
      source: 'blank',
      days: [{ title: '第 1 天', nodes: [] }]
    })
    addNode(t.id, 0, {
      type: 'activity', name: attraction.value.name, time: '09:00',
      location: detail.value.info.address.split('，')[0] || '成都',
      note: detail.value.info.duration + ' · ' + detail.value.info.ticket,
      price: detail.value.info.ticket, img: attraction.value.img
    })
    router.push(`/trip/${t.id}`)
  } else {
    // 已选目标旅程：直接在其第一天追加活动节点，收起面板并提示
    addNode(pickedTrip.value, 0, {
      type: 'activity', name: attraction.value.name, time: '09:00',
      location: detail.value.info.address.split('，')[0] || '成都',
      note: detail.value.info.duration + ' · ' + detail.value.info.ticket,
      price: detail.value.info.ticket, img: attraction.value.img
    })
    addVisible.value = false
    alert('已加入旅程，可在旅程时间线查看')
  }
}
</script>

<template>
  <div>
    <!-- 顶部横幅 -->
    <section class="relative h-[380px] overflow-hidden">
      <img :src="attraction.img" :alt="attraction.name" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40"></div>
      <div class="relative h-full max-w-6xl mx-auto px-4 flex flex-col justify-end text-white pb-10">
        <span class="inline-block w-fit px-3 py-1 rounded-full bg-red-600 text-xs font-medium mb-3">
          {{ attraction.tag }}
        </span>
        <h1 class="text-4xl sm:text-5xl font-black tracking-wide drop-shadow-lg">{{ attraction.name }}</h1>
        <div class="flex items-center gap-4 mt-3 text-sm">
          <span class="flex items-center gap-1">
            <span class="text-amber-400">★★★★★</span>
            <b class="text-amber-400">{{ attraction.score }}分</b>
          </span>
          <span class="text-white/80">{{ attraction.reviews }}</span>
          <span class="text-white/80">{{ detail.info.duration }}</span>
        </div>
      </div>
    </section>

    <!-- 主体内容 -->
    <section class="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
      <!-- 左：图文详情 -->
      <div class="lg:col-span-2 space-y-10">
        <!-- 简介 -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-red-600 rounded"></span> 景点简介
          </h2>
          <p class="text-gray-600 leading-relaxed">{{ detail.overview }}</p>
        </div>

        <!-- 亮点 -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-red-600 rounded"></span> 游玩亮点
          </h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="h in detail.highlights"
              :key="h.title"
              class="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">★</span>
                {{ h.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-2 leading-relaxed">{{ h.desc }}</p>
            </div>
          </div>
        </div>

        <!-- 小贴士 -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="w-1 h-6 bg-red-600 rounded"></span> 游玩贴士
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(tip, i) in detail.tips"
              :key="i"
              class="flex items-start gap-2 text-gray-600 text-sm"
            >
              <span class="mt-1 text-red-500">•</span>
              <span class="leading-relaxed">{{ tip }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右：订票信息 -->
      <aside class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-24">
          <h3 class="text-lg font-bold text-gray-900 mb-4">购票信息</h3>
          <ul class="space-y-3 text-sm">
            <li class="flex gap-3">
              <span class="text-gray-400 w-16 shrink-0">地址</span>
              <span class="text-gray-700 leading-relaxed">{{ detail.info.address }}</span>
            </li>
            <li class="flex gap-3">
              <span class="text-gray-400 w-16 shrink-0">开放时间</span>
              <span class="text-gray-700 leading-relaxed">{{ detail.info.open }}</span>
            </li>
            <li class="flex gap-3">
              <span class="text-gray-400 w-16 shrink-0">门票</span>
              <span class="text-gray-700 leading-relaxed">{{ detail.info.ticket }}</span>
            </li>
            <li class="flex gap-3">
              <span class="text-gray-400 w-16 shrink-0">交通</span>
              <span class="text-gray-700 leading-relaxed">{{ detail.info.transport }}</span>
            </li>
          </ul>
          <div class="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <button
              class="w-full h-12 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              @click="router.push(`/order/attraction/${attraction.id}`)"
            >
              立即购票
            </button>
            <button
              class="w-full h-12 rounded-full border border-red-600 text-red-600 font-medium hover:bg-red-50 transition-colors"
              @click="addVisible = !addVisible"
            >
              ＋ 加入我的旅程
            </button>
            <!-- 加入行程面板 -->
            <div v-if="addVisible" class="bg-gray-50 rounded-xl p-3">
              <p class="text-xs text-gray-500 mb-2">选择要加入的旅程（留空则新建草稿）</p>
              <select v-model="pickedTrip" class="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none">
                <option value="">＋ 新建一份草稿旅程</option>
                <option v-for="t in myTrips" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
              <button class="w-full mt-2 h-10 rounded-xl bg-red-600 text-white text-sm" @click="addToTrip">确认加入</button>
            </div>
            <p class="text-xs text-gray-400 text-center">门票价格以景区官方实时公示为准</p>
          </div>
        </div>

        <!-- 其他景点推荐 -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 class="text-sm font-bold text-gray-900 mb-3">更多人气景点</h3>
          <div class="space-y-2">
            <router-link
              v-for="other in attractions.filter((a) => a.id !== attraction.id).slice(0, 3)"
              :key="other.id"
              :to="`/attraction/${other.id}`"
              class="flex items-center gap-3 group rounded-xl p-2 hover:bg-red-50 transition-colors"
            >
              <img :src="other.img" :alt="other.name" class="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-800 group-hover:text-red-600 truncate">{{ other.name }}</p>
                <p class="text-xs text-amber-600 mt-0.5">★ {{ other.score }}</p>
              </div>
              <span class="text-xs text-red-600 font-medium shrink-0 group-hover:translate-x-1 transition-transform">
                查看 →
              </span>
            </router-link>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
