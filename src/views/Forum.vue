<template>
  <div class="forum-page">
    <NavBar />
    <div class="container">
      <header class="page-head forum-header">
        <div>
          <p class="page-head-kicker">南桥夜市 · 论坛</p>
          <h1 class="page-head-title">夜市论坛</h1>
          <p class="page-head-desc">摊主和老顾客都在这里聊两句。登录后可以发帖、评论。</p>
        </div>
        <button v-if="currentUser" class="btn" @click="showComposer = true">发帖</button>
      </header>

      <!-- 发帖框（登录后可见） -->
      <div v-if="showComposer" class="card composer">
        <input v-model="newTitle" class="form-input" placeholder="帖子标题" style="margin-bottom:8px">
        <textarea v-model="newContent" class="form-input" rows="4" placeholder="内容…"></textarea>
        <button class="btn" @click="publishPost" style="margin-top:8px">发布</button>
      </div>

      <!-- 帖子列表：内置帖子 + 玩家发布的帖子（玩家帖排前面） -->
      <div
        v-for="post in posts"
        :key="post.id"
        class="card post-card"
        @click="$router.push('/forum/' + post.id)"
      >
        <h3 class="post-title">{{ post.title }}</h3>
        <p class="post-meta">
          {{ post.author }} <span v-if="post.uid" class="user-uid">ID:{{ post.uid }}</span> · {{ post.date }} · {{ post.replies }} 回复
        </p>
        <p class="post-preview">{{ post.preview }}</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import postsData from '../data/posts.json'
import { useCurrentUser, uidOf } from '../utils/auth'

// 帖子列表：内置帖子(src/data/posts.json) + 玩家发布的帖子(localStorage nq_posts)
// 玩家帖子/评论只存在本机浏览器，退出游戏（清除浏览器数据/换设备）后不再保留
const posts = ref([])
const showComposer = ref(false)
const newTitle = ref('')
const newContent = ref('')

const { currentUser } = useCurrentUser()

// 读取玩家发布的帖子
function readLocalPosts() {
  try {
    return JSON.parse(localStorage.getItem('nq_posts') || '[]')
  } catch {
    return []
  }
}

// 读取玩家补充的评论：{ postId: [ {user,date,content} ] }
function readLocalComments() {
  try {
    return JSON.parse(localStorage.getItem('nq_comments') || '{}')
  } catch {
    return {}
  }
}

function loadData() {
  const localPosts = readLocalPosts()
  const localComments = readLocalComments()
  // 玩家帖子排前面，回复数 = 已有评论数
  const userPosts = localPosts.map(p => ({
    ...p,
    replies: (p.comments?.length || 0) + (localComments[p.id]?.length || 0)
  }))
  // 内置帖子：按发帖时间近→远排列（"4月20日" → 420）
  const parseDate = s => {
    const m = String(s || '').match(/(\d+)月(\d+)日/)
    return m ? (+m[1]) * 100 + (+m[2]) : 0
  }
  const builtinPosts = [...postsData]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .map(p => ({ ...p, replies: p.replies + (localComments[p.id]?.length || 0) }))
  posts.value = [...userPosts, ...builtinPosts]
}

onMounted(() => {
  loadData()
})

// 发帖：写入 localStorage 持久化（本机可见，退出登录/换账号仍存在）
function publishPost() {
  if (!newTitle.value.trim()) return
  const author = currentUser.value?.shopName || currentUser.value?.username || '游客'
  const post = {
    id: 'local-' + Date.now(),
    title: newTitle.value.trim(),
    author,
    date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
    preview: newContent.value.trim(),
    content: newContent.value.trim(),
    comments: []
  }
  // 发帖人一律带ID：商户=真名拼音，游客=数字ID
  const uname = currentUser.value?.username
  const uid = uname ? uidOf(uname) : null
  if (uid) post.uid = uid
  const localPosts = readLocalPosts()
  localPosts.unshift(post)
  localStorage.setItem('nq_posts', JSON.stringify(localPosts))
  newTitle.value = ''
  newContent.value = ''
  showComposer.value = false
  loadData()
}
</script>

<style scoped>
.forum-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}
.composer {
  margin-bottom: var(--space-md);
}
.post-card {
  cursor: pointer;
  margin-bottom: 10px;
  transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
}
.post-card:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lift);
}
.post-title {
  font-family: var(--font-title);
  font-size: 18px;
  letter-spacing: 0.5px;
  color: var(--color-text);
  margin-bottom: 5px;
}
.post-meta {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  margin-bottom: 6px;
}
.user-uid {
  opacity: 0.85;
  margin-left: 6px;
}
.post-preview {
  font-size: var(--font-small);
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
