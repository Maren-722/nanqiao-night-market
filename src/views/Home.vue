<template>
  <div class="home-page">
    <NavBar />

    <!-- 首屏：黄昏的街口，摊子还没收，灯已经亮了 -->
    <section class="hero">
      <img class="hero-food-photo" :src="foodImage('chenji')" alt="夜市灯下的糖粥藕" width="1536" height="1024" fetchpriority="high">
      <div class="hero-glow" aria-hidden="true"></div>

      <!-- 街上的一排棚顶与灯串（装饰） -->
      <svg class="hero-scene" viewBox="0 0 1440 280" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <!-- 远处的楼 -->
        <g fill="rgba(74,35,20,0.22)">
          <rect x="0" y="118" width="120" height="90" />
          <rect x="132" y="96" width="86" height="112" />
          <rect x="230" y="128" width="140" height="80" />
          <rect x="382" y="104" width="70" height="104" />
          <rect x="1010" y="112" width="96" height="96" />
          <rect x="1118" y="88" width="76" height="120" />
          <rect x="1206" y="122" width="130" height="86" />
          <rect x="1348" y="100" width="92" height="108" />
        </g>
        <!-- 远处的窗 -->
        <g fill="rgba(255,203,126,0.4)">
          <rect x="150" y="118" width="10" height="12" />
          <rect x="168" y="118" width="10" height="12" />
          <rect x="150" y="142" width="10" height="12" />
          <rect x="1136" y="112" width="10" height="12" />
          <rect x="1154" y="112" width="10" height="12" />
          <rect x="1136" y="136" width="10" height="12" />
        </g>

        <!-- 灯串：三段垂弧 -->
        <path
          v-for="(span, i) in lightSpans"
          :key="'wire-' + i"
          :d="span.path"
          fill="none"
          stroke="rgba(58,26,12,0.55)"
          stroke-width="1.4"
        />
        <circle
          v-for="(b, i) in bulbs"
          :key="'bulb-' + i"
          :cx="b.x"
          :cy="b.y"
          r="9"
          fill="rgba(255,190,92,0.16)"
        />
        <circle
          v-for="(b, i) in bulbs"
          :key="'bulb-core-' + i"
          :cx="b.x"
          :cy="b.y"
          r="3.1"
          fill="#FFE3B2"
        />

        <!-- 摊位棚顶 -->
        <g v-for="(s, i) in stalls" :key="'stall-' + i">
          <!-- 棚布 -->
          <path :d="`M${s.x},${s.y} L${s.x + s.w},${s.y} L${s.x + s.w - 8},${s.y + 26} L${s.x + 8},${s.y + 26} Z`" fill="#4A2413" />
          <!-- 棚布条纹 -->
          <path
            v-for="n in 4"
            :key="'stripe-' + n"
            :d="`M${s.x + n * 14},${s.y} L${s.x + n * 14 - 6},${s.y + 26}`"
            stroke="rgba(240,190,120,0.22)"
            stroke-width="4"
          />
          <!-- 摊身 -->
          <rect :x="s.x" :y="s.y + 26" :width="s.w" height="120" fill="#3F1E0F" />
          <!-- 摊上的灯 -->
          <rect :x="s.x + 12" :y="s.y + 40" :width="s.w - 24" height="30" fill="rgba(255,196,112,0.9)" />
          <rect :x="s.x + 12" :y="s.y + 40" :width="s.w - 24" height="30" fill="url(#warmFade)" />
          <!-- 蒸汽 -->
          <path
            :d="`M${s.x + s.w / 2},${s.y + 38} c-8,-12 8,-18 0,-30 c-7,-10 7,-14 1,-24`"
            fill="none"
            stroke="rgba(255,236,206,0.35)"
            stroke-width="2"
            stroke-linecap="round"
          />
        </g>

        <!-- 街面 -->
        <rect x="0" y="252" width="1440" height="28" fill="#3A1E10" />
        <defs>
          <linearGradient id="warmFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,214,150,0.5)" />
            <stop offset="100%" stop-color="rgba(255,180,90,0)" />
          </linearGradient>
        </defs>
      </svg>

      <div class="hero-inner">
        <p class="hero-kicker">临岗市 · 江边老街</p>
        <h1 class="hero-title">南桥夜市</h1>
        <p class="hero-sub">营业时间　每天　17:00 — 23:00</p>
        <div class="hero-links">
          <a @click="$router.push('/stalls')">逛夜市</a>
          <span class="hero-link-dot">·</span>
          <a @click="$router.push('/forum')">看论坛</a>
        </div>
      </div>

      <div class="hero-side" aria-hidden="true">
        <span class="hero-side-text">一条老街<br>灯一直亮着</span>
        <span class="seal hero-seal">临岗<br>南桥</span>
      </div>

      <span class="hero-date">2026.10.30</span>
    </section>

    <div class="container">

      <!-- 置顶：管理处的话（长期说明，特殊样式） -->
      <div v-if="pinnedNotice" class="pinned-card" @click="openNotice(0)">
        <span class="pinned-nail" aria-hidden="true"></span>
        <div class="pinned-body">
          <p class="pinned-tag">置顶 · 管理处</p>
          <p class="pinned-text">{{ pinnedNotice.text }}</p>
        </div>
        <span class="pinned-arrow">›</span>
      </div>

      <!-- 公告栏 -->
      <h2 class="section-title">公告栏</h2>
      <div class="notice-bar">
        <div
          v-for="(n, i) in regularNotices"
          :key="n.id"
          class="notice-item"
          @click="openNotice(i + 1)"
        >
          <span class="notice-pin" aria-hidden="true"></span>
          <div class="notice-body">
            <p class="notice-text">{{ n.text }}</p>
            <p class="notice-meta">
              <span class="notice-tag" :style="{ color: tagColors[n.tag] || 'var(--color-primary)' }">{{ n.tag }}</span>
              管理处 · {{ n.publishDate }}
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
import { foodImage } from '../utils/foodImages'
import { ref, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import noticesData from '../data/notices.json'
import { markNode } from '../utils/progress'
import metroMap from '../assets/metro-map.png'

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
const pinnedNotice = computed(() => visibleNotices.value.find(n => n.pinned) || null)
const regularNotices = computed(() => visibleNotices.value.filter(n => !n.pinned))

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

// ---------------- 首屏装饰：灯串与棚顶 ----------------
// 三段垂弧，每段是一条二次贝塞尔曲线；灯泡按曲线取点，位置不会飘
const lightSpans = [
  { x0: -40, x1: 500, ctrl: 230, cy: 96, y0: 34, y1: 40 },
  { x0: 480, x1: 980, ctrl: 730, cy: 104, y0: 40, y1: 36 },
  { x0: 960, x1: 1480, ctrl: 1220, cy: 92, y0: 36, y1: 42 }
].map(s => ({
  ...s,
  path: `M${s.x0},${s.y0} Q${s.ctrl},${s.cy} ${s.x1},${s.y1}`
}))

function quadPoint(s, t) {
  const mt = 1 - t
  return {
    x: mt * mt * s.x0 + 2 * mt * t * s.ctrl + t * t * s.x1,
    y: mt * mt * s.y0 + 2 * mt * t * s.cy + t * t * s.y1
  }
}
const bulbs = lightSpans.flatMap(s =>
  [0.14, 0.34, 0.52, 0.7, 0.88].map(t => quadPoint(s, t))
)

const stalls = [
  { x: 20, y: 148, w: 158 },
  { x: 196, y: 156, w: 142 },
  { x: 356, y: 146, w: 150 },
  { x: 1010, y: 150, w: 160 },
  { x: 1188, y: 158, w: 136 },
  { x: 1340, y: 146, w: 152 }
]

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
/* ---------- 首屏：黄昏的街口 ---------- */
.hero {
  position: relative;
  overflow: hidden;
  min-height: 560px;
  background: linear-gradient(
    180deg,
    #642C18 0%,
    #8F3D1F 26%,
    #B75A28 52%,
    #DB9245 76%,
    #F0C98F 92%,
    #F0DDBB 100%
  );
}
/* 街口那一片被灯照暖的空气 */
.hero-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(560px 260px at 22% 34%, rgba(255, 205, 140, 0.34), transparent 70%),
    radial-gradient(460px 240px at 82% 26%, rgba(255, 178, 92, 0.24), transparent 72%),
    radial-gradient(700px 300px at 50% 108%, rgba(255, 214, 150, 0.3), transparent 70%);
}
.hero-scene {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 280px;
  display: block;
}
.hero-inner {
  position: relative;
  z-index: 2;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 86px 28px 0;
}
.hero-kicker {
  font-size: 11px;
  letter-spacing: 5px;
  color: rgba(255, 226, 181, 0.95);
  text-shadow: 0 1px 10px rgba(74, 35, 20, 0.5);
}
.hero-title {
  font-family: var(--font-title);
  font-size: 76px;
  font-weight: 600;
  letter-spacing: 14px;
  line-height: 1.12;
  color: #FFF6E4;
  margin: 18px 0 0;
  text-shadow: 0 2px 0 rgba(90, 38, 16, 0.28), 0 18px 40px rgba(74, 35, 20, 0.35);
}
.hero-sub {
  margin-top: 18px;
  display: inline-block;
  padding: 6px 14px;
  font-size: 12.5px;
  letter-spacing: 2.6px;
  color: #FFF0D4;
  background: rgba(74, 35, 20, 0.34);
  border: 1px solid rgba(255, 214, 150, 0.42);
  border-radius: var(--radius);
  backdrop-filter: blur(2px);
}
.hero-links {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 26px;
  font-size: 13.5px;
  letter-spacing: 2px;
}
.hero-links a {
  color: #FFF1D8;
  border-bottom: 1px solid rgba(255, 226, 181, 0.55);
  padding-bottom: 3px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, letter-spacing 0.2s;
}
.hero-links a:hover {
  color: #FFFFFF;
  border-color: #FFFFFF;
  letter-spacing: 3px;
}
.hero-link-dot {
  color: rgba(255, 226, 181, 0.6);
}
.hero-side {
  position: absolute;
  right: 46px;
  top: 96px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.hero-side-text {
  writing-mode: vertical-rl;
  font-family: var(--font-title);
  font-size: 12.5px;
  letter-spacing: 7px;
  line-height: 1.9;
  color: rgba(255, 236, 206, 0.72);
}
.hero-seal {
  border-color: rgba(255, 226, 181, 0.8);
  color: rgba(255, 236, 206, 0.9);
  background: rgba(120, 44, 20, 0.25);
}
.hero-date {
  position: absolute;
  right: 30px;
  bottom: 20px;
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(255, 244, 222, 0.55);
  z-index: 3;
}

/* ---------- 置顶：挂在管理处门口的木牌 ---------- */
.pinned-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(180deg, #5A3220 0%, #472517 100%);
  border: 1px solid #6E4128;
  border-radius: var(--radius-lg);
  padding: 18px 24px 18px 26px;
  margin-bottom: 32px;
  cursor: pointer;
  box-shadow: 0 18px 34px -22px rgba(58, 26, 12, 0.9);
  transition: transform 0.2s, box-shadow 0.2s;
}
.pinned-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 40px -22px rgba(58, 26, 12, 0.95);
}
.pinned-nail {
  position: absolute;
  left: 9px;
  top: 50%;
  width: 5px;
  height: 5px;
  margin-top: -2.5px;
  border-radius: 50%;
  background: #E9C48C;
  box-shadow: 0 0 6px rgba(255, 214, 150, 0.8);
}
.pinned-body {
  flex: 1;
  min-width: 0;
}
.pinned-tag {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--amber-soft);
  margin-bottom: 5px;
}
.pinned-text {
  font-family: var(--font-title);
  font-size: 16.5px;
  letter-spacing: 1.2px;
  line-height: 1.7;
  color: #FBF0DA;
  font-weight: 600;
}
.pinned-arrow {
  color: var(--amber-soft);
  font-size: 22px;
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
  .hero {
    min-height: 440px;
  }
  .hero-inner {
    padding: 54px 18px 0;
  }
  .hero-title {
    font-size: 44px;
    letter-spacing: 8px;
  }
  .hero-sub {
    font-size: 11px;
    letter-spacing: 1.6px;
  }
  .hero-side {
    display: none;
  }
  .hero-scene {
    height: 190px;
  }
  .hero-date {
    display: none;
  }
  .pinned-text {
    font-size: var(--font-body-size);
  }
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

<style scoped>
.hero { min-height:480px; background:#38241b; }
.hero-food-photo { position:absolute; right:0; top:0; width:70%; height:100%; object-fit:cover; object-position:center 60%; }
.hero-glow { z-index:1; background:linear-gradient(90deg,#38241b 8%,#38241bf0 26%,#38241b70 55%,#38241b10 100%); }
.hero-scene { display:none; }
.hero-inner { padding-top:105px; padding-bottom:92px; }
.hero-title { font-size:72px; }
.hero-sub { border:0; padding:0; background:none; margin-top:26px; }
.hero-links { margin-top:32px; }
.hero-links a { border:1px solid #e5c7a68a; border-radius:3px; padding:9px 20px; background:#39281d70; }
.hero-links a:hover { background:#9c432b; letter-spacing:2px; }
.hero-side { display:none; }
.hero-date { color:#fff1d8; }
.pinned-card { border-radius:8px; }
.notice-item { padding-top:22px; padding-bottom:22px; }
@media(max-width:720px) { .hero { min-height:390px; } .hero-food-photo { width:100%; } .hero-glow { background:linear-gradient(90deg,#38241be8,#38241b50); } .hero-inner { padding-top:70px; padding-bottom:65px; } .hero-title { font-size:48px; letter-spacing:8px; } .hero-sub { font-size:11px; letter-spacing:1px; } }
</style>
