import { reactive } from 'vue'

/**
 * 订单中心 —— 订单是旅程的子资源
 * 一笔订单可归属一份旅程；订单状态：待支付/已支付/已完成/已取消
 */
const ORDER_KEY = 'jm_orders'

/** 从本地存储读取订单列表（JSON 解析失败时回退为空数组） */
function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDER_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

const state = reactive({
  // orders：订单数组，按创建时间倒序，每笔订单可通过 journeyId 归属到某份旅程
  orders: loadOrders()
})

/** 将订单列表写回本地存储 */
function persist() {
  localStorage.setItem(ORDER_KEY, JSON.stringify(state.orders))
}

/** 订单状态标签映射：待支付 / 已支付 / 已完成 / 已取消 */
export const orderStatusMap = {
  pending: { label: '待支付', cls: 'bg-amber-100 text-amber-600' },
  paid: { label: '已支付', cls: 'bg-green-100 text-green-600' },
  done: { label: '已完成', cls: 'bg-gray-200 text-gray-500' },
  cancelled: { label: '已取消', cls: 'bg-gray-100 text-gray-400' }
}

/** 订单类目映射：name 为类目名，verb 为该类目的动作文案，unit 为数量单位 */
export const orderCategoryMap = {
  stay: { name: '住宿', verb: '预订', unit: '间·晚' },
  attraction: { name: '景点门票', verb: '购票', unit: '张' },
  food: { name: '美食', verb: '订座', unit: '位' },
  shopping: { name: '购物', verb: '购买', unit: '件' },
  play: { name: '玩乐', verb: '订票', unit: '张' },
  guide: { name: '当地向导', verb: '预约', unit: '天' }
}

/** 生成订单号 */
function genOrderNo() {
  return 'JM' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10)
}

/**
 * 创建订单
 * info: { category, itemId, itemName, date, count, name, phone, payType, amount, journeyId }
 */
export function createOrder(info) {
  const order = {
    id: genOrderNo(),
    category: info.category,
    itemId: info.itemId,
    itemName: info.itemName,
    date: info.date || '',
    count: info.count || 1,
    name: info.name || '',
    phone: info.phone || '',
    payType: info.payType || '微信支付',
    amount: info.amount || '',
    journeyId: info.journeyId || '',
    status: 'paid', // 演示环境直接视为已支付
    createTime: Date.now()
  }
  state.orders.unshift(order)
  persist()
  return order
}

/** 修改指定订单的状态（pending / paid / done / cancelled） */
export function setOrderStatus(id, status) {
  const o = state.orders.find((o) => o.id === id)
  if (!o) return
  o.status = status
  persist()
}

/** 按订单号查找单笔订单 */
export function getOrder(id) {
  return state.orders.find((o) => o.id === id)
}

/** 按旅程 id 筛选其名下的全部订单 */
export function ordersByJourney(journeyId) {
  return state.orders.filter((o) => o.journeyId === journeyId)
}

/** 返回响应式订单状态（组件中可直接读取最新订单列表） */
export function useOrderStore() {
  return state
}
