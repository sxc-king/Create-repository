# 成都 CHENGDU · 本地文旅景点推荐网站（PC）

基于 **Vue3 + Vite + TailwindCSS** 构建的成都文旅推荐网站，按模板实现全部导航栏目：首页、住宿、美食、购物、玩乐、当地向导、旅游攻略，并带完整登录/注册功能。

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（端口 5174）
npm run dev
# 访问 http://localhost:5174/

# 3. 生产构建（输出 dist/ 目录）
npm run build

# 4. 本地预览构建产物
npm run preview
```

## 页面与功能

| 路由 | 栏目 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 主视觉 Hero + 热门景点 6 卡片 + 成都笔记列表 |
| `/stay` | 住宿 | 6 家精选住宿（奢华酒店/川西民宿/商圈酒店…），评分+价格+立即预订 |
| `/food` | 美食 | 6 家必吃（火锅/串串/川菜/盖碗茶…），人均+评分+去打卡 |
| `/shopping` | 购物 | 6 处购物地（锦里/太古里/文创街/特产/蜀锦/熊猫文创） |
| `/play` | 玩乐 | 6 项玩法（酒吧街/茶馆/欢乐谷/夜游锦江/三圣乡/变脸） |
| `/guide` | 当地向导 | 6 位向导（美食/亲子/包车/徒步/摄影/研学），预约按钮 |
| `/strategy` | 旅游攻略 | 6 篇攻略（线路/美食地图/古镇/熊猫基地/夜游/青城山） |

### 登录/注册（全站）
- 顶部导航右侧「登录」打开**悬浮式登录面板**：半透明毛玻璃遮罩 + 居中悬浮卡片，淡入上浮动画
- 支持 **登录 / 注册** 双模式，带表单校验与错误提示
- 演示账号：`admin` / `123456`；注册模式任意账号直接登录
- 登录后导航显示头像 + 用户名 + 「退出」；状态存 localStorage，刷新不丢失

## 技术要点

- Vue 3 组合式 API（`<script setup>`）+ Vue Router 4（7 条路由，懒加载分包，页面滚动回顶，标题随路由变化）
- Vite 6 + TailwindCSS 4
- 组件化：`SiteHeader`（吸顶导航+登录态）/ `LoginModal`（自定义悬浮登录面板）/ `PageHero`（栏目页头）/ `HeroBanner` / `AttractionGrid` / `NoteSection` / `SiteFooter`
- 数据集中管理：`src/data.js`（导航 + 景点 + 笔记 + 住宿/美食/购物/玩乐/向导/攻略共 42 项数据，改数据即改页面）
- 登录状态：`src/store/user.js`（轻量全局单例 + localStorage 持久化）
- 配图：19 张 AI 原创图（`public/images/`，无版权水印），首页 10 张 + 栏目页 9 张

## 目录结构

```
chengdu-travel/
├── index.html
├── package.json
├── vite.config.js
├── public/images/          # 19 张原创配图
└── src/
    ├── main.js             # 入口（注册路由）
    ├── App.vue             # 全局布局（Header + 路由出口 + Footer）
    ├── index.css           # Tailwind 入口
    ├── data.js             # 全站数据（导航/景点/笔记/六大栏目）
    ├── router/index.js     # 7 条路由 + 滚动回顶 + 标题设置
    ├── store/user.js       # 登录状态管理
    ├── components/
    │   ├── SiteHeader.vue  # 吸顶导航 + 登录态展示
    │   ├── LoginModal.vue  # 悬浮式登录/注册面板（纯 CSS，无第三方 UI 库）
    │   ├── PageHero.vue    # 栏目页头横幅
    │   ├── HeroBanner.vue
    │   ├── AttractionGrid.vue
    │   ├── NoteSection.vue
    │   └── SiteFooter.vue
    └── views/
        ├── HomePage.vue      # 首页
        ├── StayPage.vue      # 住宿
        ├── FoodPage.vue      # 美食
        ├── ShoppingPage.vue  # 购物
        ├── PlayPage.vue      # 玩乐
        ├── GuidePage.vue     # 当地向导
        └── StrategyPage.vue  # 旅游攻略
```

## 说明

- 评分、点评数、价格、阅读量为站点展示示意数据（`src/data.js` 中可修改）。
- 生产构建产物在 `dist/`，可直接部署到任意静态服务器（history 路由需服务器配置回退到 `index.html`，或改用 hash 路由）。
