<template>
  <nav v-if="!hideNav" class="navbar">
    <div class="navbar-logo" @click="go('/home')">
      <span class="logo-cn">南桥夜市</span>
      <span class="logo-en">NANQIAO NIGHT MARKET</span>
    </div>
    <div class="navbar-links">
      <a :class="{ active: isActive('/home') }" @click="go('/home')">首页</a>
      <a :class="{ active: isActive('/stalls') }" @click="go('/stalls')">夜市导览</a>
      <a :class="{ active: isActive('/forum') }" @click="go('/forum')">夜市论坛</a>
      <template v-if="currentUser && currentUser.role === 'manager'">
        <a :class="{ active: isActive('/manager') }" @click="go('/manager')">管理处</a>
      </template>
      <template v-if="currentUser">
        <a @click="go('/messages')">短信</a>
        <a @click="go('/notes')">我的手记</a>
        <div class="navbar-user-wrap">
          <span class="navbar-user" @click="showMenu = !showMenu">
            {{ currentUser.shopName || currentUser.username }} ▾
          </span>
        </div>
      </template>
      <a v-else @click="go('/login')">登录</a>
      <span
        class="nav-lamp"
        :class="{ lit: progressComplete }"
        @click="goEnding"
      ><img class="nav-lamp-img" :src="kongmingImg" alt="" /></span>
    </div>

    <!-- 集齐线索时的一次性提示：一整屏夜色里的一盏灯（与结局封面平行，样式各自独立） -->
    <div v-if="showUnlock" class="lamp-gate">
      <div class="gate-stage">
        <div class="gate-lamp-wrap">
          <div class="gate-glow"></div>
          <img class="gate-bloom" :src="kongmingImg" alt="" aria-hidden="true" />
          <img class="gate-lamp" :src="kongmingImg" alt="" />
        </div>

        <p class="gate-hint">夜色里，所有的线索都被你串了起来，这盏灯为你亮了。</p>

        <button class="gate-primary" @click="enterStory">通往结局</button>
        <button class="gate-back" @click="stayExploring">回到夜市</button>

        <p class="gate-note">（之后点击导航栏亮起的灯笼，随时可前往结局）</p>
      </div>
    </div>

    <!-- 账号菜单遮罩：点击菜单外关闭 -->
    <div v-if="showMenu" class="menu-mask" @click="closeMenu"></div>

    <!-- 账号下拉菜单 -->
    <div v-if="showMenu" class="user-menu" @click.stop>
      <button class="menu-item" @click="openSwitch">切换账号</button>
      <button class="menu-item menu-danger" @click="logout">退出登录</button>

      <!-- 切换账号表单 -->
      <div v-if="switchMode" class="menu-form">
        <input
          v-model="loginId"
          class="form-input menu-input"
          placeholder="ID"
        >
        <input
          v-model="loginPwd"
          type="password"
          class="form-input menu-input"
          placeholder="密码"
          @keyup.enter="doSwitch"
        >
        <button class="btn btn-block" @click="doSwitch">登录</button>
        <p v-if="loginError" class="menu-error">{{ loginError }}</p>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { matchLogin } from '../utils/auth'
import { isComplete } from '../utils/progress'
import kongmingImg from '../assets/kongming-nav.webp'

const route = useRoute()
const router = useRouter()

const hideNav = ref(route.meta.hideNav === true)

// 当前登录账号：响应式 ref，登录/切换/退出时同步更新
function loadUser() {
  try {
    return JSON.parse(localStorage.getItem('nq_user') || 'null')
  } catch {
    return null
  }
}
const currentUser = ref(loadUser())

// 账号菜单状态
const showMenu = ref(false)
const switchMode = ref(false)
const loginId = ref('')
const loginPwd = ref('')
const loginError = ref('')

// ---------------- 结局灯笼 ----------------
// 灯一直挂在导航栏：未集齐时是暗的，点了没反应；集齐后点亮，可进入结局封面
const progressComplete = ref(isComplete())
const showUnlock = ref(false)

function onProgressChanged(e) {
  if (e?.detail?.justUnlocked) {
    progressComplete.value = true
    // 集齐后弹一次这盏灯的提示页（刷新/重进不再弹）
    if (!localStorage.getItem('nq_ending_prompted')) {
      showUnlock.value = true
    }
  }
}

// 点导航栏亮起的灯：进入结局封面（封面页保持不变）
function goEnding() {
  if (!progressComplete.value) return   // 没集齐：点灯没反应
  router.push('/ending')
}

// 提示页的主出口：直接进结局第一页，不再经过封面那一屏
function enterStory() {
  localStorage.setItem('nq_ending_prompted', '1')
  showUnlock.value = false
  router.push({ path: '/ending', query: { p: '1' } })
}

// 提示页的次要出口：留在夜市，之后可点导航栏的灯再进结局
function stayExploring() {
  localStorage.setItem('nq_ending_prompted', '1')
  showUnlock.value = false
}

onMounted(() => {
  window.addEventListener('nq-progress-changed', onProgressChanged)
})
onBeforeUnmount(() => {
  window.removeEventListener('nq-progress-changed', onProgressChanged)
})

function go(path) {
  router.push(path)
}

// 当前页面高亮：首页精确匹配，导览/论坛匹配其详情页
function isActive(path) {
  if (path === '/home') return route.path === '/home'
  return route.path.startsWith(path)
}

function closeMenu() {
  showMenu.value = false
  switchMode.value = false
  loginError.value = ''
}

function openSwitch() {
  switchMode.value = true
  loginError.value = ''
}

// 退出登录：清除登录态，恢复游客模式
function logout() {
  localStorage.removeItem('nq_user')
  currentUser.value = null
  closeMenu()
  loginId.value = ''
  loginPwd.value = ''
  window.dispatchEvent(new CustomEvent('nq-user-changed'))
  // 若在私密页面（短信/手记），跳回首页
  if (route.meta.requiresAuth) {
    router.push('/home')
  }
}

// 切换账号：统一走 matchLogin（剧情账号ID/账号名、玩家用户名/数字ID均可）
function doSwitch() {
  const id = loginId.value.trim()
  const pwd = loginPwd.value.trim()
  if (!id || !pwd) {
    loginError.value = '请输入ID和密码'
    return
  }
  const result = matchLogin(id, pwd)
  if (result && result.ok) {
    localStorage.setItem('nq_user', JSON.stringify({
      username: result.username,
      shopName: result.shopName,
      role: result.role
    }))
    currentUser.value = { username: result.username, shopName: result.shopName, role: result.role }
    closeMenu()
    loginId.value = ''
    loginPwd.value = ''
    window.dispatchEvent(new CustomEvent('nq-user-changed'))
  } else {
    loginError.value = 'ID或密码错误，请重试'
  }
}
</script>

<style scoped>
/* 酱褐色的木头招牌，不是黑的 */
.navbar {
  position: relative;
  background:
    linear-gradient(180deg, #4B2B1C 0%, #3D2215 100%),
    repeating-linear-gradient(90deg, rgba(255, 214, 160, 0.035) 0 2px, transparent 2px 9px);
  color: #F1E0C6;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 68px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 10px 26px -18px rgba(58, 26, 12, 0.9);
}
/* 招牌下沿：一条被灯烤热的金线 */
.navbar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: linear-gradient(90deg, rgba(217, 138, 43, 0) 0%, rgba(235, 184, 106, 0.85) 22%, rgba(255, 214, 150, 0.95) 50%, rgba(235, 184, 106, 0.85) 78%, rgba(217, 138, 43, 0) 100%);
}
.navbar-logo {
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  padding-left: 12px;
  border-left: 2px solid var(--amber);
}
.logo-cn {
  font-family: var(--font-title);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 5px;
  line-height: 1;
  color: #FFF3DC;
  text-shadow: 0 0 18px rgba(255, 188, 96, 0.35);
}
.logo-en {
  font-size: 8px;
  letter-spacing: 2.6px;
  line-height: 1;
  color: rgba(235, 184, 106, 0.8);
}
.navbar-links {
  display: flex;
  gap: 24px;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
}
.navbar-links::-webkit-scrollbar {
  display: none;
}
.navbar-links a {
  position: relative;
  color: #D9C3A6;
  font-size: 13px;
  letter-spacing: 1.4px;
  cursor: pointer;
  padding: 9px 1px;
  white-space: nowrap;
  transition: color 0.2s;
}
.navbar-links a:hover {
  color: #FFF0D6;
}
/* 当前所在页面：灯下的亮字 + 一道暖线 */
.navbar-links a.active {
  color: #FFD79A;
}
.navbar-links a.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 2px;
  background: linear-gradient(90deg, var(--amber), #FFE1B0);
  box-shadow: 0 0 8px rgba(255, 190, 92, 0.6);
}
.navbar-user-wrap {
  position: relative;
}
.navbar-user {
  border: 1px solid rgba(235, 184, 106, 0.42);
  background: rgba(255, 214, 160, 0.06);
  color: #F0DFC4;
  padding: 5px 12px;
  border-radius: var(--radius);
  font-size: var(--font-tiny);
  letter-spacing: 0.8px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s;
}
.navbar-user:hover {
  background: rgba(255, 214, 160, 0.14);
  border-color: rgba(255, 216, 154, 0.75);
}

/* 菜单遮罩：点击任意外部区域关闭 */
.menu-mask {
  position: fixed;
  inset: 0;
  z-index: 150;
}
/* 账号下拉菜单 */
.user-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: var(--color-card);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  box-shadow: 0 18px 40px -18px rgba(58, 26, 12, 0.7);
  min-width: 224px;
  padding: 8px;
  z-index: 200;
}
.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 8px 10px;
  font-size: var(--font-body-size);
  color: var(--color-text);
  font-family: var(--font-body);
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.15s;
}
.menu-item:hover {
  background: var(--color-card-2);
}
.menu-danger {
  color: var(--color-danger);
}
.menu-form {
  border-top: 1px dashed var(--color-border);
  margin-top: 8px;
  padding-top: 10px;
  display: grid;
  gap: 8px;
}
.menu-input {
  font-size: 14px;
  padding: 8px 10px;
}
.menu-error {
  color: var(--color-danger);
  font-size: var(--font-tiny);
  text-align: center;
}

/* 结局灯笼：一直是暗的，集齐后点亮 */
.nav-lamp {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  line-height: 1;
  filter: grayscale(0.85) brightness(0.8);
  opacity: 0.52;
  transition: filter 0.6s, opacity 0.6s;
}
.nav-lamp-img {
  display: block;
  width: 23px;
  height: auto;
}
.nav-lamp.lit {
  filter: none;
  opacity: 1;
  animation: lampGlow 2.6s ease-in-out infinite;
}
@keyframes lampGlow {
  0%, 100% { filter: drop-shadow(0 0 3px rgba(255, 190, 92, 0.5)); }
  50% { filter: drop-shadow(0 0 13px rgba(255, 190, 92, 0.95)); }
}

/* 集齐线索时的一次性提示：整屏夜色 + 一盏孔明灯 + 无框的字 */
.lamp-gate {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(760px 460px at 50% 20%, rgba(255, 166, 86, 0.1), transparent 70%),
    linear-gradient(176deg, #22100a 0%, #351a0f 40%, #27140c 72%, #170b06 100%);
  animation: gateIn 0.5s ease;
}
@keyframes gateIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.gate-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px;
}
.gate-lamp-wrap {
  position: relative;
  display: flex;
  justify-content: center;
}
.gate-glow {
  position: absolute;
  top: 12%;
  width: 460px;
  height: 460px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 178, 96, 0.17) 0%, rgba(255, 150, 66, 0.07) 46%, rgba(255, 150, 66, 0) 76%);
  filter: blur(30px);
  pointer-events: none;
}
.gate-bloom {
  position: absolute;
  top: 0;
  left: 50%;
  width: 220px;
  height: auto;
  transform: translateX(-50%) scale(1.07);
  filter: blur(20px) saturate(1.15) brightness(1.05);
  opacity: 0.5;
  pointer-events: none;
}
.gate-lamp {
  position: relative;
  width: 220px;
  height: auto;
  filter: brightness(0.94) saturate(1.04) drop-shadow(0 22px 38px rgba(0, 0, 0, 0.4));
  animation: gateFloat 9s ease-in-out infinite;
}
@keyframes gateFloat {
  0%, 100% { transform: translateY(0) rotate(-0.4deg); }
  50% { transform: translateY(-10px) rotate(0.4deg); }
}
.gate-hint {
  font-family: var(--font-title);
  font-size: 13px;
  line-height: 1.9;
  letter-spacing: 0.14em;
  text-indent: 0.14em;
  color: #b39a76;
  margin: 4px 0 0;
  text-align: center;
  max-width: 440px;
}
.gate-primary {
  border: 0;
  background: none;
  padding: 6px 2px 2px;
  cursor: pointer;
  font-family: var(--font-title);
  font-size: 19px;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
  color: #eed3a6;
  transition: color 0.3s;
}
.gate-primary::after {
  content: '';
  display: block;
  height: 1px;
  margin-top: 7px;
  background: linear-gradient(90deg, transparent, rgba(238, 211, 166, 0.55), transparent);
  transform: scaleX(0.4);
  transition: transform 0.35s ease;
}
.gate-primary:hover {
  color: #ffe7bf;
}
.gate-primary:hover::after {
  transform: scaleX(1);
}
.gate-back {
  border: 0;
  background: none;
  padding: 2px;
  cursor: pointer;
  font-family: var(--font-title);
  font-size: 12px;
  letter-spacing: 0.24em;
  text-indent: 0.24em;
  color: rgba(201, 168, 119, 0.62);
  transition: color 0.3s;
}
.gate-back:hover {
  color: #d8b789;
}
.gate-note {
  font-size: 12px;
  line-height: 1.8;
  color: rgba(179, 146, 122, 0.78);
  margin: 4px 0 0;
  text-align: center;
}

@media (max-width: 720px) {
  .navbar {
    padding: 0 14px;
    height: 60px;
    gap: 12px;
  }
  .navbar-logo {
    padding-left: 8px;
  }
  .logo-cn {
    font-size: 17px;
    letter-spacing: 2.5px;
  }
  .logo-en {
    display: none;
  }
  .navbar-links {
    gap: 14px;
    justify-content: flex-end;
  }
  .navbar-links a {
    font-size: var(--font-tiny);
    letter-spacing: 0;
  }
  .navbar-user {
    padding: 4px 8px;
  }
  .user-menu {
    position: fixed;
    right: var(--space-md);
    top: 64px;
  }
}
</style>

<style scoped>
@media (max-width:900px) {
  .navbar { height:auto; min-height:88px; padding:16px 16px 8px; flex-direction:column; align-items:flex-start; gap:12px; }
  .navbar-logo { padding-left:8px; }
  .logo-cn { font-size:19px; letter-spacing:3px; }
  .logo-en { display:none; }
  .navbar-links { width:100%; overflow:visible; flex-wrap:wrap; justify-content:flex-start; gap:4px 20px; }
  .navbar-links a { font-size:12px; letter-spacing:0; padding:5px 0; }
  .navbar-user-wrap { position:absolute; right:48px; top:12px; max-width:44%; }
  .navbar-user { display:block; max-width:100%; overflow:hidden; text-overflow:ellipsis; padding:3px 9px; }
  .nav-lamp { position:absolute; right:17px; top:17px; }
  .user-menu { position:absolute; top:calc(100% + 8px); right:12px; }
}
</style>
