import { reactive } from 'vue'

/**
 * 登录状态（轻量全局单例）
 * 登录信息持久化到 localStorage，刷新不丢失
 */
const USER_KEY = 'cdt_username'

const state = reactive({
  // username：当前登录用户名；isLogin：是否已登录（由本地是否存在用户名推导）
  username: localStorage.getItem(USER_KEY) || '',
  isLogin: !!localStorage.getItem(USER_KEY)
})

/** 返回响应式登录状态（组件中可直接读取用户名与登录标记） */
export function useUserStore() {
  return state
}

/** 登录：写入本地存储并更新响应式状态 */
export function login(username) {
  localStorage.setItem(USER_KEY, username)
  state.username = username
  state.isLogin = true
}

/** 退出登录：清除本地存储并重置响应式状态 */
export function logout() {
  localStorage.removeItem(USER_KEY)
  state.username = ''
  state.isLogin = false
}

/* ================== 出行偏好（AI 参考） ================== */
const PREFS_KEY = 'jm_prefs'
/** 可选偏好选项列表：id 为偏好标识，label 为展示文案，供 AI 规划行程时参考 */
export const prefOptions = [
  { id: 'no_red', label: '避开网红店', icon: '🚫' },
  { id: 'less_climb', label: '少爬山', icon: '⛰️' },
  { id: 'quiet_stay', label: '安静住宿', icon: '🛏️' },
  { id: 'kids_friendly', label: '儿童设施', icon: '👶' },
  { id: 'veg', label: '素食偏好', icon: '🥗' },
  { id: 'pet_friendly', label: '宠物友好', icon: '🐾' },
  { id: 'early_rise', label: '早起型', icon: '🌅' },
  { id: 'slow_pace', label: '慢节奏', icon: '🐢' },
  { id: 'photography', label: '摄影出片', icon: '📷' },
  { id: 'foodie', label: '吃货打卡', icon: '🍜' }
]

/** 读取已选偏好 id 列表（JSON 解析失败时回退为空数组） */
export function getPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

/** 保存已选偏好 id 列表到本地存储 */
export function savePrefs(ids) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(ids))
}

/* ================== 收藏（行程模板 / 酒店） ================== */
const FAV_KEY = 'jm_favs'
/** 读取收藏列表，每项为 type:id 形式的字符串 */
export function getFavs() {
  try {
    const raw = localStorage.getItem(FAV_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}
/** 切换收藏状态：已收藏则取消，未收藏则加入；返回最新收藏列表 */
export function toggleFav(type, id) {
  let favs = getFavs()
  const key = type + ':' + id
  if (favs.includes(key)) favs = favs.filter((k) => k !== key)
  else favs.push(key)
  localStorage.setItem(FAV_KEY, JSON.stringify(favs))
  return favs
}
/** 判断某类目的某 id 是否已收藏 */
export function isFav(type, id) {
  return getFavs().includes(type + ':' + id)
}

/* ================== 节点评价 ================== */
const REVIEW_KEY = 'jm_reviews'
/** 读取节点评价列表（按提交顺序新的在前） */
export function getReviews() {
  try {
    const raw = localStorage.getItem(REVIEW_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}
/** 新增一条节点评价并置顶，返回最新评价列表 */
export function addReview(r) {
  const list = getReviews()
  list.unshift({
    id: Date.now(),
    category: r.category,
    itemName: r.itemName,
    journeyName: r.journeyName || '',
    score: r.score,
    content: r.content || '',
    time: Date.now()
  })
  localStorage.setItem(REVIEW_KEY, JSON.stringify(list))
  return list
}
