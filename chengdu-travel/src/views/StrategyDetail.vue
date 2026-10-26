<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { strategies } from '@/data'
import { strategyDetails } from '@/details'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))
const strategy = computed(() => strategies.find((s) => s.id === id.value) || strategies[0])
const detail = computed(() => strategyDetails[id.value] || strategyDetails[1])
</script>

<template>
  <div>
    <!-- 顶部横幅 -->
    <section class="relative h-[320px] overflow-hidden">
      <img :src="strategy.img" :alt="strategy.title" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"></div>
      <div class="relative h-full max-w-3xl mx-auto px-4 flex flex-col justify-end text-white pb-10">
        <span class="inline-block w-fit px-3 py-1 rounded-full bg-red-600 text-xs font-medium mb-3">
          {{ strategy.tag }}
        </span>
        <h1 class="text-3xl sm:text-4xl font-black leading-snug drop-shadow-lg">{{ strategy.title }}</h1>
        <div class="flex items-center gap-4 mt-4 text-xs text-white/80">
          <span>{{ strategy.days }}</span>
          <span>·</span>
          <span>{{ strategy.views }}</span>
          <span>·</span>
          <span>成都文旅</span>
        </div>
      </div>
    </section>

    <!-- 正文 -->
    <article class="max-w-3xl mx-auto px-4 py-12">
      <!-- 引言 -->
      <p class="text-gray-600 leading-loose border-l-4 border-red-500 pl-4 mb-10">
        {{ detail.intro }}
      </p>

      <!-- 各章节 -->
      <div v-for="(sec, i) in detail.sections" :key="i" class="mb-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span
            class="w-8 h-8 rounded-full bg-red-600 text-white text-sm flex items-center justify-center shrink-0"
          >
            {{ i + 1 }}
          </span>
          {{ sec.title }}
        </h2>
        <div class="space-y-3">
          <p v-for="(p, pi) in sec.paragraphs" :key="pi" class="text-gray-600 leading-loose">
            {{ p }}
          </p>
        </div>
      </div>

      <!-- 实用贴士 -->
      <div class="bg-orange-50 rounded-2xl p-6 border border-orange-100">
        <h3 class="font-bold text-orange-800 mb-3 flex items-center gap-2">💡 实用贴士</h3>
        <ul class="space-y-2">
          <li
            v-for="(tip, ti) in detail.tips"
            :key="ti"
            class="flex items-start gap-2 text-sm text-orange-700"
          >
            <span class="mt-1">•</span>
            <span class="leading-relaxed">{{ tip }}</span>
          </li>
        </ul>
      </div>

      <!-- 返回 / 相关攻略 -->
      <div class="mt-10 flex items-center justify-between">
        <button
          class="text-sm text-red-600 hover:text-red-700 font-medium"
          @click="router.push('/strategy')"
        >
          ← 返回攻略列表
        </button>
        <button
          class="text-sm px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
          @click="router.push('/stay')"
        >
          去预订住宿
        </button>
      </div>

      <!-- 相关攻略 -->
      <div class="mt-10 border-t border-gray-100 pt-6">
        <h3 class="text-sm font-bold text-gray-900 mb-4">相关攻略</h3>
        <div class="grid sm:grid-cols-2 gap-4">
          <router-link
            v-for="other in strategies.filter((s) => s.id !== strategy.id).slice(0, 2)"
            :key="other.id"
            :to="`/strategy/${other.id}`"
            class="flex items-center gap-3 group bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow"
          >
            <img :src="other.img" :alt="other.title" class="w-16 h-16 rounded-lg object-cover" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-800 group-hover:text-red-600 line-clamp-2 leading-snug">
                {{ other.title }}
              </p>
              <p class="text-xs text-gray-400 mt-1">{{ other.views }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </article>
  </div>
</template>
