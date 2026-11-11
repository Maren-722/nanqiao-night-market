<template>
  <div class="ending-page">
    <!-- ===== 夜色动态背景（与前情提要同一套） ===== -->
    <div class="scene" aria-hidden="true">
      <div class="sky"></div>
      <span v-for="n in 12" :key="'s' + n" class="star" :style="starStyle(n)"></span>
      <span v-for="n in 22" :key="'b' + n" class="bokeh" :class="'bokeh-' + (n % 4)" :style="bokehStyle(n)"></span>
      <span v-for="n in 5" :key="'lb' + n" class="bokeh-lg" :style="bigBokehStyle(n)"></span>
      <span v-for="n in 5" :key="'f' + n" class="leaf-fall" :style="leafStyle(n)"><i class="leaf" :class="'leaf-' + (n % 4)"></i></span>
      <div class="mist mist-1"></div>
      <div class="mist mist-2"></div>
      <div class="horizon"></div>
      <div class="ground-glow"></div>
      <div class="vignette"></div>
    </div>

    <!-- 撕边滤镜：只作用于纸张层，不影响文字 -->
    <svg class="filters" aria-hidden="true" focusable="false">
      <filter id="tornPaper" x="-12%" y="-12%" width="124%" height="124%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015 0.034" numOctaves="3" seed="9" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="13" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>

    <div class="stage">
      <transition name="turn" mode="out-in">
        <!-- 第一屏：一盏灯 -->
        <section v-if="screen === 0" key="lamp" class="lamp-stage">
          <div class="lantern-wrap" :class="{ dim: !unlocked }">
            <div class="lamp-glow"></div>
            <img class="lantern-bloom" :src="kongmingImg" alt="" aria-hidden="true" />
            <img class="lantern-img" :src="kongmingImg" alt="" />
            <div class="lamp-haze"></div>
          </div>

          <div class="lamp-caption">
            <p v-if="!unlocked" class="lamp-state">灯还没亮</p>

            <button v-if="unlocked" class="lamp-link" @click="screen = 1">通往结局</button>
            <button v-else class="lamp-link" @click="$router.push('/home')">回到夜市</button>
          </div>
        </section>

        <!-- 第二屏：线索串起来了 -->
        <section v-else-if="screen === 1" key="p1" class="story">
          <div class="sheet">
            <div class="sheet-bg"></div>
            <div class="sheet-body">
              <p class="lead">所有线索，终于串联起来了。</p>

              <p class="body-text">二十年前，陈伯的儿子在城南走失。二十年后，儿子循着身世回到临岗，来到了南桥夜市。那根系着“念”字的红绳，让陈伯认出了他。</p>
              <p class="body-text">可陈伯始终没有相认。因为他已经身患绝症，不愿让儿子刚刚找到父亲，就要面对再次失去他的痛苦。</p>
              <p class="body-text">10月26日，陈伯分完了最后一锅粥，擦净灶台，留下钥匙和纸条，悄悄离开了夜市。他坐上地铁3号线，从南桥站往城南方向坐了五站，回到了那间二十年未曾搬离的老屋——梧桐苑。</p>
              <p class="body-text">你终于知道陈伯去了哪里，也明白了他为什么离开。</p>
              <p class="body-text turn">只是，还有一些事情没有答案。</p>

              <div class="next">
                <button class="ink-link" @click="screen = 2">下一页</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 第三屏：故事未完 -->
        <section v-else key="p2" class="story">
          <div class="sheet">
            <div class="sheet-bg"></div>
            <div class="sheet-body">
              <p class="body-text">那个寻找父亲的年轻人，是否有机会知道真相？那些和陈伯相处了五年的街坊，是否还能再见他一面？</p>
              <p class="body-text">或许，儿子会找到那间老屋，听父亲讲讲这些年的等待；或许，夜市的街坊们会带着熟悉的吃食，去看看许久未见的老朋友。</p>
              <p class="body-text">也或许，这些迟来的牵挂，最终没能赶上一次相见。</p>
              <p class="body-text">从最初搜索临岗的美食，到顺着一条条线索认识陈伯和南桥夜市的街坊，你没想到，一碗糖粥藕背后，藏着一个父亲二十年的等待，也藏着一群街坊数年的情谊。</p>
              <p class="body-text">如今，你不只是好奇陈伯的去向，也希望那些彼此惦念的人，终有一天还能再见。</p>

              <p class="brand">南桥夜市 · 故事未完</p>
            </div>
          </div>

          <div class="exit">
            <button class="out-link" @click="$router.push('/home')">回夜市看看</button>
            <button class="out-link faint" @click="restart">重新开始</button>
          </div>
        </section>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isComplete } from '../utils/progress'
import kongmingImg from '../assets/kongming.webp'

// 结局门禁：线索没有集齐时，灯不亮，也进不去后面两页
const unlocked = ref(isComplete())
// 0 = 一盏灯；1 = 第一页；2 = 第二页
const screen = ref(0)

// —— 背景光点：伪随机分布，跟前情提要同一套算法 ——
function bokehStyle(n) {
  const left = (n * 41 + 7) % 96
  const size = 3 + ((n * 13) % 18)
  const dur = 14 + ((n * 7) % 15)
  const delay = -((n * 17) % 26)
  return { left: left + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's' }
}
function bigBokehStyle(n) {
  const left = 8 + n * 16 + ((n * 29) % 9)
  const size = 46 + ((n * 37) % 60)
  const dur = 30 + ((n * 11) % 22)
  const delay = -((n * 23) % 30)
  const top = 18 + ((n * 43) % 55)
  return { left: left + '%', top: top + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's' }
}
function starStyle(n) {
  const left = (n * 67 + 5) % 97
  const top = (n * 29 + 4) % 38
  const size = 1.5 + ((n * 7) % 3) * 0.5
  const dur = 2.6 + ((n * 11) % 26) / 10
  const delay = -((n * 13) % 40) / 10
  return { left: left + '%', top: top + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's' }
}
function leafStyle(n) {
  const left = (n * 53 + 11) % 94
  const size = 10 + ((n * 17) % 9)
  const dur = 12 + ((n * 13) % 10)
  const delay = -((n * 19) % 22)
  const sway = 2.2 + (n % 5) * 0.55
  return { left: left + '%', width: size + 'px', height: size + 'px', animationDuration: dur + 's', animationDelay: delay + 's', '--sway': sway + 's' }
}

function restart() {
  localStorage.removeItem('nq_progress')
  localStorage.removeItem('nq_ending_prompted')
  localStorage.removeItem('nq_user')
  localStorage.removeItem('nq_notes')
  localStorage.removeItem('nq_posts')
  localStorage.removeItem('nq_comments')
  localStorage.removeItem('nq_sent_messages')
  window.dispatchEvent(new CustomEvent('nq-user-changed'))
  window.location.href = `${window.location.pathname}#/`
  window.location.reload()
}
</script>

<style scoped>
.ending-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 52px;
  background: #20100a;
  overflow: hidden;
}
.filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

/* ---------- 夜色动态背景 ---------- */
.scene {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(760px 420px at 74% 12%, rgba(255, 166, 86, 0.1), transparent 70%),
    radial-gradient(680px 440px at 14% 86%, rgba(220, 112, 54, 0.07), transparent 72%),
    linear-gradient(176deg, #22100a 0%, #351a0f 40%, #27140c 72%, #170b06 100%);
  transform-origin: 50% 55%;
  animation: endSkyDrift 44s ease-in-out infinite alternate;
}
@keyframes endSkyDrift {
  from { transform: scale(1); }
  to { transform: scale(1.045); }
}
.star {
  position: absolute;
  border-radius: 50%;
  background: #ffe9c4;
  animation: endTwinkle ease-in-out infinite;
}
@keyframes endTwinkle {
  0%, 100% { opacity: 0.14; }
  50% { opacity: 0.85; }
}
.bokeh {
  position: absolute;
  bottom: -4%;
  border-radius: 50%;
  animation: endBokehRise linear infinite;
  filter: blur(1px);
}
.bokeh-0 { background: radial-gradient(circle, rgba(255, 196, 110, 0.92), rgba(255, 196, 110, 0) 70%); }
.bokeh-1 { background: radial-gradient(circle, rgba(255, 140, 90, 0.88), rgba(255, 140, 90, 0) 70%); }
.bokeh-2 { background: radial-gradient(circle, rgba(255, 224, 160, 0.92), rgba(255, 224, 160, 0) 70%); }
.bokeh-3 { background: radial-gradient(circle, rgba(255, 120, 70, 0.75), rgba(255, 120, 70, 0) 70%); }
@keyframes endBokehRise {
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
  animation: endBokehDrift ease-in-out infinite alternate;
}
@keyframes endBokehDrift {
  from { transform: translateX(-26px); opacity: 0.55; }
  to { transform: translateX(30px); opacity: 1; }
}
.leaf-fall {
  position: absolute;
  top: -8%;
  animation: endLeafFall linear infinite;
}
@keyframes endLeafFall {
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
  animation: endLeafSway var(--sway) ease-in-out infinite alternate;
}
@keyframes endLeafSway {
  from { transform: translateX(-16px) rotate(-32deg); }
  to { transform: translateX(16px) rotate(42deg); }
}
.leaf-0 { background: linear-gradient(135deg, #e0a458, #b4762e); }
.leaf-1 { background: linear-gradient(135deg, #d98a2b, #a34722); }
.leaf-2 { background: linear-gradient(135deg, #c96a2e, #8e3320); }
.leaf-3 { background: linear-gradient(135deg, #c9a05a, #96622a); }
.mist {
  position: absolute;
  width: 150%;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(255, 190, 130, 0.05), transparent 65%);
  filter: blur(28px);
}
.mist-1 { left: -30%; bottom: 12%; animation: endMistDrift 46s ease-in-out infinite alternate; }
.mist-2 { left: -10%; bottom: 28%; height: 200px; animation: endMistDrift 62s ease-in-out infinite alternate-reverse; }
@keyframes endMistDrift {
  from { transform: translateX(-6%); }
  to { transform: translateX(9%); }
}
.horizon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 230px;
  background: linear-gradient(to top, rgba(255, 150, 70, 0.08), transparent);
}
.ground-glow {
  position: absolute;
  left: 50%;
  bottom: -160px;
  width: 1000px;
  height: 360px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(255, 176, 96, 0.12), transparent 68%);
  filter: blur(8px);
}
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(125% 100% at 50% 42%, transparent 46%, rgba(12, 5, 2, 0.66) 100%);
}

/* ---------- 内容层 ---------- */
.stage {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---------- 第一屏：一盏灯 ---------- */
.lamp-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 640px;
  position: relative;
}
.lantern-wrap {
  position: relative;
  display: flex;
  justify-content: center;
}
.lamp-glow {
  position: absolute;
  top: 22%;
  width: 620px;
  height: 620px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 178, 96, 0.17) 0%,
    rgba(255, 150, 66, 0.075) 46%,
    rgba(255, 150, 66, 0) 76%
  );
  filter: blur(34px);
  animation: endLampBreathe 6.4s ease-in-out infinite;
  pointer-events: none;
}
@keyframes endLampBreathe {
  0%, 100% { opacity: 0.72; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}
/* 孔明灯自身的柔光：同一张图放大模糊，叠在本体后面 */
.lantern-bloom {
  position: absolute;
  top: 0;
  left: 50%;
  width: 300px;
  height: auto;
  transform: translateX(-50%) scale(1.07);
  filter: blur(26px) saturate(1.15) brightness(1.05);
  opacity: 0.5;
  pointer-events: none;
}
.lantern-img {
  position: relative;
  width: 300px;
  height: auto;
  animation: endFloat 9s ease-in-out infinite;
  filter: brightness(0.94) saturate(1.04) drop-shadow(0 26px 44px rgba(0, 0, 0, 0.4));
}
@keyframes endFloat {
  0%, 100% { transform: translateY(0) rotate(-0.4deg); }
  50% { transform: translateY(-13px) rotate(0.4deg); }
}
/* 灯前的一层薄雾，让光散开 */
.lamp-haze {
  position: absolute;
  inset: -22% -16%;
  background: radial-gradient(closest-side, rgba(255, 190, 124, 0.07), rgba(255, 166, 92, 0.035) 55%, transparent 82%);
  filter: blur(28px);
  pointer-events: none;
}
.lantern-wrap.dim {
  filter: grayscale(0.9) brightness(0.46);
  opacity: 0.7;
}
.lantern-wrap.dim .lamp-glow,
.lantern-wrap.dim .lamp-haze {
  opacity: 0.14;
  animation: none;
}
.lantern-wrap.dim .lantern-bloom {
  opacity: 0.12;
}
.lantern-wrap.dim .lantern-img {
  animation: none;
}

.lamp-caption {
  position: relative;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.lamp-state {
  font-family: var(--font-title);
  font-size: 13px;
  letter-spacing: 0.42em;
  color: #b0906b;
  margin: 0;
  text-indent: 0.42em;
}

/* 无框的字：没有箭头、没有底和边，只有一条随 hover 变宽的细线 */
.lamp-link {
  border: 0;
  background: none;
  padding: 6px 2px 2px;
  cursor: pointer;
  font-family: var(--font-title);
  font-size: 19px;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: #eed3a6;
  transition: color 0.3s;
}
.lamp-link::after {
  content: '';
  display: block;
  height: 1px;
  margin-top: 7px;
  background: linear-gradient(90deg, transparent, rgba(238, 211, 166, 0.55), transparent);
  transform: scaleX(0.4);
  transition: transform 0.35s ease;
}
.lamp-link:hover {
  color: #ffe7bf;
}
.lamp-link:hover::after {
  transform: scaleX(1);
}

/* ---------- 第二、三屏：牛皮纸 ---------- */
.story {
  width: 100%;
  max-width: 628px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sheet {
  position: relative;
  width: 100%;
}

/* 纸张层：牛皮纸纹理 + 撕裂边（滤镜只作用在这里，文字不受影响） */
.sheet-bg {
  position: absolute;
  inset: -16px;
  background-color: #d7b98b;
  background-image:
    radial-gradient(120% 80% at 50% 0%, rgba(255, 242, 214, 0.22), transparent 56%),
    radial-gradient(110% 90% at 50% 104%, rgba(104, 66, 30, 0.26), transparent 62%),
    url('../assets/kraft.jpg');
  background-size: cover;
  background-position: center;
  filter: url(#tornPaper) drop-shadow(0 30px 48px rgba(10, 4, 1, 0.58));
}

.sheet-body {
  position: relative;
  padding: 38px clamp(24px, 5.5vw, 52px) 18px;
}

.lead {
  font-family: var(--font-title);
  font-size: 22px;
  line-height: 1.85;
  letter-spacing: 2px;
  color: #2d1e13;
  margin: 0 0 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(72, 46, 24, 0.26);
}

.body-text {
  font-family: var(--font-title);
  font-size: 16px;
  line-height: 1.96;
  letter-spacing: 0.6px;
  color: #33241a;
  margin: 0 0 16px;
  text-align: justify;
}
.turn {
  color: #6a4526;
}

.brand {
  font-family: var(--font-title);
  font-size: 12px;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: #6d5233;
  text-align: center;
  margin: 14px 0 0;
}
.brand::before,
.brand::after {
  content: '';
  display: block;
  width: 72px;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, rgba(109, 82, 51, 0.55), transparent);
}
.brand::before {
  margin-bottom: 15px;
}
.brand::after {
  margin-top: 15px;
}

/* 纸上的翻页字 */
.next {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}
.ink-link {
  border: 0;
  background: none;
  padding: 4px 2px 2px;
  cursor: pointer;
  font-family: var(--font-title);
  font-size: 14px;
  letter-spacing: 0.34em;
  text-indent: 0.34em;
  color: #7a5330;
  transition: color 0.3s;
}
.ink-link::after {
  content: '';
  display: block;
  height: 1px;
  margin-top: 6px;
  background: linear-gradient(90deg, transparent, rgba(122, 83, 48, 0.55), transparent);
  transform: scaleX(0.45);
  transition: transform 0.35s ease;
}
.ink-link:hover {
  color: #4d3117;
}
.ink-link:hover::after {
  transform: scaleX(1);
}

/* 纸外的两个出口：落在夜色上，和纸分开 */
.exit {
  display: flex;
  align-items: baseline;
  gap: 30px;
  margin-top: 54px;
}
.out-link {
  border: 0;
  background: none;
  padding: 4px 2px;
  cursor: pointer;
  font-family: var(--font-title);
  font-size: 14px;
  letter-spacing: 0.2em;
  text-indent: 0.2em;
  color: #c9a877;
  transition: color 0.3s;
}
.out-link::after {
  content: '';
  display: block;
  height: 1px;
  margin-top: 6px;
  background: linear-gradient(90deg, transparent, rgba(201, 168, 119, 0.5), transparent);
  transform: scaleX(0.4);
  transition: transform 0.35s ease;
}
.out-link:hover {
  color: #ffe0ae;
}
.out-link:hover::after {
  transform: scaleX(1);
}
.out-link.faint {
  font-size: 12px;
  letter-spacing: 0.16em;
  color: #836c52;
}
.out-link.faint::after {
  display: none;
}
.out-link.faint:hover {
  color: #b79a73;
}

/* 翻页动画 */
.turn-enter-active,
.turn-leave-active {
  transition: opacity 0.42s ease, transform 0.42s ease;
}
.turn-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.turn-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 720px) {
  .ending-page {
    padding: 28px 14px 44px;
    align-items: flex-start;
  }
  .lantern-img {
    width: 248px;
  }
  .lantern-bloom {
    width: 248px;
  }
  .lamp-glow {
    width: 400px;
    height: 400px;
  }
  .sheet-bg {
    inset: -12px;
  }
  .sheet-body {
    padding: 34px 19px 26px;
  }
  .lead {
    font-size: 19px;
    margin-bottom: 24px;
    padding-bottom: 16px;
  }
  .body-text {
    font-size: 15px;
    line-height: 2;
    text-align: left;
  }
  .brand {
    margin-top: 28px;
  }
  .next {
    margin-top: 24px;
  }
  .exit {
    gap: 24px;
    margin-top: 28px;
  }
}
</style>
