<template>
  <main class="intro-page">
    <div class="intro-top"><span>南桥夜市</span><span>网页推理游戏</span></div>
    <section class="intro-layout">
      <div class="intro-photo">
        <img :src="foodImage('chenji')" alt="夜市灯下的一碗糖粥藕" fetchpriority="high" width="1536" height="1024">
        <div class="photo-caption"><span>临岗市 · 江边老街</span><strong>陈记糖粥藕</strong><span class="closed-stamp">暂停营业</span></div>
        <span class="photo-mark">NANQIAO NIGHT MARKET</span>
      </div>
      <div class="intro-copy">
        <p class="intro-kicker">从一间没开门的摊子开始</p>
        <h1>陈伯的摊子，<br>怎么还没开？</h1>
        <p class="intro-story">刚来临岗上大学，你想找个地方吃晚饭，点开了南桥夜市的网站。大家都推荐的陈记糖粥藕，却挂着“暂停营业”。论坛里有人问陈伯去哪儿了，一直没人说得清。</p>
        <p class="game-intro">这是一个网页推理游戏。你要在这个夜市网站里找线索，弄清陈伯去了哪里、为什么离开。</p>
        <ol class="how-to-play" aria-label="玩法提示">
          <li><span>01</span><p><strong>先逛一圈</strong>从首页公告、排班表和论坛开始。帖子里的回复、摊位下的评价，也可以翻翻。</p></li>
          <li><span>02</span><p><strong>留意账号线索</strong>记下人物的 ID 和特别提到的日期。找到密码后，去登录页试试，就能看到这个人的聊天和手记。</p></li>
          <li><span>03</span><p><strong>把几个人的话对一对</strong>遇到不明白的地方，先记着，往别处找找。关键线索看齐后，导航栏的灯笼会亮，点它就能进入结局。</p></li>
        </ol>
        <router-link class="intro-start" to="/home">进入南桥夜市 <span aria-hidden="true">↗</span></router-link>
        <p class="intro-note">直接以游客身份开始即可。游戏里的账号和密码都藏在剧情中。</p>
      </div>
    </section>
    <p class="intro-disclaimer">本游戏为虚构创作，其中人物、地点、事件均为虚构，如有雷同，纯属巧合。</p>
  </main>
</template>

<script setup>
import { foodImage } from '../utils/foodImages'
</script>

<style scoped>
.intro-page { min-height:100vh; padding:28px max(28px,calc((100vw - 1260px)/2)); background:#f7f3ea; color:#322820; }
.intro-top { display:flex; justify-content:space-between; align-items:center; padding-bottom:24px; border-bottom:1px solid #d9cebf; }
.intro-top span:first-child { font:600 23px var(--font-title); letter-spacing:5px; }
.intro-top span:last-child { font-size:12px; color:#786450; letter-spacing:2px; }
.intro-layout { display:grid; grid-template-columns:1fr 1fr; align-items:stretch; gap:clamp(32px,5vw,76px); margin:34px 0 24px; }
.intro-photo { min-height:660px; position:relative; border-radius:5px; overflow:hidden; background:#493020; }
.intro-photo img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:44% center; }
.intro-photo::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,rgba(24,14,7,.5),transparent 45%,rgba(24,14,7,.5)); }
.photo-caption { position:absolute; left:34px; top:35px; z-index:1; color:#fff4dd; display:flex; flex-direction:column; gap:12px; }
.photo-caption>span:first-child { font-size:12px; letter-spacing:3px; }
.photo-caption strong { font:500 clamp(28px,3vw,42px) var(--font-title); letter-spacing:5px; }
.photo-caption .closed-stamp { background:#f4e9d8; color:#a33821; border:1px solid #a33821; outline:3px solid #f4e9d8; font-size:13px; letter-spacing:3px; align-self:flex-start; padding:3px 10px; margin-top:12px; transform:rotate(-5deg); }
.photo-mark { position:absolute; z-index:1; bottom:28px; left:34px; font-size:10px; letter-spacing:4px; color:#f3dfbd; }
.intro-copy { padding:14px 0 8px; align-self:center; }
.intro-kicker { color:#a4452d; font-size:12px; letter-spacing:2px; margin-bottom:18px; }
h1 { font:600 clamp(32px,3.1vw,46px)/1.45 var(--font-title); letter-spacing:2px; margin-bottom:22px; }
.intro-story { color:#6b5847; font-size:14px; line-height:1.95; margin-bottom:17px; }
.game-intro { font-size:14px; line-height:1.95; }
.how-to-play { margin:20px 0 25px; border-top:1px solid #d9cebf; }
.how-to-play li { display:flex; gap:18px; padding:13px 0; border-bottom:1px solid #e5ddd1; }
.how-to-play li>span { color:#a4452d; font:italic 21px Georgia,serif; padding-top:2px; }
.how-to-play p { font-size:12px; line-height:1.8; color:#786450; }
.how-to-play strong { display:block; font-size:14px; color:#392e25; margin-bottom:3px; font-weight:600; }
.intro-start { display:flex; align-items:center; justify-content:space-between; background:#983e28; color:#fff8eb; padding:15px 22px; border-radius:4px; font-size:15px; transition:background .2s; }
.intro-start:hover { background:#77301d; }
.intro-start span { font-size:23px; line-height:1; }
.intro-note { margin-top:10px; color:#766552; font-size:11px; }
.intro-disclaimer { text-align:center; font-size:10px; color:#8a7762; margin-top:auto; padding:12px 0; }
@media(min-width:1450px) { .intro-layout { margin-top:46px; } }
@media(max-width:800px) { .intro-page { padding:20px; } .intro-layout { grid-template-columns:1fr; gap:22px; margin:22px 0 10px; } .intro-photo { min-height:280px; } .intro-photo img { object-position:center 58%; } .photo-caption { top:24px; left:24px; } .photo-mark { left:auto; right:20px; bottom:16px; font-size:8px; letter-spacing:2px; } .intro-copy { padding-top:0; } h1 { font-size:34px; } .intro-kicker { margin-bottom:12px; } .how-to-play p { font-size:13px; } }
</style>
