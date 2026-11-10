<template>
  <div class="messages-page">
    <NavBar />
    <div class="container">
      <header class="page-head">
        <p class="page-head-kicker">南桥夜市 · 私信</p>
        <h1 class="page-head-title">短信</h1>
        <p class="page-head-desc">和夜市里的人说几句话。有些话，他们只对熟人说。</p>
      </header>

      <div v-if="currentUser" class="chat-app" :class="{ 'chat-open': !!activeConv }">
        <!-- 左侧：会话列表（电脑常驻；手机上未进入聊天时显示） -->
        <aside class="chat-list">
          <div
            v-for="conv in sortedConvs"
            :key="conv.with"
            class="chat-list-item"
            :class="{ active: activeConv && activeConv.with === conv.with }"
            @click="openConv(conv)"
          >
            <div class="chat-avatar">{{ conv.with.slice(0, 1) }}</div>
            <div class="chat-item-info">
              <div class="chat-item-top">
                <span class="chat-item-name">{{ conv.with }}</span>
                <span class="chat-item-time">{{ convTime(conv) }}</span>
              </div>
              <p class="chat-item-preview">
                {{ convPreview(conv) }}
              </p>
            </div>
          </div>
          <p v-if="!sortedConvs.length" class="chat-list-empty">暂时没有私信记录</p>
        </aside>

        <!-- 右侧：聊天窗口（手机上点进会话后显示，可返回） -->
        <section v-if="activeConv" class="chat-window">
          <div class="chat-window-header">
            <button class="chat-back" @click="closeConv" title="返回会话列表">‹</button>
            <span class="chat-window-name">{{ activeConv.with }}</span>
          </div>
          <div class="chat-window-body" ref="chatBody">
            <template v-if="activeMessages.length">
              <template v-for="(row, i) in activeRows" :key="i">
                <!-- 像微信一样：日期单独一行居中，只在跨天时出现，不显示具体时刻 -->
                <p v-if="row.type === 'date'" class="chat-date">{{ row.label }}</p>
                <div
                  v-else
                  class="bubble-row"
                  :class="{ mine: row.msg.from === currentUser.username }"
                >
                  <div class="bubble-avatar">{{ avatarFor(row.msg) }}</div>
                  <div class="bubble-stack">
                    <div class="bubble">{{ row.msg.content }}</div>
                  </div>
                </div>
              </template>
            </template>
            <p v-else class="chat-cleared">记录已清空</p>
          </div>
          <div class="chat-input-bar">
            <input
              v-model="draft"
              class="chat-input"
              placeholder="发消息…"
              @keyup.enter="sendMsg"
            >
            <button class="chat-send" @click="sendMsg">发送</button>
          </div>
        </section>
        <section v-else class="chat-window chat-placeholder">
          <p>选择一个会话开始聊天</p>
        </section>
      </div>
      <p v-else class="empty-hint"><router-link to="/login">登录</router-link>后查看私信。</p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import messagesData from '../data/messages.json'
import { markNode } from '../utils/progress'
import { useCurrentUser } from '../utils/auth'

const { currentUser, syncUser } = useCurrentUser()

const convs = ref([])          // 当前账号的会话列表（内置数据）
const sentMap = ref({})        // 玩家发出的消息 { 对方名: [ {from,time,content} ] }
const activeWith = ref('')     // 当前打开的会话对方名
const draft = ref('')
const chatBody = ref(null)

// 展开会话（点进聊天）才判定进度：内容点开后才可见，判定同样在点开时
const PROGRESS_KEYS = {
  '小李|刘姐': 'chat-xl-lj',
  '刘姐|陈伯': 'chat-lj-cb',
  '老张|陈伯': 'chat-lz-cb'
}

// 玩家发出的消息存 localStorage（nq_sent_messages），本机保留
function readSent() {
  try {
    return JSON.parse(localStorage.getItem('nq_sent_messages') || '{}')
  } catch {
    return {}
  }
}

// 会话的全部消息 = 内置 + 玩家发出的（按时间顺序追加在后）
function convMsgs(conv) {
  return [...(conv.messages || []), ...(sentMap.value[conv.with] || [])]
}

// "10月26日 21:47" -> 可比较的数字
function parseTime(t) {
  const m = String(t || '').match(/(\d+)月(\d+)日(?:\s*(\d+):(\d+))?/)
  if (!m) return 0
  return (+m[1]) * 1000000 + (+m[2]) * 10000 + (+(m[3] || 0)) * 100 + (+(m[4] || 0))
}

// 会话按最新消息时间由近及远排列；无记录（已清空）的排最后
const sortedConvs = computed(() => {
  return [...convs.value].sort((a, b) => lastTs(b) - lastTs(a))
})

function lastTs(conv) {
  const m = convMsgs(conv)
  return m.length ? parseTime(m[m.length - 1].time) : -1
}

function convTime(conv) {
  const m = convMsgs(conv)
  if (!m.length) return ''
  return String(m[m.length - 1].time || '').split(' ')[0]
}

function convPreview(conv) {
  const m = convMsgs(conv)
  return m.length ? m[m.length - 1].content : '记录已清空'
}

const activeConv = computed(() => {
  return convs.value.find(c => c.with === activeWith.value) || null
})

const activeMessages = computed(() => {
  return activeConv.value ? convMsgs(activeConv.value) : []
})

// 按日期切段：跨天时插入一条居中的日期行（微信式）
const activeRows = computed(() => {
  const rows = []
  let lastDate = ''
  for (const msg of activeMessages.value) {
    const date = String(msg.time || '').split(' ')[0]
    if (date && date !== lastDate) {
      rows.push({ type: 'date', label: date })
      lastDate = date
    }
    rows.push({ type: 'msg', msg })
  }
  return rows
})

function avatarFor(msg) {
  if (msg.from === currentUser.value?.username) {
    return (currentUser.value?.username || '').slice(0, 1)
  }
  return activeConv.value.with.slice(0, 1)
}

function openConv(conv) {
  activeWith.value = conv.with
  const key = PROGRESS_KEYS[currentUser.value?.username + '|' + conv.with]
  if (key) markNode(key)
  scrollToBottom()
}

function closeConv() {
  activeWith.value = ''
}

// 发消息：追加到本机记录并立即显示（游戏内时间固定为 10月30日）
function sendMsg() {
  const text = draft.value.trim()
  if (!text || !activeConv.value || !currentUser.value) return
  const now = new Date()
  const msg = {
    from: currentUser.value.username,
    time: '10月30日 ' + now.toTimeString().slice(0, 5),
    content: text
  }
  const all = readSent()
  all[activeConv.value.with] = [...(all[activeConv.value.with] || []), msg]
  localStorage.setItem('nq_sent_messages', JSON.stringify(all))
  sentMap.value = { ...all }
  draft.value = ''
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

function loadData() {
  syncUser()
  sentMap.value = readSent()
  const uname = currentUser.value?.username
  convs.value = uname ? (messagesData[uname]?.messages || []) : []
  // 当前打开的会话如果不在新账号的列表里，回到列表
  if (activeWith.value && !convs.value.find(c => c.with === activeWith.value)) {
    activeWith.value = ''
  }
}

onMounted(() => {
  loadData()
  // 切换账号后自动刷新为本账号的私信
  window.addEventListener('nq-user-changed', loadData)
})

onBeforeUnmount(() => {
  window.removeEventListener('nq-user-changed', loadData)
})
</script>

<style scoped>
/* ---------- 整体双栏布局 ---------- */
.chat-app {
  display: flex;
  height: 600px;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

/* ---------- 左侧会话列表 ---------- */
.chat-list {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  background: var(--color-card-2);
  overflow-y: auto;
}
.chat-list-item {
  position: relative;
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}
.chat-list-item:hover {
  background: var(--color-card);
}
.chat-list-item.active {
  background: var(--color-card);
  box-shadow: inset 3px 0 0 var(--color-accent);
}
.chat-avatar {
  width: 38px;
  height: 38px;
  border-radius: var(--radius);
  background: linear-gradient(160deg, #8B4A29, #5E2E19);
  color: #FFF0D6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-title);
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(255, 214, 150, 0.3);
}
.chat-item-info {
  flex: 1;
  min-width: 0;
}
.chat-item-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}
.chat-item-name {
  font-weight: 600;
  font-size: var(--font-body-size);
  color: var(--color-text);
}
.chat-item-time {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
.chat-item-preview {
  font-size: var(--font-tiny);
  color: var(--color-text-muted);
  margin-top: 3px;
  padding-right: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chat-item-preview.cleared {
  font-style: italic;
}
.chat-list-empty {
  color: var(--color-text-muted);
  text-align: center;
  padding: 40px 0;
  font-size: var(--font-small);
}

/* ---------- 右侧聊天窗口 ---------- */
.chat-window {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.chat-window-header {
  height: 54px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-card);
  font-family: var(--font-title);
  letter-spacing: 1.5px;
}
.chat-back {
  display: none;
  background: none;
  border: none;
  font-size: 26px;
  line-height: 1;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0 4px;
}
.chat-window-name {
  font-weight: 600;
  font-size: var(--font-body-size);
}
.chat-window-body {
  flex: 1;
  overflow-y: auto;
  padding: 18px;
  background:
    repeating-linear-gradient(0deg, rgba(122, 60, 34, 0.022) 0 1px, transparent 1px 4px),
    #F7ECD6;
}
.chat-cleared {
  color: var(--color-text-muted);
  font-style: italic;
  text-align: center;
  padding: 60px 0;
  font-size: var(--font-small);
}
.chat-placeholder {
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: var(--font-small);
}

/* ---------- 气泡 ---------- */
.bubble-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  align-items: flex-start;
}
.bubble-row.mine {
  flex-direction: row-reverse;
}
.bubble-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--radius);
  background: linear-gradient(160deg, #8B4A29, #5E2E19);
  color: #FFF0D6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-title);
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
.bubble-stack {
  max-width: 72%;
  min-width: 0;
}
/* 微信式的日期分隔：一行小字居中 */
.chat-date {
  text-align: center;
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  margin: 6px 0 16px;
}
.chat-date::before,
.chat-date::after {
  content: '';
  display: inline-block;
  width: 26px;
  height: 1px;
  vertical-align: middle;
  margin: 0 10px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}
.bubble {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  padding: 9px 12px;
  border-radius: var(--radius);
  line-height: 1.65;
  font-size: var(--font-body-size);
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 6px 14px -12px rgba(74, 35, 18, 0.7);
}
.bubble-row.mine .bubble {
  background: #F6E1B4;
  border-color: #DFC38A;
}

/* ---------- 输入栏 ---------- */
.chat-input-bar {
  flex-shrink: 0;
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  border-top: 1px solid var(--color-border);
  background: var(--color-card);
}
.chat-input {
  flex: 1;
  min-width: 0;
}
.chat-send {
  flex-shrink: 0;
  padding: 8px 18px;
  border: none;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-body-size);
  font-family: var(--font-body);
  cursor: pointer;
  transition: opacity 0.2s;
}
.chat-send:hover {
  opacity: 0.9;
}

.empty-hint {
  color: var(--color-text-secondary);
}

/* ---------- 手机端：列表与聊天窗口切换 ---------- */
@media (max-width: 720px) {
  .chat-app {
    height: calc(100vh - 230px);
    min-height: 420px;
  }
  .chat-list {
    width: 100%;
    border-right: none;
  }
  .chat-window {
    display: none;
  }
  .chat-app.chat-open .chat-list {
    display: none;
  }
  .chat-app.chat-open .chat-window {
    display: flex;
  }
  .chat-back {
    display: inline-block;
  }
  .bubble-stack {
    max-width: 80%;
  }
}
</style>
