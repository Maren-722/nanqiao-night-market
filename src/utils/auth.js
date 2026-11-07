// 登录态与账号匹配（ID 体系）
// ------------------------------------------------------------
// ID 规则（v5）：
//   - 商户摊主：ID = 摊位号（A1/B1/B2/B4…，导览页老板行可见），登录也可直接用账号名（如"陈伯"）
//   - 王主任（管理处）：ID = M1
//   - 食客/游客：ID = C + 数字（5 位以内，如 C20938；儿子 C4826）
//   - 玩家注册的账号：注册时自动分配 C+10位数字 的 ID，登录可用"用户名或ID"
//
// 冲突约定：
//   - 剧情账号的"账号名 + ID"全部是保留字，注册时禁止使用（见 isReservedId）
//   - 注册用户名也不能与已有玩家分配到的 ID 撞车
//   - localStorage 不是响应式数据源，登录态统一用 ref + 'nq-user-changed' 事件同步
// ------------------------------------------------------------
import { ref, onMounted, onBeforeUnmount } from 'vue'
import accounts from '../data/accounts.json'

const CUSTOM_KEY = 'nq_custom_accounts'

export function readUser() {
  try {
    return JSON.parse(localStorage.getItem('nq_user') || 'null')
  } catch {
    return null
  }
}

export function useCurrentUser() {
  const currentUser = ref(readUser())

  function syncUser() {
    currentUser.value = readUser()
  }

  onMounted(() => {
    window.addEventListener('nq-user-changed', syncUser)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('nq-user-changed', syncUser)
  })

  return { currentUser, readUser, syncUser }
}

export function readCustomAccounts() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '{}')
  } catch {
    return {}
  }
}

// 按关键字查剧情账号：匹配 uid（摊位号 / M1 / C+数字）或账号名，不区分大小写
export function findAccountById(id) {
  const k = String(id || '').trim().toLowerCase()
  if (!k) return null
  const byUid = Object.keys(accounts).find(n => String(accounts[n].uid).toLowerCase() === k)
  if (byUid) return { username: byUid, ...accounts[byUid] }
  const byName = Object.keys(accounts).find(n => n.toLowerCase() === k)
  if (byName) return { username: byName, ...accounts[byName] }
  return null
}

// 统一登录匹配：关键字可以是 剧情账号ID / 剧情账号名 / 玩家用户名 / 玩家数字ID
// 返回：{ ok: true, username, shopName, role, uid } 匹配成功
//       { ok: false, reason: 'password' } 账号存在但密码错误
//       null 账号不存在
export function matchLogin(id, pwd) {
  const story = findAccountById(id)
  if (story) {
    if (story.password !== pwd) return { ok: false, reason: 'password' }
    return {
      ok: true,
      username: story.username,
      shopName: story.shopName || story.username,
      role: story.role || 'customer',
      uid: story.uid
    }
  }
  const custom = readCustomAccounts()
  const k = String(id || '').trim()
  const name = custom[k] ? k : Object.keys(custom).find(n => String(custom[n].uid || '').toLowerCase() === k.toLowerCase())
  if (name) {
    const acct = custom[name]
    if (acct.password !== pwd) return { ok: false, reason: 'password' }
    return {
      ok: true,
      username: name,
      shopName: acct.shopName || name,
      role: 'customer',
      uid: acct.uid
    }
  }
  return null
}

// 保留字：剧情账号名 + 剧情账号ID（拼音比较不区分大小写），玩家用户名不能用
export function isReservedId(id) {
  const k = String(id || '').trim().toLowerCase()
  if (!k) return true
  if (Object.keys(accounts).some(n => n.toLowerCase() === k)) return true
  if (Object.values(accounts).some(a => String(a.uid).toLowerCase() === k)) return true
  return false
}

// 给新注册的游客分配唯一的「C + 5位数字」ID（避开剧情ID和已有玩家的ID）
export function generateVisitorUid() {
  const custom = readCustomAccounts()
  const taken = new Set([
    ...Object.values(accounts).map(a => String(a.uid).toLowerCase()),
    ...Object.values(custom).map(a => String(a.uid || '').toLowerCase())
  ])
  let uid
  do {
    uid = 'C' + String(Math.floor(10000 + Math.random() * 90000))
  } while (taken.has(uid.toLowerCase()))
  return uid
}

// 取某个登录用户的展示用 ID（剧情账号或玩家账号都适用）
export function uidOf(username) {
  if (accounts[username]) return accounts[username].uid
  return readCustomAccounts()[username]?.uid || null
}
