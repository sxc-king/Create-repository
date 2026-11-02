<script setup>
// 热门景点区块组件：首页展示高分人气景点卡片网格，点击跳转景点详情页
// 数据源：@/data 中的 attractions 数组，每项含 id、img、name、tag、score、reviews、desc 字段
import { attractions } from '@/data'
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 py-16">
    <!-- 区块标题 -->
    <div class="flex items-end justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">热门景点</h2>
        <p class="text-gray-500 text-sm mt-2">成都必打卡 · 精选高分人气景点</p>
      </div>
      <router-link
        to="/strategy"
        class="hidden sm:block text-sm text-red-600 hover:text-red-700 font-medium"
      >
        查看攻略 →
      </router-link>
    </div>

    <!-- 景点卡片网格 -->
    <!-- 每项为可点击跳转景点详情的 router-link -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="item in attractions"
        :key="item.id"
        :to="`/attraction/${item.id}`"
        class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        <!-- 图片 -->
        <div class="relative overflow-hidden aspect-[4/3]">
          <img
            :src="item.img"
            :alt="item.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span
            class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-red-600"
          >
            {{ item.tag }}
          </span>
        </div>

        <!-- 信息 -->
        <div class="p-4">
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
            {{ item.name }}
          </h3>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="text-amber-500 text-sm tracking-tight">★★★★★</span>
            <span class="text-sm font-semibold text-amber-600">{{ item.score }}分</span>
            <span class="text-xs text-gray-400">{{ item.reviews }}</span>
          </div>
          <p class="text-sm text-gray-500 mt-2 leading-relaxed">{{ item.desc }}</p>
          <span class="inline-block mt-3 text-xs font-medium text-red-600 group-hover:translate-x-1 transition-transform">
            查看详情 →
          </span>
        </div>
      </router-link>
    </div>
  </section>
</template>
