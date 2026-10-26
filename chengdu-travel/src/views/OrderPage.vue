<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { stays, foods, shoppings, plays, guides, attractions } from '@/data'

const route = useRoute()
const router = useRouter()

const categoryMap = {
  stay: { list: stays, name: '住宿', verb: '预订', unit: '间·晚' },
  food: { list: foods, name: '美食', verb: '订座', unit: '位' },
  shopping: { list: shoppings, name: '购物', verb: '购买', unit: '件' },
  play: { list: plays, name: '玩乐', verb: '订票', unit: '张' },
  guide: { list: guides, name: '当地向导', verb: '预约', unit: '天' },
  attraction: { list: attractions, name: '景点', verb: '购票', unit: '张' }
}

const cat = computed(() => categoryMap[route.params.category] || categoryMap.stay)
const id = computed(() => Number(route.params.id))
const item = computed(() => cat.value.list.find((i) => i.id === id.value) || cat.value.list[0])

const payType = ref('微信支付')
const date = ref('')
const name = ref('')
const phone = ref('')
const count = ref(1)
const paid = ref(false)
const orderNo = ref('')

const priceText = computed(() => item.value.price || '以实际为准')
const totalText = computed(() => {
  const m = String(item.value.price || '').match(/(\d+)/)
  return m ? `¥${Number(m[1]) * count.value}` : item.value.price
})

const payMethods = ['微信支付', '支付宝', '银联支付']

const placeOrder = () => {
  if (!name.value.trim() || !phone.value.trim() || !date.value) {
    alert('请填写完整预约信息（日期、联系人、手机号）')
    return
  }
  orderNo.value = 'CD' + Date.now().toString().slice(-8)
  paid.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-12">
    <!-- 成功提示 -->
    <div v-if="paid" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
      <div class="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto">
        ✓
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mt-4">支付成功</h2>
      <p class="text-gray-500 mt-2">恭喜您已完成{{ cat.verb }}，订单号：<b class="text-gray-700">{{ orderNo }}</b></p>

      <div class="max-w-md mx-auto mt-6 bg-gray-50 rounded-xl p-5 text-left text-sm">
        <div class="flex justify-between py-1.5"><span class="text-gray-400">项目</span><span class="text-gray-700 font-medium">{{ item.name }}</span></div>
        <div class="flex justify-between py-1.5"><span class="text-gray-400">使用日期</span><span class="text-gray-700">{{ date }}</span></div>
        <div class="flex justify-between py-1.5"><span class="text-gray-400">联系人</span><span class="text-gray-700">{{ name }}（{{ phone }}）</span></div>
        <div class="flex justify-between py-1.5"><span class="text-gray-400">支付方式</span><span class="text-gray-700">{{ payType }}</span></div>
        <div class="flex justify-between py-1.5 border-t border-gray-200 mt-1 pt-2"><span class="text-gray-400">实付金额</span><span class="text-red-600 font-bold">{{ totalText }}</span></div>
      </div>

      <div class="flex items-center justify-center gap-3 mt-8">
        <button
          class="px-6 h-11 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          @click="router.push(`/${route.params.category}`)"
        >
          返回列表
        </button>
        <button
          class="px-6 h-11 rounded-full border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600 transition-colors"
          @click="router.push('/')"
        >
          回首页
        </button>
      </div>
    </div>

    <!-- 订单表单 -->
    <div v-else class="grid lg:grid-cols-3 gap-6">
      <!-- 左：项目信息 -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="relative aspect-[4/3]">
            <img :src="item.img" :alt="item.name" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-red-600">
              {{ item.tag }}
            </span>
          </div>
          <div class="p-4">
            <h2 class="text-lg font-bold text-gray-900">{{ item.name }}</h2>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ item.desc }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-red-600 font-bold">{{ item.price }}</span>
              <span class="text-sm font-semibold text-amber-600">★ {{ item.score }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右：填写表单 -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-1">{{ cat.name }} · 确认订单</h2>
        <p class="text-sm text-gray-400 mb-6">{{ cat.verb }}前请核对以下信息，支持{{ payMethods.join(' / ') }}</p>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-gray-600 block mb-1.5">使用日期 <span class="text-red-500">*</span></label>
            <input v-model="date" type="date" class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm" />
          </div>
          <div>
            <label class="text-sm text-gray-600 block mb-1.5">{{ cat.unit }}数量</label>
            <div class="flex items-center gap-3 h-11">
              <button class="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600" @click="count = Math.max(1, count - 1)">−</button>
              <span class="w-8 text-center font-bold">{{ count }}</span>
              <button class="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600" @click="count++">＋</button>
            </div>
          </div>
          <div>
            <label class="text-sm text-gray-600 block mb-1.5">联系人 <span class="text-red-500">*</span></label>
            <input v-model="name" type="text" placeholder="请输入姓名" class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm" />
          </div>
          <div>
            <label class="text-sm text-gray-600 block mb-1.5">手机号 <span class="text-red-500">*</span></label>
            <input v-model="phone" type="tel" placeholder="请输入11位手机号" class="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none text-sm" />
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="mt-6">
          <label class="text-sm text-gray-600 block mb-2">支付方式</label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="m in payMethods"
              :key="m"
              class="px-5 h-11 rounded-xl border text-sm transition-colors"
              :class="payType === m ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              @click="payType = m"
            >
              {{ m }}
            </button>
          </div>
        </div>

        <!-- 金额 -->
        <div class="mt-6 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
          <span class="text-sm text-gray-500">应付金额</span>
          <span class="text-2xl font-black text-red-600">{{ totalText }}</span>
        </div>

        <button
          class="w-full h-12 mt-6 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          @click="placeOrder"
        >
          确认{{ cat.verb }}并支付
        </button>
        <p class="text-xs text-gray-400 text-center mt-3">示例价格，实际以商家/景区实时公示为准</p>
      </div>
    </div>
  </section>
</template>
