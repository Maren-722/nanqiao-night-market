# 南桥夜市 · 网页解谜游戏

一款基于 Vue 3 的单页网页解谜游戏。玩家以游客身份进入「南桥夜市」官网，从公告、摊位、论坛、私信与被找回的手记里，拼出糖粥藕摊主陈桂生（陈伯）失踪的经过，并在最后做出一次选择。

- **在线体验**：https://maren-722.github.io/nanqiao-night-market/
- **作品类型**：叙事解谜 / 前端单页应用（无后端、无数据库、无登录服务）
- **运行环境**：Chrome 129 及以上（Chromium 内核，Edge 同样可用）；代码不使用 Chrome 129 之后新增的 CSS/JS 特性，界面自适应 360–1920px

## 一、组内成员与分工

| 成员 | GitHub | 负责内容 |
|---|---|---|
| 樊梦值（队长） | @Maren-722 | 网页框架与页面结构、全局样式与设计变量、路由与导航；公告与置顶通知文案；首页、登录页文案；部署与自检脚本 |
| 宋雨欣 | @2x1y3z | 解谜线索与推进设计；前情提要设计；界面优化；摊位、论坛等页面的文本撰写 |
| 仇仪宁 | @kikoZero | 网页界面优化，参与页面细节打磨 |

## 二、第三方库与工具（均为本组以外的开源依赖）

| 库 | 版本 | 用途 | 是否进入构建产物 | 许可证 |
|---|---|---|---|---|
| vue | ^3.5.13 | 组件化页面渲染与响应式状态 | 是（打包进 `dist`） | MIT |
| vue-router | ^4.5.0 | hash 模式路由、页面跳转与登录守卫 | 是 | MIT |
| vite | ^6.0.11 | 开发服务器、生产打包，`base` 设为 `/nanqiao-night-market/` | 否（仅构建期） | MIT |
| @vitejs/plugin-vue | ^5.2.1 | 让 Vite 编译 `.vue` 单文件组件 | 否（仅构建期） | MIT |
| puppeteer-core | ^25.16.0 | 仅在 `tests/` 下驱动本机浏览器做界面自检，不参与运行时 | 否 | Apache-2.0 |

**未使用任何预设样式库**：没有 Bootstrap、Element Plus、Vuetify、Tailwind、Animate.css 等；也没有引入 UI 组件库、图标库、图表库、CDN 资源或远程字体。全部样式手写在 `src/styles/` 与各组件 `<style scoped>` 中，字体使用系统字体栈（不下载字体文件）。

**作品无后端**：无服务端、无数据库、无 CMS、无管理后台。剧情数据是打包进前端的 JSON，玩家的登录态、发帖、评论与手记存于浏览器 localStorage。

### 关于 `/manager` 页面（提交说明）

`/manager` 是游戏内的叙事页面（夜市管理处工作台），由前端组件与 JSON 数据驱动，**不是后端管理系统**：不涉及 CMS、后台框架、服务端接口或数据库。

## 三、素材来源与授权

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
- 图片已统一转为 WebP 以减小体积，来源与许可不因格式转换而改变
- 完整的来源、作者、许可链接与改编说明见 `src/data/image-credits.json`

## 四、怎么玩

1. 打开在线地址，首页往下滑能看到公告（含置顶通知）、十月排班与地铁信息
2. 「夜市导览」十家摊位两列排布（A1–A5 / B1–B5），点开可看摊主、菜品、价格与顾客留言
3. 「夜市论坛」用任意用户名注册即可发帖、评论，内容存在本机
4. 以剧情角色登录后，可进入该角色的私信与被找回的手记
   - 体验账号：陈伯，ID `A1`，密码 `20060816`
5. 线索散落在公告、摊位留言、论坛帖、私信和手记里，页面不会直接把答案摆出来

## 五、运行与构建

```bash
npm install
npm run dev        # 开发服务器，访问 http://localhost:5173/nanqiao-night-market/
npm run build      # 打包至 dist/
npm run test:ui    # 界面回归自检（需本机 Chrome，或设 CHROME_PATH）
node tests/responsive-audit.cjs       # 自适应审计：10 个页面 × 9 档宽度
node tests/competition-env-check.cjs  # 参赛环境实测：1920/1440/720 三档 + 三档网速
```

项目设置了 base 路径，必须带 `/nanqiao-night-market/` 访问，根路径不可用。

**本地常驻预览**：`启动预览.bat` / `停止预览.bat` 以零依赖静态服务（`scripts/preview-server.mjs`）托管 `dist/`，固定 5173 端口；改动后需重新 `npm run build`。

## 六、目录结构

```
├── docs/                 # 剧情与设计文档（内部资料，不随作品提交）
├── scripts/              # 本地预览服务
├── tests/ui-smoke.cjs    # 界面回归自检
├── tests/responsive-audit.cjs  # 多页 × 多宽度的自适应审计
├── tests/competition-env-check.cjs  # 界面规格 + 慢网实测
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

## 七、数据维护

剧情全部由 `src/data/*.json` 驱动，改文案只需改数据，不必动组件。

两点容易出错：

1. **同一段对话存两份**：`messages.json` 按账号组织，A 与 B 的聊天同时存在于两个账号下，改一处必须同步另一处。
2. **`time` 字段格式**为「10月27日 18:50」，页面只显示日期，跨天处自动插入分隔行。

JSON 语法错误会导致整页空白，改完先验一遍：

```bash
node -e "JSON.parse(require('fs').readFileSync('src/data/messages.json','utf8'))"
```

## 八、界面规格

本作品采用**自适应（responsive）**界面规格，不锁定单一分辨率。

- 覆盖宽度：**360 – 1920px 全区间**，窗口任意缩放均不出现横向滚动条
- 主要断点：**720px**（切换单列布局、导航折叠，短信页与手记页改为横向选择列表）、**900px**（导览等版式的两列/一列切换）
- 实测矩阵：**9 档宽度**（360 / 390 / 430 / 768 / 820 / 1024 / 1280 / 1440 / 1920）× **15 个页面组合**（游客态 10 页 + 登录态 5 页，含摊位详情、帖子详情、私信、手记、管理处页），横向溢出均为 0
- 赛事三档规格 1920×1080 / 1440×900 / 720×1280 × 5 个主要页面实测，横向溢出同样为 0
- 复测方式：`node tests/responsive-audit.cjs`（需站点在 5173 运行）

## 九、资源体积与加载

- 图片全部为 **WebP**：10 张摊位图合计 1.10MB（单张 70–130KB，宽 960）、首页主视觉 146KB（1672×941）、地铁线路图 64KB；`dist` 总产物约 1.4MB
- 摊位图 `loading="lazy"`，首页主视觉 `fetchpriority="high"`
- 慢网实测（1920×1080）：正常网首页 206KB、导览 1.16MB；较慢 3G（1.6Mbps）导览 10 张图 5s 全部出；极慢 400kbps 首页正文 2s、主视觉 6s，导览 10 张 22s 全部出
- 复测方式：`node tests/competition-env-check.cjs`（需 `npm run build` + `npm run preview -- --port 4174`）

## 十、部署

| 分支 | 用途 |
|---|---|
| `main` | 线上版本，推送即触发 GitHub Pages 自动部署 |

- 部署方式：GitHub Pages，Source 设为 GitHub Actions，工作流 `.github/workflows/deploy.yml`；`vite.config.js` 的 `base` 为 `/nanqiao-night-market/`
- 线上地址：https://maren-722.github.io/nanqiao-night-market/
- 本仓库只有 `main` 一条开发线，日常改动直接提交至 `main`

## 十一、提交包说明

- **不要**把 `docs/主线改造方案.md` 放进提交包：它含全部谜底，仅供组内开发
- `HANDOVER.md` 是内部交接文档，同样不随作品提交
- `dist/`、`node_modules/` 不入库，构建产物由 CI 生成
- 线上版本与 `main` 分支一致，评委可直接用上面的在线地址体验

建议的提交包内容：

```
README.md              必交，即本文档
index.html
package.json
package-lock.json
vite.config.js
src/                   全部页面组件、样式与剧情 JSON
public/                图片资源（WebP）
.github/workflows/deploy.yml   可选，用于复现自动部署
tests/                 可选，自检脚本
```
