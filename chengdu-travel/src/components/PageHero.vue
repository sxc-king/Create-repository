<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, required: true },
  badge: { type: String, default: '' }
})
</script>

<template>
  <section class="relative h-[320px] overflow-hidden">
    <img :src="image" :alt="title" class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

    <div class="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center text-white">
      <span
        v-if="badge"
        class="inline-block w-fit px-3 py-1 rounded-full bg-red-600 text-xs font-medium mb-4"
      >
        {{ badge }}
      </span>
      <h1 class="text-4xl sm:text-5xl font-black tracking-wide drop-shadow-lg">{{ title }}</h1>
      <p v-if="subtitle" class="text-base text-white/90 mt-3 max-w-2xl leading-relaxed">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>
