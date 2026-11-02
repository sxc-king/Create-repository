import { reactive } from 'vue'

/**
 * 消息中心 —— 行程通知 / 同行邀请 / 订单通知 / AI 管家消息
 */
const MSG_KEY = 'jm_messages'

/** 从本地存储读取消息列表（JSON 解析失败时回退为空数组） */
function load() {
  try {
    const raw = localStorage.getItem(MSG_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

const state = reactive({
  messages: load()
})

/** 将消息列表写回本地存储 */
function persist() {
  localStorage.setItem(MSG_KEY, JSON.stringify(state.messages))
}

// 消息类型 → 展示文案与图标（用于消息中心列表渲染）
export const msgTypeMap = {
  trip: { label: '行程通知', icon: '📌' },
  invite: { label: '同行邀请', icon: '🤝' },
  order: { label: '订单通知', icon: '🧾' },
  ai: { label: 'AI 管家消息', icon: '🤖' }
}

/** 发送一条消息 */
export function pushMessage(msg) {
  state.messages.unshift({
    id: 'm' + Date.now() + Math.floor(Math.random() * 1000),
    type: msg.type || 'trip',
    title: msg.title || '新消息',
    content: msg.content || '',
    link: msg.link || '',
    read: false,
    time: Date.now()
  })
  persist()
}

/** 标记已读 */
export function markRead(id) {
  const m = state.messages.find((m) => m.id === id)
  if (m) m.read = true
  persist()
}

/** 全部已读 */
export function markAllRead() {
  state.messages.forEach((m) => (m.read = true))
  persist()
}

/** 未读数量 */
export function unreadCount() {
  return state.messages.filter((m) => !m.read).length
}

/** 返回响应式消息状态（组件中可直接读取最新消息） */
export function useMessageStore() {
  return state
}
