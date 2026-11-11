# 南桥夜市 · 网页解谜游戏

一款基于 Vue 3 的网页解谜游戏。玩家以游客身份浏览「南桥夜市」官网，从公告、论坛、摊位评价、私信与手记中拼出糖粥藕摊主陈桂生（陈伯）失踪的经过，最后做出一次选择。

无后端、无数据库：剧情数据为 JSON 文件，玩家侧的登录态、发帖与进度存于浏览器 localStorage。

## 文档

| 文档 | 内容 | 说明 |
|---|---|---|
| `HANDOVER.md` | 交接说明：完成的工作、当前状态、运行方式、回滚与复原 | 接手先看这份 |
| `docs/主线改造方案.md` | 剧情设定：故事圣经、账号与密码、谜题落位、私信与手记清单、结局、页面规则 | **含全部谜底，勿在游戏内展示、勿随作品提交包交给玩家** |

## 技术栈与库用途

| 库/工具 | 用途 | 在项目中的具体作用 |
|---|---|---|
| Vue 3 | 前端框架 | 页面组件化开发与数据渲染 |
| Vite | 构建工具 | 本地开发服务器、打包构建，base 路径设为 `/nanqiao-night-market/` |
| Vue Router | 前端路由 | hash 模式页面跳转、登录路由守卫（未登录拦截私信与手记页） |
| puppeteer-core | 开发依赖，仅用于自检 | 调用本机 Chrome 执行 `npm run test:ui`，不进构建产物 |

未使用任何 UI 组件库或预设样式框架，样式为项目自写，设计变量集中在 `src/styles/variables.css`。

### 关于管理页面（提交说明）

`/manager` 是游戏内的叙事页面（夜市管理处工作台），由前端组件与 JSON 数据驱动，**不是后端管理系统**：不涉及 CMS、后台框架、服务端接口或数据库。作品整体无后端，玩家状态全部存于浏览器 localStorage。

## 运行

```bash
npm install
npm run dev        # 开发服务器，访问 http://localhost:5173/nanqiao-night-market/
npm run build      # 打包至 dist/
npm run test:ui    # 界面回归自检（需本机 Chrome，或设 CHROME_PATH）
node tests/responsive-audit.cjs   # 自适应审计：10 个页面 × 9 档宽度
```

项目设置了 base 路径，必须带 `/nanqiao-night-market/` 访问，根路径不可用。

**本地常驻预览**：`启动预览.bat` / `停止预览.bat` 以零依赖静态服务（`scripts/preview-server.mjs`）托管 `dist/`，固定 5173 端口；改动后需重新 `npm run build`。

## 目录结构

```
├── docs/                 # 剧情与设计文档
├── scripts/              # 本地预览服务
├── tests/ui-smoke.cjs    # 界面回归自检
├── tests/responsive-audit.cjs  # 多页 × 多宽度的自适应审计
├── 启动预览.bat / 停止预览.bat
└── src/
    ├── assets/           # 图片（含地铁线网图）
    ├── components/       # NavBar、Footer、BackBar
    ├── data/             # 剧情数据（JSON）
    │   ├── accounts.json   # 账号：uid、密码、摊位号、角色
    │   ├── stalls.json     # 十家摊位与顾客评价
    │   ├── posts.json      # 论坛帖与评论
    │   ├── messages.json   # 各账号的私信会话与手记
    │   └── notices.json    # 公告（置顶通知、地铁、状态三态）
    ├── router/           # 路由与守卫
    ├── styles/           # 全局样式与设计变量
    ├── utils/            # 登录鉴权、进度与节点追踪
    ├── views/            # 各页面组件
    └── App.vue
```

## 数据维护

剧情全部由 `src/data/*.json` 驱动，改文案只需改数据，不必动组件。

两点容易出错：

1. **同一段对话存两份**：`messages.json` 按账号组织，A 与 B 的聊天同时存在于两个账号下，改一处必须同步另一处。
2. **`time` 字段格式**为「10月27日 18:50」，页面只显示日期，跨天处自动插入分隔行。

JSON 语法错误会导致整页空白，改完先验一遍：

```bash
node -e "JSON.parse(require('fs').readFileSync('src/data/messages.json','utf8'))"
```

## 界面规格

本作品采用**自适应（responsive）**界面规格，不锁定单一分辨率。

- 覆盖宽度：**360 – 1920px 全区间**，窗口任意缩放均不出现横向滚动条
- 主要断点：**720px**（切换单列布局、导航折叠，短信页与手记页改为横向选择列表）、**900px**（导览等版式的两列/一列切换）
- 实测矩阵：**9 档宽度**（360 / 390 / 430 / 768 / 820 / 1024 / 1280 / 1440 / 1920）× **15 个页面组合**（游客态 10 页 + 登录态 5 页，含摊位详情、帖子详情、私信、手记、管理处页），横向溢出均为 0
- 复测方式：`node tests/responsive-audit.cjs`（需站点在 5173 运行）

## 分支

| 分支 | 用途 |
|---|---|
| `main` | 线上版本，推送即触发 GitHub Pages 自动部署 |

本仓库只有 `main` 一条开发线，日常改动直接提交至 `main` 即可。上线前的版本停在提交 `bc7f276`，需要撤回上线时见 `HANDOVER.md` 第五节。

`improve/account-story-flow` 为另一套剧情方案（陈伯住院、1998 年走失档案、结局二选一），与本方案互不包含，二者只能保留其一。

## 分工

- 人A：项目骨架、全局样式、路由、NavBar/Footer、Intro/Home/Login
- 人B：Stalls、StallDetail、Forum、PostDetail 与对应数据
- 人C：Messages、Notes、Ending 与账号、私信数据
