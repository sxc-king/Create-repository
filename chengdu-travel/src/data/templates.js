/**
 * 灵感广场 —— 行程模板（V1.0 后台上架，游客可复刻，不能直接下单）
 * 复刻后生成一份全新草稿旅程
 */

// 模板分类筛选标签：与每个模板对象的 tag 字段取值对应，首页灵感广场按此筛选
export const templateCategories = ['全部', '亲子', '美食', '休闲', '经典', '周边', '夜游']

// 行程模板列表：id 模板编号；name 模板名；destination 目的地；days 天数；
// budget 预算档位（经济/中等）；cover 封面图；tags 多标签数组；tag 主分类（对应上方筛选标签）；intro 一句话介绍
// timeline 按天分组的行程：每天含 title 当天主题与 nodes 节点数组；
// 节点 type 为 activity（活动/体验）或 service（可预订服务，如门票、酒店、车票），
// 节点字段：name 名称、time 时间（或入住等状态文案）、location 地点、note 备注、price 价格文案、img 配图
export const templates = [
  {
    id: 1,
    name: '成都亲子 3 日城市游',
    destination: '成都',
    days: 3,
    budget: '中等',
    cover: '/images/panda.jpg',
    tags: ['亲子', '轻松'],
    tag: '亲子',
    intro: '熊猫基地看滚滚、科技馆玩中学，节奏友好，带娃不累。',
    timeline: [
      {
        title: '第 1 天 · 初见成都',
        nodes: [
          { type: 'activity', name: '成都大熊猫繁育研究基地', time: '08:30', location: '熊猫大道', note: '开园即进看熊猫宝宝', price: '¥55/人', img: '/images/panda.jpg' },
          { type: 'activity', name: '人民公园茶馆亲子时光', time: '15:00', location: '人民公园', note: '盖碗茶+看锦鲤，大人小孩都轻松', price: '人均¥30', img: '/images/play-park.jpg' },
          { type: 'service', name: '春熙路商圈酒店', time: '入住', location: '春熙路', note: '交通便利，近地铁', price: '¥428起/晚', img: '/images/stay-hotel.jpg' }
        ]
      },
      {
        title: '第 2 天 · 玩中学',
        nodes: [
          { type: 'activity', name: '成都博物馆', time: '09:30', location: '天府广场', note: '免费预约，孩子涨知识', price: '免费', img: '/images/wuhouci.jpg' },
          { type: 'service', name: '成都欢乐谷', time: '13:00', location: '华侨城', note: '过山车、摩天轮，全家玩一天', price: '¥220/人', img: '/images/play-nightbar.jpg' }
        ]
      },
      {
        title: '第 3 天 · 慢告别',
        nodes: [
          { type: 'activity', name: '宽窄巷子', time: '10:00', location: '宽窄巷子', note: '老院子、三大炮、文创小店', price: '免费', img: '/images/guzhen.jpg' },
          { type: 'activity', name: '锦里古街', time: '15:00', location: '锦里', note: '红灯笼、小吃、变脸演出', price: '免门票', img: '/images/shopping-jinli.jpg' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '慢逛成都美食路线',
    destination: '成都',
    days: 2,
    budget: '经济',
    cover: '/images/hotpot.jpg',
    tags: ['美食', '慢节奏'],
    tag: '美食',
    intro: '火锅、串串、盖碗茶一次吃遍，专为吃货设计的慢节奏路线。',
    timeline: [
      {
        title: '第 1 天 · 吃透火锅',
        nodes: [
          { type: 'service', name: '老码头火锅', time: '12:00', location: '春熙路', note: '牛油红锅，毛肚现点现切', price: '人均¥95', img: '/images/hotpot.jpg' },
          { type: 'activity', name: '鹤鸣茶社', time: '15:30', location: '人民公园', note: '盖碗茶+采耳，坐到不想走', price: '人均¥30', img: '/images/food-tea.jpg' },
          { type: 'activity', name: '玉林串串香·小酒馆', time: '19:00', location: '玉林路', note: '夜宵打卡的灵魂去处', price: '人均¥45', img: '/images/food-chuanchuan.jpg' }
        ]
      },
      {
        title: '第 2 天 · 小吃集合',
        nodes: [
          { type: 'activity', name: '陈麻婆豆腐', time: '11:30', location: '青华路', note: '百年老店，麻婆豆腐必修课', price: '人均¥58', img: '/images/food-chuanchuan.jpg' },
          { type: 'activity', name: '锦里小吃街', time: '15:00', location: '锦里', note: '担担面、三大炮、蛋烘糕', price: '人均¥40', img: '/images/shopping-jinli.jpg' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '熊猫基地一日打卡',
    destination: '成都',
    days: 1,
    budget: '经济',
    cover: '/images/panda.jpg',
    tags: ['亲子', '周边', '经典'],
    tag: '经典',
    intro: '开园即进看滚滚，一条线走完月亮产房、成年馆、小熊猫区。',
    timeline: [
      {
        title: '第 1 天 · 熊猫日',
        nodes: [
          { type: 'service', name: '大熊猫基地门票', time: '07:30', location: '熊猫大道', note: '线上实名预约，开园即进', price: '¥55/人', img: '/images/panda.jpg' },
          { type: 'activity', name: '月亮产房·太阳产房', time: '08:00', location: '基地内', note: '看熊猫宝宝嬉戏打滚', price: '含门票', img: '/images/panda.jpg' },
          { type: 'activity', name: '建设路小吃街', time: '13:00', location: '建设路', note: '午餐补充能量', price: '人均¥45', img: '/images/hotpot.jpg' },
          { type: 'activity', name: '春熙路·太古里', time: '15:30', location: '春熙路', note: '爬墙熊猫打卡', price: '免费', img: '/images/stay-hotel.jpg' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: '青城山·都江堰两日游',
    destination: '成都周边',
    days: 2,
    budget: '中等',
    cover: '/images/qingchengshan.jpg',
    tags: ['周边', '自然', '徒步'],
    tag: '周边',
    intro: '问道青城山、拜水都江堰，城际高铁一日串联世界级景区。',
    timeline: [
      {
        title: '第 1 天 · 问道青城',
        nodes: [
          { type: 'service', name: '城际高铁成都→青城山', time: '08:00', location: '犀浦站', note: '约30分钟', price: '¥10', img: '/images/qingchengshan.jpg' },
          { type: 'service', name: '青城山前山门票', time: '09:00', location: '青城山镇', note: '道教宫观，索道上山', price: '¥90/人', img: '/images/qingchengshan.jpg' },
          { type: 'service', name: '青城山度假酒店', time: '入住', location: '青城山镇', note: '山林环绕，推窗见绿', price: '¥688起/晚', img: '/images/qingchengshan.jpg' }
        ]
      },
      {
        title: '第 2 天 · 拜水都江堰',
        nodes: [
          { type: 'service', name: '都江堰景区门票', time: '09:30', location: '都江堰市', note: '鱼嘴、飞沙堰、宝瓶口', price: '¥80/人', img: '/images/dujiangyan.jpg' },
          { type: 'activity', name: '安澜索桥·二王庙', time: '13:00', location: '都江堰景区', note: '俯瞰千年水利工程', price: '含门票', img: '/images/dujiangyan.jpg' }
        ]
      }
    ]
  },
  {
    id: 5,
    name: '成都经典 3 日游',
    destination: '成都',
    days: 3,
    budget: '中等',
    cover: '/images/hero.jpg',
    tags: ['经典', '城市'],
    tag: '经典',
    intro: '武侯祠、宽窄巷子、熊猫基地、都江堰，把成都精华一次串起来。',
    timeline: [
      {
        title: '第 1 天 · 市区经典线',
        nodes: [
          { type: 'service', name: '武侯祠门票', time: '08:30', location: '武侯祠大街', note: '红墙竹影清晨最出片', price: '¥50/人', img: '/images/wuhouci.jpg' },
          { type: 'activity', name: '宽窄巷子', time: '14:00', location: '宽窄巷子', note: '三条巷子逛个遍', price: '免费', img: '/images/guzhen.jpg' },
          { type: 'service', name: '锦江宾馆', time: '入住', location: '锦江畔', note: '老牌地标，临江而居', price: '¥588起/晚', img: '/images/stay-hotel.jpg' }
        ]
      },
      {
        title: '第 2 天 · 熊猫+潮流',
        nodes: [
          { type: 'service', name: '大熊猫基地门票', time: '07:30', location: '熊猫大道', note: '开园即进看滚滚', price: '¥55/人', img: '/images/panda.jpg' },
          { type: 'activity', name: '春熙路·太古里', time: '14:00', location: '春熙路', note: '爬墙熊猫打卡', price: '免费', img: '/images/stay-hotel.jpg' },
          { type: 'activity', name: '蜀风雅韵川剧变脸', time: '20:00', location: '琴台路', note: '成都文化名片', price: '¥160/人', img: '/images/bianlian.jpg' }
        ]
      },
      {
        title: '第 3 天 · 都江堰青城山',
        nodes: [
          { type: 'service', name: '都江堰景区门票', time: '09:00', location: '都江堰市', note: '千年水利工程', price: '¥80/人', img: '/images/dujiangyan.jpg' },
          { type: 'service', name: '青城山门票', time: '14:00', location: '青城山镇', note: '青城天下幽', price: '¥90/人', img: '/images/qingchengshan.jpg' }
        ]
      }
    ]
  },
  {
    id: 6,
    name: '成都夜游 2 日',
    destination: '成都',
    days: 2,
    budget: '经济',
    cover: '/images/night.jpg',
    tags: ['夜游', '休闲'],
    tag: '夜游',
    intro: '夜游锦江、安顺廊桥、九眼桥，专为夜猫子设计的夜景路线。',
    timeline: [
      {
        title: '第 1 天 · 夜游锦江',
        nodes: [
          { type: 'service', name: '夜游锦江游船', time: '19:30', location: '东门码头', note: '灯光全开，40分钟串联合江亭、廊桥', price: '¥120/人', img: '/images/night.jpg' },
          { type: 'activity', name: '安顺廊桥', time: '20:30', location: '锦江畔', note: '金瓦红灯笼倒映江面', price: '免费', img: '/images/night.jpg' },
          { type: 'activity', name: '九眼桥酒吧街', time: '21:30', location: '九眼桥', note: '成都夜生活聚集地', price: '人均¥150', img: '/images/play-nightbar.jpg' }
        ]
      },
      {
        title: '第 2 天 · 慢醒',
        nodes: [
          { type: 'activity', name: '人民公园茶馆', time: '10:00', location: '人民公园', note: '睡到自然醒，来碗盖碗茶', price: '人均¥30', img: '/images/play-park.jpg' },
          { type: 'activity', name: '宽窄巷子文创街', time: '14:00', location: '宽窄巷子', note: '买点文创手作带回家', price: '免门票', img: '/images/guzhen.jpg' }
        ]
      }
    ]
  }
]
