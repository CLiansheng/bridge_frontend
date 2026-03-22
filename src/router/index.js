import { createRouter, createWebHistory } from 'vue-router'

// 导入所有视图组件
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Detection from '../views/Detection.vue'
import History from '../views/History.vue'
import System from '../views/System.vue'
import Show from '../views/Show.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 访问根目录时，默认重定向到登录页
      path: '/',
      name: 'show',
      component: Show,
      meta: { title: 'SPANS | 初始化系统' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: '系统登录 | SPANS SYSTEM' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Home,
      meta: { title: '主页概览 | SPANS SYSTEM' }
    },
    {
      path: '/diagnose',
      name: 'diagnose',
      component: Detection,
      meta: { title: '智能诊断 | SPANS SYSTEM' }
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: { title: '历史档案 | SPANS SYSTEM' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: System,
      meta: { title: '系统配置 | SPANS SYSTEM' }
    }
  ]
})

// 路由守卫：动态修改网页标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router