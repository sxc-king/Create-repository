<script setup>
// 成都笔记区块组件：首页左右双列笔记卡片，点击跳转笔记详情页
// 数据源：@/data 中的 notes 数组，每项含 id、img、title、desc、tag 字段
import { notes } from '@/data'

// 作者昵称池与发布时间文案池：按笔记下标循环取用（演示数据，非真实关联）
const authors = ['成都小探长', '巴适妹儿', '巷子里的猫', '熊猫控阿川', '慢游成都', '蜀地旅人']
const times = ['2小时前', '昨天 14:30', '昨天 09:20', '3天前', '5天前']
</script>

<template>
  <section class="bg-gray-50 py-16">
    <div class="max-w-7xl mx-auto px-4">
      <!-- 区块标题 -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <h2 class="text-3xl font-bold text-gray-900">成都笔记</h2>
          <span class="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-medium">
            热门
          </span>
        </div>
        <a href="#" class="text-sm text-red-600 hover:text-red-700 font-medium">
          查看全部 →
        </a>
      </div>

      <!-- 笔记列表 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <router-link
          v-for="(note, index) in notes"
          :key="note.id"
          :to="`/note/${note.id}`"
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex"
        >
          <!-- 缩略图 -->
          <div class="relative w-44 sm:w-52 shrink-0 overflow-hidden">
            <img
              :src="note.img"
              :alt="note.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span
              class="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-medium text-white bg-red-600/90"
            >
              {{ note.tag }}
            </span>
          </div>

          <!-- 内容 -->
          <div class="flex-1 p-4 flex flex-col min-w-0">
            <!-- 作者 -->
            <div class="flex items-center gap-2 mb-2">
              <span
                class="w-6 h-6 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold shrink-0"
              >
                {{ authors[index % authors.length].charAt(0) }}
              </span>
              <span class="text-xs font-medium text-gray-700">{{ authors[index % authors.length] }}</span>
              <span class="text-[11px] text-gray-400">· {{ times[index % times.length] }}</span>
            </div>

            <h3
              class="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug"
            >
              {{ note.title }}
            </h3>
            <p class="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed flex-1">
              {{ note.desc }}
            </p>
            <!-- 互动数据：收藏 / 评论数按笔记 id 伪生成，保证同一笔记数值稳定 -->
            <div class="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span class="flex items-center gap-1">❤️ {{ 1200 + note.id * 380 }} 收藏</span>
              <span class="flex items-center gap-1">💬 {{ 300 + note.id * 95 }} 评论</span>
              <span class="flex items-center gap-1">↗️ 转发</span>
              <span class="ml-auto text-red-600 font-medium group-hover:translate-x-1 transition-transform">阅读 →</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>
