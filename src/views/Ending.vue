<template>
  <div class="ending-page">
    <transition name="turn" mode="out-in">
      <!-- 第一屏：一盏灯 -->
      <section v-if="screen === 0" key="lamp" class="lamp-stage">
        <div class="halo" :class="{ dim: !unlocked }"></div>

        <svg class="lantern" :class="{ dim: !unlocked }" viewBox="0 0 160 240" aria-hidden="true">
          <defs>
            <radialGradient id="lampBody" cx="46%" cy="40%" r="72%">
              <stop offset="0%" stop-color="#ff9a63" />
              <stop offset="52%" stop-color="#dd5230" />
              <stop offset="100%" stop-color="#96261a" />
            </radialGradient>
            <linearGradient id="lampGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f3d6a0" />
              <stop offset="100%" stop-color="#b5874b" />
            </linearGradient>
          </defs>

          <rect x="64" y="24" width="32" height="12" rx="4" fill="url(#lampGold)" />
          <rect x="74" y="34" width="12" height="16" fill="#a97c45" />
          <ellipse cx="80" cy="112" rx="52" ry="62" fill="url(#lampBody)" />
          <path d="M80 50 C 46 74 46 150 80 174" fill="none" stroke="#7f2015" stroke-opacity=".42" stroke-width="2" />
          <path d="M80 50 C 114 74 114 150 80 174" fill="none" stroke="#7f2015" stroke-opacity=".42" stroke-width="2" />
          <path d="M80 50 C 62 78 62 146 80 174" fill="none" stroke="#7f2015" stroke-opacity=".26" stroke-width="1.6" />
          <path d="M80 50 C 98 78 98 146 80 174" fill="none" stroke="#7f2015" stroke-opacity=".26" stroke-width="1.6" />
          <ellipse cx="60" cy="92" rx="13" ry="24" fill="#ffe0b8" opacity=".26" />
          <rect x="64" y="170" width="32" height="12" rx="4" fill="url(#lampGold)" />
          <line x1="80" y1="182" x2="80" y2="198" stroke="#b5874b" stroke-width="2" />
          <path d="M70 198 L90 198 L84 224 L76 224 Z" fill="#c9482f" />
        </svg>

        <div class="lamp-caption">
          <p v-if="unlocked" class="lamp-state on">灯亮了</p>
          <p v-else class="lamp-state">灯还没亮</p>

          <button v-if="unlocked" class="plain-link" @click="screen = 1">进去看看</button>
          <button v-else class="plain-link" @click="$router.push('/home')">回到夜市</button>
        </div>
      </section>

      <!-- 第二屏：线索串起来了 -->
      <article v-else-if="screen === 1" key="p1" class="paper">
        <p class="lead">所有线索，终于串联起来了。</p>

        <p class="body-text">
          二十年前，陈伯的儿子在城南走失。二十年后，儿子循着身世回到临岗，来到了南桥夜市。那根系着“念”字的红绳，让陈伯认出了他。
        </p>
        <p class="body-text">
          可陈伯始终没有相认。因为他已经身患绝症，不愿让儿子刚刚找到父亲，就要面对再次失去他的痛苦。
        </p>
        <p class="body-text">
          10月26日，陈伯分完了最后一锅粥，擦净灶台，留下钥匙和纸条，悄悄离开了夜市。他坐上地铁3号线，从南桥站往城南方向坐了五站，回到了那间二十年未曾搬离的老屋——梧桐苑。
        </p>
        <p class="body-text">
          你终于知道陈伯去了哪里，也明白了他为什么离开。
        </p>
        <p class="body-text turn">只是，还有一些事情没有答案。</p>

        <div class="nav">
          <button class="plain-link small" @click="screen = 2">继续</button>
        </div>
      </article>

      <!-- 第三屏：故事未完 -->
      <article v-else key="p2" class="paper">
        <p class="body-text">
          那个寻找父亲的年轻人，是否有机会知道真相？那些和陈伯相处了五年的街坊，是否还能再见他一面？
        </p>

        <div class="maybe">
          <p class="body-text soft">
            或许，儿子会找到那间老屋，听父亲讲讲这些年的等待；或许，夜市的街坊们会带着熟悉的吃食，去看看许久未见的老朋友。
          </p>
          <p class="body-text soft">
            也或许，这些迟来的牵挂，最终没能赶上一次相见。
          </p>
        </div>

        <p class="body-text">
          从最初搜索临岗的美食，到顺着一条条线索认识陈伯和南桥夜市的街坊，你没想到，一碗糖粥藕背后，藏着一个父亲二十年的等待，也藏着一群街坊数年的情谊。
        </p>
        <p class="body-text">
          如今，你不只是好奇陈伯的去向，也希望那些彼此惦念的人，终有一天还能再见。
        </p>

        <p class="brand">南桥夜市 · 故事未完</p>

        <div class="nav">
          <button class="plain-link small" @click="$router.push('/home')">回夜市看看</button>
          <button class="plain-link tiny" @click="restart">重新开始</button>
        </div>
      </article>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isComplete } from '../utils/progress'

// 结局门禁：线索没有集齐时，灯不亮，也进不去后面的两页
const unlocked = ref(isComplete())
// 0 = 一盏灯；1 = 第一页；2 = 第二页
const screen = ref(0)

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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 20px 72px;
  background:
    radial-gradient(620px 380px at 50% 8%, rgba(255, 186, 106, 0.18), transparent 72%),
    radial-gradient(900px 500px at 50% 110%, rgba(120, 52, 24, 0.34), transparent 70%),
    linear-gradient(168deg, #3d1f13 0%, #2a150d 46%, #1c0f09 100%);
}

/* ---------- 第一屏：灯 ---------- */
.lamp-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 640px;
  position: relative;
}
.halo {
  position: absolute;
  top: -6px;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 176, 84, 0.34) 0%,
    rgba(255, 150, 60, 0.16) 38%,
    rgba(255, 150, 60, 0) 70%
  );
  filter: blur(6px);
  animation: breathe 5.6s ease-in-out infinite;
  pointer-events: none;
}
.halo.dim {
  animation: none;
  opacity: 0.28;
  background: radial-gradient(circle, rgba(160, 130, 96, 0.22) 0%, rgba(160, 130, 96, 0) 68%);
}
@keyframes breathe {
  0%, 100% { opacity: 0.78; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}

.lantern {
  width: 208px;
  height: auto;
  position: relative;
  animation: swing 6.4s ease-in-out infinite;
  filter: drop-shadow(0 0 28px rgba(255, 148, 66, 0.45)) drop-shadow(0 18px 26px rgba(0, 0, 0, 0.5));
}
.lantern.dim {
  animation: none;
  filter: grayscale(0.72) brightness(0.66) drop-shadow(0 16px 22px rgba(0, 0, 0, 0.5));
}
@keyframes swing {
  0%, 100% { transform: translateY(0) rotate(-1.4deg); }
  50% { transform: translateY(-6px) rotate(1.4deg); }
}

.lamp-caption {
  position: relative;
  margin-top: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.lamp-state {
  font-family: var(--font-title);
  font-size: 15px;
  letter-spacing: 7px;
  color: #c2a582;
  margin: 0;
  text-indent: 7px;
}
.lamp-state.on {
  color: #f6d9a8;
  text-shadow: 0 0 18px rgba(255, 180, 96, 0.45);
}

/* 无框的字：唯一的交互入口，没有箭头、没有底和边 */
.plain-link {
  border: 0;
  background: none;
  padding: 6px 2px;
  cursor: pointer;
  font-family: var(--font-title);
  font-size: 17px;
  letter-spacing: 6px;
  text-indent: 6px;
  color: #e8c79a;
  transition: color 0.3s, text-shadow 0.3s;
}
.plain-link::after {
  content: '';
  display: block;
  height: 1px;
  margin-top: 6px;
  background: linear-gradient(90deg, transparent, rgba(232, 199, 154, 0.55), transparent);
  transform: scaleX(0.35);
  transition: transform 0.35s ease;
}
.plain-link:hover {
  color: #ffe6bd;
  text-shadow: 0 0 18px rgba(255, 190, 110, 0.5);
}
.plain-link:hover::after {
  transform: scaleX(1);
}
.plain-link.small {
  font-size: 14px;
  letter-spacing: 5px;
  text-indent: 5px;
  color: #9d7a55;
}
.plain-link.small:hover {
  color: #c9a173;
}
.plain-link.tiny {
  font-size: 12px;
  letter-spacing: 3px;
  text-indent: 3px;
  color: #7d6249;
}
.plain-link.tiny::after {
  display: none;
}
.plain-link.tiny:hover {
  color: #a38a6b;
}

/* ---------- 第二、三屏：纸面 ---------- */
.paper {
  position: relative;
  width: 100%;
  max-width: 620px;
  padding: 62px clamp(26px, 6vw, 62px) 48px;
  background: #fffaf1;
  background-image: radial-gradient(ellipse at 22% 0%, #e8cf9f22, transparent 62%),
    repeating-linear-gradient(0deg, #7b5a3a08 0 1px, transparent 1px 5px);
  border: 1px solid #d9c6a6;
  border-radius: 2px;
  box-shadow: 0 50px 100px -52px rgba(8, 3, 1, 0.95), 0 0 0 6px rgba(255, 248, 232, 0.04);
}

.lead {
  font-family: var(--font-title);
  font-size: 22px;
  line-height: 1.85;
  letter-spacing: 2px;
  color: #3a2a1e;
  margin: 0 0 34px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e2d2b6;
}

.body-text {
  font-family: var(--font-title);
  font-size: 16px;
  line-height: 2.15;
  letter-spacing: 0.6px;
  color: #403026;
  margin: 0 0 22px;
  text-align: justify;
}

.turn {
  color: #8a5c34;
  letter-spacing: 1.4px;
}

/* 三种“或许”：整块略微内缩、字色浅一点，像旁白 */
.maybe {
  margin: 4px 0 26px;
  padding-left: 18px;
  border-left: 1px solid #dcc7a4;
}
.maybe .body-text {
  margin-bottom: 14px;
}
.soft {
  color: #6f5a45;
  font-size: 15px;
  line-height: 2.05;
}

.brand {
  font-family: var(--font-title);
  font-size: 12px;
  letter-spacing: 0.32em;
  text-indent: 0.32em;
  color: #9c825f;
  text-align: center;
  margin: 46px 0 4px;
}
.brand::before,
.brand::after {
  content: '';
  display: block;
  width: 46px;
  height: 1px;
  margin: 0 auto;
  background: #d8c3a0;
}
.brand::before {
  margin-bottom: 18px;
}
.brand::after {
  margin-top: 18px;
}

.nav {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
}

/* 翻页动画：像把纸轻轻掀起 */
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
    padding: 44px 16px 56px;
    align-items: flex-start;
  }
  .lantern {
    width: 168px;
  }
  .halo {
    width: 360px;
    height: 360px;
  }
  .paper {
    padding: 42px 22px 34px;
  }
  .lead {
    font-size: 19px;
    margin-bottom: 26px;
    padding-bottom: 18px;
  }
  .body-text {
    font-size: 15px;
    line-height: 2.05;
    text-align: left;
  }
  .nav {
    gap: 20px;
    margin-top: 32px;
  }
}
</style>
