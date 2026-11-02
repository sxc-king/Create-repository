<script setup>
// 个人中心：左侧菜单切换出行偏好、我的收藏、评价管理三个内容区，数据均读写自本地存储
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PageHero from '@/components/PageHero.vue'
import { prefOptions, getPrefs, savePrefs, getFavs, toggleFav, getReviews, addReview } from '@/store/user'
import { templates } from '@/data/templates'
import { stays } from '@/data'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

// section：当前激活的内容区，取值 pref（偏好）/ fav（收藏）/ review（评价）
const section = ref('pref')
// prefs：已选出行偏好 id 列表；favs：收藏键（type:id）列表；reviews：已提交的评价记录
const prefs = ref(getPrefs())
const favs = ref(getFavs())
const reviews = ref(getReviews())

// prefIds：偏好 id 的只读映射，供偏好按钮高亮判断
const prefIds = computed(() => prefs.value)

/** 切换某出行偏好的选中状态（已选则移除，未选则追加） */
function togglePref(id) {
  const i = prefs.value.indexOf(id)
  if (i >= 0) prefs.value.splice(i, 1)
  else prefs.value.push(id)
}

/** 将当前偏好写回本地存储，并提示用户 AI 规划时会参考 */
function savePrefsNow() {
  savePrefs(prefs.value)
  alert('偏好已保存，AI 规划行程时会自动参考')
}

/** 判断某资源是否已被收藏，收藏键格式为 type:id */
function isFav(type, id) {
  return favs.value.includes(type + ':' + id)
}

/** 切换收藏状态：调用 store 的 toggleFav 并同步最新收藏列表 */
function toggle(type, id) {
  favs.value = toggleFav(type, id)
}

// favList：把收藏键还原为可直接渲染的列表（按 type 去 templates / stays 中查出名称、封面与副标题），查不到的项过滤掉
const favList = computed(() =>
  favs.value.map((k) => {
    const [type, id] = k.split(':')
    if (type === 'template') {
      const t = templates.find((x) => x.id === Number(id))
      return t ? { type, name: t.name, img: t.cover, sub: `${t.days}天 · 预算${t.budget}` } : null
    }
    if (type === 'stay') {
      const s = stays.find((x) => x.id === Number(id))
      return s ? { type, name: s.name, img: s.img, sub: s.price } : null
    }
    return null
  }).filter(Boolean)
)

// reviewForm：评价表单，category 为消费类别，score 为评分，itemName/content/journeyName 为评价内容
const reviewForm = ref({ category: 'attraction', itemName: '', score: 5, content: '', journeyName: '' })

/** 提交评价：项目名称为空则忽略，提交后重置表单并提示用户 */
function submitReview() {
  if (!reviewForm.value.itemName.trim()) return
  reviews.value = addReview({ ...reviewForm.value })
  reviewForm.value = { category: 'attraction', itemName: '', score: 5, content: '', journeyName: '' }
  alert('评价已提交，将同步给商家用于服务改进')
}
</script>

<template>
  <div>
    <PageHero
      title="个人中心"
      subtitle="管理你的出行偏好、收藏与评价，让旅程更懂你"
      image="/images/food-tea.jpg"
      badge="个人中心"
    />

    <section class="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-[220px_1fr] gap-6">
      <!-- 菜单 -->
      <div class="space-y-2">
        <button
          class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          :class="section === 'pref' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'"
          @click="section = 'pref'"
        >🎯 我的偏好</button>
        <button
          class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          :class="section === 'fav' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'"
          @click="section = 'fav'"
        >❤️ 我的收藏</button>
        <button
          class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
          :class="section === 'review' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'"
          @click="section = 'review'"
        >⭐ 评价管理</button>
        <button
          class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-100"
          @click="router.push('/messages')"
        >🔔 消息中心</button>
      </div>

      <!-- 内容 -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <!-- 偏好 -->
        <div v-if="section === 'pref'">
          <h2 class="text-lg font-bold text-gray-900 mb-1">我的出行偏好</h2>
          <p class="text-sm text-gray-400 mb-5">设置你的长期出行偏好，AI 规划行程时会自动参考</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="p in prefOptions"
              :key="p.id"
              class="p-3 rounded-xl border text-sm flex flex-col items-center gap-1 transition-colors"
              :class="prefIds.includes(p.id) ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
              @click="togglePref(p.id)"
            >
              <span class="text-xl">{{ p.icon }}</span>
              <span>{{ p.label }}</span>
            </button>
          </div>
          <button
            class="mt-6 px-6 h-11 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700"
            @click="savePrefsNow"
          >
            保存偏好
          </button>
        </div>

        <!-- 收藏 -->
        <div v-else-if="section === 'fav'">
          <h2 class="text-lg font-bold text-gray-900 mb-5">我的收藏</h2>
          <div v-if="favList.length" class="space-y-3">
            <div v-for="f in favList" :key="f.type + f.name" class="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <img :src="f.img" class="w-12 h-12 rounded-lg object-cover" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800">{{ f.name }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ f.sub }}</p>
              </div>
              <button class="text-xs text-gray-400 hover:text-red-600" @click="toggle(f.type, f.name)">取消收藏</button>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 py-10 text-center">还没有收藏，可在灵感广场收藏模板、在住宿页收藏酒店</p>
        </div>

        <!-- 评价 -->
        <div v-else-if="section === 'review'">
          <h2 class="text-lg font-bold text-gray-900 mb-1">节点评价管理</h2>
          <p class="text-sm text-gray-400 mb-5">行程结束后，针对已消费的酒店 / 门票填写节点式评价</p>

          <div class="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
            <div class="grid sm:grid-cols-2 gap-3">
              <select v-model="reviewForm.category" class="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none">
                <option value="attraction">景点门票</option>
                <option value="stay">酒店住宿</option>
                <option value="food">美食</option>
                <option value="play">玩乐</option>
              </select>
              <input v-model="reviewForm.itemName" type="text" placeholder="消费项目名称（如：武侯祠）" class="h-11 px-3 rounded-xl border border-gray-200 outline-none text-sm" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">评分</span>
                <span class="text-amber-500" @click="reviewForm.score = reviewForm.score === 5 ? 4 : 5">★ {{ reviewForm.score }}.0</span>
              </div>
              <textarea v-model="reviewForm.content" rows="2" placeholder="说说这次体验，重点写隔音/人流/排队等对别人有用的细节…" class="w-full mt-2 px-3 py-2 rounded-xl border border-gray-200 outline-none text-sm resize-none"></textarea>
            </div>
            <button class="px-5 h-10 rounded-full bg-red-600 text-white text-sm" @click="submitReview">提交评价</button>
          </div>

          <div v-if="reviews.length" class="space-y-3">
            <div v-for="r in reviews" :key="r.id" class="border border-gray-100 rounded-xl p-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-800">{{ r.itemName }} <span class="text-gray-400 font-normal">（{{ r.category === 'stay' ? '住宿' : r.category === 'attraction' ? '门票' : r.category }}）</span></p>
                <span class="text-amber-500 text-xs">★ {{ r.score }}.0</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ r.content || '（未填写详情）' }}</p>
              <p class="text-[11px] text-gray-400 mt-1">{{ r.journeyName || '独立评价' }} · {{ new Date(r.time).toLocaleDateString() }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 text-center py-6">还没有评价记录</p>
        </div>
      </div>
    </section>
  </div>
</template>
