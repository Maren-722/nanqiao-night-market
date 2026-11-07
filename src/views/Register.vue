<template>
  <div class="register-page">
    <NavBar />
    <div class="register-container">
      <BackBar label="返回登录" fallback="/login" />
      <h1 class="register-title">注册新用户</h1>
      <p class="register-subtitle">注册后可以发帖、评论、写手记</p>

      <div class="form-group">
        <label class="form-label">用户名</label>
        <input
          type="text"
          class="form-input"
          v-model="username"
          placeholder="请输入用户名"
          @keyup.enter="handleRegister"
        >
      </div>
      <div class="form-group">
        <label class="form-label">密码</label>
        <input
          type="password"
          class="form-input"
          v-model="password"
          placeholder="请输入密码"
          @keyup.enter="handleRegister"
        >
      </div>

      <button class="btn btn-primary btn-block" @click="handleRegister">注 册</button>
      <div class="register-error" v-if="errorMsg">{{ errorMsg }}</div>
      <p class="login-link">已有账号？<router-link to="/login">去登录</router-link></p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import BackBar from '../components/BackBar.vue'
import { isReservedId, generateVisitorUid, readCustomAccounts } from '../utils/auth'

const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')

function handleRegister() {
  const uname = username.value.trim()
  const pwd = password.value.trim()

  if (!uname || !pwd) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  // 与剧情账号冲突：剧情账号名（陈伯等）和剧情ID（A1、M1、C+数字等）都是保留字
  if (isReservedId(uname)) {
    errorMsg.value = '这个名字已被占用，请换一个'
    return
  }
  const custom = readCustomAccounts()
  // 与其他玩家冲突：用户名重复，或撞上别人分配到的 ID
  const uidTaken = Object.keys(custom).some(n => String(custom[n].uid || '').toLowerCase() === uname.toLowerCase())
  if (custom[uname] || uidTaken) {
    errorMsg.value = '这个名字已被占用，请换一个'
    return
  }

  // 注册玩家是食客：自动分配「C + 数字」ID（论坛发言旁会显示，登录时用户名或ID都可用）
  const uid = generateVisitorUid()
  custom[uname] = { password: pwd, shopName: uname, uid }
  localStorage.setItem('nq_custom_accounts', JSON.stringify(custom))

  // 注册成功即自动登录
  localStorage.setItem('nq_user', JSON.stringify({ username: uname, shopName: uname, role: 'customer' }))
  window.dispatchEvent(new CustomEvent('nq-user-changed'))
  router.push('/home')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.register-container {
  position: relative;
  max-width: 400px;
  width: 100%;
  margin: 64px auto;
  background: var(--color-card);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  padding: 44px 40px 36px;
  flex: 1;
  box-shadow: var(--shadow-lift);
  overflow: hidden;
}
.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--amber), var(--color-accent));
}
.register-title {
  font-family: var(--font-title);
  font-size: 30px;
  letter-spacing: 5px;
  text-align: center;
  margin-bottom: var(--space-sm);
}
.register-subtitle {
  font-size: var(--font-small);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--space-xl);
}
.form-group {
  margin-bottom: var(--space-md);
}
.register-error {
  color: var(--color-danger);
  font-size: var(--font-small);
  margin-top: var(--space-md);
  text-align: center;
}
.login-link {
  margin-top: var(--space-md);
  font-size: var(--font-small);
  color: var(--color-text-secondary);
  text-align: center;
}
/* 醒目标志：链接文字加下划线 */
.login-link a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}

@media (max-width: 720px) {
  .register-container {
    margin: 24px auto;
    padding: var(--space-lg);
  }
}
</style>
