# 南桥夜市 · 网页推理解谜游戏

> 2026 年「零杯」网页设计大赛参赛作品 · 壹组 · 夜市搜秘小分队

| 项目 | 内容 |
|---|---|
| 参赛主题 | 市井烟火 |
| 参赛方向 | 游戏网站（叙事解谜） |
| 作品形态 | Vue 3 单页应用；无后端、无数据库、无登录服务 |
| 界面规格 | 自适应 360–1920px（赛事三档 1920 / 1440 / 720 实测通过，见第六节） |
| 运行环境 | Chrome 129 及以上；Edge 等 Chromium 内核浏览器同样可用 |
| 组别 / 队长 | 壹组 / 樊梦值 |
| 提交包结构 | 外层压缩包内含「完整版本」「匿名版本」两个子包，各含本 README 与 `打开游戏/index.html` |

**三十秒上手**：解压后双击 `打开游戏/index.html`，浏览器直接打开就能玩，不需要 Node.js 或任何运行环境。

## 一、作品简介

南桥夜市是沿江一条做了二十年的夜市街。玩家以一个普通游客的身份进入它的官网，翻公告、逛摊位、泡论坛、看私信，最后在旁人留下的手记里，拼出一个糖粥藕摊主失踪的经过。

**主题落点（市井烟火）**：不写奇观，写日常。公告栏里是停电通知和十月排班表，十家摊位上挂着各自的价目和顾客留言，摊主之间的私信带着口音、错字和没说完的话。真相不在卷宗里，在这些琐碎的往来里。

**这部作品想让评委看到三件事**

- 一个不带战斗、不靠数值的网页游戏，乐趣全部来自"读"和"对"——把散落在五六个页面里的细节连成一条线。
- 界面是普通夜市的界面，不是游戏界面：公告、摊位卡、论坛帖、私信会话，都是真实站点该有的样子。
- 全部内容离线可跑：解压双击即玩，断网也不影响，弱网下也能打开。

**参赛亮点**

- 自适应界面，窗口任意缩放不破版（手册的加分项）
- 单文件离线版 2.39 MB，脚本、样式、图片全部内联，零外部依赖
- 无后端、无第三方接口，剧情全部由前端 JSON 驱动
- 慢网实测有具体数据（见 6.5）

## 二、怎么打开

**离线（推荐，评委用这个）**

1. 解压外层压缩包，得到 `2026-零杯壹组-…-完整版本.zip` 与 `…-匿名版本.zip` 两个子包
2. 再解压「完整版本」子包，得到一个同名文件夹
3. 进入文件夹，双击 `打开游戏/index.html`，用 Chrome 或 Edge 打开

**在线**：https://maren-722.github.io/nanqiao-night-market/

**打不开时的三个排查点**

1. 必须在压缩软件里选「解压到本地」再双击。直接在压缩包预览窗口里双击文件，系统只会临时放出那一个文件，图片和脚本不会跟出来，结果是淡黄色空页面。
2. 要双击的是 `打开游戏/index.html`，不是文件夹根目录那个 `index.html`——根目录那个是开发入口，在 `file://` 下会白屏。
3. 浏览器用 Chrome 129 以上或 Edge。过旧的浏览器可能不支持页面里用到的新语法。

## 三、玩法目标与体验流程

**目标**：把陈伯失踪那几天的经过拼完整，并在最后做出一次选择。

**流程**

1. **首页** — 公告栏（含一条置顶通知）、十月排班表、地铁线路图，页面往下滑就能看到
2. **夜市导览** — 十家摊位按 A1–A5 / B1–B5 两列排开，点进去是摊主、菜品与价目、顾客留言
3. **摊位详情** — 顾客留言里夹着时间、称呼和对不上的细节，有些留言本身就是线索
4. **夜市论坛** — 用任意用户名注册即可发帖、评论，同一个用户名能看到自己发过的内容
5. **私信** — 以剧情角色登录后，能读到该角色和别人的往来
6. **手记** — 被找回的几页手记，是整条线里信息密度最高的部分
7. **结局** — 线索收齐后会走到一次选择，选择不同，收束页不同

线索不会在页面上直接点破，需要对照不同页面的时间与称呼。完整走一遍约 20–30 分钟，中途可以随时关掉再开，进度存在本机。

**体验账号**

| 角色 | 登录名 | 密码 | 说明 |
|---|---|---|---|
| 陈伯（陈桂生） | `A1` | `20060816` | 公开的体验账号，用它可以看到登录态下的私信与手记 |

游客态不需要登录，首页、导览、摊位、论坛都可以直接看。

## 四、组内成员与分工

| 成员 | GitHub | 负责内容 |
|---|---|---|
| 樊梦值（队长） | @Maren-722 | 网页框架与页面结构、全局样式与设计变量、路由与导航；公告与置顶通知文案；首页、登录页文案；部署与自检脚本 |
| 宋雨欣 | @2x1y3z | 解谜线索与推进设计；前情提要设计；界面优化；摊位、论坛等页面的文本撰写 |
| 仇仪宁 | @kikoZero | 网页界面优化，参与页面细节打磨 |

## 五、第三方库与工具（本组以外编写的开源依赖）

| 库 | 版本 | 用途 | 是否进入构建产物 | 许可证 |
|---|---|---|---|---|
| vue | ^3.5.13 | 组件化页面渲染与响应式状态 | 是（打包进 `dist`） | MIT |
| vue-router | ^4.5.0 | hash 模式路由、页面跳转与登录守卫 | 是 | MIT |
| vite | ^6.0.11 | 开发服务器、生产打包，`base` 设为 `/nanqiao-night-market/` | 否（仅构建期） | MIT |
| @vitejs/plugin-vue | ^5.2.1 | 让 Vite 编译 `.vue` 单文件组件 | 否（仅构建期） | MIT |
| puppeteer-core | ^25.16.0 | 仅在 `tests/` 下驱动本机浏览器做界面自检，不参与运行时 | 否 | Apache-2.0 |

**未使用任何预设样式库**：没有 Bootstrap、Element Plus、Vuetify、Tailwind、Animate.css 等；也没有引入 UI 组件库、图标库、图表库、CDN 资源或远程字体。全部样式手写在 `src/styles/` 与各组件 `<style scoped>` 中，字体使用系统字体栈，不下载字体文件。

**作品无后端**：无服务端、无数据库、无 CMS、无管理后台。剧情数据是打包进前端的 JSON，玩家的登录态、发帖、评论与手记存于浏览器 localStorage。

**关于 `/manager` 页面**：它是游戏内的叙事页面（夜市管理处工作台），由前端组件与 JSON 数据驱动，**不是后端管理系统**，不涉及 CMS、后台框架、服务端接口或数据库。

## 六、技术说明

### 6.1 架构

Vue 3 + vue-router（hash 模式）。所有页面是前端组件，数据来自 `src/data/*.json`；路由守卫按登录态决定能否进入私信、手记与管理处。单页应用，切换页面不重新请求资源，首次加载后基本只看本机数据。

### 6.2 数据与进度

- 剧情：`stalls.json`（十家摊位与顾客评价）、`posts.json`（论坛帖与评论）、`messages.json`（私信会话与手记）、`notices.json`（公告三态）、`accounts.json`（账号与摊位对应）
- 玩家：登录态、注册的用户名、发帖、评论、已读线索、结局选择，全部存 localStorage，换浏览器不继承

### 6.3 界面规格与自适应

本作品采用**自适应（responsive）**规格，不锁定单一分辨率。

- 覆盖宽度：**360 – 1920px 全区间**，窗口任意缩放均不出现横向滚动条
- 主要断点：**720px**（切换单列布局、导航折叠，短信页与手记页改为横向选择列表）、**900px**（导览等版式的两列/一列切换）
- 实测矩阵：9 档宽度（360 / 390 / 430 / 768 / 820 / 1024 / 1280 / 1440 / 1920）× 15 个页面组合（游客态 10 页 + 登录态 5 页，含摊位详情、帖子详情、私信、手记、管理处页），横向溢出均为 0
- 赛事三档 1920×1080 / 1440×900 / 720×1280 × 5 个主要页面实测，横向溢出同样为 0
- 复测：`node tests/responsive-audit.cjs`（需站点在 5173 运行）

### 6.4 运行环境与兼容性

- 目标浏览器 Chrome 129 及以上；Edge 等 Chromium 内核浏览器等效
- 不使用 Chrome 129 之后新增的 CSS/JS 特性；不使用 `type="module"` 之外的新语法依赖
- 离线版把入口改成普通 `<script>`，因此 `file://` 下也能跑，不受跨源策略限制

### 6.5 体积与加载

- 图片全部 WebP：10 张摊位图合计 1.10 MB（单张 70–130 KB，宽 960）、首页主视觉 146 KB（1672×941）、地铁线路图 64 KB；`dist` 总产物约 1.4 MB
- 离线单文件 2.39 MB（含全部图片的 base64）
- 摊位图 `loading="lazy"`，首页主视觉 `fetchpriority="high"`
- 慢网实测（1920×1080）：正常网首页 206 KB、导览 1.16 MB；较慢 3G（1.6 Mbps）导览 10 张图 5 s 全部出；极慢 400 kbps 首页正文 2 s、主视觉 6 s，导览 10 张 22 s 全部出
- 复测：`node tests/competition-env-check.cjs`（需先 `npm run build`，再 `npm run preview -- --port 4174`）

## 七、素材来源与授权

食物图片中，8 张由 Wikimedia Commons 照片经 AI 二次编辑（更换桌面背景、抬高机位、重新摆盘）而来，2 张（糖粥藕、汤馄饨）为 AI 原创生成。改编图沿用原照片许可。

| 菜品 | 摊位 | 原图（Wikimedia Commons） | 作者 | 许可 |
|---|---|---|---|---|
| 凉面 | 老街凉面 A2 | [Henan-style Liangmian](https://commons.wikimedia.org/wiki/File:Henan-style_Liangmian_with_Ocimum_%C3%97_africanum_(20260715141303).jpg) | N509FZ | CC BY-SA 4.0 |
| 水果捞 | 鲜果小铺 A4 | [Fruktsallad (Fruit salad)](https://commons.wikimedia.org/wiki/File:Fruktsallad_(Fruit_salad).jpg) | dnm | CC BY-SA 3.0 |
| 烤冷面 | 街角烤冷面 A5 | [Grilled cold noodles](https://commons.wikimedia.org/wiki/File:Grilled_cold_noodles_with_fried_egg_coating_(20200922115307).jpg) | N509FZ | CC BY-SA 4.0 |
| 卤味 | 张记卤味 B1 | [Wuhan duck](https://commons.wikimedia.org/wiki/File:Wuhan_duck_2026_10_14_-_01.jpg) | Anna Frodesiak | CC0 |
| 炒粉 | 小李炒粉 B2 | [Beefchowfoon](https://commons.wikimedia.org/wiki/File:Beefchowfoon.jpg) | stu_spivack | CC BY-SA 2.0 |
| 羊肉串 | 炭火烧烤 B3 | [Yang-kkochi](https://commons.wikimedia.org/wiki/File:Yang-kkochi.jpg) | lazy fri13th | CC BY 2.0 |
| 麻辣烫 | 刘姐麻辣烫 B4 | [Bowl of YGF Malatang](https://commons.wikimedia.org/wiki/File:Bowl_of_YGF_Malatang.jpg) | Fumikas Sagisavas | CC0 |
| 臭豆腐 | 巷尾臭豆腐 B5 | [Changsha-style Stinky Tofu](https://commons.wikimedia.org/wiki/File:Changsha-style_Stinky_Tofu_at_Huogongdian_(20180222183104).jpg) | N509FZ | CC BY-SA 4.0 |

- 糖粥藕（陈记糖粥藕 A1）、汤馄饨（巷口馄饨 A3）为 AI 原创生成，不对应第三方照片
- 首页主视觉（江边夜市黄昏插画）、地铁线路图：AI 生成
- 图片统一转为 WebP 以减小体积，来源与许可不因格式转换而改变
- 完整来源、作者、许可链接与改编说明见 `src/data/image-credits.json`

## 八、目录结构

```
├── 打开游戏/index.html      # 双击即玩的离线单文件版（评委入口）
├── index.html               # 开发入口，file:// 下会白屏，勿直接双击
├── src/
│   ├── assets/              # 图片（含地铁线网图）
│   ├── components/          # NavBar、Footer、BackBar
│   ├── data/                # 剧情数据（accounts / stalls / posts / messages / notices）
│   ├── router/              # 路由与登录守卫
│   ├── styles/              # 全局样式与设计变量
│   ├── utils/               # 登录鉴权、进度与节点追踪
│   ├── views/               # 各页面组件
│   └── App.vue
├── public/                  # 静态图片资源（WebP）
├── scripts/
│   ├── preview-server.mjs    # 零依赖静态预览服务
│   ├── 启动预览.bat / 停止预览.bat
│   └── inline-offline.cjs   # 离线单文件后处理
├── tests/                   # 界面自检与自适应、慢网实测脚本
├── vite.config.js
├── vite.config.offline.mjs  # 离线版构建配置
├── package.json
└── README.md
```

## 九、构建与测试

```bash
npm install
npm run dev        # 开发服务器，访问 http://localhost:5173/nanqiao-night-market/
npm run build      # 打包至 dist/
npm run build:offline  # 生成离线单文件版至 dist-offline/
npm run test:ui    # 界面回归自检（需本机 Chrome，或设 CHROME_PATH）
node tests/responsive-audit.cjs       # 自适应审计：10 个页面 × 9 档宽度
node tests/competition-env-check.cjs  # 参赛环境实测：1920/1440/720 三档 + 三档网速
```

项目设置了 base 路径，开发态必须带 `/nanqiao-night-market/` 访问，根路径不可用。

**离线版怎么来的**：`npm run build:offline` 先按 `vite.config.offline.mjs` 产出单入口构建，再由 `scripts/inline-offline.cjs` 把样式、脚本与十张菜品图（WebP 转 base64）全部内联进一个 HTML，并把入口改成普通 `<script>` 注入到 `<body>` 末尾。所以 `file://` 下双击可运行，不依赖任何外部文件。普通 `vite build` 的 `type="module"` 入口会被浏览器以跨源策略拦掉，直接双击只会白屏——这是单独做一份离线构建的原因。

**本地常驻预览**：`scripts/启动预览.bat` / `scripts/停止预览.bat` 以零依赖静态服务托管 `dist/`，固定 5173 端口；改动后需重新 `npm run build`。这两个脚本需要 Node.js，只供开发调试，**评委无需运行**。

**改剧情文案时**（`src/data/*.json` 驱动，不必动组件）注意两点：

1. 同一段对话存两份：`messages.json` 按账号组织，A 与 B 的聊天同时存在于两个账号下，改一处必须同步另一处
2. `time` 字段格式为「10月27日 18:50」，页面只显示日期，跨天处自动插入分隔行

JSON 语法错误会导致整页空白，改完先验一遍：

```bash
node -e "JSON.parse(require('fs').readFileSync('src/data/messages.json','utf8'))"
```

## 十、部署与提交说明

- 线上地址：https://maren-722.github.io/nanqiao-night-market/
- 部署：GitHub Pages，Source 设为 GitHub Actions，工作流 `.github/workflows/deploy.yml`；`vite.config.js` 的 `base` 为 `/nanqiao-night-market/`
- 本仓库只有 `main` 一条开发线，推送即触发部署

**提交包内容**

```
README.md                      本文档
打开游戏/index.html            离线单文件版（直接可玩）
index.html / package.json / package-lock.json
vite.config.js / vite.config.offline.mjs
src/                           页面组件、样式与剧情 JSON
public/                        图片资源（WebP）
scripts/                       预览服务、离线后处理、启停脚本
tests/                         自检脚本（可选）
.github/workflows/deploy.yml   可选，用于复现自动部署
```

**不随包提交**：`docs/主线改造方案.md`（含全部谜底，仅供组内开发）、`HANDOVER.md`（内部交接文档）、`dist/`、`dist-offline/`、`node_modules/`。
