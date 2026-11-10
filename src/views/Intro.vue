<template>
  <div class="intro-page">
    <div class="intro-glow" aria-hidden="true"></div>
    <div class="intro-card">
      <h1 class="intro-title">南桥夜市</h1>
      <p class="intro-text">来临岗上大学的第二周，你已经吃腻了食堂。室友推荐了江边的南桥夜市，说那里的糖粥藕值得一试。</p>
      <p class="intro-text">你搜到夜市的网站，想看看摊子几点开，却发现陈记糖粥藕挂着“暂停营业”。论坛里也有人在问：</p>
      <p class="intro-text">“陈伯这几天怎么没来？”</p>
      <p class="intro-text">你往下翻了翻。有人说他回老家了，有人说前几天还见过他。</p>
      <p class="intro-text">反正还没到饭点，再看看吧。</p>
      <p class="intro-text"><em>你打算从公告和论坛逛起，顺便看看回复。看着看着，你感觉有什么好像不太对劲……</em></p>
      <p class="intro-text"><em>你试图登录他人的账号，找到更多线索。</em></p>
      <hr class="intro-divider">
      <p class="intro-text intro-go"><router-link class="intro-link intro-start" to="/home">进入夜市 →</router-link></p>
      <p class="intro-disclaimer">本游戏为虚构创作，其中人物、地点、事件均为虚构，如有雷同，纯属巧合。</p>
    </div>
    <span class="intro-side">临岗市 · 江边老街 · 十月</span>
  </div>
</template>

<script setup>
// 开场页：前情提要
// 玩家点击链接后进入夜市官网首页
</script>

<style scoped>
.intro-page {
  position: relative;
  min-height: 100vh;
  background:
    linear-gradient(160deg, #5A2A18 0%, #7A3A20 46%, #4A2313 100%),
    repeating-linear-gradient(90deg, rgba(255, 214, 160, 0.03) 0 2px, transparent 2px 9px);
  color: #F3E3C8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 44px 20px;
  overflow: hidden;
}
/* 街口那盏灯 */
.intro-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(520px 320px at 82% 14%, rgba(255, 196, 112, 0.34), transparent 70%),
    radial-gradient(620px 380px at 10% 92%, rgba(255, 170, 92, 0.18), transparent 72%);
}
.intro-card {
  position: relative;
  z-index: 2;
  max-width: 620px;
  width: 100%;
  background: #FBF2DD;
  color: var(--color-text);
  border-radius: 3px;
  padding: 52px 46px 34px;
  border: 1px solid #E4CFA9;
  box-shadow: 0 40px 80px -40px rgba(28, 12, 4, 0.9);
}
/* 卡片内的一圈细框，像一张旧信纸 */
.intro-card::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(197, 164, 114, 0.4);
  pointer-events: none;
}
.intro-title {
  font-family: var(--font-title);
  font-size: 29px;
  color: var(--color-text);
  margin-bottom: 26px;
  line-height: 1.5;
  letter-spacing: 1.5px;
}
.intro-text {
  font-size: 15px;
  line-height: 2;
  color: #4A3322;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
}
.intro-highlight {
  color: var(--color-accent);
  font-weight: 600;
}
.intro-divider {
  border: none;
  border-top: 1px dashed var(--color-border-strong);
  margin: 30px 0 22px;
}
.intro-go {
  color: var(--color-text-secondary);
}
.intro-link {
  color: var(--color-accent);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.2s;
}
.intro-link:hover {
  color: var(--color-primary-dark);
}
.intro-disclaimer {
  margin-top: 26px;
  font-size: 11.5px;
  color: var(--color-text-muted);
  text-align: center;
  letter-spacing: 0.5px;
}
.intro-side {
  position: absolute;
  right: 34px;
  bottom: 34px;
  writing-mode: vertical-rl;
  font-family: var(--font-title);
  font-size: 12px;
  letter-spacing: 6px;
  color: rgba(255, 226, 181, 0.5);
  z-index: 2;
}

@media (max-width: 720px) {
  .intro-card {
    padding: 34px 24px 26px;
  }
  .intro-title {
    font-size: 23px;
  }
  .intro-text {
    font-size: 14.5px;
    line-height: 1.95;
  }
  .intro-side {
    display: none;
  }
}
</style>
