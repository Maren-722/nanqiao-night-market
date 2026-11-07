<template>
  <div class="post-detail-page">
    <NavBar />
    <div class="container">
      <BackBar label="返回论坛" fallback="/forum" />
      <!-- 帖子详情：内置帖子 + 玩家发布的帖子（玩家评论存 localStorage，退出登录仍可见） -->
      <div v-if="post" class="detail-card">
        <h2 class="post-title">{{ post.title }}</h2>
        <p class="post-meta">
          {{ post.author }} <span v-if="post.uid" class="user-uid">ID:{{ post.uid }}</span> · {{ post.date }}
        </p>
        <div class="post-content">{{ post.content }}</div>

        <h3 class="sub-title">评论（{{ mergedComments.length }}）</h3>
        <div v-for="(c, i) in mergedComments" :key="i" class="comment-item">
          <p class="comment-user">
            {{ c.user }} <span v-if="c.uid" class="user-uid">ID:{{ c.uid }}</span><template v-if="c.replyTo"> 回复 {{ c.replyTo }}</template> · {{ c.date }}
          </p>
          <p class="comment-content">{{ c.content }}</p>
        </div>

        <!-- 登录后可以评论 -->
        <div v-if="currentUser" class="comment-composer">
          <textarea v-model="newComment" class="form-input" rows="3" placeholder="写下你的评论…"></textarea>
          <button class="btn" @click="addComment" style="margin-top:8px">评论</button>
        </div>
        <p v-else class="login-hint">
          <router-link to="/login">登录</router-link>后可参与评论
        </p>
      </div>
      <p v-else>没有找到这个帖子。</p>
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
import postsData from '../data/posts.json'
import { markNode } from '../utils/progress'
import { useCurrentUser, uidOf } from '../utils/auth'

const route = useRoute()
const post = ref(null)
const newComment = ref('')
// 玩家补充的评论放在响应式 ref 里：发完立刻显示，不用退出重进
const extraComments = ref([])

const { currentUser } = useCurrentUser()

// 读取玩家发布的帖子（与 Forum 同一份数据）
function readLocalPosts() {
  try {
    return JSON.parse(localStorage.getItem('nq_posts') || '[]')
  } catch {
    return []
  }
}

// 玩家补充的评论：{ postId: [ {user,date,content} ] }
function readLocalComments() {
  try {
    return JSON.parse(localStorage.getItem('nq_comments') || '{}')
  } catch {
    return {}
  }
}

// 解析"10月14日 21:40"为可比较的数字（月*1e6+日*1e4+时*100+分）
function parseTime(s) {
  const m = String(s || '').match(/(\d+)月(\d+)日(?:\s*(\d+):(\d+))?/)
  if (!m) return 0
  return (+m[1]) * 1000000 + (+m[2]) * 10000 + (+(m[3] || 0)) * 100 + (+(m[4] || 0))
}

// 合并展示：帖子自带评论 + 玩家后续补充的评论，按时间由近及远排列（同日保持原相对顺序）
const mergedComments = computed(() => {
  if (!post.value) return []
  const all = [...(post.value.comments || []), ...extraComments.value]
  return all.sort((a, b) => parseTime(b.date) - parseTime(a.date))
})

onMounted(() => {
  const id = route.params.id
  const localPosts = readLocalPosts()
  const found = localPosts.find(p => p.id === id) || postsData.find(p => p.id === id) || null
  post.value = found
  extraComments.value = readLocalComments()[id] || []
  // 三篇主线帖：帖子详情页加载即可看到全部内容，进页面即判定进度
  if (found && ['p1', 'p2', 'p3'].includes(id)) {
    markNode('post-' + id)
  }
})

function addComment() {
  if (!newComment.value.trim() || !post.value) return
  const uname = currentUser.value?.username
  // 发言一律带ID：商户=真名拼音，游客=数字ID（剧情账号与玩家账号都适用）
  const uid = uname ? uidOf(uname) : null
  const comment = {
    user: currentUser.value?.shopName || uname || '游客',
    date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }) + ' ' +
      new Date().toTimeString().slice(0, 5),
    content: newComment.value.trim()
  }
  if (uid) comment.uid = uid
  // 持久化到 localStorage：退出登录/切换账号后依然存在，退出游戏(清浏览器数据)后不再保留
  const localComments = readLocalComments()
  localComments[post.value.id] = [...(localComments[post.value.id] || []), comment]
  localStorage.setItem('nq_comments', JSON.stringify(localComments))
  // 同步响应式列表，立即显示
  extraComments.value = [...extraComments.value, comment]
  newComment.value = ''
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
}
.post-title {
  font-family: var(--font-title);
  font-size: 27px;
  letter-spacing: 1px;
  line-height: 1.5;
  color: var(--color-text);
}
.post-meta {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  margin: 6px 0 var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px dashed var(--color-border-strong);
}
.user-uid {
  color: var(--color-text-muted);
  opacity: 0.85;
  margin-left: 6px;
}
.post-content {
  line-height: 1.9;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  white-space: pre-wrap;
  word-break: break-word;
}
.sub-title {
  font-size: var(--font-h3);
  margin: var(--space-md) 0 var(--space-sm);
}
.comment-item {
  padding: 10px 0;
  border-bottom: 1px dashed var(--color-border);
}
.comment-user {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  margin-bottom: 4px;
}
.comment-content {
  white-space: pre-wrap;
  word-break: break-word;
}
.comment-composer {
  margin-top: var(--space-md);
}
.login-hint {
  margin-top: var(--space-md);
  color: var(--color-text-secondary);
}
</style>
