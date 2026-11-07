<template>
  <div class="stalls-page">
    <NavBar />
    <div class="container">
      <header class="page-head">
        <p class="page-head-kicker">南桥夜市 · 导览</p>
        <h1 class="page-head-title">夜市导览</h1>
        <p class="page-head-desc">夜市不大，慢慢走。点开一家，能看见是谁在守摊、卖什么、多少钱；拿不定主意，就看看吃过的人在底下留的那几句。</p>
      </header>

      <div class="stall-grid">
        <!-- 摊位卡片：数据来自 src/data/stalls.json，两列按 A/B 区顺序填充 -->
        <div
          v-for="stall in stalls"
          :key="stall.id"
          class="card stall-card"
          :class="{ 'stall-closed': stall.closed }"
          @click="$router.push('/stalls/' + stall.id)"
        >
          <div class="stall-no">摊位 {{ stall.stallNo }}</div>
          <h3 class="stall-name">{{ stall.shopName }}</h3>
          <p class="stall-owner">老板：{{ stall.owner }}<span v-if="stall.uid" class="stall-id">ID:{{ stall.uid }}</span></p>
          <p class="stall-main">{{ stall.main }}</p>
          <p class="stall-price">价格：{{ stall.price }}</p>
          <span v-if="stall.closed" class="stall-status">暂停营业</span>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import stallsData from '../data/stalls.json'

// 摊位列表：数据从 src/data/stalls.json 读取（你负责写这个文件）
const stalls = ref([])

onMounted(() => {
  stalls.value = stallsData
})
</script>

<style scoped>
.page-desc {
  color: var(--color-text-secondary);
  margin-bottom: 28px;
  max-width: 620px;
}
.stall-grid {
  display: grid;
  /* 全设备固定两列：左列 A1-A5，右列 B1-B5（列优先填充） */
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(5, auto);
  grid-auto-flow: column;
  gap: 16px;
}
.stall-card {
  cursor: pointer;
  padding: 20px 22px 18px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}
/* 卡片顶部一道暖线，像摊子上方的灯带 */
.stall-card::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(217, 138, 43, 0.65), rgba(180, 71, 42, 0.15));
}
.stall-card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-lift);
  transform: translateY(-2px);
}
.stall-no {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 1.8px;
  color: var(--color-accent);
  background: rgba(180, 71, 42, 0.07);
  border: 1px solid rgba(180, 71, 42, 0.25);
  padding: 2px 8px;
  border-radius: var(--radius);
  margin-bottom: 11px;
}
.stall-name {
  font-family: var(--font-title);
  font-size: 21px;
  letter-spacing: 1.5px;
  color: var(--color-text);
  margin-bottom: 7px;
}
.stall-owner,
.stall-main {
  font-size: var(--font-tiny);
  color: var(--color-text-secondary);
  line-height: 1.75;
}
.stall-uid {
  color: var(--color-text-muted);
  margin-left: 4px;
}
/* 老板与 ID 同一行、同一字号同一颜色，只用一个间隔点分开 */
.stall-id {
  font-size: inherit;
  color: inherit;
  letter-spacing: 0.2px;
}
.stall-id::before {
  content: '·';
  margin: 0 7px;
  color: var(--color-text-muted);
}
.stall-price {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--color-border);
}
.stall-status {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(166, 64, 42, 0.1);
  color: var(--color-danger);
  border: 1px solid rgba(166, 64, 42, 0.3);
  padding: 1px 7px;
  border-radius: 2px;
  font-size: 10px;
  letter-spacing: 1px;
}

/* 暂停营业摊位：整体压暗（保持暖调，不用冷灰） */
.stall-closed {
  background: #F3EEE2;
  border-color: #E2D8C5;
}
.stall-closed .stall-name {
  color: #857E70;
}
.stall-closed .stall-owner,
.stall-closed .stall-main,
.stall-closed .stall-price {
  color: #A39B8B;
}

/* 手机端同样保持两列（A 列 / B 列），卡片内容自动紧凑换行 */
@media (max-width: 720px) {
  .stall-card {
    padding: 14px 14px 12px;
  }
  .stall-name {
    font-size: 16px;
  }
  .stall-main {
    display: none;
  }
}
</style>
