import { reactive } from 'vue'

/**
 * 旅程中心（一等公民）—— 旅程数据与业务逻辑
 * 旅程以行程为主数据，订单是旅程的子资源
 * 持久化到 localStorage，刷新不丢失
 */
const TRIP_KEY = 'jm_trips'

/** 读取本地已有旅程 */
function loadTrips() {
  try {
    const raw = localStorage.getItem(TRIP_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

const state = reactive({
  // trips：旅程数组，每个元素含基本信息、days（按天组织的时间线节点）、companions（同行人）、comments（评论）
  trips: loadTrips(),
  /** 当前查看/编辑中的旅程 id（供详情页、预订回写使用） */
  activeTripId: localStorage.getItem('jm_active_trip') || ''
})

/** 将旅程列表写回本地存储 */
function persist() {
  localStorage.setItem(TRIP_KEY, JSON.stringify(state.trips))
}

/** 生成唯一 id */
function uid() {
  return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/** 旅程状态标签映射 */
export const tripStatusMap = {
  draft: { label: '草稿', cls: 'bg-gray-100 text-gray-600' },
  ready: { label: '待出发', cls: 'bg-blue-100 text-blue-600' },
  ongoing: { label: '进行中', cls: 'bg-green-100 text-green-600' },
  finished: { label: '已结束', cls: 'bg-gray-200 text-gray-500' }
}

// 状态流转：draft（草稿）→ ready（待出发）→ ongoing（进行中）→ finished（已结束），
// 由 nextStatus 逐级手动推进，或由 setStatus 直接指定任意状态

/** 新建一份旅程（空白 / AI / 模板复刻都走这里） */
export function createTrip(info = {}) {
  const now = Date.now()
  const trip = {
    id: uid(),
    name: info.name || '我的新旅程',
    destination: info.destination || '成都',
    startDate: info.startDate || '',
    endDate: info.endDate || '',
    budget: info.budget || '',
    tags: info.tags || [],
    source: info.source || 'blank', // blank | ai | template | clone
    status: info.status || 'draft',
    owner: info.owner || '',
    companions: [],
    days: info.days || [],
    comments: [],
    note: info.note || '',
    createdAt: now,
    updatedAt: now
  }
  state.trips.unshift(trip)
  persist()
  return trip
}

/** 删除旅程 */
export function removeTrip(id) {
  state.trips = state.trips.filter((t) => t.id !== id)
  if (state.activeTripId === id) state.activeTripId = ''
  persist()
}

/** 更新旅程字段 */
export function updateTrip(id, patch) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  Object.assign(t, patch, { updatedAt: Date.now() })
  persist()
}

/** 根据日期自动/手动推进状态：草稿→待出发→进行中→已结束 */
export function nextStatus(id) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  const order = ['draft', 'ready', 'ongoing', 'finished']
  const idx = order.indexOf(t.status)
  if (idx >= 0 && idx < order.length - 1) {
    t.status = order[idx + 1]
    t.updatedAt = Date.now()
    persist()
  }
}

/** 设置手动状态 */
export function setStatus(id, status) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  t.status = status
  t.updatedAt = Date.now()
  persist()
}

/* ================== 时间线节点 ================== */

/** 向某一天追加一个节点 */
export function addNode(id, dayIndex, node) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  const day = t.days[dayIndex]
  if (!day) return
  day.nodes.push({
    id: uid(),
    type: node.type || 'activity', // activity | service
    name: node.name || '未命名',
    time: node.time || '',
    location: node.location || '',
    note: node.note || '',
    img: node.img || '',
    price: node.price || '',
    orderId: node.orderId || '', // 已下单时关联订单号
    linked: node.linked || false
  })
  t.updatedAt = Date.now()
  persist()
  return day.nodes[day.nodes.length - 1]
}

/** 更新某天某节点 */
export function updateNode(id, dayIndex, nodeId, patch) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  const day = t.days[dayIndex]
  if (!day) return
  const n = day.nodes.find((n) => n.id === nodeId)
  if (!n) return
  Object.assign(n, patch)
  t.updatedAt = Date.now()
  persist()
}

/** 删除节点 */
export function removeNode(id, dayIndex, nodeId) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  const day = t.days[dayIndex]
  if (!day) return
  day.nodes = day.nodes.filter((n) => n.id !== nodeId)
  t.updatedAt = Date.now()
  persist()
}

/** 跨天移动节点（dayIndex 源天，nodeId，toDayIndex 目标天） */
export function moveNode(id, dayIndex, nodeId, toDayIndex) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  const from = t.days[dayIndex]
  const to = t.days[toDayIndex]
  if (!from || !to || dayIndex === toDayIndex) return
  const idx = from.nodes.findIndex((n) => n.id === nodeId)
  if (idx < 0) return
  const [node] = from.nodes.splice(idx, 1)
  to.nodes.push(node)
  t.updatedAt = Date.now()
  persist()
}

/** 新增一天（追加到最后） */
export function addDay(id) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  t.days.push({ day: t.days.length + 1, title: `第 ${t.days.length + 1} 天`, nodes: [] })
  t.updatedAt = Date.now()
  persist()
}

/** 设置某天标题 */
export function setDayTitle(id, dayIndex, title) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  if (t.days[dayIndex]) t.days[dayIndex].title = title
  t.updatedAt = Date.now()
  persist()
}

/* ================== 同行协同 ================== */

/** 添加同行人（权限：edit 可编辑 / view 仅查看 / notify 仅通知） */
export function addCompanion(id, companion) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  if (t.companions.some((c) => c.name === companion.name)) return false
  t.companions.push({
    name: companion.name,
    role: companion.role || 'view',
    avatar: companion.avatar || (companion.name ? companion.name.charAt(0).toUpperCase() : '?')
  })
  t.updatedAt = Date.now()
  persist()
  return true
}

/** 移除同行人 */
export function removeCompanion(id, name) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  t.companions = t.companions.filter((c) => c.name !== name)
  t.updatedAt = Date.now()
  persist()
}

/** 修改同行人权限 */
export function setCompanionRole(id, name, role) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  const c = t.companions.find((c) => c.name === name)
  if (c) c.role = role
  t.updatedAt = Date.now()
  persist()
}

/** 添加评论 */
export function addComment(id, comment) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  t.comments.push({
    id: uid(),
    user: comment.user || '匿名',
    text: comment.text || '',
    nodeId: comment.nodeId || '',
    time: Date.now()
  })
  t.updatedAt = Date.now()
  persist()
}

/* ================== 工具箱 ================== */

/** 复刻行程：生成一份全新草稿（清空订单、同行、评论） */
export function duplicateTrip(id, owner) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return null
  const now = Date.now()
  const clone = {
    ...JSON.parse(JSON.stringify(t)),
    id: uid(),
    name: t.name + '（复刻）',
    status: 'draft',
    source: 'clone',
    owner: owner || t.owner,
    companions: [],
    comments: [],
    days: (t.days || []).map((d) => ({
      ...d,
      nodes: (d.nodes || []).map((n) => ({
        ...n,
        orderId: '',
        linked: false
      }))
    })),
    createdAt: now,
    updatedAt: now
  }
  state.trips.unshift(clone)
  persist()
  return clone
}

/** 生成分享链接（带有效期，仅前端示意） */
export function shareLink(id) {
  const t = state.trips.find((t) => t.id === id)
  return t ? `${location.origin}/trip/${id}?share=1` : ''
}

/** 导出 PDF 行程单（打开打印窗口，由浏览器打印为 PDF） */
export function exportTripPdf(id) {
  const t = state.trips.find((t) => t.id === id)
  if (!t) return
  const w = window.open('', '_blank', 'width=760,height=900')
  if (!w) return
  let html = `<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><title>${t.name} - 行程单</title>`
  html += `<style>body{font-family:"Microsoft YaHei",sans-serif;color:#333;padding:40px}h1{font-size:22px;margin:0 0 6px}.meta{color:#888;font-size:13px;margin-bottom:20px}.day{margin-bottom:18px}.day h2{font-size:16px;border-left:4px solid #dc2626;padding-left:8px}.node{padding:4px 0 4px 12px;color:#555;font-size:14px}hr{border:none;border-top:1px solid #eee;margin:24px 0}</style></head><body>`
  html += `<h1>${t.name}</h1>`
  html += `<div class="meta">目的地：${t.destination} ｜ 出发：${t.startDate || '—'} ｜ 返程：${t.endDate || '—'} ｜ 预算：${t.budget || '—'} ｜ 状态：${tripStatusMap[t.status]?.label || t.status}</div>`
  ;(t.days || []).forEach((d) => {
    html += `<div class="day"><h2>${d.title || '第 ' + d.day + ' 天'}</h2>`
    ;(d.nodes || []).forEach((n) => {
      html += `<div class="node">• ${n.time ? n.time + ' ' : ''}${n.name}${n.location ? '（' + n.location + '）' : ''}${n.price ? '  ' + n.price : ''}</div>`
    })
    html += `</div>`
  })
  html += `<hr/><div style="font-size:12px;color:#aaa">途伴 JourneyMate · 以旅程为中心，做你全程随行的旅行管家 · 示例行程单</div>`
  html += `</body></html>`
  w.document.write(html)
  w.document.close()
  w.print()
}

/** 返回响应式旅程状态（组件中可直接读取最新旅程列表与当前旅程 id） */
export function useTripStore() {
  return state
}

/** 设置当前查看/编辑中的旅程 id，并同步持久化到 jm_active_trip；传空字符串表示清除 */
export function setActiveTrip(id) {
  state.activeTripId = id || ''
  if (id) localStorage.setItem('jm_active_trip', id)
  else localStorage.removeItem('jm_active_trip')
}

/** 按 id 查找单份旅程，找不到返回 undefined */
export function getTrip(id) {
  return state.trips.find((t) => t.id === id)
}

/* ========== 首次演示数据（仅当从未使用过且无旅程时注入） ========== */
/** 首次进入时注入两份演示旅程；已注入过（jm_seeded 存在）或本地已有旅程则跳过 */
function seedDemo() {
  if (localStorage.getItem('jm_seeded') || state.trips.length) return
  const t1 = createTrip({
    name: '成都 5 日慢旅行',
    destination: '成都',
    startDate: '',
    endDate: '',
    budget: '中等',
    tags: ['老人友好', '慢节奏'],
    owner: 'admin',
    source: 'ai',
    status: 'ready',
    days: [
      {
        title: '第 1 天 · 初见成都',
        nodes: [
          { id: uid(), type: 'activity', name: '武侯祠·红墙竹影', time: '09:00', location: '武侯祠大街', note: '清晨人少最出片', price: '¥50/人', img: '/images/wuhouci.jpg' },
          { id: uid(), type: 'activity', name: '人民公园鹤鸣茶社', time: '15:00', location: '人民公园', note: '盖碗茶+采耳，长辈友好', price: '人均¥30', img: '/images/play-park.jpg' },
          { id: uid(), type: 'service', name: '锦江宾馆', time: '入住', location: '锦江畔', note: '老牌地标，临江而居', price: '¥588起/晚', img: '/images/stay-hotel.jpg', category: 'stay', itemId: 2 }
        ]
      },
      {
        title: '第 2 天 · 慢逛老街',
        nodes: [
          { id: uid(), type: 'activity', name: '宽窄巷子', time: '10:00', location: '宽窄巷子', note: '老院子、三大炮、文创小店', price: '免费', img: '/images/guzhen.jpg' },
          { id: uid(), type: 'activity', name: '锦里古街', time: '14:00', location: '锦里', note: '红灯笼、小吃、川西民俗', price: '免门票', img: '/images/shopping-jinli.jpg' }
        ]
      }
    ],
    companions: [
      { name: '李阿姨', role: 'notify', avatar: '李' }
    ],
    comments: [
      { id: uid(), user: '李阿姨', text: '想去看看都江堰，行程里加上吧？', time: Date.now() - 86400000 }
    ]
  })
  const t2 = createTrip({
    name: '成都亲子 3 日游',
    destination: '成都',
    startDate: '',
    endDate: '',
    budget: '经济',
    tags: ['亲子'],
    owner: 'admin',
    source: 'template',
    days: [
      {
        title: '第 1 天 · 熊猫日',
        nodes: [
          { id: uid(), type: 'activity', name: '成都大熊猫繁育研究基地', time: '08:00', location: '熊猫大道', note: '开园即进看滚滚', price: '¥55/人', img: '/images/panda.jpg', category: 'attraction', itemId: 5 },
          { id: uid(), type: 'activity', name: '成都欢乐谷', time: '13:00', location: '华侨城', note: '全家玩一天', price: '¥220/人', img: '/images/play-nightbar.jpg' }
        ]
      }
    ],
    companions: []
  })
  localStorage.setItem('jm_seeded', '1')
  void t1
  void t2
}
seedDemo()
