/**
 * 成都文旅站点数据
 * 注意：评分、点评数、价格为站点展示示意数据
 */

/**
 * 数据集合与页面的对应关系：
 * - attractions、stays、foods、shoppings、plays、guides 为可下单条目，
 *   订单页 /order/:category/:id 按 category 取值从对应数组中按 id 查找条目：
 *   attraction → attractions；stay → stays；food → foods；shopping → shoppings；play → plays；guide → guides
 * - attractions 另用于景点详情页 /attraction/:id；notes、strategies 分别跳转 /note/:id、/strategy/:id
 * - 各数组在首页及对应栏目页（StayPage、FoodPage、ShoppingPage、PlayPage、GuidePage、StrategyPage）中直接 import 渲染
 */

/* ========== 导航 ========== */
// 全站顶部导航菜单项：name 为显示文案，path 为对应路由地址（见 router/index.js）
export const navItems = [
  { name: '首页', path: '/' },
  { name: '住宿', path: '/stay' },
  { name: '美食', path: '/food' },
  { name: '购物', path: '/shopping' },
  { name: '玩乐', path: '/play' },
  { name: '当地向导', path: '/guide' },
  { name: '旅游攻略', path: '/strategy' }
]

/* ========== 热门景点（首页） ========== */
// 首页热门景点卡片：id 跳转景点详情页；name 景点名；score 评分；reviews 点评数文案；
// desc 一句话简介；img 封面图路径；tag 分类标签
export const attractions = [
  {
    id: 1,
    name: '武侯祠',
    score: '4.7',
    reviews: '5万+条点评',
    desc: '探寻三国历史与汉文化',
    img: '/images/wuhouci.jpg',
    tag: '历史人文'
  },
  {
    id: 2,
    name: '蜀风雅韵',
    score: '4.6',
    reviews: '1.1万条点评',
    desc: '成都必看变脸演出',
    img: '/images/bianlian.jpg',
    tag: '文化演艺'
  },
  {
    id: 3,
    name: '杜甫草堂',
    score: '4.6',
    reviews: '3.2万条点评',
    desc: '草堂茅屋 悠久历史',
    img: '/images/caotang.jpg',
    tag: '名人故居'
  },
  {
    id: 4,
    name: '都江堰景区',
    score: '4.8',
    reviews: '2.6万条点评',
    desc: '世界水利文化的鼻祖',
    img: '/images/dujiangyan.jpg',
    tag: '世界遗产'
  },
  {
    id: 5,
    name: '成都大熊猫繁育研究基地',
    score: '4.8',
    reviews: '8.7万条点评',
    desc: '和萌宠近距离接触',
    img: '/images/panda.jpg',
    tag: '亲子萌宠'
  },
  {
    id: 6,
    name: '青城山',
    score: '4.7',
    reviews: '4.5万条点评',
    desc: '青城天下幽',
    img: '/images/qingchengshan.jpg',
    tag: '自然山水'
  }
]

/* ========== 成都笔记（首页） ========== */
// 首页笔记卡片：id 跳转笔记详情页（/note/:id）；title 标题；desc 摘要；img 封面图；tag 分类标签
export const notes = [
  {
    id: 1,
    title: '成都「打卡」宽窄巷子 约一天',
    desc: '老成都的市井烟火与网红新潮在这里碰撞，一天玩转宽窄巷子全攻略。',
    img: '/images/hero.jpg',
    tag: '热门'
  },
  {
    id: 2,
    title: '成都探店，多场景，人间烟火，地道生活',
    desc: '2023成都美食探店必去清单：火锅、串串、苍蝇馆子，吃遍地道巴适味。',
    img: '/images/hotpot.jpg',
    tag: '美食'
  },
  {
    id: 3,
    title: '十大古镇，从西蜀古镇到巴适的老镇老巷',
    desc: '黄龙溪、洛带、安仁……从西蜀古镇出发，走进巴适的老镇老巷。',
    img: '/images/guzhen.jpg',
    tag: '古镇'
  },
  {
    id: 4,
    title: '2020年10月青城山，成都周边游',
    desc: '问道青城山，晨雾中的山门与石阶，成都周边一日游好去处。',
    img: '/images/qingchengshan.jpg',
    tag: '周边'
  },
  {
    id: 5,
    title: '2020端午下的成都夜游',
    desc: '成都夜游+周边游景区优惠（拼色版），锦江夜色与城市灯火全记录。',
    img: '/images/night.jpg',
    tag: '夜游'
  }
]

/* ========== 住宿 ========== */
// 住宿商户列表：id 与订单页 /order/stay/:id 对应；name 名称；type 业态类型（奢华酒店/民宿等）；
// price 起价文案；score 评分；desc 介绍；img 图片；tag 推荐标签
export const stays = [
  {
    id: 1,
    name: '成都博舍酒店',
    type: '奢华酒店',
    price: '¥1288 起/晚',
    score: '4.9',
    desc: '太古里核心区，川西庭院与现代设计融合，出行购物都方便。',
    img: '/images/stay-hotel.jpg',
    tag: '奢华精选'
  },
  {
    id: 2,
    name: '锦江宾馆',
    type: '经典老牌',
    price: '¥588 起/晚',
    score: '4.7',
    desc: '成都老牌地标酒店，临锦江而居，历史底蕴与舒适兼具。',
    img: '/images/stay-hotel.jpg',
    tag: '经典地标'
  },
  {
    id: 3,
    name: '川西民宿·青瓦小院',
    type: '特色民宿',
    price: '¥328 起/晚',
    score: '4.8',
    desc: '青瓦木屋、竹椅藤编，一院一景，体验地道成都慢生活。',
    img: '/images/stay-minsu.jpg',
    tag: '人气民宿'
  },
  {
    id: 4,
    name: '春熙路商圈酒店',
    type: '商务酒店',
    price: '¥428 起/晚',
    score: '4.6',
    desc: '楼下就是春熙路太古里，吃住购一站搞定，位置绝佳。',
    img: '/images/stay-hotel.jpg',
    tag: '位置便利'
  },
  {
    id: 5,
    name: '宽窄巷子主题客栈',
    type: '文化客栈',
    price: '¥268 起/晚',
    score: '4.7',
    desc: '藏在宽窄巷子里的川西院落，出门就是老成都烟火气。',
    img: '/images/guzhen.jpg',
    tag: '文化体验'
  },
  {
    id: 6,
    name: '青城山度假酒店',
    type: '度假酒店',
    price: '¥688 起/晚',
    score: '4.8',
    desc: '山林环绕、推窗见绿，泡汤喝茶，尽享青城天下幽。',
    img: '/images/qingchengshan.jpg',
    tag: '度假首选'
  }
]

/* ========== 美食 ========== */
// 美食店铺列表：id 与订单页 /order/food/:id 对应；type 为菜系/品类（火锅/串串/茶馆等）；
// price 为人均消费文案；其余字段含义同住宿集合
export const foods = [
  {
    id: 1,
    name: '老码头火锅',
    type: '火锅',
    price: '人均 ¥95',
    score: '4.8',
    desc: '牛油红锅麻辣鲜香，毛肚黄喉现点现切，成都火锅代表。',
    img: '/images/hotpot.jpg',
    tag: '必吃火锅'
  },
  {
    id: 2,
    name: '马路边边串串香',
    type: '串串',
    price: '人均 ¥65',
    score: '4.7',
    desc: '麻辣烫式的市井串串，一根竹签撸出成都烟火气。',
    img: '/images/food-chuanchuan.jpg',
    tag: '市井串串'
  },
  {
    id: 3,
    name: '陈麻婆豆腐',
    type: '川菜',
    price: '人均 ¥58',
    score: '4.6',
    desc: '百年老店，麻婆豆腐麻辣烫嫩，地道川菜必修课。',
    img: '/images/food-chuanchuan.jpg',
    tag: '经典川菜'
  },
  {
    id: 4,
    name: '鹤鸣茶社',
    type: '茶馆',
    price: '人均 ¥30',
    score: '4.7',
    desc: '人民公园百年茶社，盖碗茶+采耳，老成都慢生活样板。',
    img: '/images/food-tea.jpg',
    tag: '盖碗茶'
  },
  {
    id: 5,
    name: '玉林串串香',
    type: '小吃',
    price: '人均 ¥45',
    score: '4.5',
    desc: '玉林路的小酒馆和小吃街，夜宵打卡的灵魂去处。',
    img: '/images/food-chuanchuan.jpg',
    tag: '深夜食堂'
  },
  {
    id: 6,
    name: '成都小吃集合',
    type: '小吃',
    price: '人均 ¥40',
    score: '4.6',
    desc: '担担面、钟水饺、夫妻肺片、三大炮，一次吃遍成都味。',
    img: '/images/hotpot.jpg',
    tag: '必吃小吃'
  }
]

/* ========== 购物 ========== */
// 购物目的地列表：id 与订单页 /order/shopping/:id 对应；type 为街区/商圈类型；
// price 可能为免门票或人均消费文案；其余字段含义同住宿集合
export const shoppings = [
  {
    id: 1,
    name: '锦里古街',
    type: '特色街区',
    price: '免门票',
    score: '4.6',
    desc: '灯笼红墙下的古街集市，熊猫玩偶、蜀锦折扇应有尽有。',
    img: '/images/shopping-jinli.jpg',
    tag: '伴手礼首选'
  },
  {
    id: 2,
    name: '春熙路·太古里',
    type: '时尚商圈',
    price: '人均 ¥500',
    score: '4.8',
    desc: '成都最潮商圈，大牌云集+快闪店，逛吃购一站搞定。',
    img: '/images/stay-hotel.jpg',
    tag: '时尚潮流'
  },
  {
    id: 3,
    name: '宽窄巷子文创街',
    type: '文创街区',
    price: '免门票',
    score: '4.7',
    desc: '老院子里的文创小店，成都特色明信片、手办、茶具。',
    img: '/images/guzhen.jpg',
    tag: '文创手作'
  },
  {
    id: 4,
    name: '成都特产总汇',
    type: '特产店',
    price: '人均 ¥120',
    score: '4.5',
    desc: '火锅底料、郫县豆瓣、熊猫玩偶、蜀锦，一站式买齐。',
    img: '/images/shopping-techan.jpg',
    tag: '必带特产'
  },
  {
    id: 5,
    name: '蜀锦蜀绣专卖',
    type: '非遗文化',
    price: '人均 ¥300',
    score: '4.7',
    desc: '国家级非遗蜀锦蜀绣，丝帕、摆件、服饰，送礼有面子。',
    img: '/images/shopping-techan.jpg',
    tag: '非遗工艺'
  },
  {
    id: 6,
    name: '熊猫主题文创店',
    type: '主题商店',
    price: '人均 ¥80',
    score: '4.8',
    desc: '熊猫公仔、冰箱贴、帆布包，把可爱大熊猫带回家。',
    img: '/images/panda.jpg',
    tag: '萌宠周边'
  }
]

/* ========== 玩乐 ========== */
// 玩乐项目列表：id 与订单页 /order/play/:id 对应；type 为夜生活/主题乐园/演出等业态；
// price 为人均或单人票价文案；其余字段含义同住宿集合
export const plays = [
  {
    id: 1,
    name: '九眼桥酒吧街',
    type: '夜生活',
    price: '人均 ¥150',
    score: '4.6',
    desc: '兰桂坊沿河酒吧林立，成都夜晚最热闹的年轻人聚集地。',
    img: '/images/play-nightbar.jpg',
    tag: '酒吧夜场'
  },
  {
    id: 2,
    name: '人民公园茶馆',
    type: '休闲体验',
    price: '人均 ¥30',
    score: '4.8',
    desc: '竹椅盖碗茶+采耳+摆龙门阵，体验成都人最巴适的一天。',
    img: '/images/play-park.jpg',
    tag: '慢生活'
  },
  {
    id: 3,
    name: '成都欢乐谷',
    type: '主题乐园',
    price: '¥220/人',
    score: '4.6',
    desc: '过山车、摩天轮、水上乐园，全家老小玩一天不重样。',
    img: '/images/play-nightbar.jpg',
    tag: '亲子游乐'
  },
  {
    id: 4,
    name: '夜游锦江',
    type: '游船观光',
    price: '¥120/人',
    score: '4.7',
    desc: '乘船夜游锦江，看安顺廊桥灯火倒影，城市夜景尽收眼底。',
    img: '/images/night.jpg',
    tag: '夜景必玩'
  },
  {
    id: 5,
    name: '三圣乡农家乐',
    type: '近郊休闲',
    price: '人均 ¥80',
    score: '4.5',
    desc: '近郊花海、农家菜、露营烧烤，周末遛娃聚会好去处。',
    img: '/images/play-park.jpg',
    tag: '近郊度假'
  },
  {
    id: 6,
    name: '川剧变脸演出',
    type: '文化演出',
    price: '¥160/人',
    score: '4.6',
    desc: '蜀风雅韵经典剧目，变脸吐火绝活，成都文化名片。',
    img: '/images/bianlian.jpg',
    tag: '必看演出'
  }
]

/* ========== 当地向导 ========== */
// 当地向导列表：id 与订单页 /order/guide/:id 对应；price 为按天计价文案；
// type 为向导专长方向（美食探店/包车/徒步等）；其余字段含义同住宿集合
export const guides = [
  {
    id: 1,
    name: '张师傅·美食向导',
    type: '美食探店',
    price: '¥300/天',
    score: '5.0',
    desc: '地道成都吃货，带你穿街走巷吃苍蝇馆子，避开网红坑。',
    img: '/images/guide.jpg',
    tag: '好评TOP1'
  },
  {
    id: 2,
    name: '李姐·亲子向导',
    type: '亲子家庭',
    price: '¥350/天',
    score: '4.9',
    desc: '带娃经验丰富，熊猫基地+科技馆+亲子餐厅路线安排妥当。',
    img: '/images/panda.jpg',
    tag: '亲子口碑'
  },
  {
    id: 3,
    name: '王哥·包车向导',
    type: '包车出行',
    price: '¥600/天',
    score: '4.8',
    desc: '7座商务车，都江堰、青城山、乐山大佛周边一日游随叫随走。',
    img: '/images/guide.jpg',
    tag: '周边游'
  },
  {
    id: 4,
    name: '陈教练·徒步向导',
    type: '户外徒步',
    price: '¥280/天',
    score: '4.7',
    desc: '青城山、赵公山资深徒步向导，安全专业，风景线独家。',
    img: '/images/qingchengshan.jpg',
    tag: '户外专业'
  },
  {
    id: 5,
    name: '小林·摄影向导',
    type: '跟拍摄影',
    price: '¥500/天',
    score: '4.9',
    desc: '本地摄影师，古街汉服跟拍，出片点位一清二楚。',
    img: '/images/guzhen.jpg',
    tag: '出片神器'
  },
  {
    id: 6,
    name: '刘老师·研学向导',
    type: '文化研学',
    price: '¥380/天',
    score: '4.8',
    desc: '三星堆、金沙遗址、杜甫草堂深度讲解，文史爱好者福音。',
    img: '/images/wuhouci.jpg',
    tag: '深度讲解'
  }
]

/* ========== 旅游攻略 ========== */
// 旅游攻略列表：id 跳转攻略详情页（/strategy/:id）；title 标题；days 行程天数；
// views 阅读量文案；desc 简介；img 封面图；tag 分类标签
export const strategies = [
  {
    id: 1,
    title: '成都3日经典游线路',
    days: '3天',
    views: '2.3万阅读',
    desc: 'Day1 宽窄巷子→武侯祠→锦里；Day2 熊猫基地→杜甫草堂；Day3 都江堰→青城山。',
    img: '/images/hero.jpg',
    tag: '经典线路'
  },
  {
    id: 2,
    title: '成都美食地图·不吃后悔篇',
    days: '2天',
    views: '5.6万阅读',
    desc: '火锅、串串、川菜、茶馆、小吃，一条美食线路吃遍成都精华。',
    img: '/images/hotpot.jpg',
    tag: '美食攻略'
  },
  {
    id: 3,
    title: '成都周边古镇大全',
    days: '2-3天',
    views: '1.8万阅读',
    desc: '黄龙溪、洛带、安仁、平乐，从西蜀古镇到巴适的老镇老巷。',
    img: '/images/guzhen.jpg',
    tag: '古镇之旅'
  },
  {
    id: 4,
    title: '熊猫基地保姆级游玩攻略',
    days: '1天',
    views: '4.2万阅读',
    desc: '早起看熊猫宝宝、最佳观赏时间、园内路线全公开。',
    img: '/images/panda.jpg',
    tag: '亲子实用'
  },
  {
    id: 5,
    title: '成都夜游全攻略·夜景地图',
    days: '1晚',
    views: '1.5万阅读',
    desc: '夜游锦江、九眼桥、安顺廊桥，成都夜晚的正确打开方式。',
    img: '/images/night.jpg',
    tag: '夜游指南'
  },
  {
    id: 6,
    title: '青城山都江堰一日游攻略',
    days: '1天',
    views: '2.1万阅读',
    desc: '问道青城山、拜水都江堰，交通、门票、路线一篇讲清。',
    img: '/images/qingchengshan.jpg',
    tag: '周边必读'
  }
]
