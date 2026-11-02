/**
 * AI 旅行管家 —— 前端规则式行程生成引擎（V1.0 演示）
 * 基于成都站内资源库，按用户输入生成 2 版差异化行程方案
 * 输出：plan（多天时间线）、cards（可预订询价卡片）、risks（风险提示）
 * 说明：真实产品中该层接入大模型 + Function Calling，读取实时库存与规则库
 */
import { attractions, foods, stays, plays } from '@/data'

/* ========== 资源池 ========== */
// 演示用本地资源池：activities 为景点／玩乐节点，foods 为餐饮节点，stays 为可预订酒店
// 节点带 category 与 itemId 时，可关联景点详情页或订购单（category：attraction 景点、stay 酒店）
const POOL = {
  // 活动节点（纯参考）
  activities: {
    panda: { type: 'activity', name: '成都大熊猫繁育研究基地', time: '08:00', location: '熊猫大道', note: '开园即进看熊猫宝宝，上午最活跃', price: '¥55/人', img: '/images/panda.jpg', category: 'attraction', itemId: 5 },
    wuhou: { type: 'activity', name: '武侯祠·红墙竹影', time: '09:00', location: '武侯祠大街', note: '三国遗迹博物馆，红墙竹影清晨最出片', price: '¥50/人', img: '/images/wuhouci.jpg', category: 'attraction', itemId: 1 },
    caotang: { type: 'activity', name: '杜甫草堂', time: '10:00', location: '青华路', note: '诗圣故居，浣花溪畔古典园林', price: '¥50/人', img: '/images/caotang.jpg', category: 'attraction', itemId: 3 },
    dujiangyan: { type: 'activity', name: '都江堰景区', time: '09:30', location: '都江堰市', note: '千年水利工程，鱼嘴/飞沙堰/宝瓶口', price: '¥80/人', img: '/images/dujiangyan.jpg', category: 'attraction', itemId: 4 },
    qingcheng: { type: 'activity', name: '青城山', time: '08:30', location: '青城山镇', note: '青城天下幽，前山道教宫观或后山徒步', price: '¥90/人', img: '/images/qingchengshan.jpg', category: 'attraction', itemId: 6 },
    kuanzhai: { type: 'activity', name: '宽窄巷子', time: '14:00', location: '宽窄巷子', note: '老成都市井烟火+新潮文创', price: '免费', img: '/images/guzhen.jpg' },
    jinli: { type: 'activity', name: '锦里古街', time: '15:00', location: '锦里', note: '红灯笼、小吃、川西民俗', price: '免门票', img: '/images/shopping-jinli.jpg' },
    chunxi: { type: 'activity', name: '春熙路·太古里', time: '15:30', location: '春熙路', note: '爬墙熊猫、大牌云集、逛吃购', price: '免费', img: '/images/stay-hotel.jpg' },
    tea: { type: 'activity', name: '人民公园鹤鸣茶社', time: '16:00', location: '人民公园', note: '盖碗茶+采耳，慢生活样板', price: '人均¥30', img: '/images/play-park.jpg' },
    teahouse2: { type: 'activity', name: '人民公园茶馆', time: '10:30', location: '人民公园', note: '睡到自然醒，来碗盖碗茶', price: '人均¥30', img: '/images/play-park.jpg' },
    joyvalley: { type: 'activity', name: '成都欢乐谷', time: '13:00', location: '华侨城', note: '过山车、摩天轮、水上乐园', price: '¥220/人', img: '/images/play-nightbar.jpg', category: 'attraction' },
    nightriver: { type: 'activity', name: '夜游锦江', time: '19:30', location: '东门码头', note: '乘船看安顺廊桥灯火倒影', price: '¥120/人', img: '/images/night.jpg', category: 'attraction' },
    langqiao: { type: 'activity', name: '安顺廊桥夜景', time: '20:30', location: '锦江畔', note: '19:30整桥亮灯，夜景天花板', price: '免费', img: '/images/night.jpg' },
    jiuyan: { type: 'activity', name: '九眼桥酒吧街', time: '21:30', location: '九眼桥', note: '成都夜生活聚集地', price: '人均¥150', img: '/images/play-nightbar.jpg' },
    bianlian: { type: 'activity', name: '蜀风雅韵川剧变脸', time: '20:00', location: '琴台路', note: '变脸吐火，成都文化名片', price: '¥160/人', img: '/images/bianlian.jpg', category: 'attraction' }
  },
  // 美食节点
  foods: [
    { type: 'activity', name: '老码头火锅', time: '12:00', location: '春熙路', note: '牛油红锅，毛肚黄喉现点现切', price: '人均¥95', img: '/images/hotpot.jpg', tag: '火锅' },
    { type: 'activity', name: '马路边边串串香', time: '12:30', location: '市井街区', note: '麻辣烫式市井串串', price: '人均¥65', img: '/images/food-chuanchuan.jpg', tag: '串串' },
    { type: 'activity', name: '陈麻婆豆腐', time: '11:30', location: '青华路', note: '百年老店，麻婆豆腐必修课', price: '人均¥58', img: '/images/food-chuanchuan.jpg', tag: '川菜' },
    { type: 'activity', name: '玉林串串香·小酒馆', time: '19:00', location: '玉林路', note: '夜宵打卡的灵魂去处', price: '人均¥45', img: '/images/food-chuanchuan.jpg', tag: '小吃' },
    { type: 'activity', name: '成都小吃集合', time: '15:00', location: '锦里/建设路', note: '担担面、钟水饺、三大炮、蛋烘糕', price: '人均¥40', img: '/images/hotpot.jpg', tag: '小吃' }
  ],
  // 酒店（可预订服务节点）
  stays: [
    { type: 'service', name: '成都博舍酒店', time: '入住', location: '太古里', note: '川西庭院与现代设计融合', price: '¥1288起/晚', img: '/images/stay-hotel.jpg', category: 'stay', itemId: 1, score: '4.9' },
    { type: 'service', name: '锦江宾馆', time: '入住', location: '锦江畔', note: '成都老牌地标酒店', price: '¥588起/晚', img: '/images/stay-hotel.jpg', category: 'stay', itemId: 2, score: '4.7' },
    { type: 'service', name: '川西民宿·青瓦小院', time: '入住', location: '近宽窄巷子', note: '青瓦木屋、竹椅藤编，地道慢生活', price: '¥328起/晚', img: '/images/stay-minsu.jpg', category: 'stay', itemId: 3, score: '4.8' },
    { type: 'service', name: '春熙路商圈酒店', time: '入住', location: '春熙路', note: '吃住购一站搞定', price: '¥428起/晚', img: '/images/stay-hotel.jpg', category: 'stay', itemId: 4, score: '4.6' },
    { type: 'service', name: '宽窄巷子主题客栈', time: '入住', location: '宽窄巷子', note: '藏在老院子里的川西院落', price: '¥268起/晚', img: '/images/guzhen.jpg', category: 'stay', itemId: 5, score: '4.7' },
    { type: 'service', name: '青城山度假酒店', time: '入住', location: '青城山镇', note: '山林环绕、泡汤喝茶', price: '¥688起/晚', img: '/images/qingchengshan.jpg', category: 'stay', itemId: 6, score: '4.8' }
  ]
}

/* ========== 输入解析 ========== */
/**
 * 解析用户自然语言输入，识别目的地、行程天数与各类出行偏好
 * @param {string} text 用户输入的自由文本
 * @returns {object} res 偏好标记集合：days 天数、destination 目的地，
 *   以及 kids 亲子、elder 老人、hike 徒步、photo 摄影、foodie 美食、
 *   slow 慢节奏、tight 紧凑、noRed 避开网红、vegetarian 素食、night 夜景等布尔意图
 */
function parse(text) {
  const t = text || ''
  // 默认 3 天、目的地成都；命中对应关键词即把该偏好意图置为 true
  const res = {
    days: 3,
    destination: /(上海|北京|广州|深圳|杭州|重庆|西安|大理|丽江)/.test(t) ? (t.match(/(上海|北京|广州|深圳|杭州|重庆|西安|大理|丽江)/)[1]) : '成都',
    kids: /亲子|带娃|儿童|小朋友|孩子/.test(t),
    elder: /老人|父母|长辈/.test(t),
    hike: /徒步|爬山|登山/.test(t),
    photo: /摄影|拍照|出片/.test(t),
    foodie: /吃货|美食|吃遍|探店/.test(t),
    slow: /慢节奏|慢逛|休闲|不赶/.test(t),
    tight: /紧凑|打卡|高效/.test(t),
    noRed: /避开网红|不去网红/.test(t),
    vegetarian: /素食/.test(t),
    night: /夜游|夜景|晚上/.test(t)
  }
  // 从文本中识别「X 天」里的数字天数，并限制在 1 至 7 天区间
  const dm = t.match(/(\d+)\s*天|\d+天/)
  if (dm) res.days = Math.min(7, Math.max(1, Number(dm[1])))
  return res
}

/* ========== 选择活动节点 ========== */
/**
 * 按解析出的首要偏好，从资源池挑选一组起始活动节点
 * 互斥优先级自上而下：亲子 → 老人 → 徒步 → 摄影 → 美食 → 慢节奏 → 夜景，均未命中时走经典默认线
 * @param {object} p parse 返回的偏好集合
 * @returns {Array} 选中的活动节点数组
 */
function pickActivities(p) {
  const acts = []
  if (p.kids) {
    acts.push(POOL.activities.panda, POOL.activities.joyvalley, POOL.activities.tea)
  } else if (p.elder) {
    acts.push(POOL.activities.kuanzhai, POOL.activities.tea, POOL.activities.dujiangyan)
  } else if (p.hike) {
    acts.push(POOL.activities.qingcheng, POOL.activities.dujiangyan, POOL.activities.caotang)
  } else if (p.photo) {
    acts.push(POOL.activities.wuhou, POOL.activities.kuanzhai, POOL.activities.langqiao)
  } else if (p.foodie) {
    acts.push(POOL.activities.kuanzhai, POOL.activities.jinli, POOL.activities.chunxi)
  } else if (p.slow) {
    acts.push(POOL.activities.tea, POOL.activities.kuanzhai, POOL.activities.jinli)
  } else if (p.night) {
    acts.push(POOL.activities.nightriver, POOL.activities.langqiao, POOL.activities.jiuyan)
  } else {
    // 默认经典
    acts.push(POOL.activities.panda, POOL.activities.wuhou, POOL.activities.kuanzhai, POOL.activities.chunxi)
  }
  return acts
}

/* ========== 生成方案 ========== */
/**
 * AI 管家主入口：根据用户输入解析偏好，生成休闲与紧凑两版差异化行程
 * 非成都目的地直接返回空方案并给出风险提示
 * @param {string} inputText 用户自由文本
 * @param {object} ctx 调用上下文（演示保留，暂未使用）
 * @returns {object} { plans 两版方案, cards 可预订询价卡片, risks 风险提示, hint 目的地 }
 */
export function generatePlans(inputText, ctx = {}) {
  const p = parse(inputText)
  if (p.destination !== '成都') {
    return {
      plans: [],
      risks: [{ type: 'warn', text: `目前演示数据仅支持成都目的地，已按成都为你生成方案。真实产品接入城市资源库后可覆盖更多目的地。`, suggest: '继续按成都生成' }],
      cards: [],
      hint: p.destination
    }
  }
  // 取偏好对应的起始活动集合，按解析出的天数逐日铺排
  const baseActs = pickActivities(p)
  const dayCount = p.days

  // 休闲版：每天 2-3 个活动 + 1 个住宿；紧凑版：每天 3-4 个活动
  // pace 取 loose 休闲或 tight 紧凑，控制每日节点密度与住宿档次
  const build = (pace) => {
    const days = []
    const acts = [...baseActs]
    // 紧凑版多塞经典景点
    if (pace === 'tight' && !p.night) {
      acts.push(POOL.activities.dujiangyan, POOL.activities.caotang)
    }
    if (p.night) acts.push(POOL.activities.bianlian)
    if (p.foodie) acts.splice(2, 0, POOL.foods[0])

    // 按天数循环铺排：用 (d + i) 取模从活动池循环取节点，同日同名去重
    for (let d = 0; d < dayCount; d++) {
      const nodes = []
      const per = pace === 'tight' ? 3 : 2
      for (let i = 0; i < per && acts.length; i++) {
        const a = acts[(d + i) % acts.length]
        if (!nodes.some((n) => n.name === a.name)) nodes.push({ ...a })
      }
      // 每天补一个美食
      if (d < POOL.foods.length && !nodes.some((n) => n.name === POOL.foods[d].name)) {
        nodes.push({ ...POOL.foods[d] })
      }
      // 住宿节点（服务）
      // 紧凑版选商圈高性价比酒店；休闲版按老人／慢节奏分别选老牌宾馆与青瓦民宿，默认太古里高端酒店
      const stay = POOL.stays[pace === 'tight' ? 3 : (p.elder ? 1 : p.slow ? 2 : 0)]
      if (!p.night && d < dayCount - 1) nodes.push({ ...stay, note: '晚间入住 ' + stay.name })
      days.push({ title: `第 ${d + 1} 天`, nodes })
    }
    return days
  }

  const plans = [
    { name: '方案 A · 休闲版', desc: paceDesc(p, '休闲'), days: build('loose') },
    { name: '方案 B · 紧凑版', desc: paceDesc(p, '紧凑'), days: build('tight') }
  ]

  // 询价卡片（从两方案汇总去重，取酒店 + 门票）
  const cards = []
  const seen = new Set()
  // 仅汇总带 category 的可预订节点（景点门票／酒店），按 category:itemId 去重避免重复出卡
  const addCard = (n) => {
    if (!n.category) return
    const key = n.category + ':' + (n.itemId || n.name)
    if (seen.has(key)) return
    seen.add(key)
    cards.push({ category: n.category, itemId: n.itemId || '', itemName: n.name, price: n.price, img: n.img, score: n.score || '' })
  }
  plans.forEach((pl) => pl.days.forEach((d) => d.nodes.forEach(addCard)))

  // 风险提示
  const risks = []
  risks.push({ type: 'info', text: '节假日大熊猫基地、武侯祠人流量大，建议提前 3 天线上实名预约。', suggest: '已把「提前预约」写入行程备注' })
  if (p.hike) risks.push({ type: 'warn', text: '青城山后山徒步耗时 4-6 小时，雨天路滑，请备运动鞋与饮水。', suggest: '可改为前山索道上山' })
  if (p.elder) risks.push({ type: 'info', text: '含老人同行，已避开高强度徒步，并安排市区平缓景点与地铁交通。', suggest: '' })
  if (p.kids) risks.push({ type: 'info', text: '含儿童同行，酒店建议选择带儿童设施、近地铁的商圈酒店。', suggest: '' })

  return { plans, cards, risks, hint: p.destination }
}

/**
 * 依据用户偏好生成方案一句话副标题文案
 * 夜景／亲子／老人／美食／慢节奏各有专属话术，兜底按节奏给出通用描述
 * @param {object} p parse 返回的偏好集合
 * @param {string} pace 节奏：休闲 或 紧凑
 * @returns {string} 方案副标题描述
 */
function paceDesc(p, pace) {
  if (p.night) return `以夜景为主的${pace === '休闲' ? '慢节奏' : '高效'}线路`
  if (p.kids) return '亲子友好、节奏轻松的线路'
  if (p.elder) return '少走路、少爬山、适合长辈的线路'
  if (p.foodie) return '串联地道美食与打卡点的线路'
  if (p.slow) return '慢逛慢吃，不赶行程'
  return pace === '休闲' ? '张弛有度，每天 2-3 个重点' : '高密度打卡，一天串更多经典'
}

/* ========== 修改行程（一句话调整，前端演示简化） ========== */
/**
 * 一句话调整入口：仅按新输入命中的偏好关键词，返回对应调整提示文案
 * 演示阶段不真正重排行程，无命中时给出兜底提示
 * @param {string} inputText 用户调整指令文本
 * @returns {Array<string>} 调整提示文案数组
 */
export function adjustHint(inputText) {
  const p = parse(inputText)
  const tips = []
  if (p.slow) tips.push('已建议降低每日节点密度、延长茶社/古镇停留时间')
  if (p.foodie) tips.push('已增加美食节点（火锅、串串、川菜、小吃）')
  if (p.hike) tips.push('已强化青城山/都江堰徒步与自然节点')
  if (p.noRed) tips.push('已标记避开网红店，改为本地口碑苍蝇馆子')
  if (p.vegetarian) tips.push('已标注素食选项，餐饮节点可替换为素食友好餐厅')
  return tips.length ? tips : ['已按你的要求调整行程节奏，可查看下方方案预览']
}
