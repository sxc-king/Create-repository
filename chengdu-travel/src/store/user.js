import { reactive } from 'vue'

/**
 * 登录状态（轻量全局单例）
 * 登录信息持久化到 localStorage，刷新不丢失
 */
const USER_KEY = 'cdt_username'

const state = reactive({
  username: localStorage.getItem(USER_KEY) || '',
  isLogin: !!localStorage.getItem(USER_KEY)
})

export function useUserStore() {
  return state
}

export function login(username) {
  localStorage.setItem(USER_KEY, username)
  state.username = username
  state.isLogin = true
}

export function logout() {
  localStorage.removeItem(USER_KEY)
  state.username = ''
  state.isLogin = false
}
