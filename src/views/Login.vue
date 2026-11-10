<template>
  <div class="login-page">
    <NavBar />
    <div class="login-container">
      <BackBar label="返回首页" fallback="/home" />
      <h1 class="login-title">账号登录</h1>
      <p class="login-subtitle">登录后可查看私信、手记和管理店铺信息</p>

      <div class="form-group">
        <label class="form-label">ID</label>
        <input
          type="text"
          class="form-input"
          v-model="username"
          placeholder="摊主为摊位号，食客为C+数字"
          @keyup.enter="handleLogin"
        >
      </div>
      <div class="form-group">
        <label class="form-label">密码</label>
        <input
          type="password"
          class="form-input"
          v-model="password"
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        >
      </div>

      <button class="btn btn-primary btn-block" @click="handleLogin">登 录</button>
      <div class="login-error" v-if="errorMsg">{{ errorMsg }}</div>
      <p class="register-link">还没有账号？<router-link to="/register">注册新用户</router-link></p>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'
import BackBar from '../components/BackBar.vue'
import { matchLogin } from '../utils/auth'

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const errorMsg = ref('')

// 登录逻辑：统一走 matchLogin——
// 剧情账号：ID（摊主=摊位号 / 管理处=M1 / 食客=C+数字）或账号名均可登录
// 玩家注册的账号：用户名或分配到的 C+数字ID 均可登录
function handleLogin() {
  const id = username.value.trim()
  const pwd = password.value.trim()

  if (!id || !pwd) {
    errorMsg.value = '请输入ID和密码'
    return
  }

  const result = matchLogin(id, pwd)
  if (result && result.ok) {
    errorMsg.value = ''
    localStorage.setItem('nq_user', JSON.stringify({
      username: result.username,
      shopName: result.shopName,
      role: result.role
    }))
    window.dispatchEvent(new CustomEvent('nq-user-changed'))
    // 管理员账号登录后直接进工作台
    router.push(route.query.redirect || (result.role === 'manager' ? '/manager' : '/messages'))
  } else {
    errorMsg.value = 'ID或密码错误，请重试'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.login-container {
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
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--amber), var(--color-accent));
}
.login-title {
  font-family: var(--font-title);
  font-size: 30px;
  letter-spacing: 5px;
  text-align: center;
  margin-bottom: var(--space-sm);
}
.login-subtitle {
  font-size: var(--font-small);
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--space-xl);
}
.form-group {
  margin-bottom: var(--space-md);
}
.login-error {
  color: var(--color-danger);
  font-size: var(--font-small);
  margin-top: var(--space-md);
  text-align: center;
}
.register-link {
  margin-top: var(--space-md);
  font-size: var(--font-small);
  color: var(--color-text-secondary);
  text-align: center;
}
/* 醒目标志：链接文字加下划线 */
.register-link a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
}

@media (max-width: 720px) {
  .login-container {
    margin: 24px auto;
    padding: var(--space-lg);
  }
}
</style>
