<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import { foods } from '@/data'

const router = useRouter()
const active = ref('全部')
const types = computed(() => ['全部', ...new Set(foods.map((s) => s.type))])
const list = computed(() =>
  active.value === '全部' ? foods : foods.filter((s) => s.type === active.value)
)
</script>

<template>
  <div>
    <PageHero
      title="成都美食"
      subtitle="火锅、串串、川菜、盖碗茶，吃懂成都的人间烟火"
      image="/images/food-chuanchuan.jpg"
      badge="美食图鉴"
    />

    <section class="max-w-7xl mx-auto px-4 py-14">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">必吃美食榜</h2>
          <p class="text-gray-500 text-sm mt-1">本地人私藏清单，照着吃就对了</p>
        </div>
        <span class="text-sm text-gray-400">共 {{ list.length }} 家</span>
      </div>

      <!-- 分类筛选 -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="t in types"
          :key="t"
          class="px-4 py-2 rounded-full text-sm transition-colors"
          :class="active === t ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="active = t"
        >
          {{ t }}
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in list"
          :key="item.id"
          class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100"
        >
          <div class="relative overflow-hidden aspect-[4/3]">
            <img
              :src="item.img"
              :alt="item.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-red-600">
              {{ item.tag }}
            </span>
            <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
              {{ item.type }}
            </span>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                {{ item.name }}
              </h3>
              <span class="text-sm font-semibold text-amber-600 shrink-0">★ {{ item.score }}</span>
            </div>
            <p class="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{{ item.desc }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-red-600 font-bold text-sm">{{ item.price }}</span>
              <button
                class="text-xs px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                @click="router.push(`/order/food/${item.id}`)"
              >
                去打卡
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
