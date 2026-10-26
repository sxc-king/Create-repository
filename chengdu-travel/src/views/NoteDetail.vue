<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notes } from '@/data'
import { noteDetails } from '@/details'

const route = useRoute()
const router = useRouter()
const id = computed(() => Number(route.params.id))
const note = computed(() => notes.find((n) => n.id === id.value) || notes[0])
const detail = computed(() => noteDetails[id.value] || noteDetails[1])

const authors = ['成都小探长', '巴适妹儿', '巷子里的猫', '熊猫控阿川', '慢游成都', '蜀地旅人']
const author = computed(() => authors[(note.value.id - 1) % authors.length])
</script>

<template>
  <article class="max-w-3xl mx-auto px-4 py-10">
    <!-- 顶部大图 -->
    <div class="relative rounded-2xl overflow-hidden aspect-[16/9] mb-6">
      <img :src="note.img" :alt="note.title" class="w-full h-full object-cover" />
      <span class="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-medium">
        {{ note.tag }}
      </span>
    </div>

    <!-- 标题 -->
    <h1 class="text-2xl sm:text-3xl font-black text-gray-900 leading-snug">{{ note.title }}</h1>

    <!-- 作者信息 -->
    <div class="flex items-center gap-3 mt-4 pb-5 border-b border-gray-100">
      <span
        class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold shrink-0"
      >
        {{ author.charAt(0) }}
      </span>
      <div class="flex-1">
        <p class="text-sm font-semibold text-gray-800">{{ author }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ note.tag }} · 成都文旅</p>
      </div>
      <button
        class="text-xs px-4 h-9 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
        @click="router.push('/')"
      >
        关注
      </button>
    </div>

    <!-- 正文 -->
    <div class="py-6">
      <p class="text-gray-700 leading-loose">{{ detail.body }}</p>
      <div class="mt-5 space-y-2">
        <p
          v-for="(p, i) in detail.points"
          :key="i"
          class="flex items-start gap-2 text-gray-600 text-sm leading-relaxed"
        >
          <span class="mt-1 text-red-500">•</span>
          <span>{{ p }}</span>
        </p>
      </div>
    </div>

    <!-- 互动栏 -->
    <div class="flex items-center gap-6 py-4 border-t border-gray-100 text-sm text-gray-500">
      <span class="flex items-center gap-1.5 hover:text-red-600 cursor-pointer">❤️ {{ 1200 + note.id * 380 }} 收藏</span>
      <span class="flex items-center gap-1.5 hover:text-red-600 cursor-pointer">💬 {{ 300 + note.id * 95 }} 评论</span>
      <span class="flex items-center gap-1.5 hover:text-red-600 cursor-pointer">↗️ 转发</span>
    </div>

    <!-- 相关笔记 -->
    <div class="mt-8 border-t border-gray-100 pt-6">
      <h3 class="text-sm font-bold text-gray-900 mb-4">更多笔记</h3>
      <div class="grid sm:grid-cols-2 gap-4">
        <router-link
          v-for="other in notes.filter((n) => n.id !== note.id).slice(0, 2)"
          :key="other.id"
          :to="`/note/${other.id}`"
          class="flex items-center gap-3 group bg-white rounded-xl border border-gray-100 p-3 hover:shadow-md transition-shadow"
        >
          <img :src="other.img" :alt="other.title" class="w-16 h-16 rounded-lg object-cover" />
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-800 group-hover:text-red-600 line-clamp-2 leading-snug">{{ other.title }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ other.tag }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 返回 -->
    <div class="mt-8">
      <button
        class="text-sm text-red-600 hover:text-red-700 font-medium"
        @click="router.push('/')"
      >
        ← 返回首页
      </button>
    </div>
  </article>
</template>
