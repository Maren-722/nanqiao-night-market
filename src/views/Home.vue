<template>
  <div class="home-page">
    <NavBar />

    <section class="hero" aria-labelledby="market-title">
      <img class="hero-art" :src="marketScene" alt="江边入夜的南桥夜市，灯串下有人散步，摊主正在为客人盛饭" width="1672" height="941" fetchpriority="high">
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="hero-kicker">临岗市 · 江边老街</p>
        <h1 id="market-title" class="hero-title">南桥夜市</h1>
        <p class="hero-sub">营业时间　每天 17:00 — 23:00</p>
        <div class="hero-links">
          <router-link class="hero-primary" to="/stalls">逛夜市</router-link>
          <router-link class="hero-secondary" to="/forum">看论坛</router-link>
        </div>
      </div>
      <div class="hero-steam" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="scroll-hint" :class="{ 'is-hidden': !showHint }" aria-hidden="true">
        <span class="scroll-hint-text">下滑看公告与排班</span>
        <span class="scroll-hint-arrow">⌄</span>
      </div>
    </section>

    <div class="container">

      <!-- 公告栏（置顶通知同样列在栏内首位） -->
      <h2 class="section-title">公告栏</h2>
      <div class="notice-bar">
        <div
          v-for="(n, i) in visibleNotices"
          :key="n.id"
          class="notice-item"
          :class="{ 'is-pinned': n.pinned }"
          @click="openNotice(i)"
        >
          <span class="notice-pin" aria-hidden="true"></span>
          <div class="notice-body">
            <p class="notice-text">{{ n.text }}</p>
            <p class="notice-meta">
              <span class="notice-tag" :style="{ color: tagColors[n.tag] || 'var(--color-primary)' }">{{ n.tag }}</span>
              <span v-if="n.pinned" class="notice-pinned-tag">置顶</span>
              管理处 · {{ n.publishDate || '长期' }}
            </p>
          </div>
          <span class="notice-arrow">›</span>
        </div>
      </div>

      <!-- 公告详情弹窗 -->
      <div v-if="showModal" class="modal-mask" @click.self="closeNotice">
        <div
          class="modal-card"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div class="modal-header">
            <span class="notice-tag-box" :style="{ background: tagColors[activeNotice.tag] || 'var(--color-primary)' }">{{ activeNotice.tag }}</span>
            <h3 class="modal-title">{{ activeNotice.text }}</h3>
            <button class="modal-close" @click="closeNotice">×</button>
          </div>
          <p class="modal-meta">
            南桥夜市管理处<template v-if="activeNotice.publishDate"> · {{ activeNotice.publishDate }}</template><template v-if="activeNotice.dateRange && activeNotice.dateRange !== '长期'"> · {{ activeNotice.dateRange }}</template>
          </p>
          <div class="modal-content">{{ activeNotice.fullText }}</div>

          <!-- 地铁公告：线路示意图直接展示 -->
          <div v-if="activeNotice.metro" class="metro-block">
            <div class="metro-map-wrap">
              <img class="metro-img" :src="metroMap" alt="临江市轨道交通线网图" />
              <p class="metro-note">示意图仅供参考，以车站实际公告为准。</p>
            </div>
          </div>

          <div class="modal-nav" v-if="visibleNotices.length > 1">
            <button class="modal-arrow" @click="prevNotice">‹</button>
            <span class="modal-count">{{ activeIndex + 1 }} / {{ visibleNotices.length }}</span>
            <button class="modal-arrow" @click="nextNotice">›</button>
          </div>
        </div>
      </div>

      <!-- 排班表：2026年10月 日历 -->
      <h2 class="section-title">夜市排班表</h2>
      <p class="table-desc">十月值日安排，每天两位摊主轮流值守收摊巡查，由管理处统一排班。</p>
      <div class="cal-board">
        <div class="cal-grid">
          <div class="cal-head" v-for="w in weekNames" :key="w">{{ w }}</div>
          <div v-for="pad in leadPads" :key="'pad-' + pad" class="cal-day cal-pad"></div>
          <div
            v-for="day in october"
            :key="day.date"
            class="cal-day"
            :class="{ today: day.date === 30, alert: day.anyStruck }"
          >
            <div class="cal-top">
              <span class="cal-date">{{ day.date }}</span>
              <span v-if="day.date === 30" class="cal-today-tag">今天</span>
            </div>
            <div class="cal-shops">
              <template v-for="(shop, si) in day.shops" :key="si">
                <template v-if="shop.struck">
                  <span class="cal-shop struck">{{ shop.name }}</span><span class="cal-replace">→{{ shop.replacedBy }}</span>
                </template>
                <span v-else class="cal-shop">{{ shop.name }}</span>
                <br v-if="si === 0">
              </template>
            </div>
          </div>
        </div>
        <p class="cal-legend"><span class="struck-demo">划线</span> 为请假/停摊，由 <span class="replace-demo">绿色</span> 摊位顶替。</p>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import marketScene from '../assets/night-market-dusk.webp'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import noticesData from '../data/notices.json'
import { markNode } from '../utils/progress'
import metroMap from '../assets/metro-map.webp'

// 首屏下滑提示：开始滚动后淡出，不干扰阅读
const showHint = ref(true)
function onHeroScroll() {
  showHint.value = window.scrollY < 80
}
onMounted(() => window.addEventListener('scroll', onHeroScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onHeroScroll))

// 公告标签配色
const tagColors = {
  '通知': 'var(--color-danger)',
  '开业': 'var(--color-success)',
  '上新': 'var(--color-accent)',
  '活动': 'var(--color-primary)'
}

// 首页只展示「刊登中」：置顶的单独渲染，其余按发布日期新的在前
function parseDate(s) {
  const m = String(s || '').match(/(\d+)月(\d+)日/)
  return m ? (+m[1]) * 100 + (+m[2]) : 0
}
const visibleNotices = computed(() => {
  const active = noticesData.filter(n => n.state === '刊登中')
  const pinned = active.filter(n => n.pinned)
  const regular = active
    .filter(n => !n.pinned)
    .sort((a, b) => parseDate(b.publishDate) - parseDate(a.publishDate))
  return [...pinned, ...regular]
})

// 公告弹窗
const showModal = ref(false)
const activeIndex = ref(0)
const activeNotice = computed(() => visibleNotices.value[activeIndex.value])

function openNotice(i) {
  activeIndex.value = i
  showModal.value = true
  // 地铁公告：弹窗打开即能看到线路图，打开时就记录进度
  if (activeNotice.value?.metro) {
    markNode('metro-map')
  }
}
function closeNotice() {
  showModal.value = false
}
function prevNotice() {
  const len = visibleNotices.value.length
  activeIndex.value = (activeIndex.value - 1 + len) % len
  if (activeNotice.value?.metro) markNode('metro-map')
}
function nextNotice() {
  const len = visibleNotices.value.length
  activeIndex.value = (activeIndex.value + 1) % len
  if (activeNotice.value?.metro) markNode('metro-map')
}

// 移动端左右滑动切换
let touchStartX = 0
function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
}
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (dx > 50) prevNotice()
  else if (dx < -50) nextNotice()
}

// ---------------- 排班表：2026年10月 ----------------
const weekNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
// 2026年10月1日是周四 → 周一开头的日历前面空3格
const leadPads = 3

// 每周值班模板（摊位按此轮值，老摊位每周两次）
const weekPlan = {
  1: ['老街凉面', '巷尾臭豆腐'],      // 周一
  2: ['陈记糖粥藕', '小李炒粉'],      // 周二
  3: ['鲜果小铺', '炭火烧烤'],        // 周三
  4: ['巷口馄饨', '刘姐麻辣烫'],      // 周四
  5: ['张记卤味', '街角烤冷面'],      // 周五
  6: ['巷口馄饨', '巷尾臭豆腐'],      // 周六
  0: ['陈记糖粥藕', '老街凉面']       // 周日
}

// 陈伯的班被划掉的日期：10.6/10.11 住院那一周，10.27 失踪之后
const struckMap = {
  6: { '陈记糖粥藕': '炭火烧烤' },
  11: { '陈记糖粥藕': '刘姐麻辣烫' },
  27: { '陈记糖粥藕': '鲜果小铺' }
}

const october = []
for (let d = 1; d <= 31; d++) {
  const weekday = new Date(2026, 9, d).getDay()
  const struck = struckMap[d] || {}
  const shops = weekPlan[weekday].map(name => ({
    name,
    struck: !!struck[name],
    replacedBy: struck[name] || ''
  }))
  october.push({
    date: d,
    shops,
    anyStruck: shops.some(s => s.struck)
  })
}

</script>

<style scoped>
/* 首页插画保持完整构图，交互与文字由 HTML 呈现。 */
.hero { position:relative; isolation:isolate; overflow:hidden; aspect-ratio:1672 / 941; min-height:580px; max-height:900px; background:#343139; }
.hero-art { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center bottom; }
.hero-shade { position:absolute; inset:0; background:linear-gradient(90deg,rgba(27,23,29,.16),transparent 66%); }
.hero-inner { position:relative; z-index:2; width:min(100%,1440px); margin:0 auto; padding:clamp(64px,7vw,120px) clamp(28px,7vw,110px) 80px; color:#fff0d5; }
.hero-kicker { font-size:clamp(13px,1.5vw,21px); letter-spacing:5px; }
.hero-title { font-family:var(--font-title); font-size:clamp(56px,6.7vw,100px); font-weight:500; line-height:1.3; letter-spacing:7px; margin:20px 0 18px; color:#fff2d9; text-shadow:0 2px 12px #211b2225; }
.hero-sub { font-size:clamp(13px,1.5vw,20px); letter-spacing:2px; }
.hero-links { display:flex; align-items:center; gap:38px; margin-top:40px; font-size:clamp(15px,1.6vw,21px); letter-spacing:2px; }
.hero-primary { display:inline-flex; align-items:center; gap:20px; padding:12px 28px; background:#f5dfb6; color:#48301e; border:1px solid #f9e8cb; border-radius:4px; transition:background .2s,transform .2s; }
.hero-primary:hover { background:#fff0d2; transform:translateY(-2px); }
/* 「看论坛」与「逛夜市」保持同一套按钮风格 */
.hero-secondary { display:inline-flex; align-items:center; gap:20px; padding:12px 28px; background:#f5dfb6; color:#48301e; border:1px solid #f9e8cb; border-radius:4px; transition:background .2s,transform .2s; }
.hero-secondary:hover { background:#fff0d2; transform:translateY(-2px); }
.hero-steam { position:absolute; right:12%; bottom:22%; width:60px; height:90px; pointer-events:none; opacity:.32; }
.hero-steam i { position:absolute; bottom:0; left:15px; width:20px; height:60px; border-left:2px solid #f7e9d0; border-radius:50%; filter:blur(3px); animation:marketSteam 7s ease-in-out infinite; }
.hero-steam i:nth-child(2) { left:30px; animation-delay:-2.3s; }
.hero-steam i:nth-child(3) { left:4px; animation-delay:-4.6s; }
@keyframes marketSteam { 0% { opacity:0; transform:translate(0,15px) scale(.7); } 35% { opacity:.7; } 100% { opacity:0; transform:translate(-12px,-60px) scale(1.4); } }

/* 首屏下滑提示：轻微浮动，滚动后淡出 */
.scroll-hint {
  position:absolute;
  left:50%;
  bottom:16px;
  z-index:3;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:1px;
  transform:translateX(-50%);
  opacity:.88;
  pointer-events:none;
  transition:opacity .45s ease;
  animation:hintFloat 2.8s ease-in-out infinite;
}
.scroll-hint.is-hidden { opacity:0; }
.scroll-hint-text {
  font-size:12px;
  letter-spacing:2px;
  color:#f9e7c8;
  text-shadow:0 1px 8px rgba(32,22,28,.55);
}
.scroll-hint-arrow {
  font-size:17px;
  line-height:1;
  color:#f0d2a6;
  text-shadow:0 1px 8px rgba(32,22,28,.55);
}
@keyframes hintFloat {
  0%, 100% { transform:translate(-50%, 0); }
  50% { transform:translate(-50%, -5px); }
}

/* ---------- 公告栏：贴在墙上的纸条 ---------- */
.notice-bar {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2px 24px;
  box-shadow: var(--shadow-soft);
}
.notice-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 17px 0;
  border-bottom: 1px dashed var(--color-border);
  cursor: pointer;
  transition: background 0.15s, padding-left 0.2s;
}
.notice-item:last-child {
  border-bottom: none;
}
.notice-item:hover {
  background: var(--color-card-2);
  padding-left: 6px;
}
/* 公告栏内首位的置顶条目：沿用木牌的褐色底 */
.notice-item.is-pinned {
  background: linear-gradient(180deg, #5A3220 0%, #472517 100%);
  border: 1px solid #6E4128;
  margin: 2px -24px 0;
  padding: 18px 24px;
  border-bottom: 1px solid #6E4128;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.notice-item.is-pinned:hover {
  background: linear-gradient(180deg, #653926 0%, #4E2A1A 100%);
  padding-left: 28px;
}
.notice-item.is-pinned .notice-text {
  color: #FBF0DA;
  font-family: var(--font-title);
  font-size: 16.5px;
  letter-spacing: 1.2px;
  font-weight: 600;
}
.notice-item.is-pinned .notice-meta {
  color: var(--amber-soft);
}
.notice-item.is-pinned .notice-tag {
  color: var(--amber-soft) !important;
}
.notice-item.is-pinned .notice-pin {
  background: #E9C48C;
  box-shadow: 0 0 0 3px rgba(255, 214, 150, 0.18);
}
.notice-item.is-pinned .notice-arrow {
  color: var(--amber-soft);
}
.notice-pinned-tag {
  display: inline-block;
  color: #F0C58A;
  border: 1px solid rgba(240, 197, 138, 0.5);
  border-radius: 2px;
  padding: 0 5px;
  font-size: 10px;
  letter-spacing: 1px;
  margin-right: 8px;
  transform: translateY(-1px);
}
.notice-pin {
  width: 8px;
  height: 8px;
  margin-top: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(180, 71, 42, 0.12);
  flex-shrink: 0;
}
.notice-body {
  flex: 1;
  min-width: 0;
}
.notice-text {
  font-size: 14.5px;
  color: var(--color-text);
  line-height: 1.7;
}
.notice-meta {
  margin-top: 4px;
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
}
.notice-tag {
  font-weight: 600;
  letter-spacing: 1px;
  margin-right: 8px;
}
.notice-arrow {
  color: var(--color-border-strong);
  font-size: 18px;
  line-height: 1.4;
}
.notice-tag-box {
  color: #FFF4E2;
  padding: 2px 9px;
  border-radius: var(--radius);
  font-size: 11px;
  letter-spacing: 1px;
  flex-shrink: 0;
  margin-top: 3px;
}

/* ---------- 公告详情弹窗 ---------- */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(46, 22, 10, 0.62);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal-card {
  max-width: 580px;
  width: 100%;
  max-height: 86vh;
  overflow-y: auto;
  background: var(--color-card);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  padding: 30px 28px;
  box-shadow: 0 30px 70px -30px rgba(58, 26, 12, 0.9);
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--space-sm);
}
.modal-title {
  flex: 1;
  font-family: var(--font-title);
  font-size: 19px;
  letter-spacing: 1px;
  color: var(--color-text);
  line-height: 1.5;
}
.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0 4px;
}
.modal-close:hover {
  color: var(--color-accent);
}
.modal-meta {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-md);
}
.modal-content {
  font-size: var(--font-body-size);
  line-height: 1.95;
  white-space: pre-line;
  color: var(--color-text);
}
.modal-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--color-border);
}
.modal-arrow {
  background: var(--color-card-2);
  border: 1px solid var(--color-border);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 18px;
  color: var(--color-primary);
  cursor: pointer;
  line-height: 1;
  transition: border-color 0.2s, color 0.2s;
}
.modal-arrow:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.modal-count {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
}

/* 地铁线路图 */
.metro-block {
  margin-top: var(--space-md);
}
.metro-map-wrap {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #FFFDF6;
  padding: 8px;
}
.metro-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: calc(var(--radius) - 2px);
}
.metro-note {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  text-align: center;
  margin-top: 6px;
}

/* ---------- 排班日历：管理处墙上的一张表 ---------- */
.table-desc {
  font-size: var(--font-small);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}
.cal-board {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 18px 18px 12px;
  box-shadow: var(--shadow-soft);
}
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: var(--space-xs);
}
.cal-head {
  text-align: center;
  font-size: 11px;
  letter-spacing: 1.8px;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 4px 0 12px;
  border-bottom: 1px solid var(--color-border);
}
.cal-day {
  background: #FFFBF0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 9px 8px;
  min-height: 98px;
}
.cal-pad {
  background: transparent;
  border-color: transparent;
}
.cal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}
.cal-date {
  font-family: var(--font-title);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}
.cal-today-tag {
  font-size: 9px;
  letter-spacing: 1px;
  background: var(--color-accent);
  color: #FFF4E2;
  padding: 1px 6px;
  border-radius: 1px;
}
.cal-day.today {
  border-color: var(--color-accent);
  background: #FFF3D9;
  box-shadow: inset 0 0 0 1px rgba(180, 71, 42, 0.25);
}
.cal-day.alert {
  border-color: #E2BFA4;
  background: #FBEDE1;
}
.cal-day.today.alert {
  border-color: var(--color-accent);
}
.cal-shops {
  font-size: 10.5px;
  line-height: 1.9;
}
.cal-shop {
  color: var(--color-text-secondary);
  display: inline-block;
}
.cal-shop.struck {
  color: var(--color-danger);
  text-decoration: line-through;
  font-weight: 600;
}
.cal-replace {
  color: var(--color-success);
  font-size: 10px;
  margin-left: 2px;
}
.cal-legend {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  padding-top: 8px;
  border-top: 1px dashed var(--color-border);
  margin-top: 6px;
}
.struck-demo {
  color: var(--color-danger);
  text-decoration: line-through;
}
.replace-demo {
  color: var(--color-success);
}

@media (max-width: 720px) {
  .hero { aspect-ratio:auto; min-height:640px; }
  .hero-art { object-position:64% bottom; }
  .hero-shade { background:linear-gradient(180deg,rgba(28,25,32,.65),rgba(28,25,32,.16) 48%,transparent 74%); }
  .hero-inner { padding:54px 24px 300px; }
  .scroll-hint { bottom:12px; }
  .scroll-hint-text { font-size:11px; letter-spacing:1.5px; }
  .hero-kicker { font-size:12px; letter-spacing:3px; }
  .hero-title { font-size:48px; letter-spacing:5px; margin:20px 0; }
  .hero-sub { font-size:12px; letter-spacing:.5px; }
  .hero-links { margin-top:30px; gap:28px; font-size:15px; }
  .hero-primary { padding:10px 22px; gap:14px; }
  .hero-steam { display:none; }
  .cal-board {
    padding: 12px 10px 8px;
  }
  .cal-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 3px;
  }
  .cal-day {
    padding: 5px 3px;
    min-height: 72px;
  }
  .cal-shops {
    font-size: 9px;
    line-height: 1.55;
  }
  .cal-date {
    font-size: var(--font-small);
  }
  .cal-head {
    font-size: 10px;
    letter-spacing: 0;
  }
}
</style>
