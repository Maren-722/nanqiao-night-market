// 剧情进度追踪（结局解锁机制）
// ------------------------------------------------------------
// 玩家在关键页面"真正看到关键内容"时调用 markNode(id) 记一笔，
// 全部集齐后导航栏的灯点亮，可进入结局。
// 进度只存在本机浏览器（localStorage nq_progress）。
//
// 判定粒度原则：内容可见即触发——
//   - 页面加载就能看到全部内容的（帖子详情、手记页）：进页面即记录
//   - 需要点击/展开才能看到内容的（会话记录、线路图、已删通告）：点开才记录
// ------------------------------------------------------------

export const STORY_NODES = [
  { id: 'post-p1', label: '帖子·小李开业' },
  { id: 'post-p2', label: '帖子·糖粥藕' },
  { id: 'post-p3', label: '帖子·陈伯不出摊' },
  { id: 'chat-xl-lj', label: '私信·小李×刘姐' },
  { id: 'chat-lj-cb', label: '私信·刘姐×陈伯' },
  { id: 'chat-lz-cb', label: '私信·老张×陈伯' },
  { id: 'notes-cb', label: '手记·陈伯' },
  { id: 'notes-son', label: '手记·儿子' },
  { id: 'notice-missing', label: '通告·寻人启事' },
  { id: 'metro-map', label: '地铁线路图' }
]

const STORAGE_KEY = 'nq_progress'
const EVENT_NAME = 'nq-progress-changed'

function readSet() {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function writeSet(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function getFound() {
  return readSet()
}

export function isComplete() {
  const found = readSet()
  return STORY_NODES.every(n => found.has(n.id))
}

// 记录一个节点。返回 justUnlocked：本次调用是否恰好集齐（用于弹一次解锁提示）
export function markNode(id) {
  const set = readSet()
  if (set.has(id)) {
    // 已记录过，但如果之前就集齐（例如清过提示），不重复解锁
    return false
  }
  set.add(id)
  writeSet(set)
  const complete = STORY_NODES.every(n => set.has(n.id))
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { justUnlocked: complete } }))
  return complete
}
