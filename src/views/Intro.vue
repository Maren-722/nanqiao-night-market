<template>
  <div class="intro-page">
    <div class="intro-glow" aria-hidden="true"></div>
    <div class="intro-card">
      <span class="intro-tag">前情</span>
      <h1 class="intro-title">你是一名刚到临岗市的大一新生</h1>
      <p class="intro-text">
        刚到临岗上大学，学校周围吃过一圈，你还没去过江边。今晚室友都出去了，你一个人没想好吃什么，顺手搜了下附近的夜市。
      </p>
      <p class="intro-text">
        好几个人推荐<span class="intro-highlight">南桥夜市</span>的陈记糖粥藕。有人特意提醒，去晚了，锅里就只剩粥了。你点开摊位一看，上面写着「暂停营业」。
      </p>
      <p class="intro-text">
        夜市论坛里也有人在问：「A1怎么还锁着？陈伯什么时候回来？」你往下翻了几条，问的人挺多，谁也说不准。
      </p>
      <hr class="intro-divider">
      <p class="intro-text intro-go">
        你想看看夜市的公告是怎么说的。
        <a class="intro-link" @click="$router.push('/home')">www.nanqiao-night-market.com</a>
      </p>
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
  background: var(--color-card);
  color: var(--color-text);
  border-radius: var(--radius-lg);
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
.intro-tag {
  display: inline-block;
  background: var(--color-accent);
  color: #FFF3E0;
  padding: 3px 14px;
  border-radius: var(--radius);
  font-size: 11px;
  letter-spacing: 3px;
  margin-bottom: 22px;
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
