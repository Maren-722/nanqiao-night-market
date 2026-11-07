<template>
  <div class="intro-page">
    <div class="intro-glow" aria-hidden="true"></div>
    <div class="intro-card">
      <span class="intro-tag">前情</span>
      <h1 class="intro-title">你是一名刚到临岗市的大一新生</h1>
      <p class="intro-text">
        开学两周，你还没适应这座江边城市的秋天。今天室友们都出去了，你一个人在宿舍刷手机，搜“临岗必吃夜市”。
      </p>
      <p class="intro-text">
        评论区里有人提到<span class="intro-highlight">南桥夜市</span>——一个数字化转型的新型夜市：每个摊位都上了官网，能看菜单、看评价、逛论坛。里面有凉面、馄饨、炒粉、烧烤、麻辣烫、臭豆腐……等许多美味，尤其是那家<span class="intro-highlight">“陈记糖粥藕”</span>，据说是临岗人从小吃到大的老味道，糖藕软糯、粥底浓稠。
      </p>
      <p class="intro-text">
        只是你点进去才发现，那个卖糖粥藕的陈伯，已经好几天没出摊了——你忽然很想知道，他去了哪儿。
      </p>
      <hr class="intro-divider">
      <p class="intro-text intro-go">
        在美味的诱惑下，你点开了南桥夜市的官网：
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
