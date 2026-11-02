<script setup>
// 首页：以「开启新旅程」为主线，聚合我的最近旅程、快速预订入口、行程模板推荐，以及热门景点与成都笔记
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AttractionGrid from '@/components/AttractionGrid.vue'
import NoteSection from '@/components/NoteSection.vue'
import { templates } from '@/data/templates'
import { useTripStore, tripStatusMap } from '@/store/trip'
import { useUserStore } from '@/store/user'

const router = useRouter()
const tripStore = useTripStore()
const userStore = useUserStore()

// 最近旅程：取旅程存储中最新的前 3 条，用于右侧「我的旅程」卡片预览（复制后再截取，避免改动原数组顺序）
const recentTrips = computed(() => [...tripStore.trips].slice(0, 3))
</script>

<template>
  <div>
    <!-- ===== 首屏：旅程优先 ===== -->
    <section class="relative min-h-[520px] overflow-hidden">
      <img src="/images/hero.jpg" alt="成都" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60"></div>

      <div class="relative h-full max-w-7xl mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-8">
        <!-- 左：开启新旅程 -->
        <div class="lg:flex-1 text-white">
          <p class="text-xs sm:text-sm tracking-[0.5em] uppercase mb-4 text-red-200 font-medium">
            Journey First · 以旅程为中心
          </p>
          <h1 class="text-4xl sm:text-5xl font-black tracking-widest mb-4 drop-shadow-lg leading-tight">
            开启一段<span class="text-red-400">新旅程</span>
          </h1>
          <p class="text-base text-white/90 max-w-md leading-relaxed mb-8">
            不是来搜酒店，而是来构思一趟旅行。AI 管家全程随行，预订只是行程里的一个动作。
          </p>

          <div class="flex flex-wrap gap-3">
            <button
              class="px-7 h-12 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 hover:shadow-xl transition-all"
              @click="router.push('/trips/new')"
            >
              ✨ AI 帮我规划
            </button>
            <button
              class="px-7 h-12 rounded-full bg-white/15 backdrop-blur border border-white/40 text-white font-semibold hover:bg-white/25 transition-all"
              @click="router.push('/trips/new')"
            >
              📝 空白自建行程
            </button>
          </div>
        </div>

        <!-- 右：我的旅程 -->
        <div class="w-full max-w-md lg:w-96 bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900 flex items-center gap-2">📋 我的旅程</h3>
            <button class="text-xs text-red-600 hover:text-red-700 font-medium" @click="router.push('/trips')">
              查看全部 →
            </button>
          </div>

          <!-- 已有旅程时：列表预览最近 3 份旅程，点击卡片进入对应旅程详情 -->
          <div v-if="recentTrips.length" class="space-y-2.5">
            <button
              v-for="t in recentTrips"
              :key="t.id"
              class="w-full flex items-center gap-3 bg-gray-50 rounded-2xl p-3 hover:bg-red-50/50 transition-colors text-left"
              @click="router.push(`/trip/${t.id}`)"
            >
              <span class="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0">🧳</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-semibold text-gray-800 truncate">{{ t.name }}</p>
                  <span class="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-medium" :class="tripStatusMap[t.status]?.cls">
                    {{ tripStatusMap[t.status]?.label }}
                  </span>
                </div>
                <p class="text-xs text-gray-400 mt-0.5 truncate">
                  📍 {{ t.destination }}<template v-if="t.startDate"> · {{ t.startDate }}</template>
                </p>
              </div>
              <span class="text-gray-300">›</span>
            </button>
          </div>
          <!-- 尚无旅程时：空状态引导，点击直接跳转新建旅程页 -->
          <button
            v-else
            class="w-full py-8 text-center rounded-2xl border border-dashed border-gray-200 hover:border-red-400 transition-colors"
            @click="router.push('/trips/new')"
          >
            <span class="block text-3xl mb-2">🧳</span>
            <span class="text-sm text-gray-500">还没有旅程，开启一段新的吧</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== 第二屏：快速预订（弱化） ===== -->
    <section class="max-w-7xl mx-auto px-4 py-10">
      <p class="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <span class="text-gray-300">|</span> 快速预订 <span class="text-gray-400 text-xs">（如果你已经想好去哪住、去哪玩）</span>
      </p>
      <div class="grid sm:grid-cols-2 gap-4">
        <button
          class="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:border-red-200 transition-all text-left"
          @click="router.push('/stay')"
        >
          <span class="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl shrink-0">🛎️</span>
          <div class="flex-1">
            <p class="font-bold text-gray-900 group-hover:text-red-600">酒店预订</p>
            <p class="text-xs text-gray-400 mt-0.5">从奢华酒店到川西民宿</p>
          </div>
          <span class="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <button
          class="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:border-red-200 transition-all text-left"
          @click="router.push('/strategy')"
        >
          <span class="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl shrink-0">🎫</span>
          <div class="flex-1">
            <p class="font-bold text-gray-900 group-hover:text-red-600">门票 · 景点攻略</p>
            <p class="text-xs text-gray-400 mt-0.5">看攻略、查门票，热门景点</p>
          </div>
          <span class="text-gray-300 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </section>

    <!-- ===== 第三屏：灵感模板推荐 ===== -->
    <section class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">看看别人好用的行程模板</h2>
            <p class="text-gray-500 text-sm mt-1">一键复刻，变成你自己的草稿旅程</p>
          </div>
          <button class="text-sm text-red-600 hover:text-red-700 font-medium" @click="router.push('/inspiration')">
            全部模板 →
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <button
            v-for="t in templates.slice(0, 3)"
            :key="t.id"
            class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-left"
            @click="router.push('/inspiration')"
          >
            <div class="relative overflow-hidden aspect-[16/9]">
              <img :src="t.cover" :alt="t.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-red-600">{{ t.tag }}</span>
            </div>
            <div class="p-4">
              <h3 class="text-sm font-bold text-gray-900 group-hover:text-red-600 leading-snug">{{ t.name }}</h3>
              <p class="text-xs text-gray-400 mt-1.5">{{ t.days }} 天 · 预算{{ t.budget }}</p>
              <span class="inline-block mt-2 text-xs font-medium text-red-600">复刻模板 →</span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- ===== 保留：热门景点 & 成都笔记 ===== -->
    <AttractionGrid />
    <NoteSection />
  </div>
</template>
