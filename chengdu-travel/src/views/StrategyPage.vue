<script setup>
// 攻略列表页：按网格展示全部旅游攻略，点击卡片跳转对应攻略详情页
import PageHero from '@/components/PageHero.vue'
// 直接引用全量攻略数据，本页不做分类筛选
import { strategies } from '@/data'
</script>

<template>
  <div>
    <!-- 栏目头图：背景大图 + 标题与副标题 -->
    <PageHero
      title="旅游攻略"
      subtitle="线路、美食、周边、夜游，一篇篇帮你把成都玩明白"
      image="/images/hero.jpg"
      badge="攻略合集"
    />

    <section class="max-w-7xl mx-auto px-4 py-14">
      <!-- 板块标题与攻略总数 -->
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">精选攻略</h2>
          <p class="text-gray-500 text-sm mt-1">收藏备用，出发不慌</p>
        </div>
        <span class="text-sm text-gray-400">共 {{ strategies.length }} 篇</span>
      </div>

      <!-- 攻略卡片网格：整张卡片为路由链接，点击进入对应攻略详情 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="item in strategies"
          :key="item.id"
          :to="`/strategy/${item.id}`"
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100"
        >
          <div class="relative overflow-hidden aspect-[16/9]">
            <img
              :src="item.img"
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-red-600">
              {{ item.tag }}
            </span>
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
              {{ item.days }}
            </span>
          </div>
          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{{ item.desc }}</p>
            <div class="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span>{{ item.views }}</span>
              <span class="text-red-600 font-medium group-hover:underline">阅读全文 →</span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>
