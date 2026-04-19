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
      meta: { title: '桥曈 | 桥梁病害诊断系统' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: '系统登录 | 桥曈' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Home,
      meta: { title: '首页 | 桥曈' }
    },
    {
      path: '/diagnose',
      name: 'diagnose',
      component: Detection,
      meta: { title: '智能诊断 | 桥曈' }
    },
    {
      path: '/history',
      name: 'history',
      component: History,
      meta: { title: '历史档案 | 桥曈' }
    },
    {
      path: '/profile',
      name: 'profile',
      component: System,
      meta: { title: '用户资料 | 桥曈' }
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