<!-- 应用根组件：全站页面骨架（页头 + 路由视图 + 页脚） -->
<script setup>
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <!-- 页头固定在顶部，路由视图占满剩余高度，页脚沉底 -->
  <div class="min-h-screen bg-white text-gray-800 flex flex-col">
    <SiteHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <SiteFooter />
  </div>
</template>
