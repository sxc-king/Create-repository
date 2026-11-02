<script setup>
// 登录／注册弹窗：通过 v-model 控制显隐，演示账号 admin / 123456 登录成功
import { ref, computed } from 'vue'
import { login } from '@/store/user'

// props.modelValue：弹窗显隐（布尔），配合 v-model 双向绑定
const props = defineProps({
  modelValue: Boolean
})
// emit.update:modelValue：set 时回抛新的显隐值，完成 v-model 同步
const emit = defineEmits(['update:modelValue'])

// 代理 v-model：get 读取 props.modelValue，set 抛 update 事件
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

// mode：当前模式，login 登录／register 注册
const mode = ref('login') // login | register
// loading 提交中禁用按钮；error 错误提示文本；form 账号／密码／确认密码
const loading = ref(false)
const error = ref('')
const form = ref({ username: '', password: '', confirm: '' })

/** 提交表单：依次校验非空、注册模式两次密码一致、登录模式演示账号，成功后延迟写入登录态并关闭弹窗 */
const handleSubmit = () => {
  error.value = ''
  // 账号或密码为空
  if (!form.value.username.trim() || !form.value.password) {
    error.value = '请输入账号和密码'
    return
  }
  // 注册模式需两次密码一致
  if (mode.value === 'register' && form.value.password !== form.value.confirm) {
    error.value = '两次输入的密码不一致'
    return
  }
  // 登录模式校验演示账号
  if (mode.value === 'login' && !(form.value.username === 'admin' && form.value.password === '123456')) {
    error.value = '账号或密码错误（演示账号 admin / 123456）'
    return
  }
  loading.value = true
  // 模拟接口延迟，登录成功后关闭弹窗
  setTimeout(() => {
    login(form.value.username.trim())
    loading.value = false
    visible.value = false
  }, 400)
}

/** 在登录与注册模式间切换，并清空表单与错误提示 */
const switchMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
  form.value = { username: '', password: '', confirm: '' }
}

/** 关闭弹窗 */
const close = () => {
  visible.value = false
}
</script>

<template>
  <teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[3000] flex items-center justify-center"
        @click.self="close"
      >
        <!-- 半透明遮罩 -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- 悬浮登录卡片 -->
        <div class="relative w-[400px] max-w-[92vw] rounded-2xl bg-white shadow-2xl overflow-hidden animate-rise">
          <!-- 顶部品牌区 -->
          <div class="relative bg-gradient-to-r from-red-600 to-red-500 px-8 pt-8 pb-9 text-white">
            <button
              class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-lg leading-none"
              @click="close"
              aria-label="关闭"
            >
              ×
            </button>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black tracking-widest">成都</span>
              <span class="text-xs font-semibold tracking-[0.3em] uppercase opacity-90">CHENGDU</span>
            </div>
            <p class="text-sm text-white/85 mt-2">
              {{ mode === 'login' ? '登录后开启你的成都之旅' : '创建账号，收藏你的旅行计划' }}
            </p>
            <div class="absolute -bottom-5 left-8 w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center rotate-6">
              <span class="text-3xl">🐼</span>
            </div>
          </div>

          <!-- 表单区 -->
          <div class="px-8 pt-9 pb-6">
            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <label class="block text-sm text-gray-500 mb-1.5">账号</label>
                <div class="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 h-12 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                  <svg class="w-4.5 h-4.5 text-gray-400 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    v-model="form.username"
                    type="text"
                    placeholder="请输入账号"
                    class="flex-1 outline-none text-sm bg-transparent h-full"
                    autocomplete="username"
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm text-gray-500 mb-1.5">密码</label>
                <div class="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 h-12 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                  <svg class="text-gray-400 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    v-model="form.password"
                    :type="mode === 'register' && form.confirm ? 'text' : 'password'"
                    placeholder="请输入密码"
                    class="flex-1 outline-none text-sm bg-transparent h-full"
                    autocomplete="current-password"
                  />
                </div>
              </div>

              <div v-if="mode === 'register'" class="mb-4">
                <label class="block text-sm text-gray-500 mb-1.5">确认密码</label>
                <div class="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 h-12 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                  <svg class="text-gray-400 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    v-model="form.confirm"
                    type="password"
                    placeholder="请再次输入密码"
                    class="flex-1 outline-none text-sm bg-transparent h-full"
                    autocomplete="new-password"
                  />
                </div>
              </div>

              <!-- 错误提示条：校验失败时展示 -->
              <p v-if="error" class="text-xs text-red-600 mb-3 bg-red-50 rounded-lg px-3 py-2">
                {{ error }}
              </p>

              <!-- 提交按钮：登录／注册文案随模式切换，提交中禁用 -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full h-12 rounded-xl bg-red-600 text-white text-base font-semibold hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {{ loading ? '处理中...' : mode === 'login' ? '登 录' : '注 册' }}
              </button>
            </form>

            <!-- 登录／注册模式切换链接 -->
            <div class="text-center text-sm text-gray-500 mt-4">
              <template v-if="mode === 'login'">
                还没有账号？
                <a class="text-red-600 cursor-pointer hover:underline font-medium" @click="switchMode">立即注册</a>
              </template>
              <template v-else>
                已有账号？
                <a class="text-red-600 cursor-pointer hover:underline font-medium" @click="switchMode">去登录</a>
              </template>
            </div>
            <p v-if="mode === 'login'" class="text-center text-xs text-gray-400 mt-3">
              演示账号：admin ／ 密码：123456
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </teleport>
</template>

<style scoped>
/* 悬浮卡片出现动画：淡入 + 上浮 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-active .animate-rise,
.fade-leave-active .animate-rise {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-from .animate-rise,
.fade-leave-to .animate-rise {
  transform: translateY(16px);
  opacity: 0;
}
</style>
