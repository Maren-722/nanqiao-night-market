<template>
  <div class="intro-page">
    <!-- ===== 夜色背景层 ===== -->
    <div class="scene" aria-hidden="true">
      <div class="sky"></div>
      <div class="moon"></div>
      <span v-for="n in 12" :key="'s' + n" class="star" :style="starStyle(n)"></span>
      <span v-for="n in 24" :key="'b' + n" class="bokeh" :class="'bokeh-' + (n % 4)" :style="bokehStyle(n)"></span>
      <span v-for="n in 6" :key="'l' + n" class="bokeh-lg" :style="bigBokehStyle(n)"></span>
      <!-- 秋叶：打着旋儿缓缓落下 -->
      <span v-for="n in 9" :key="'f' + n" class="leaf-fall" :style="leafStyle(n)"><i class="leaf" :class="'leaf-' + (n % 4)"></i></span>
      <div class="mist mist-1"></div>
      <div class="mist mist-2"></div>
      <div class="horizon"></div>
      <div class="ground-glow"></div>
      <div class="vignette"></div>
    </div>

    <!-- 右缘竖排落款 -->
    <span class="intro-side" aria-hidden="true">临岗市 · 江边老街 · 十月</span>

    <!-- ===== 序幕 ===== -->
    <main class="intro-main">
      <header class="intro-header">
        <p class="intro-eyebrow">前 情 提 要</p>
      </header>

      <!-- 开场句：主角，逐字浮现 -->
      <h1 class="intro-hero" aria-label="你是一名刚到临岗市的大一新生。">
        <span
          v-for="(c, i) in heroChars"
          :key="i"
          class="hero-char"
          :style="{ animationDelay: 0.4 + i * 0.06 + 's' }"
        >{{ c }}</span>
      </h1>

      <div class="intro-rule" aria-hidden="true"><i></i><span>◆</span><i></i></div>

      <section class="intro-story">
        <p class="intro-text">开学两周，你还没适应这座江边城市的秋天。今天室友们都出去了，你一个人在宿舍刷手机，搜“临岗必吃美食”。</p>
        <p class="intro-text">评论区里有人提到<strong class="intro-bold">南桥夜市</strong>——一个数字化转型的新型夜市：每个摊位都上了官网，能看菜单、看评价、逛论坛。里面有凉面、馄饨、炒粉、烧烤、麻辣烫、臭豆腐……等许多美味，尤其是那家<strong class="intro-bold">“陈记糖粥藕”</strong>，据说是临岗人从小吃到大的老味道，糖藕软糯、粥底浓稠。</p>
        <p class="intro-text intro-final">只是你点进去才发现，那个卖糖粥藕的陈伯，已经好几天没出摊了——你忽然很想知道，<em class="intro-wonder">他去了哪儿。</em></p>
      </section>

      <div class="intro-actions">
        <!-- 玩法提示：打开弹窗 -->
        <button class="intro-tips-toggle" :aria-expanded="tipsOpen" @click="tipsOpen = true">
          <span class="tips-line" aria-hidden="true"></span>
          <span class="tips-text">玩 法 提 示</span>
          <span class="tips-line" aria-hidden="true"></span>
        </button>

        <div class="intro-cta">
          <router-link class="intro-start" to="/home">进入夜市<span class="cta-arrow" aria-hidden="true">→</span></router-link>
        </div>
      </div>

      <p class="intro-disclaimer">本游戏为虚构创作，其中人物、地点、事件均为虚构，如有雷同，纯属巧合。</p>
    </main>

    <!-- ===== 玩法提示弹窗 ===== -->
    <Transition name="modal">
      <div v-if="tipsOpen" class="tips-modal" @click.self="tipsOpen = false">
        <div class="tips-panel" role="dialog" aria-label="玩法提示">
          <button class="tips-close" aria-label="关闭" @click="tipsOpen = false">×</button>
          <h2 class="tips-title">玩 法 提 示</h2>
          <div class="tips-rule" aria-hidden="true"><i></i><span>◆</span><i></i></div>
          <ul class="tips-list">
            <li>浏览官网各个板块，寻找隐藏线索。</li>
            <li>根据线索推理登录账号与密码，解锁私人短信、手记和管理处。</li>
            <li>整合收集到的信息，逐步探索事件真相。</li>
            <li>集齐所有线索，解锁故事结局。</li>
          </ul>
          <div class="tips-end">
            <p class="tips-end-line">放慢脚步，保持好奇</p>
            <p class="tips-wish">祝你在夜市的探索之旅中，收获意想不到的惊喜！</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 开场页：前情提要
// 电影序幕式：开场句逐字浮现，秋叶与星光点缀夜色，玩法提示以弹窗呈现
const tipsOpen = ref(false)
const heroChars = '你是一名刚到临岗市的大一新生。'.split('')

// 小光斑：伪随机分布
function bokehStyle(n) {
  const left = (n * 41 + 7) % 96
  const size = 3 + ((n * 13) % 18)
  const dur = 14 + ((n * 7) % 15)
  const delay = -((n * 17) % 26)
  return { left: left + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's' }
}
// 大光斑：远景灯雾
function bigBokehStyle(n) {
  const left = 8 + n * 16 + ((n * 29) % 9)
  const size = 46 + ((n * 37) % 60)
  const dur = 30 + ((n * 11) % 22)
  const delay = -((n * 23) % 30)
  const top = 18 + ((n * 43) % 55)
  return { left: left + '%', top: top + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's' }
}
// 星星：夜空高处
function starStyle(n) {
  const left = (n * 67 + 5) % 97
  const top = (n * 29 + 4) % 38
  const size = 1.5 + ((n * 7) % 3) * 0.5
  const dur = 2.6 + ((n * 11) % 26) / 10
  const delay = -((n * 13) % 40) / 10
  return { left: left + '%', top: top + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's' }
}
// 秋叶：下落节奏与摆动各不相同
function leafStyle(n) {
  const left = (n * 53 + 11) % 94
  const size = 10 + ((n * 17) % 9)
  const dur = 12 + ((n * 13) % 10)
  const delay = -((n * 19) % 22)
  const sway = 2.2 + (n % 5) * 0.55
  return { left: left + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's', '--sway': sway + 's' }
}
</script>

<style scoped>
/* ========== 夜色背景 ========== */
.intro-page {
  position: relative;
  min-height: 100vh;
  color: #F3E3C8;
  overflow: hidden;
}
.scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 480px at 78% 10%, rgba(255, 170, 90, 0.13), transparent 70%),
    radial-gradient(700px 460px at 12% 88%, rgba(230, 120, 60, 0.09), transparent 72%),
    linear-gradient(178deg, #261106 0%, #40200F 40%, #33170C 72%, #20100A 100%);
  animation: skyDrift 44s ease-in-out infinite alternate;
}
@keyframes skyDrift {
  from { transform: scale(1); }
  to { transform: scale(1.045); }
}
.moon {
  position: absolute;
  top: 8.5%;
  right: 13%;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: radial-gradient(circle at 38% 34%, #FBEED3, #E8CFA5 62%, #D8BA8A 100%);
  box-shadow:
    0 0 34px 10px rgba(250, 225, 180, 0.24),
    0 0 110px 38px rgba(250, 225, 180, 0.11);
  opacity: 0.82;
  animation: moonBreathe 9s ease-in-out infinite alternate;
}
@keyframes moonBreathe {
  from { opacity: 0.7; }
  to { opacity: 0.9; }
}
/* 星星 */
.star {
  position: absolute;
  border-radius: 50%;
  background: #FFE9C4;
  animation: twinkle ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.14; }
  50% { opacity: 0.85; }
}
/* 秋叶 */
.leaf-fall {
  position: absolute;
  top: -8%;
  animation: leafFall linear infinite;
}
@keyframes leafFall {
  0% { transform: translateY(0); opacity: 0; }
  6% { opacity: 0.62; }
  88% { opacity: 0.5; }
  100% { transform: translateY(114vh); opacity: 0; }
}
.leaf {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 0 65% 65% 65%;
  animation: leafSway var(--sway) ease-in-out infinite alternate;
}
@keyframes leafSway {
  from { transform: translateX(-16px) rotate(-32deg); }
  to { transform: translateX(16px) rotate(42deg); }
}
.leaf-0 { background: linear-gradient(135deg, #E0A458, #B4762E); }
.leaf-1 { background: linear-gradient(135deg, #D98A2B, #A34722); }
.leaf-2 { background: linear-gradient(135deg, #C96A2E, #8E3320); }
.leaf-3 { background: linear-gradient(135deg, #C9A05A, #96622A); }
/* 远处地平线的暖光，夜市的灯在江对岸亮着 */
.horizon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 230px;
  background: linear-gradient(to top, rgba(255, 150, 70, 0.13), transparent);
}
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(125% 100% at 50% 42%, transparent 46%, rgba(12, 5, 2, 0.66) 100%);
}
.ground-glow {
  position: absolute;
  left: 50%;
  bottom: -160px;
  width: 1000px;
  height: 360px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(255, 176, 96, 0.2), transparent 68%);
  filter: blur(8px);
}
.bokeh {
  position: absolute;
  bottom: -4%;
  border-radius: 50%;
  animation: bokehRise linear infinite;
  filter: blur(1px);
}
.bokeh-0 { background: radial-gradient(circle, rgba(255,196,110,0.92), rgba(255,196,110,0) 70%); }
.bokeh-1 { background: radial-gradient(circle, rgba(255,140,90,0.88), rgba(255,140,90,0) 70%); }
.bokeh-2 { background: radial-gradient(circle, rgba(255,224,160,0.92), rgba(255,224,160,0) 70%); }
.bokeh-3 { background: radial-gradient(circle, rgba(255,120,70,0.75), rgba(255,120,70,0) 70%); }
@keyframes bokehRise {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.9; }
  80% { opacity: 0.58; }
  100% { transform: translateY(-92vh) translateX(24px); opacity: 0; }
}
.bokeh-lg {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 168, 92, 0.17), rgba(255, 168, 92, 0) 70%);
  filter: blur(9px);
  animation: bokehDrift ease-in-out infinite alternate;
}
@keyframes bokehDrift {
  from { transform: translateX(-26px); opacity: 0.55; }
  to { transform: translateX(30px); opacity: 1; }
}
.mist {
  position: absolute;
  width: 150%;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(255, 190, 130, 0.05), transparent 65%);
  filter: blur(28px);
}
.mist-1 { left: -30%; bottom: 12%; animation: mistDrift 46s ease-in-out infinite alternate; }
.mist-2 { left: -10%; bottom: 28%; height: 200px; animation: mistDrift 62s ease-in-out infinite alternate-reverse; }
@keyframes mistDrift {
  from { transform: translateX(-6%); }
  to { transform: translateX(9%); }
}

/* 右缘竖排落款 */
.intro-side {
  position: absolute;
  right: 42px;
  top: 50%;
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  font-family: var(--font-title);
  font-size: 13px;
  letter-spacing: 9px;
  color: rgba(255, 214, 160, 0.42);
  z-index: 2;
}

/* ========== 序幕内容 ========== */
.intro-main {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 32px 44px;
}
.intro-header {
  text-align: center;
  margin-bottom: 34px;
  animation: fadeDown 0.9s ease-out both;
}
.intro-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  font-family: var(--font-title);
  font-size: 13px;
  letter-spacing: 10px;
  text-indent: 10px;
  color: rgba(255, 214, 160, 0.72);
}
.intro-eyebrow::before,
.intro-eyebrow::after {
  content: '';
  width: 52px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 214, 160, 0.5));
}
.intro-eyebrow::after {
  background: linear-gradient(90deg, rgba(255, 214, 160, 0.5), transparent);
}

/* 开场句 */
.intro-hero {
  font-family: var(--font-title);
  font-weight: 400;
  font-size: 31px;
  line-height: 1.75;
  letter-spacing: 3px;
  text-align: center;
  color: #F8E9C8;
  text-shadow: 0 0 26px rgba(255, 178, 96, 0.28);
  margin-bottom: 22px;
}
.hero-char {
  display: inline-block;
  opacity: 0;
  animation: charIn 0.55s ease-out forwards;
}
@keyframes charIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

/* 分场细线 */
.intro-rule {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 240px;
  margin: 0 auto 36px;
  animation: fadeUp 0.8s 1s ease-out both;
}
.intro-rule i {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 190, 130, 0.55), transparent);
}
.intro-rule span {
  color: rgba(255, 190, 130, 0.75);
  font-size: 9px;
  transform: translateY(-0.5px);
}

/* 正文 */
.intro-story {
  animation: fadeUp 0.85s 1.15s ease-out both;
}
.intro-text {
  font-family: var(--font-title);
  font-size: 18.5px;
  line-height: 2.2;
  letter-spacing: 0.5px;
  color: #F4E2C0;
  margin-bottom: 19px;
}
.intro-bold {
  color: #FFC169;
  font-weight: 700;
  text-shadow: 0 0 14px rgba(255, 178, 96, 0.3);
}
.intro-final {
  color: #FFE8C8;
  margin-bottom: 0;
}
.intro-wonder {
  font-style: normal;
  color: #FFAE7A;
  font-size: 1.1em;
  letter-spacing: 1px;
  text-shadow: 0 0 18px rgba(255, 140, 80, 0.45);
}

/* 操作区 */
.intro-actions {
  margin-top: 40px;
  text-align: center;
  animation: fadeUp 0.85s 1.3s ease-out both;
}
/* 玩法提示：细线夹字 */
.intro-tips-toggle {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 4px 2px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-title);
}
.tips-line {
  display: block;
  width: 36px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 190, 130, 0.45));
  transition: width 0.3s ease;
}
.intro-tips-toggle .tips-line:last-child {
  background: linear-gradient(90deg, rgba(255, 190, 130, 0.45), transparent);
}
.tips-text {
  font-size: 14px;
  letter-spacing: 6px;
  text-indent: 6px;
  color: rgba(243, 221, 184, 0.78);
  transition: color 0.3s ease, text-shadow 0.3s ease;
}
.intro-tips-toggle:hover .tips-text {
  color: #FFD9A0;
  text-shadow: 0 0 16px rgba(255, 178, 96, 0.4);
}
.intro-tips-toggle:hover .tips-line {
  width: 52px;
}

/* 进入夜市：琥珀色调，与全站暖光同族 */
.intro-cta {
  margin-top: 24px;
}
.intro-start {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 50px;
  background: linear-gradient(180deg, rgba(217, 138, 43, 0.16), rgba(217, 138, 43, 0.06));
  border: 1px solid rgba(255, 196, 130, 0.55);
  border-radius: 999px;
  color: #F8E9C8;
  font-family: var(--font-title);
  font-size: 17.5px;
  letter-spacing: 8px;
  text-indent: 8px;
  text-decoration: none;
  box-shadow: inset 0 1px 0 rgba(255, 235, 200, 0.12);
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s, transform 0.3s;
}
.intro-start:hover {
  background: linear-gradient(180deg, rgba(224, 150, 60, 0.32), rgba(190, 110, 40, 0.16));
  border-color: rgba(255, 220, 165, 0.9);
  box-shadow: 0 12px 34px -12px rgba(217, 138, 43, 0.5), inset 0 1px 0 rgba(255, 235, 200, 0.18);
  transform: translateY(-2px);
}
.cta-arrow {
  color: #FFC169;
  font-family: var(--font-body);
  letter-spacing: 0;
  text-indent: 0;
  transition: transform 0.3s ease;
}
.intro-start:hover .cta-arrow {
  transform: translateX(5px);
}

.intro-disclaimer {
  margin-top: 34px;
  font-size: 12px;
  color: rgba(243, 227, 200, 0.4);
  text-align: center;
  letter-spacing: 0.5px;
  animation: fadeUp 0.85s 1.45s ease-out both;
}

/* ===== 玩法提示弹窗 ===== */
.tips-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgba(12, 5, 2, 0.62);
  backdrop-filter: blur(6px);
}
.tips-panel {
  position: relative;
  width: 100%;
  max-width: 470px;
  max-height: 82vh;
  overflow-y: auto;
  padding: 38px 40px 30px;
  background: linear-gradient(178deg, rgba(44, 20, 10, 0.94), rgba(30, 13, 7, 0.96));
  border: 1px solid rgba(255, 190, 130, 0.28);
  border-radius: 14px;
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 220, 170, 0.1);
  text-align: center;
}
.tips-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid rgba(255, 190, 130, 0.28);
  border-radius: 50%;
  color: rgba(243, 221, 184, 0.7);
  font-size: 17px;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.3s, border-color 0.3s, color 0.3s;
}
.tips-close:hover {
  transform: rotate(90deg);
  border-color: rgba(255, 210, 150, 0.6);
  color: #FFD9A0;
}
.tips-title {
  font-family: var(--font-title);
  font-weight: 400;
  font-size: 19px;
  letter-spacing: 8px;
  text-indent: 8px;
  color: #F8E9C8;
  margin-bottom: 14px;
}
.tips-rule {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 180px;
  margin: 0 auto 22px;
}
.tips-rule i {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 190, 130, 0.5), transparent);
}
.tips-rule span {
  color: rgba(255, 190, 130, 0.7);
  font-size: 8px;
}
.tips-list {
  list-style: none;
  margin: 0 0 6px;
  padding: 0;
  text-align: left;
}
.tips-list li {
  position: relative;
  padding-left: 22px;
  font-family: var(--font-title);
  font-size: 15.5px;
  line-height: 2.05;
  color: #EFD9B4;
  margin-bottom: 8px;
}
.tips-list li::before {
  content: '◆';
  position: absolute;
  left: 0;
  top: 2px;
  font-size: 9px;
  color: #FFAE7A;
}
/* 结尾两句：居中、突出 */
.tips-end {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px dashed rgba(255, 190, 130, 0.25);
}
.tips-end-line {
  font-family: var(--font-title);
  font-size: 17px;
  color: #FFC169;
  text-shadow: 0 0 16px rgba(255, 178, 96, 0.35);
  margin-bottom: 10px;
}
.tips-wish {
  font-family: var(--font-title);
  font-size: 15.5px;
  line-height: 1.9;
  color: #FFC169;
  text-shadow: 0 0 12px rgba(255, 200, 140, 0.22);
  margin-bottom: 4px;
}

/* 弹窗进出场 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.28s ease;
}
.modal-enter-active .tips-panel {
  transition: transform 0.34s cubic-bezier(0.2, 0.8, 0.3, 1);
}
.modal-leave-active .tips-panel {
  transition: transform 0.24s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .tips-panel {
  transform: translateY(22px) scale(0.97);
}
.modal-leave-to .tips-panel {
  transform: translateY(12px) scale(0.98);
}

/* 入场动画 */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-14px); }
  to { opacity: 1; transform: none; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}

/* 动效关闭：尊重系统设置 */
@media (prefers-reduced-motion: reduce) {
  .sky, .moon, .bokeh, .bokeh-lg, .mist, .star, .leaf-fall, .leaf,
  .intro-header, .intro-rule, .intro-story,
  .intro-actions, .intro-disclaimer {
    animation: none;
  }
  .hero-char { animation: none; opacity: 1; }
}

@media (max-width: 720px) {
  .intro-main {
    padding: 56px 22px 36px;
  }
  .intro-hero {
    font-size: 24px;
    letter-spacing: 2px;
  }
  .intro-text {
    font-size: 16.5px;
    line-height: 2.1;
  }
  .intro-start {
    padding: 14px 40px;
    font-size: 16.5px;
  }
  .intro-side {
    display: none;
  }
  .intro-rule {
    width: 180px;
  }
  .tips-panel {
    padding: 32px 26px 24px;
  }
}
</style>
