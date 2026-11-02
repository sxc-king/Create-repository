<!-- 下单支付页：按路由参数 category 与 id 找到对应商品，填写预约信息后创建订单；若带 journey 查询参数则下单后自动回写绑定到旅程 -->
<script setup>
// 页面职责：通用下单页，六个分类（住宿/美食/购物/玩乐/向导/景点）共用同一套表单与支付成功回执
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { stays, foods, shoppings, plays, guides, attractions } from '@/data'
import { createOrder, orderCategoryMap } from '@/store/order'
import { getTrip, addNode } from '@/store/trip'
import { pushMessage } from '@/store/message'

const route = useRoute()
const router = useRouter()

// 分类映射：category 取值 → 对应数据源列表、中文名称、动作动词（预订/订座…）与计量单位
const categoryMap = {
  stay: { list: stays, name: '住宿', verb: '预订', unit: '间·晚' },
  food: { list: foods, name: '美食', verb: '订座', unit: '位' },
  shopping: { list: shoppings, name: '购物', verb: '购买', unit: '件' },
  play: { list: plays, name: '玩乐', verb: '订票', unit: '张' },
  guide: { list: guides, name: '当地向导', verb: '预约', unit: '天' },
  attraction: { list: attractions, name: '景点', verb: '购票', unit: '张' }
}

// 当前分类：非法 category 回退为住宿
const cat = computed(() => categoryMap[route.params.category] || categoryMap.stay)
// 商品 id：路由参数为字符串，转成数字再比对
const id = computed(() => Number(route.params.id))
// 当前下单商品：按 id 在该分类列表中查找，找不到则回退取列表第一项，避免空对象
const item = computed(() => cat.value.list.find((i) => i.id === id.value) || cat.value.list[0])

// 归属旅程（从查询参数读取）
// 旅程 id 来自 URL 的 journey 查询参数（由旅程页时间线「去预订」带入）
const journeyId = ref(route.query.journey || '')
// 反查归属旅程；为空则视为独立下单
const journey = computed(() => getTrip(journeyId.value))
// 是否勾选绑定到本旅程
const bindTrip = ref(true)

// 支付方式选中值
const payType = ref('微信支付')
// 使用日期、联系人姓名、手机号
const date = ref('')
const name = ref('')
const phone = ref('')
// 购买数量，最小为 1
const count = ref(1)
// 是否已支付：控制在「成功回执」与「下单表单」之间切换
const paid = ref(false)
// 支付成功后回显的订单号
const orderNo = ref('')

// 单价文案：无明确价格时提示以实际为准
const priceText = computed(() => item.value.price || '以实际为准')
// 应付金额文案：从价格字符串中正则抽取数字乘以数量；抽不到数字则原样展示
const totalText = computed(() => {
  const m = String(item.value.price || '').match(/(\d+)/)
  return m ? `¥${Number(m[1]) * count.value}` : item.value.price
})

// 可选支付方式列表（用于支付方式按钮组渲染）
const payMethods = ['微信支付', '支付宝', '银联支付']

/** 提交订单：先校验必填项，再创建并持久化订单，按需回写旅程服务节点并推送消息，最后切换到成功页 */
const placeOrder = () => {
  if (!name.value.trim() || !phone.value.trim() || !date.value) {
    alert('请填写完整预约信息（日期、联系人、手机号）')
    return
  }
  // 创建并持久化订单
  const order = createOrder({
    category: route.params.category,
    itemId: item.value.id,
    itemName: item.value.name,
    date: date.value,
    count: count.value,
    name: name.value.trim(),
    phone: phone.value.trim(),
    payType: payType.value,
    amount: totalText.value,
    journeyId: bindTrip.value && journey.value ? journey.value.id : ''
  })
  orderNo.value = order.id

  // 绑定旅程：回写服务节点 + 推送消息
  if (order.journeyId && journey.value) {
    // 服务节点统一挂到旅程第一天；若旅程尚无天数则不回写节点，仅推送订单消息
    const dayIndex = journey.value.days && journey.value.days.length ? 0 : -1
    if (dayIndex >= 0) {
      addNode(journey.value.id, dayIndex, {
        type: 'service',
        name: item.value.name,
        time: '已预订',
        location: journey.value.destination,
        note: `订单 ${order.id} · ${date.value}`,
        price: totalText.value,
        orderId: order.id,
        linked: true
      })
    }
    pushMessage({
      type: 'order',
      title: `订单已生成：${item.value.name}`,
      content: `已绑定旅程「${journey.value.name}」，可在旅程详情的时间线与关联订单面板查看。`,
      link: `/trip/${journey.value.id}`
    })
  } else {
    pushMessage({
      type: 'order',
      title: `订单已生成：${item.value.name}`,
      content: `订单号 ${order.id}，可在订单中心查看。`,
      link: '/orders'
    })
  }

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
        <div v-if="journey && bindTrip" class="flex justify-between py-1.5"><span class="text-gray-400">归属旅程</span><span class="text-blue-600 font-medium">{{ journey.name }}</span></div>
      </div>

      <div class="flex items-center justify-center gap-3 mt-8">
        <template v-if="journey && bindTrip">
          <button class="px-6 h-11 rounded-full bg-red-600 text-white font-medium hover:bg-red-700" @click="router.push(`/trip/${journey.id}`)">
            查看旅程
          </button>
          <button class="px-6 h-11 rounded-full border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600" @click="router.push('/orders')">
            去订单中心
          </button>
        </template>
        <template v-else>
          <button class="px-6 h-11 rounded-full bg-red-600 text-white font-medium hover:bg-red-700" @click="router.push(`/orders`)">
            去订单中心
          </button>
          <button class="px-6 h-11 rounded-full border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600" @click="router.push('/')">
            回首页
          </button>
        </template>
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
        <!-- 归属旅程提示条（连通核心） -->
        <div
          v-if="journey"
          class="mb-6 bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-sm"
        >
          <p class="text-blue-800 font-medium flex items-center gap-1.5">🧳 当前归属旅程：{{ journey.name }}</p>
          <p class="text-blue-600/90 text-xs mt-1">预订成功将自动绑定到旅程的服务节点，可随时在旅程页查看订单。AI 管家也会收到同步通知。</p>
          <label class="flex items-center gap-2 mt-2 text-xs text-blue-700 cursor-pointer">
            <input v-model="bindTrip" type="checkbox" class="accent-red-600" />
            绑定到本旅程（不勾选则作为独立订单）
          </label>
        </div>

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
        <p class="text-xs text-gray-400 text-center mt-3">示例价格，实际以商家/景区实时公示为准 · AI 不保证有房，库存以供应商为准</p>
      </div>
    </div>
  </section>
</template>
