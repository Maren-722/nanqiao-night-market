<template>
  <div class="stall-detail-page">
    <NavBar />
    <div class="container">
      <BackBar label="返回夜市导览" fallback="/stalls" />
      <!-- 摊位详情：按路由参数 :id 匹配 src/data/stalls.json -->
      <div v-if="stall" class="detail-card">
        <div class="detail-header">
          <span class="stall-no">摊位 {{ stall.stallNo }}</span>
          <h2 class="stall-name">{{ stall.shopName }}</h2>
          <p class="stall-owner">老板：{{ stall.owner }}<span v-if="stall.uid" class="stall-id">ID:{{ stall.uid }}</span></p>
        </div>

        <!-- 菜品与价格 -->
        <h3 class="sub-title">菜品</h3>
        <div v-for="item in stall.dishes" :key="item.name" class="dish-row">
          <span>{{ item.name }}</span>
          <span class="dish-price">{{ item.price }}元</span>
        </div>

        <!-- 顾客评价：内置 + 玩家发布的（localStorage 本机保留） -->
        <h3 class="sub-title">顾客评价</h3>
        <div v-for="(review, i) in mergedReviews" :key="i" class="review-item">
          <p class="review-user">
            {{ review.user }}<template v-if="review.replyTo"> 回复 {{ review.replyTo }}</template> · {{ review.date }}
          </p>
          <p class="review-content">{{ review.content }}</p>
        </div>

        <!-- 登录后可以写评价 -->
        <div v-if="currentUser" class="review-composer">
          <textarea v-model="newReview" class="form-input" rows="3" placeholder="写写这家的味道…"></textarea>
          <button class="btn" @click="addReview" style="margin-top:8px">发布评价</button>
        </div>
        <p v-else class="login-hint">
          <router-link to="/login">登录</router-link>后可发表评价
        </p>
      </div>
      <p v-else>没有找到这个摊位。</p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import BackBar from '../components/BackBar.vue'
import stallsData from '../data/stalls.json'
import { useCurrentUser } from '../utils/auth'

const route = useRoute()
const stall = ref(null)
const newReview = ref('')
// 玩家写的评价放响应式 ref：发完立刻显示
const extraReviews = ref([])

const { currentUser } = useCurrentUser()

// 玩家写的评价：{ stallId: [ {user,date,content} ] }
function readLocalReviews() {
  try {
    return JSON.parse(localStorage.getItem('nq_stall_reviews') || '{}')
  } catch {
    return {}
  }
}

const mergedReviews = computed(() => {
  if (!stall.value) return []
  return [...(stall.value.reviews || []), ...extraReviews.value]
})

onMounted(() => {
  stall.value = stallsData.find(s => s.id === route.params.id) || null
  extraReviews.value = readLocalReviews()[route.params.id] || []
})

function addReview() {
  if (!newReview.value.trim() || !stall.value) return
  const review = {
    user: currentUser.value?.shopName || currentUser.value?.username || '游客',
    date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
    content: newReview.value.trim()
  }
  const all = readLocalReviews()
  all[stall.value.id] = [...(all[stall.value.id] || []), review]
  localStorage.setItem('nq_stall_reviews', JSON.stringify(all))
  extraReviews.value = [...extraReviews.value, review]
  newReview.value = ''
}
</script>

<style scoped>
.detail-card {
  max-width: 760px;
  margin: 0 auto;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 30px 32px;
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}
.detail-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--amber), var(--color-accent));
}
.detail-header {
  border-bottom: 1px dashed var(--color-border-strong);
  padding-bottom: var(--space-md);
  margin-bottom: var(--space-md);
}
.stall-no {
  display: inline-block;
  font-size: var(--font-tiny);
  letter-spacing: 2px;
  color: var(--color-accent);
  background: rgba(180, 71, 42, 0.07);
  border: 1px solid rgba(180, 71, 42, 0.25);
  padding: 2px 9px;
  border-radius: var(--radius);
}
.stall-name {
  font-family: var(--font-title);
  font-size: 34px;
  letter-spacing: 3px;
  color: var(--color-text);
  margin: 10px 0 6px;
}
.stall-owner {
  color: var(--color-text-secondary);
}
.stall-uid {
  color: var(--color-text-muted);
  font-size: var(--font-tiny);
}
/* 老板与 ID 同一行、同一字号同一颜色，只用一个间隔点分开 */
.stall-id {
  font-size: inherit;
  color: inherit;
}
.stall-id::before {
  content: '·';
  margin: 0 7px;
  color: var(--color-text-muted);
}
.sub-title {
  font-size: var(--font-h3);
  margin: var(--space-md) 0 var(--space-sm);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-border);
}
.dish-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed var(--color-border);
}
.dish-price {
  color: var(--color-accent);
}
.review-item {
  padding: 10px 0;
  border-bottom: 1px dashed var(--color-border);
}
.review-user {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  margin-bottom: 4px;
}
.review-content {
  white-space: pre-wrap;
  word-break: break-word;
}
.review-composer {
  margin-top: var(--space-md);
}
.login-hint {
  margin-top: var(--space-md);
  color: var(--color-text-secondary);
}
</style>
