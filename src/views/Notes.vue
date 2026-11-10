<template>
  <div class="notes-page">
    <NavBar />
    <div class="container">
      <header class="page-head">
        <p class="page-head-kicker">南桥夜市 · 私人</p>
        <h1 class="page-head-title">我的手记</h1>
        <p class="page-head-desc">只有你自己能看到的私密手记。想写什么，就写在这儿。</p>
      </header>

      <!-- 只有你自己能看到的私密手记；这里也可以添加新手记（本机保存） -->
      <div v-if="currentUser">
        <div v-if="notes.length">
          <div v-for="(note, i) in notes" :key="note.key" class="card note-card">
            <p class="note-date">{{ note.date }}</p>
            <p class="note-content">
              <template v-for="(seg, si) in renderNote(note.content)" :key="si">
                <strong v-if="seg.bold">{{ seg.text }}</strong>
                <template v-else>{{ seg.text }}</template>
              </template>
            </p>
          </div>
        </div>
        <p v-else class="empty-hint">还没有手记。</p>

        <!-- 添加新手记 -->
        <div class="card note-composer">
          <textarea v-model="newNote" class="form-input" rows="3" placeholder="写点什么…（只保存在本机浏览器）"></textarea>
          <button class="btn" @click="addNote" style="margin-top:8px">保存手记</button>
        </div>
      </div>
      <p v-else class="empty-hint"><router-link to="/login">登录</router-link>后查看手记。</p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import messagesData from '../data/messages.json'
import { markNode } from '../utils/progress'
import { useCurrentUser } from '../utils/auth'

// 手记正文里 **文字** 渲染为加粗（如陈伯日记里的「念」字）
function renderNote(text) {
  return String(text || '')
    .split('**')
    .map((seg, i) => ({ text: seg, bold: i % 2 === 1 }))
    .filter(seg => seg.text !== '')
}

// 剧情账号的手记：打开手记页即可看到全部内容，进页面即判定进度
const NOTE_PROGRESS = {
  '陈伯': 'notes-cb',
  '今天吃什么': 'notes-son'
}

// 手记 = 内置剧情手记(messages.json) + 玩家自己添加的手记(localStorage nq_notes)
// 玩家添加的手记只保存在本机浏览器：重新登录同一账号仍可见，退出游戏(清浏览器数据/换设备)后不再保留
const notes = ref([])
const newNote = ref('')

const { currentUser, syncUser } = useCurrentUser()

function readLocalNotes() {
  try {
    return JSON.parse(localStorage.getItem('nq_notes') || '{}')
  } catch {
    return {}
  }
}

// "10月25日" -> 1025，用于按时间先后排序（日记按时间往下读）
function parseDate(s) {
  const m = String(s || '').match(/(\d+)月(\d+)日/)
  return m ? (+m[1]) * 100 + (+m[2]) : 0
}

function loadData() {
  syncUser()
  const uname = currentUser.value?.username
  if (!uname) {
    notes.value = []
    return
  }

  const builtin = messagesData[uname]?.notes || []
  const builtinNotes = builtin.map(n => ({ key: 'b:' + n.date, date: n.date, content: n.content }))
  const localNotes = (readLocalNotes()[uname] || []).map((n, i) => ({
    key: 'l:' + i,
    date: n.date,
    content: n.content
  }))

  notes.value = [...builtinNotes, ...localNotes]
    .sort((a, b) => parseDate(a.date) - parseDate(b.date))

  if (builtin.length && NOTE_PROGRESS[uname]) {
    markNode(NOTE_PROGRESS[uname])
  }
}

function addNote() {
  if (!newNote.value.trim() || !currentUser.value) return
  const uname = currentUser.value.username
  const local = readLocalNotes()
  local[uname] = [
    { date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }), content: newNote.value.trim() },
    ...(local[uname] || [])
  ]
  localStorage.setItem('nq_notes', JSON.stringify(local))
  newNote.value = ''
  loadData()
}

onMounted(() => {
  loadData()
  // 切换账号后自动刷新为本账号的手记
  window.addEventListener('nq-user-changed', loadData)
})

onBeforeUnmount(() => {
  window.removeEventListener('nq-user-changed', loadData)
})
</script>

<style scoped>
.page-desc {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}
.note-card {
  margin-bottom: 16px;
  border-left: 3px solid var(--amber);
  padding: 24px 28px;
}
.note-date {
  font-family: var(--font-title);
  font-size: var(--font-small);
  letter-spacing: 2px;
  color: var(--color-accent);
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--color-border);
}
.note-content {
  white-space: pre-line;
  line-height: 2.05;
  color: #46301F;
  font-size: 14.5px;
}
.note-composer {
  margin-top: var(--space-lg);
  border-left: 3px solid var(--amber);
  padding: 22px 24px;
}
.empty-hint {
  color: var(--color-text-secondary);
}
</style>
