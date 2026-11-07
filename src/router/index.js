import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'intro',
    component: () => import('../views/Intro.vue'),
    meta: { title: '前情提要', hideNav: true }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { title: '南桥夜市官网' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { title: '账号登录' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册新用户' }
  },
  {
    path: '/stalls',
    name: 'stalls',
    component: () => import('../views/Stalls.vue'),
    meta: { title: '夜市导览' }
  },
  {
    path: '/stalls/:id',
    name: 'stall-detail',
    component: () => import('../views/StallDetail.vue'),
    meta: { title: '摊位详情' }
  },
  {
    path: '/forum',
    name: 'forum',
    component: () => import('../views/Forum.vue'),
    meta: { title: '夜市论坛' }
  },
  {
    path: '/forum/:id',
    name: 'post-detail',
    component: () => import('../views/PostDetail.vue'),
    meta: { title: '帖子详情' }
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('../views/Messages.vue'),
    meta: { title: '短信', requiresAuth: true }
  },
  {
    path: '/manager',
    name: 'manager',
    component: () => import('../views/Manager.vue'),
    meta: { title: '管理处工作台', requiresAuth: true, requiresManager: true }
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../views/Notes.vue'),
    meta: { title: '我的手记', requiresAuth: true }
  },
  {
    path: '/ending',
    name: 'ending',
    component: () => import('../views/Ending.vue'),
    meta: { title: '结局' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫：登录后才能访问的页面；工作台仅管理员账号可进
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('nq_user')) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresManager) {
    try {
      const user = JSON.parse(localStorage.getItem('nq_user') || 'null')
      if (user?.role !== 'manager') return { name: 'home' }
    } catch {
      return { name: 'home' }
    }
  }
  document.title = to.meta.title || '南桥夜市'
  return true
})

export default router
